/* ============================== admin ============================== */
var ADMIN_TABS=[["products","Products"],["prices","Prices"],["import","Import"],["images","Images"],["carepacks","Care Packs"],["announce","Promos & news"],["settings","Settings"],["costs","Buy costs"],["audit","Audit log"],["export","Export"],["access","Access & roles"]];
function viewAdmin(){
  if(!A.isAdmin)return '<div class="panel empty">Admin tools are for Editors of this workspace. Ask the owner if you need access.</div>';
  var tab=A.adminTab||"products";
  var body={products:adminProducts,prices:adminPrices,import:adminImport,images:adminImages,carepacks:adminCarePacks,announce:adminAnnounce,settings:adminSettings,costs:adminCosts,audit:adminAudit,export:adminExport,access:adminAccess}[tab]();
  return '<div class="page-h"><div><h1>Admin</h1><p>Changes save to the shared database immediately and appear on every screen. Each change is recorded in the audit log.</p></div></div>'+
    '<div class="tabs" role="tablist">'+ADMIN_TABS.map(function(t){return '<button role="tab" aria-selected="'+(tab===t[0])+'" data-atab="'+t[0]+'">'+t[1]+'</button>';}).join("")+'</div>'+body;
}
function adminProducts(){
  var q=(A.apq||"").toLowerCase();var list=Object.keys(A.products).map(function(k){return A.products[k];}).filter(function(p){return !q||hayOf(p).indexOf(q)>=0;}).sort(familySort);
  return '<div class="toolbar"><input class="inp" id="apq" placeholder="Filter" value="'+esc(A.apq||"")+'" style="width:240px"><button class="btn btn-primary" data-act="prod-new">'+ICON.plus+'Add product</button><span class="small muted" style="margin-left:auto">'+list.length+' records</span></div>'+
  '<section class="panel"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>SKU</th><th>Name</th><th>Status</th><th>Image set</th><th>Replacement</th><th>Updated</th><th></th></tr></thead><tbody>'+list.map(function(p){return '<tr'+(p.active===false?' style="opacity:.55"':'')+'><td><span class="sku">'+esc(p.sku)+'</span></td><td>'+esc(p.name)+(p.active===false?' <span class="tag t-mute">Hidden</span>':'')+'</td><td>'+statusTag(p)+'</td><td class="small">'+esc(p.imageSet||"—")+' ('+imgOf(p).length+')</td><td class="mono small">'+esc(p.replacement||"")+'</td><td class="small">'+fmtDT(p.updatedAt)+'</td><td><button class="btn btn-sm" data-editprod="'+p.id+'">Edit</button> <button class="btn btn-sm" data-editprice="'+p.id+'">Price</button></td></tr>';}).join("")+'</tbody></table></div></section>';
}
function prodEditor(id){
  var isNew=!id;var p=isNew?{sku:"",name:"",cat:"zbook",series:"",family:"",model:"",generation:"",desc:"",specs:{},status:"available",stockQty:null,stockAsOf:null,replacement:"",imageSet:"",specSource:"",features:[],active:true}:clone(P(id));
  var sets=uniq(Object.keys(A.imagesets).concat(allProducts().map(function(x){return x.imageSet;}).filter(Boolean))).sort();
  var inp=function(k,l,v,type,full){return '<div class="field"'+(full?' style="grid-column:1/-1"':'')+'><label for="pe-'+k+'">'+l+'</label><input id="pe-'+k+'" data-pe="'+k+'" type="'+(type||"text")+'" value="'+esc(v==null?"":v)+'"></div>';};
  modal({title:isNew?"Add product":"Edit "+p.sku,wide:true,body:
    '<div class="form-grid">'+inp("sku","SKU (exact)",p.sku)+inp("name","Product name",p.name)+'<div class="field"><label for="pe-cat">Category</label><select id="pe-cat" data-pe="cat">'+CAT_ORDER.map(function(c){return '<option value="'+c+'"'+(p.cat===c?" selected":"")+'>'+CATS[c]+'</option>';}).join("")+'</select></div>'+
    inp("series","Series (e.g. ZBook X)",p.series)+inp("family","Family (e.g. HP ZBook X G2i)",p.family)+inp("model","Model (e.g. ZBook X G2i)",p.model)+inp("generation","Generation",p.generation)+
    '<div class="field"><label for="pe-status">Availability status</label><select id="pe-status" data-pe="status">'+Object.keys(STATUS).map(function(s){return '<option value="'+s+'"'+(p.status===s?" selected":"")+'>'+STATUS[s][0]+'</option>';}).join("")+'</select></div>'+inp("stockQty","Stock quantity",p.stockQty,"number")+inp("stockAsOf","Stock as of",p.stockAsOf,"date")+
    '<div class="field"><label for="pe-replacement">Approved replacement SKU</label><input id="pe-replacement" data-pe="replacement" list="sku-all" value="'+esc(p.replacement||"")+'"><datalist id="sku-all">'+allProducts().map(function(x){return '<option value="'+esc(x.sku)+'">'+esc(x.name)+'</option>';}).join("")+'</datalist></div>'+
    '<div class="field"><label for="pe-imageSet">Image set (family)</label><input id="pe-imageSet" data-pe="imageSet" list="set-list" value="'+esc(p.imageSet||"")+'"><datalist id="set-list">'+sets.map(function(s){return '<option value="'+esc(s)+'">';}).join("")+'</datalist></div>'+
    inp("specSource","Specification source",p.specSource,"text",true)+'<div class="field" style="grid-column:1/-1"><label for="pe-desc">Short description</label><textarea id="pe-desc" data-pe="desc">'+esc(p.desc||"")+'</textarea></div>'+
    '<label class="chk"><input type="checkbox" id="pe-active"'+(p.active!==false?" checked":"")+'> Show in catalog</label></div>'+
    '<h3>Specifications</h3><p class="small muted">Leave a field empty when the source doesn’t state it. Empty fields show as “Not listed”.</p><div class="form-grid">'+SPEC_KEYS.map(function(k){return inp("s_"+k,SPEC_LABEL[k],p.specs[k]||"");}).join("")+'</div>'+
    '<div class="field"><label for="pe-features">Business features (one per line)</label><textarea id="pe-features">'+esc((p.features||[]).join("\n"))+'</textarea></div>',
    actions:[["Cancel","close"],["Save product","save","btn-primary"]],onAction:function(a,w,b){if(a!=="save")return;
      var n=clone(p);$$("[data-pe]",w).forEach(function(el){var k=el.getAttribute("data-pe");var v=el.value.trim();if(k.indexOf("s_")===0){var sk=k.slice(2);if(v)n.specs[sk]=v;else delete n.specs[sk];}else if(k==="stockQty")n[k]=v===""?null:Number(v);else n[k]=v||(k==="stockAsOf"?null:"");});
      n.features=$("#pe-features",w).value.split("\n").map(function(x){return x.trim();}).filter(Boolean);n.active=$("#pe-active",w).checked;n.sku=n.sku.toUpperCase();
      if(!n.sku||!n.name){toast("SKU and product name are required",true);return;}
      if(n.replacement&&!bySku(n.replacement)){toast("Replacement SKU "+n.replacement+" is not in the database",true);return;}
      var nid=idFor(n.sku);if(isNew&&A.products[nid]){toast("SKU "+n.sku+" already exists",true);return;}
      if(!isNew&&nid!==p.id){toast("To change a SKU, add a new product and hide the old one",true);return;}
      n.id=nid;b.disabled=true;saveProduct(n,isNew).then(function(){closeModal();toast("Product saved");}).catch(function(){b.disabled=false;});}});
}
function priceEditor(id){
  var p=P(id)||A.products[id];var r=priceRec(id)?clone(priceRec(id)):{sku:p.sku,currency:"PHP",vatInclusive:true,types:{},primary:"",effective:today(),expires:null,approved:true,source:"",verifiedAt:today()};delete r._id;
  modal({title:"Price — "+p.sku,body:'<p class="small muted">'+esc(p.name)+'</p><div class="form-grid">'+Object.keys(PTYPES).map(function(t){return '<div class="field"><label for="pr-'+t+'">'+PTYPES[t]+'</label><input id="pr-'+t+'" data-pr="'+t+'" type="number" min="0" step="0.01" value="'+esc(r.types&&r.types[t]?r.types[t].amount:"")+'"></div>';}).join("")+
    '<div class="field"><label for="pr-primary">Approved selling price used in quotations</label><select id="pr-primary">'+Object.keys(PTYPES).map(function(t){return '<option value="'+t+'"'+(r.primary===t?" selected":"")+'>'+PTYPES[t]+'</option>';}).join("")+'</select></div>'+
    '<div class="field"><label for="pr-eff">Effective date</label><input id="pr-eff" type="date" value="'+esc(r.effective||"")+'"></div><div class="field"><label for="pr-exp">Expiry date (optional)</label><input id="pr-exp" type="date" value="'+esc(r.expires||"")+'"></div>'+
    '<div class="field"><label for="pr-src">Source</label><input id="pr-src" value="'+esc(r.source||"")+'" placeholder="e.g. HP price list Nov 2026"></div><div class="field"><label for="pr-ver">Verified on</label><input id="pr-ver" type="date" value="'+esc(r.verifiedAt||today())+'"></div>'+
    '<label class="chk"><input type="checkbox" id="pr-vat"'+(r.vatInclusive!==false?" checked":"")+'> Amounts include VAT</label><label class="chk"><input type="checkbox" id="pr-appr"'+(r.approved!==false?" checked":"")+'> Approved for quoting</label></div>'+
    '<div class="field"><label for="pr-note">Reason for change (kept in the audit log)</label><input id="pr-note" placeholder="e.g. HP price increase effective Nov 1"></div>',
    actions:[["Cancel","close"],["Save price","save","btn-primary"]],onAction:function(a,w,b){if(a!=="save")return;
      var n=clone(r);n.types={};var bad=false;$$("[data-pr]",w).forEach(function(el){var v=el.value.trim();if(v==="")return;var x=Number(v);if(!(x>0)){bad=true;return;}n.types[el.getAttribute("data-pr")]={amount:x};});
      if(bad){toast("Prices must be positive numbers",true);return;}
      n.primary=$("#pr-primary",w).value;if(!n.types[n.primary]){toast("Enter an amount for the approved selling price type",true);return;}
      n.effective=$("#pr-eff",w).value||null;n.expires=$("#pr-exp",w).value||null;if(n.expires&&n.effective&&n.expires<n.effective){toast("Expiry must be after the effective date",true);return;}
      n.source=$("#pr-src",w).value.trim();n.verifiedAt=$("#pr-ver",w).value||today();n.vatInclusive=$("#pr-vat",w).checked;n.approved=$("#pr-appr",w).checked;n.sku=p.sku;
      b.disabled=true;savePrice(id,n,$("#pr-note",w).value.trim()).then(function(){closeModal();toast("Price saved — visible on every screen now");}).catch(function(){b.disabled=false;});}});
}
function adminPrices(){return '<div class="notice info">Edit one price with <b>Price</b> on the Products tab or the Price list, or update many at once with <b>Import</b>. Quotations keep the price captured when a line was added and show a warning when the current price differs.</div>'+
  panel("Recent price changes",A.changes.length?'<div class="tbl-wrap"><table class="tbl"><thead><tr><th>When</th><th>SKU</th><th>Change</th><th>By</th><th>Note</th></tr></thead><tbody>'+A.changes.slice(0,100).map(function(c){return '<tr><td class="small">'+fmtDT(c.at)+'</td><td><span class="sku">'+esc(c.sku)+'</span></td><td class="small">'+(c.changes||[]).map(function(x){return esc(PTYPE_SHORT[x.type]||x.type)+": "+peso(x.old)+" → "+peso(x.new);}).join("<br>")+(c.approved===false?'<br><span class="tag t-bad">Not approved</span>':'')+'</td><td class="small">'+esc(c.byName||"")+'</td><td class="small">'+esc(c.note||"")+'</td></tr>';}).join("")+'</tbody></table></div>':'<div class="empty">No price changes recorded yet.</div>');}

/* ---------- import ---------- */
var IMP_ALIASES={sku:["sku","ids sku","created sku no.","sku no","sku no.","part number","product number","sku for ph"],name:["product name","name"],model:["model","base"],category:["category"],series:["series"],family:["family"],
  processor:["processor","cpu"],memory:["memory","ram"],storage:["storage","storage (hdd)","ssd"],graphics:["graphics","graphics card","gpu"],vram:["vram","gpu vram","graphics memory"],screen:["screen size","screen"],display:["display"],os:["os","windows","operating system"],warranty:["warranty"],wifi:["wifi","wi-fi","wireless"],
  status:["status","availability"],stockQty:["qty","stock","stock qty","stocks","quantity"],onhand:["onhand vat inc","on-hand price","onhand price","onhand","on hand price"],order:["order basis vat inc","order-basis price","order basis price","order basis"],srp:["srp","suggested retail price"],dp:["dp with vat","dp","dealer price"],promo:["promo price","promotional price"],special:["special price","special approved price"],bundle:["bundle price"],
  effective:["effective date","effective"],expires:["expiry date","expires","expiration date","expiry"],source:["source"]};
var STATUS_IN={"available for ordering":"available","available":"available","order basis":"available","in stock":"in_stock","on hand":"in_stock","limited stock":"limited","reserved":"reserved","out of stock":"out","availability unconfirmed":"unconfirmed","unconfirmed":"unconfirmed","discontinued":"discontinued","eol":"discontinued","replacement available":"replacement"};
function normH(h){return String(h==null?"":h).toLowerCase().replace(/\s+/g," ").trim();}
function mapHeader(row){var map={};row.forEach(function(h,i){var n=normH(h);if(!n)return;Object.keys(IMP_ALIASES).forEach(function(k){if(map[k]!=null)return;if(IMP_ALIASES[k].indexOf(n)>=0)map[k]=i;});if(map.stockQty==null&&/^(open qty|qty as of|stocks? as of)/.test(n))map.stockQty=i;});return map;}
function xlDate(v){if(v==null||v==="")return null;if(typeof v==="number"&&v>20000&&v<80000){return new Date(Date.UTC(1899,11,30)+v*86400000).toISOString().slice(0,10);}var d=new Date(v);return isNaN(d)?String(v):d.toISOString().slice(0,10);}
function adminImport(){var I=A.imp;
  var head='<section class="panel panel-b" style="display:grid;gap:10px"><h2>Import products and prices from Excel or CSV</h2><p class="muted small">Recognized columns: SKU (required), Product name, Category (zbook / tower / tc), Model, Processor, Memory, Storage, Graphics, VRAM, Screen size, Display, OS, Warranty, Status, Qty, On-hand price, Order-basis price, SRP, DP, Promo price, Effective date, Expiry date, Source. Column names from the Iontech price list (e.g. “ONHAND VAT INC”, “DP with VAT”, “IDS SKU”) work too. Empty cells never overwrite existing data. For existing products, prices, status and qty are updated; spec cells only fill blank fields (differences are listed so you can edit them in Products).</p>'+
    '<div class="btn-row"><input type="file" id="imp-file" accept=".xlsx,.csv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"><button class="btn" data-act="imp-template">'+ICON.dl+'Download CSV template</button></div>'+
    (I&&I.sheets&&I.sheets.length>1?'<div class="field" style="max-width:320px"><label for="imp-sheet">Sheet</label><select id="imp-sheet">'+I.sheets.map(function(s,i){return '<option value="'+i+'"'+(I.sheet===i?" selected":"")+'>'+esc(s.name)+'</option>';}).join("")+'</select></div>':'')+'</section>';
  if(!I||!I.rows)return head;
  var c={ok:0,warn:0,bad:0,nochange:0};I.rows.forEach(function(r){c[r.level]++;});
  return head+'<section class="panel"><div class="panel-h"><h2>Preview: '+esc(I.file)+(I.sheets.length>1?" — "+esc(I.sheets[I.sheet].name):"")+'</h2><div class="btn-row"><span class="tag t-ok">'+c.ok+' ready</span><span class="tag t-warn">'+c.warn+' need review</span><span class="tag t-bad">'+c.bad+' blocked</span><span class="tag t-mute">'+c.nochange+' unchanged</span><button class="btn btn-primary" data-act="imp-apply"'+(I.rows.some(function(r){return r.include;})?"":" disabled")+'>Apply '+I.rows.filter(function(r){return r.include;}).length+' selected</button><button class="btn btn-quiet" data-act="imp-cancel">Cancel</button></div></div>'+
    (I.missingCols.length?'<div class="panel-b"><div class="notice warn">Columns not found: '+esc(I.missingCols.join(", "))+'. Those fields are left unchanged.</div></div>':'')+
    '<div class="tbl-wrap" style="max-height:60vh"><table class="tbl"><thead><tr><th></th><th>Row</th><th>SKU</th><th>Result</th><th>Changes</th><th>Issues</th></tr></thead><tbody>'+I.rows.map(function(r,i){return '<tr class="'+(r.level==="bad"?"row-bad":r.level==="warn"?"row-warn":"")+'"><td><input type="checkbox" data-impinc="'+i+'"'+(r.include?" checked":"")+(r.level==="bad"||r.level==="nochange"?" disabled":"")+' aria-label="Include row '+r.row+'"></td><td class="num">'+r.row+'</td><td><span class="sku">'+esc(r.sku||"—")+'</span></td><td>'+esc(r.result)+'</td><td class="small">'+r.changes.map(esc).join("<br>")+'</td><td class="small">'+r.issues.map(esc).join("<br>")+(r.note?'<div class="muted">'+esc(r.note)+'</div>':'')+'</td></tr>';}).join("")+'</tbody></table></div></section>';
}
function loadImportFile(file){
  var isX=/\.xlsx$/i.test(file.name);
  (isX?file.arrayBuffer().then(readXlsx):file.text().then(readCsv)).then(function(sheets){
    sheets=sheets.filter(function(s){return s.rows.some(function(r){return r.some(function(c){return c!=null&&c!=="";});});});
    if(!sheets.length){toast("The file has no data",true);return;}
    var best=0,bs=-1;sheets.forEach(function(s,i){var h=s.rows.findIndex(function(r){var m=mapHeader(r);return m.sku!=null;});var score=h>=0?Object.keys(mapHeader(s.rows[h])).length:0;if(score>bs){bs=score;best=i;}});
    A.imp={file:file.name,sheets:sheets,sheet:best};buildImport();
  }).catch(function(e){toast("Couldn’t read that file: "+(e.message||"unknown format"),true);});
}
function buildImport(){
  var I=A.imp,rows=I.sheets[I.sheet].rows;var hi=rows.findIndex(function(r){return mapHeader(r).sku!=null;});
  if(hi<0){I.rows=[];I.missingCols=[];toast("No SKU column found in this sheet",true);render();return;}
  var map=mapHeader(rows[hi]);I.map=map;I.missingCols=["name","processor","memory","storage","graphics","status"].filter(function(k){return map[k]==null;}).map(function(k){return k;});
  var seen={},out=[];
  rows.slice(hi+1).forEach(function(r,ix){var g=function(k){return map[k]!=null?r[map[k]]:null;};var raw=g("sku");if(raw==null||String(raw).trim()===""||/^[-\s]+$/.test(String(raw)))return;
    var sku=normSku(raw);var rec={row:hi+ix+2,sku:sku,changes:[],issues:[],include:true,level:"ok",result:""};
    if(!/^[A-Z0-9#\-]{4,20}$/.test(sku)){rec.issues.push("Doesn’t look like a SKU");rec.level="bad";out.push(rec);return;}
    if(seen[sku]){rec.issues.push("Duplicate SKU in file (also row "+seen[sku].row+")");rec.level="bad";seen[sku].issues.push("Duplicate SKU in file (also row "+rec.row+")");seen[sku].level="bad";seen[sku].include=false;out.push(rec);return;}
    seen[sku]=rec;
    var ex=bySku(sku);var exact=ex&&normSku(ex.sku)===sku?ex:(ex&&baseSku(ex.sku)===baseSku(sku)?ex:null);
    var prod=exact?clone(exact):null,isNew=!exact;
    var specUpd={},specKept=[];var putSpec=function(k,v){if(!prod||!prod.specs[k])specUpd[k]=v;else if(normH(prod.specs[k])!==normH(v))specKept.push(SPEC_LABEL[k]+" “"+v+"”");};
    ["processor","memory","storage","graphics","vram","display","os","warranty","wifi"].forEach(function(k){var v=g(k);if(v!=null&&String(v).trim()!=="")putSpec(k,String(v).trim());});
    var sc=g("screen");if(sc!=null&&String(sc).trim()!==""){var sv=String(sc).trim().replace(/\s*(inch|in)$/i,"")+(/"$/.test(String(sc).trim())?"":'"');sv=sv.replace(/""$/,'"');putSpec("screen",sv);}
    if(specUpd.memory&&gb(specUpd.memory)==null){rec.issues.push("Memory value “"+specUpd.memory+"” has no GB amount");rec.level="warn";}
    if(specUpd.storage&&gb(specUpd.storage)==null){rec.issues.push("Storage value “"+specUpd.storage+"” has no GB/TB amount");rec.level="warn";}
    var top={};var nm=g("name");if(nm!=null&&String(nm).trim())top.name=String(nm).trim();var md=g("model");if(md!=null&&String(md).trim())top.model=String(md).trim();var cat=g("category");if(cat!=null&&String(cat).trim()){var cv=String(cat).toLowerCase();top.cat=/thin|tc/.test(cv)?"tc":/probook|elitebook|business|notebook|bnb|\bnb\b/.test(cv)?"nb":/tower|desk|z\d/.test(cv)?"tower":/zbook|mobile|laptop/.test(cv)?"zbook":null;if(!top.cat){rec.issues.push("Unknown category “"+cat+"”");top.cat=undefined;}}
    var st=g("status");if(st!=null&&String(st).trim()){var sk=STATUS_IN[normH(st)];if(sk){top.status=sk;if(prod&&(prod.status==="discontinued"||prod.status==="replacement")&&sk!==prod.status){rec.issues.push("Currently marked "+STATUS[prod.status][0].toLowerCase()+" — confirm it’s really back");rec.level="warn";}}else rec.issues.push("Unknown status “"+st+"” (ignored)");}
    var q=g("stockQty");if(q!=null&&String(q).trim()!==""){var qn=parseInt(String(q).replace(/[^\d]/g,""),10);if(!isNaN(qn)){top.stockQty=qn;top.stockAsOf=today();if(!top.status)top.status=qn>0?"in_stock":"out";}}
    Object.keys(top).forEach(function(k){if(top[k]===undefined||(prod&&prod[k]===top[k]))delete top[k];});
    var pr=exact?clone(priceRec(exact.id)||{types:{}}):{types:{}};var prUpd={};
    Object.keys(PTYPES).forEach(function(t){var v=g(t);if(v==null||String(v).trim()==="")return;var n=Math.round(Number(String(v).replace(/[^\d.]/g,""))*100)/100;if(!(n>0)){rec.issues.push(PTYPES[t]+": invalid amount “"+v+"”");rec.level="bad";return;}var old=pr.types&&pr.types[t]?Number(pr.types[t].amount):null;if(old==null||Math.abs(old-n)>=0.005){prUpd[t]=n;if(old&&Math.abs(n-old)/old>0.25){rec.issues.push(PTYPE_SHORT[t]+" changes by "+Math.round((n-old)/old*100)+"% — confirm");if(rec.level==="ok")rec.level="warn";}}});
    var eff=xlDate(g("effective")),exp=xlDate(g("expires")),src=g("source");
    if(exp&&exp<today()){rec.issues.push("Expiry date "+exp+" has already passed");if(rec.level==="ok")rec.level="warn";}
    if(isNew){
      if(!top.name||!top.cat){rec.result="Unrecognized SKU";rec.issues.push("Not in the database. Needs Product name and Category to be created");rec.level="bad";rec.include=false;out.push(rec);return;}
      rec.result="New product";if(rec.level==="ok")rec.level="warn";rec.issues.push("Unrecognized SKU — will be created; check specs before publishing");
    } else rec.result=exact.sku!==sku?"Matches "+exact.sku:"Update";
    if(!src&&Object.keys(prUpd).length){rec.issues.push("No source column — file name will be recorded as the price source");}
    Object.keys(top).forEach(function(k){rec.changes.push(k+": "+(prod?(prod[k]==null?"—":prod[k]):"—")+" → "+top[k]);});
    Object.keys(specUpd).forEach(function(k){rec.changes.push(SPEC_LABEL[k]+": — → "+specUpd[k]);});
    if(specKept.length)rec.note="Existing specs kept (edit in Products if the file is right): "+specKept.join(", ");
    Object.keys(prUpd).forEach(function(t){rec.changes.push(PTYPE_SHORT[t]+": "+peso(pr.types&&pr.types[t]?pr.types[t].amount:null)+" → "+peso(prUpd[t]));});
    if(eff&&eff!==pr.effective)rec.changes.push("Effective: "+eff);if(exp&&exp!==pr.expires)rec.changes.push("Expires: "+exp);
    if(!rec.changes.length&&rec.level!=="bad"){rec.level="nochange";rec.result="No changes";rec.include=false;}
    if(rec.level==="warn"&&rec.issues.some(function(x){return /differs|changes by|really back/.test(x);}))rec.include=false;
    rec.apply={id:exact?exact.id:idFor(sku),isNew:isNew,sku:exact?exact.sku:sku,top:top,specUpd:specUpd,prUpd:prUpd,eff:eff,exp:exp,src:src?String(src):I.file};
    out.push(rec);
  });
  I.rows=out;render();
}
function applyImport(){
  var rows=A.imp.rows.filter(function(r){return r.include&&r.apply;});if(!rows.length)return;
  confirmBox("Publish "+rows.length+" changes?",'<p>This updates the shared product and price database for everyone. '+rows.filter(function(r){return r.apply.isNew;}).length+' new products, '+rows.filter(function(r){return Object.keys(r.apply.prUpd).length;}).length+' price updates. Each change is written to the audit log.</p>',"Publish changes").then(function(ok){if(!ok)return;
    var done=0,failed=0;toast("Publishing…");
    rows.reduce(function(pr,r){return pr.then(function(){var a=r.apply;
      var base=a.isNew?{id:a.id,sku:a.sku,name:a.top.name,cat:a.top.cat,series:a.top.model||"",family:a.top.model?"HP "+a.top.model:a.top.name,model:a.top.model||a.top.name,generation:null,desc:"",specs:{},status:"unconfirmed",stockQty:null,stockAsOf:null,replacement:null,imageSet:"",specSource:"Imported from "+A.imp.file,features:[],active:true}:clone(P(a.id));
      Object.assign(base,a.top);Object.assign(base.specs,a.specUpd);if(Object.keys(a.specUpd).length)base.specSource="Imported from "+A.imp.file+" ("+today()+")";
      var steps=[];if(a.isNew||Object.keys(a.top).length||Object.keys(a.specUpd).length)steps.push(function(){return saveProduct(base,a.isNew);});
      if(Object.keys(a.prUpd).length||a.eff||a.exp){var old=priceRec(a.id)?clone(priceRec(a.id)):{sku:a.sku,currency:"PHP",vatInclusive:true,types:{},approved:true};delete old._id;old.types=old.types||{};
        Object.keys(a.prUpd).forEach(function(t){old.types[t]={amount:a.prUpd[t]};});if(!old.primary||!old.types[old.primary])old.primary=["onhand","order","srp","dp"].find(function(t){return old.types[t];})||Object.keys(old.types)[0];
        if(a.eff)old.effective=a.eff;if(a.exp)old.expires=a.exp;old.source=a.src;old.verifiedAt=today();old.sku=a.sku;steps.push(function(){return savePrice(a.id,old,"Bulk import: "+A.imp.file);});}
      return steps.reduce(function(p2,s){return p2.then(s);},Promise.resolve()).then(function(){done++;},function(){failed++;});});},Promise.resolve()).then(function(){
        audit("import",A.imp.file,done+" rows applied, "+failed+" failed");toast(done+" rows published"+(failed?", "+failed+" failed":""),!!failed);A.imp=null;render();});
  });
}
function importTemplate(){return toCsv([["SKU","Product name","Category","Model","Processor","Memory","Storage","Graphics","VRAM","Screen size","Display","OS","Warranty","Status","Qty","On-hand price","Order-basis price","SRP","DP","Effective date","Expiry date","Source"],["EXAMPLE1PT","HP ZBook X G2i 16\" Mobile Workstation","zbook","ZBook X G2i","Intel Core Ultra 7 356H","32GB DDR5-5600","1TB PCIe NVMe M.2","NVIDIA RTX PRO 2000 Blackwell","8GB GDDR7","16","WUXGA IPS, 300 nits","Windows 11 Pro","3 years onsite","Available for Ordering","","","263530","","","2026-11-01","","HP price list Nov 2026"]]);}

/* ---------- images ---------- */
var VIEWS=["Front","Front left","Front right","Open","Closed","Left side","Right side","Rear","Rear left","Keyboard","Ports","Top","Internal","Other"];
function adminImages(){
  var sets={};allProducts().forEach(function(p){if(p.imageSet){(sets[p.imageSet]=sets[p.imageSet]||[]).push(p);}});Object.keys(A.imagesets).forEach(function(k){sets[k]=sets[k]||[];});
  return '<div class="notice info">Images are uploaded once per family image set and shown on every SKU that uses the set, labelled as family images. Upload official HP product images (JPG/PNG). Large images are resized to 1600px for fast loading.</div>'+
  '<section class="panel"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Image set</th><th>Label shown</th><th>SKUs</th><th>Images</th><th></th></tr></thead><tbody>'+Object.keys(sets).sort().map(function(k){var s=A.imagesets[k]||{};var im=s.images||[];return '<tr><td class="mono small">'+esc(k)+'</td><td class="small">'+esc(s.label||(sets[k][0]||{}).family||"")+'</td><td class="num">'+sets[k].length+'</td><td><div class="btn-row">'+im.map(function(x,i){return '<span style="display:inline-grid;gap:2px;text-align:center"><span class="thumb" style="width:56px">'+'<img src="/_blob/'+esc(x.id)+'" alt=""></span><span class="small">'+esc(x.view||"")+'</span><button class="btn btn-sm btn-quiet" data-delimg="'+esc(k)+'|'+i+'">Remove</button></span>';}).join("")+(im.length?'':'<span class="muted small">None</span>')+'</div></td><td><button class="btn btn-sm" data-upimg="'+esc(k)+'">Upload</button></td></tr>';}).join("")+'</tbody></table></div></section>';
}
function imgUploadModal(setId){
  if(!A.assets){toast("Uploading needs Editor access",true);return;}
  var s=A.imagesets[setId]||{};var fam=(allProducts().find(function(p){return p.imageSet===setId;})||{}).family||"";
  modal({title:"Upload images — "+setId,body:'<div class="field"><label for="iu-label">Label shown with the images</label><input id="iu-label" value="'+esc(s.label||fam)+'"></div><div class="field"><label for="iu-files">Image files</label><input id="iu-files" type="file" accept="image/jpeg,image/png,image/webp" multiple></div><div class="field"><label for="iu-view">View shown in the images</label><select id="iu-view">'+VIEWS.map(function(v){return '<option>'+v+'</option>';}).join("")+'</select><span class="hint">With several files, views are assigned in order starting from this one; edit later by re-uploading.</span></div>',
    actions:[["Cancel","close"],["Upload","up","btn-primary"]],onAction:function(a,w,b){if(a!=="up")return;var files=Array.prototype.slice.call($("#iu-files",w).files);if(!files.length){toast("Choose image files",true);return;}b.disabled=true;b.textContent="Uploading…";
      var vi=VIEWS.indexOf($("#iu-view",w).value);var added=[];
      files.reduce(function(pr,file,i){return pr.then(function(){return shrinkImage(file).then(function(blob){return A.assets.upload(blob,{type:"image/jpeg"});}).then(function(res){added.push({id:res.id,view:VIEWS[Math.min(VIEWS.length-1,vi+i)]});});});},Promise.resolve()).then(function(){
        var cur=A.imagesets[setId]?clone(A.imagesets[setId]):{images:[]};delete cur._id;cur.images=(cur.images||[]).concat(added);cur.label=$("#iu-label",w).value.trim();cur.scope="family";cur.updatedAt=nowISO();
        return A.db.doc("imagesets/"+setId).set(cur).then(function(){audit("images.upload",setId,added.length+" images");closeModal();toast(added.length+" image"+(added.length>1?"s":"")+" uploaded");});
      }).catch(function(e){b.disabled=false;b.textContent="Upload";toast("Upload failed"+(e&&e.code?" ("+e.code+")":""),true);});}});
}
function shrinkImage(file){return createImageBitmap(file).then(function(bmp){var s=Math.min(1,1600/Math.max(bmp.width,bmp.height));var c=document.createElement("canvas");c.width=Math.round(bmp.width*s);c.height=Math.round(bmp.height*s);var x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);x.drawImage(bmp,0,0,c.width,c.height);return new Promise(function(r){c.toBlob(r,"image/jpeg",0.86);});});}

/* ---------- announcements, settings, costs, audit, export, access ---------- */
function adminAnnounce(){var cur=newsList("current");return '<section class="panel panel-b" style="display:grid;gap:10px"><h2>Promos &amp; news</h2><p class="muted" style="margin:0">Posts appear for the whole team on the Products page and the Promos &amp; news page. '+cur.length+' current.</p><div class="btn-row"><button class="btn btn-primary" data-act="news-new">'+ICON.plus+'Post promo or news</button><button class="btn" data-go="news">Open Promos &amp; news</button></div></section>';}
var SETTING_FIELDS=[["companyName","Company name"],["companyTagline","Tagline"],["address","Address"],["phone","Phone"],["email","Email"],["website","Website"],["tin","TIN"],["vatRate","VAT rate (%)","number"],["staleDays","Flag prices not verified after (days)","number"],["quotePrefix","Quotation number prefix"],["paymentTerms","Default payment terms"],["deliveryTerms","Default delivery terms"],["quoteTerms","Quotation terms and disclaimer","area"],["discountNote","Discount policy note","area"],["orderTat","Order-basis turnaround time (TAT), e.g. 45–60 days — leave blank to hide"]];
function adminSettings(){return '<section class="panel panel-b" style="display:grid;gap:12px"><h2>Company & quotation settings</h2><p class="small muted">Used on quotations, PDFs and copied text.</p><div class="form-grid">'+SETTING_FIELDS.map(function(f2){var v=S(f2[0]);return '<div class="field"'+(f2[2]==="area"?' style="grid-column:1/-1"':'')+'><label for="st-'+f2[0]+'">'+f2[1]+'</label>'+(f2[2]==="area"?'<textarea id="st-'+f2[0]+'">'+esc(v)+'</textarea>':'<input id="st-'+f2[0]+'" type="'+(f2[2]||"text")+'" value="'+esc(v)+'">')+'</div>';}).join("")+'<label class="chk"><input type="checkbox" id="st-pricesIncludeVat"'+(S("pricesIncludeVat")?" checked":"")+'> Prices in the database include VAT</label></div><div><button class="btn btn-primary" data-act="st-save">Save settings</button></div></section>';}
function adminCosts(){
  if(!A.costs){A.costs="loading";A.db.collection("restricted/admin/costs").get().then(function(s){A.costs={};s.docs.forEach(function(d){A.costs[d.id]=d.data();});render();}).catch(function(){A.costs={};render();});return '<div class="panel empty">Loading…</div>';}
  if(A.costs==="loading")return '<div class="panel empty">Loading…</div>';
  var list=allProducts().sort(familySort);
  return '<div class="notice warn"><b>Restricted:</b> buy costs are stored where only Editors can read them. The database rule enforces this for every other user, not just the page. They never appear on quotations, copied text or PDFs.</div>'+
  '<section class="panel"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>SKU</th><th>Product</th><th class="r">Approved selling price</th><th class="r">Buy cost (VAT ex.)</th><th class="r">Margin</th><th></th></tr></thead><tbody>'+list.map(function(p){var c=A.costs[p.id];var sp=sellPrice(p.id);var rate=Number(S("vatRate"))||0;var net=sp?(S("pricesIncludeVat")?sp.amount/(1+rate/100):sp.amount):null;var mg=c&&c.cost&&net?((net-c.cost)/net*100):null;
    return '<tr><td><span class="sku">'+esc(p.sku)+'</span></td><td class="small">'+esc(p.name)+'</td><td class="r">'+(sp?peso(sp.amount):"—")+'</td><td class="r"><input type="number" min="0" step="0.01" data-cost="'+p.id+'" value="'+esc(c&&c.cost||"")+'" style="width:120px;text-align:right;border:1px solid var(--line);border-radius:6px;padding:3px 6px;background:var(--surface)"></td><td class="r'+(mg!=null&&mg<0?'" style="color:var(--bad)':'')+'">'+(mg!=null?mg.toFixed(1)+"%":"—")+'</td><td>'+(c&&c.updatedAt?'<span class="small muted">'+fmtDate(c.updatedAt.slice(0,10))+'</span>':'')+'</td></tr>';}).join("")+'</tbody></table></div></section>';
}
function adminAudit(){
  if(!A.auditLog){A.auditLog="loading";A.db.collection("restricted/admin/audit").orderBy("at","desc").limit(300).get().then(function(s){A.auditLog=s.docs.map(function(d){return d.data();});render();}).catch(function(){A.auditLog=[];render();});return '<div class="panel empty">Loading…</div>';}
  if(A.auditLog==="loading")return '<div class="panel empty">Loading…</div>';
  return '<div class="btn-row"><button class="btn btn-sm" data-act="audit-refresh">Refresh</button></div>'+panel("Audit log (latest 300)",A.auditLog.length?'<div class="tbl-wrap"><table class="tbl"><thead><tr><th>When</th><th>Who</th><th>Action</th><th>Target</th><th>Detail</th></tr></thead><tbody>'+A.auditLog.map(function(a){return '<tr><td class="small">'+fmtDT(a.at)+'</td><td class="small">'+esc(a.byName||"")+'</td><td class="mono small">'+esc(a.action)+'</td><td class="mono small">'+esc(a.target)+'</td><td class="small" style="max-width:420px;overflow-wrap:anywhere">'+esc(a.detail)+'</td></tr>';}).join("")+'</tbody></table></div>':'<div class="empty">No admin activity recorded yet.</div>');
}
function productsCsv(){var rows=[["SKU","Name","Category","Series","Family","Model","Status","Stock qty","Stock as of","Replacement","Image set","Spec source"].concat(SPEC_KEYS.map(function(k){return SPEC_LABEL[k];}))];allProducts().sort(familySort).forEach(function(p){rows.push([p.sku,p.name,p.cat,p.series,p.family,p.model,(STATUS[p.status]||[""])[0],p.stockQty,p.stockAsOf,p.replacement,p.imageSet,p.specSource].concat(SPEC_KEYS.map(function(k){return p.specs[k]||"";})));});return toCsv(rows);}
function adminExport(){return '<section class="panel panel-b" style="display:grid;gap:10px"><h2>Export</h2><p class="muted">CSV files open in Excel. Buy costs are not included.</p><div class="btn-row"><button class="btn" data-act="exp-products">'+ICON.dl+'Products & specifications</button><button class="btn" data-act="prices-csv">'+ICON.dl+'Price list</button></div></section>';}
function adminAccess(){return '<section class="panel panel-b" style="display:grid;gap:10px"><h2>Access & roles</h2>'+
  '<p>Access is set from this page’s <b>Share</b> menu in Claude. The database enforces it for every request, not only in the page:</p>'+
  '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Share level</th><th>Workspace role</th><th>Can do</th></tr></thead><tbody>'+
  '<tr><td>Editor / Owner</td><td>Administrator, product manager</td><td>Everything below, plus edit products, prices, stock, images, documents, settings; see buy costs and the audit log</td></tr>'+
  '<tr><td>Contributor</td><td>Sales representative, sales manager</td><td>Search, compare, match requirements, build and save their own quotations, favorites and comparisons (private to each person)</td></tr>'+
  '<tr><td>Viewer / Commenter</td><td>Read-only</td><td>Browse products and prices; cannot save work</td></tr></tbody></table></div>'+
  '<p class="small muted">Not available on this platform: custom roles beyond these levels (e.g. separate discount limits per role), manager visibility into other people’s quotations, and sales analytics across users. Discounts instead need a per-line “approved” confirmation before a quotation can be finalized.</p>'+
  '<p class="small">You are signed in as <b>'+esc((A.me&&A.me.name)||"this user")+'</b> with <b>'+(A.isAdmin?"Editor":"Contributor")+'</b> access.</p></section>';}
