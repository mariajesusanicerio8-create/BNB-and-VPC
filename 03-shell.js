/* ============================== shell & router ============================== */
var NAV=[["dash","Dashboard",ICON.dash],["catalog","Products",ICON.box],["compare","Compare",ICON.cmp],["match","Requirements",ICON.match],["quotes","Quotations",ICON.quote],["prices","Price list",ICON.price],["upgrade","Upgrade checker",ICON.chip],["news","Promos & news",ICON.megaphone],["assistant","Sales assistant",ICON.bot]];
function renderShell(){
  var app=document.getElementById("app");
  app.innerHTML='<div class="sf-shell"><header class="sf-top"><div class="sf-bar">'+
    '<button class="sf-brand" data-act="home" aria-label="'+esc(S("companyName"))+' HP pricelist home"><img src="'+LOGO.hp+'" alt="HP"><img src="'+LOGO.iontech+'" alt="'+esc(S("companyName"))+'"><span class="sf-div" aria-hidden="true"></span><span class="sf-title"><b>HP Pricelist</b><small>Workstations · Notebooks · Thin clients</small></span></button>'+
    '<form class="search" id="gsearch" role="search">'+ICON.search+'<textarea id="gq" rows="1" placeholder="Search model, part no., processor…" aria-label="Search products"></textarea><kbd>/</kbd></form>'+
    '<div class="sf-acts-top"><button class="sf-tb" data-act="qb-open" title="Quotation">'+ICON.quote+'<span class="hide-sm">Quote</span><b id="qcount" class="sf-badge" hidden></b></button><button class="sf-tb" data-act="theme" id="themeBtn"></button><button class="sf-tb" data-act="menu" id="menuBtn" aria-haspopup="true" aria-expanded="false">'+ICON.menu+'<span class="hide-sm">Menu</span></button></div></div>'+
    '<nav class="sf-nav" id="rail" aria-label="Categories and quick filters"></nav><div class="sf-menu" id="sfmenu" hidden></div></header>'+
    '<main class="content" id="view" tabindex="-1"></main></div><div id="tray"></div><div id="qtray"></div>';
  var gq=document.getElementById("gq");
  gq.addEventListener("keydown",function(e){if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();runGlobalSearch(gq.value);}});
  gq.addEventListener("input",function(){gq.style.height="36px";if(gq.value.indexOf("\n")>=0)gq.style.height=Math.min(120,gq.scrollHeight)+"px";});
  applyTheme();
}
function isDark(){var t=document.documentElement.getAttribute("data-theme");if(t)return t==="dark";return !!(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches);}
function applyTheme(){var t=null;try{t=localStorage.getItem("sf-theme");}catch(e){}if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t);
  var b=document.getElementById("themeBtn");if(b)b.innerHTML=isDark()?ICON.sun+'<span class="hide-sm">Light</span>':ICON.moon+'<span class="hide-sm">Dark</span>';}
function toggleTheme(){var t=isDark()?"light":"dark";document.documentElement.setAttribute("data-theme",t);try{localStorage.setItem("sf-theme",t);}catch(e){}applyTheme();}
var MENU_ITEMS=[["catalog","Products","Browse, filter and quote every model",ICON.box],["prices","Price list","All prices by category and series",ICON.price],["compare","Compare","Side by side, 2–4 models",ICON.cmp],["match","Match specs","Paste a client brief, get qualifying models",ICON.match],["quotes","Quotations","Your saved and finalized quotations",ICON.quote],["upgrade","Upgrade checker","Workstation RAM, SSD and other options",ICON.chip],["news","Promos & news","Approved promos and announcements",ICON.megaphone],["assistant","Sales assistant","Ask about specs, prices and stock",ICON.bot]];
function renderRail(){
  var r=document.getElementById("rail");if(!r)return;normCatalog();
  var C=A.catalog,onCat=A.route.name==="catalog"||(A.route.name==="dash"&&!A.isAdmin);var sel=C.f.Category||[];var av=C.f.Availability||[];var all=allProducts();
  var pills=[["all","All Products",ICON.grid,"#0f1b2d"]].concat(CAT_ORDER.filter(function(c){return all.some(function(p){return p.cat===c;});}).map(function(c){return [c,CAT_META[c].short,catIcon(c),CAT_META[c].c];}));
  var quick=[["On-hand stock","q-ok",ICON.box3,all.some(onHand)],["Last-time-buy","q-red",ICON.clock,all.some(isLTB)],["With promo","q-or",ICON.tag,all.some(function(p){return otherPromos(p).length;})]].filter(function(x){return x[3];});
  r.innerHTML='<div class="sf-navin"><div class="sf-cats">'+pills.map(function(x){var cur=onCat&&(x[0]==="all"?!sel.length:sel.length===1&&sel[0]===CAT_TAB[x[0]]);return '<button class="sf-cat" data-act="nav-cat" data-cat="'+x[0]+'" style="--c:'+x[3]+'"'+(cur?' aria-current="page"':'')+'>'+x[2]+'<span>'+esc(x[1])+'</span></button>';}).join("")+'</div>'+
    (quick.length?'<span class="sf-sep" aria-hidden="true"></span><div class="sf-quick">'+quick.map(function(x){return '<button class="sf-q '+x[1]+'" data-act="quick" data-v="'+esc(x[0])+'" aria-pressed="'+(onCat&&av.indexOf(x[0])>=0)+'">'+x[2]+'<span>'+esc(x[0]==="With promo"?"Promos":x[0])+'</span></button>';}).join("")+'</div>':'')+'</div>';
  var cur=A.route.name;if(cur==="dash"&&!A.isAdmin)cur="catalog";if(cur==="product"||cur==="search")cur="catalog";if(cur==="quote")cur="quotes";if(cur==="docs")cur="news";
  var items=MENU_ITEMS.slice();if(A.isAdmin)items=[["dash","Dashboard","Whole-catalog summary (admin)",ICON.dash]].concat(items).concat([["stats","Statistics","Team activity (admin)",ICON.chart],["admin","Admin","Prices, import, images (admin)",ICON.admin]]);
  var badge=function(k){var n=k==="compare"?A.compare.length:k==="news"?newsList("current").length:k==="quotes"?A.quotes.filter(function(q){return q.status==="draft";}).length:0;return n?'<span class="sf-badge">'+n+'</span>':'';};
  var mn=document.getElementById("sfmenu");if(mn)mn.innerHTML='<div class="sf-menu-in"><div class="sf-mgrid">'+items.map(function(n){return '<button class="sf-mi" data-go="'+n[0]+'"'+(cur===n[0]?' aria-current="page"':'')+'><span class="sf-mic">'+n[3]+'</span><span><b>'+esc(n[1])+badge(n[0])+'</b><small>'+esc(n[2])+'</small></span></button>';}).join("")+'</div>'+
    '<div class="sf-mfoot">'+ICON.user+'<span>'+(A.me&&A.me.name?esc(A.me.name)+" · ":"")+(A.isAdmin?"Editor (admin)":A.uid?"Sales user":"Read-only")+' · Prices '+(S("pricesIncludeVat")?"include":"exclude")+' VAT</span></div></div>';
  var qc=document.getElementById("qcount");if(qc){var q=activeDraft();var n=q?(q.items||[]).filter(function(it){return it.kind==="product";}).length:0;qc.textContent=n||"";qc.hidden=!n;}
}
function toggleMenu(force){var m=document.getElementById("sfmenu"),b=document.getElementById("menuBtn");if(!m)return;var open=force!=null?force:m.hidden;m.hidden=!open;if(b)b.setAttribute("aria-expanded",open);}
document.addEventListener("click",function(e){var m=document.getElementById("sfmenu");if(!m||m.hidden)return;if(e.target.closest("#sfmenu .sf-mi")){toggleMenu(false);return;}if(!e.target.closest("#sfmenu")&&!e.target.closest("#menuBtn"))toggleMenu(false);});
document.addEventListener("keydown",function(e){if(e.key==="Escape")toggleMenu(false);});
function go(name,arg,noPush){
  A.route={name:name,arg:arg||null};
  if(!noPush){var h=name+(arg?"-"+arg:"");try{if(location.hash.slice(1)!==h)history.pushState(null,"","#"+h);}catch(e){}}
  closeModal();toggleMenu(false);
  window.scrollTo(0,0);render();
}
function parseHash(){var h=(location.hash||"").slice(1);if(!h)return {name:"dash"};var i=h.indexOf("-");var n=i>0?h.slice(0,i):h;var a=i>0?h.slice(i+1):null;
  if(["dash","catalog","compare","match","quotes","quote","prices","docs","news","upgrade","assistant","admin","stats","product","search"].indexOf(n)<0)return {name:"dash"};return {name:n,arg:a};}
window.addEventListener("popstate",function(){var r=parseHash();go(r.name,r.arg,true);});

function render(){
  renderRail();
  var v=document.getElementById("view");if(!v)return;
  if(A.noDb){v.innerHTML='<div class="gate"><h1>Sign in to use the sales workspace</h1><p class="muted">This workspace keeps products, prices and quotations in a shared database. Open it from claude.ai while signed in with your team account. If you were sent this link, ask the owner to share it with you.</p></div>';return;}
  if(!A.ready||!A.loaded.products||!A.loaded.prices){v.innerHTML='<div class="panel panel-b" style="display:grid;gap:10px"><div class="label">Loading products and prices…</div><div class="skel" style="width:60%"></div><div class="skel" style="width:80%"></div><div class="skel" style="width:40%"></div></div>';return;}
  var r=A.route,html="";
  try{
    if(!allProducts().length&&r.name!=="admin"&&r.name!=="stats")html=emptyCatalog();
    else if(r.name==="dash")html=viewDash();
    else if(r.name==="catalog")html=viewCatalog();
    else if(r.name==="product")html=viewProduct(r.arg);
    else if(r.name==="search")html=viewSearch(r.arg);
    else if(r.name==="compare")html=viewCompare();
    else if(r.name==="match")html=viewMatch();
    else if(r.name==="quotes")html=viewQuotes();
    else if(r.name==="quote")html=viewQuote(r.arg);
    else if(r.name==="prices")html=viewPrices();
    else if(r.name==="news"||r.name==="docs")html=viewNews();
    else if(r.name==="upgrade")html=viewUpgrade(r.arg);
    else if(r.name==="assistant")html=viewAssistant();
    else if(r.name==="admin")html=viewAdmin();
    else if(r.name==="stats")html=viewStats();
    else html=viewDash();
  }catch(e){console.error(e);html='<div class="notice bad"><b>Something went wrong showing this page.</b> '+esc(e.message)+'</div>';}
  var keep=v.querySelector("[data-keep]");var y=window.scrollY;
  v.innerHTML=html+siteFoot();renderTray();if(typeof renderQTray==="function")renderQTray();
  if(A.afterRender){var f=A.afterRender;A.afterRender=null;f();}
  if(A.keepScroll){window.scrollTo(0,y);A.keepScroll=false;}
}
function siteFoot(){var n=allProducts().length;return '<footer class="site-foot"><span class="foot-logos"><img src="'+LOGO.hp+'" alt="HP"><img src="'+LOGO.iontech+'" alt="'+esc(S("companyName"))+'"></span><span><span>Prices may change without prior notice; ask for an updated price before quoting. Prices in Philippine Peso (₱)'+(S("pricesIncludeVat")?", VAT inclusive":", VAT exclusive")+'. SRP = suggested retail price; DP = dealer price. For internal sales and dealer reference only — prices and specifications are subject to change without notice. Availability labels are indicative; confirm actual stock with your account manager. Order-basis models: '+(tatText()?'estimated '+esc(tatText())+' TAT (turnaround time); delivery timeline is not guaranteed.':'price and delivery timeline are confirmed on order and the lead time is not guaranteed.')+'</span><span class="faint">'+esc(S("companyName"))+' · HP Workstations, Business Notebooks &amp; Thin Clients · '+n+' products · updated '+esc(fmtUpdate(lastUpdate()))+(A.isAdmin?' · sources: IONTECH WS &amp; TC price list Oct 2026; Iontech BNB Price Guide Sep 2026; HP Care Pack Central (PH)':'')+'. HP and the HP logo are trademarks of HP Inc.</span></span></footer>';}
function emptyCatalog(){return '<div class="gate"><h1>No products yet</h1><p class="muted">The product database is empty.'+(A.isAdmin?' Import the approved price list in Admin → Import.':' Ask an admin to import the approved price list.')+'</p>'+(A.isAdmin?'<div><button class="btn btn-primary" data-go="admin">Open Admin</button></div>':'')+'</div>';}

/* ============================== global search ============================== */
var SKU_RE=/^[A-Z0-9]{5,8}(#[A-Z0-9]{3})?$/i;
function tokensAsSkus(q){var t=q.split(/[\s,;|\t]+/).map(function(x){return x.trim().replace(/^["']|["']$/g,"");}).filter(Boolean);var sk=t.filter(function(x){return SKU_RE.test(x)&&/\d/.test(x)&&/[A-Z]/i.test(x);});return {tokens:t,skus:sk};}
function runGlobalSearch(q){
  q=String(q||"").trim();if(!q)return;trackSearch(q);
  var ts=tokensAsSkus(q);
  if(ts.skus.length>=2&&ts.skus.length>=ts.tokens.length*0.6){go("search","multi");A.searchQ=q;render();return;}
  if(ts.skus.length===1&&ts.tokens.length===1){var p=bySku(ts.skus[0]);if(p){go("product",p.id);return;}}
  var crit=parseRequirements(q);
  if(crit._signals>=2){A.matchText=q;A.matchAI=null;A.lastMatch=null;go("match");return;}
  A.searchQ=q;go("search","text");
}
function hayOf(p){var s=p.specs||{};return [p.sku,baseSku(p.sku),p.name,p.family,p.series,p.model,CATS[p.cat],CAT_SHORT[p.cat],s.processor,s.graphics,s.vram,s.memory,s.storage,s.os,s.screen&&s.screen+" inch",s.display,s.warranty,s.chassis,p.cat==="nb"?"notebook laptop business "+(p.line||""):"",promoTagsOf(p).map(function(a){return "promo "+(a.tag||"")+" "+a.title;}).join(" "),(STATUS[p.status]||[""])[0]].join(" ").toLowerCase();}
function textSearch(q){
  var terms=q.toLowerCase().replace(/["']/g,"").split(/\s+/).filter(Boolean);
  var exact=bySku(q);
  var res=allProducts().filter(function(p){var h=hayOf(p);return terms.every(function(t){return h.indexOf(t)>=0;});});
  res.sort(function(a,b){return familySort(a,b);});
  if(exact){res=[exact].concat(res.filter(function(p){return p!==exact;}));}
  return {res:res,exact:exact};
}
function viewSearch(mode){
  var q=A.searchQ||"";
  if(mode==="multi"){
    var ts=tokensAsSkus(q);var rows=ts.skus.map(function(s){return {q:s,p:bySku(s)};});
    var found=rows.filter(function(r){return r.p;}),miss=rows.filter(function(r){return !r.p;});
    return '<div class="page-h"><div><h1>SKU lookup</h1><p>'+rows.length+' SKUs pasted · '+found.length+' found · '+miss.length+' not recognized</p></div><div class="btn-row">'+
      (found.length?'<button class="btn" data-act="multi-copy">'+ICON.copy+'Copy all with prices</button><button class="btn" data-act="multi-cmp"'+(found.length>4?' title="First 4 are compared"':'')+'>Compare</button><button class="btn btn-primary" data-act="multi-quote">Add all to quotation</button>':'')+'</div></div>'+
      (miss.length?'<div class="notice bad"><b>Not recognized:</b> '+miss.map(function(r){return '<span class="sku">'+esc(r.q)+'</span>';}).join(" ")+' — these SKUs are not in the product database. Check for typos or ask an admin to add them.</div>':'')+
      '<div class="panel"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Pasted</th><th>Product</th><th>Key specs</th><th>Status</th><th class="r">Price</th><th></th></tr></thead><tbody>'+
      rows.map(function(r){if(!r.p)return '<tr class="row-bad"><td class="mono">'+esc(r.q)+'</td><td colspan="5">Not recognized</td></tr>';var p=r.p,sp=sellPrice(p.id);
        return '<tr><td class="mono">'+esc(r.q)+'</td><td><button class="btn-link-like" data-open="'+p.id+'" style="all:unset;cursor:pointer;color:var(--accent)">'+esc(p.name)+'</button><br><span class="sku">'+esc(p.sku)+'</span></td><td class="small">'+esc([p.specs.processor,p.specs.memory,p.specs.storage,gpuShort(p)].filter(Boolean).join(" · "))+'</td><td>'+statusTag(p)+'</td><td class="r">'+(sp?peso(sp.amount)+'<br><span class="small muted">'+PTYPE_SHORT[sp.type]+'</span>':"—")+'</td><td>'+cardMenuBtn(p)+'</td></tr>';}).join("")+'</tbody></table></div></div>';
  }
  var r=textSearch(q);
  return '<div class="page-h"><div><h1>Results for “'+esc(q)+'”</h1><p>'+r.res.length+' product'+(r.res.length===1?"":"s")+(r.exact?' · exact SKU match shown first':'')+'</p></div><div class="btn-row"><button class="btn" data-act="search-to-match">Use as client requirements</button></div></div>'+
    (r.res.length?'<div class="cards">'+r.res.slice(0,60).map(card).join("")+'</div>':'<div class="panel empty">No products match all of those words. Try fewer words, a family name such as “ZBook X”, or describe the requirement (e.g. “16-inch, 32GB, RTX, under ₱250,000”).</div>');
}

/* ============================== banner + admin dashboard ============================== */
function heroImgs(){var out=["ZBook-X_G2i_16in","Z2-Tower_G1i","TC_Elite-t755"].map(function(k){var s=A.imagesets[k];return s&&s.images&&s.images[0]?{id:s.images[0].id,label:s.label||k}:null;}).filter(Boolean);
  var nb=allProducts().filter(function(p){return p.cat==="nb"&&(p.images||[]).length;}).sort(function(a,b){return (b.line==="elitex")-(a.line==="elitex");})[0];
  if(nb){var im=nb.images.filter(function(x){return /front-right/i.test(x.view||"");})[0]||nb.images[0];out.push({id:im.id,label:nb.family});}return out;}
function banner(o){o=o||{};var imgs=heroImgs();
  return '<section class="hero'+(o.compact?' hero-compact':'')+'" aria-label="'+esc(S("companyName"))+' workspace">'+
    '<div class="hero-copy"><span class="hero-brands"><img src="'+LOGO.iontech+'" alt="'+esc(S("companyName"))+'"><i aria-hidden="true">×</i><img src="'+LOGO.hp+'" alt="HP"><span class="hero-eyebrow">'+esc(S("companyName"))+' <i></i> HP Workstations, Notebooks &amp; Thin Clients</span></span>'+
    (o.updated!==false?'<span class="hero-upd"><span class="dot" aria-hidden="true"></span>'+(o.updated?o.updated:'Price list last updated <b>'+esc(fmtUpdate(lastUpdate()))+'</b>')+'</span>':'')+
    '<h1>'+(o.title||"Find, compare and quote the right HP workstation")+'</h1>'+
    '<p>'+(o.sub||"Approved prices, stock and full specifications for every ZBook, EliteBook, ProBook, Z desktop and thin client we carry.")+'</p>'+
    (o.chips?'<div class="hero-chips">'+o.chips.map(function(c){return '<span><b>'+c[0]+'</b>'+esc(c[1])+'</span>';}).join("")+'</div>':'')+
    (o.actions?'<div class="btn-row hero-actions">'+o.actions+'</div>':'')+'</div>'+
    (imgs.length?'<div class="hero-art" aria-hidden="true">'+imgs.map(function(im,i){return '<div class="plate p'+i+'"><img src="/_blob/'+esc(im.id)+'" alt=""></div>';}).join("")+'</div>':'')+
  '</section>';}
function seriesSummary(){var g={};allProducts().forEach(function(p){var k=p.family||p.series||"Other";var x=g[k]=g[k]||{name:k,cat:p.cat,ps:[],units:0,inStock:0,avail:0,unconf:0,disc:0,min:null,max:null,img:null};x.ps.push(p);
    if(p.stockQty>0){x.units+=p.stockQty;x.inStock++;}if(p.status==="available")x.avail++;if(p.status==="unconfirmed")x.unconf++;if(p.status==="discontinued"||p.status==="replacement")x.disc++;
    var sp=sellPrice(p.id);if(sp){x.min=x.min==null?sp.amount:Math.min(x.min,sp.amount);x.max=x.max==null?sp.amount:Math.max(x.max,sp.amount);}if(!x.img){var im=imgOf(p);if(im.length)x.img=im[0].id;}});
  var order=Object.keys(CATS);return Object.keys(g).map(function(k){return g[k];}).sort(function(a,b){return order.indexOf(a.cat)-order.indexOf(b.cat)||a.name.localeCompare(b.name);});}
function viewDash(){
  if(!A.isAdmin)return viewCatalog();
  var ps=allProducts(),ss=seriesSummary();
  var units=ps.reduce(function(a,p){return a+(p.stockQty>0?p.stockQty:0);},0);
  var inStock=ps.filter(function(p){return p.stockQty>0;}).length,avail=ps.filter(function(p){return p.status==="available";}).length,unconf=ps.filter(function(p){return p.status==="unconfirmed";}).length;
  var flagged=ps.filter(function(p){return priceFlags(p.id).some(function(f){return f.k==="expired"||f.k==="unapproved"||f.k==="stale"||f.k==="missing";});});
  var low=ps.filter(function(p){return p.stockQty>0&&p.stockQty<=2;});
  var chg=A.changes.filter(function(c){return c.at&&daysBetween(c.at.slice(0,10),today())<=30;}).slice(0,8);
  var repl=ps.filter(function(p){return p.status==="discontinued"||p.status==="replacement"||p.replacement;});
  var anns=A.announcements.filter(function(a){return !a.expires||a.expires>=today();}).slice(0,5);
  var name=A.me&&A.me.name?A.me.name.split(" ")[0]:"";
  var tile=function(v,l,sub,cls){return '<div class="stat-tile'+(cls?" "+cls:"")+'"><b>'+v+'</b><span>'+esc(l)+'</span>'+(sub?'<small>'+sub+'</small>':'')+'</div>';};
  var tools=[["catalog","Products","Browse and filter all SKUs",ICON.box],["compare","Compare","Side by side, 2–4 SKUs",ICON.cmp],["match","Requirements","Turn a client brief into picks",ICON.match],["prices","Price list","Approved prices and flags",ICON.price],["stats","Statistics","Team activity",ICON.chart],["admin","Admin","Prices, import, images",ICON.admin]];
  return banner({title:(name?"Good day, "+esc(name)+".":"Good day.")+" Here’s the whole catalog at a glance.",sub:"Only you can see this dashboard. Sales users land on the product catalog.",chips:[[ps.length,"SKUs"],[ss.length,"series"],[units,"units on hand"]]})+
  '<div class="stat-tiles">'+tile(ps.length,"Total SKUs",Object.keys(CATS).map(function(c){return ps.filter(function(p){return p.cat===c;}).length+" "+({zbook:"ZBook",nb:"notebook",tower:"desktop",tc:"thin client"}[c]||c);}).join(" · "))+tile(inStock,"In stock",units+" units on hand","good")+tile(avail,"Available for ordering")+tile(unconf,"Stock unconfirmed","no qty in the price list",unconf?"warn":"")+tile(flagged.length,"Prices need attention","expired, unapproved, missing or stale",flagged.length?"bad":"good")+tile(low.length,"Low stock","2 units or fewer",low.length?"warn":"")+'</div>'+newsTile()+
  '<section class="panel"><div class="panel-h"><h2>Catalog by series</h2><span class="small muted">Approved selling prices, VAT inclusive</span></div><div class="series-grid">'+ss.map(function(x){
    return '<button class="series-card" data-family="'+esc(x.name)+'"><span class="thumb">'+(x.img?'<img src="/_blob/'+esc(x.img)+'" alt="" loading="lazy">':'<span class="no-img">'+esc(x.name)+'</span>')+'</span><span class="sc-body"><span class="sc-cat">'+esc(CATS[x.cat]||"")+'</span><b>'+esc(x.name)+'</b><span class="sc-price">'+(x.min!=null?(x.min===x.max?peso(x.min):peso(x.min)+' – '+peso(x.max)):x.ps.every(function(p){return isTBA(p.id);})?"Price TBA":"No price")+'</span><span class="sc-meta"><span>'+x.ps.length+' SKU'+(x.ps.length>1?"s":"")+'</span>'+(x.units?'<span class="tag t-ok">'+x.units+' on hand</span>':'')+(x.avail?'<span class="tag t-info">'+x.avail+' to order</span>':'')+(x.unconf?'<span class="tag t-mute">'+x.unconf+' unconfirmed</span>':'')+(x.disc?'<span class="tag t-bad">'+x.disc+' discontinued</span>':'')+'</span></span></button>';}).join("")+'</div></section>'+
  '<div class="grid2">'+
    panel("Needs attention",(flagged.length||low.length||repl.length)?'<ul class="list">'+flagged.slice(0,6).map(function(p){var f=priceFlags(p.id).filter(function(x){return x.k!=="changed";})[0];return '<li><span class="grow"><button data-open="'+p.id+'" style="all:unset;cursor:pointer"><b>'+esc(p.name)+'</b></button><span class="small muted">'+esc(p.sku)+'</span></span><span class="tag '+(f?f.c:"t-warn")+'">'+esc(f?f.t:"Check price")+'</span></li>';}).join("")+low.slice(0,6).map(function(p){return '<li><span class="grow"><button data-open="'+p.id+'" style="all:unset;cursor:pointer"><b>'+esc(p.name)+'</b></button><span class="small muted">'+esc(p.sku)+'</span></span><span class="tag t-warn">'+p.stockQty+' left</span></li>';}).join("")+repl.slice(0,4).map(function(p){var r=p.replacement&&P(idFor(p.replacement));return '<li><span class="grow"><b>'+esc(p.name)+'</b><span class="small muted">'+(r?'Replaced by '+esc(r.sku):'No replacement mapped')+'</span></span><span class="tag t-bad">'+esc((STATUS[p.status]||["Check"])[0])+'</span></li>';}).join("")+'</ul>':'<div class="empty">Every price is approved and current, and nothing is low on stock.</div>')+
    panel("Price changes (30 days)",chg.length?'<ul class="list">'+chg.map(function(c){var ch=(c.changes||[])[0];return '<li><span class="grow"><button data-open="'+esc(c.pid)+'" style="all:unset;cursor:pointer"><b>'+esc(c.sku||c.pid)+'</b></button><span class="small muted">'+esc(ch?ch:"Updated")+' · '+fmtDate((c.at||"").slice(0,10))+'</span></span></li>';}).join("")+'</ul>':'<div class="empty">No price changes in the last 30 days.</div>',"prices")+
  '</div>'+
  '<section class="panel panel-b"><h2 style="margin-bottom:10px">Tools</h2><div class="quick">'+tools.map(function(q){return '<button data-go="'+q[0]+'">'+q[3]+'<b>'+q[1]+'</b><span>'+q[2]+'</span></button>';}).join("")+'</div></section>';
}
function latestSource(){var r=Object.keys(A.prices).map(function(k){return A.prices[k];});if(!r.length)return "—";var src={};r.forEach(function(x){if(x.source)src[x.source]=(src[x.source]||0)+1;});var top=Object.keys(src).sort(function(a,b){return src[b]-src[a];})[0];var d=r.map(function(x){return x.verifiedAt||"";}).sort().pop();return (top||"price list")+(d?" (verified "+fmtDate(d)+")":"");}
function panel(title,body,goName){return '<section class="panel"><div class="panel-h"><h2>'+esc(title)+'</h2>'+(goName?'<button class="btn btn-sm btn-quiet" data-go="'+goName+'">View all</button>':'')+'</div>'+body+'</section>';}
function prodLi(p){var sp=sellPrice(p.id);return '<li><span class="thumb" style="width:40px;flex:none">'+thumbHtml(p)+'</span><span class="grow"><button data-open="'+p.id+'" style="all:unset;cursor:pointer"><b>'+esc(p.name)+'</b></button><span class="small muted"><span class="mono">'+esc(p.sku)+'</span>'+(sp?' · '+peso(sp.amount):'')+'</span></span></li>';}
function quoteLi(q){var t=quoteTotals(q);return '<li><span class="grow"><button data-openq="'+q._id+'" style="all:unset;cursor:pointer"><b>'+esc(q.client||"Untitled client")+'</b></button><span class="small muted"><span class="mono">'+esc(q.number)+'</span> · '+peso(fromCents(t.total))+' · '+fmtDate(q.date)+'</span></span>'+quoteStatusTag(q)+'</li>';}
