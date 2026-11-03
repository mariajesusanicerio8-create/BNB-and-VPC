/* ============================== quick quotation builder (modal) + quote tray ============================== */
function qbQuote(){var id=A.qbId;var q=A.quotes.find(function(x){return x._id===id;});if(q){var c=clone(q);delete c._id;return {id:id,q:c};}if(A.qbNew&&A.qbNew.id===id)return {id:id,q:A.qbNew.q};return null;}
function qbSave(id,q,now){if(A.qbNew&&A.qbNew.id===id)A.qbNew=null;return saveQuote(id,q,now).catch(function(){});}
function qbLineWarranty(it){if(it.warranty!=null)return it.warranty;var p=P(it.pid);return p&&p.specs.warranty?p.specs.warranty:"";}
function qbSuggest(it){var p=P(it.pid);if(!p||typeof carePacksFor!=="function")return null;var best=null;
  carePacksFor(p).forEach(function(c){if(c.section==="C"&&c.months===36&&/onsite/i.test(c.place||"")&&c.warranty==="In warranty"&&c.price!=null&&(!best||c.price<best.price))best=c;});return best;}
function qbBody(q){
  var items=q.items||[],t=quoteTotals(q),lock=q.status==="final";var me=A.me&&A.me.name?A.me.name:"you";
  var f=function(k,label,opt,ph,req,hint){var bad=A.qbBad&&A.qbBad.indexOf(k)>=0;return '<div class="field qb-f"><label for="qb-'+k+'">'+esc(label)+(req?' <span class="req">*</span>':'')+(opt?' <small>optional</small>':'')+(hint?' <small>'+esc(hint)+'</small>':'')+'</label><input id="qb-'+k+'" data-qb-f="'+k+'" value="'+esc(q[k]||"")+'" placeholder="'+esc(ph||"")+'"'+(bad?' class="is-bad" aria-invalid="true"':'')+(lock?" disabled":"")+'></div>';};
  var prods=items.filter(function(it){return it.kind==="product";});var units=prods.reduce(function(a,it){return a+(Number(it.qty)||0);},0);
  var lineHtml=function(it){var i=items.indexOf(it);var lt=t.lines[i];var p=it.kind==="product"?P(it.pid):null;var im=p?imgOf(p):[];
    var cps=items.filter(function(c){return c.kind==="carepack"&&c.forPid&&c.forPid===it.pid;});
    var types=p?priceTypes(p.id):[];var r=p?priceRec(p.id):null;
    var price=it.kind==="custom"?'<input class="money" data-qb-f="unit" data-l="'+it.lid+'" type="number" min="0" step="0.01" value="'+esc(it.unit==null?"":it.unit)+'" placeholder="0.00"'+(lock?" disabled":"")+'>':
      !types.length?'<input class="money" data-qb-f="unit" data-l="'+it.lid+'" type="number" min="0" step="0.01" value="'+esc(it.unit==null?"":it.unit)+'" placeholder="TBA"'+(lock?" disabled":"")+'><small class="warn-t">Price TBA — enter the confirmed price</small>':
      (types.length>1?'<select class="sel" data-qb-f="priceType" data-l="'+it.lid+'"'+(lock?" disabled":"")+'>'+types.map(function(ty){return '<option value="'+ty+'"'+(ty===it.priceType?" selected":"")+'>'+esc(PTYPE_SHORT[ty])+' · '+peso(r.types[ty].amount)+'</option>';}).join("")+'</select>':'<span class="qb-fixed">'+peso(it.unit)+'</span>')+'<small>'+(it.priceType?esc(PTYPE_SHORT[it.priceType])+" as of "+fmtDate(it.priceDate):"")+'</small>';
    var open=A.qbOpenCp&&A.qbOpenCp[it.lid];var nCp=p&&typeof carePacksFor==="function"?carePacksFor(p).length:0;
    return '<div class="qb-line" data-lid="'+it.lid+'">'+
      '<div class="qb-lt">'+(p?'<span class="qb-th">'+(im.length?'<img src="/_blob/'+esc(im[0].id)+'" alt="">':catIcon(p.cat))+'</span>':'<span class="qb-th">'+ICON.plus+'</span>')+
        '<div class="qb-ln">'+(it.kind==="custom"?'<input data-qb-f="name" data-l="'+it.lid+'" value="'+esc(it.name||"")+'" placeholder="Description — accessory, service or other item"'+(lock?" disabled":"")+'>':'<b>'+esc(it.name)+'</b><small class="qb-spec">'+esc(it.specs||"")+'</small><small>PN <b>'+esc(it.sku)+'</b>'+(p?' · <span class="'+(onHand(p)?"ok-t":"navy-t")+'">'+(onHand(p)?"On-hand stock":orderBasis(p)?"Order basis · "+(tatText()?tatText()+" TAT":"lead time confirmed on order"):"Stock to confirm")+'</span>':'')+'</small>')+'</div></div>'+
      '<div class="qb-qty"><label>Qty</label><div class="qb-step"><button data-qb="dec" data-l="'+it.lid+'" aria-label="Decrease quantity"'+(lock?" disabled":"")+'>'+ICON.minus+'</button><input data-qb-f="qty" data-l="'+it.lid+'" type="number" min="1" step="1" value="'+esc(it.qty)+'" aria-label="Quantity"'+(lock?" disabled":"")+'><button data-qb="inc" data-l="'+it.lid+'" aria-label="Increase quantity"'+(lock?" disabled":"")+'>'+ICON.plus+'</button></div></div>'+
      '<div class="qb-price"><label>Unit price</label>'+price+'</div>'+
      '<div class="qb-amt"><label>Amount</label><b>'+peso(fromCents(lt.total))+'</b>'+(lt.disc?'<small>less '+peso(fromCents(lt.disc))+'</small>':'')+'</div>'+
      (lock?'':'<button class="qb-x" data-qb="rm" data-l="'+it.lid+'" aria-label="Remove '+esc(it.sku||"item")+'">'+ICON.x+'</button>')+
      (p?'<div class="qb-war"><label for="qbw-'+it.lid+'">Warranty <small>printed with this model</small></label><input id="qbw-'+it.lid+'" data-qb-f="warranty" data-l="'+it.lid+'" value="'+esc(qbLineWarranty(it))+'"'+(lock?" disabled":"")+'></div>':'')+
      cps.map(function(c){var ci=items.indexOf(c);var ct=t.lines[ci];return '<div class="qb-cpl">'+ICON.shield+'<div><b>HP Care Pack · '+esc(c.sku)+'</b><small>'+esc(c.name)+'</small></div><span class="qb-cpq">'+esc(c.qty)+' × '+peso(c.unit)+'</span><b>'+peso(fromCents(ct.total))+'</b>'+(lock?'':'<button class="qb-x" data-qb="rm" data-l="'+c.lid+'" aria-label="Remove Care Pack">'+ICON.x+'</button>')+'</div>';}).join("")+
      (nCp&&!lock?'<div class="qb-cpd'+(open?" is-open":"")+'"><button class="qb-cpt" data-qb="cptoggle" data-l="'+it.lid+'" aria-expanded="'+!!open+'">'+ICON.plus+'Add HP Care Pack ('+nCp+' compatible)…<span class="chev" aria-hidden="true">▾</span></button>'+(open?'<div class="cpbox" data-cpbox="'+esc(p.id)+'" data-cpctx="quote" data-cplid="'+esc(it.lid)+'">'+cpBoxInner(p,"quote",it.lid)+'</div>':'')+'</div>':'')+
      (p&&!nCp&&!lock?'<a class="qb-cpc" href="'+CPC_URL+'" target="_blank" rel="noopener noreferrer">'+ICON.ext+'Find Care Packs for '+esc(baseSku(p.sku))+' on HP Care Pack Central</a>':'')+
    '</div>';};
  var mains=items.filter(function(it){return it.kind!=="carepack"||!it.forPid||!items.some(function(x){return x.kind==="product"&&x.pid===it.forPid;});});
  var sugg=lock?[]:prods.filter(function(it){return !items.some(function(c){return c.kind==="carepack"&&c.forPid===it.pid;})&&!(A.qbDismiss||{})[it.lid];}).map(function(it){var c=qbSuggest(it);return c?[it,c]:null;}).filter(Boolean);
  return '<p class="qb-lead">Quotation from '+esc(S("companyName"))+' in the '+esc(S("companyName").replace(/\s*Inc\.?$/,""))+' quotation format. “Prepared by” is you, or the salesperson you are preparing it for.</p>'+
    '<div class="qb-who"><b>Creating as '+esc(me)+'</b><small>Recorded on the quotation with the date and time · '+esc(q.number)+(q.status==="final"?' · finalized':'')+'</small></div>'+
    '<h4 class="qb-h">1. Quotation details</h4><div class="qb-g2">'+f("contact","Attention to",false,"e.g. Ms. Juana Dela Cruz",true)+f("client","Company name",false,"",true)+'</div>'+f("project","Project name",true)+f("payment","Payment terms",false,"e.g. PDC 30 days · COD · 50% down payment, balance upon delivery",false,"your client’s terms for this quote")+
    '<h4 class="qb-h">2. Prepared by</h4><label class="qb-behalf"><input type="checkbox" data-qb-f="behalf"'+(q.behalf?" checked":"")+(lock?" disabled":"")+'><span><b>I’m preparing this on behalf of a salesperson</b><small>e.g. sales assistants — the salesperson is printed under “Prepared by”, and you are noted as the one who created the file.</small></span></label>'+
    (q.behalf?f("rep","Salesperson’s name",false,"Name printed under Prepared by",true):'')+'<div class="qb-g2">'+f("repPosition",q.behalf?"Salesperson’s position":"Your position",true,"e.g. Account Executive")+f("repPhone",q.behalf?"Salesperson’s contact no.":"Your contact no.",true,"e.g. 0917 123 4567 / 709-8259 loc 1301")+'</div>'+
    '<h4 class="qb-h">3. Models, warranty, Care Packs and price</h4>'+
    (mains.length?mains.map(lineHtml).join(""):'<div class="qb-empty">No models yet. Use <b>Add to quote</b> on any product, or type a model or part number below.</div>')+
    (sugg.length?'<div class="qb-sh">Suggestions</div>'+sugg.map(function(x){return '<div class="qb-sug">'+ICON.shield+'<div><b>Make '+esc(x[0].sku)+' 3 years onsite</b><small>'+esc(x[1].sku)+' — '+esc(x[1].desc)+'</small><button class="btn btn-sm" data-qb="sugg" data-l="'+x[0].lid+'" data-cp="'+esc(x[1].sku)+'">'+ICON.plus+'Add Care Pack · '+peso(x[1].price)+'/unit</button></div><button class="qb-x" data-qb="sugg-x" data-l="'+x[0].lid+'" aria-label="Dismiss suggestion">'+ICON.x+'</button></div>';}).join(""):'')+
    (lock?'':'<div class="qb-add"><input id="qb-add" list="qb-skus" placeholder="Add another model — type a model or part number" aria-label="Add another model"><datalist id="qb-skus">'+allProducts().sort(familySort).map(function(p){return '<option value="'+esc(p.sku)+'">'+esc(p.name)+'</option>';}).join("")+'</datalist><button class="btn" data-qb="add">'+ICON.plus+'Add</button><button class="btn btn-quiet" data-qb="custom">Custom line</button></div>')+
    '<div class="qb-tot"><div><small>Models</small><b>'+prods.length+'</b></div><div><small>Total quantity</small><b>'+units+' unit'+(units===1?"":"s")+'</b></div><div class="big"><small>Total amount'+(S("pricesIncludeVat")?" (VAT incl.)":"")+'</small><b>'+peso(fromCents(t.total))+'</b></div></div>'+
    '<p class="qb-msg" id="qb-msg" role="status">'+esc(A.qbMsg||"")+'</p>';
}
function qbOpen(){if(!canSave()){toast("Saving quotations needs Contributor access",true);return;}
  var d=draftForEdit();A.qbId=d.id;A.qbMsg="";A.qbBad=[];A.qbOpenCp={};if(!d.q.rep&&A.me&&A.me.name)d.q.rep=A.me.name;
  modal({title:"Create quotation",wide:true,body:'<div id="qb">'+qbBody(d.q)+'</div>',left:'<button class="btn" data-maction="saved">Saved quotes</button><button class="btn btn-quiet" data-maction="full">Full editor</button>',actions:[["Save","save"],["New quote","new"],["Create quotation (PDF)","pdf","btn-primary"]],onAction:qbAction});
  var m=document.getElementById("modal");if(m)m.classList.add("qb-modal");}
function qbRefresh(){var el=document.getElementById("qb");if(!el)return;var d=qbQuote();if(!d)return;var mb=el.closest(".modal-b");var st=mb?mb.scrollTop:0;
  var ae=document.activeElement;var fk=ae&&el.contains(ae)?(ae.getAttribute("data-qb-f")?'[data-qb-f="'+ae.getAttribute("data-qb-f")+'"]'+(ae.getAttribute("data-l")?'[data-l="'+ae.getAttribute("data-l")+'"]':''):ae.id?"#"+ae.id:null):null;
  el.innerHTML=qbBody(d.q);if(mb)mb.scrollTop=st;if(fk){var n=el.querySelector(fk);if(n)try{n.focus();}catch(e){}}}
function qbMutate(fn,rerender){var d=qbQuote();if(!d)return;if(d.q.status==="final"){toast("Reopen the quotation in the full editor to edit it",true);return;}fn(d.q);qbSave(d.id,d.q);if(rerender){qbRefresh();A.keepScroll=true;render();}}
function qbValidate(q){var bad=[];if(!String(q.contact||"").trim())bad.push("contact");if(!String(q.client||"").trim())bad.push("client");if(q.behalf&&!String(q.rep||"").trim())bad.push("rep");
  var msgs=[];if(bad.indexOf("contact")>=0||bad.indexOf("client")>=0)msgs.push("Please fill in Attention to and Company name.");if(bad.indexOf("rep")>=0)msgs.push("Enter the salesperson’s name.");
  if(!(q.items||[]).length)msgs.push("Add at least one model.");
  (q.items||[]).forEach(function(it){if(it.bundled)return;if((it.kind==="product"&&!it.priceType||it.kind==="custom")&&!(Number(it.unit)>0))msgs.push((it.sku||it.name||"A line")+": enter the unit price.");});
  A.qbBad=bad;return msgs;}
function qbAction(a){var d=qbQuote();if(!d)return;var q=d.q;
  if(a==="saved"){closeModal();go("quotes");return;}
  if(a==="full"){if(!(q.items||[]).length&&!A.quotes.some(function(x){return x._id===d.id;})){toast("Add a model first",true);return;}qbSave(d.id,q,true).then(function(){});closeModal();go("quote",d.id);return;}
  if(a==="save"){qbSave(d.id,q,true).then(function(){toast("Quotation "+q.number+" saved");});A.qbMsg="Saved "+fmtDT(nowISO())+".";qbRefresh();return;}
  if(a==="new"){var had=(q.items||[]).length;if(had)qbSave(d.id,q,true);var id=rid(12);var nq=newQuote();if(A.me&&A.me.name)nq.rep=A.me.name;A.qbNew={id:id,q:nq};A.activeQuote=id;A.qbId=id;A.qbMsg=had?"Started a new quotation. The previous one is in Saved quotes.":"";A.qbBad=[];A.qbOpenCp={};qbRefresh();A.keepScroll=true;render();return;}
  if(a==="pdf"){var msgs=qbValidate(q);if(msgs.length){A.qbMsg=msgs.join(" ");qbRefresh();var b=document.querySelector("#qb .is-bad");if(b)b.focus();return;}
    if(!q.createdBy&&A.me&&A.me.name)q.createdBy=A.me.name;q.createdAt=q.createdAt||nowISO();
    qbSave(d.id,q,true);A.qbMsg="";qbRefresh();
    saveFile(q.number+" "+(q.client||"").replace(/[^\w\- ]/g,"").slice(0,40).trim()+".pdf",quotePdf(q)).then(function(ok){if(ok){logEvent("quote_pdf",{qid:d.id});}});return;}
}
function qbAddModel(){var inp=document.getElementById("qb-add");var v=inp?inp.value:"";var p=bySku(v)||(v.trim()?textSearch(v).res[0]:null);if(!v.trim()||!p){A.qbMsg="No model matches “"+v+"”.";qbRefresh();return;}
  if(priceBlocking(p.id)){addToQuote(p.id,1,{reopen:true});return;}
  qbMutate(function(q){var ex=q.items.find(function(it){return it.pid===p.id&&it.kind==="product"&&!it.bundled;});if(ex)ex.qty+=1;else q.items.push(lineFromProduct(p,1));A.state.quoted[p.id]=(A.state.quoted[p.id]||0)+1;},true);saveState();A.qbMsg="";var n=document.getElementById("qb-add");if(n){n.value="";n.focus();}}
function qbSetQty(q,it,v){var old=it.qty;it.qty=Math.max(1,Math.round(Number(v)||1));if(it.kind==="product")q.items.forEach(function(c){if(c.kind==="carepack"&&c.forPid===it.pid&&Number(c.qty)===Number(old))c.qty=it.qty;});}
document.addEventListener("click",function(e){var b=e.target.closest("#qb [data-qb]");if(!b)return;var a=b.getAttribute("data-qb"),lid=b.getAttribute("data-l");
  if(a==="add"){qbAddModel();return;}
  if(a==="custom"){qbMutate(function(q){q.items.push({lid:rid(8),kind:"custom",pid:null,sku:"",name:"",specs:"",priceType:null,unit:null,qty:1,discPct:null,discAmt:null,discApproved:false,bundled:false,note:"Manual price — verify"});},true);return;}
  if(a==="cptoggle"){A.qbOpenCp=A.qbOpenCp||{};A.qbOpenCp[lid]=!A.qbOpenCp[lid];qbRefresh();return;}
  if(a==="sugg-x"){A.qbDismiss=A.qbDismiss||{};A.qbDismiss[lid]=true;qbRefresh();return;}
  if(a==="sugg"){var it0=(qbQuote().q.items||[]).find(function(x){return x.lid===lid;});if(it0)addCarePack(it0.pid,b.getAttribute("data-cp"),lid);return;}
  qbMutate(function(q){var it=q.items.find(function(x){return x.lid===lid;});if(!it)return;
    if(a==="inc")qbSetQty(q,it,(Number(it.qty)||1)+1);else if(a==="dec")qbSetQty(q,it,(Number(it.qty)||1)-1);
    else if(a==="rm")q.items=q.items.filter(function(x){return x.lid!==lid&&!(it.kind==="product"&&x.kind==="carepack"&&x.forPid===it.pid);});},true);
});
document.addEventListener("keydown",function(e){if(e.key==="Enter"&&e.target&&e.target.id==="qb-add"){e.preventDefault();qbAddModel();}});
document.addEventListener("input",function(e){var el=e.target;if(!el.closest||!el.closest("#qb")||!el.hasAttribute("data-qb-f"))return;var k=el.getAttribute("data-qb-f"),lid=el.getAttribute("data-l");
  if(k==="qty"||k==="unit"||k==="priceType"||k==="behalf")return;
  var d=qbQuote();if(!d||d.q.status==="final")return;
  if(lid){var it=d.q.items.find(function(x){return x.lid===lid;});if(!it)return;it[k]=el.value;}else{d.q[k]=el.value;if(A.qbBad&&A.qbBad.indexOf(k)>=0&&el.value.trim()){A.qbBad=A.qbBad.filter(function(x){return x!==k;});el.classList.remove("is-bad");}}
  qbSave(d.id,d.q);});
document.addEventListener("change",function(e){var el=e.target;if(!el.closest||!el.closest("#qb")||!el.hasAttribute("data-qb-f"))return;var k=el.getAttribute("data-qb-f"),lid=el.getAttribute("data-l");
  if(k==="behalf"){qbMutate(function(q){q.behalf=el.checked;if(!el.checked&&A.me&&A.me.name)q.rep=A.me.name;else if(el.checked&&q.rep===(A.me&&A.me.name))q.rep="";},true);return;}
  if(k!=="qty"&&k!=="unit"&&k!=="priceType")return;
  qbMutate(function(q){var it=q.items.find(function(x){return x.lid===lid;});if(!it)return;
    if(k==="qty")qbSetQty(q,it,el.value);
    else if(k==="unit")it.unit=el.value===""?null:Math.max(0,Number(el.value));
    else if(k==="priceType"){var r=priceRec(it.pid);if(r&&r.types[el.value]){it.priceType=el.value;it.unit=Number(r.types[el.value].amount);it.priceDate=r.verifiedAt;}}},true);});
/* floating "Quote · N models" tray */
function renderQTray(){var el=document.getElementById("qtray");if(!el)return;var q=activeDraft();var prods=q?(q.items||[]).filter(function(it){return it.kind==="product";}):[];
  if(!prods.length||A.route.name==="quote"||A.route.name==="quotes"){el.innerHTML="";return;}
  var t=quoteTotals(q);var units=prods.reduce(function(a,it){return a+(Number(it.qty)||0);},0);
  el.innerHTML='<div class="sf-qtray" role="region" aria-label="Current quotation"><span class="sf-qti">'+ICON.quote+'</span><span class="sf-qtt"><b>Quote · '+prods.length+' model'+(prods.length===1?"":"s")+'</b><small>'+units+' unit'+(units===1?"":"s")+' · '+peso(fromCents(t.total))+'</small></span><button class="btn btn-primary btn-sm" data-act="qb-open">Review</button></div>';}
