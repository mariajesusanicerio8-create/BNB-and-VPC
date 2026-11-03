/* ============================== comparison ============================== */
var CMP_ROWS=[
  ["Identity",[["SKU",function(p){return p.sku;}],["Family",function(p){return p.family;}],["Category",function(p){return CATS[p.cat];}]]],
  ["Processor",[["Processor",function(p){return p.specs.processor;},"cpu"],["Cores / threads",function(p){return p.specs.cores;}],["Max speed",function(p){return p.specs.cpuSpeed;}],["Cache",function(p){return p.specs.cache;}]]],
  ["Memory",[["Memory",function(p){return p.specs.memory;},"ram"],["Configuration",function(p){return p.specs.memoryConfig;}],["Upgradeability",function(p){return p.specs.memorySlots;}]]],
  ["Storage",[["Storage",function(p){return p.specs.storage;},"storage"],["Bays / slots",function(p){return p.specs.storageSlots;}]]],
  ["Graphics",[["Graphics",function(p){return p.specs.graphics;},"gpu"],["Graphics memory",function(p){return p.specs.vram;},"vram"]]],
  ["Display",[["Screen size",function(p){return p.specs.screen;},"screen"],["Panel",function(p){return p.specs.display;}],["Touch",function(p){return p.specs.touch;}]]],
  ["Platform",[["Operating system",function(p){return p.specs.os;}],["Warranty",function(p){return p.specs.warranty;},"warranty"],["Wireless",function(p){return p.specs.wifi;}],["Wired network",function(p){return p.specs.network;}],["Port modules",function(p){return p.specs.io;}],["PCIe expansion",function(p){return p.specs.expansion;}],["Power supply",function(p){return p.specs.psu;}],["Weight",function(p){return p.specs.weight;}],["Dimensions",function(p){return p.specs.dimensions;}],["Business features",function(p){return (p.features||[]).join("; ");}]]],
  ["Commercial",[["Approved price",function(p){var s=sellPrice(p.id);return s?peso(s.amount)+" ("+PTYPE_SHORT[s.type]+")":null;},"price"],["Difference vs lowest",null,"pdiff"],["Price flags",function(p){return priceFlags(p.id).map(function(f){return f.t;}).join(", ")||"OK";}],["Availability",function(p){return (STATUS[p.status]||STATUS.unconfirmed)[0]+(p.stockQty!=null?" ("+p.stockQty+" pcs)":"");},"avail"]]]
];
function metric(p,k){switch(k){case "ram":return ramGB(p);case "storage":return storageGB(p);case "vram":return vramGB(p);case "screen":return screenIn(p);case "warranty":return warrantyYears(p);case "price":var s=sellPrice(p.id);return s?s.amount:null;case "avail":return p.status==="in_stock"?2:p.status==="available"?1:0;}return null;}
function compareModel(ids){
  var ps=ids.map(P).filter(Boolean);var prices=ps.map(function(p){return metric(p,"price");});var minP=Math.min.apply(null,prices.filter(function(x){return x!=null;}));
  var rows=[];
  CMP_ROWS.forEach(function(g){rows.push({group:g[0]});g[1].forEach(function(r){
    var vals=ps.map(function(p){if(r[2]==="pdiff"){var x=metric(p,"price");return x==null?null:(x===minP?"Lowest price":"+"+peso(x-minP));}return r[1](p)||null;});
    if(vals.every(function(v){return !v;}))return;
    var row={label:r[0],vals:vals,best:[],hint:"",differs:uniq(vals.map(String)).length>1};
    var k=r[2];
    if(["ram","storage","vram","screen","warranty"].indexOf(k)>=0&&row.differs){var m=ps.map(function(p){return metric(p,k);});var mx=Math.max.apply(null,m.filter(function(x){return x!=null;}));if(isFinite(mx)&&mx>0)row.best=m.map(function(x){return x===mx;});row.hint={ram:"More memory",storage:"More storage",vram:"More graphics memory",screen:"Larger display",warranty:"Longer warranty"}[k];}
    if(k==="price"&&row.differs){row.best=prices.map(function(x){return x===minP;});row.hint="Lowest price";}
    if(k==="avail"&&row.differs){var a=ps.map(function(p){return metric(p,"avail");});var ma=Math.max.apply(null,a);row.best=a.map(function(x){return x===ma&&ma>0;});row.hint="Better availability";}
    if(k==="gpu"&&row.differs){var cls=ps.map(function(p){return dedicated(p)?1:0;});if(uniq(cls).length>1){row.best=cls.map(function(c){return c===1;});row.hint="Dedicated GPU";}}
    if(k==="cpu"&&row.differs){var ci=ps.map(cpuInfo);var ladders=uniq(ci.map(function(c){return c.ladder;}));if(ladders.length===1&&ci.every(function(c){return c.tier!=null;})){var mt=Math.max.apply(null,ci.map(function(c){return c.tier;}));if(uniq(ci.map(function(c){return c.tier;})).length>1){row.best=ci.map(function(c){return c.tier===mt;});row.hint="Higher tier (same family)";}}else row.note="Different processor architectures — not ranked automatically. Check benchmarks for the client’s workload.";}
    rows.push(row);});});
  return {ps:ps,rows:rows,minP:minP};
}
function compareSummary(ps){
  if(ps.length<2)return [];
  var out=[];var by=function(k,dir){var m=ps.map(function(p){return {p:p,v:metric(p,k)};}).filter(function(x){return x.v!=null;});if(!m.length)return null;m.sort(function(a,b){return dir*(b.v-a.v);});if(m.length>1&&m[0].v===m[1].v)return null;return m[0];};
  var lp=by("price",-1);if(lp)out.push(["Lowest price",lp.p,peso(lp.v)]);
  var r=by("ram",1);if(r)out.push(["Most memory",r.p,r.v+"GB"]);
  var v=by("vram",1);if(v&&v.v>0)out.push(["Most dedicated graphics memory",v.p,v.v+"GB"]);
  var s=by("storage",1);if(s)out.push(["Most storage",s.p,s.v>=1000?(s.v/1000)+"TB":s.v+"GB"]);
  var sc=by("screen",1);if(sc)out.push(["Largest display",sc.p,sc.v+'"']);
  var av=ps.filter(function(p){return p.status==="in_stock";});if(av.length&&av.length<ps.length)out.push(["Available from stock",av[0],av.map(function(p){return p.sku;}).join(", ")]);
  return out;
}
function viewCompare(){
  if(A.compare.length<2)return '<div class="page-h"><div><h1>Compare models</h1><p>Pick 2 to 4 products with “Compare” on any card, or paste SKUs below.</p></div></div>'+
    '<section class="panel panel-b" style="display:grid;gap:10px"><div class="field"><label for="cmp-skus">SKUs to compare</label><textarea id="cmp-skus" placeholder="e.g. CJ9S1PT, CW6L2PT, DR1N2PT">'+esc(A.compare.map(function(id){return (P(id)||{}).sku;}).join(", "))+'</textarea></div><div class="btn-row"><button class="btn btn-primary" data-act="cmp-from-skus">Compare these SKUs</button></div></section>'+
    (A.comparisons.length?panel("Saved comparisons",'<ul class="list">'+A.comparisons.map(function(c){return '<li><span class="grow"><b>'+esc(c.name)+'</b><span class="small muted">'+(c.ids||[]).map(function(i){return (P(i)||{}).sku||i;}).join(", ")+'</span></span><button class="btn btn-sm" data-loadcmp="'+c._id+'">Open</button><button class="btn btn-sm btn-quiet" data-delcmp="'+c._id+'">Delete</button></li>';}).join("")+'</ul>'):'');
  var m=compareModel(A.compare);var ps=m.ps;var sum=compareSummary(ps);
  var rec=A.lastMatch&&A.lastMatch.req?bestForReq(ps,A.lastMatch.req):null;
  return '<div class="page-h"><div><h1>Compare '+ps.length+' models</h1><p>Equivalent specifications are on the same row. Green marks the stronger value where it can be measured; yellow rows differ.</p></div>'+
    '<div class="btn-row"><button class="btn" data-act="cmp-copy">'+ICON.copy+'Copy comparison</button><button class="btn" data-act="cmp-pdf">'+ICON.dl+'Export PDF</button><button class="btn" data-act="cmp-save">Save comparison</button><button class="btn" data-act="cmp-alt">Find a better-fit alternative</button><button class="btn btn-primary" data-act="cmp-quote">Add all to quotation</button><button class="btn btn-quiet" data-act="cmp-clear">Clear</button></div></div>'+
    '<section class="panel"><div class="panel-h"><h2>Summary</h2></div><div class="panel-b" style="display:grid;gap:8px">'+
      (rec?'<div class="notice ok"><b>Best fit for the current client requirements: '+esc(rec.p.sku)+'.</b> '+esc(rec.why)+'</div>':'')+
      (sum.length?'<ul style="margin:0;padding-left:18px;display:grid;gap:3px">'+sum.map(function(s){return '<li><b>'+esc(s[0])+':</b> '+esc(s[1].sku)+' — '+esc(s[2])+'</li>';}).join("")+'</ul>':'')+
      '<p class="small muted">A newer or more expensive model is not automatically better. Processors from different families are not ranked; use the client’s workload and the Requirements checker to decide.'+(rec?'':' Run the Requirements checker to get a fit-based recommendation.')+'</p></div></section>'+
    '<section class="panel"><div class="tbl-wrap"><table class="tbl cmp"><thead><tr><th>Specification</th>'+ps.map(function(p){return '<th style="text-transform:none;letter-spacing:0"><span class="sku">'+esc(p.sku)+'</span><div style="font-size:13px;color:var(--ink);margin-top:4px;white-space:normal">'+esc(p.name)+'</div><button class="btn btn-sm btn-quiet" data-uncmp="'+p.id+'">Remove</button></th>';}).join("")+'</tr></thead><tbody>'+
    m.rows.map(function(r){if(r.group)return '<tr><td colspan="'+(ps.length+1)+'" class="label" style="background:var(--surface-2)">'+esc(r.group)+'</td></tr>';
      return '<tr><td><b style="font-weight:500">'+esc(r.label)+'</b>'+(r.note?'<span class="small muted" style="display:block">'+esc(r.note)+'</span>':'')+'</td>'+r.vals.map(function(v,i){var cls=r.best[i]?"best":(r.differs?"diff":"");return '<td class="'+cls+'">'+(v?esc(v):'<span class="unv">Not listed</span>')+(r.best[i]&&r.hint?'<span class="hint">'+esc(r.hint)+'</span>':'')+'</td>';}).join("")+'</tr>';}).join("")+
    '</tbody></table></div></section>';
}
function compareText(ps){
  var m=compareModel(ps.map(function(p){return p.id;}));var L=["Product comparison ("+fmtDate(today())+")",""];
  m.rows.forEach(function(r){if(r.group){L.push("");L.push(r.group.toUpperCase());return;}L.push(r.label+": "+r.vals.map(function(v,i){return m.ps[i].sku+" = "+(v||"Not listed");}).join(" | "));});
  var s=compareSummary(m.ps);if(s.length){L.push("");L.push("SUMMARY");s.forEach(function(x){L.push("- "+x[0]+": "+x[1].sku+" ("+x[2]+")");});}
  L.push("");L.push("Prices are "+(S("pricesIncludeVat")?"VAT inclusive":"VAT exclusive")+" and subject to change. Specifications from the approved price list.");
  return L.join("\n");
}
