/* ============================== requirements engine ============================== */
function blankReq(){return {client:"",workload:"",category:"any",portability:"any",qty:null,
  budget:null,budgetMust:true,cpuMin:"",cpuEquiv:false,cpuMust:true,ramMin:null,ramMust:true,storageMin:null,storageMust:true,
  gpuNeed:"any",gpuModel:"",vramMin:null,gpuMust:true,screen:"",screenMust:false,os:"",osMust:false,warrantyMin:null,onsite:false,warrantyMust:false,
  wifi:false,wifiMust:false,connectivity:"",connMust:false,avail:"any",availMust:false,mustHave:"",other:""};}
var CPU_OPTS=[["","Any processor"],["Intel Core Ultra|1","Intel Core Ultra 5 or higher"],["Intel Core Ultra|2","Intel Core Ultra 7 or higher"],["Intel Core Ultra|3","Intel Core Ultra 9"],["AMD Ryzen AI|2","AMD Ryzen AI 7 PRO or higher"],["AMD Ryzen AI|3","AMD Ryzen AI Max PRO or higher"]];
function cpuOptLabel(v){var o=CPU_OPTS.find(function(x){return x[0]===v;});return o?o[1]:v;}
function parseMoney(s,mult){var n=parseFloat(String(s).replace(/,/g,""));if(isNaN(n))return null;if(/k/i.test(mult||""))n*=1000;if(/m/i.test(mult||""))n*=1000000;return n;}
function parseRequirements(text){
  var t=" "+String(text||"").replace(/’/g,"'").replace(/[“”]/g,'"')+" ",r={},n=0,m;
  if((m=/(?:budget|under|below|max(?:imum)?|up to|within|not (?:more|over) than|less than|around|approx\.?|ceiling)[^\d₱]{0,20}(?:php|₱|p)?\s?([\d][\d,]*(?:\.\d+)?)\s*(k|m)?\b/i.exec(t))||(m=/(?:php|₱)\s?([\d][\d,]*(?:\.\d+)?)\s*(k|m)?\b/i.exec(t))){var b=parseMoney(m[1],m[2]);if(b&&b>=1000){r.budget=b;n++;}}
  if((m=/\b(1[0-9](?:\.\d)?)\s*(?:-|\s)?(?:inch|in\b|"|''|-in)/i.exec(t))){r.screen=String(Math.round(parseFloat(m[1])));n++;}
  if((m=/(\d{1,3})\s*gb\s*(?:of\s*)?(?:ram|memory|ddr\d*|lpddr\d*x?)/i.exec(t))||(m=/(?:ram|memory)\s*(?:of|:)?\s*(\d{1,3})\s*gb/i.exec(t))){r.ramMin=+m[1];n++;}
  if((m=/(\d+(?:\.\d+)?)\s*(tb|gb)\s*(?:of\s*)?(?:ssd|nvme|storage|hdd|drive|disk)/i.exec(t))||(m=/(?:ssd|storage)\s*(?:of|:)?\s*(\d+(?:\.\d+)?)\s*(tb|gb)/i.exec(t))){r.storageMin=parseFloat(m[1])*(m[2].toLowerCase()==="tb"?1000:1);n++;}
  if((m=/(\d{1,2})\s*gb\s*(?:of\s*)?(?:dedicated|vram|video|graphics|gpu|gddr\d?)/i.exec(t))||(m=/(?:vram|graphics memory|gpu memory)\s*(?:of|:)?\s*(?:at least\s*)?(\d{1,2})\s*gb/i.exec(t))){r.vramMin=+m[1];r.gpuNeed="dedicated";n++;}
  if(/dedicated (?:graphics|gpu)|discrete (?:graphics|gpu)|nvidia|rtx/i.test(t)){r.gpuNeed="dedicated";n++;}
  if((m=/\b(rtx\s*(?:pro\s*)?a?\d{3,4}(?:\s*(?:ada|ti))?|geforce\s*rtx\s*\d{4}(?:\s*ti)?|radeon\s*\d{3,4}[a-z]?)\b/i.exec(t))){r.gpuModel=m[1].replace(/\s+/g," ").trim();n++;}
  if((m=/(?:core\s*)?ultra\s*(5|7|9)/i.exec(t))){r.cpuMin="Intel Core Ultra|"+({5:1,7:2,9:3})[m[1]];n++;}
  else if(/ryzen\s*ai\s*max/i.test(t)){r.cpuMin="AMD Ryzen AI|3";n++;}
  else if((m=/ryzen\s*ai\s*(7|9)/i.exec(t))){r.cpuMin="AMD Ryzen AI|"+({7:2,9:3})[m[1]];n++;}
  if(/thin client|vdi|citrix|virtual desktop|zero client/i.test(t)){r.category="tc";n++;}
  else if(/\b(business (?:notebooks?|laptops?)|probooks?|elitebooks?|office (?:notebooks?|laptops?)|non-?workstation laptops?)\b/i.test(t)){r.category="nb";r.portability="laptop";n++;}
  else if(/\b(laptops?|notebooks?|mobile workstations?|portable|zbooks?|travel|on the go|field)\b/i.test(t)){r.portability="laptop";n++;}
  else if(/\b(towers?|desktop workstations?|desktops?|z1|z2 tower)\b/i.test(t)){r.portability="desktop";n++;}
  else if(/\bmini\b|small form|compact desktop/i.test(t)){r.portability="compact";n++;}
  if(r.screen&&(!r.portability||r.portability==="any")&&r.category!=="tc"){r.portability="laptop";}
  var osAlt=[/thinpro/i,/igel/i,/windows/i,/smart ?zero/i].filter(function(x){return x.test(t);}).length;
  if(osAlt>=2&&/\b(or|either|any of|is fine|are fine|whichever)\b/i.test(t)){/* several OS options acceptable: no OS requirement */}
  else if((m=/windows\s*11\s*pro/i.exec(t))){r.os="Windows 11 Pro";n++;}else if(/thinpro/i.test(t)){r.os="ThinPro";n++;}else if(/igel/i.test(t)){r.os="IGEL";n++;}else if(/windows\s*11/i.test(t)){r.os="Windows 11";n++;}
  if((m=/(\d)\s*-?\s*(?:years?|yrs?)\s*(?:onsite|on-site|warranty)/i.exec(t))){r.warrantyMin=+m[1];n++;}
  if(/on-?site/i.test(t)){r.onsite=true;}
  if(/wi-?fi|wireless/i.test(t)){r.wifi=true;n++;}
  if(/in stock|immediate(?:ly)?|asap|on hand|ready stock|urgent/i.test(t)){r.avail="stock";n++;}
  if((m=/(\d+)\s*(?:x\s*)?(?:units?|pcs?|pieces|sets|seats|nos?\.?|laptops?|notebooks?|workstations?|desktops?|towers?|thin clients?|computers?|machines?|devices?)\b/i.exec(t))){r.qty=+m[1];}
  var wl=[];[["CAD|SolidWorks|AutoCAD|Revit|BIM|engineering","CAD / BIM / engineering"],["render|3D|Blender|Maya|3ds","3D rendering"],["video|Premiere|DaVinci|editing","Video editing"],["\\bAI\\b|machine learning|data science|LLM|deep learning","AI / data science"],["GIS|ArcGIS|mapping","GIS"],["office|admin|clerical|call cent","Office productivity"]].forEach(function(w){if(new RegExp(w[0],"i").test(t))wl.push(w[1]);});
  if(wl.length)r.workload=wl.join(", ");
  return {req:r,_signals:n};
}
function evalProduct(p,q){
  var C=[];function add(key,label,must,status,detail,excess){C.push({key:key,label:label,must:must,status:status,detail:detail,excess:excess||0});}
  var s=p.specs;
  if(q.category&&q.category!=="any")add("cat","Category: "+CATS[q.category],true,p.cat===q.category?"pass":"fail",CAT_SHORT[p.cat]);
  if(q.portability&&q.portability!=="any"){var ok=q.portability==="laptop"?(p.cat==="zbook"||p.cat==="nb"):q.portability==="desktop"?p.cat==="tower":(p.cat==="tc"||/mini/i.test(p.model));add("port","Form factor: "+({laptop:"portable laptop",desktop:"desktop workstation",compact:"compact / mini"})[q.portability],true,ok?"pass":"fail",p.cat==="zbook"||p.cat==="nb"?"Laptop":p.cat==="tc"?"Thin client":/mini/i.test(p.model)?"Mini desktop":"Tower");}
  var sp=sellPrice(p.id);
  if(q.budget){if(!sp)add("budget","Budget ≤ "+peso(q.budget),q.budgetMust,"unknown","No approved price on record");else add("budget","Budget ≤ "+peso(q.budget),q.budgetMust,sp.amount<=q.budget?"pass":"fail",peso(sp.amount)+(sp.amount<=q.budget?" ("+peso(q.budget-sp.amount)+" under)":" ("+peso(sp.amount-q.budget)+" over)"));}
  if(q.cpuMin){var parts=q.cpuMin.split("|"),lad=parts[0],tier=+parts[1],ci=cpuInfo(p);var lbl="Processor: "+cpuOptLabel(q.cpuMin);
    if(ci.tier==null||!ci.ladder)add("cpu",lbl,q.cpuMust,"unknown",s.processor||"Processor not listed");
    else if(ci.ladder===lad)add("cpu",lbl,q.cpuMust,ci.tier>=tier?"pass":"fail",s.processor,ci.tier>tier?ci.tier-tier:0);
    else if(q.cpuEquiv&&ci.tier>=tier&&(ci.ladder==="Intel Core Ultra"||ci.ladder==="AMD Ryzen AI"))add("cpu",lbl,q.cpuMust,"pass",s.processor+" (tier equivalence assumed — verify for workload)");
    else add("cpu",lbl,q.cpuMust,"fail",s.processor+" — different processor family, not treated as equivalent");}
  if(q.ramMin){var rg=ramGB(p);add("ram","Memory ≥ "+q.ramMin+"GB",q.ramMust,rg==null?"unknown":rg>=q.ramMin?"pass":"fail",s.memory||"Not listed",rg>q.ramMin?(rg-q.ramMin)/q.ramMin:0);}
  if(q.storageMin){var sg=storageGB(p);add("storage","Storage ≥ "+(q.storageMin>=1000?q.storageMin/1000+"TB":q.storageMin+"GB"),q.storageMust,sg==null?"unknown":sg>=q.storageMin*0.98?"pass":"fail",s.storage||"Not listed",sg>q.storageMin?(sg-q.storageMin)/q.storageMin:0);}
  if(q.gpuNeed==="dedicated")add("gpu","Dedicated graphics",q.gpuMust,!s.graphics?"unknown":dedicated(p)?"pass":"fail",s.graphics||"Not listed");
  if(q.gpuModel){var gm=q.gpuModel.toLowerCase().replace(/\s+/g," ").trim();var have=(s.graphics||"").toLowerCase().replace(/\s+/g," ");add("gpum","Graphics model: "+q.gpuModel,q.gpuMust,!s.graphics?"unknown":have.indexOf(gm)>=0?"pass":"fail",s.graphics||"Not listed");}
  if(q.vramMin){var vg=vramGB(p);add("vram","Graphics memory ≥ "+q.vramMin+"GB dedicated",q.gpuMust,vg==null?"unknown":vg>=q.vramMin?"pass":"fail",s.vram||(dedicated(p)?"VRAM not listed":"Integrated / shared"),vg>q.vramMin?(vg-q.vramMin)/q.vramMin:0);}
  if(q.screen){var si=screenIn(p);add("screen","Screen "+q.screen+'"',q.screenMust,p.cat!=="zbook"&&p.cat!=="nb"?"fail":si==null?"unknown":Math.round(si)===+q.screen?"pass":"fail",p.cat!=="zbook"&&p.cat!=="nb"?"No built-in display":(s.screen||"Not listed"));}
  if(q.os){add("os","OS: "+q.os,q.osMust,!s.os?"unknown":s.os.toLowerCase().indexOf(q.os.toLowerCase())>=0?"pass":"fail",s.os||"Not listed");}
  if(q.warrantyMin){var wy=warrantyYears(p);add("war","Warranty ≥ "+q.warrantyMin+" years",q.warrantyMust,wy==null?"unknown":wy>=q.warrantyMin?"pass":"fail",s.warranty||"Not listed");}
  if(q.onsite){var os2=onsite(p);add("onsite","Onsite warranty service",q.warrantyMust,os2==null?"unknown":os2?"pass":"fail",s.warranty||"Not listed");}
  if(q.wifi){var w=wifiOf(p);add("wifi","Wi-Fi",q.wifiMust,w==null?"unknown":w?"pass":"fail",s.wifi||"Wireless not listed in source data");}
  if(q.connectivity){q.connectivity.split(/[,;]+/).map(function(x){return x.trim();}).filter(Boolean).forEach(function(k){var hay=[s.network,s.wifi,s.bluetooth,s.io,s.ports].join(" ").toLowerCase();add("conn","Connectivity: "+k,q.connMust,!hay.trim()?"unknown":hay.indexOf(k.toLowerCase())>=0?"pass":"unknown",hay.indexOf(k.toLowerCase())>=0?"Listed":"Not listed in source data");});}
  if(q.avail==="stock")add("avail","Available from stock",q.availMust,p.status==="in_stock"||p.status==="limited"?"pass":"fail",(STATUS[p.status]||STATUS.unconfirmed)[0]+(p.stockQty!=null?" ("+p.stockQty+" pcs)":""));
  if(q.mustHave){q.mustHave.split(/[,;]+/).map(function(x){return x.trim();}).filter(Boolean).forEach(function(k){var hay=(p.name+" "+SPEC_KEYS.map(function(x){return s[x]||"";}).join(" ")+" "+(p.features||[]).join(" ")).toLowerCase();add("must","Must have: "+k,true,hay.indexOf(k.toLowerCase())>=0?"pass":"unknown",hay.indexOf(k.toLowerCase())>=0?"Found in specifications":"Not listed — confirm with product manager");});}
  var mustFail=C.filter(function(c){return c.must&&c.status!=="pass";});
  var prefMet=C.filter(function(c){return !c.must&&c.status==="pass";}).length;var prefMiss=C.filter(function(c){return !c.must&&c.status!=="pass";});
  var excess=C.reduce(function(a,c){return a+(c.status==="pass"?Math.min(c.excess,3):0);},0);
  return {p:p,checks:C,mustFail:mustFail,compliant:!mustFail.length,prefMet:prefMet,prefMiss:prefMiss,excess:excess,price:sp?sp.amount:null};
}
function computeMatch(q){
  var hasAny=["budget","cpuMin","ramMin","storageMin","vramMin","gpuModel","screen","os","warrantyMin","mustHave","connectivity"].some(function(k){return q[k];})||q.gpuNeed!=="any"||q.category!=="any"||q.portability!=="any"||q.wifi||q.onsite||q.avail!=="any";
  if(!hasAny)return {req:clone(q),empty:true};
  var ev=allProducts().map(function(p){return evalProduct(p,q);});
  var ok=ev.filter(function(e){return e.compliant&&e.price!=null;});
  var byFit=ok.slice().sort(function(a,b){return (b.prefMet-a.prefMet)||(a.excess-b.excess)||(a.price-b.price);});
  var picks=[],used={};
  function pick(cat,e,why){if(!e||used[e.p.id])return;used[e.p.id]=1;picks.push({cat:cat,e:e,why:why});}
  var best=byFit[0];pick("Best Match",best,"Meets every mandatory requirement and the most preferences with the least unnecessary extra specification.");
  if(best){
    var maxPref=Math.max.apply(null,ok.map(function(e){return e.prefMet;}));
    var bv=ok.filter(function(e){return e.prefMet>=Math.min(maxPref,best.prefMet)&&!used[e.p.id]&&e.price<best.price;}).sort(function(a,b){return a.price-b.price;})[0];
    pick("Best Value",bv,"Meets the essential requirements at a lower price than the Best Match"+(bv?" (saves "+peso(best.price-bv.price)+")":"")+".");
    var hs=ok.filter(function(e){if(used[e.p.id]||e.price<=best.price)return false;var a=e.p,b=best.p;return (ramGB(a)||0)>(ramGB(b)||0)||(vramGB(a)||0)>(vramGB(b)||0)||(storageGB(a)||0)>(storageGB(b)||0)||(cpuInfo(a).ladder===cpuInfo(b).ladder&&(cpuInfo(a).tier||0)>(cpuInfo(b).tier||0));}).sort(function(a,b){return a.price-b.price;})[0];
    if(hs){var gains=[];if((ramGB(hs.p)||0)>(ramGB(best.p)||0))gains.push(ramGB(hs.p)+"GB memory");if((vramGB(hs.p)||0)>(vramGB(best.p)||0))gains.push(vramGB(hs.p)+"GB graphics memory");if((storageGB(hs.p)||0)>(storageGB(best.p)||0))gains.push(hs.p.specs.storage);if(cpuInfo(hs.p).ladder===cpuInfo(best.p).ladder&&(cpuInfo(hs.p).tier||0)>(cpuInfo(best.p).tier||0))gains.push(cpuInfo(hs.p).label);
      pick("Higher-Specification Alternative",hs,"Adds "+gains.join(", ")+" for "+peso(hs.price-best.price)+" more.");}
    var ba=ok.filter(function(e){return !used[e.p.id];}).sort(function(a,b){return a.price-b.price;})[0];
    var cheapestPicked=Math.min.apply(null,picks.map(function(x){return x.e.price;}));
    if(ba&&ba.price<cheapestPicked)pick("Budget Alternative",ba,"Lowest-priced model that still meets every mandatory requirement"+(ba.prefMiss.length?"; gives up: "+ba.prefMiss.map(function(c){return c.label;}).join(", "):"")+".");
  }
  var closest=ok.length?[]:ev.filter(function(e){return e.price!=null||true;}).sort(function(a,b){return (a.mustFail.length-b.mustFail.length)||(b.prefMet-a.prefMet)||((a.price||1e12)-(b.price||1e12));}).slice(0,4);
  return {req:clone(q),picks:picks,closest:closest,all:ev.sort(function(a,b){return (a.mustFail.length-b.mustFail.length)||(b.prefMet-a.prefMet)||((a.price||1e12)-(b.price||1e12));}),compliantCount:ok.length,at:nowISO()};
}
function runMatch(){A.lastMatch=computeMatch(A.matchForm||blankReq());render();}
function bestForReq(ps,q){var ev=ps.map(function(p){return evalProduct(p,q);}).filter(function(e){return e.compliant&&e.price!=null;}).sort(function(a,b){return (b.prefMet-a.prefMet)||(a.excess-b.excess)||(a.price-b.price);});if(!ev.length)return null;var e=ev[0];return {p:e.p,why:"Meets every mandatory requirement"+(e.prefMet?" and "+e.prefMet+" preference(s)":"")+" at "+peso(e.price)+"."};}
function checksHtml(list,icon,cls){return list.map(function(c){return '<li><span class="'+cls+'">'+icon+'</span><span><b style="font-weight:500">'+esc(c.label)+'</b> — '+esc(c.detail)+'</span></li>';}).join("");}
function recCard(cat,e,why,bestPrice){
  var p=e.p,pass=e.checks.filter(function(c){return c.status==="pass";}),exceed=pass.filter(function(c){return c.excess>0;}),fail=e.checks.filter(function(c){return c.status==="fail";}),unk=e.checks.filter(function(c){return c.status==="unknown";});
  var comp=[];priceFlags(p.id).forEach(function(f){if(f.k!=="changed")comp.push("Price: "+f.t);});if(p.status==="unconfirmed")comp.push("Availability unconfirmed — check before committing a delivery date");if(!dedicated(p)&&p.cat!=="tc"&&p.cat!=="nb")comp.push("Integrated graphics only");unk.forEach(function(c){comp.push(c.label+": not verifiable from source data");});
  var r=priceRec(p.id)||{};
  return '<article class="rec"><div class="rec-h">'+(cat?'<span class="cat">'+esc(cat)+'</span>':'')+'<span class="sku">'+esc(p.sku)+'</span><b>'+esc(p.name)+'</b>'+(e.compliant?'<span class="tag t-ok">Meets all mandatory</span>':'<span class="tag t-bad">Fails '+e.mustFail.length+' mandatory</span>')+'<span style="margin-left:auto" class="price">'+(e.price!=null?peso(e.price):"No price")+'</span></div>'+
    '<div class="rec-b"><div style="display:grid;gap:8px">'+(why?'<p><b>Why:</b> '+esc(why)+'</p>':'')+
      (bestPrice!=null&&e.price!=null&&e.price!==bestPrice?'<p class="small">'+(e.price>bestPrice?"+":"−")+peso(Math.abs(e.price-bestPrice))+' vs Best Match</p>':'')+
      '<div><div class="label">Requirements satisfied</div><ul class="checks">'+(checksHtml(pass,"✓","i-pass")||'<li class="muted">None specified</li>')+'</ul></div>'+
      (exceed.length?'<div><div class="label">Exceeds</div><ul class="checks">'+checksHtml(exceed,"↑","i-pass")+'</ul></div>':'')+'</div>'+
      '<div style="display:grid;gap:8px">'+(fail.length?'<div><div class="label">Not met</div><ul class="checks">'+fail.map(function(c){return '<li><span class="i-fail">✗</span><span><b style="font-weight:500">'+esc(c.label)+'</b>'+(c.must?' <span class="tag t-bad plain">mandatory</span>':' <span class="tag t-mute plain">preference</span>')+' — '+esc(c.detail)+'</span></li>';}).join("")+'</ul></div>':'')+
      (comp.length?'<div><div class="label">Compromises & cautions</div><ul class="checks">'+comp.map(function(c){return '<li><span class="i-unk">!</span><span>'+esc(c)+'</span></li>';}).join("")+'</ul></div>':'')+
      (A.isAdmin?'<div class="small muted"><b>Verification:</b> specs from '+esc(p.specSource||"product record")+'; price '+esc(PTYPES[(sellPrice(p.id)||{}).type]||"—")+' from '+esc(r.source||"—")+', verified '+fmtDate(r.verifiedAt)+'.</div>':'')+
      '<div class="btn-row"><button class="btn btn-sm" data-open="'+p.id+'">View</button><button class="btn btn-sm" data-cmp="'+p.id+'">'+(A.compare.indexOf(p.id)>=0?"In compare":"Compare")+'</button><button class="btn btn-sm" data-copymenu="'+p.id+'">Copy</button><button class="btn btn-sm btn-primary" data-addq="'+p.id+'"'+(A.matchForm&&A.matchForm.qty?' data-qty="'+A.matchForm.qty+'"':'')+'>Add to quotation</button></div></div></div></article>';
}
function rqField(id,label,inner,mustKey,hint){var q=A.matchForm;return '<div class="field"><label for="'+id+'">'+label+(mustKey?'<span class="must"><input type="checkbox" data-rq-must="'+mustKey+'"'+(q[mustKey]?" checked":"")+'> Mandatory</span>':'')+'</label>'+inner+(hint?'<span class="hint">'+hint+'</span>':'')+'</div>';}
/* ---------- paste-a-brief requirements (no form) ---------- */
var PREF_RE=/\b(prefer(?:ably|red|ence)?|ideally|nice to have|if possible|optional(?:ly)?|would be (?:nice|good|great)|bonus|good to have|if budget allows|not required|not a must)\b/i;
var MUST_OF={budget:"budgetMust",cpuMin:"cpuMust",ramMin:"ramMust",storageMin:"storageMust",gpuNeed:"gpuMust",gpuModel:"gpuMust",vramMin:"gpuMust",screen:"screenMust",os:"osMust",warrantyMin:"warrantyMust",onsite:"warrantyMust",wifi:"wifiMust",avail:"availMust"};
function parseMessage(text){
  text=String(text||"");var base=parseRequirements(text);var q=Object.assign(blankReq(),base.req),notes=[];
  Object.keys(MUST_OF).forEach(function(k){if(base.req[k]!=null&&base.req[k]!==""&&base.req[k]!==false)q[MUST_OF[k]]=true;});
  text.split(/\n+|(?<=[.!?;])\s+/).forEach(function(sn){if(!PREF_RE.test(sn))return;var pr=parseRequirements(sn).req;Object.keys(pr).forEach(function(k){if(MUST_OF[k])q[MUST_OF[k]]=false;});});
  if(q.budget&&q.qty>1){var maxP=Math.max.apply(null,allProducts().map(function(p){var sp=sellPrice(p.id);return sp?sp.amount:0;}).concat([0]));
    if(/\b(total|overall|in all|for all|whole|entire)\b/i.test(text)&&!/\b(each|per unit|per piece|per pc|\/unit|a unit|per seat)\b/i.test(text)||q.budget>maxP*1.5){var tot=q.budget;q.budget=Math.round(tot/q.qty);notes.push("Budget read as "+peso(tot)+" in total for "+q.qty+" units, so "+peso(q.budget)+" per unit.");}}
  return {q:q,signals:base._signals,notes:notes};
}
function reqList(q){var any=allProducts()[0];if(!any)return [];var seen={};return evalProduct(any,q).checks.filter(function(c){if(seen[c.label])return false;seen[c.label]=1;return true;}).map(function(c){return {label:c.label,must:c.must};});}
function matchFromText(){var t=A.matchText||"";if(!t.trim()){A.lastMatch=null;A.matchParsed=null;return;}
  var pm=A.matchAI&&A.matchAI.text===t?{q:A.matchAI.q,signals:99,notes:A.matchAI.notes,ai:true}:parseMessage(t);
  A.matchParsed=pm;A.matchForm=pm.q;A.lastMatch=pm.signals?computeMatch(pm.q):{empty:true};}
var MATCH_EXAMPLES=["Hi, we need 10 units of 16-inch mobile workstations for our engineering team running SolidWorks and AutoCAD. At least Core Ultra 7, 32GB RAM, 1TB SSD and a dedicated NVIDIA GPU with 8GB. Budget is ₱300,000 per unit. Preferably in stock since we need them next week.","Looking for 25 thin clients for our call center on Citrix. Wi-Fi needed, 8GB memory, IGEL or ThinPro is fine. Budget around ₱70,000 each."];
function fitSort(a,b){return (b.prefMet-a.prefMet)||(a.excess-b.excess)||((a.price||1e12)-(b.price||1e12));}
function qualRow(e,tag){var p=e.p,s=p.specs,miss=e.prefMiss.map(function(c){return c.label;});var unk=e.checks.filter(function(c){return c.must&&c.status==="unknown";});
  return '<article class="qrow"><span class="thumb">'+thumbHtml(p)+'</span><div class="qrow-main"><div class="btn-row"><span class="sku">'+esc(p.sku)+'</span>'+statusTag(p)+(tag||"")+'</div><button class="qrow-name" data-open="'+p.id+'">'+esc(p.name)+'</button><div class="small muted">'+esc([s.processor,s.memory,s.storage,gpuShort(p)+(s.vram&&!/shared/i.test(s.vram)?" "+s.vram:""),s.screen&&p.cat==="zbook"?s.screen+" "+(s.display||""):"",s.os].filter(Boolean).join(" · "))+'</div>'+
    (unk.length?'<div class="small q-unk">Confirm: '+esc(unk.map(function(c){return c.label;}).join(", "))+' (not listed in our data)</div>':'')+(miss.length?'<div class="small muted">Misses preference: '+esc(miss.join(", "))+'</div>':'')+'</div>'+
    '<div class="qrow-side"><span class="price">'+(e.price!=null?peso(e.price):"No price")+'</span><div class="btn-row"><button class="btn btn-sm" data-cmp="'+p.id+'">'+(A.compare.indexOf(p.id)>=0?"In compare":"Compare")+'</button><button class="btn btn-sm btn-primary" data-addq="'+p.id+'"'+(A.matchForm&&A.matchForm.qty?' data-qty="'+A.matchForm.qty+'"':'')+'>Add to quote</button></div></div></article>';}
function matchResultsHtml(){var M=A.lastMatch,pm=A.matchParsed;
  if(!A.matchText||!A.matchText.trim())return '<section class="panel panel-b match-empty"><h2>Paste a client message to see every qualifying item</h2><p class="muted">The workspace reads the budget, quantity, processor, memory, storage, graphics, screen size, OS, Wi-Fi, warranty and stock needs from the text and checks all '+allProducts().length+' SKUs against them. Words like “preferably” or “ideally” make that item a preference instead of a requirement.</p><div class="btn-row">'+MATCH_EXAMPLES.map(function(x,i){return '<button class="btn btn-sm" data-act="rq-example" data-i="'+i+'">Try example '+(i+1)+'</button>';}).join("")+'</div></section>';
  if(!M||M.empty)return '<div class="notice warn"><b>No requirements recognized yet.</b> Mention things like a budget (₱250,000 per unit), processor (Core Ultra 7), memory (32GB), storage (1TB SSD), screen size (16-inch), dedicated graphics, OS or “thin client”.'+(A.sample?' Or use “Read with Claude” for a free-form message.':'')+'</div>';
  var rl=reqList(M.req);var q=M.req;
  var understood='<section class="panel panel-b" style="display:grid;gap:10px"><div class="btn-row" style="justify-content:space-between"><h2>What the client needs</h2><span class="small muted">'+(pm&&pm.ai?"Read by Claude":"Read automatically")+' · edit the message to change</span></div><div class="req-chips">'+rl.map(function(r){return '<span class="req-chip'+(r.must?' must':'')+'">'+esc(r.label)+'<small>'+(r.must?"Required":"Preferred")+'</small></span>';}).join("")+(q.qty?'<span class="req-chip info">Quantity: '+q.qty+' units</span>':'')+(q.workload?'<span class="req-chip info">Use: '+esc(q.workload)+'</span>':'')+'</div>'+((pm&&pm.notes||[]).length?'<p class="small muted">'+esc(pm.notes.join(" "))+'</p>':'')+'</section>';
  var ok=M.all.filter(function(e){return e.compliant&&e.price!=null;}).sort(fitSort);
  var maybe=M.all.filter(function(e){return !e.compliant&&e.mustFail.every(function(c){return c.status==="unknown";});}).sort(fitSort);
  var pickTag={};(M.picks||[]).forEach(function(x){pickTag[x.e.p.id]=x.cat;});
  var head='<div class="page-h"><div><h2>'+(ok.length?ok.length+' item'+(ok.length>1?"s":"")+' qualify':"No item meets every requirement")+'</h2><p>Checked against all '+allProducts().length+' SKUs using approved selling prices'+(S("pricesIncludeVat")?" (VAT inclusive)":"")+'.</p></div>'+(ok.length?'<div class="btn-row"><button class="btn" data-act="rq-cmp">Compare top picks</button><button class="btn" data-act="rq-copy">Copy recommendation</button><button class="btn btn-primary" data-act="rq-quote">Quote the best match</button></div>':'')+'</div>';
  var picks=(M.picks||[]).length?'<div class="pick-grid">'+M.picks.map(function(x){var p=x.e.p;return '<article class="pick"><span class="pick-cat">'+esc(x.cat)+'</span><span class="thumb">'+thumbHtml(p)+'</span><div style="display:grid;gap:3px;min-width:0"><span class="sku" style="justify-self:start">'+esc(p.sku)+'</span><button class="qrow-name" data-open="'+p.id+'">'+esc(p.name)+'</button><span class="price">'+peso(x.e.price)+'</span><p class="small muted">'+esc(x.why)+'</p></div></article>';}).join("")+'</div>':'';
  var list=ok.length?'<section class="panel"><div class="panel-h"><h2>All qualifying items</h2><span class="small muted">Best fit first, then lowest price</span></div><div class="qlist">'+ok.map(function(e){return qualRow(e,pickTag[e.p.id]?'<span class="tag t-info plain">'+esc(pickTag[e.p.id])+'</span>':'');}).join("")+'</div></section>':'';
  var mb=maybe.length?'<section class="panel"><div class="panel-h"><h2>May qualify — confirm first</h2><span class="small muted">'+maybe.length+' item'+(maybe.length>1?"s":"")+' with a requirement our data doesn’t list</span></div><div class="qlist">'+maybe.slice(0,30).map(function(e){return qualRow(e,'<span class="tag t-warn plain">Confirm</span>');}).join("")+'</div></section>':'';
  var none=!ok.length&&!maybe.length?'<div class="notice bad"><b>Nothing meets every requirement.</b> The closest options are below with what they miss. Ask the client which requirement can flex, or confirm unlisted specs with the product manager.</div>'+M.closest.map(function(e,i){return recCard(i===0?"Closest option":"",e,"Misses: "+e.mustFail.map(function(c){return c.label;}).join(", "),null);}).join(""):'';
  return understood+head+picks+list+mb+none;}
function viewMatch(){
  if(A.matchText&&!A.lastMatch)matchFromText();
  return '<div class="page-h"><div><h1>Client requirements</h1><p>Paste what the client sent. Every product that meets it appears below, best fit first.</p></div></div>'+
  '<section class="panel brief"><label class="label" for="rq-text">Client’s message</label><textarea id="rq-text" placeholder="Paste the client’s email, chat or RFQ paragraph here…">'+esc(A.matchText||"")+'</textarea><div class="btn-row"><span class="small muted" id="rq-status">'+(A.matchText?"Results update as you type.":"Results appear as soon as you paste.")+'</span><span style="flex:1"></span>'+(A.sample?'<button class="btn btn-sm" data-act="rq-ai">'+ICON.bot+'Read with Claude</button>':'')+'<button class="btn btn-sm btn-quiet" data-act="rq-clear">Clear</button></div></section>'+
  '<div id="rq-results" style="display:grid;gap:16px">'+matchResultsHtml()+'</div>';
}
var updateMatchSoon=debounce(function(){matchFromText();var r=document.getElementById("rq-results");if(r)r.innerHTML=matchResultsHtml();if(A.matchText&&A.matchText.trim().length>20)logEvent("match");},450);
function readMatchForm(){return A.matchForm||blankReq();}
function readWithClaude(){var text=A.matchText||"";if(!text.trim()){toast("Paste the client’s message first",true);return;}if(!A.sample){toast("Claude isn’t available in this view",true);return;}
  var st=$("#rq-status");if(st)st.textContent="Claude is reading the message…";
  var schema='{"qty":number|null,"category":"any"|"zbook"|"nb"|"tower"|"tc","portability":"any"|"laptop"|"desktop"|"compact","budget":number|null,"budgetIsTotal":boolean,"cpuMin":""|"Intel Core Ultra|1"|"Intel Core Ultra|2"|"Intel Core Ultra|3"|"AMD Ryzen AI|2"|"AMD Ryzen AI|3","ramMin":number|null,"storageMin":number|null,"gpuNeed":"any"|"dedicated","gpuModel":string|null,"vramMin":number|null,"screen":""|"14"|"16","os":string|null,"warrantyMin":number|null,"onsite":boolean,"wifi":boolean,"avail":"any"|"stock","workload":string|null,"preferences":[names of the fields above that the client only prefers, e.g. "avail"]}';
  A.sample.json("Read this client message for HP workstations / business notebooks (ProBook, EliteBook; category \"nb\") / thin clients and return what it requires. Only include values the message states; otherwise null, false, \"any\" or \"\". storageMin in GB (1TB=1000). Budget in Philippine pesos. cpuMin tiers: Ultra 5=1, Ultra 7=2, Ultra 9=3; Ryzen AI 7 PRO=2, Ryzen AI Max=3.\nReply with only JSON of this shape: "+schema+"\n\nCLIENT MESSAGE:\n"+text.slice(0,6000),{modelTier:"quick"}).then(function(r){
    if(!r||typeof r!=="object")throw {code:"invalid_json"};var q=blankReq(),notes=["Read by Claude — check the requirements below."];
    ["qty","category","portability","budget","cpuMin","ramMin","storageMin","gpuNeed","gpuModel","vramMin","screen","os","warrantyMin","onsite","wifi","avail","workload"].forEach(function(k){if(r[k]!=null&&r[k]!==""&&r[k]!=="any"&&r[k]!==false)q[k]=r[k];});
    Object.keys(MUST_OF).forEach(function(k){if(q[k]!=null&&q[k]!==""&&q[k]!==false&&q[k]!=="any")q[MUST_OF[k]]=true;});(r.preferences||[]).forEach(function(k){if(MUST_OF[k])q[MUST_OF[k]]=false;});
    if(r.budgetIsTotal&&q.budget&&q.qty>1){notes.push("Budget read as "+peso(q.budget)+" in total, so "+peso(Math.round(q.budget/q.qty))+" per unit.");q.budget=Math.round(q.budget/q.qty);}
    A.matchAI={text:text,q:q,notes:notes};A.lastMatch=null;render();logEvent("match");
  }).catch(function(e){var st2=$("#rq-status");if(st2)st2.textContent=e&&e.code==="not_granted"?"Claude wasn’t allowed to read the message. The automatic reading is shown.":"Claude couldn’t read the message. The automatic reading is shown.";});}
function matchSummaryText(){var M=A.lastMatch;if(!M||!M.picks)return "";var q=M.req;var L=["Recommendation for "+(q.client||"the client")+" ("+fmtDate(today())+")",""];
  L.push("Requirements: "+describeReq(q));L.push("");
  M.picks.forEach(function(x){var e=x.e;L.push(x.cat.toUpperCase()+": "+e.p.name+" (SKU "+e.p.sku+") — "+(e.price!=null?peso(e.price):"price on request"));L.push("  "+[e.p.specs.processor,e.p.specs.memory,e.p.specs.storage,gpuShort(e.p),e.p.specs.screen].filter(Boolean).join(" | "));L.push("  Why: "+x.why);var nm=e.checks.filter(function(c){return c.status!=="pass";});if(nm.length)L.push("  Not met / unverified: "+nm.map(function(c){return c.label;}).join(", "));L.push("");});
  L.push("Prices "+(S("pricesIncludeVat")?"VAT inclusive":"VAT exclusive")+", subject to change and availability.");return L.join("\n");}
function describeReq(q){var a=[];if(q.category!=="any")a.push(CATS[q.category]);if(q.portability!=="any")a.push(q.portability);if(q.budget)a.push("budget "+peso(q.budget));if(q.cpuMin)a.push(cpuOptLabel(q.cpuMin));if(q.ramMin)a.push(q.ramMin+"GB+ RAM");if(q.storageMin)a.push((q.storageMin>=1000?q.storageMin/1000+"TB":q.storageMin+"GB")+"+ storage");if(q.gpuNeed==="dedicated")a.push("dedicated GPU");if(q.gpuModel)a.push(q.gpuModel);if(q.vramMin)a.push(q.vramMin+"GB+ VRAM");if(q.screen)a.push(q.screen+'" screen');if(q.os)a.push(q.os);if(q.warrantyMin)a.push(q.warrantyMin+"yr+ warranty"+(q.onsite?" onsite":""));if(q.wifi)a.push("Wi-Fi");if(q.avail==="stock")a.push("in stock");if(q.mustHave)a.push("must have: "+q.mustHave);return a.join(", ")||"none";}
function extractWithClaude(){
  var text=($("#rq-paste")||{}).value||"";if(!text.trim()){toast("Paste the client’s message first",true);return;}
  var note=$("#rq-extract-note");if(note)note.textContent="Reading the message…";
  var schema='{"client":string|null,"workload":string|null,"qty":number|null,"category":"any"|"zbook"|"nb"|"tower"|"tc","portability":"any"|"laptop"|"desktop"|"compact","budget":number|null,"cpuMin":""|"Intel Core Ultra|1"|"Intel Core Ultra|2"|"Intel Core Ultra|3"|"AMD Ryzen AI|2"|"AMD Ryzen AI|3","ramMin":number|null,"storageMin":number|null (GB, 1TB=1000),"gpuNeed":"any"|"dedicated","gpuModel":string|null,"vramMin":number|null,"screen":""|"14"|"16","os":string|null,"warrantyMin":number|null,"onsite":boolean,"wifi":boolean,"connectivity":string|null,"avail":"any"|"stock","mustHave":string|null,"other":string|null,"missing":[string]}';
  A.sample.json("Extract HP workstation, business notebook (ProBook / EliteBook = category \"nb\") or thin client purchase requirements from the client message below. Only include values the message actually states; use null/defaults otherwise. Budget is per unit in Philippine pesos. In \"missing\" list up to 5 important details the salesperson should confirm with the client (e.g. budget, quantity, software used).\nReply with only JSON of this shape: "+schema+"\n\nCLIENT MESSAGE:\n"+text.slice(0,6000),{modelTier:"quick"}).then(function(r){
    if(!r||typeof r!=="object")throw {code:"invalid_json"};
    var q=Object.assign(blankReq(),A.matchForm||{});["client","workload","qty","category","portability","budget","cpuMin","ramMin","storageMin","gpuNeed","gpuModel","vramMin","screen","os","warrantyMin","onsite","wifi","connectivity","avail","mustHave","other"].forEach(function(k){if(r[k]!=null&&r[k]!==""&&r[k]!=="any")q[k]=r[k];});
    A.matchForm=q;A.extractNote="Extracted by Claude — review every field before matching."+(r.missing&&r.missing.length?" Confirm with client: "+r.missing.join("; "):"");render();
  }).catch(function(e){A.extractNote=e&&e.code==="not_granted"?"Claude extraction was not allowed. Use “Extract requirements” instead.":"Couldn’t extract with Claude. Use “Extract requirements” or fill the form.";render();});
}
