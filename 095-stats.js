/* ============================== admin-only statistics ============================== */
A.statDays=30;A.names={};
function resolveNames(ids){var miss=ids.filter(function(i){return !(i in A.names);});if(!miss.length||!A.user||!A.user.profiles)return;
  miss.forEach(function(i){A.names[i]="";});
  A.user.profiles(miss).then(function(ps){miss.forEach(function(i){A.names[i]=(ps&&ps[i]&&ps[i].name)||"";});rerender();}).catch(function(){});}
function nameOf(uid){return A.names[uid]||(uid===A.uid&&A.me&&A.me.name)||"Team member "+String(uid).slice(-4);}
function sumMaps(list,key){var o={};list.forEach(function(r){var m=r[key]||{};Object.keys(m).forEach(function(k){o[k]=(o[k]||0)+m[k];});});return o;}
function topRows(map,n,label){var ks=Object.keys(map).sort(function(a,b){return map[b]-map[a];}).slice(0,n);var max=ks.length?map[ks[0]]:1;
  if(!ks.length)return '<p class="small muted" style="margin:0">No activity in this period.</p>';
  return ks.map(function(k){return '<div class="bar-row"><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+label(k)+'</span><i style="width:'+Math.max(4,Math.round(map[k]/max*100))+'%"></i><b>'+map[k]+'</b></div>';}).join("");}
function prodLabel(pid){var p=P(pid);return p?'<a href="#product-'+esc(pid)+'" data-open="'+esc(pid)+'"><span class="sku">'+esc(p.sku)+'</span></a> '+esc(p.name.replace(/^HP /,"")):esc(pid);}
function viewStats(){
  if(!A.isAdmin)return '<div class="panel empty"><b>Statistics are only available to admins.</b></div>';
  var days=A.statDays,from=addDays(today(),-(days-1));
  var rows=A.stats.filter(function(r){return r.day&&r.day>=from;});
  var uids=uniq(rows.map(function(r){return r.uid;}));resolveNames(uids);
  var sum=function(k){return rows.reduce(function(a,r){return a+(Number(r[k])||0);},0);};
  var views=sumMaps(rows,"views"),searches=sumMaps(rows,"searches"),ds=sumMaps(rows,"datasheets"),quoted=sumMaps(rows,"quoted");
  var tot=function(m){return Object.keys(m).reduce(function(a,k){return a+m[k];},0);};
  var perDay={};rows.forEach(function(r){perDay[r.day]=(perDay[r.day]||0)+(r.events||0);});
  var dayList=[];for(var i=days-1;i>=0;i--)dayList.push(addDays(today(),-i));var dmax=Math.max(1,Math.max.apply(null,dayList.map(function(d){return perDay[d]||0;})));
  var byUser={};rows.forEach(function(r){var u=byUser[r.uid]=byUser[r.uid]||{views:0,searches:0,qn:0,qf:0,val:0,ds:0,last:""};u.views+=tot(r.views||{});u.searches+=tot(r.searches||{});u.qn+=r.quotesNew||0;u.qf+=r.quotesFinal||0;u.val+=r.finalValue||0;u.ds+=tot(r.datasheets||{});if((r.lastAt||"")>u.last)u.last=r.lastAt||"";});
  // catalog statistics
  var ps=allProducts();var byCat={},byStatus={},units=0,unitsVal=0,flagged=0,noImg=0,noPrice=0;
  ps.forEach(function(p){byCat[p.cat]=(byCat[p.cat]||0)+1;byStatus[p.status]=(byStatus[p.status]||0)+1;if(p.stockQty>0){units+=p.stockQty;var sp=sellPrice(p.id);if(sp)unitsVal+=sp.amount*p.stockQty;}if(priceBlocking(p.id))flagged++;if(!imgOf(p).length)noImg++;if(!sellPrice(p.id))noPrice++;});
  var kpi=function(l,v,sub){return '<div class="kpi"><span>'+esc(l)+'</span><b>'+v+'</b>'+(sub?'<span>'+sub+'</span>':'')+'</div>';};
  return '<div class="page-h"><div><h1>Statistics</h1><p>Visible to admins only. Sales users record activity here but cannot see it.</p></div><div class="btn-row">'+[7,30,90].map(function(n){return '<button class="btn btn-sm'+(days===n?' btn-primary':'')+'" data-act="stat-days" data-n="'+n+'">'+n+" days"+'</button>';}).join("")+'</div></div>'+
  (!A.statsLoaded?'<div class="panel empty">Loading statistics…</div>':'')+
  '<section class="panel panel-b" style="display:grid;gap:12px"><h2 style="margin:0">Team activity · last '+days+" days"+'</h2><div class="kpis">'+
    kpi("Active users",uids.length)+kpi("Product views",tot(views))+kpi("Searches",tot(searches))+kpi("Quotations created",sum("quotesNew"))+kpi("Quotations finalized",sum("quotesFinal"),peso(Math.round(sum("finalValue"))))+kpi("Data sheets downloaded",tot(ds))+kpi("Comparisons",sum("compares"))+kpi("Requirement matches",sum("matches"))+kpi("Price list downloads (Excel)",sum("xlsx"))+kpi("Promo PDFs downloaded",sum("promoPdf"))+kpi("Upgrade checks",sum("upgrades"))+kpi("Care Packs quoted",sum("carePacks"))+
  '</div><div><div class="small muted">Activity per day</div><div class="bars" role="img" aria-label="Activity per day">'+dayList.map(function(d){var v=perDay[d]||0;return '<div title="'+esc(fmtDate(d))+': '+v+' actions" style="height:'+Math.round(v/dmax*100)+'%"></div>';}).join("")+'</div><div class="small muted" style="display:flex;justify-content:space-between"><span>'+fmtDate(dayList[0])+'</span><span>'+fmtDate(dayList[dayList.length-1])+'</span></div></div></section>'+
  '<div class="grid-2" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:12px;margin-top:12px">'+
    '<section class="panel panel-b"><h3 style="margin-top:0">Most viewed products</h3>'+topRows(views,10,prodLabel)+'</section>'+
    '<section class="panel panel-b"><h3 style="margin-top:0">Most quoted products (finalized, units)</h3>'+topRows(quoted,10,prodLabel)+'</section>'+
    '<section class="panel panel-b"><h3 style="margin-top:0">Top searches</h3>'+topRows(searches,10,function(k){return esc(k);})+'</section>'+
    '<section class="panel panel-b"><h3 style="margin-top:0">Data sheets downloaded</h3>'+topRows(ds,10,prodLabel)+'</section>'+
  '</div>'+
  '<section class="panel" style="margin-top:12px"><div class="panel-h"><h2>By team member</h2></div><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Name</th><th class="r">Views</th><th class="r">Searches</th><th class="r">Quotes created</th><th class="r">Finalized</th><th class="r">Finalized value</th><th class="r">Data sheets</th><th>Last active</th></tr></thead><tbody>'+
    (Object.keys(byUser).length?Object.keys(byUser).sort(function(a,b){return byUser[b].views+byUser[b].qn-byUser[a].views-byUser[a].qn;}).map(function(k){var u=byUser[k];return '<tr><td>'+esc(nameOf(k))+'</td><td class="r">'+u.views+'</td><td class="r">'+u.searches+'</td><td class="r">'+u.qn+'</td><td class="r">'+u.qf+'</td><td class="r">'+peso(Math.round(u.val))+'</td><td class="r">'+u.ds+'</td><td class="small">'+(u.last?fmtDate(u.last.slice(0,10)):"—")+'</td></tr>';}).join(""):'<tr><td colspan="8" class="muted">No activity recorded in this period yet.</td></tr>')+
  '</tbody></table></div></section>'+
  '<section class="panel panel-b" style="margin-top:12px;display:grid;gap:12px"><h2 style="margin:0">Catalog and stock</h2><div class="kpis">'+
    Object.keys(CATS).map(function(c){return kpi(CATS[c],byCat[c]||0,"SKUs");}).join("")+kpi("Units on hand",units)+kpi("On-hand value",peso(Math.round(unitsVal)),"at approved selling price")+kpi("Price needs attention",flagged,"expired / unapproved / missing")+kpi("Without images",noImg)+
  '</div><div class="small muted">By status: '+Object.keys(byStatus).map(function(k){return esc((STATUS[k]||[k])[0])+' '+byStatus[k];}).join(" · ")+'</div></section>'+
  '<p class="small muted" style="margin-top:10px">Tracking started '+fmtDate("2026-10-12")+'. Counts are saved from each person’s browser every few seconds and kept for 92 days; if someone works in several tabs or devices at once, a little activity may be undercounted. Buy costs and margins are not shown here.</p>';
}
