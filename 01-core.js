"use strict";
/* ============================== helpers ============================== */
var $ = function(s,r){return (r||document).querySelector(s);};
var $$ = function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));};
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function peso(n){if(n==null||n===""||isNaN(n))return "—";return "₱"+Number(n).toLocaleString("en-PH",{minimumFractionDigits:Number(n)%1?2:0,maximumFractionDigits:2});}
function pesoTxt(n){if(n==null||isNaN(n))return "N/A";return "PHP "+Number(n).toLocaleString("en-PH",{minimumFractionDigits:2,maximumFractionDigits:2});}
function cents(n){return Math.round(Number(n||0)*100);}
function fromCents(c){return c/100;}
function today(){var d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
function addDays(iso,n){var p=String(iso).slice(0,10).split("-").map(Number);var d=new Date(Date.UTC(p[0],p[1]-1,p[2]+n));return d.toISOString().slice(0,10);}
function daysBetween(a,b){return Math.round((new Date(b+"T00:00:00")-new Date(a+"T00:00:00"))/86400000);}
function fmtDate(iso){if(!iso)return "—";var d=new Date(iso.length===10?iso+"T00:00:00":iso);if(isNaN(d))return iso;return d.toLocaleDateString("en-PH",{year:"numeric",month:"short",day:"numeric"});}
function fmtDT(iso){if(!iso)return "—";var d=new Date(iso);if(isNaN(d))return iso;return d.toLocaleString("en-PH",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"});}
function nowISO(){return new Date().toISOString();}
function rid(n){var a="abcdefghijkmnpqrstuvwxyz23456789",s="";var r=crypto.getRandomValues(new Uint8Array(n||10));for(var i=0;i<r.length;i++)s+=a[r[i]%a.length];return s;}
function idFor(sku){return String(sku||"").trim().replace(/[^A-Za-z0-9_\-.~:@+]/g,"_");}
function normSku(s){return String(s||"").toUpperCase().replace(/\s+/g,"");}
function baseSku(s){return normSku(s).replace(/#.*$/,"");}
function debounce(fn,ms){var t;return function(){var a=arguments,self=this;clearTimeout(t);t=setTimeout(function(){fn.apply(self,a);},ms);};}
function clone(o){return JSON.parse(JSON.stringify(o));}
function uniq(a){return a.filter(function(x,i){return a.indexOf(x)===i;});}
var ICON={
  dash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
  box:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7M12 11v10"/></svg>',
  cmp:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="7" height="16" rx="1.5"/><rect x="14" y="4" width="7" height="16" rx="1.5"/></svg>',
  match:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 11l3 3 8-8"/><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"/></svg>',
  quote:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/></svg>',
  price:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 12l-8 8-9-9V3h8z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>',
  docs:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2z"/><path d="M8 7h6M8 11h6"/></svg>',
  bot:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="7" width="16" height="12" rx="3"/><path d="M12 7V4M9 13h.01M15 13h.01"/></svg>',
  admin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.8 1.2V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.8-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3.2 13H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.2-2.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 2.2V2a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.8 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 20.8 9H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 2z"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg>',
  star:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z"/></svg>',
  starOn:'<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.8"><path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6l-6 6 6 6"/></svg>',
  chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h16M7 16v-5M12 16V7M17 16v-8"/></svg>',
  megaphone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 11v2a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1z"/><path d="M16 9a3 3 0 0 1 0 6M18.5 6.5a7 7 0 0 1 0 11"/></svg>',
  chip:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/></svg>',
  dl:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>',
  laptop:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19h20"/></svg>',
  tower:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="3" width="10" height="18" rx="1.5"/><path d="M10 7h4M10 10h4"/><circle cx="12" cy="17" r="1"/></svg>',
  tclient:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="15" rx="1.2"/><path d="M8 21h8M12 18v3"/><path d="M11 6h2"/></svg>',
  grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/></svg>',
  list:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/></svg>',
  moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>',
  sun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  share:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.6-3 8.3-7 10-4-1.7-7-5.4-7-10V6z"/><path d="M9 12l2 2 4-4"/></svg>',
  win:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/></svg>',
  mem:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="8" rx="1"/><path d="M7 16v3M11 16v3M15 16v3M7 11h2M11 11h2M15 11h2"/></svg>',
  disk:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 14h.01M11 14h6"/></svg>',
  gpu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="10" rx="1.5"/><circle cx="9" cy="12" r="2.5"/><path d="M15 10h4M15 14h4"/></svg>',
  screen:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/></svg>',
  cart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.4 11h10.2L20 7H6.2"/><circle cx="9" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/></svg>',
  box3:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  tag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  minus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>',
  arrowDown:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M6 13l6 6 6-6"/></svg>',
  filter:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16l-6 7.5V19l-4 2v-8.5z"/></svg>',
  award:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 21l5-3 5 3-1.5-7"/></svg>',
  user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6"/></svg>',
  gift:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="9" width="18" height="12" rx="1"/><path d="M3 13h18M12 9v12M12 9c-1.5-3-5-4-5-1.5S10 9 12 9zM12 9c1.5-3 5-4 5-1.5S14 9 12 9z"/></svg>',
  ext:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>'
};

/* ============================== app state ============================== */
var A = {
  ready:false, noDb:false, db:null, user:null, uid:null, me:null, isAdmin:false, canWrite:null,
  assets:null, downloads:null, sample:null,
  products:{}, prices:{}, imagesets:{}, series:{}, stats:[], statsLoaded:false, settings:{}, announcements:[], changes:[], docs:[], loaded:{},
  state:{favorites:[],recent:[],searches:[],quoted:{}}, quotes:[], comparisons:[], profiles:[], shortlists:[],
  compare:[], route:{name:"dash",arg:null}, lastMatch:null, matchForm:null, catalog:{q:"",f:{},sort:"family",cat:"all"},
  priceAck:{}
};
var DEFAULT_SETTINGS = {
  companyName:"Iontech Inc.", companyTagline:"HP Professional Products", address:"", phone:"", email:"", website:"", tin:"",
  currency:"PHP", pricesIncludeVat:true, vatRate:12, staleDays:45, quotePrefix:"IQ",
  paymentTerms:"", deliveryTerms:"", quoteTerms:"Prices are in Philippine pesos and include 12% VAT unless stated. Prices and availability are subject to change without prior notice. Stock is subject to prior sale.",
  orderTat:"45–60 days",
  discountNote:"Discounts require approval from your sales manager before the quotation is finalized."
};
function S(k){var v=(A.settings&&A.settings[k]!=null&&A.settings[k]!=="")?A.settings[k]:DEFAULT_SETTINGS[k];if(k==="quoteTerms"&&typeof v==="string")v=v.replace(/,?\s*and are valid until the date shown/i,"").replace(/valid until the date shown\.?/i,"");return v;}

var CATS={zbook:"ZBook mobile workstations",nb:"HP business notebooks",tower:"Z desktop workstations",tc:"Thin clients"};
var CAT_SHORT={zbook:"ZBook",nb:"Business notebook",tower:"Z Desktop",tc:"Thin client"};
var CAT_TAB={zbook:"ZBook mobile",nb:"Business notebooks",tower:"Z desktop",tc:"Thin clients"};
var NB_LINES=[["probook","ProBook"],["elite6","EliteBook 6"],["elite8","EliteBook 8"],["elitex","EliteBook X"],["flip","EliteBook Flip"],["other","HP 200 / 240 / 245"]];
var STATUS={
  available:["Available for Ordering","t-info"], in_stock:["In Stock","t-ok"], limited:["Limited Stock","t-warn"], reserved:["Reserved","t-purple"],
  out:["Out of Stock","t-bad"], unconfirmed:["Availability Unconfirmed","t-mute"], discontinued:["Discontinued","t-bad"], replacement:["Replacement Available","t-warn"]
};
var PTYPES={onhand:"On-hand selling price",order:"Order-basis selling price",srp:"SRP",dp:"Dealer price (DP)",special:"Special approved price",promo:"Promotional price",bundle:"Bundle price"};
var PTYPE_SHORT={onhand:"On-hand",order:"Order basis",srp:"SRP",dp:"DP",special:"Special",promo:"Promo",bundle:"Bundle"};
var SPEC_GROUPS=[
  ["Processor",[["processor","Processor"],["cores","Cores / threads"],["cpuSpeed","Max speed"],["cache","Cache"]]],
  ["Memory",[["memory","Memory"],["memoryConfig","Configuration"],["memorySlots","Slots / upgradeability"]]],
  ["Storage",[["storage","Storage"],["storageSlots","Storage bays / slots"]]],
  ["Graphics",[["graphics","Graphics"],["vram","Graphics memory"]]],
  ["Display",[["screen","Screen size"],["display","Panel"],["touch","Touch"]]],
  ["Operating system",[["os","Operating system"]]],
  ["Connectivity",[["network","Wired network"],["wifi","Wireless"],["bluetooth","Bluetooth"],["wwan","Mobile broadband (WWAN)"],["portsFront","Ports (front)"],["portsRear","Ports (rear)"],["ports","Ports"],["io","Port modules (this SKU)"],["ioOptions","Optional I/O modules"],["protocols","Remote protocols"]]],
  ["Battery & power",[["battery","Battery"],["powerAdapter","Power adapter"],["psu","Power supply"]]],
  ["Input, camera & audio",[["camera","Camera"],["keyboard","Keyboard"],["pointing","Pointing device"],["pen","Digital pen"],["audio","Audio"]]],
  ["Expansion & chassis",[["expansion","PCIe expansion"],["optical","Optical drive"],["cooling","Cooling"],["formFactor","Form factor"],["accessories","Included accessories"]]],
  ["Physical",[["chassis","Chassis & colour"],["weight","Weight"],["dimensions","Dimensions"]]],
  ["Security & software",[["security","Security features"],["software","Software"],["isv","ISV certification"]]],
  ["Warranty & services",[["warranty","Warranty"],["service","Care Pack / services"]]]
];
var SPEC_KEYS=[];SPEC_GROUPS.forEach(function(g){g[1].forEach(function(k){SPEC_KEYS.push(k[0]);});});
var SPEC_LABEL={};SPEC_GROUPS.forEach(function(g){g[1].forEach(function(k){SPEC_LABEL[k[0]]=k[1];});});

/* ============================== spec parsing ============================== */
function P(id){return A.products[id];}
function allProducts(){return Object.keys(A.products).map(function(k){return A.products[k];}).filter(function(p){return p.active!==false;});}
function bySku(sku){var n=normSku(sku),b=baseSku(sku);var list=allProducts();
  return list.find(function(p){return normSku(p.sku)===n;})||list.find(function(p){return baseSku(p.sku)===b&&b.length>=5;});}
function gb(str){if(!str)return null;var s=String(str);var tot=0,found=false;var re=/(\d+(?:\.\d+)?)\s*(TB|GB)/gi,m;while((m=re.exec(s))){found=true;tot+=parseFloat(m[1])*(m[2].toUpperCase()==="TB"?1000:1);if(!/\+/.test(s))break;}return found?tot:null;}
function ramGB(p){return gb(p.specs.memory);}
function storageGB(p){return gb(p.specs.storage);}
function vramGB(p){var v=p.specs.vram;if(!v)return dedicated(p)?null:0;if(/shared|unified/i.test(v))return 0;return gb(v);}
function screenIn(p){var m=/(\d+(?:\.\d+)?)/.exec(p.specs.screen||"");return m?parseFloat(m[1]):null;}
function dedicated(p){return /nvidia|radeon graphics card|discrete|rtx|geforce/i.test(p.specs.graphics||"")&&!/integrated/i.test(p.specs.graphics||"");}
function warrantyYears(p){var w=p.specs.warranty||"";var m=/(\d+)\s*-?\s*year/i.exec(w)||/^(\d)\/\d\/\d/.exec(w);return m?parseInt(m[1],10):null;}
function onsite(p){var w=p.specs.warranty||"";if(/no onsite|\/0\b/i.test(w))return false;if(/onsite/i.test(w)||/\/[1-9]\b/.test(w))return true;return null;}
function wifiOf(p){var w=p.specs.wifi||"";if(!w)return null;return !/wired|none|no\b/i.test(w);}
function portable(p){return p.cat==="zbook";}
function cpuInfo(p){var s=p.specs.processor||"";var m;
  if((m=/Core Ultra (\d)/i.exec(s)))return {vendor:"Intel",ladder:"Intel Core Ultra",tier:{5:1,7:2,9:3}[m[1]]||0,label:"Intel Core Ultra "+m[1]};
  if(/Ryzen AI Max\+/i.test(s))return {vendor:"AMD",ladder:"AMD Ryzen AI",tier:4,label:"AMD Ryzen AI Max+"};
  if(/Ryzen AI Max/i.test(s))return {vendor:"AMD",ladder:"AMD Ryzen AI",tier:3,label:"AMD Ryzen AI Max PRO"};
  if((m=/Ryzen AI (\d)/i.exec(s)))return {vendor:"AMD",ladder:"AMD Ryzen AI",tier:{5:1,7:2,9:3}[m[1]]||0,label:"AMD Ryzen AI "+m[1]+" PRO"};
  if(/N97|U300E/i.test(s))return {vendor:"Intel",ladder:"Intel thin client",tier:0,label:s};
  if(/R2314|V2546/i.test(s))return {vendor:"AMD",ladder:"AMD embedded",tier:0,label:s};
  return {vendor:"",ladder:"",tier:null,label:s||"Not listed"};}
function gpuShort(p){var g=p.specs.graphics||"";if(!g)return "";return g.replace(/ Generation| Blackwell/g,"").replace(/NVIDIA GeForce/,"GeForce");}

/* ============================== prices ============================== */
function priceRec(id){return A.prices[id]||null;}
function priceTypes(id){var r=priceRec(id);if(!r||!r.types)return [];return Object.keys(PTYPES).filter(function(t){return r.types[t]&&r.types[t].amount!=null;});}
function sellPrice(id){var r=priceRec(id);if(!r||!r.types)return null;var t=r.primary&&r.types[r.primary]?r.primary:priceTypes(id)[0];if(!t)return null;return {type:t,amount:Number(r.types[t].amount)};}
function priceFlags(id){
  var r=priceRec(id),f=[];if(r&&r.tba&&!sellPrice(id)){f.push({k:"tba",t:"Price TBA · order basis",c:"t-mute"});return f;}if(!r||!sellPrice(id)){f.push({k:"missing",t:"No approved price",c:"t-bad"});return f;}
  if(r.approved===false)f.push({k:"unapproved",t:"Not approved",c:"t-bad"});
  if(r.expires&&r.expires<today())f.push({k:"expired",t:"Expired "+fmtDate(r.expires),c:"t-bad"});
  else if(r.effective&&r.effective>today())f.push({k:"future",t:"Effective "+fmtDate(r.effective),c:"t-warn"});
  var v=r.verifiedAt||r.updatedAt;if(v&&daysBetween(v.slice(0,10),today())>Number(S("staleDays")))f.push({k:"stale",t:"Last verified "+fmtDate(v.slice(0,10)),c:"t-warn"});
  var ch=A.changes.find(function(c){return c.pid===id;});if(ch&&ch.at&&daysBetween(ch.at.slice(0,10),today())<=14)f.push({k:"changed",t:"Price changed "+fmtDate(ch.at.slice(0,10)),c:"t-info"});
  return f;}
function isTBA(id){var r=priceRec(id);return !!(r&&r.tba&&!sellPrice(id));}
function noPriceLabel(id){return isTBA(id)?"Price TBA":"No price";}
function priceBlocking(id){return priceFlags(id).some(function(f){return f.k==="tba"||f.k==="missing"||f.k==="unapproved"||f.k==="expired"||f.k==="stale"||f.k==="future";});}
function statusTag(p){var s=STATUS[p.status]||STATUS.unconfirmed;var extra=p.status==="in_stock"&&p.stockQty!=null?" · "+p.stockQty+" pcs":"";return '<span class="tag '+s[1]+'" title="'+(p.stockAsOf?"Stock as of "+esc(fmtDate(p.stockAsOf)):"")+'">'+esc(s[0])+esc(extra)+'</span>';}
function priceDate(id){var r=priceRec(id);return r?(r.verifiedAt||(r.updatedAt||"").slice(0,10)):null;}

/* ============================== copy formats ============================== */
var NA="Not listed in source data";
function specVal(p,k){return p.specs&&p.specs[k]?p.specs[k]:null;}
function copyLines(p,mode){
  var s=p.specs||{},L=[];var sp=sellPrice(p.id);var r=priceRec(p.id)||{};
  if(mode==="sku")return p.name+" — SKU "+p.sku;
  var display=[s.screen,s.display,s.touch&&s.touch!=="Non-Touch"?s.touch:""].filter(Boolean).join(" ");
  var gpu=[s.graphics,s.vram&&!/shared/i.test(s.vram)?s.vram:""].filter(Boolean).join(", ");
  if(mode==="short"||mode==="price"){
    L.push(p.name);L.push("SKU: "+p.sku);
    L.push([s.processor,s.memory,s.storage,gpu,display,s.os].filter(Boolean).join(" | "));
    L.push("Warranty: "+(s.warranty||NA));
    if(mode==="price"){
      if(sp)L.push("Price: "+peso(sp.amount)+" ("+PTYPES[sp.type]+", "+(r.vatInclusive===false?"VAT exclusive":"VAT inclusive")+")");else L.push("Price: not available — confirm with product manager");
      L.push("Price as of: "+(priceDate(p.id)?fmtDate(priceDate(p.id)):NA));
      L.push("Availability: "+(STATUS[p.status]||STATUS.unconfirmed)[0]);
    }
    return L.join("\n");
  }
  L.push(p.name);L.push("SKU: "+p.sku);L.push("");
  [["Processor",s.processor+(s.cores?" ("+s.cores+")":"")],["Memory",[s.memory,s.memoryConfig].filter(Boolean).join(", ")],["Storage",s.storage],["Graphics",gpu],["Display",display],["Operating system",s.os],["Connectivity",[s.network,s.wifi,s.bluetooth?"Bluetooth "+s.bluetooth:"",s.io].filter(Boolean).join(", ")],["Expansion",[s.expansion,s.storageSlots].filter(Boolean).join("; ")],["Warranty",s.warranty]].forEach(function(r2){
    var v=r2[1];if(!v||/^undefined/.test(v))v=NA;L.push(r2[0]+": "+v);});
  if(mode==="full"||mode==="fullprice"){
    if(sp){L.push("");L.push("Approved price: "+peso(sp.amount)+" — "+PTYPES[sp.type]+" ("+(r.vatInclusive===false?"VAT exclusive":"VAT inclusive")+")");}
    else {L.push("");L.push("Approved price: not available");}
    L.push("Price as of: "+(priceDate(p.id)?fmtDate(priceDate(p.id)):NA));
    L.push("Availability: "+(STATUS[p.status]||STATUS.unconfirmed)[0]);
  }
  return L.join("\n");
}
function copyText(text,label){if(typeof logEvent==="function")logEvent("copy");
  function fallback(){var ta=document.createElement("textarea");ta.value=text;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();var ok=false;try{ok=document.execCommand("copy");}catch(e){}ta.remove();if(ok)toast((label||"Copied")+" — ready to paste");else showText("Copy this text",text);}
  try{navigator.clipboard.writeText(text).then(function(){toast((label||"Copied")+" — ready to paste");},fallback);}catch(e){fallback();}
}
function showText(title,text){modal({title:title,body:'<textarea class="inp" style="width:100%;min-height:260px;font-family:var(--f-mono);font-size:12.5px" readonly>'+esc(text)+'</textarea><p class="small muted">Select all and copy (Ctrl+C / Cmd+C).</p>',actions:[["Close","close"]]});}

/* ============================== UI primitives ============================== */
function toast(msg,bad){var t=document.createElement("div");t.className="toast"+(bad?" bad":"");t.setAttribute("role","status");t.textContent=msg;document.body.appendChild(t);setTimeout(function(){t.remove();},bad?4200:2300);}
var MODAL=null;
function modal(o){
  closeModal();
  var w=document.createElement("div");w.id="modal";
  w.innerHTML='<div class="scrim" data-mclose></div><div class="modal" role="dialog" aria-modal="true" aria-label="'+esc(o.title)+'"><div class="modal-card'+(o.wide?" wide":"")+'"><div class="modal-h"><h2>'+esc(o.title)+'</h2><button class="icon-btn" data-mclose aria-label="Close">'+ICON.x+'</button></div><div class="modal-b">'+o.body+'</div>'+
    (o.actions?'<div class="modal-f">'+(o.left||"")+'<span class="spacer"></span>'+o.actions.map(function(a){return '<button class="btn'+(a[2]?" "+a[2]:"")+'" data-maction="'+esc(a[1])+'">'+esc(a[0])+'</button>';}).join("")+'</div>':"")+'</div></div>';
  document.body.appendChild(w);MODAL=o;
  w.addEventListener("click",function(e){
    if(e.target.closest("[data-mclose]")){closeModal();return;}
    var b=e.target.closest("[data-maction]");if(b){var a=b.getAttribute("data-maction");if(a==="close"){closeModal();return;}if(o.onAction)o.onAction(a,w,b);}
  });
  if(o.onOpen)o.onOpen(w);
  var f=w.querySelector("input,select,textarea,button.btn-primary");if(f)setTimeout(function(){try{f.focus();}catch(e){}},30);
  return w;
}
function closeModal(){var m=document.getElementById("modal");if(m)m.remove();MODAL=null;}
function confirmBox(title,html,okLabel,danger){return new Promise(function(res){modal({title:title,body:html,actions:[["Cancel","no"],[okLabel||"Confirm","yes",danger?"btn-danger":"btn-primary"]],onAction:function(a){closeModal();res(a==="yes");}});var m=document.getElementById("modal");m.querySelector("[data-mclose].scrim").addEventListener("click",function(){res(false);});});}
function lightbox(src,alt){var w=document.createElement("div");w.className="lightbox";w.setAttribute("role","dialog");w.innerHTML='<div class="plate"><img src="'+esc(src)+'" alt="'+esc(alt||"")+'"></div>';w.addEventListener("click",function(){w.remove();});document.body.appendChild(w);}
function popMenu(anchor,items){
  closeMenu();var m=document.createElement("div");m.className="menu";m.id="popmenu";
  m.innerHTML=items.map(function(it,i){return '<button data-mi="'+i+'">'+esc(it[0])+'</button>';}).join("");
  document.body.appendChild(m);var r=anchor.getBoundingClientRect();var top=r.bottom+window.scrollY+4;var left=Math.min(r.left+window.scrollX,window.innerWidth-m.offsetWidth-12+window.scrollX);
  m.style.top=top+"px";m.style.left=Math.max(8,left)+"px";
  m.addEventListener("click",function(e){var b=e.target.closest("[data-mi]");if(b){var it=items[+b.getAttribute("data-mi")];closeMenu();it[1]();}});
  setTimeout(function(){document.addEventListener("click",closeMenu,{once:true});},0);
}
function closeMenu(){var m=document.getElementById("popmenu");if(m)m.remove();}
function imgOf(p,i){
  var imgs=(p.images&&p.images.length)?p.images.map(function(x){return {id:x.id||x,view:x.view||""};}):((A.imagesets[p.imageSet]||{}).images||[]);
  return imgs;
}
function imgScopeNote(p){if(p.images&&p.images.length)return "SKU-specific image";var s=A.imagesets[p.imageSet];return s?"Family image: "+(s.label||p.family)+" — not specific to this configuration":"";}
function thumbHtml(p){var im=imgOf(p);return im.length?'<img src="/_blob/'+esc(im[0].id)+'" alt="'+esc(p.name)+'" loading="lazy">':'<div class="no-img">'+esc(p.family||p.name)+'<br><span style="font-weight:400">Image pending</span></div>';}
