/* ============================== XLSX writer + full price list workbook ============================== */
var CRC_T=(function(){var t=new Uint32Array(256);for(var n=0;n<256;n++){var c=n;for(var k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t;})();
function crc32(u8){var c=0xFFFFFFFF;for(var i=0;i<u8.length;i++)c=CRC_T[(c^u8[i])&255]^(c>>>8);return (c^0xFFFFFFFF)>>>0;}
function zipStore(files){/* files: [{name, data:Uint8Array}] → Uint8Array (stored, no compression) */
  var enc=new TextEncoder(),parts=[],central=[],off=0;
  files.forEach(function(f){var nm=enc.encode(f.name),d=f.data,crc=crc32(d);
    var h=new DataView(new ArrayBuffer(30));h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);h.setUint16(8,0,true);h.setUint16(10,0,true);h.setUint16(12,0x21,true);h.setUint32(14,crc,true);h.setUint32(18,d.length,true);h.setUint32(22,d.length,true);h.setUint16(26,nm.length,true);h.setUint16(28,0,true);
    parts.push(new Uint8Array(h.buffer),nm,d);
    var c=new DataView(new ArrayBuffer(46));c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x0800,true);c.setUint16(10,0,true);c.setUint16(12,0,true);c.setUint16(14,0x21,true);c.setUint32(16,crc,true);c.setUint32(20,d.length,true);c.setUint32(24,d.length,true);c.setUint16(28,nm.length,true);c.setUint32(42,off,true);
    central.push(new Uint8Array(c.buffer),nm);off+=30+nm.length+d.length;});
  var csize=central.reduce(function(a,x){return a+x.length;},0);
  var e=new DataView(new ArrayBuffer(22));e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,csize,true);e.setUint32(16,off,true);
  var all=parts.concat(central,[new Uint8Array(e.buffer)]);var len=all.reduce(function(a,x){return a+x.length;},0);var out=new Uint8Array(len),p=0;all.forEach(function(x){out.set(x,p);p+=x.length;});return out;}
function xesc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,"");}
function colName(i){var s="";i++;while(i>0){var m=(i-1)%26;s=String.fromCharCode(65+m)+s;i=Math.floor((i-1)/26);}return s;}
function b64bytes(b64){var bin=atob(b64),u=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return u;}
/* sheets: [{name, cols:[widths], rows:[[{v, s}...]], rowHeights:{r:pt}, merges:["B1:H1"], freeze:{row,col}, filter:"A5:K5", logos:true}] */
function buildXlsx(sheets){
  var enc=new TextEncoder(),files=[],ct=['<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="jpeg" ContentType="image/jpeg"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>'];
  var add=function(n,s){files.push({name:n,data:typeof s==="string"?enc.encode(s):s});};
  add("_rels/.rels",'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>');
  add("docProps/core.xml",'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>'+xesc(S("companyName")+" HP price list")+'</dc:title><dc:creator>'+xesc(S("companyName"))+'</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">'+new Date().toISOString().replace(/\.\d+Z$/,"Z")+'</dcterms:created></cp:coreProperties>');
  // styles: 0 default · 1 title · 2 note · 3 header · 4 text wrap · 5 peso · 6 peso selling (bold blue, tinted) · 7 group row · 8 text (sku, mono-ish) · 9 int centered · 10 group row fill-only
  add("xl/styles.xml",'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="1"><numFmt numFmtId="164" formatCode="&quot;₱&quot;#,##0.00"/></numFmts>'+
    '<fonts count="7"><font><sz val="10"/><name val="Arial"/></font><font><b/><sz val="16"/><color rgb="FF0B1F3A"/><name val="Arial"/></font><font><sz val="9"/><color rgb="FF5B6878"/><name val="Arial"/></font><font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Arial"/></font><font><b/><sz val="11"/><color rgb="FF0B1F3A"/><name val="Arial"/></font><font><b/><sz val="10"/><color rgb="FF0063B8"/><name val="Arial"/></font><font><b/><sz val="10"/><color rgb="FFD7001F"/><name val="Arial"/></font></fonts>'+
    '<fills count="5"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF0B1F3A"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFE8F1FB"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF3F6FA"/><bgColor indexed="64"/></patternFill></fill></fills>'+
    '<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left/><right/><top/><bottom style="thin"><color rgb="FFDFE4EA"/></bottom><diagonal/></border></borders>'+
    '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="11">'+
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'+
    '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"><alignment vertical="center"/></xf>'+
    '<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"><alignment vertical="center"/></xf>'+
    '<xf numFmtId="0" fontId="3" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>'+
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>'+
    '<xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment vertical="top"/></xf>'+
    '<xf numFmtId="164" fontId="5" fillId="3" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="top"/></xf>'+
    '<xf numFmtId="0" fontId="4" fillId="4" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="center"/></xf>'+
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="top"/></xf>'+
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="top"/></xf>'+
    '<xf numFmtId="0" fontId="6" fillId="0" borderId="0" xfId="0" applyFont="1"><alignment vertical="center"/></xf>'+
    '</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>');
  var wbSheets="",wbRels="",img=false;
  sheets.forEach(function(sh,si){var n=si+1;
    ct.push('<Override PartName="/xl/worksheets/sheet'+n+'.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>');
    wbSheets+='<sheet name="'+xesc(sh.name.slice(0,31))+'" sheetId="'+n+'" r:id="rId'+n+'"/>';
    wbRels+='<Relationship Id="rId'+n+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet'+n+'.xml"/>';
    var x='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">';
    x+='<sheetViews><sheetView workbookViewId="0"'+(si===0?' tabSelected="1"':'')+' showGridLines="0">'+(sh.freeze?'<pane xSplit="'+sh.freeze.col+'" ySplit="'+sh.freeze.row+'" topLeftCell="'+colName(sh.freeze.col)+(sh.freeze.row+1)+'" activePane="bottomRight" state="frozen"/>':'')+'</sheetView></sheetViews><sheetFormatPr defaultRowHeight="13.5"/>';
    x+='<cols>'+sh.cols.map(function(w,i){return '<col min="'+(i+1)+'" max="'+(i+1)+'" width="'+w+'" customWidth="1"/>';}).join("")+'</cols><sheetData>';
    sh.rows.forEach(function(row,ri){var r=ri+1,ht=sh.rowHeights&&sh.rowHeights[r];
      x+='<row r="'+r+'"'+(ht?' ht="'+ht+'" customHeight="1"':'')+'>';
      row.forEach(function(c,ci){if(c==null)return;var ref=colName(ci)+r,st=c.s?' s="'+c.s+'"':'';
        if(c.v==null||c.v===""){if(c.s)x+='<c r="'+ref+'"'+st+'/>';return;}
        if(typeof c.v==="number"&&isFinite(c.v))x+='<c r="'+ref+'"'+st+'><v>'+c.v+'</v></c>';
        else x+='<c r="'+ref+'"'+st+' t="inlineStr"><is><t xml:space="preserve">'+xesc(c.v)+'</t></is></c>';});
      x+='</row>';});
    x+='</sheetData>'+(sh.filter?'<autoFilter ref="'+sh.filter+'"/>':'')+(sh.merges&&sh.merges.length?'<mergeCells count="'+sh.merges.length+'">'+sh.merges.map(function(m){return '<mergeCell ref="'+m+'"/>';}).join("")+'</mergeCells>':'')+
      '<pageMargins left="0.4" right="0.4" top="0.5" bottom="0.5" header="0.3" footer="0.3"/><pageSetup orientation="landscape" fitToWidth="1" fitToHeight="0"/>'+(sh.logos?'<drawing r:id="rId1"/>':'')+'</worksheet>';
    add("xl/worksheets/sheet"+n+".xml",x);
    if(sh.logos){img=true;ct.push('<Override PartName="/xl/drawings/drawing'+n+'.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>');
      add("xl/worksheets/_rels/sheet"+n+".xml.rels",'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing'+n+'.xml"/></Relationships>');
      var pic=function(id,rid,name,colOff){var e=9525,sz=50*e;return '<xdr:oneCellAnchor><xdr:from><xdr:col>0</xdr:col><xdr:colOff>'+(colOff*e)+'</xdr:colOff><xdr:row>0</xdr:row><xdr:rowOff>'+(8*e)+'</xdr:rowOff></xdr:from><xdr:ext cx="'+sz+'" cy="'+sz+'"/><xdr:pic><xdr:nvPicPr><xdr:cNvPr id="'+id+'" name="'+name+'"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr><xdr:blipFill><a:blip r:embed="'+rid+'"/><a:stretch><a:fillRect/></a:stretch></xdr:blipFill><xdr:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="'+sz+'" cy="'+sz+'"/></a:xfrm><a:prstGeom prst="ellipse"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/></xdr:oneCellAnchor>';};
      add("xl/drawings/drawing"+n+".xml",'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'+pic(2,"rId1",S("companyName")+" logo",10)+pic(3,"rId2","HP logo",68)+'</xdr:wsDr>');
      add("xl/drawings/_rels/drawing"+n+".xml.rels",'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/iontech.jpeg"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/hp.jpeg"/></Relationships>');}
  });
  if(img){add("xl/media/iontech.jpeg",b64bytes(LOGO_JPG.iontech));add("xl/media/hp.jpeg",b64bytes(LOGO_JPG.hp));}
  var names=sheets.map(function(s){return s.name;});
  add("xl/workbook.xml",'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><bookViews><workbookView/></bookViews><sheets>'+wbSheets+'</sheets><definedNames>'+sheets.map(function(s,i){return s.filter?'<definedName name="_xlnm._FilterDatabase" localSheetId="'+i+'" hidden="1">\''+xesc(s.name.replace(/'/g,"''"))+'\'!'+s.filter.replace(/([A-Z]+)(\d+)/g,"$$$1$$$2")+'</definedName>':'';}).join("")+'</definedNames></workbook>');
  add("xl/_rels/workbook.xml.rels",'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+wbRels+'<Relationship Id="rId'+(sheets.length+1)+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>');
  add("[Content_Types].xml",ct.join("")+'</Types>');
  var order=["[Content_Types].xml","_rels/.rels","docProps/core.xml","xl/workbook.xml","xl/_rels/workbook.xml.rels","xl/styles.xml"];
  files.sort(function(a,b){var ia=order.indexOf(a.name),ib=order.indexOf(b.name);return (ia<0?99:ia)-(ib<0?99:ib)||a.name.localeCompare(b.name);});
  return new Blob([zipStore(files)],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});}

/* ---------- full updated price list (client-safe: no sources, no buy costs) ---------- */
function lastUpdate(){var best="";
  Object.keys(A.prices).forEach(function(k){var r=A.prices[k];[r.updatedAt,r.verifiedAt].forEach(function(v){if(v&&v>best)best=v;});});
  allProducts().forEach(function(p){[p.updatedAt,p.stockAsOf].forEach(function(v){if(v&&v>best)best=v;});});
  (A.changes||[]).forEach(function(c){if(c.at&&c.at>best)best=c.at;});
  return best||null;}
function fmtUpdate(iso){if(!iso)return "—";var d=String(iso);if(d.length<=10||/T00:00:00(\.0+)?Z$/.test(d))return fmtDate(d.slice(0,10));
  var t=new Date(d);if(isNaN(t))return fmtDate(d.slice(0,10));
  var ld=t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")+"-"+String(t.getDate()).padStart(2,"0");
  return fmtDate(ld)+", "+t.toLocaleTimeString("en-PH",{hour:"numeric",minute:"2-digit"});}
function priceListWorkbook(){
  var all=allProducts().slice().sort(familySort),upd=fmtUpdate(lastUpdate()),vat=S("pricesIncludeVat");
  var sheetFor=function(name,ps){
    var types=Object.keys(PTYPES).filter(function(t){return ps.some(function(p){return priceTypes(p.id).indexOf(t)>=0;});});
    var head=["Category","Series","SKU","Description","Processor","Memory","Storage","Graphics","Display","Operating system","Warranty","Availability","Stock (pcs)","Selling price","Price basis"].concat(types.map(function(t){return PTYPES[t];}));
    var widths=[17,17,15,38,30,22,22,30,30,20,20,20,10,15,16].concat(types.map(function(){return 16;}));
    var last=colName(head.length-1);
    var rows=[[null,{v:S("companyName")+" × HP — Approved Price List",s:1}],[null,{v:"HP Workstations, Business Notebooks & Thin Clients · "+name,s:2}],[null,{v:"Last updated "+upd+"   ·   Downloaded "+fmtDate(today()),s:10}],
      [null,{v:"Prices in PHP, "+(vat?"VAT inclusive ("+S("vatRate")+"%)":"VAT exclusive")+". Prices and availability are subject to change without notice; confirm stock before committing.",s:2}],[],
      head.map(function(h){return {v:h,s:3};})];
    var cur=null;
    ps.forEach(function(p){var g=p.family||p.series||"Other";
      if(g!==cur){cur=g;var grp=ps.filter(function(x){return (x.family||x.series)===g;});rows.push([{v:g+"   ·   "+grp.length+" SKU"+(grp.length===1?"":"s")+"   ·   "+(CATS[p.cat]||p.cat),s:7}].concat(head.slice(1).map(function(){return {v:"",s:7};})));}
      var s=p.specs||{},r=priceRec(p.id)||{types:{}},sp=sellPrice(p.id);
      var gpu=[s.graphics,s.vram&&!/shared/i.test(s.vram)?s.vram:""].filter(Boolean).join(", ");
      rows.push([{v:CAT_SHORT[p.cat]||"",s:8},{v:g,s:8},{v:p.sku,s:8},{v:p.name,s:4},{v:s.processor||"",s:4},{v:s.memory||"",s:4},{v:s.storage||"",s:4},{v:gpu,s:4},{v:[s.screen,s.display].filter(Boolean).join(" "),s:4},{v:s.os||"",s:4},{v:s.warranty||"",s:4},
        {v:(STATUS[p.status]||STATUS.unconfirmed)[0],s:8},{v:p.stockQty!=null?p.stockQty:"",s:9},{v:sp?sp.amount:isTBA(p.id)?"TBA":"",s:6},{v:sp?PTYPE_SHORT[sp.type]:isTBA(p.id)?"Order basis · TBA":"Confirm price",s:8}]
        .concat(types.map(function(t){var v=r.types&&r.types[t]?r.types[t].amount:null;return {v:v!=null?Number(v):"",s:5};})));});
    rows.push([]);rows.push([null,{v:"HP and the HP logo are trademarks of HP Inc. Specifications are for reference; confirm the exact configuration before ordering.",s:2}]);
    return {name:name,cols:widths,rows:rows,rowHeights:{1:26,2:15,3:15,4:15,6:30},freeze:{row:6,col:3},filter:"A6:"+last+(rows.length-2),logos:true};};
  var sheets=[sheetFor("All products",all)];
  CAT_ORDER.forEach(function(c){var ps=all.filter(function(p){return p.cat===c;});if(ps.length)sheets.push(sheetFor(CAT_TAB[c]||CATS[c],ps));});
  if(typeof upgSkus==="function"){var uh=["Series","SKU","Description","RAM installed","RAM slots used","RAM max (this SKU)","Storage installed","M.2 slots used","Storage max (this SKU)","Upgrade options"];
    var ur=[[null,{v:S("companyName")+" × HP — Workstation Upgrade Options",s:1}],[null,{v:"Checked "+fmtDate(UPG_VERIFIED)+". Open the Upgrade checker in the workspace for the full table and notes.",s:2}],[],uh.map(function(h){return {v:h,s:3};})];
    upgSkus().forEach(function(p){var R=upgReport(p);var M=R.S.mem,D=R.S.ssd,mi=R.mem,si=R.ssd;
      ur.push([{v:p.family,s:8},{v:p.sku,s:8},{v:p.name,s:4},{v:R.rows[0].inst,s:4},{v:M.soldered?"—":(mi.n!=null?mi.n+" of "+M.slots:M.slots+" slots"),s:9},{v:M.soldered?"—":M.skuMax+" GB",s:8},{v:R.rows[1].inst,s:4},{v:D.slots?si.n+" of "+D.slots:"",s:9},{v:D.skuMax,s:8},{v:R.paths.join("\n"),s:4}]);});
    sheets.push({name:"Upgrade options",cols:[18,13,36,26,10,14,34,10,18,70],rows:ur,rowHeights:{1:26,2:15,4:30},freeze:{row:4,col:2},filter:"A4:J"+(ur.length),logos:true});
    var dh=[["sku","SKU"],["name","Description"]].concat([["os","Operating system"],["display","Display"],["touch","Touchscreen"],["dims","Dimensions"],["weight","Weight"],["portsL","Ports (left)"],["portsR","Ports (right)"],["portsFront","Ports (front)"],["portsSide","Ports (side)"],["portsRear","Ports (rear)"],["wireless","Wireless"],["lan","Ethernet"],["battery","Battery"],["power","Power"],["keyboard","Keyboard"],["camera","Camera"],["audio","Audio"],["card","Card reader"],["expansion","Expansion slots"],["bays","Drive bays"],["fingerprint","Fingerprint"],["security","Security software"],["warranty","Warranty"],["ecolabel","Ecolabel"]]);
    var dr=[[null,{v:S("companyName")+" × HP — Workstation Details",s:1}],[null,{v:"Ports, size, weight, display, battery and more for every workstation SKU.",s:2}],[],dh.map(function(h){return {v:h[1],s:3};})];
    upgSkus().forEach(function(p){var d=hpDetails(p)||{};dr.push(dh.map(function(h,i){return {v:i===0?p.sku:i===1?p.name:(d[h[0]]||""),s:i<1?8:4};}));});
    sheets.push({name:"Workstation details",cols:[13,34].concat(dh.slice(2).map(function(h){return /ports|audio|expansion|display/i.test(h[0])?40:22;})),rows:dr,rowHeights:{1:26,2:15,4:30},freeze:{row:4,col:2},filter:"A4:"+colName(dh.length-1)+dr.length,logos:true});}
  return buildXlsx(sheets);}
function downloadPriceXlsx(){try{var b=priceListWorkbook();if(typeof logEvent==="function")logEvent("pricelist_xlsx");saveFile(S("companyName").replace(/\s*Inc\.?$/,"")+" HP Price List "+today()+".xlsx",b);}catch(e){console.error(e);toast("Couldn’t build the Excel file",true);}}
