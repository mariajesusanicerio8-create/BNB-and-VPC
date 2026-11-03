/* ============================== HP Care Packs (business notebooks) ============================== */
/* Data: CAREPACKS (HP Care Pack Central 2.0, Philippines) — catalog SKU → row, sets of SKUs, byPn part number → set */
function cpRec(sku){var C=window.CAREPACKS;var v=C&&C.catalog[sku];if(!v)return (typeof cpLookupIndex==="function"&&cpLookupIndex()[sku])||null;
  return {sku:sku,desc:v[0],price:v[1],months:v[2],support:v[3],response:v[4],window:v[5],place:v[6],warranty:v[7],section:v[8],category:v[9],sheet:v[10]};}
function carePacksFor(p){if(!p)return [];var im=typeof cpImported==="function"?cpImported(p):null;if(im&&(im.items||[]).length)return im.items.map(cpFromImported);var C=window.CAREPACKS;if(!C)return [];var set=C.byPn[p.sku]||C.byPn[baseSku(p.sku)];if(!set)return [];
  var seen={};return (C.sets[set]||[]).filter(function(s){if(seen[s])return false;seen[s]=1;return true;}).map(cpRec).filter(Boolean);}
function cpDur(m){if(!m)return "No fixed term";if(m%12===0){var y=m/12;return y+" year"+(y===1?"":"s");}return m+" months";}
function cpResp(r){return ({"Next business day response":"Next business day","Repaired within 3-7 business days":"Repaired within 3–7 business days"})[r]||r;}
function cpWin(w){return ({"Standard workdays - 9 hours":"9×5 (standard workdays)","7 days a week - 24 hours":"24×7"})[w]||w;}
function cpCoverage(c){return [c.support,c.response&&cpResp(c.response),c.window&&cpWin(c.window),c.place].filter(Boolean).join(" · ");}
function cpValidity(c){return cpDur(c.months)+(c.warranty?" · "+c.warranty:"");}
function cpSpecs(c){return ["Coverage: "+(cpCoverage(c)||"—"),"Validity: "+cpValidity(c)].join(" | ");}
function cpState(pid){A.cpf=A.cpf||{};return A.cpf[pid]=A.cpf[pid]||{sec:"C",dur:"all",cov:"all",sup:"all",q:"",all:false};}
function cpFiltered(all,f){
  var inSec=all.filter(function(c){return c.section===f.sec;});
  var q=(f.q||"").toLowerCase().trim();
  return {inSec:inSec,list:inSec.filter(function(c){return (f.dur==="all"||c.months===+f.dur)&&(f.cov==="all"||c.warranty===f.cov)&&(f.sup==="all"||c.support===f.sup)&&(!q||(c.sku+" "+c.desc+" "+c.support+" "+(c.place||"")).toLowerCase().indexOf(q)>=0);})};}
/* the picker body; ctx "page" (product page) or "quote" (modal from a quotation line, with lid) */
function cpBoxInner(p,ctx,lid){
  var all=carePacksFor(p);if(!all.length)return '<p class="small muted">HP lists no Care Packs for this part number.</p>';
  var f=cpState(p.id);var r=cpFiltered(all,f);
  var uniqSorted=function(arr,key,num){var u=[];arr.forEach(function(c){var v=c[key];if(v!=null&&v!==""&&u.indexOf(v)<0)u.push(v);});return u.sort(function(a,b){return num?(a||999)-(b||999):String(a).localeCompare(String(b));});};
  var durs=uniqSorted(r.inSec,"months",true),covs=uniqSorted(r.inSec,"warranty"),sups=uniqSorted(r.inSec,"support");
  if(f.dur!=="all"&&durs.indexOf(+f.dur)<0)f.dur="all";if(f.cov!=="all"&&covs.indexOf(f.cov)<0)f.cov="all";if(f.sup!=="all"&&sups.indexOf(f.sup)<0)f.sup="all";
  r=cpFiltered(all,f);
  var hasS=all.some(function(c){return c.section==="S";});
  var chip=function(k,v,l){return '<button type="button" class="cp-chip" data-cpf="'+k+'" data-v="'+esc(v)+'" aria-pressed="'+(String(f[k])===String(v))+'">'+esc(l)+'</button>';};
  var sel=function(k,label,vals){return '<label class="cp-sel"><span>'+label+'</span><select class="sel" data-cpf="'+k+'"><option value="all">Any</option>'+vals.map(function(v){return '<option'+(f[k]===v?" selected":"")+'>'+esc(v)+'</option>';}).join("")+'</select></label>';};
  var limit=ctx==="page"&&!f.all?8:400;var shown=r.list.slice(0,limit);
  return '<div class="cp-filters">'+
      (hasS?'<div class="cp-chips" role="group" aria-label="Care Pack type">'+chip("sec","C","Hardware support")+chip("sec","S","Stand-alone services")+'</div>':'')+
      '<div class="cp-chips" role="group" aria-label="Duration">'+chip("dur","all","All durations")+durs.map(function(m){return chip("dur",m,cpDur(m));}).join("")+'</div>'+
      '<div class="cp-row">'+sel("cov","Coverage",covs)+sel("sup","Service",sups)+'<label class="cp-sel grow"><span>Search</span><input class="inp" type="search" data-cpf="q" value="'+esc(f.q||"")+'" placeholder="SKU or e.g. ADP, DMR, Travel"></label></div></div>'+
    '<p class="small muted cp-count">'+r.list.length+' of '+all.length+' Care Packs HP lists for <span class="sku">'+esc(p.sku)+'</span></p>'+
    '<div class="cp-list">'+(shown.length?shown.map(function(c){
      return '<div class="cp-item"><div class="cp-main"><div class="cp-top"><span class="sku">'+esc(c.sku)+'</span><b class="cp-price">'+(c.price!=null?peso(c.price):"Price on request")+'</b></div>'+
        '<div class="cp-desc">'+esc(c.desc)+'</div><div class="small muted"><b>Coverage:</b> '+esc(cpCoverage(c)||"—")+'</div><div class="small muted"><b>Validity:</b> '+esc(cpValidity(c))+'</div></div>'+
        '<button class="btn btn-sm'+(ctx==="quote"?" btn-primary":"")+'" data-cpadd="'+esc(c.sku)+'" data-pid="'+esc(p.id)+'"'+(lid?' data-lid="'+esc(lid)+'"':'')+(c.price==null?' disabled title="HP lists no price"':'')+'>'+(ctx==="quote"?"Add":ICON.plus+"Add to quotation")+'</button></div>';}).join(""):'<p class="small muted">No Care Packs match these filters.</p>')+'</div>'+
    (r.list.length>shown.length?'<button class="btn btn-quiet btn-sm" data-cpmore="'+esc(p.id)+'">Show all '+r.list.length+'</button>':'')+
    (ctx==="page"&&f.all&&r.list.length>8?'<button class="btn btn-quiet btn-sm" data-cpless="'+esc(p.id)+'">Show fewer</button>':'');
}
function carePackPanel(p){var all=carePacksFor(p);if(!all.length)return "";
  var yrs=uniq(all.filter(function(c){return c.section==="C"&&c.months;}).map(function(c){return c.months/12;})).sort(function(a,b){return a-b;});
  return '<section class="panel" id="carepacks"><div class="panel-h"><h2>HP Care Packs</h2><span class="small muted">'+all.length+' options'+(yrs.length?' · '+yrs[0]+'–'+yrs[yrs.length-1]+' years':'')+' · HP list prices, PHP</span></div>'+
    '<div class="panel-b cpbox" data-cpbox="'+esc(p.id)+'" data-cpctx="page">'+cpBoxInner(p,"page")+'</div>'+
    '<div class="panel-b small muted" style="border-top:1px solid var(--line)">Care Packs HP lists for this exact part number on HP Care Pack Central (Philippines), retrieved '+fmtDate(cpRetrieved(p))+'. Confirm the price before sending a quotation.</div></section>';}
function cpRefresh(box){var pid=box.getAttribute("data-cpbox");var p=P(pid);if(!p)return;var ctx=box.getAttribute("data-cpctx");var foc=document.activeElement&&box.contains(document.activeElement)?document.activeElement.getAttribute("data-cpf"):null;var pos=foc==="q"?document.activeElement.selectionStart:null;
  box.innerHTML=cpBoxInner(p,ctx,box.getAttribute("data-cplid"));if(foc){var el=box.querySelector('[data-cpf="'+foc+'"]:not(button)');if(el){el.focus();if(pos!=null)try{el.setSelectionRange(pos,pos);}catch(e){}}}}
function cpLine(c,qty,forLine){return {lid:rid(8),kind:"carepack",pid:null,forPid:forLine?forLine.pid:null,forSku:forLine?forLine.sku:"",sku:c.sku,name:c.desc,specs:cpSpecs(c),priceType:"cplist",unit:c.price,priceDate:(forLine&&forLine.pid&&typeof cpRetrieved==="function"?cpRetrieved(P(forLine.pid)):null)||CAREPACKS.retrieved,priceSource:"HP Care Pack Central (Philippines)",qty:qty||1,discPct:null,discAmt:null,discApproved:false,bundled:false,ack:false,note:""};}
/* from a quotation line: insert right after the notebook line, same quantity */
function carePackModal(lid){var q=curQuote();if(!q)return;var it=(q.items||[]).find(function(x){return x.lid===lid;});var p=it&&P(it.pid);if(!p)return;
  modal({title:"HP Care Pack for "+p.sku,wide:true,body:'<p class="small muted" style="margin:0 0 8px">'+esc(p.name)+' · quantity '+it.qty+'. The Care Pack is added under this notebook with the same quantity.</p><div class="cpbox" data-cpbox="'+esc(p.id)+'" data-cpctx="quote" data-cplid="'+esc(lid)+'">'+cpBoxInner(p,"quote",lid)+'</div>',actions:[["Close","close"]]});}
function addCarePack(pid,sku,lid){var c=cpRec(sku);var p=P(pid);if(!c||!p)return;
  if(lid){var inQb=!!document.getElementById("qb");var d=inQb?qbQuote():(A.route.name==="quote"?{id:A.route.arg,q:getQuote(A.route.arg)}:null);
    if(d&&d.q){var q=d.q;if(q.status==="final"){toast("Reopen the quotation to edit it",true);return;}var i=q.items.findIndex(function(x){return x.lid===lid;});if(i>=0){var base=q.items[i];var j=i+1;while(j<q.items.length&&q.items[j].kind==="carepack"&&q.items[j].forPid===base.pid)j++;q.items.splice(j,0,cpLine(c,base.qty,base));
      if(inQb){qbSave(d.id,q,true);A.qbOpenCp={};qbRefresh();}else{saveQuote(d.id,q,true);closeModal();}A.keepScroll=true;render();toast(c.sku+" added under "+p.sku);if(typeof logEvent==="function")logEvent("carepack_add",{sku:c.sku,pid:pid});return;}}}
  addToQuote(pid,1,{cp:c});}
document.addEventListener("click",function(e){
  var b=e.target.closest("[data-cpf],[data-cpadd],[data-cpmore],[data-cpless]");if(!b)return;
  if(b.hasAttribute("data-cpadd")){e.stopPropagation();addCarePack(b.getAttribute("data-pid"),b.getAttribute("data-cpadd"),b.getAttribute("data-lid"));return;}
  var box=b.closest("[data-cpbox]");if(!box)return;var f=cpState(box.getAttribute("data-cpbox"));
  if(b.hasAttribute("data-cpmore")){f.all=true;cpRefresh(box);return;}
  if(b.hasAttribute("data-cpless")){f.all=false;cpRefresh(box);return;}
  if(b.tagName==="BUTTON"){var k=b.getAttribute("data-cpf");f[k]=b.getAttribute("data-v");if(k==="sec"){f.dur="all";f.cov="all";f.sup="all";}cpRefresh(box);}
});
document.addEventListener("change",function(e){var el=e.target;if(!el.matches||!el.matches("select[data-cpf]"))return;var box=el.closest("[data-cpbox]");if(!box)return;cpState(box.getAttribute("data-cpbox"))[el.getAttribute("data-cpf")]=el.value;cpRefresh(box);});
var cpSearchSoon=debounce(function(box){cpRefresh(box);},200);
document.addEventListener("input",function(e){var el=e.target;if(!el.matches||!el.matches('input[data-cpf="q"]'))return;var box=el.closest("[data-cpbox]");if(!box)return;cpState(box.getAttribute("data-cpbox")).q=el.value;cpSearchSoon(box);});
