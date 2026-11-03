/* ============================== series info, components, data sheets ============================== */
function seriesOf(p){return p&&A.series[p.imageSet]||null;}
var COMP_ORDER=["Base unit (processor / graphics)","Processor","Graphics","Memory","Storage","Optical drive","Display","Battery","Power","Wireless","Networking","Connectivity","Camera","Keyboard & mouse","Security","Operating system","Warranty & services","Other (labels, packaging, localisation)"];
function compGroups(p){var g={};(p.components||[]).forEach(function(c){(g[c.cat]=g[c.cat]||[]).push(c);});return COMP_ORDER.filter(function(k){return g[k];}).map(function(k){return [k,g[k]];});}
function specSourcesHtml(p){var s=(p.specSources||[]);if(!s.length)return "";
  return '<div class="panel-b small muted" style="border-top:1px solid var(--line)"><b>Where these specs come from.</b> Price-list fields: '+esc(p.specSource||"IONTECH price list")+'.<ul style="margin:4px 0 0;padding-left:18px">'+s.map(function(x){return '<li>'+esc(x.fields.map(function(f){return SPEC_LABEL[f]||f;}).join(", "))+' — '+esc(x.source)+'</li>';}).join("")+'</ul></div>';}
function featuresPanel(p){var s=seriesOf(p);if(!s)return "";
  var has=(s.overview||(s.ksp||[]).length||(s.features||[]).length);
  if(!has&&!s.note)return "";
  return '<section class="panel"><div class="panel-h"><h2>Key features</h2><span class="small muted">'+esc(p.family)+' series</span></div><div class="panel-b" style="display:grid;gap:10px">'+
    (s.overview?'<div><b>'+esc(s.overview.h)+'</b><p class="small" style="margin:4px 0 0">'+esc(s.overview.t)+'</p></div>':'')+
    ((s.ksp||[]).length?'<div class="feat-grid">'+s.ksp.map(function(k){return '<div class="feat"><b>'+esc(k.h)+'</b><span>'+esc(k.t)+'</span></div>';}).join("")+'</div>':'')+
    ((s.features||[]).length?'<details><summary class="small"><b>All '+s.features.length+' feature messages</b></summary><ul class="small" style="margin:6px 0 0;padding-left:18px">'+s.features.map(function(f){return '<li><b>'+esc(f.h)+'.</b> '+esc(f.t)+'</li>';}).join("")+'</ul></details>':'')+
    (s.note?'<p class="small muted" style="margin:0">'+esc(s.note)+'</p>':'')+
    '<p class="small muted" style="margin:0">Series-level features; some are optional and depend on configuration.'+(A.isAdmin?' Source: '+esc(s.source||s.platformSource||"—")+'.':'')+'</p></div></section>';}
function componentsPanel(p){var g=compGroups(p);if(!g.length)return "";var showAll=!!A.compAll;var noPn=!(p.components||[]).some(function(c){return c.pn;});
  if(noPn&&!A.compOpen)return '<section class="panel"><div class="panel-h"><h2>HP configuration</h2><div class="btn-row"><span class="small muted">'+(p.components||[]).length+' factory configuration lines</span><button class="btn btn-sm" data-act="comp-open">Show</button></div></div></section>';
  var rows=g.filter(function(x){return showAll||x[0].indexOf("Other")!==0;});var hidden=g.filter(function(x){return x[0].indexOf("Other")===0;}).reduce(function(a,x){return a+x[1].length;},0);
  return '<section class="panel"><div class="panel-h"><h2>'+(noPn?"HP configuration":"Components")+'</h2><div class="btn-row">'+(noPn?'<button class="btn btn-sm btn-quiet" data-act="comp-open">Hide</button>':'')+'<span class="small muted">'+(p.components||[]).length+(noPn?' lines':' parts')+' · factory configuration</span><button class="btn btn-sm" data-act="comp-copy" data-id="'+p.id+'">'+ICON.copy+'Copy</button></div></div><div class="tbl-wrap"><table class="tbl comp-tbl"><thead><tr><th style="width:'+(noPn?170:130)+'px">'+(noPn?"Item":"Part no.")+'</th><th>Description</th></tr></thead>'+
    rows.map(function(x){return '<tbody><tr class="grp"><th colspan="2">'+esc(x[0])+'</th></tr>'+x[1].map(function(c){return '<tr><td>'+(noPn?'<span class="small">'+esc(c.label||"—")+'</span>':'<span class="sku">'+esc(c.pn||"—")+'</span>')+'</td><td class="small">'+esc(c.desc)+'</td></tr>';}).join("")+'</tbody>';}).join("")+'</table></div>'+
    (hidden?'<div class="panel-b small"><button class="btn btn-quiet btn-sm" data-act="comp-all">'+(showAll?"Hide":"Show")+' '+hidden+' label, packaging and localisation lines</button></div>':'')+
    '<div class="panel-b small muted" style="border-top:1px solid var(--line)">'+(noPn?(A.isAdmin?'From the '+esc(p.componentsSheet||"BNB price guide")+' (HP configuration lines). ':'')+'HP factory configuration for this exact SKU.':(A.isAdmin?'From '+esc(p.componentsSheet?"the "+p.componentsSheet+" sheet of the ":"the ")+'IONTECH price list (Oct 2026). ':'')+'Part numbers are HP option/AV codes for this exact SKU.')+'</div></section>';}
function componentsText(p){return [p.name,"SKU: "+p.sku,"Components (factory configuration):"].concat(compGroups(p).map(function(x){return "\n"+x[0]+"\n"+x[1].map(function(c){return "  "+(c.pn||c.label||"—")+"  "+c.desc;}).join("\n");})).join("\n");}

/* ---------- PDF data sheet ---------- */
function jpegInfo(u8){var i=2;while(i<u8.length){if(u8[i]!==0xFF){i++;continue;}var m=u8[i+1];if(m===0xD8||m===0x01||(m>=0xD0&&m<=0xD7)){i+=2;continue;}var len=(u8[i+2]<<8)|u8[i+3];
  if(m>=0xC0&&m<=0xCF&&m!==0xC4&&m!==0xC8&&m!==0xCC)return {h:(u8[i+5]<<8)|u8[i+6],w:(u8[i+7]<<8)|u8[i+8],c:u8[i+9]};i+=2+len;}return null;}
function loadJpeg(id){return fetch("/_blob/"+id).then(function(r){if(!r.ok)throw new Error("image "+r.status);return r.arrayBuffer();}).then(function(b){var u8=new Uint8Array(b);var info=jpegInfo(u8);if(!info||u8[0]!==0xFF||u8[1]!==0xD8)throw new Error("not a JPEG");var bin="";for(var k=0;k<u8.length;k+=8192)bin+=String.fromCharCode.apply(null,u8.subarray(k,k+8192));info.bin=bin;return info;});}
function datasheetPdf(p,withPrice){
  var imgs=imgOf(p);
  return (imgs.length?loadJpeg(imgs[0].id).catch(function(){return null;}):Promise.resolve(null)).then(function(img){
    var d=new PDF(),L=40,R=555,y=46,s=seriesOf(p),sp=p.specs||{};
    function need(h){if(y+h>782){d.addPage();y=50;}}
    function section(t){need(40);y+=6;d.rect(L,y-10,R-L,16,NAVY);d.text(L+6,y+1,t.toUpperCase(),{size:8,bold:true,color:[255,255,255]});y+=16;}
    y=pdfLetterhead(d,"PRODUCT DATA SHEET","Issued "+fmtDate(today())+(S("website")?"  |  "+S("website"):""));
    d.line(L,y,R,y,[200,208,218]);y+=20;
    wrapText(p.name,R-L,15,true).forEach(function(l){d.text(L,y,l,{size:15,bold:true,color:NAVY});y+=18;});
    d.text(L,y,"SKU "+p.sku+"   ·   "+(p.family||"")+"   ·   "+(CATS[p.cat]||""),{size:9,color:GRAY});y+=16;
    var top=y,iw=205,ih=170,rx=L+iw+20,rw=R-rx;
    d.rect(L,top,iw,ih,[244,246,249]);
    if(img){var sc=Math.min((iw-16)/img.w,(ih-16)/img.h);var w=img.w*sc,h=img.h*sc;d.image(img.bin,img.w,img.h,img.c,L+(iw-w)/2,top+(ih-h)/2,w,h);}
    else{d.text(L+iw/2,top+ih/2,"Image not available",{size:8,color:GRAY,align:"center"});}
    d.text(L,top+ih+10,img?((imgs[0].view?imgs[0].view+" view · ":"")+"Representative "+(p.family||"")+" image"):"",{size:6.5,color:GRAY});
    var ry=top+4;
    if(s&&s.overview){wrapText(s.overview.h,rw,11,true).forEach(function(l){d.text(rx,ry,l,{size:11,bold:true,color:NAVY});ry+=13;});ry+=2;wrapText(s.overview.t,rw,8).slice(0,6).forEach(function(l){d.text(rx,ry,l,{size:8,color:GRAY});ry+=10;});ry+=6;}
    else if(p.desc){wrapText(p.desc,rw,9).forEach(function(l){d.text(rx,ry,l,{size:9,color:GRAY});ry+=11;});ry+=6;}
    d.text(rx,ry,"KEY SPECIFICATIONS",{size:7.5,bold:true,color:BLUE});ry+=11;
    [["Processor",sp.processor],["Memory",sp.memory],["Storage",sp.storage],["Graphics",[sp.graphics,sp.vram&&!/shared/i.test(sp.vram)?sp.vram:""].filter(Boolean).join(", ")],["Display",[sp.screen,sp.display].filter(Boolean).join(" ")],["OS",sp.os],["Wireless",sp.wifi],["Warranty",sp.warranty]].filter(function(r){return r[1];}).forEach(function(r){var lines=wrapText(r[1],rw-62,8);d.text(rx,ry,r[0],{size:8,bold:true});lines.slice(0,2).forEach(function(l,j){d.text(rx+62,ry+j*10,l,{size:8});});ry+=Math.min(2,lines.length)*10+2;});
    if(withPrice){var pr=sellPrice(p.id),rec=priceRec(p.id)||{};if(pr){ry+=4;d.rect(rx,ry-9,rw,30,[231,241,251]);d.text(rx+8,ry+2,PTYPES[pr.type]+(S("pricesIncludeVat")?" (VAT inclusive)":""),{size:7.5,color:GRAY});d.text(rx+8,ry+15,pesoTxt(pr.amount),{size:12,bold:true,color:NAVY});d.text(R-8,ry+15,"As of "+fmtDate(rec.verifiedAt||today())+" · subject to change",{size:7,color:GRAY,align:"right"});ry+=34;}}
    y=Math.max(top+ih+22,ry+8);
    section("Specifications");
    SPEC_GROUPS.forEach(function(g){var rows=g[1].filter(function(k){return sp[k[0]];});if(!rows.length)return;need(30);
      d.rect(L,y-8,R-L,13,[238,241,245]);d.text(L+5,y+1,g[0].toUpperCase(),{size:7,bold:true,color:GRAY});y+=14;
      rows.forEach(function(k){var lines=wrapText(sp[k[0]],R-L-150,8);var h=lines.length*10+3;need(h);d.text(L+5,y,k[1],{size:8,bold:true});lines.forEach(function(l,j){d.text(L+150,y+j*10,l,{size:8});});y+=h;d.line(L,y-6,R,y-6,[232,236,241]);});
      y+=3;});
    var feats=s?(s.ksp||[]).concat((s.features||[]).slice(0,8)):[];
    if(feats.length){section("Key features");feats.forEach(function(f){var lines=wrapText(f.t,R-L-10,7.5);need(12+lines.length*9.5);d.text(L+5,y,f.h,{size:8,bold:true,color:NAVY});y+=10;lines.forEach(function(l){d.text(L+5,y,l,{size:7.5,color:GRAY});y+=9.5;});y+=4;});
      need(14);wrapText("Series-level features; some are optional and depend on configuration.",R-L,7).forEach(function(l){d.text(L+5,y,l,{size:7,color:GRAY});y+=9;});}
    var cg=compGroups(p);
    if(cg.length){section("Components (factory configuration)");d.text(L+5,y,"Part no.",{size:7.5,bold:true,color:GRAY});d.text(L+110,y,"Description",{size:7.5,bold:true,color:GRAY});y+=11;
      cg.forEach(function(x){need(24);d.text(L+5,y,x[0],{size:7.5,bold:true,color:BLUE});y+=10;x[1].forEach(function(c){var lines=wrapText(c.desc,R-L-115,7.5);need(lines.length*9.5+2);d.text(L+5,y,c.pn||"—",{size:7.5});lines.forEach(function(l,j){d.text(L+110,y+j*9.5,l,{size:7.5});});y+=lines.length*9.5+2;});y+=3;});}
    y+=4;wrapText("Specifications are provided for reference and are subject to change without notice. Confirm the exact configuration, availability and pricing with "+S("companyName")+" before ordering. HP and the HP logo are trademarks of HP Inc.; other trademarks belong to their respective owners.",R-L-10,7).forEach(function(l){need(9);d.text(L+5,y,l,{size:7,color:GRAY});y+=9;});
    pdfFooter(d,S("companyName")+" · "+p.sku+" data sheet · "+fmtDate(today()));
    return d.output();
  });
}
function dsName(p,withPrice){return ("HP "+p.name.replace(/^HP\s+/,"")+" "+p.sku+" Data Sheet"+(withPrice?" (with price)":"")).replace(/[\\/:*?"<>|#]/g," ").replace(/\s+/g," ").trim()+".pdf";}
function downloadDatasheet(id,withPrice){var p=P(id);if(!p)return;toast("Preparing data sheet…");
  return datasheetPdf(p,withPrice).then(function(b){logEvent("datasheet",{pid:id});return saveFile(dsName(p,withPrice),b);}).catch(function(e){console.error(e);toast("Couldn’t build the data sheet",true);});}
function dsMenu(anchor,id){popMenu(anchor,[["Data sheet (PDF)",function(){downloadDatasheet(id,false);}],["Data sheet with selling price (PDF)",function(){downloadDatasheet(id,true);}]]);}
