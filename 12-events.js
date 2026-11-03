/* ============================== events ============================== */
function curQuote(){return A.route.name==="quote"?getQuote(A.route.arg):null;}
function qMutate(fn,rerenderNow){var id=A.route.arg;var q=getQuote(id);if(!q)return;if(q.status==="final"){toast("Reopen the quotation to edit it",true);return;}fn(q);saveQuote(id,q);if(rerenderNow){A.keepScroll=true;render();}}
document.addEventListener("click",function(e){
  var t=e.target.closest("[data-go],[data-act],[data-quick],[data-open],[data-openq],[data-fav],[data-cmp],[data-uncmp],[data-addq],[data-copymenu],[data-ds],[data-family],[data-loadcmp],[data-delcmp],[data-cmp-repl],[data-research],[data-back],[data-zoom],[data-gal],[data-qfilter],[data-qact],[data-sug],[data-editprod],[data-editprice],[data-atab],[data-upimg],[data-delimg],[data-delann]");
  if(!t||t.closest("#modal")&&!t.hasAttribute("data-open"))return;
  var d=function(k){return t.getAttribute(k);};
  if(t.hasAttribute("data-go")){if(d("data-tab"))A.adminTab=d("data-tab");go(d("data-go"),d("data-arg")||null);return;}
  if(t.hasAttribute("data-open")){closeModal();A.galIdx=0;var anc=d("data-anchor");if(anc)A.afterRender=function(){var x=document.getElementById(anc);if(x)x.scrollIntoView({block:"start"});};go("product",d("data-open"));return;}
  if(t.hasAttribute("data-openq")){go("quote",d("data-openq"));return;}
  if(t.hasAttribute("data-fav")){toggleFav(d("data-fav"));return;}
  if(t.hasAttribute("data-cmp")){toggleCompare(d("data-cmp"));return;}
  if(t.hasAttribute("data-uncmp")){toggleCompare(d("data-uncmp"));return;}
  if(t.hasAttribute("data-addq")){addToQuote(d("data-addq"),Number(d("data-qty"))||1);return;}
  if(t.hasAttribute("data-family")){A.catalog.f={Family:[d("data-family")]};A.catalog.cat="all";A.catalog.q="";go("catalog");return;}
  if(t.hasAttribute("data-ds")){e.stopPropagation();dsMenu(t,d("data-ds"));return;}
  if(t.hasAttribute("data-copymenu")){e.stopPropagation();copyMenu(t,d("data-copymenu"));return;}
  if(t.hasAttribute("data-loadcmp")){var c=A.comparisons.find(function(x){return x._id===d("data-loadcmp");});if(c){A.compare=(c.ids||[]).filter(function(i){return P(i);}).slice(0,4);go("compare");}return;}
  if(t.hasAttribute("data-delcmp")){userDoc("comparisons",d("data-delcmp")).delete().then(function(){toast("Comparison deleted");});return;}
  if(t.hasAttribute("data-cmp-repl")){var p=P(d("data-cmp-repl"));var r=p&&p.replacement?bySku(p.replacement):null;if(r){A.compare=[p.id,r.id];go("compare");}return;}
  if(t.hasAttribute("data-research")){runGlobalSearch(d("data-research"));return;}
  if(t.hasAttribute("data-back")){history.length>1?history.back():go("catalog");return;}
  if(t.hasAttribute("data-zoom")){lightbox(d("data-zoom"));return;}
  if(t.hasAttribute("data-gal")){A.galIdx=+d("data-gal");A.keepScroll=true;render();return;}
  if(t.hasAttribute("data-qfilter")){A.qFilter=d("data-qfilter");render();return;}
  if(t.hasAttribute("data-sug")){sendChat(d("data-sug"));return;}
  if(t.hasAttribute("data-editprod")){prodEditor(d("data-editprod"));return;}
  if(t.hasAttribute("data-editprice")){priceEditor(d("data-editprice"));return;}
  if(t.hasAttribute("data-atab")){A.adminTab=d("data-atab");if(A.adminTab==="audit")A.auditLog=null;render();return;}
  if(t.hasAttribute("data-upimg")){imgUploadModal(d("data-upimg"));return;}
  if(t.hasAttribute("data-delimg")){var parts=d("data-delimg").split("|");var set=clone(A.imagesets[parts[0]]);delete set._id;var rem=set.images.splice(+parts[1],1)[0];confirmBox("Remove image?","<p>The image is removed from every SKU using this set.</p>","Remove",true).then(function(ok){if(!ok)return;A.db.doc("imagesets/"+parts[0]).set(set).then(function(){if(A.assets&&rem)A.assets.delete(rem.id).catch(function(){});audit("images.remove",parts[0],rem&&rem.view);toast("Image removed");}).catch(writeErr);});return;}
  if(t.hasAttribute("data-delann")){var an=A.announcements.find(function(x){return x._id===d("data-delann");});confirmBox("Delete this post?","<p>“"+esc(an?an.title:"")+"” is removed for everyone.</p>","Delete",true).then(function(ok){if(!ok)return;A.db.doc("announcements/"+d("data-delann")).delete().then(function(){audit("announcement.delete",an?an.title:d("data-delann"));toast("Post deleted");}).catch(writeErr);});return;}
  if(t.hasAttribute("data-quick")){var k=d("data-quick");
    if(k==="newquote"){if(!canSave()){toast("Saving quotations needs Contributor access",true);return;}var id=rid(12);saveQuote(id,newQuote(),true).catch(function(){});go("quote",id);return;}
    if(k==="sku"){var g=$("#gq");g.focus();g.placeholder="Paste one or more SKUs, then press Enter";return;}
    go(k);return;}
  if(t.hasAttribute("data-qact")){quoteAction(d("data-qact"),t);return;}
  switch(d("data-act")){
    case "menu":toggleMenu();break;
    case "theme":toggleTheme();break;
    case "home":A.catalog={q:"",f:{},sort:A.catalog.sort||"family",cat:"all",view:A.catalog.view};go("catalog");break;
    case "nav-cat":{var nc=t.getAttribute("data-cat");normCatalog();var keepAv=A.catalog.f.Availability;A.catalog.f={};if(keepAv&&keepAv.length)A.catalog.f.Availability=keepAv;if(nc!=="all")A.catalog.f.Category=[CAT_TAB[nc]];A.catalog.q="";if(A.route.name!=="catalog")go("catalog");else render();var lt=$("#sf-top");if(lt&&nc!=="all")lt.scrollIntoView({block:"start"});else window.scrollTo(0,0);break;}
    case "quick":{normCatalog();var qv=t.getAttribute("data-v");var fa=A.catalog.f.Availability=A.catalog.f.Availability||[];var qi=fa.indexOf(qv);if(qi>=0&&A.route.name==="catalog")fa.splice(qi,1);else if(qi<0)fa.push(qv);if(A.route.name!=="catalog")go("catalog");else render();var ql=$("#sf-list");if(ql)ql.scrollIntoView({block:"start"});break;}
    case "sf-jump":{var sl=$("#sf-top")||$("#sf-list");if(sl)sl.scrollIntoView({behavior:"smooth",block:"start"});break;}
    case "qb-open":qbOpen();break;
    case "call-me":callMeEditor();break;
    case "view":A.catalog.view=t.getAttribute("data-v");A.keepScroll=true;render();break;
    case "unfacet":{var uk=t.getAttribute("data-k"),uv=t.getAttribute("data-v");A.catalog.f[uk]=(A.catalog.f[uk]||[]).filter(function(x){return x!==uv;});A.keepScroll=true;render();break;}
    case "unq":A.catalog.q="";A.keepScroll=true;render();break;
    case "facet-more":{var fk=t.getAttribute("data-k");A.facetMore=A.facetMore||{};A.facetMore[fk]=!A.facetMore[fk];A.keepScroll=true;render();break;}
    case "toggle-facets":var fc=$("#facets");A.showFacets=fc.hidden;fc.hidden=!fc.hidden;break;
    case "idt-copy":copyText(itemDetailsText(P(t.getAttribute("data-id"))),"Item details copied");break;
    case "upg-clear":A.upgQ="";A.upgActive=0;go("upgrade");setTimeout(function(){var i=$("#up-q");if(i)i.focus();},0);break;
    case "upg-copy":copyText(upgSummaryText(P(t.getAttribute("data-id"))),"Upgrade summary copied");break;
    case "upg-xlsx":downloadUpgradeXlsx();break;
    case "news-new":newsEditor(null);break;
    case "news-edit":newsEditor(t.getAttribute("data-id"));break;
    case "news-all":{var na=A.announcements.find(function(x){return x._id===d("data-id");});if(na){A.catalog.q=("promo "+(na.tag||na.title)).toLowerCase();A.catalog.f={};A.catalog.cat="all";go("catalog");}break;}
    case "news-pdf":newsDownload(t.getAttribute("data-id"),"pdf");break;
    case "news-jpg":newsDownload(t.getAttribute("data-id"),"jpg");break;
    case "price-xlsx":downloadPriceXlsx();break;
    case "news-f":A.newsF=t.getAttribute("data-k");render();break;
    case "pf-cat":A.pf.cat=t.getAttribute("data-cat");render();break;
    case "pf-reset":A.pf={cat:"all",flag:"all",q:"",stock:false};render();break;
    case "pl-jump":var sec=document.getElementById(t.getAttribute("data-id"));if(sec)sec.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});break;
    case "cat-tab":A.catalog.cat=t.getAttribute("data-cat");A.catalog.f={};render();break;
    case "reset-filters":A.catalog={q:"",f:{},sort:A.catalog.sort,cat:"all",view:A.catalog.view};A.keepScroll=true;render();break;
    case "multi-copy":var ps=tokensAsSkus(A.searchQ).skus.map(bySku).filter(Boolean);copyText(ps.map(function(p){return copyLines(p,"price");}).join("\n\n"),ps.length+" products copied");break;
    case "multi-cmp":A.compare=uniq(tokensAsSkus(A.searchQ).skus.map(bySku).filter(Boolean).map(function(p){return p.id;})).slice(0,4);go("compare");break;
    case "multi-quote":addToQuote(uniq(tokensAsSkus(A.searchQ).skus.map(bySku).filter(Boolean).map(function(p){return p.id;})));break;
    case "search-to-match":A.matchText=A.searchQ;A.matchAI=null;A.lastMatch=null;go("match");break;
    case "cmp-from-skus":var ids=uniq(tokensAsSkus($("#cmp-skus").value).tokens.map(bySku).filter(Boolean).map(function(p){return p.id;}));var miss=tokensAsSkus($("#cmp-skus").value).tokens.filter(function(x){return !bySku(x);});if(miss.length)toast("Not recognized: "+miss.join(", "),true);A.compare=ids.slice(0,4);render();break;
    case "cmp-copy":logEvent("compare");copyText(compareText(A.compare.map(P)),"Comparison copied");break;
    case "comp-copy":copyText(componentsText(P(t.getAttribute("data-id"))),"Components copied");break;
    case "stat-days":A.statDays=+t.getAttribute("data-n");render();break;
    case "comp-open":A.compOpen=!A.compOpen;A.keepScroll=true;render();break;
    case "comp-all":A.compAll=!A.compAll;A.keepScroll=true;render();break;
    case "cmp-pdf":logEvent("compare");saveFile("Comparison "+A.compare.map(function(i){return P(i).sku.replace(/#.*/,"");}).join(" vs ")+".pdf",comparePdf(A.compare.map(P)));break;
    case "cmp-save":if(!canSave()){toast("Saving needs Contributor access",true);break;}modal({title:"Save comparison",body:'<div class="field"><label for="cs-name">Name</label><input id="cs-name" value="'+esc(A.compare.map(function(i){return P(i).sku;}).join(" vs "))+'"></div>',actions:[["Cancel","close"],["Save","save","btn-primary"]],onAction:function(a,w){if(a!=="save")return;userDoc("comparisons",rid(10)).set({name:$("#cs-name",w).value.trim()||"Comparison",ids:A.compare.slice(),at:nowISO()}).then(function(){closeModal();toast("Comparison saved");}).catch(function(){toast("Couldn’t save",true);});}});break;
    case "cmp-alt":var cps=A.compare.map(P);var q=blankReq();q.ramMin=Math.min.apply(null,cps.map(function(p){return ramGB(p)||0;}))||null;q.storageMin=Math.min.apply(null,cps.map(function(p){return storageGB(p)||0;}))||null;var vr=Math.min.apply(null,cps.map(function(p){return vramGB(p)||0;}));if(vr>0){q.vramMin=vr;q.gpuNeed="dedicated";}var cats=uniq(cps.map(function(p){return p.cat;}));if(cats.length===1)q.category=cats[0];var mx=Math.max.apply(null,cps.map(function(p){return (sellPrice(p.id)||{}).amount||0;}));if(mx)q.budget=mx;A.matchForm=q;A.extractNote="Pre-filled from the compared models: the lowest specs among them, budget up to the highest price. Adjust and run.";A.lastMatch=null;go("match");runMatch();break;
    case "cmp-quote":addToQuote(A.compare.slice());break;
    case "cmp-clear":A.compare=[];render();break;
    case "rq-example":A.matchText=MATCH_EXAMPLES[+t.getAttribute("data-i")];A.matchAI=null;A.lastMatch=null;render();break;
    case "rq-clear":A.matchText="";A.matchAI=null;A.lastMatch=null;A.matchParsed=null;render();var ta=$("#rq-text");if(ta)ta.focus();break;
    case "rq-ai":readWithClaude();break;
    case "rq-cmp":if(A.lastMatch&&A.lastMatch.picks){A.compare=A.lastMatch.picks.map(function(x){return x.e.p.id;}).slice(0,4);go("compare");}break;
    case "rq-copy":copyText(matchSummaryText(),"Recommendation copied");break;
    case "rq-quote":if(A.lastMatch&&A.lastMatch.picks[0])addToQuote(A.lastMatch.picks[0].e.p.id,A.lastMatch.req.qty||1);break;
    case "prices-csv":saveFile("Price list "+today()+".csv",pricesCsv());break;
    case "exp-products":saveFile("Products "+today()+".csv",productsCsv());break;
    case "chat-clear":CHAT=[];render();break;
    case "chat-stop":if(chatCtl)chatCtl.abort();break;
    case "prod-new":prodEditor(null);break;
    case "imp-template":saveFile("Product import template.csv",importTemplate());break;
    case "imp-apply":applyImport();break;
    case "imp-cancel":A.imp=null;render();break;
    case "st-save":var ns=clone(A.settings||{});delete ns._id;SETTING_FIELDS.forEach(function(f2){var v=$("#st-"+f2[0]).value.trim();ns[f2[0]]=f2[2]==="number"?(v===""?null:Number(v)):v;});ns.pricesIncludeVat=$("#st-pricesIncludeVat").checked;A.db.doc("settings/main").set(ns).then(function(){audit("settings.update","settings");toast("Settings saved");}).catch(writeErr);break;
    case "audit-refresh":A.auditLog=null;render();break;
  }
});
function quoteAction(a,t){
  var id=A.route.arg,q=getQuote(id);if(!q)return;
  if(a==="preview"){modal({title:"Preview — "+q.number,wide:true,body:quotePreviewHtml(q),actions:[["Close","close"],["Generate PDF","pdf","btn-primary"]],onAction:function(x){if(x==="pdf")saveFile(q.number+".pdf",quotePdf(q));}});return;}
  if(a==="pdf"||a==="print"){if(!(q.items||[]).length){toast("Add at least one item first",true);return;}saveFile(q.number+" "+(q.client||"").replace(/[^\w\- ]/g,"").slice(0,40).trim()+".pdf",quotePdf(q));if(a==="print")toast("Open the downloaded PDF and print from your PDF viewer");return;}
  if(a==="copy"){copyText(quoteSummaryText(q),"Quotation summary copied");return;}
  if(a==="csv"){saveFile(q.number+".csv",quoteCsv(q));return;}
  if(a==="email"){showText("Quotation email draft",quoteEmailText(q));return;}
  if(a==="dup"){var n=newQuote();var c2=clone(q);delete c2._id;Object.assign(c2,{number:n.number,date:n.date,status:"draft",outcome:null,finalizedAt:null,createdAt:nowISO()});var nid=rid(12);saveQuote(nid,c2,true).then(function(){toast("Duplicated as "+c2.number);});go("quote",nid);return;}
  if(a==="reopen"){q.status="draft";q.outcome=null;saveQuote(id,q,true);render();toast("Reopened for editing");return;}
  if(a==="delete"){confirmBox("Delete quotation "+q.number+"?","<p>This can’t be undone.</p>","Delete",true).then(function(ok){if(!ok)return;clearTimeout(qSaveTimers[id]);delete qDirty[id];userDoc("quotes",id).delete().then(function(){A.quotes=A.quotes.filter(function(x){return x._id!==id;});toast("Quotation deleted");go("quotes");});});return;}
  if(a==="final"){var errs=[];if(!q.client)errs.push("Enter the client or company name.");if(!(q.items||[]).length)errs.push("Add at least one item.");
    (q.items||[]).forEach(function(it){if((it.discPct||it.discAmt)&&!it.discApproved)errs.push(it.name+": tick “Discount approved” or remove the discount.");if(it.kind==="custom"&&(!it.name||!(Number(it.unit)>0)&&!it.bundled))errs.push("Manual line needs a description and unit price.");if(it.kind==="product"&&!P(it.pid))errs.push(it.sku+" is no longer in the database.");if(it.kind==="product"&&!it.priceType&&!it.bundled&&!(Number(it.unit)>0))errs.push(it.sku+": price is TBA — enter the confirmed unit price.");});
    if(errs.length){modal({title:"Can’t finalize yet",body:'<ul>'+errs.map(function(x){return '<li>'+esc(x)+'</li>';}).join("")+'</ul>',actions:[["OK","close","btn-primary"]]});return;}
    var w=quoteWarnings(q);(w.length?confirmBox("Finalize with warnings?",'<ul>'+w.map(function(x){return '<li>'+esc(x)+'</li>';}).join("")+'</ul><p>Quoted prices will be kept as they are.</p>',"Finalize anyway"):Promise.resolve(true)).then(function(ok){if(!ok)return;q.status="final";q.outcome="pending";q.finalizedAt=nowISO();saveQuote(id,q,true);logEvent("quote_final",{value:fromCents(quoteTotals(q).total),items:(q.items||[]).filter(function(it){return it.pid;}).map(function(it){return {pid:it.pid,qty:Number(it.qty)||1};})});render();toast("Quotation finalized");});return;}
  if(q.status==="final"){toast("Reopen the quotation to edit it",true);return;}
  if(a==="reprice"){q.items.forEach(function(it){if(it.kind!=="product"||it.bundled)return;var r=priceRec(it.pid);if(r&&r.types&&r.types[it.priceType]){it.unit=Number(r.types[it.priceType].amount);it.priceDate=r.verifiedAt;}});saveQuote(id,q);A.keepScroll=true;render();toast("Lines updated to current prices");return;}
  if(a==="lineprice"){var it=q.items.find(function(x){return x.lid===t.getAttribute("data-l");});var r=priceRec(it.pid);if(r&&r.types[it.priceType]){it.unit=Number(r.types[it.priceType].amount);it.priceDate=r.verifiedAt;}saveQuote(id,q);A.keepScroll=true;render();return;}
  if(a==="rmline"){q.items=q.items.filter(function(x){return x.lid!==t.getAttribute("data-l");});saveQuote(id,q);A.keepScroll=true;render();return;}
  if(a==="cp"){carePackModal(t.getAttribute("data-l"));return;}
  if(a==="addcustom"){q.items.push({lid:rid(8),kind:"custom",pid:null,sku:"",name:"",specs:"",priceType:null,unit:null,qty:1,discPct:null,discAmt:null,discApproved:false,bundled:false,note:"Manual price — verify"});saveQuote(id,q);A.keepScroll=true;render();return;}
  if(a==="addsku"){var v=($("#q-add-sku")||{}).value||"";var p=bySku(v)||textSearch(v).res[0];if(!v.trim()||!p){toast("No product matches “"+v+"”",true);return;}addToQuoteLine(id,p);return;}
}
function addToQuoteLine(qid,p){var go2=function(){var q=getQuote(qid);q.items.push(lineFromProduct(p,1));A.state.quoted[p.id]=(A.state.quoted[p.id]||0)+1;saveState();saveQuote(qid,q);A.keepScroll=true;render();toast(p.sku+" added");};
  if(priceBlocking(p.id))confirmBox("Confirm price before quoting",'<p><span class="sku">'+esc(p.sku)+'</span>: '+esc(priceFlags(p.id).map(function(f){return f.t;}).join(", "))+'.</p><p>Confirm the price with your product manager before sending.</p>',"I have confirmed the price").then(function(ok){if(ok)go2();});else go2();}
document.addEventListener("input",function(e){var el=e.target;
  if(el.id==="cat-q"){A.catalog.q=el.value;debouncedCatalog();return;}
  if(el.id==="rq-text"){if(A.matchText===el.value)return;A.matchText=el.value;A.matchAI=null;var st=document.getElementById("rq-status");if(st)st.textContent="Results update as you type.";updateMatchSoon();return;}
  if(el.id==="pf-q"){A.pf.q=el.value;debouncedRender(el.id);return;}
  if(el.id==="df-q"){A.df.q=el.value;debouncedRender(el.id);return;}
  if(el.id==="apq"){A.apq=el.value;debouncedRender(el.id);return;}
  if(el.hasAttribute("data-qf")){var k=el.getAttribute("data-qf");var v=el.value;var id=A.route.arg;var q=getQuote(id);if(!q||q.status==="final")return;q[k]=v;saveQuote(id,q);return;}
  if(el.hasAttribute("data-qi")&&(el.getAttribute("data-qi")==="name"||el.getAttribute("data-qi")==="sku")){var tr=el.closest("tr[data-lid]");var lid=tr.getAttribute("data-lid");var key=el.getAttribute("data-qi");qMutate(function(q){var it=q.items.find(function(x){return x.lid===lid;});it[key]=el.value;},false);return;}
});
var debouncedCatalog=debounce(function(){var pos=($("#cat-q")||{}).selectionStart;render();var n=$("#cat-q");if(n){n.focus();try{n.setSelectionRange(pos,pos);}catch(x){}}},180);
var debouncedRender=debounce(function(id){var pos=($("#"+id)||{}).selectionStart;render();var n=$("#"+id);if(n){n.focus();try{n.setSelectionRange(pos,pos);}catch(x){}}},180);
document.addEventListener("change",function(e){var el=e.target;
  if(el.hasAttribute("data-facet")){var k=el.getAttribute("data-facet");var f=A.catalog.f[k]=A.catalog.f[k]||[];var i=f.indexOf(el.value);if(el.checked&&i<0)f.push(el.value);if(!el.checked&&i>=0)f.splice(i,1);A.keepScroll=true;render();return;}
  if(el.id==="cat-cat"){A.catalog.cat=el.value;A.catalog.f={};render();return;}
  if(el.id==="cat-sort"){A.catalog.sort=el.value;render();return;}
  if(el.id==="pf-cat"){A.pf.cat=el.value;render();return;}
  if(el.getAttribute("data-act-chk")==="pf-stock"){A.pf.stock=el.checked;render();return;}
  if(el.id==="pf-flag"){A.pf.flag=el.value;render();return;}
  if(el.id==="df-type"){A.df.type=el.value;render();return;}
  if(el.id==="rq-load"){var pr=A.profiles.find(function(x){return x._id===el.value;});if(pr){A.matchForm=Object.assign(blankReq(),pr.req);A.lastMatch=null;A.extractNote="Loaded profile “"+pr.name+"”.";render();}return;}
  if(el.id==="q-outcome"){var id=A.route.arg;var q=getQuote(id);q.outcome=el.value;saveQuote(id,q,true);toast("Outcome recorded");render();return;}
  if(el.id==="imp-file"){if(el.files[0])loadImportFile(el.files[0]);return;}
  if(el.id==="imp-sheet"){A.imp.sheet=+el.value;buildImport();return;}
  if(el.hasAttribute("data-impinc")){A.imp.rows[+el.getAttribute("data-impinc")].include=el.checked;A.keepScroll=true;render();return;}
  if(el.hasAttribute("data-cost")){var pid=el.getAttribute("data-cost");var v=el.value.trim();var ref=A.db.doc("restricted/admin/costs/"+pid);(v===""?ref.delete():ref.set({sku:(P(pid)||{}).sku,cost:Number(v),updatedAt:nowISO(),byName:actorName()})).then(function(){A.costs[pid]=v===""?undefined:{cost:Number(v),updatedAt:nowISO()};audit("cost.update",(P(pid)||{}).sku,"buy cost updated");toast("Buy cost saved");A.keepScroll=true;render();}).catch(writeErr);return;}
  if(el.hasAttribute("data-qi")){var tr=el.closest("tr[data-lid]");var lid=tr.getAttribute("data-lid");var key=el.getAttribute("data-qi");if(key==="name"||key==="sku")return;
    qMutate(function(q){var it=q.items.find(function(x){return x.lid===lid;});
      if(key==="qty"){var oldQ=it.qty;it.qty=Math.max(1,Math.round(Number(el.value)||1));if(it.kind==="product")q.items.forEach(function(c){if(c.kind==="carepack"&&c.forPid===it.pid&&Number(c.qty)===Number(oldQ))c.qty=it.qty;});}
      else if(key==="unit")it.unit=el.value===""?null:Math.max(0,Number(el.value));
      else if(key==="discPct"){it.discPct=el.value===""?null:Math.min(100,Math.max(0,Number(el.value)));if(it.discPct)it.discAmt=null;it.discApproved=false;}
      else if(key==="discAmt"){it.discAmt=el.value===""?null:Math.max(0,Number(el.value));if(it.discAmt)it.discPct=null;it.discApproved=false;}
      else if(key==="discApproved")it.discApproved=el.checked;
      else if(key==="bundled"){it.bundled=el.checked;if(it.bundled){it.discPct=null;it.discAmt=null;}}
      else if(key==="priceType"){var r=priceRec(it.pid);it.priceType=el.value;if(r&&r.types[el.value]){it.unit=Number(r.types[el.value].amount);it.priceDate=r.verifiedAt;}}
    },true);return;}
});
document.addEventListener("keydown",function(e){
  if(e.key==="Escape"){closeModal();closeMenu();var lb=document.querySelector(".lightbox");if(lb)lb.remove();}
  if(e.key==="/"&&!/INPUT|TEXTAREA|SELECT/.test((document.activeElement||{}).tagName||"")){e.preventDefault();$("#gq").focus();}
  if(e.key==="Enter"&&e.target&&e.target.id==="q-add-sku"){e.preventDefault();quoteAction("addsku");}
  if(e.key==="Enter"&&!e.shiftKey&&e.target&&e.target.id==="chat-q"){e.preventDefault();var v=e.target.value;e.target.value="";sendChat(v);}
});
document.addEventListener("submit",function(e){e.preventDefault();if(e.target.id==="chat-form"){var ta=$("#chat-q");var v=ta.value;ta.value="";sendChat(v);}if(e.target.id==="gsearch")runGlobalSearch($("#gq").value);});

/* ============================== boot ============================== */
(function(){var r=parseHash();A.route={name:r.name,arg:r.arg||null};boot();})();
document.addEventListener("toggle",function(e){var el=e.target;if(el&&el.hasAttribute&&el.hasAttribute("data-facetd")){A.facetOpen=A.facetOpen||{};A.facetOpen[el.getAttribute("data-facetd")]=el.open;}},true);
