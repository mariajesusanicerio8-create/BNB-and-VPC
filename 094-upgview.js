/* ============================== Upgradeability Checker — page ============================== */
function upgMatches(q){q=String(q||"").toLowerCase().trim();var all=upgSkus();if(!q)return all;var terms=q.split(/\s+/);
  return all.filter(function(p){var h=[p.sku,baseSku(p.sku),p.name,p.family,(p.specs||{}).processor,(p.specs||{}).graphics,(p.specs||{}).memory].join(" ").toLowerCase();return terms.every(function(t){return h.indexOf(t)>=0;});});}
function upgOption(p,i,active){var sp=sellPrice(p.id);return '<li role="option" id="upo-'+i+'" aria-selected="'+(i===active)+'" data-upick="'+esc(p.id)+'"><span class="sku">'+esc(p.sku)+'</span><span class="grow">'+esc(p.name.replace(/^HP /,""))+'<small>'+esc([(p.specs||{}).processor,(p.specs||{}).memory,(p.specs||{}).storage].filter(Boolean).join(" · "))+'</small></span>'+(sp?'<b>'+peso(sp.amount)+'</b>':'')+'</li>';}
function upgListHtml(q){var m=upgMatches(q);A.upgActive=Math.min(A.upgActive||0,Math.max(0,m.length-1));
  if(!m.length){var tc=allProducts().filter(function(p){return p.cat==="tc";}).some(function(p){return (p.sku+" "+p.name).toLowerCase().indexOf(String(q).toLowerCase().trim())>=0;});
    return '<li class="upg-none">'+(tc?"Thin clients aren’t covered by the checker — it lists HP workstations only.":"No workstation SKU matches “"+esc(q)+"”. Try a SKU like CJ9R8PT or a model like “X G2i”.")+'</li>';}
  return m.map(function(p,i){return upgOption(p,i,A.upgActive);}).join("");}
function viewUpgrade(id){
  var p=id?P(id):null;if(p&&!UPG_SERIES[p.family])p=null;
  if(p&&A.upgLogged!==p.id){A.upgLogged=p.id;setTimeout(function(){if(typeof logEvent==="function")logEvent("upgrade",{pid:p.id});},0);}
  var skus=upgSkus(),fams=uniq(skus.map(function(x){return x.family;}));
  var picker='<section class="panel panel-b upg-pick"><label for="up-q" class="label">Search a workstation by SKU or model</label>'+
    '<div class="upg-combo"><div class="upg-inp">'+ICON.search+'<input id="up-q" role="combobox" aria-expanded="false" aria-controls="up-list" aria-autocomplete="list" autocomplete="off" placeholder="e.g. CJ9R8PT, DR1N0PT, ZBook X G2i, Z2 Tower" value="'+esc(p?p.sku:(A.upgQ||""))+'">'+
      (p||A.upgQ?'<button class="btn btn-sm btn-quiet" data-act="upg-clear">'+ICON.x+'Clear selection</button>':'')+'</div>'+
      '<ul class="upg-list" id="up-list" role="listbox" hidden></ul></div>'+
    '<div class="upg-chips">'+fams.map(function(f){return '<div class="upg-fam"><span>'+esc(f.replace(/^HP /,""))+'</span>'+skus.filter(function(x){return x.family===f;}).map(function(x){return '<button class="upg-chip" data-upick="'+esc(x.id)+'" aria-pressed="'+(p&&p.id===x.id)+'">'+esc(x.sku)+'</button>';}).join("")+'</div>';}).join("")+'</div></section>';
  var head=banner({compact:true,updated:'Upgrade data checked <b>'+esc(fmtDate(UPG_VERIFIED))+'</b>',title:"Upgradeability Checker",sub:"Pick an HP workstation SKU to see what can be upgraded, the maximum HP supports, the recommended upgrade path and the full item details — ports, size, weight, display, battery and more.",
    chips:[[skus.length,"workstation SKUs"],[fams.length,"series"]]});
  var body="";
  if(!p)body='<section class="panel empty upg-empty">'+ICON.chip+'<b>Select a SKU to check its upgrade options.</b><span>Covers every ZBook and Z workstation on the price list. Thin clients aren’t included.</span></section>';
  else body=upgResultHtml(upgReport(p));
  var admin=A.isAdmin?upgAdminHtml(p):"";
  return head+picker+body+admin;}
function upgResultHtml(R){var p=R.p,S=R.S,M=S.mem,D=S.ssd,mi=R.mem,si=R.ssd;var sp=sellPrice(p.id);
  var memRow=R.rows[0],ssdRow=R.rows[1];
  var tile=function(lbl,big,sub,cls){return '<div class="upg-tile'+(cls?" "+cls:"")+'"><span>'+esc(lbl)+'</span><b>'+big+'</b><small>'+sub+'</small></div>';};
  var memMaxSku=M.soldered?(mi.total||"—")+" GB":M.skuMax+" GB";
  return '<section class="panel upg-res" aria-live="polite"><div class="upg-prod"><button class="thumb" data-open="'+esc(p.id)+'" aria-label="Open '+esc(p.name)+'">'+thumbHtml(p)+'</button><div class="grow"><div class="btn-row"><span class="sku sku-lg">'+esc(p.sku)+'</span>'+statusTag(p)+'</div><h2>'+esc(p.name)+'</h2><span class="small muted">'+esc([(p.specs||{}).processor,(p.specs||{}).graphics].filter(Boolean).join(" · "))+'</span></div>'+
    '<div class="upg-prod-a">'+(sp?'<div class="price">'+peso(sp.amount)+'<small>'+esc(PTYPES[sp.type])+'</small></div>':'')+'<div class="btn-row"><button class="btn btn-sm" data-open="'+esc(p.id)+'">Product page</button><button class="btn btn-sm" data-act="upg-copy" data-id="'+esc(p.id)+'">'+ICON.copy+'Copy summary</button><button class="btn btn-sm btn-quiet" data-act="upg-clear">'+ICON.x+'Clear selection</button></div></div></div>'+
    '<div class="upg-tiles">'+
      (M.soldered?tile("Memory",(mi.total||"—")+" GB",esc(M.type.split(",")[0]),"info"):
        tile("Max RAM (this SKU)",memMaxSku,"Installed "+(mi.total||"—")+" GB · family max "+M.familyMax+" GB",mi.total>=M.skuMax?"info":"ok")+
        tile("RAM slots",(mi.n!=null?mi.n+" of "+M.slots+" used":M.slots+" slots"),(mi.n!=null?(M.slots-mi.n)+" free":"Layout not listed"),""))+
      tile("Max storage (this SKU)",esc(D.skuMax),"Installed "+(si.n?si.caps.map(gbTxt).join(" + "):"—"),"ok")+
      tile("M.2 SSD slots",(D.slots?si.n+" of "+D.slots+" used":"—"),D.second?(D.slots-si.n>0?"Can add "+(D.slots-si.n)+" more SSD"+(D.slots-si.n>1?"s":""):"Upgrade by replacing a drive"):"Upgrade by replacing the drive","")+
    '</div>'+
    '<div class="tbl-wrap"><table class="tbl upg-tbl"><thead><tr><th>Component</th><th>Installed configuration</th><th>Upgradeable?</th><th>Maximum supported</th><th>Upgrade notes</th></tr></thead><tbody>'+
    R.shown.map(function(r){return '<tr><th scope="row">'+esc(r.c)+'</th><td>'+esc(r.inst)+'</td><td>'+upgStatus(r.st)+'</td><td class="small'+(r.max==="—"?" nomax":"")+'">'+esc(r.max)+'</td><td class="small">'+esc(r.note)+'</td></tr>';}).join("")+'</tbody></table></div>'+
    '<div class="upg-cols"><div class="upg-box ok"><h3>Recommended upgrade path</h3><ol>'+R.paths.map(function(x){return '<li>'+esc(x)+'</li>';}).join("")+'</ol></div>'+
    '<div class="upg-box warn"><h3>Limitations &amp; rules</h3><ul>'+(R.limits.length?R.limits.map(function(x){return '<li>'+esc(x)+'</li>';}).join(""):'<li>None noted.</li>')+'</ul></div></div>'+
    '<div class="upg-legend small">'+["up","cond","max"].map(function(k){return upgStatus(k)+' <span class="muted">'+{up:"a supported upgrade is confirmed",cond:"depends on configuration or restrictions",max:"already at HP’s maximum"}[k]+'</span>';}).join(" · ")+'</div>'+
  '</section>'+itemDetailsHtml(p,{title:"Item details",note:"Specifications for this configuration. Dimensions and weight vary by configuration."});}
function upgAdminHtml(p){var gaps=upgGapsAll();
  var srcHtml=p?(function(){var S=UPG_SERIES[p.family];var keys=uniq([].concat(S.mem.src||[],S.ssd.src||[],(S.battery||{}).src||[],(S.psu||{}).src||[],["pl"]));
    return '<div><h3 style="margin:0 0 6px">Sources for '+esc(p.family)+'</h3><ul class="small upg-src">'+keys.map(function(k){var s=UPG_SRC[k];return s?'<li>'+(s.u?'<a href="'+esc(s.u)+'" target="_blank" rel="noopener">'+esc(s.t)+'</a>':esc(s.t))+'</li>':'';}).join("")+'</ul>'+
      (S.gaps&&S.gaps.length?'<h3 style="margin:10px 0 6px">Open questions for this series</h3><ul class="small">'+S.gaps.map(function(g){return '<li>'+esc(g)+'</li>';}).join("")+'</ul>':'')+'</div>';})():'';
  return '<section class="panel panel-b upg-admin"><div class="panel-h" style="padding:0 0 10px;border:0"><h2>Verification (admin only)</h2><div class="btn-row"><button class="btn btn-sm" data-act="upg-xlsx">'+ICON.dl+'Download upgrade database (Excel)</button></div></div>'+
    '<p class="small muted" style="margin:0 0 10px">Checked '+esc(fmtDate(UPG_VERIFIED))+' against HP product pages (incl. hp.com/ph-en), HP Store configurators and HP Maintenance & Service Guides. HP QuickSpecs PDFs couldn’t be read automatically, so they were not used. Installed configuration comes from the HP AV codes in the price list for each SKU. Sales users don’t see this panel or the source links.</p>'+
    '<div class="upg-cols">'+srcHtml+'<div><h3 style="margin:0 0 6px">SKUs with incomplete or unverified information ('+gaps.length+' of '+upgSkus().length+')</h3>'+(function(){var by={};gaps.forEach(function(x){var k=x.p.family+"|"+x.g.join("¦");(by[k]=by[k]||{f:x.p.family,g:x.g,ps:[]}).ps.push(x.p);});
      return '<div class="upg-gaps">'+Object.keys(by).map(function(k){var o=by[k];return '<div class="upg-gap"><b>'+esc(o.f.replace(/^HP /,""))+'</b> <span class="btn-row" style="display:inline-flex;gap:4px">'+o.ps.map(function(p){return '<button data-upick="'+esc(p.id)+'" class="sku">'+esc(p.sku)+'</button>';}).join("")+'</span><ul class="small">'+o.g.map(function(g){return '<li>'+esc(g)+'</li>';}).join("")+'</ul></div>';}).join("")+'</div>';})()+'</div></div></section>';}
function upgSummaryText(p){var R=upgReport(p);return [p.name+" — SKU "+p.sku,"Upgrade options (checked "+fmtDate(UPG_VERIFIED)+"):"].concat(R.shown.map(function(r){return "• "+r.c+": "+r.inst+" — "+UPG_STATUS[r.st][0]+(r.max&&r.max!=="—"?" (max: "+r.max+")":"");})).concat(["","Recommended upgrade path:"]).concat(R.paths.map(function(x){return "• "+x;})).concat(R.limits.length?["","Notes:"].concat(R.limits.map(function(x){return "• "+x;})):[]).join("\n");}
/* combobox wiring (input updates only the list, so focus is kept) */
function upgOpen(open){var l=$("#up-list"),i=$("#up-q");if(!l||!i)return;l.hidden=!open;i.setAttribute("aria-expanded",open?"true":"false");}
function upgRefreshList(){var i=$("#up-q"),l=$("#up-list");if(!i||!l)return;A.upgQ=i.value;l.innerHTML=upgListHtml(i.value);upgOpen(true);var a=l.querySelector('[aria-selected="true"]');i.setAttribute("aria-activedescendant",a?a.id:"");if(a)a.scrollIntoView({block:"nearest"});}
function upgPick(id){A.upgQ="";A.upgActive=0;go("upgrade",id);}
document.addEventListener("input",function(e){if(e.target&&e.target.id==="up-q"){A.upgActive=0;upgRefreshList();}});
document.addEventListener("focusin",function(e){if(e.target&&e.target.id==="up-q"){e.target.select();upgRefreshList();}});
document.addEventListener("keydown",function(e){var i=e.target;if(!i||i.id!=="up-q")return;var n=upgMatches(i.value).length;
  if(e.key==="ArrowDown"){e.preventDefault();A.upgActive=Math.min(n-1,(A.upgActive||0)+1);upgRefreshList();}
  else if(e.key==="ArrowUp"){e.preventDefault();A.upgActive=Math.max(0,(A.upgActive||0)-1);upgRefreshList();}
  else if(e.key==="Enter"){e.preventDefault();var m=upgMatches(i.value);if(m.length)upgPick(m[A.upgActive||0].id);}
  else if(e.key==="Escape"){upgOpen(false);}});
document.addEventListener("click",function(e){var t=e.target.closest&&e.target.closest("[data-upick]");if(t){e.preventDefault();upgPick(t.getAttribute("data-upick"));return;}
  if(!(e.target.closest&&e.target.closest(".upg-combo")))upgOpen(false);});
/* Excel: full database (admin, with sources) */
function upgradeWorkbook(withSources){
  var skus=upgSkus();var head=["Series","SKU","Description","Component","Installed configuration","Upgradeable?","Maximum supported","Upgrade notes"].concat(withSources?["Sources"]:[]);
  var rows=[[null,{v:S("companyName")+" × HP — Workstation Upgradeability",s:1}],[null,{v:"Checked "+fmtDate(UPG_VERIFIED)+"   ·   Downloaded "+fmtDate(today()),s:10}],[null,{v:"Status: Upgradeable / Conditional / At maximum. Confirm with HP before committing to a client.",s:2}],[],head.map(function(h){return {v:h,s:3};})];
  skus.forEach(function(p){var R=upgReport(p);rows.push([{v:p.family+"   ·   "+p.sku+"   ·   "+p.name,s:7}].concat(head.slice(1).map(function(){return {v:"",s:7};})));
    R.shown.forEach(function(r){rows.push([{v:p.family,s:8},{v:p.sku,s:8},{v:p.name,s:4},{v:r.c,s:8},{v:r.inst,s:4},{v:UPG_STATUS[r.st][0],s:8},{v:r.max,s:4},{v:r.note,s:4}].concat(withSources?[{v:(r.src||[]).map(function(k){return UPG_SRC[k]?UPG_SRC[k].u||UPG_SRC[k].t:"";}).filter(Boolean).join("\n"),s:4}]:[]));});
    rows.push([{v:"",s:0},{v:"",s:0},{v:"Upgrade path",s:8},{v:R.paths.join("\n"),s:4}]);});
  var main={name:"Upgradeability",cols:[18,13,34,16,36,18,26,60].concat(withSources?[50]:[]),rows:rows,rowHeights:{1:26,2:15,3:15,5:22},freeze:{row:5,col:2},logos:true};
  var sheets=[main];
  if(withSources){var g=[[null,{v:"SKUs with incomplete or unverified information",s:1}],[],[{v:"SKU",s:3},{v:"Model",s:3},{v:"Open items",s:3}]];upgGapsAll().forEach(function(x){g.push([{v:x.p.sku,s:8},{v:x.p.name,s:4},{v:x.g.join("\n"),s:4}]);});
    var src=[[null,{v:"Sources",s:1}],[],[{v:"Source",s:3},{v:"Link",s:3}]];Object.keys(UPG_SRC).forEach(function(k){src.push([{v:UPG_SRC[k].t,s:4},{v:UPG_SRC[k].u,s:4}]);});
    sheets.push({name:"Verification gaps",cols:[14,40,100],rows:g,rowHeights:{1:26},logos:false});sheets.push({name:"Sources",cols:[70,110],rows:src,rowHeights:{1:26},logos:false});}
  return buildXlsx(sheets);}
function downloadUpgradeXlsx(){if(!A.isAdmin)return;try{saveFile(S("companyName").replace(/\s*Inc\.?$/,"")+" HP Workstation Upgradeability "+today()+".xlsx",upgradeWorkbook(true));}catch(e){console.error(e);toast("Couldn’t build the Excel file",true);}}
