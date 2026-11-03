/* ============================== price list (grouped by category → series) ============================== */
function plSlug(s){return "pl-"+String(s).toLowerCase().replace(/[^a-z0-9]+/g,"-");}
function keySpecs(p){var s=p.specs||{},r=ramGB(p),st=storageGB(p);
  return [s.processor?String(s.processor).replace(/\s*\(.*$/,"").replace(/ processor$/i,""):"",r?r+"GB RAM":s.memory,st?(st>=1000?(st/1000)+"TB":st+"GB")+" SSD":s.storage,dedicated(p)?gpuShort(p):"",(p.cat==="zbook"||p.cat==="nb")&&screenIn(p)?screenIn(p)+'" display':"",p.cat==="tc"?s.os:""].filter(Boolean);}
function priceStatus(p){var fl=priceFlags(p.id).filter(function(f){return f.k!=="changed";});var ch=priceFlags(p.id).some(function(f){return f.k==="changed";});var r=priceRec(p.id)||{};
  var tip="Effective "+fmtDate(r.effective)+(r.expires?" to "+fmtDate(r.expires):"")+" · verified "+fmtDate(r.verifiedAt);
  return fl.length?fl.map(function(f){return '<span class="tag '+f.c+'" title="'+esc(tip)+'">'+esc(f.t)+'</span>';}).join(" "):'<span class="tag t-ok" title="'+esc(tip)+'">'+(ch?"Updated":"Approved")+'</span>';}
function plFilter(){var F=A.pf;
  return allProducts().filter(function(p){if(F.cat!=="all"&&p.cat!==F.cat)return false;
    if(F.q){var h=hayOf(p);if(!F.q.toLowerCase().split(/\s+/).every(function(t){return h.indexOf(t)>=0;}))return false;}
    if(F.stock&&!(p.stockQty>0))return false;
    var fl=priceFlags(p.id);if(F.flag==="attn")return fl.some(function(f){return f.k!=="changed";});if(F.flag==="changed")return fl.some(function(f){return f.k==="changed";});return true;}).sort(familySort);}
function viewPrices(){
  var F=A.pf||{cat:"all",flag:"all",q:"",stock:false};A.pf=F;
  var all=allProducts(),list=plFilter();
  var attn=all.filter(function(p){return priceFlags(p.id).some(function(f){return f.k!=="changed";});}).length;
  var recs=all.map(function(p){return priceRec(p.id)||{};});
  var eff=recs.map(function(r){return r.effective||"";}).filter(Boolean).sort().pop(),ver=recs.map(function(r){return r.verifiedAt||"";}).filter(Boolean).sort().pop();
  // group: category → series
  var groups=[],gi={};list.forEach(function(p){var k=p.family||p.series||"Other";if(!(k in gi)){gi[k]=groups.length;groups.push({name:k,cat:p.cat,ps:[]});}groups[gi[k]].ps.push(p);});
  var catCount=function(c){return all.filter(function(p){return c==="all"||p.cat===c;}).length;};
  var seg='<div class="seg" role="tablist" aria-label="Category">'+[["all","All products"]].concat(CAT_ORDER.map(function(c){return [c,CAT_TAB[c]||CATS[c]];})).map(function(c){return '<button role="tab" data-act="pf-cat" data-cat="'+c[0]+'" aria-selected="'+(F.cat===c[0])+'">'+esc(c[1])+'<span>'+catCount(c[0])+'</span></button>';}).join("")+'</div>';
  var jump=groups.length>1?'<nav class="jump" aria-label="Jump to series">'+groups.map(function(g){return '<button data-act="pl-jump" data-id="'+plSlug(g.name)+'">'+esc(g.name.replace(/^HP /,""))+'<span>'+g.ps.length+'</span></button>';}).join("")+'</nav>':"";
  var body="",curCat=null;
  groups.forEach(function(g){
    if(g.cat!==curCat){curCat=g.cat;var n=list.filter(function(p){return p.cat===g.cat;}).length;body+='<div class="pl-cat"><span class="pl-cat-bar"></span><h2>'+esc(CATS[g.cat]||g.cat)+'</h2><span>'+n+' SKU'+(n===1?"":"s")+'</span></div>';}
    var types=Object.keys(PTYPES).filter(function(t){return g.ps.some(function(p){return priceTypes(p.id).indexOf(t)>=0;});});
    var amts=g.ps.map(function(p){return (sellPrice(p.id)||{}).amount;}).filter(function(v){return v!=null;});
    var units=g.ps.reduce(function(a,p){return a+(p.stockQty>0?p.stockQty:0);},0);
    var img=null;g.ps.some(function(p){var im=imgOf(p);if(im.length){img=im[0].id;return true;}return false;});
    var cols='style="--n:'+types.length+'"';
    body+='<section class="pl-sec'+(A.isAdmin?" adm":"")+'" id="'+plSlug(g.name)+'"><header class="pl-sec-h"><button class="thumb" data-family="'+esc(g.name)+'" aria-label="Browse '+esc(g.name)+' in Products">'+(img?'<img src="/_blob/'+esc(img)+'" alt="" loading="lazy">':'<span class="no-img">'+esc(g.name)+'</span>')+'</button>'+
      '<div class="pl-sec-t"><span class="sc-cat">'+esc(CAT_SHORT[g.cat]||"")+'</span><h3>'+esc(g.name)+'</h3><span class="small muted">'+g.ps.length+' configuration'+(g.ps.length===1?"":"s")+'</span></div>'+
      '<div class="pl-sec-k">'+(amts.length?'<span class="pl-from"><small>'+(amts.length>1&&Math.min.apply(null,amts)!==Math.max.apply(null,amts)?"From":"Price")+'</small><b>'+peso(Math.min.apply(null,amts))+'</b></span>':'')+(units?'<span class="tag t-ok">'+units+' on hand</span>':'')+'</div></header>'+
      '<div class="pl-head" '+cols+'><span></span><span>Product</span><span>Availability</span>'+types.map(function(t){return '<span class="r">'+esc(PTYPE_SHORT[t])+'</span>';}).join("")+'<span class="r">Price status</span><span></span></div>'+
      g.ps.map(function(p){var r=priceRec(p.id)||{types:{}};var sp=sellPrice(p.id);var bad=priceFlags(p.id).some(function(f){return f.c==="t-bad";});
        return '<div class="pl-row'+(bad?" bad":"")+'" '+cols+'><button class="thumb" data-open="'+p.id+'" aria-label="Open '+esc(p.name)+'">'+thumbHtml(p)+'</button>'+
          '<div class="pl-name"><button data-open="'+p.id+'">'+esc(p.name.replace(/^HP /,""))+'</button><div class="pl-meta"><span class="sku">'+esc(p.sku)+'</span><span>'+esc(keySpecs(p).join(" · "))+'</span></div></div>'+
          '<div class="pl-avail">'+statusTag(p)+'</div>'+
          types.map(function(t){var v=r.types&&r.types[t]?r.types[t].amount:null;var sel=sp&&sp.type===t;return '<div class="pl-price'+(sel?" is-sel":"")+(v==null?" none":"")+'" data-label="'+esc(PTYPE_SHORT[t])+'">'+(v!=null?peso(v):isTBA(p.id)?'<span class="muted">TBA</span>':'—')+(sel?'<small>Selling price</small>':'')+'</div>';}).join("")+
          '<div class="pl-st">'+priceStatus(p)+'</div>'+
          '<div class="pl-act">'+(A.isAdmin?'<button class="btn btn-sm" data-editprice="'+p.id+'">Edit</button>':'')+'<button class="btn btn-sm" data-copymenu="'+p.id+'" aria-label="Copy or download for '+esc(p.sku)+'">'+ICON.copy+'</button><button class="btn btn-sm btn-primary" data-addq="'+p.id+'" aria-label="Add '+esc(p.sku)+' to quotation">'+ICON.plus+'<span class="hide-sm">Quote</span></button></div></div>';}).join("")+
    '</section>';});
  return banner({compact:true,title:"Iontech × HP approved price list",sub:"Every HP workstation, business notebook and thin client we carry, grouped by series. The highlighted amount is the approved selling price used in quotations. "+(S("pricesIncludeVat")?"All amounts include "+S("vatRate")+"% VAT.":"Amounts exclude VAT."),
      chips:[[all.length,"SKUs"],[uniq(all.map(function(p){return p.family||p.series;})).length,"series"],[eff?esc(fmtDate(eff)):"—","effective"]],
      actions:'<button class="btn btn-hero" data-act="price-xlsx">'+ICON.dl+'Download price list (Excel)</button><button class="btn btn-hero-ghost" data-act="prices-csv">'+ICON.dl+'CSV</button>'+(A.isAdmin?'<button class="btn btn-hero-ghost" data-go="admin" data-tab="import">Bulk update</button>':'')})+
    '<div class="pl-tools">'+seg+'<div class="toolbar" style="margin:0"><input class="inp" id="pf-q" placeholder="Filter by SKU, model, CPU, GPU…" value="'+esc(F.q)+'" style="flex:1;min-width:180px;max-width:340px" aria-label="Filter price list">'+
      '<label class="chk small"><input type="checkbox" data-act-chk="pf-stock"'+(F.stock?" checked":"")+'> In stock only</label>'+
      '<select class="sel" id="pf-flag" aria-label="Price status"><option value="all">All prices</option><option value="attn"'+(F.flag==="attn"?" selected":"")+'>Needs attention ('+attn+')</option><option value="changed"'+(F.flag==="changed"?" selected":"")+'>Changed in 14 days</option></select>'+
      (F.q||F.flag!=="all"||F.stock||F.cat!=="all"?'<button class="btn btn-quiet" data-act="pf-reset">Clear filters</button>':'')+
      '<span class="small muted" style="margin-left:auto">'+list.length+' of '+all.length+' SKUs</span></div>'+jump+'</div>'+
    (list.length?body:'<div class="panel empty">No SKUs match these filters. <button class="btn btn-sm" data-act="pf-reset">Clear filters</button></div>');
}
