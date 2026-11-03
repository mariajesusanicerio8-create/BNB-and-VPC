/* ============================== HP Care Packs: imported data (admin) + HP Care Pack Central lookup ============================== */
var CPC_URL="https://cpc2.ext.hp.com/?countries=PH";
var CP_SKU_RE=/^(U|H)[0-9A-Z]{3,7}(E|PE|AE)$/i;
/* imported Care Packs live in the "carepacks" collection, one doc per product part number */
function cpImported(p){var m=A.cpImp||{};return m[baseSku(p.sku)]||m[p.sku]||null;}
function cpFromImported(x){return {sku:x.sku,desc:x.desc||"",price:x.price==null?null:Number(x.price),months:x.months||null,support:x.support||"",response:x.response||"",window:x.window||"",place:x.place||"",warranty:x.warranty||"",section:x.section||"C",category:"",sheet:""};}
function cpLookupIndex(){if(A._cpIdxFor===A.cpImp)return A._cpIdx;var idx={};Object.keys(A.cpImp||{}).forEach(function(k){(A.cpImp[k].items||[]).forEach(function(x){idx[x.sku]=cpFromImported(x);});});A._cpIdx=idx;A._cpIdxFor=A.cpImp;return idx;}
function cpRetrieved(p){var d=p&&cpImported(p);return d?(d.retrieved||String(d.updatedAt||"").slice(0,10)):(window.CAREPACKS?CAREPACKS.retrieved:null);}
function cpcLookupPanel(p){if(p.cat==="nb"&&carePacksFor(p).length)return "";
  return '<section class="panel" id="carepacks"><div class="panel-h"><h2>HP Care Packs</h2><span class="small muted">HP Care Pack Central · Philippines</span></div><div class="panel-b" style="display:grid;gap:10px">'+
    '<p class="small">No Care Packs are loaded for <span class="sku">'+esc(baseSku(p.sku))+'</span> yet. Look up the compatible Care Packs and their HP list prices on HP Care Pack Central.</p>'+
    '<div class="btn-row"><a class="btn btn-primary" href="'+CPC_URL+'" target="_blank" rel="noopener noreferrer">'+ICON.ext+'Open HP Care Pack Central</a><button class="btn" data-act="cp-copypn" data-pn="'+esc(baseSku(p.sku))+'">'+ICON.copy+'Copy part number</button>'+
    (A.isAdmin?'<button class="btn" data-act="cp-admin" data-pn="'+esc(baseSku(p.sku))+'">'+ICON.plus+'Add Care Packs</button>':'')+'</div>'+
    '<p class="small muted">Search the part number, choose the Philippines, and quote the price HP lists for it. '+(A.isAdmin?'To load them here, export or copy the results and use Admin → Care Packs.':'An admin can load them into the workspace.')+'</p></div></section>';}
/* ---------- parsing an export or pasted table ---------- */
function cpNum(v){if(v==null||v==="")return null;if(typeof v==="number")return v;var s=String(v).replace(/[₱,\s]|PHP/gi,"");var n=parseFloat(s);return isNaN(n)?null:n;}
function cpMonths(v,desc){var s=String(v==null?"":v);var m;if(typeof v==="number"&&v>0)return v<=10?v*12:v;
  if((m=/(\d+)\s*(?:y|yr|yrs|year|years)\b/i.exec(s)))return +m[1]*12;if((m=/(\d+)\s*(?:m|mo|mos|month|months)\b/i.exec(s)))return +m[1];
  if((m=/(\d+)\s*(?:y|yr|year)s?\b/i.exec(desc||"")))return +m[1]*12;if((m=/(\d+)\s*months?\b/i.exec(desc||"")))return +m[1];return null;}
function cpPlace(desc){return /onsite|on-site/i.test(desc)?"Onsite":/return to depot|\bRTD\b/i.test(desc)?"Return to depot":/pick.?up/i.test(desc)?"Pickup and return":/offsite/i.test(desc)?"Offsite":"";}
function cpHeaderMap(row){var m={};row.forEach(function(c,i){var h=String(c==null?"":c).toLowerCase().trim();if(!h)return;
    var set=function(k){if(m[k]==null)m[k]=i;};
    if(/care\s*pack.*(number|no\.?|sku|part)|^care\s*pack$|service.*(number|sku|part)|^offer|^cp\s*(sku|pn|number)/.test(h))set("cp");
    else if(/(product|part|model|platform|hardware|device|unit).*(number|no\.?|pn|sku)|^pn$|^part$|^product$|^sku$|^model$|compatible|^for\b/.test(h))set("pn");
    else if(/desc|name|title/.test(h))set("desc");
    else if(/price|amount|list|srp|php|₱|cost/.test(h))set("price");
    else if(/duration|term|months?|years?|period|length/.test(h))set("months");
    else if(/response/.test(h))set("response");
    else if(/window|hours|coverage\s*time/.test(h))set("window");
    else if(/place|delivery|location|where/.test(h))set("place");
    else if(/warranty/.test(h))set("warranty");
    else if(/support|service\s*level|level|type/.test(h))set("support");
    else if(/section|category|class/.test(h))set("section");});return m;}
function cpParse(sheets,defaultPns){var out={},issues=[];var defs=(defaultPns||"").split(/[\s,;]+/).map(function(s){return s.trim().toUpperCase();}).filter(Boolean);
  sheets.forEach(function(sh){var rows=sh.rows;var hi=-1,map=null;
    for(var i=0;i<Math.min(rows.length,30);i++){var mm=cpHeaderMap(rows[i]);if((mm.cp!=null||mm.desc!=null)&&mm.price!=null){hi=i;map=mm;break;}}
    if(hi<0){/* no header: find columns by value shape */var sample=rows.slice(0,40);var cols=Math.max.apply(null,sample.map(function(r){return r.length;}).concat([0]));map={};
      for(var c=0;c<cols;c++){var vals=sample.map(function(r){return r[c];}).filter(function(v){return v!=null&&v!=="";});if(!vals.length)continue;
        if(map.cp==null&&vals.filter(function(v){return CP_SKU_RE.test(String(v).trim());}).length>=vals.length*.6)map.cp=c;
        else if(map.price==null&&vals.filter(function(v){return cpNum(v)!=null&&cpNum(v)>50;}).length>=vals.length*.6)map.price=c;
        else if(map.desc==null&&vals.filter(function(v){return /HP .*(year|yr|y\b|month|care|support|onsite|warranty)/i.test(String(v));}).length>=vals.length*.5)map.desc=c;
        else if(map.pn==null&&vals.filter(function(v){var s=String(v).trim();return /^[0-9A-Z]{5,8}(#[0-9A-Z]{3})?$/i.test(s)&&!CP_SKU_RE.test(s);}).length>=vals.length*.6)map.pn=c;}
      if(map.price==null||(map.cp==null&&map.desc==null))return;}
    /* a sheet name or a title row may name the product */
    var curPn=null;var nm=String(sh.name||"").toUpperCase().trim();if(bySku(nm))curPn=baseSku(bySku(nm).sku);
    rows.slice(hi+1).forEach(function(r,ri){var g=function(k){return map[k]!=null?r[map[k]]:null;};
      var cp=String(g("cp")||"").trim().toUpperCase();var desc=String(g("desc")||"").trim();
      if(!cp&&!desc){var t=r.filter(function(v){return v!=null&&v!=="";}).map(String).join(" ").toUpperCase();var mm=/\b([0-9A-Z]{5,8}(?:#[0-9A-Z]{3})?)\b/.exec(t);if(mm&&bySku(mm[1]))curPn=baseSku(bySku(mm[1]).sku);return;}
      if(!cp){var m2=/\b((?:U|H)[0-9A-Z]{3,7}(?:E|PE|AE))\b/.exec(desc.toUpperCase());if(m2)cp=m2[1];}
      if(!cp||!CP_SKU_RE.test(cp)){issues.push("Row "+(hi+ri+2)+(sh.name?" ("+sh.name+")":"")+": no Care Pack SKU");return;}
      var price=cpNum(g("price"));
      var pnv=String(g("pn")||"").trim().toUpperCase();var pns=pnv?pnv.split(/[\s,;\/]+/).filter(Boolean):curPn?[curPn]:defs;
      if(!pns.length){issues.push(cp+": no product part number — add a Part number column, or type the part number above");return;}
      var rec={sku:cp,desc:desc,price:price,months:cpMonths(g("months"),desc),support:String(g("support")||"").trim(),response:String(g("response")||"").trim(),window:String(g("window")||"").trim(),place:String(g("place")||"").trim()||cpPlace(desc),warranty:String(g("warranty")||"").trim()||(/\bPW\b|post\s*warranty/i.test(desc)?"Post warranty":"In warranty"),section:/^s/i.test(String(g("section")||""))?"S":"C"};
      if(price==null)issues.push(cp+": no price");
      pns.forEach(function(pn){var p=bySku(pn);var key=p?baseSku(p.sku):baseSku(pn);var o=out[key]=out[key]||{pn:key,p:p,items:[],seen:{}};if(o.seen[cp])return;o.seen[cp]=1;o.items.push(rec);});});});
  return {byPn:out,issues:issues};}
/* ---------- admin tab ---------- */
function adminCarePacks(){var all=allProducts();var C=A.cpi||{};
  var withCp=all.filter(function(p){return carePacksFor(p).length;});var missing=all.filter(function(p){return !carePacksFor(p).length;});
  var byCat=function(list){return CAT_ORDER.map(function(c){var n=list.filter(function(p){return p.cat===c;}).length;return n?n+" "+(CAT_META[c]||{}).short:"";}).filter(Boolean).join(" · ");};
  var imp=Object.keys(A.cpImp||{}).map(function(k){return A.cpImp[k];}).sort(function(a,b){return String(a.pn).localeCompare(String(b.pn));});
  var prev="";if(C.parsed){var keys=Object.keys(C.parsed.byPn);
    prev='<section class="panel"><div class="panel-h"><h2>Preview: '+esc(C.file||"pasted table")+'</h2><div class="btn-row"><button class="btn btn-quiet" data-act="cpi-cancel">Cancel</button><button class="btn btn-primary" data-act="cpi-apply"'+(keys.length?'':' disabled')+'>Publish Care Packs for '+keys.length+' part number'+(keys.length===1?"":"s")+'</button></div></div>'+
      (keys.length?'<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Part number</th><th>Product</th><th class="r">Care Packs</th><th class="r">Price range</th><th>Durations</th><th>Replaces</th></tr></thead><tbody>'+keys.map(function(k){var o=C.parsed.byPn[k];var ps=o.items.map(function(x){return x.price;}).filter(function(v){return v!=null;});var ex=o.p?carePacksFor(o.p).length:0;
        return '<tr><td><span class="sku">'+esc(k)+'</span></td><td>'+(o.p?esc(o.p.name):'<span class="tag t-warn">Not in the product list</span>')+'</td><td class="r">'+o.items.length+'</td><td class="r">'+(ps.length?peso(Math.min.apply(null,ps))+(ps.length>1?" – "+peso(Math.max.apply(null,ps)):""):"—")+'</td><td class="small">'+esc(uniq(o.items.map(function(x){return x.months?cpDur(x.months):"";}).filter(Boolean)).join(", "))+'</td><td class="small muted">'+(ex?ex+" current":"—")+'</td></tr>';}).join("")+'</tbody></table></div>':'<div class="panel-b empty">No Care Packs were recognised. The file needs a Care Pack SKU (or description) column and a price column.</div>')+
      (C.parsed.issues.length?'<div class="panel-b small" style="color:var(--warn)"><b>'+C.parsed.issues.length+' row'+(C.parsed.issues.length===1?"":"s")+' skipped or incomplete:</b> '+esc(C.parsed.issues.slice(0,8).join("; "))+(C.parsed.issues.length>8?" …":"")+'</div>':'')+'</section>';}
  return '<section class="panel panel-b" style="display:grid;gap:12px"><h2>HP Care Packs</h2>'+
    '<p class="small muted">Care Packs appear on product pages, product cards and in quotations at HP’s per-unit list price. '+withCp.length+' of '+all.length+' products have Care Packs ('+esc(byCat(withCp)||"none")+'). '+missing.length+' still need them ('+esc(byCat(missing)||"none")+').</p>'+
    '<div class="btn-row"><a class="btn" href="'+CPC_URL+'" target="_blank" rel="noopener noreferrer">'+ICON.ext+'Open HP Care Pack Central (Philippines)</a><button class="btn" data-act="cpi-missing">'+ICON.dl+'Part numbers still missing (CSV)</button></div>'+
    '<ol class="small" style="margin:0;padding-left:18px;display:grid;gap:3px"><li>Search a part number on HP Care Pack Central with the Philippines selected.</li><li>Export the results (Excel/CSV) or select and copy the results table.</li><li>Upload the file or paste the table below. If it doesn’t include the product part number, type it in “For part number”.</li><li>Check the preview and publish. Publishing replaces the Care Packs for those part numbers.</li></ol>'+
    '<div class="form-grid"><div class="field"><label for="cpi-pn">For part number (if the file has none)</label><input id="cpi-pn" value="'+esc(C.pn||"")+'" placeholder="e.g. CJ9R8PT"></div><div class="field"><label for="cpi-date">Prices retrieved on</label><input id="cpi-date" type="date" value="'+esc(C.date||today())+'"></div></div>'+
    '<div class="btn-row"><input type="file" id="cpi-file" accept=".xlsx,.csv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"></div>'+
    '<div class="field"><label for="cpi-paste">…or paste the table</label><textarea id="cpi-paste" rows="5" placeholder="Paste the copied results, including the header row">'+esc(C.paste||"")+'</textarea></div><div class="btn-row"><button class="btn" data-act="cpi-parse">Preview pasted table</button></div></section>'+
    prev+
    (imp.length?'<section class="panel"><div class="panel-h"><h2>Imported Care Packs</h2><span class="small muted">'+imp.length+' part number'+(imp.length===1?"":"s")+'</span></div><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Part number</th><th>Product</th><th class="r">Care Packs</th><th>Retrieved</th><th>By</th><th></th></tr></thead><tbody>'+imp.map(function(d){var p=bySku(d.pn);return '<tr><td><span class="sku">'+esc(d.pn)+'</span></td><td>'+esc(p?p.name:"—")+'</td><td class="r">'+(d.items||[]).length+'</td><td>'+fmtDate(d.retrieved)+'</td><td class="small">'+esc(d.updatedBy||"")+'</td><td><button class="btn btn-sm btn-quiet btn-danger" data-act="cpi-del" data-pn="'+esc(d.pn)+'">Remove</button></td></tr>';}).join("")+'</tbody></table></div></section>':'');}
function cpiPreview(sheets,file){A.cpi=A.cpi||{};A.cpi.pn=($("#cpi-pn")||{}).value||A.cpi.pn||"";A.cpi.date=($("#cpi-date")||{}).value||today();A.cpi.file=file||null;A.cpi.parsed=cpParse(sheets,A.cpi.pn);A.keepScroll=true;render();}
function cpiApply(){var C=A.cpi;if(!C||!C.parsed)return;var keys=Object.keys(C.parsed.byPn);if(!keys.length)return;
  confirmBox("Publish Care Packs?",'<p>This replaces the Care Packs for '+keys.length+' part number'+(keys.length===1?"":"s")+' for everyone, at the prices shown. Prices are HP list prices retrieved on '+fmtDate(C.date)+'.</p>',"Publish").then(function(ok){if(!ok)return;
    Promise.all(keys.map(function(k){var o=C.parsed.byPn[k];return A.db.doc("carepacks/"+k).set({pn:k,items:o.items,source:"HP Care Pack Central (Philippines)"+(C.file?" — "+C.file:""),retrieved:C.date,updatedAt:nowISO(),updatedBy:actorName()});}))
    .then(function(){audit("carepacks.import",keys.join(", "),keys.length+" part numbers");toast("Care Packs published for "+keys.length+" part number"+(keys.length===1?"":"s"));A.cpi=null;render();}).catch(writeErr);});}
function cpMissingCsv(){var rows=[["Part number to search in HP Care Pack Central","Full SKU","Product","Category"]];allProducts().sort(familySort).forEach(function(p){if(!carePacksFor(p).length)rows.push([baseSku(p.sku),p.sku,p.name,CATS[p.cat]||p.cat]);});return toCsv(rows);}
document.addEventListener("change",function(e){var el=e.target;if(el.id!=="cpi-file"||!el.files[0])return;var f=el.files[0];var isX=/\.xlsx$/i.test(f.name);
  (isX?f.arrayBuffer().then(readXlsx):f.text().then(function(t){return [{name:"",rows:/\t/.test(t.split("\n")[0])?t.split(/\r?\n/).map(function(l){return l.split("\t");}):readCsv(t)[0].rows}];})).then(function(sheets){cpiPreview(sheets,f.name);}).catch(function(err){toast("Couldn’t read that file: "+(err.message||"unknown format"),true);});});
document.addEventListener("click",function(e){var t=e.target.closest("[data-act]");if(!t)return;var a=t.getAttribute("data-act");
  if(a==="cpi-parse"){var txt=($("#cpi-paste")||{}).value||"";A.cpi=A.cpi||{};A.cpi.paste=txt;if(!txt.trim()){toast("Paste the copied table first",true);return;}var rows=/\t/.test(txt)?txt.split(/\r?\n/).map(function(l){return l.split("\t");}):readCsv(txt)[0].rows;cpiPreview([{name:"",rows:rows}],null);}
  else if(a==="cpi-cancel"){A.cpi=null;render();}
  else if(a==="cpi-apply")cpiApply();
  else if(a==="cpi-missing")saveFile("Care Pack lookup - part numbers to search.csv",cpMissingCsv());
  else if(a==="cpi-del"){var pn=t.getAttribute("data-pn");confirmBox("Remove imported Care Packs for "+pn+"?","<p>Quotations that already include them keep their lines.</p>","Remove",true).then(function(ok){if(!ok)return;A.db.doc("carepacks/"+pn).delete().then(function(){audit("carepacks.delete",pn);toast("Removed");}).catch(writeErr);});}
  else if(a==="cp-copypn")copyText(t.getAttribute("data-pn"),"Part number copied");
  else if(a==="cp-admin"){A.cpi={pn:t.getAttribute("data-pn")};A.adminTab="carepacks";go("admin");}});
