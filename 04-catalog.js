/* ============================== catalog ============================== */
var SERIES_ORDER=["ZBook 8","ZBook X","ZBook Ultra","HP 200 / 240 / 245","ProBook","EliteBook 6","EliteBook 8","EliteBook X","EliteBook Flip","Z1 Tower","Z2 Tower","Z2 Mini","ProDesk 5 G1i","Elite t655","Elite t660","Elite t755"];
var CAT_ORDER=["zbook","nb","tower","tc"];
function familySort(a,b){
  var c=CAT_ORDER.indexOf(a.cat)-CAT_ORDER.indexOf(b.cat);if(c)return c;
  var s=SERIES_ORDER.indexOf(a.series)-SERIES_ORDER.indexOf(b.series);if(s)return s;
  var m=String(a.model).localeCompare(String(b.model));if(m)return m;
  var z=(screenIn(a)||0)-(screenIn(b)||0);if(z)return z;
  return ((sellPrice(a.id)||{}).amount||0)-((sellPrice(b.id)||{}).amount||0);
}
function bandOf(p){var a=(sellPrice(p.id)||{}).amount;if(a==null)return noPriceLabel(p.id);if(p.cat==="nb")return a<80000?"Under ₱80k":a<120000?"₱80k–120k":a<160000?"₱120k–160k":"₱160k+";if(p.cat==="tc")return a<60000?"Under ₱60k":a<80000?"₱60k–80k":a<100000?"₱80k–100k":"₱100k+";return a<200000?"Under ₱200k":a<250000?"₱200k–250k":a<300000?"₱250k–300k":"₱300k+";}
/* ---------- storefront catalog: categories, facets, cards ---------- */
var CAT_META={
  zbook:{c:"#3d5fa8",icon:"laptop",short:"ZBook",title:"ZBook mobile workstations",desc:"Mobile workstations for CAD, 3D, video and data work on the go — professional graphics on most models."},
  nb:{c:"#0f7b6c",icon:"laptop",short:"Notebooks",title:"HP business notebooks",desc:"EliteBook and ProBook business notebooks with HP Wolf Security and enterprise manageability — plus HP 200 series value models."},
  tower:{c:"#7a4f9a",icon:"tower",short:"Z Desktop",title:"Z desktop workstations",desc:"Z tower and mini workstations with room to grow for design, rendering and simulation."},
  tc:{c:"#a0661a",icon:"tclient",short:"Thin clients",title:"Thin clients",desc:"Thin clients for VDI and cloud desktops — HP ThinPro, IGEL and Windows options, centrally managed."}
};
function catIcon(c){return ICON[(CAT_META[c]||{}).icon]||ICON.box;}
function catByTab(label){var k=null;Object.keys(CAT_TAB).forEach(function(c){if(CAT_TAB[c]===label)k=c;});return k;}
var LTB_RE=/\bltb\b|last.?time/i;
function isLTB(p){return promoTagsOf(p).some(function(a){return LTB_RE.test((a.tag||"")+" "+a.title);});}
function otherPromos(p){return promoTagsOf(p).filter(function(a){return !LTB_RE.test((a.tag||"")+" "+a.title);});}
function onHand(p){return p.stockQty>0||p.status==="in_stock"||p.status==="limited";}
function orderBasis(p){return !onHand(p)&&(p.status==="available"||isTBA(p.id));}
function availOf(p){var v=[];if(onHand(p))v.push("On-hand stock");else if(orderBasis(p))v.push("Order basis");else if(p.status==="unconfirmed")v.push("Stock to confirm");else v.push((STATUS[p.status]||STATUS.unconfirmed)[0]);
  if(isLTB(p))v.push("Last-time-buy");if(otherPromos(p).length)v.push("With promo");return v;}
var AVAIL_ORDER=["On-hand stock","Order basis","Stock to confirm","Last-time-buy","With promo"];
var BAND_ORDER=["Below ₱60,000","₱60,000–₱99,999","₱100,000–₱149,999","₱150,000–₱199,999","₱200,000–₱299,999","₱300,000+","Price TBA","No price"];
function priceBand(p){var a=(sellPrice(p.id)||{}).amount;if(a==null)return isTBA(p.id)?"Price TBA":"No price";return a<60000?BAND_ORDER[0]:a<100000?BAND_ORDER[1]:a<150000?BAND_ORDER[2]:a<200000?BAND_ORDER[3]:a<300000?BAND_ORDER[4]:BAND_ORDER[5];}
var FACETS=[
  ["Category",function(p){return CAT_TAB[p.cat]||p.cat;}],
  ["Availability",availOf],
  ["Processor",function(p){var s=String(p.specs.processor||"");return /amd|ryzen/i.test(s)?"AMD":/intel|core|xeon/i.test(s)?"Intel":"Other";}],
  ["Price range",priceBand],
  ["Family",function(p){return p.family||p.series;}],
  ["Memory",function(p){var r=ramGB(p);return r?r+"GB":"Not listed";}],
  ["Storage",function(p){var s=storageGB(p);return s?(s>=1000?(s/1000)+"TB":s+"GB"):"Not listed";}],
  ["Graphics",function(p){return dedicated(p)?gpuShort(p):"Integrated graphics";}],
  ["Screen size",function(p){return p.cat==="zbook"||p.cat==="nb"?(screenIn(p)?screenIn(p)+'"':"Not listed"):"";}],
  ["Operating system",function(p){return p.specs.os||"Not listed";}]
];
var FACET_LABEL={Family:"Series","Price range":"Price band",Category:"Category"};
var FACET_OPEN=["Category","Availability","Processor","Price range"];
function facetVals(f,p){return [].concat(f[1](p)).filter(Boolean);}
function facetSort(name,vals){
  var ord=name==="Price range"?BAND_ORDER:name==="Availability"?AVAIL_ORDER:name==="Category"?CAT_ORDER.map(function(c){return CAT_TAB[c];}):null;
  return vals.sort(function(a,b){if(ord){var ia=ord.indexOf(a),ib=ord.indexOf(b);return (ia<0?99:ia)-(ib<0?99:ib)||a.localeCompare(b);}var na=parseFloat(a),nb=parseFloat(b);if(!isNaN(na)&&!isNaN(nb)&&na!==nb)return na-nb;return a.localeCompare(b);});}
/* legacy A.catalog.cat (tabs, links) becomes the Category facet */
function normCatalog(){var C=A.catalog;if(C.cat&&C.cat!=="all"){C.f={Category:[CAT_TAB[C.cat]]};}C.cat="all";C.view=C.view||"grid";}
function catalogList(skip){
  normCatalog();var C=A.catalog;var terms=C.q.toLowerCase().split(/\s+/).filter(Boolean);
  return allProducts().filter(function(p){
    if(terms.length){var h=hayOf(p);if(!terms.every(function(t){return h.indexOf(t)>=0;}))return false;}
    return FACETS.every(function(f){if(f[0]===skip)return true;var sel=C.f[f[0]];if(!sel||!sel.length)return true;var v=facetVals(f,p);return sel.some(function(s){return v.indexOf(s)>=0;});});
  });
}
function catalogSorted(list){var C=A.catalog;var amt=function(p,d){var s=sellPrice(p.id);return s?s.amount:d;};
  return list.slice().sort(C.sort==="asc"?function(a,b){return amt(a,1e12)-amt(b,1e12);}:C.sort==="desc"?function(a,b){return amt(b,0)-amt(a,0);}:C.sort==="name"?function(a,b){return a.name.localeCompare(b.name);}:familySort);}
function activeFilterCount(){var C=A.catalog;return Object.keys(C.f).reduce(function(n,k){return n+(C.f[k]||[]).length;},0);}
/* each viewer is greeted by their own account name, or a name they choose (saved to their own private settings) */
function greetName(){var c=String((A.state&&A.state.callMe)||"").trim();if(c)return c;return A.me&&A.me.name?String(A.me.name).split(" ")[0]:"";}
function callMeEditor(){var cur=String((A.state&&A.state.callMe)||"");var acct=A.me&&A.me.name?A.me.name:"";
  modal({title:"What should we call you?",body:'<p class="small muted" style="margin-bottom:10px">Shown in the greeting on the Products page. Only you see it.'+(acct?' Your account name is '+esc(acct)+'.':'')+'</p><div class="field"><label for="callme">Name</label><input id="callme" maxlength="40" value="'+esc(cur)+'" placeholder="'+esc(acct?acct.split(" ")[0]:"Your name")+'"></div>',
    actions:[["Use my account name","reset","btn-quiet"],["Cancel","close"],["Save","save","btn-primary"]],
    onAction:function(a,w){if(a==="reset"){A.state.callMe="";}else if(a==="save"){A.state.callMe=String(w.querySelector("#callme").value||"").trim().slice(0,40);}else return;saveState();closeModal();A.keepScroll=true;render();toast("Greeting updated");}});}
function greetLine(){var h=new Date().getHours();var part=h<12?"Good morning":h<18?"Good afternoon":"Good evening";var live=(typeof newsList==="function"?newsList("current"):[]).filter(function(a){return a.kind==="promo"&&newsState(a)==="live";}).length;
  return part+" — prices updated "+fmtUpdate(lastUpdate()).replace(/,.*$/,"")+". "+(live?live+" live promo"+(live===1?"":"s")+" to share.":"Quotes ready when you are.");}
function monthTag(){var d=String(lastUpdate()||today()).slice(0,10);var m=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"][+d.slice(5,7)-1];return m+" "+d.slice(0,4);}
function tatText(){return String(S("orderTat")||"").trim();}
function orderNotice(){var t=tatText();return '<div class="sf-note">'+ICON.cart+'<span><b>Order basis models:</b> '+(t?'estimated '+esc(t)+' TAT (turnaround time) — delivery timeline is not guaranteed.':'price and delivery timeline are confirmed when the order is placed — the lead time is not guaranteed.')+' On-hand stock is available while stocks last.</span></div>';}
function sfLanding(all){
  var name=greetName();var inStock=all.filter(onHand).length;var imgs=heroImgs();
  var feats=[[ICON.shield,"HP Wolf Security","Hardware-enforced protection from the BIOS up — HP Sure Start, Sure Click and Sure Sense on business models."],
    [ICON.win,"Windows 11 Pro","BitLocker, Windows Hello and Intune / Autopilot ready for business IT on Windows models."],
    [ICON.chip,"Intel Core Ultra & AMD Ryzen","Latest-generation processors and pro graphics for everyday AI-assisted and creative work."],
    [ICON.award,"HP Care Packs","Extend coverage — onsite, accidental damage and travel — listed per part number for business notebooks."]];
  return '<section class="sf-hero"><div class="sf-hero-copy">'+
    '<div class="sf-greet"><b>Hi'+(name?", "+esc(name):"")+'!'+(A.uid&&canSave()?'<button class="sf-greet-edit" data-act="call-me" title="Change the name shown here" aria-label="Change the name shown here">'+ICON.user+'</button>':'')+'</b><span>'+esc(greetLine())+'</span></div>'+
    '<span class="sf-eyebrow">'+monthTag()+' · HP commercial pricelist</span>'+'<span class="sf-upd"><i aria-hidden="true"></i>Price list last updated <b>'+esc(fmtUpdate(lastUpdate()))+'</b></span>'+
    '<h1>Built for work.<span>Ready to quote.</span></h1>'+
    '<p>HP ZBook and Z workstations, EliteBook and ProBook business notebooks and thin clients — on-hand stock and order-basis models, with HP Care Packs and promos, all in one pricelist.<sup>1</sup></p>'+
    '<div class="btn-row"><button class="btn btn-primary btn-lg" data-act="sf-jump">View pricelist '+ICON.arrowDown+'</button><button class="btn btn-soft btn-lg" data-act="quick" data-v="On-hand stock">'+ICON.box3+'On-hand stock · '+inStock+'</button></div></div>'+
    (imgs.length?'<div class="sf-hero-art" aria-hidden="true">'+imgs.slice(0,4).map(function(im,i){return '<div class="sf-plate s'+i+'"><img src="/_blob/'+esc(im.id)+'" alt=""></div>';}).join("")+'</div>':'')+'</section>'+
    '<div class="sf-feats">'+feats.map(function(f){return '<div class="sf-feat"><span class="sf-fi">'+f[0]+'</span><div><b>'+esc(f[1])+'</b><p>'+esc(f[2])+'<sup>1</sup></p></div></div>';}).join("")+'</div>'+
    '<p class="sf-foot-note"><sup>1</sup> Features vary by model — open any model for its complete specifications.</p>'+newsTile()+
    '<div class="sf-sec-h" id="sf-top"><span class="sf-eyebrow">'+monthTag()+' commercial pricelist</span><h2 class="sf-h">All Products</h2><p>Every model on the current pricelists — on-hand stock, last-time-buy units and order-basis models. Search, filter and open any model for its complete specifications, Care Packs and data sheet.</p>'+orderNotice()+'</div>'+
    '<div class="sf-catcards">'+CAT_ORDER.map(function(c){var n=all.filter(function(p){return p.cat===c;}).length;if(!n)return "";var m=CAT_META[c];return '<button class="sf-catcard" style="--c:'+m.c+'" data-act="nav-cat" data-cat="'+c+'"><span class="sf-ci">'+catIcon(c)+'</span><span><b>'+esc(m.title)+'</b><small>'+n+' model'+(n===1?"":"s")+'</small></span></button>';}).join("")+'</div>';
}
function sfCatHeader(c,list){var m=CAT_META[c]||{};var C=A.catalog;
  var t=c?m.title:C.q?"Results for “"+C.q+"”":"Filtered products";
  return '<div class="sf-sec-h sf-sec-top" id="sf-top"'+(c?' style="--c:'+m.c+'"':'')+'><span class="sf-eyebrow">HP commercial pricelist'+(c?' · '+esc(CAT_TAB[c]):'')+'</span><h1 class="sf-h">'+esc(t)+'</h1>'+'<span class="sf-upd"><i aria-hidden="true"></i>Price list last updated <b>'+esc(fmtUpdate(lastUpdate()))+'</b></span>'+(c?'<p>'+esc(m.desc)+'</p>':'')+orderNotice()+'</div>';}
function facetGroup(f,cnt,vals){var C=A.catalog;var key=f[0];var sel=C.f[key]||[];var more=(A.facetMore||{})[key];var lim=more?999:7;
  var rows=vals.map(function(v,i){var on=sel.indexOf(v)>=0;return '<label class="sf-chk'+(i>=lim&&!on?" is-hid":"")+(!cnt[v]&&!on?" is-dis":"")+'"><input type="checkbox" data-facet="'+esc(key)+'" value="'+esc(v)+'"'+(on?" checked":"")+(!cnt[v]&&!on?" disabled":"")+'><span>'+esc(v)+'</span><i>'+cnt[v]+'</i></label>';}).join("");
  var label=FACET_LABEL[key]||key;var open=FACET_OPEN.indexOf(key)>=0||sel.length>0||(A.facetOpen&&A.facetOpen[key]);
  return '<details class="sf-fg" data-facetd="'+esc(key)+'"'+(open?" open":"")+'><summary>'+esc(label)+(key==="Price range"?' <small>(selling)</small>':'')+(sel.length?' <span class="fc-n">'+sel.length+'</span>':'')+'</summary><div class="sf-fl">'+rows+(vals.length>lim?'<button class="sf-more" data-act="facet-more" data-k="'+esc(key)+'">'+(more?"Show fewer":"Show all "+vals.length)+'</button>':'')+'</div></details>';}
function viewCatalog(){
  normCatalog();var C=A.catalog;var all=allProducts();var list=catalogList();var sorted=catalogSorted(list);
  var selCats=C.f.Category||[];var oneCat=selCats.length===1?catByTab(selCats[0]):null;var nAct=activeFilterCount();
  var facets=FACETS.map(function(f){var base=catalogList(f[0]);var cnt={};all.forEach(function(p){facetVals(f,p).forEach(function(v){if(!(v in cnt))cnt[v]=0;});});base.forEach(function(p){facetVals(f,p).forEach(function(v){cnt[v]=(cnt[v]||0)+1;});});
    var vals=facetSort(f[0],Object.keys(cnt));if(vals.length<2&&!(C.f[f[0]]||[]).length)return "";return facetGroup(f,cnt,vals);}).join("");
  var chips=Object.keys(C.f).reduce(function(a,k){return a.concat((C.f[k]||[]).map(function(v){return '<button class="sf-fchip" data-act="unfacet" data-k="'+esc(k)+'" data-v="'+esc(v)+'">'+esc(v)+' <span aria-hidden="true">×</span><span class="sr">Remove</span></button>';}));},[]);
  if(C.q)chips.unshift('<button class="sf-fchip" data-act="unq">“'+esc(C.q)+'” <span aria-hidden="true">×</span></button>');
  var q=activeDraft();var qn=q?(q.items||[]).filter(function(it){return it.kind==="product";}).length:0;
  var view=C.view==="list"?"list":"grid";
  var body="";
  if(!sorted.length)body='<div class="sf-empty">No products match these filters. <button class="btn btn-sm" data-act="reset-filters">Clear all filters</button></div>';
  else if(C.sort==="family"||!C.sort){CAT_ORDER.forEach(function(c){var ps=sorted.filter(function(p){return p.cat===c;});if(!ps.length)return;var m=CAT_META[c];
      body+='<div class="sf-gh" style="--c:'+m.c+'"><span class="sf-gi">'+catIcon(c)+'</span><h2>'+esc(m.title)+'</h2><span class="sf-gn">'+ps.length+' model'+(ps.length===1?"":"s")+'</span>'+(oneCat?'':'<button class="sf-only" data-act="nav-cat" data-cat="'+c+'">View only '+esc(m.short)+'</button>')+'</div>'+
        (view==="list"?'<div class="sf-rows">'+ps.map(sfRow).join("")+'</div>':'<div class="sf-grid">'+ps.map(card).join("")+'</div>');});}
  else body=view==="list"?'<div class="sf-rows">'+sorted.map(sfRow).join("")+'</div>':'<div class="sf-grid">'+sorted.map(card).join("")+'</div>';
  var hideF=A.showFacets===false||(A.showFacets==null&&window.innerWidth<900);
  return (selCats.length||C.q?sfCatHeader(oneCat,list):sfLanding(all))+
    '<section class="sf-panel" id="sf-list"><aside class="sf-filters" id="facets"'+(hideF?" hidden":"")+' aria-label="Filters"><div class="sf-fh"><b>Filters</b>'+(nAct||C.q?'<button class="sf-link" data-act="reset-filters">Clear all</button>':'')+'</div>'+facets+'</aside>'+
    '<div class="sf-res"><div class="sf-tools"><span class="sf-count">'+(nAct||C.q?'<b>'+list.length+'</b> of '+all.length+' products match':'<b>'+all.length+'</b> products')+'</span>'+
      '<div class="sf-tbtns"><button class="btn sf-ftog" data-act="toggle-facets">'+ICON.filter+'Filters'+(nAct?' ('+nAct+')':'')+'</button><button class="btn" data-go="match">'+ICON.match+'Match specs</button><button class="btn btn-primary" data-act="price-xlsx">'+ICON.dl+'Download</button><button class="btn" data-act="qb-open">'+ICON.quote+'Quote'+(qn?' <span class="sf-badge">'+qn+'</span>':'')+'</button>'+
      '<select class="sel" id="cat-sort" aria-label="Sort"><option value="family">Sort: Pricelist order</option><option value="asc"'+(C.sort==="asc"?" selected":"")+'>Price: low to high</option><option value="desc"'+(C.sort==="desc"?" selected":"")+'>Price: high to low</option><option value="name"'+(C.sort==="name"?" selected":"")+'>Name: A–Z</option></select>'+
      '<div class="sf-view" role="group" aria-label="View"><button data-act="view" data-v="grid" aria-pressed="'+(view==="grid")+'">'+ICON.grid+'Grid</button><button data-act="view" data-v="list" aria-pressed="'+(view==="list")+'">'+ICON.list+'List</button></div></div></div>'+
      (chips.length?'<div class="sf-fchips">'+chips.join("")+'</div>':'')+body+'</div></section>';
}
function groupHead(g,cat,ps){var amts=ps.map(function(p){return (sellPrice(p.id)||{}).amount;}).filter(function(v){return v!=null;});
  return '<div class="grp-h"><span class="grp-bar"></span><div><span class="sc-cat">'+esc(CAT_SHORT[cat]||"")+'</span><h2>'+esc(g)+'</h2></div><span class="grp-k">'+ps.length+' SKU'+(ps.length===1?"":"s")+(amts.length?' · from <b>'+peso(Math.min.apply(null,amts))+'</b>':'')+'</span></div>';}
function cardMenuBtn(p){return '<button class="sf-ib" data-copymenu="'+p.id+'" aria-label="Share or copy '+esc(p.sku)+'" title="Share / copy">'+ICON.share+'</button>';}
/* short spec rows with icons */
function cpuShort(s){return String(s||"").replace(/\s*\(.*$/,"").replace(/^Intel\s+/i,"").replace(/^Core\s+(Ultra|i\d)/i,"$1").replace(/^AMD\s+/i,"").replace(/ processor$/i,"").replace(/ with .*/i,"");}
function osShort(s){return String(s||"").replace(/Windows\s*11\s*Pro.*/i,"Win 11 Pro").replace(/Windows\s*11\s*Home.*/i,"Win 11 Home").replace(/HP ThinPro.*/i,"HP ThinPro");}
function specRows(p){var s=p.specs||{},r=ramGB(p),st=storageGB(p);var out=[[ICON.chip,cpuShort(s.processor)],[ICON.mem,r?r+"GB"+(/ddr\d|lpddr\d/i.test(s.memory||"")?" "+(/(lp)?ddr\d/i.exec(s.memory)[0].toUpperCase()):""):s.memory],[ICON.disk,st?(st>=1000?(st/1000)+"TB":st+"GB")+(/flash|emmc/i.test(s.storage||"")?" flash":" SSD"):s.storage]];
  if(dedicated(p))out.push([ICON.gpu,gpuShort(p)+(s.vram&&!/shared/i.test(s.vram)?" "+s.vram.replace(/\s*GDDR.*$/i,""):"")]);
  if((p.cat==="zbook"||p.cat==="nb")&&screenIn(p))out.push([ICON.screen,screenIn(p)+'" '+(/(WUXGA|FHD|QHD|UHD|WQXGA|2\.8K|3K|OLED)/i.exec(s.display||"")||[""])[0]]);
  out.push([ICON.win,osShort(s.os)]);if(s.warranty)out.push([ICON.shield,String(s.warranty).replace(/\s*\(.*$/,"")]);
  return out.filter(function(x){return x[1]&&String(x[1]).trim();});}
function stockPill(p){if(p.stockQty>0)return p.stockQty<=2?'<span class="sf-st warn">Limited qty · '+p.stockQty+' pc'+(p.stockQty===1?"":"s")+'</span>':'<span class="sf-st ok">On hand · '+p.stockQty+' pcs</span>';
  if(onHand(p))return '<span class="sf-st ok">On hand</span>';
  if(orderBasis(p))return '<div class="sf-ob">'+ICON.clock+'<span><b>Order basis'+(isTBA(p.id)?' · price TBA':'')+'</b><small>'+(tatText()?esc(tatText())+' TAT · delivery not guaranteed':'Lead time confirmed on order')+'</small></span></div>';
  if(p.status==="unconfirmed")return '<span class="sf-st mute">Stock to confirm</span>';
  return statusTag(p);}
function cpChip(p){if(typeof carePacksFor!=="function")return "";var all=carePacksFor(p).filter(function(c){return c.price!=null;});if(!all.length)return "";var min=Math.min.apply(null,all.map(function(c){return c.price;}));
  return '<button class="sf-cpchip" data-open="'+p.id+'" data-anchor="carepacks">'+ICON.shield+'<b>'+all.length+' Care Pack'+(all.length===1?"":"s")+'</b> · from '+peso(min)+'</button>';}
var PSUB={srp:"Suggested retail",dp:"Dealer price",onhand:"On-hand stock",order:"Order basis",special:"Special price",promo:"Promo price",bundle:"Bundle price"};
function priceCols(p){var sp=sellPrice(p.id);if(!sp)return '<div class="sf-pr"><div><small>Price</small><b class="tba">'+(isTBA(p.id)?"TBA":"—")+'</b><span>'+(isTBA(p.id)?"To be advised":"Confirm with PM")+'</span></div></div>';
  var r=priceRec(p.id);var ts=priceTypes(p.id).filter(function(t){return t!==sp.type;});var pref=sp.type==="srp"?"dp":sp.type==="onhand"?"order":null;var t2=ts.indexOf(pref)>=0?pref:ts[0];
  return '<div class="sf-pr"><div><small>'+esc(PTYPE_SHORT[sp.type])+'</small><b>'+peso(sp.amount)+'</b><span>'+esc(PSUB[sp.type]||"")+'</span></div>'+(t2?'<div class="alt"><small>'+esc(PTYPE_SHORT[t2])+'</small><b>'+peso(r.types[t2].amount)+'</b><span>'+esc(PSUB[t2]||"")+'</span></div>':'')+'</div>';}
function card(p){
  var im=imgOf(p);var m=CAT_META[p.cat]||{};var inQ=inActiveQuote(p.id);var inCmp=A.compare.indexOf(p.id)>=0;var ltb=isLTB(p);var promos=otherPromos(p);
  var badge=ltb?'<span class="sf-badge-t red">'+ICON.clock+'Last time buy</span>':orderBasis(p)?'<span class="sf-badge-t navy">'+ICON.cart+'Order basis</span>':'';
  return '<article class="sf-card" style="--c:'+(m.c||"#56657a")+'">'+
    '<button class="sf-img" data-open="'+p.id+'" aria-label="Open '+esc(p.name)+'">'+(im.length?'<img src="/_blob/'+esc(im[0].id)+'" alt="" loading="lazy">':'<span class="sf-noimg">'+catIcon(p.cat)+'<small>Photo coming soon</small></span>')+badge+
      (promos.length?'<span class="sf-promo">'+ICON.tag+esc(promos[0].tag||"Promo")+'</span>':'')+(im.length>1?'<span class="sf-imgn">'+ICON.copy+im.length+'</span>':'')+'</button>'+
    '<div class="sf-cb"><div class="sf-chips"><span class="sf-hp">HP</span><span class="sf-cc">'+esc(m.short||CAT_SHORT[p.cat]||"")+'</span>'+(onHand(p)?'<span class="sf-av ok">'+ICON.box3+'On-hand stock</span>':orderBasis(p)?'<span class="sf-av navy">'+ICON.cart+'Order basis</span>':'')+'</div>'+
      '<h3><button data-open="'+p.id+'">'+esc(p.name)+'</button></h3><div class="sf-pn"><small>PN</small> '+esc(p.sku)+'</div>'+
      '<ul class="sf-specs">'+specRows(p).map(function(x){return '<li>'+x[0]+'<span>'+esc(x[1])+'</span></li>';}).join("")+'</ul>'+
      '<div class="sf-meta">'+stockPill(p)+(promos.length>1?promos.slice(1).map(function(a){return '<span class="sf-perk">'+ICON.gift+esc(a.tag||a.title)+'</span>';}).join(""):'')+(ltb?'<span class="sf-perk red">'+ICON.gift+'LTB freebie bundle</span>':'')+cpChip(p)+'</div>'+
      priceCols(p)+
      '<div class="sf-acts"><button class="btn btn-sm" data-open="'+p.id+'">Specs</button><button class="btn btn-sm '+(inQ?"sf-added":"btn-primary")+'" '+(inQ?'data-act="qb-open"':'data-addq="'+p.id+'"')+'>'+(inQ?ICON.check+"Added":ICON.plus+"Quote")+'</button>'+cardMenuBtn(p)+'</div></div></article>';
}
function sfRow(p){var im=imgOf(p);var inQ=inActiveQuote(p.id);var m=CAT_META[p.cat]||{};
  return '<article class="sf-row" style="--c:'+(m.c||"#56657a")+'"><button class="sf-rimg" data-open="'+p.id+'" aria-label="Open '+esc(p.name)+'">'+(im.length?'<img src="/_blob/'+esc(im[0].id)+'" alt="" loading="lazy">':catIcon(p.cat))+'</button>'+
    '<div class="sf-rmain"><h3><button data-open="'+p.id+'">'+esc(p.name)+'</button></h3><div class="sf-pn"><small>PN</small> '+esc(p.sku)+'</div><div class="sf-rspec">'+specRows(p).map(function(x){return esc(x[1]);}).join(" · ")+'</div></div>'+
    '<div class="sf-rst">'+stockPill(p)+(isLTB(p)?'<span class="sf-perk red">Last time buy</span>':'')+otherPromos(p).map(function(a){return '<span class="sf-perk">'+esc(a.tag||"Promo")+'</span>';}).join("")+'</div>'+priceCols(p)+
    '<div class="sf-acts"><button class="btn btn-sm '+(inQ?"sf-added":"btn-primary")+'" '+(inQ?'data-act="qb-open"':'data-addq="'+p.id+'"')+'>'+(inQ?ICON.check+"Added":ICON.plus+"Quote")+'</button>'+cardMenuBtn(p)+'</div></article>';}
function copyMenu(anchor,id){var p=P(id);popMenu(anchor,[
  [A.compare.indexOf(id)>=0?"Remove from compare":"Add to compare",function(){toggleCompare(id);}],
  ["Copy specifications with price",function(){copyText(copyLines(p,"price"),"Specs and price copied");}],
  ["Copy full specifications",function(){copyText(copyLines(p,"full"),"Full specifications copied");}],
  ["Copy short specifications",function(){copyText(copyLines(p,"short"),"Short specs copied");}],
  ["Download data sheet (PDF)",function(){downloadDatasheet(id,false);}],
  ["Download data sheet with price (PDF)",function(){downloadDatasheet(id,true);}],
  ["Copy SKU and product name",function(){copyText(copyLines(p,"sku"),"SKU copied");}]
]);}
function toggleCompare(id){var i=A.compare.indexOf(id);if(i>=0)A.compare.splice(i,1);else{if(A.compare.length>=4){toast("Compare holds up to 4 models. Remove one first.",true);return;}A.compare.push(id);}A.keepScroll=true;render();}
function renderTray(){
  var t=document.getElementById("tray");if(!t)return;
  if(!A.compare.length||A.route.name==="compare"){t.innerHTML="";return;}
  t.innerHTML='<div class="tray" role="region" aria-label="Compare tray"><span class="small">Compare</span><div class="chips">'+A.compare.map(function(id){var p=P(id);return p?'<span class="chip">'+esc(p.sku)+'<button data-uncmp="'+id+'" aria-label="Remove '+esc(p.sku)+'">×</button></span>':"";}).join("")+'</div><button class="btn btn-sm btn-primary" data-go="compare"'+(A.compare.length<2?" disabled":"")+'>Compare '+A.compare.length+'</button></div>';
}

/* ============================== product detail ============================== */
function viewProduct(id){
  var p=P(id);if(!p)return '<div class="panel empty">This product is not in the database. It may have been removed. <button class="btn btn-sm" data-go="catalog">Back to products</button></div>';
  if(A.lastViewed!==id){A.lastViewed=id;setTimeout(function(){trackView(id);},0);}
  var imgs=imgOf(p);var gi=Math.min(A.galIdx||0,Math.max(0,imgs.length-1));
  var r=priceRec(id)||{types:{}};var sp=sellPrice(id);var flags=priceFlags(id);
  var groups=SPEC_GROUPS.map(function(g){var rows=g[1].filter(function(k){return p.specs[k[0]];});
    var missing=g[1].filter(function(k){return !p.specs[k[0]];}).map(function(k){return k[1];});
    if(!rows.length&&["Physical","Connectivity"].indexOf(g[0])<0)return "";
    return '<tbody><tr><th scope="rowgroup" colspan="2">'+esc(g[0])+'</th></tr>'+(rows.length?rows.map(function(k){return '<tr><th scope="row">'+esc(k[1])+'</th><td>'+esc(p.specs[k[0]])+'</td></tr>';}).join(""):'<tr><th scope="row">'+esc(missing.slice(0,3).join(", "))+'</th><td class="unv">Not listed</td></tr>')+'</tbody>';}).join("");
  var repl=p.replacement?bySku(p.replacement):null;
  var siblings=allProducts().filter(function(x){return x.model===p.model&&x.id!==p.id&&x.cat===p.cat;}).sort(familySort).slice(0,12);
  return '<div class="btn-row"><button class="btn btn-quiet" data-back>'+ICON.back+'Back</button><span class="muted small">'+esc(CATS[p.cat])+' / '+esc(p.family)+'</span></div>'+
  '<div class="page-h"><div><div class="btn-row"><span class="sku sku-lg">'+esc(p.sku)+'</span>'+statusTag(p)+promoTagsHtml(p)+'</div><h1 style="margin-top:6px">'+esc(p.name)+'</h1><p>'+esc(p.desc||"")+'</p></div>'+
    '<div class="btn-row"><button class="icon-btn" data-fav="'+p.id+'" aria-pressed="'+isFav(p.id)+'" aria-label="Favorite">'+(isFav(p.id)?ICON.starOn:ICON.star)+'</button><button class="btn" data-cmp="'+p.id+'">'+(A.compare.indexOf(p.id)>=0?"In compare":"Compare")+'</button><button class="btn" data-copymenu="'+p.id+'">'+ICON.copy+'Copy Specifications & Price</button><button class="btn" data-ds="'+p.id+'">'+ICON.dl+'Data sheet</button>'+(UPG_SERIES[p.family]&&p.cat!=="tc"?'<button class="btn" data-go="upgrade" data-arg="'+esc(p.id)+'">'+ICON.chip+'Upgrade options</button>':'')+'<button class="btn btn-primary" data-addq="'+p.id+'">Add to quotation</button></div></div>'+
  (p.status==="discontinued"||p.status==="replacement"?'<div class="notice bad"><b>'+(STATUS[p.status]||[""])[0]+'.</b> '+(repl?'Approved replacement: <span class="sku">'+esc(repl.sku)+'</span> '+esc(repl.name)+'. <button class="btn btn-sm" data-cmp-repl="'+p.id+'">Compare with replacement</button> Confirm suitability before substituting.':'No replacement has been mapped yet.')+'</div>':'')+
  '<div class="pd"><div style="display:grid;gap:12px;align-content:start">'+
    '<section class="panel panel-b">'+(imgs.length?'<button class="gal-main" data-zoom="/_blob/'+esc(imgs[gi].id)+'" aria-label="Enlarge image"><img src="/_blob/'+esc(imgs[gi].id)+'" alt="'+esc(p.name+" "+(imgs[gi].view||""))+'"></button><div class="gal-thumbs">'+imgs.map(function(im,i){return '<button data-gal="'+i+'" aria-current="'+(i===gi)+'" aria-label="'+esc(im.view||"View "+(i+1))+'" title="'+esc(im.view||"")+'"><img src="/_blob/'+esc(im.id)+'" alt=""></button>';}).join("")+'</div><p class="small muted" style="margin-top:6px">'+esc(imgs[gi].view?imgs[gi].view+" · ":"")+esc(imgScopeNote(p))+'</p>':'<div class="gal-main" style="cursor:default"><div class="no-img" style="font-size:13px">'+esc(p.family)+'<br><span style="font-weight:400">No official images uploaded yet</span></div></div><p class="small muted" style="margin-top:6px">'+(A.isAdmin?'Upload HP images in Admin → Images.':'An admin can upload official HP images.')+'</p>')+'</section>'+
    '<section class="panel"><div class="panel-h"><h2>Pricing</h2><span class="small muted">'+(r.vatInclusive===false?"VAT exclusive":"VAT inclusive")+' · '+esc(r.currency||"PHP")+'</span></div><div class="panel-b price-box">'+
      '<div class="ptypes">'+(priceTypes(id).length?priceTypes(id).map(function(t){return '<div class="ptype'+(sp&&sp.type===t?" primary":"")+'"><span>'+esc(PTYPES[t])+(sp&&sp.type===t?" · approved selling":"")+'</span><b>'+peso(r.types[t].amount)+'</b></div>';}).join(""):(isTBA(id)?'<div class="ptype"><span>Order basis · no stock on hand</span><b>Price TBA</b></div><div class="small muted">Price is advised on request. Confirm with your product manager before quoting.</div>':'<div class="muted">No price on record.</div>'))+'</div>'+
      (flags.length?'<div class="btn-row">'+flags.map(function(f){return '<span class="tag '+f.c+'">'+esc(f.t)+'</span>';}).join("")+'</div>':'')+
      (A.isAdmin?'<div class="small muted">Source: '+esc(r.source||"—")+' · effective '+fmtDate(r.effective)+(r.expires?' · expires '+fmtDate(r.expires):' · no expiry set')+' · verified '+fmtDate(r.verifiedAt)+(r.updatedBy?' · last change by '+esc(r.updatedBy):'')+'</div>':'<div class="small muted">Effective '+fmtDate(r.effective)+(r.expires?' · until '+fmtDate(r.expires):'')+' · updated '+esc(fmtUpdate(r.updatedAt||r.verifiedAt))+'</div>')+
      (p.stockQty!=null?'<div class="small">Stock: <b>'+p.stockQty+' pcs</b> as of '+fmtDate(p.stockAsOf)+'</div>':'')+'</div></section>'+(typeof carePackPanel==="function"?(carePackPanel(p)||cpcLookupPanel(p)):"")+
  '</div><div style="display:grid;gap:12px;align-content:start"><section class="panel"><div class="panel-h"><h2>Specifications</h2>'+(A.isAdmin?'<span class="small muted">'+esc(p.specSource||"")+'</span>':'')+'</div><table class="spec-tbl">'+groups+'</table>'+(A.isAdmin?specSourcesHtml(p):'')+'</section>'+(typeof hpDetails==="function"&&hpDetails(p)?itemDetailsHtml(p,{title:"More details"}):"")+featuresPanel(p)+componentsPanel(p)+
    ((p.features||[]).length&&!(p.cat==="nb"&&(p.components||[]).length)?'<section class="panel panel-b"><h3>Business features</h3><ul style="margin:6px 0 0;padding-left:18px">'+p.features.map(function(f){return '<li>'+esc(f)+'</li>';}).join("")+'</ul></section>':'')+
    (siblings.length?'<section class="panel"><div class="panel-h"><h2>Other '+esc(p.model)+' configurations</h2></div><div class="tbl-wrap"><table class="tbl"><thead><tr><th>SKU</th><th>Key differences</th><th class="r">Price</th><th></th></tr></thead><tbody>'+siblings.map(function(x){var d=SPEC_KEYS.filter(function(k){return x.specs[k]!==p.specs[k]&&["processor","memory","storage","graphics","vram","screen","display","os","wifi","io"].indexOf(k)>=0;}).map(function(k){return x.specs[k]||"—";}).slice(0,4).join(" · ");var xs=sellPrice(x.id);return '<tr><td><span class="sku">'+esc(x.sku)+'</span></td><td class="small">'+esc(d||"Same key specs")+'</td><td class="r">'+(xs?peso(xs.amount):"—")+'</td><td><button class="btn btn-sm" data-open="'+x.id+'">Open</button></td></tr>';}).join("")+'</tbody></table></div></section>':'')+
  '</div></div>';
}
