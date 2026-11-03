/* ============================== minimal PDF writer (Helvetica, WinAnsi) ============================== */
var HW=[278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584];
var HBW=[278,333,474,556,556,889,722,238,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,333,333,584,584,584,611,975,722,722,722,722,667,611,778,722,278,556,722,611,833,722,778,667,778,722,667,611,722,667,944,667,667,611,333,278,333,584,556,333,556,611,556,611,556,333,611,611,278,278,556,278,889,611,611,611,611,389,556,333,611,556,778,556,556,500,389,280,389,584];
var WIN={"€":128,"‚":130,"…":133,"‘":145,"’":146,"“":147,"”":148,"•":149,"–":150,"—":151,"×":215,"·":183," ":32};
function pdfSafe(s){return String(s==null?"":s).replace(/₱\s?/g,"PHP ").replace(/≥/g,">=").replace(/≤/g,"<=").replace(/✓/g,"Y").replace(/✗/g,"X").replace(/→/g,"->").replace(/↑/g,"^").replace(/−/g,"-");}
function charCode(c){var n=c.charCodeAt(0);if(n>=32&&n<127)return n;if(WIN[c])return WIN[c];if(n>=160&&n<256)return n;return 63;}
function textW(s,size,bold){s=pdfSafe(s);var t=bold?HBW:HW,w=0;for(var i=0;i<s.length;i++){var n=charCode(s[i]);w+=(n>=32&&n<127)?t[n-32]:556;}return w*size/1000;}
function wrapText(s,maxW,size,bold){var out=[];String(s==null?"":s).split("\n").forEach(function(par){var words=pdfSafe(par).split(/\s+/),line="";words.forEach(function(w){var test=line?line+" "+w:w;if(textW(test,size,bold)<=maxW||!line)line=test;else{out.push(line);line=w;}while(textW(line,size,bold)>maxW&&line.length>1){var cut=line.length-1;while(cut>1&&textW(line.slice(0,cut),size,bold)>maxW)cut--;out.push(line.slice(0,cut));line=line.slice(cut);}});out.push(line);});return out;}
function PDF(){this.W=595.28;this.H=841.89;this.pages=[];this.addPage();}
PDF.prototype.image=function(bin,iw,ih,comps,x,y,w,h){this.imgs=this.imgs||[];var name="Im"+(this.imgs.length+1);this.imgs.push({bin:bin,w:iw,h:ih,cs:comps===1?"/DeviceGray":comps===4?"/DeviceCMYK":"/DeviceRGB",name:name});this.p.ops.push("q "+w.toFixed(2)+" 0 0 "+h.toFixed(2)+" "+x.toFixed(2)+" "+(this.H-y-h).toFixed(2)+" cm /"+name+" Do Q");};
PDF.prototype.addPage=function(w,h){if(w){this.W=w;this.H=h;}this.p={ops:[],W:this.W,H:this.H};this.pages.push(this.p);return this;};
PDF.prototype.enc=function(s){s=pdfSafe(s);var o="";for(var i=0;i<s.length;i++){var n=charCode(s[i]);var ch=String.fromCharCode(n);if(ch==="("||ch===")"||ch==="\\")o+="\\"+ch;else o+=ch;}return o;};
PDF.prototype.rgb=function(c){return (c||[0,0,0]).map(function(v){return (v/255).toFixed(3);}).join(" ");};
PDF.prototype.text=function(x,y,s,o){o=o||{};var size=o.size||9,bold=!!o.bold;var w=textW(s,size,bold);if(o.align==="right")x-=w;else if(o.align==="center")x-=w/2;
  this.p.ops.push("BT /"+(bold?"F2":"F1")+" "+size+" Tf "+this.rgb(o.color||[20,32,46])+" rg "+x.toFixed(2)+" "+(this.H-y).toFixed(2)+" Td ("+this.enc(s)+") Tj ET");return w;};
PDF.prototype.rect=function(x,y,w,h,fill){this.p.ops.push(this.rgb(fill)+" rg "+x.toFixed(2)+" "+(this.H-y-h).toFixed(2)+" "+w.toFixed(2)+" "+h.toFixed(2)+" re f");};
PDF.prototype.line=function(x1,y1,x2,y2,c,w){this.p.ops.push(this.rgb(c||[223,228,234])+" RG "+(w||0.6)+" w "+x1.toFixed(2)+" "+(this.H-y1).toFixed(2)+" m "+x2.toFixed(2)+" "+(this.H-y2).toFixed(2)+" l S");};
PDF.prototype.output=function(){
  var objs=[],self=this;function add(s){objs.push(s);return objs.length;}
  var cat=add(""),pages=add(""),f1=add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>"),f2=add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
  var xo="";(this.imgs||[]).forEach(function(im){var n=add("<< /Type /XObject /Subtype /Image /Width "+im.w+" /Height "+im.h+" /ColorSpace "+im.cs+" /BitsPerComponent 8 /Filter /DCTDecode /Length "+im.bin.length+" >>\nstream\n"+im.bin+"\nendstream");xo+="/"+im.name+" "+n+" 0 R ";});
  var kids=[];this.pages.forEach(function(pg){var content=pg.ops.join("\n");var cs=add("<< /Length "+content.length+" >>\nstream\n"+content+"\nendstream");var po=add("<< /Type /Page /Parent "+pages+" 0 R /MediaBox [0 0 "+(pg.W||self.W).toFixed(2)+" "+(pg.H||self.H).toFixed(2)+"] /Resources << /Font << /F1 "+f1+" 0 R /F2 "+f2+" 0 R >>"+(xo?" /XObject << "+xo+">>":"")+" >> /Contents "+cs+" 0 R >>");kids.push(po+" 0 R");});
  objs[cat-1]="<< /Type /Catalog /Pages "+pages+" 0 R >>";objs[pages-1]="<< /Type /Pages /Kids ["+kids.join(" ")+"] /Count "+kids.length+" >>";
  var out="%PDF-1.4\n%âãÏÓ\n",offs=[];objs.forEach(function(o,i){offs.push(out.length);out+=(i+1)+" 0 obj\n"+o+"\nendobj\n";});
  var x=out.length;out+="xref\n0 "+(objs.length+1)+"\n0000000000 65535 f \n"+offs.map(function(o){return ("0000000000"+o).slice(-10)+" 00000 n \n";}).join("")+"trailer\n<< /Size "+(objs.length+1)+" /Root "+cat+" 0 R >>\nstartxref\n"+x+"\n%%EOF";
  var b=new Uint8Array(out.length);for(var i=0;i<out.length;i++)b[i]=out.charCodeAt(i)&255;return new Blob([b],{type:"application/pdf"});
};
var NAVY=[11,31,58],BLUE=[0,99,184],GRAY=[91,104,120],RED=[214,0,36];
var LOGO_BIN={};function logoBin(k){if(LOGO_BIN[k]!==undefined)return LOGO_BIN[k];try{var bin=atob(LOGO_JPG[k]);var u8=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)u8[i]=bin.charCodeAt(i);var info=jpegInfo(u8);if(info)info.bin=bin;LOGO_BIN[k]=info||null;}catch(e){LOGO_BIN[k]=null;}return LOGO_BIN[k];}
function pdfLogo(d,k,x,y,size){var l=logoBin(k);if(!l)return 0;d.image(l.bin,l.w,l.h,l.c,x,y,size,size);return size;}
/* co-branded letterhead: Iontech logo + name on the left, HP logo + document title on the right; returns next y */
function pdfLetterhead(d,title,sub){var L=40,R=555,y=30;
  d.rect(0,0,d.W*0.62,5,RED);d.rect(d.W*0.62,0,d.W*0.38,5,BLUE);
  var lw=pdfLogo(d,"iontech",L,y,40);var tx=L+(lw?50:0);
  d.text(tx,y+17,S("companyName"),{size:15,bold:true,color:NAVY});
  var info=[S("companyTagline")||"HP Workstations, Business Notebooks & Thin Clients"].filter(Boolean)[0];d.text(tx,y+30,info,{size:8,color:GRAY});
  var hw=pdfLogo(d,"hp",R-30,y+5,30);
  d.text(R-(hw?38:0),y+18,title,{size:13,bold:true,color:BLUE,align:"right"});
  if(sub)d.text(R-(hw?38:0),y+30,sub,{size:7.5,color:GRAY,align:"right"});
  return y+52;}
function pdfFooter(doc,label){var n=doc.pages.length;doc.pages.forEach(function(pg,i){doc.p=pg;doc.line(40,806,555,806);doc.text(40,818,label,{size:7.5,color:GRAY});doc.text(555,818,"Page "+(i+1)+" of "+n,{size:7.5,color:GRAY,align:"right"});});}
function quotePdf(q){
  var d=new PDF(),t=quoteTotals(q),L=40,R=555;
  var y=pdfLetterhead(d,"QUOTATION","HP Workstations, Business Notebooks & Thin Clients")+4;
  var info=[S("address"),[S("phone"),S("email"),S("website")].filter(Boolean).join("  |  "),S("tin")?"TIN: "+S("tin"):""].filter(Boolean);
  var meta=[["Quotation no.",q.number],["Date",fmtDate(q.date)],["Prepared by",q.rep||""]];if(q.project)meta.push(["Project",q.project]);
  var yy=y;info.forEach(function(s){wrapText(s,300,8.5).forEach(function(l){d.text(L,yy,l,{size:8.5,color:GRAY});yy+=11;});});
  var ym=y;meta.forEach(function(m){d.text(R-160,ym,m[0],{size:8.5,color:GRAY});d.text(R,ym,m[1],{size:8.5,bold:true,align:"right"});ym+=12;});
  y=Math.max(yy,ym)+10;d.line(L,y,R,y,[200,208,218]);y+=16;
  d.text(L,y,"BILL TO",{size:7.5,bold:true,color:GRAY});if(q.delivery)d.text(320,y,"DELIVER TO",{size:7.5,bold:true,color:GRAY});y+=12;
  var cl=[q.client||"",q.contact?"Attn: "+q.contact:"",[q.email,q.phone].filter(Boolean).join("  |  ")].filter(Boolean);var yd=y;
  cl.forEach(function(s,i){wrapText(s,260,i?8.5:10,!i).forEach(function(l){d.text(L,y,l,{size:i?8.5:10,bold:!i});y+=i?11:13;});});
  if(q.delivery)wrapText(q.delivery,230,8.5).forEach(function(l){d.text(320,yd,l,{size:8.5});yd+=11;});
  y=Math.max(y,yd)+10;
  var cols=[[L,22,"#"],[L+22,268,"Description"],[L+290,40,"Qty"],[L+330,90,"Unit price"],[L+420,95,"Amount"]];
  function head(){d.rect(L,y-10,R-L,16,NAVY);cols.forEach(function(c,i){d.text(i>=2?c[0]+c[1]-4:c[0]+4,y+1,c[2],{size:8,bold:true,color:[255,255,255],align:i>=2?"right":"left"});});y+=16;}
  head();
  (q.items||[]).forEach(function(it,i){var lt=t.lines[i];var desc=wrapText(it.name+(it.sku?" ("+it.sku+")":""),260,8.5,true);var spec=it.specs||"";if(it.kind==="product"&&it.warranty!=null)spec=spec.replace(/\s*\|\s*Warranty:[^|]*$/,"");var sp=spec?wrapText(spec,260,7.5):[];var extra=[];if(it.kind==="product"&&it.warranty)extra.push("Warranty: "+it.warranty);var obp=it.kind==="product"?P(it.pid):null;if(obp&&typeof orderBasis==="function"&&orderBasis(obp)&&tatText())extra.push("Order basis — estimated "+tatText()+" TAT; delivery timeline not guaranteed");if(lt.disc)extra.push("Less discount: "+pesoTxt(fromCents(lt.disc)));if(it.bundled)extra.push("Included in bundle");if(it.kind==="custom"&&it.note)extra.push(it.note);
    var h=desc.length*11+sp.length*9.5+extra.length*10+8;
    if(y+h>770){d.addPage();y=50;head();}
    var y0=y;d.text(L+4,y,String(i+1),{size:8.5});desc.forEach(function(l){d.text(L+26,y,l,{size:8.5,bold:true});y+=11;});sp.forEach(function(l){d.text(L+26,y,l,{size:7.5,color:GRAY});y+=9.5;});extra.forEach(function(l){d.text(L+26,y,l,{size:7.5,color:BLUE});y+=10;});
    d.text(L+326,y0,String(it.qty),{size:8.5,align:"right"});d.text(L+416,y0,it.bundled?"Included":pesoTxt(it.unit),{size:8.5,align:"right"});d.text(R-4,y0,pesoTxt(fromCents(lt.gross)),{size:8.5,bold:true,align:"right"});
    y+=4;d.line(L,y-6,R,y-6);y+=4;});
  if(y>680){d.addPage();y=50;}
  y+=6;var tot=[["Subtotal",pesoTxt(fromCents(t.sub))]];if(t.disc)tot.push(["Less: authorized discounts","-"+pesoTxt(fromCents(t.disc))]);
  if(t.rate){if(S("pricesIncludeVat")){tot.push(["VATable sales",pesoTxt(fromCents(t.net))]);tot.push(["VAT ("+t.rate+"%, included)",pesoTxt(fromCents(t.vat))]);}else tot.push(["VAT ("+t.rate+"%)",pesoTxt(fromCents(t.vat))]);}
  tot.forEach(function(r){d.text(R-130,y,r[0],{size:8.5,color:GRAY,align:"right"});d.text(R-4,y,r[1],{size:8.5,align:"right"});y+=13;});
  d.rect(R-250,y-9,250,20,[231,241,251]);d.text(R-130,y+4,"TOTAL"+(S("pricesIncludeVat")?" (VAT inclusive)":""),{size:10,bold:true,align:"right",color:NAVY});d.text(R-4,y+4,pesoTxt(fromCents(t.total)),{size:11,bold:true,align:"right",color:NAVY});y+=34;
  var blocks=[];if(q.payment)blocks.push(["Payment terms",q.payment]);if(q.deliveryTerms)blocks.push(["Delivery terms",q.deliveryTerms]);if(q.notes)blocks.push(["Notes and special conditions",q.notes]);blocks.push(["Terms",S("quoteTerms")]);
  blocks.forEach(function(b){var lines=wrapText(b[1],R-L,8);if(y+14+lines.length*10>790){d.addPage();y=50;}d.text(L,y,b[0],{size:8,bold:true,color:NAVY});y+=11;lines.forEach(function(l){d.text(L,y,l,{size:8,color:GRAY});y+=10;});y+=6;});
  if(y>740){d.addPage();y=50;}y+=24;d.line(L,y,L+180,y,[150,160,170]);d.text(L,y+11,(q.rep||"Sales representative")+", "+S("companyName"),{size:8});var rl=[q.repPosition,q.repPhone].filter(Boolean).join(" · ");if(rl)d.text(L,y+21,rl,{size:7.5,color:GRAY});if(q.behalf&&q.createdBy&&q.createdBy!==q.rep)d.text(L,y+(rl?31:21),"Prepared for "+q.rep+" by "+q.createdBy,{size:7,color:GRAY});d.line(R-180,y,R,y,[150,160,170]);d.text(R-180,y+11,"Conforme (client signature over printed name / date)",{size:8});
  pdfFooter(d,S("companyName")+" · Quotation "+q.number+" · Prices and availability subject to the stated terms");
  return d.output();
}
function comparePdf(ps){
  var m=compareModel(ps.map(function(p){return p.id;}));var d=new PDF(),L=40,R=555,y=50;var lw=120,cw=(R-L-lw)/m.ps.length;
  y=pdfLetterhead(d,"PRODUCT COMPARISON",fmtDate(today()))+6;d.text(L,y,"Prepared "+fmtDate(today())+" · prices "+(S("pricesIncludeVat")?"VAT inclusive":"VAT exclusive")+", subject to change",{size:8,color:GRAY});y+=18;
  function head(){d.rect(L,y-10,R-L,30,NAVY);m.ps.forEach(function(p,i){var x=L+lw+i*cw+4;d.text(x,y+1,p.sku,{size:8.5,bold:true,color:[255,255,255]});wrapText(p.name,cw-8,7).slice(0,1).forEach(function(l){d.text(x,y+12,l,{size:7,color:[200,214,232]});});});y+=28;}
  head();
  m.rows.forEach(function(r){
    if(r.group){if(y>770){d.addPage();y=50;head();}d.rect(L,y-8,R-L,14,[238,241,245]);d.text(L+4,y+2,r.group.toUpperCase(),{size:7.5,bold:true,color:GRAY});y+=16;return;}
    var cells=r.vals.map(function(v){return wrapText(v||"Not listed",cw-8,7.5);});var lab=wrapText(r.label,lw-8,7.5,true);var h=Math.max(lab.length,Math.max.apply(null,cells.map(function(c){return c.length;})))*9.5+(r.best.some(Boolean)?9:0)+4;
    if(y+h>780){d.addPage();y=50;head();}
    cells.forEach(function(c,i){if(r.best[i])d.rect(L+lw+i*cw,y-8,cw,h,[228,244,236]);});
    lab.forEach(function(l,j){d.text(L+4,y+j*9.5,l,{size:7.5,bold:true});});
    cells.forEach(function(c,i){c.forEach(function(l,j){d.text(L+lw+i*cw+4,y+j*9.5,l,{size:7.5,color:r.vals[i]?[20,32,46]:GRAY});});if(r.best[i]&&r.hint)d.text(L+lw+i*cw+4,y+c.length*9.5,r.hint,{size:6.5,bold:true,color:[19,122,72]});});
    y+=h;d.line(L,y-7,R,y-7);});
  var s=compareSummary(m.ps);if(s.length){if(y>700){d.addPage();y=50;}y+=6;d.text(L,y,"Summary",{size:9,bold:true,color:NAVY});y+=12;s.forEach(function(x){d.text(L,y,"• "+x[0]+": "+x[1].sku+" ("+x[2]+")",{size:8});y+=11;});}
  y+=6;wrapText("Specifications are taken from the approved price list. A newer or more expensive model is not automatically better; processors from different families are not ranked. Confirm suitability for the client’s workload.",R-L,7.5).forEach(function(l){d.text(L,y,l,{size:7.5,color:GRAY});y+=9.5;});
  pdfFooter(d,S("companyName")+" · Product comparison · "+fmtDate(today()));
  return d.output();
}
