/* ============================== data layer ============================== */
var SUBS=[];
function boot(){
  renderShell();
  if(!window.claude||!window.claude.use){A.noDb=true;render();return;}
  Promise.all([claude.use("db"),claude.use("user")]).then(function(r){
    A.db=r[0];A.user=r[1];
    if(!A.db){A.noDb=true;render();return;}
    var u=A.user;
    return Promise.all([u?u.id():null,u?u.canEdit():false,u?u.can("data.write"):null,u?u.me():null]).then(function(x){
      A.uid=x[0];A.isAdmin=!!x[1];A.canWrite=x[2];A.me=x[3];
      subscribe();
      if(A.isAdmin)claude.use("assets").then(function(a){A.assets=a;render();}).catch(function(){});
      claude.use("downloads").then(function(d){A.downloads=d;}).catch(function(){});
      claude.use("sample").then(function(s){A.sample=s;render();}).catch(function(){});
    });
  }).catch(function(){A.noDb=true;render();});
}
var rerender=debounce(function(){render();},60);
function subCol(path,cb,q){
  var ref=A.db.collection(path);if(q)ref=q(ref);
  SUBS.push(ref.onSnapshot(function(s){cb(s.docs.map(function(d){var o=Object.assign({},d.data());o.id=o.id||d.id;o._id=d.id;return o;}));rerender();},function(e){console.warn("sub",path,e&&e.code);}));
}
function subscribe(){
  subCol("products",function(list){A.products={};list.forEach(function(p){p.id=p._id;p.specs=p.specs||{};A.products[p._id]=p;});A.loaded.products=true;});
  subCol("prices",function(list){A.prices={};list.forEach(function(p){A.prices[p._id]=p;});A.loaded.prices=true;});
  subCol("imagesets",function(list){A.imagesets={};list.forEach(function(s){A.imagesets[s._id]=s;});});
  subCol("announcements",function(list){A.announcements=list.sort(function(a,b){return (b.at||"").localeCompare(a.at||"");});});
  subCol("changes",function(list){A.changes=list;},function(r){return r.orderBy("at","desc").limit(300);});
  subCol("docs",function(list){A.docs=list;});
  subCol("carepacks",function(list){var m={};list.forEach(function(d){m[d._id]=d;});A.cpImp=m;});
  subCol("seriesinfo",function(list){A.series={};list.forEach(function(x){A.series[x._id]=x;});});
  if(A.isAdmin)subCol("stats",function(list){var rows=[];list.forEach(function(x){var ds=x.days||{};Object.keys(ds).forEach(function(d){rows.push(Object.assign({uid:x.uid||x._id,day:d},ds[d]));});});A.stats=rows;A.statsLoaded=true;});
  SUBS.push(A.db.doc("settings/main").onSnapshot(function(s){A.settings=s.exists?s.data():{};rerender();},function(){}));
  if(A.uid){
    var base="data/users/"+A.uid+"/state";
    SUBS.push(A.db.doc(base).onSnapshot(function(s){if(pendingState||stateInflight)return;var d=s.exists?s.data():{};A.state={favorites:d.favorites||[],recent:d.recent||[],searches:d.searches||[],quoted:d.quoted||{},callMe:d.callMe||""};A.stateExists=s.exists;rerender();},function(){}));
    subCol(base+"/quotes",function(l){var ids={};l.forEach(function(x){ids[x._id]=1;});
      l=l.map(function(x){var dv=qDirty[x._id];if(dv&&(x.updatedAt||"")<dv){var loc=A.quotes.find(function(y){return y._id===x._id;});if(loc)return loc;}if(dv&&(x.updatedAt||"")>=dv)delete qDirty[x._id];return x;});
      A.quotes.forEach(function(y){if(!ids[y._id]&&qDirty[y._id])l.push(y);});
      A.quotes=l.sort(function(a,b){return (b.updatedAt||"").localeCompare(a.updatedAt||"");});});
    subCol(base+"/comparisons",function(l){A.comparisons=l.sort(function(a,b){return (b.at||"").localeCompare(a.at||"");});});
    subCol(base+"/profiles",function(l){A.profiles=l.sort(function(a,b){return (b.at||"").localeCompare(a.at||"");});});
    subCol(base+"/shortlists",function(l){A.shortlists=l.sort(function(a,b){return (b.at||"").localeCompare(a.at||"");});});
  }
  A.ready=true;render();
}
function userBase(){return "data/users/"+A.uid+"/state";}
function canSave(){return !!(A.db&&A.uid);}
function readOnlyNote(){return '<div class="notice warn"><b>Saving is off for your account.</b> Ask the workspace owner to share it with you as a Contributor so your favorites, comparisons and quotations can be saved.</div>';}
var stateQueue=Promise.resolve(),pendingState=null,stateInflight=0;
function saveState(){
  if(!canSave())return;
  pendingState=clone(A.state);
  flushState();
}
var flushState=debounce(function(){
  if(!pendingState)return;var body=pendingState;pendingState=null;
  stateInflight++;stateQueue=stateQueue.then(function(){return A.db.doc(userBase()).set(body);}).then(function(){stateInflight--;},function(e){stateInflight--;throw e;}).catch(function(e){if(e&&e.code==="invalid_argument"){A.uid=null;toast("Your account can view but not save. Ask for Contributor access.",true);}});
},700);
/* usage statistics — one doc per user: stats/<uid> = {uid, days:{YYYY-MM-DD:{counters}}}.
   Rules: "stats" read/write admin; "stats/{self}" read/write interact, so sales can only
   read and write their own counters, and only admins can see everyone's. */
var STAT_DAYS_KEPT=92,STAT_KEYS=25;
function statKey(s){return String(s).toLowerCase().replace(/[.\/#$\[\]~*]/g," ").replace(/\s+/g," ").trim().slice(0,80);}
function bump(map,k,n){if(!k)return;map[k]=(map[k]||0)+(n||1);var ks=Object.keys(map);if(ks.length>STAT_KEYS){ks.sort(function(a,b){return map[a]-map[b];}).slice(0,ks.length-STAT_KEYS).forEach(function(x){delete map[x];});}}
var myStats=null,statQueue=[],statLoading=false;
function loadMyStats(){if(statLoading||myStats||!A.db||!A.uid)return;statLoading=true;
  A.db.doc("stats/"+A.uid).get().then(function(s){myStats=s.exists?s.data():{uid:A.uid,days:{}};myStats.days=myStats.days||{};var q=statQueue;statQueue=[];q.forEach(function(e){applyEvent(e[0],e[1],e[2]);});if(q.length)flushStats();}).catch(function(){statLoading=false;});}
var flushStats=debounce(function(){if(!myStats||!A.db||!A.uid)return;var keep=Object.keys(myStats.days).sort().slice(-STAT_DAYS_KEPT);var days={};keep.forEach(function(k){days[k]=myStats.days[k];});myStats.days=days;
  A.db.doc("stats/"+A.uid).set({uid:A.uid,updatedAt:nowISO(),days:days}).catch(function(){});},2500);
function applyEvent(type,data,at){var d=at.slice(0,10);
  var u=myStats.days[d]=myStats.days[d]||{views:{},searches:{},datasheets:{},quoted:{},quotesNew:0,quotesFinal:0,finalValue:0,compares:0,matches:0,copies:0,events:0};
  u.events=(u.events||0)+1;u.lastAt=at;
  if(type==="view")bump(u.views,data.pid);
  else if(type==="search")bump(u.searches,statKey(data.q));
  else if(type==="datasheet")bump(u.datasheets,data.pid);
  else if(type==="quote_new")u.quotesNew++;
  else if(type==="quote_final"){u.quotesFinal++;u.finalValue=Math.round(((u.finalValue||0)+(Number(data.value)||0))*100)/100;(data.items||[]).forEach(function(it){bump(u.quoted,it.pid,it.qty);});}
  else if(type==="compare")u.compares++;
  else if(type==="pricelist_xlsx")u.xlsx=(u.xlsx||0)+1;
  else if(type==="promo_pdf")u.promoPdf=(u.promoPdf||0)+1;
  else if(type==="upgrade")u.upgrades=(u.upgrades||0)+1;
  else if(type==="carepack_add")u.carePacks=(u.carePacks||0)+1;
  else if(type==="match")u.matches++;
  else if(type==="copy")u.copies++;}
function logEvent(type,data){
  if(!A.db||!A.uid)return;var at=today()+"T"+nowISO().slice(11);
  if(!myStats){statQueue.push([type,data||{},at]);loadMyStats();return;}
  applyEvent(type,data||{},at);flushStats();
}
function trackView(id){logEvent("view",{pid:id});var r=A.state.recent.filter(function(x){return x.id!==id;});r.unshift({id:id,at:nowISO()});A.state.recent=r.slice(0,20);saveState();}
function trackSearch(q){q=String(q).trim();if(q.length<2)return;logEvent("search",{q:q.slice(0,120)});var s=A.state.searches.filter(function(x){return x.q.toLowerCase()!==q.toLowerCase();});s.unshift({q:q,at:nowISO()});A.state.searches=s.slice(0,12);saveState();}
function isFav(id){return A.state.favorites.indexOf(id)>=0;}
function toggleFav(id){if(!canSave()){toast("Saving favorites needs Contributor access",true);return;}var f=A.state.favorites.slice();var i=f.indexOf(id);if(i>=0)f.splice(i,1);else f.unshift(id);A.state.favorites=f;saveState();toast(i>=0?"Removed from favorites":"Added to favorites");render();}
function userDoc(coll,id){return A.db.doc(userBase()+"/"+coll+"/"+id);}

/* ---------- admin writes (shared data) ---------- */
function actorName(){return (A.me&&A.me.name)||"Admin";}
function audit(action,target,detail){
  if(!A.isAdmin)return Promise.resolve();
  return A.db.collection("restricted/admin/audit").add({action:action,target:target||"",detail:detail||"",by:A.uid||"",byName:actorName(),at:nowISO()}).catch(function(){});
}
function writeErr(e){var c=e&&e.code;if(c==="invalid_argument")toast("You don’t have permission to change shared data. Only Editors can.",true);else if(c==="quota_exceeded")toast("The workspace database is full. Remove old records and try again.",true);else toast("Couldn’t save. Try again in a moment.",true);throw e;}
function savePrice(id,next,note){
  var prev=A.prices[id]?clone(A.prices[id]):null;delete next._id;
  next.updatedAt=nowISO();next.updatedBy=actorName();
  return A.db.doc("prices/"+id).set(next).then(function(){
    var p=P(id)||{};var changes=[];
    Object.keys(PTYPES).forEach(function(t){var a=prev&&prev.types&&prev.types[t]?prev.types[t].amount:null;var b=next.types&&next.types[t]?next.types[t].amount:null;if(a!==b)changes.push({type:t,old:a,new:b});});
    if(!changes.length&&prev&&prev.approved===next.approved&&prev.expires===next.expires)return;
    return A.db.collection("changes").add({pid:id,sku:next.sku||p.sku,name:p.name||"",changes:changes,approved:next.approved!==false,note:note||"",at:nowISO(),byName:actorName()}).then(function(){
      return audit("price.update",next.sku||id,JSON.stringify(changes)+(note?" — "+note:""));});
  }).catch(writeErr);
}
function saveProduct(p,isNew){
  var body=clone(p);var id=body.id||idFor(body.sku);delete body._id;body.id=id;body.updatedAt=nowISO();body.updatedBy=actorName();
  return A.db.doc("products/"+id).set(body).then(function(){return audit(isNew?"product.create":"product.update",body.sku,"");}).catch(writeErr);
}
