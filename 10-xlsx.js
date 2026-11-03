/* ============================== tiny XLSX / CSV reader ============================== */
function readZip(buf){
  var dv=new DataView(buf),u8=new Uint8Array(buf);var eocd=-1;for(var i=u8.length-22;i>=Math.max(0,u8.length-66000);i--){if(dv.getUint32(i,true)===0x06054b50){eocd=i;break;}}
  if(eocd<0)throw new Error("Not a valid .xlsx file");
  var cnt=dv.getUint16(eocd+10,true),off=dv.getUint32(eocd+16,true),files={};
  for(var n=0;n<cnt;n++){if(dv.getUint32(off,true)!==0x02014b50)break;var method=dv.getUint16(off+10,true),csize=dv.getUint32(off+20,true),nlen=dv.getUint16(off+28,true),elen=dv.getUint16(off+30,true),clen=dv.getUint16(off+32,true),loff=dv.getUint32(off+42,true);
    var name=new TextDecoder().decode(u8.subarray(off+46,off+46+nlen));files[name]={method:method,csize:csize,loff:loff};off+=46+nlen+elen+clen;}
  return {files:files,get:function(name){var f=files[name];if(!f)return Promise.resolve(null);var l=f.loff;var nl=dv.getUint16(l+26,true),el=dv.getUint16(l+28,true);var data=u8.subarray(l+30+nl+el,l+30+nl+el+f.csize);
    if(f.method===0)return Promise.resolve(new TextDecoder().decode(data));
    var ds=new DecompressionStream("deflate-raw");var s=new Blob([data]).stream().pipeThrough(ds);return new Response(s).text();}};
}
function colIdx(ref){var m=/^([A-Z]+)/.exec(ref);var s=m?m[1]:"A",n=0;for(var i=0;i<s.length;i++)n=n*26+(s.charCodeAt(i)-64);return n-1;}
function readXlsx(buf){
  var z=readZip(buf);var parse=function(t){return new DOMParser().parseFromString(t,"application/xml");};
  return Promise.all([z.get("xl/workbook.xml"),z.get("xl/_rels/workbook.xml.rels"),z.get("xl/sharedStrings.xml")]).then(function(r){
    var wb=parse(r[0]),rels=parse(r[1]);var ss=[];if(r[2]){var sx=parse(r[2]);Array.prototype.forEach.call(sx.getElementsByTagName("si"),function(si){ss.push(Array.prototype.map.call(si.getElementsByTagName("t"),function(t){return t.textContent;}).join(""));});}
    var relMap={};Array.prototype.forEach.call(rels.getElementsByTagName("Relationship"),function(x){relMap[x.getAttribute("Id")]=x.getAttribute("Target");});
    var sheets=Array.prototype.map.call(wb.getElementsByTagName("sheet"),function(s){var rid=s.getAttribute("r:id")||s.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships","id");var tgt=relMap[rid]||"";tgt=tgt.replace(/^\/?(xl\/)?/,"xl/");return {name:s.getAttribute("name"),path:tgt};});
    return Promise.all(sheets.map(function(s){return z.get(s.path).then(function(t){if(!t)return {name:s.name,rows:[]};var x=parse(t);var rows=[];
      Array.prototype.forEach.call(x.getElementsByTagName("row"),function(row){var out=[];Array.prototype.forEach.call(row.getElementsByTagName("c"),function(c){var ty=c.getAttribute("t"),v=c.getElementsByTagName("v")[0],val=null;
        if(ty==="s"&&v)val=ss[+v.textContent];else if(ty==="inlineStr"){var is=c.getElementsByTagName("t");val=Array.prototype.map.call(is,function(t){return t.textContent;}).join("");}else if(v)val=ty==="str"||ty==="b"?v.textContent:(isNaN(+v.textContent)?v.textContent:+v.textContent);
        out[colIdx(c.getAttribute("r")||"A")]=val;});rows[(+row.getAttribute("r")||rows.length+1)-1]=out;});
      return {name:s.name,rows:rows.map(function(r){return r||[];})};});}));
  });
}
function readCsv(text){var rows=[],row=[],cell="",q=false;text=text.replace(/^﻿/,"");for(var i=0;i<text.length;i++){var c=text[i];if(q){if(c==='"'){if(text[i+1]==='"'){cell+='"';i++;}else q=false;}else cell+=c;}else if(c==='"')q=true;else if(c===","){row.push(cell);cell="";}else if(c==="\n"||c==="\r"){if(c==="\r"&&text[i+1]==="\n")i++;row.push(cell);rows.push(row);row=[];cell="";}else cell+=c;}if(cell||row.length){row.push(cell);rows.push(row);}return [{name:"CSV",rows:rows}];}
