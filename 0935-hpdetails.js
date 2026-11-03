/* ============================== HP item details (hp.com/ph-en product specification pages, checked Oct 13, 2026) ============================== */
var HPD_SRC={
  CJ9R8PT:"https://www.hp.com/ph-en/products/workstations/product-details/product-specifications/2103472007",
  CJ9S1PT:"https://www.hp.com/ph-en/products/workstations/product-details/product-specifications/2103472074",
  CJ9S2PT:"https://www.hp.com/ph-en/products/workstations/product-details/product-specifications/2103472078",
  CJ9S4PT:"https://www.hp.com/ph-en/products/workstations/product-details/product-specifications/2103472083",
  CJ9S5PT:"https://www.hp.com/ph-en/products/workstations/product-details/product-specifications/2103472084",
  DS3X4AT:"https://www.hp.com/ph-en/products/workstations/product-details/product-specifications/2103990601",
  DS3X5AT:"https://www.hp.com/ph-en/products/workstations/product-details/product-specifications/2103990619",
  DR1N0PT:"https://www.hp.com/ph-en/products/workstations/product-details/product-specifications/2103980000",
  DR1N1PT:"https://www.hp.com/ph-en/products/workstations/product-details/product-specifications/2103980003",
  DS3W9AT:"https://www.hp.com/th-en/shop/hp-zbook-8-g2i-14-inch-mobile-workstation-pc-ds3w9at.html",
  "G2a14":"https://www.hp.com/in-en/products/workstations/product-details/product-specifications/2104067759",
  "G2a16":"https://www.hp.com/sg-en/products/workstations/product-details/product-specifications/2104283267",
  "Z1":"https://www.hp.com/ph-en/products/workstations/product-details/product-specifications/2103389026"
};
var POLY2="Audio by Poly Studio, 2 integrated stereo speakers with discrete amplifiers, 2 integrated dual-array digital microphones";
var POLYW="Audio by Poly Studio, dual stereo speakers, HP World Facing Microphone dual-array digital microphones, HD audio";
/* series-level details (same chassis); `src` = the HP page the values were read from */
var HPD_SERIES={
 "HP ZBook 8 G1i":{src:"CJ9R8PT",chipset:"Intel integrated SoC",dims:"31.56 × 22.2 × 1.89 cm (W × D × H)",weight:"Starting at 1.45 kg",
   portsL:"1 HDMI 2.1; 1 headphone/microphone combo; 2 Thunderbolt 4 with USB Type-C 40Gbps (USB Power Delivery, DisplayPort 2.1)",
   portsR:"1 USB Type-C 20Gbps (USB Power Delivery, DisplayPort 1.4); 1 USB Type-A 5Gbps (charging); 1 RJ-45; 1 security lock slot",
   lan:"Intel I219-V GbE",keyboard:"HP Premium Keyboard – spill-resistant, backlit",pointing:"Clickpad with multi-touch gesture support",camera:"5 MP camera",audio:POLYW,
   charge:"HP Fast Charge: approx. 50% in 30 minutes",fingerprint:"Fingerprint reader",ecolabel:"TCO Certified",sustain:"Low halogen; at least 40% post-consumer recycled plastic; external power supply 90% efficiency; bulk packaging available"},
 "HP ZBook 8 G2i":{src:"DS3X4AT",dims14:"31.56 × 22.2 × 1.9 cm (W × D × H)",weight14:"Starting at 1.43 kg",dims16:"35.9 × 25.1 × 1.9 cm (W × D × H)",color:"Meteor silver aluminium",
   portsL:"1 HDMI 2.1; 1 3.5 mm audio combo jack; 2 Thunderbolt 4 with USB Type-C 40Gbps (USB Power Delivery, DisplayPort 2.1)",
   portsR14:"1 USB Type-A 5Gbps; 1 USB Type-C 10Gbps (USB Power Delivery, DisplayPort 1.4); 1 nano security lock slot",
   portsR16:"1 USB Type-A 5Gbps; 1 USB Type-C 10Gbps (USB Power Delivery, DisplayPort 1.4); 1 RJ-45; 1 nano security lock slot",
   keyboard14:"HP Premium Keyboard – spill-resistant, backlit",keyboard16:"HP Premium Keyboard – spill-resistant, backlit, with numeric keypad",
   pointing:"ClickPad Glass with multi-touch gesture support",camera:"5 MP IR AI camera",audio:POLY2,card:"Smart card reader",
   charge:"HP Fast Charge: approx. 50% in 30 minutes",fingerprint:"Fingerprint reader",sustain:"Low halogen; at least 40% post-consumer recycled plastic; external power supply 90% efficiency"},
 "HP ZBook 8 G2a":{src:"G2a14",dims14:"31.6 × 22.2 × 1.9 cm (W × D × H)",weight14:"Starting at 1.46 kg",dims16:"35.9 × 25 × 1.9 cm (W × D × H)",weight16:"Starting at 1.76 kg",
   portsL:"1 HDMI 2.1; 1 3.5 mm audio combo jack; 2 Thunderbolt 4 with USB Type-C 40Gbps (USB Power Delivery, DisplayPort 2.1)",
   portsR14:"1 USB Type-A 5Gbps; 1 USB Type-C 10Gbps (USB Power Delivery, DisplayPort 1.4); 1 RJ-45; 1 nano security lock slot",
   portsR16:"1 USB Type-A 5Gbps; 1 USB Type-C 10Gbps (USB Power Delivery, DisplayPort 1.4); 1 nano security lock slot",
   wireless:"MediaTek Wi-Fi 7 MT7925 (2×2) and Bluetooth 6.0",keyboard14:"HP Premium Keyboard – spill-resistant, backlit",keyboard16:"HP Premium Keyboard – spill-resistant, backlit, with numeric keypad",
   pointing:"ClickPad Glass with multi-touch gesture support",camera:"5 MP IR AI camera",audio:POLY2,card14:"Smart card reader",
   battery:"HP Long Life 3-cell, 68 Wh polymer",charge:"HP Fast Charge: approx. 50% in 30 minutes",power:"HP 100 W USB Type-C GaN adapter",fingerprint:"Fingerprint reader",
   sustain:"Low halogen; at least 60% post-consumer recycled plastic; external power supply 90% efficiency"},
 "HP ZBook X G1i":{src:"CJ9S1PT",chipset:"Intel integrated SoC",dims:"35.9 × 25.1 × 2.3 cm (W × D × H)",weight:"Starting at 2.04 kg",
   portsL:"1 USB Type-A 5Gbps (charging); 1 HDMI 2.1; 1 headphone/microphone combo; 1 power connector; 2 Thunderbolt 4 with USB4 Type-C 40Gbps (USB Power Delivery, DisplayPort 2.1)",
   portsR:"1 USB Type-A 5Gbps; 1 RJ-45; 1 nano security lock slot",lan:"Intel I219-V GbE",keyboard:"Spill-resistant, backlit keyboard with numeric keypad",
   pointing:"Clickpad with multi-touch gesture support",camera:"5 MP IR camera",audio:POLYW,battery:"HP Long Life 6-cell, 83 Wh Li-ion polymer",
   charge:"Fast charge: approx. 50% in 30 minutes",power:"150 W Slim Smart AC adapter",fingerprint:"Fingerprint reader",ecolabel:"TCO Certified",
   sustain:"Low-halogen PCAs; at least 60% post-consumer recycled plastic; external power supply 90% efficiency"},
 "HP ZBook X G2i":{src:"DR1N0PT",dims:"35.9 × 25.1 × 2.49 cm (W × D × H)",weight:"Starting at 1.9 kg",
   portsL:"1 HDMI 2.1; 1 power connector; 1 3.5 mm audio combo jack; 1 USB Type-A 5Gbps (charging); 2 Thunderbolt 4 with USB Type-C 40Gbps (USB Power Delivery, DisplayPort 2.1)",
   portsR:"1 SD 4.0 card reader; 1 nano security lock slot; 1 USB Type-A 5Gbps (charging); 1 RJ-45 (1Gbps)",lan:"Intel I219-V GbE",
   keyboard:"Full-size, backlit keyboard with numeric keypad",pointing:"ClickPad Glass with multi-touch gesture support",camera:"5 MP IR AI camera",audio:POLYW,
   card:"Smart card reader; SD 4.0 card reader",battery:"HP Long Life 6-cell, 96 Wh polymer",charge:"HP Fast Charge: approx. 50% in 30 minutes",power:"150 W AC adapter",
   sensors:"Ambient light sensor; fingerprint sensor; Hall effect sensor; thermal sensor; HP Sure Platform; HP Tamper Lock",
   sustain:"Low-halogen PCAs; at least 60% post-consumer recycled plastic; external power supply 90% efficiency"},
 "HP ZBook Ultra G1a":{src:"CJ9S2PT",chipset:"AMD integrated APU",dims:"31.22 × 21.46 × 1.81 cm (W × D × H)",color:"Meteor silver aluminium",
   portsL:"1 USB Type-C 10Gbps (USB Power Delivery, DisplayPort 2.1); 1 HDMI 2.1; 1 headphone/microphone combo; 1 Thunderbolt 4 with USB Type-C 40Gbps (USB Power Delivery, DisplayPort 2.1)",
   portsR:"1 USB Type-A 10Gbps (charging); 1 Thunderbolt 4 with USB Type-C 40Gbps (USB Power Delivery, DisplayPort 2.1); 1 security lock slot",
   wireless:"MediaTek Wi-Fi 7 MT7925 (2×2) and Bluetooth 5.4",keyboard:"Spill-resistant, backlit keyboard",pointing:"Clickpad with glass surface and multi-touch gesture support",
   camera:"5 MP IR camera",audio:"Audio by Poly Studio, 4 integrated stereo speakers with discrete amplifiers, 2 integrated dual-array digital microphones",
   battery:"HP XL-Long Life 4-cell, 74.5 Wh polymer",charge:"HP Fast Charge: approx. 50% in 30 minutes",power:"140 W USB Type-C slim adapter",fingerprint:"Fingerprint reader",
   sustain:"Low halogen; at least 60% post-consumer recycled plastic; external power supply 90% efficiency"},
 "HP Z1 Tower G1i":{src:"Z1",chipset:"Intel Q870",form:"Tower",dims:"33.7 × 30.8 × 15.5 cm (W × D × H)",weight:"Starting at 5.51 kg",lan:"Intel I219-LM GbE",
   audio:"Realtek ALC3252 codec, universal audio jack (CTIA and OMTP headsets)",
   portsFront:"2 USB Type-C 20Gbps; 4 USB Type-A 10Gbps; 1 headphone/microphone combo",
   portsRear:"2 USB Type-A 5Gbps; 3 USB 2.0 Type-A; 1 HDMI 2.1; 2 DisplayPort 2.1; 1 RJ-45; 1 audio line-in/line-out",
   expansion:"1 M.2 2230 (WLAN); 3 M.2 2280 (storage); 2 PCIe 3 x1; 1 PCIe 5 x16",bays:"Internal: two 3.5\" HDD · External: one slim ODD",
   sustain:"80 Plus Platinum power supplies available; at least 60% post-consumer recycled plastic; 10% ITE-derived closed-loop plastic"},
 "HP Z2 Tower G1i":{src:"CJ9S5PT",chipset:"Intel W880",form:"Tower",dims:"17.5 × 42.6 × 38.8 cm (W × D × H)",weight:"Starting at 8.6 kg",lan:"Intel I219-LM GbE",
   audio:"Realtek ALC3205 codec, universal audio jack (CTIA and OMTP headsets)",
   portsFront:"2 USB Type-C 20Gbps; 4 USB Type-A 10Gbps; 1 headphone/microphone combo",
   portsRear:"2 USB Type-A 10Gbps; 3 USB Type-A 480Mbps; 2 DisplayPort 1.4; 1 RJ-45; 1 audio line-in/line-out",
   expansion:"M.2: 2 × 2280 PCIe 4 x4, 1 × 2280 PCIe 5 x4, 1 × 2230 (WLAN) · PCIe: 1 × PCIe 5 x16, 1 × PCIe 4 x16 (x4 electrical), 1 × PCIe 4 x4, 1 × PCIe 4 x4 (x1 electrical)",
   bays:"Internal: one 3.5\" · External: one 3.5\"",ecolabel:"TCO Certified",
   sustain:"Low halogen; at least 60% post-consumer recycled plastic; 25% ocean-bound plastic in system fans; product carbon footprint disclosed"},
 "HP Z2 Mini G1a":{src:"CJ9S4PT",form:"Mini",dims:"8.55 × 16.8 × 20 cm (W × D × H)",weight:"Starting at 2.3 kg",lan:"Realtek RTL8125BPH-CG GbE",audio:"Realtek ALC3205, 2 W internal mono speaker",
   portsSide:"1 USB Type-C 10Gbps (USB Power Delivery, DisplayPort 2.1); 1 USB Type-A 10Gbps (charging); 1 headphone/microphone combo",
   portsRear:"2 Thunderbolt 4 with USB Type-C 40Gbps (USB Power Delivery, DisplayPort 2.1); 2 Mini DisplayPort 2.1; 2 USB Type-A 10Gbps; 2 USB Type-A 480Mbps; 1 RJ-45; HP 1 GbE NIC Flex IO port",
   expansion:"2 × M.2 2280 PCIe 4 x4; 1 × M.2 2230 (WLAN); 2 × Flex IO",power:"300 W internal power supply, up to 92% efficiency, active PFC",ecolabel:"EPEAT registered",
   sustain:"At least 65% post-consumer recycled plastic; at least 20% post-industrial recycled steel; 10% ITE-derived closed-loop plastic"}
};
/* exact-SKU values from that SKU's own HP page */
var HPD_SKU={
 CJ9R8PT:{display:"14\" WUXGA (1920 × 1200), IPS, anti-glare, 300 nits, 45% NTSC",touch:"No",battery:"HP Long Life 8-cell, 77 Wh polymer",wireless:"Intel Wi-Fi 7 BE201 (2×2) and Bluetooth 5.4, non-vPro",power:"HP 140 W USB Type-C slim adapter",security:"HP Wolf Pro Security Edition (3 years)"},
 CJ9S1PT:{display:"16\" WUXGA (1920 × 1200), IPS, anti-glare, 300 nits, 62.5% sRGB",touch:"No",wireless:"Intel Wi-Fi 7 BE201 (2×2) and Bluetooth 5.4, non-vPro",security:"HP Wolf Pro Security Edition (3 years)",support:"HP 3-year Onsite MWS"},
 CJ9S2PT:{display:"14\" 2.8K (2880 × 1800) OLED, touch, BrightView, Low Blue Light, 400 nits, 100% DCI-P3",touch:"Yes",weight:"1.57 kg (varies by configuration)",security:"HP Wolf Pro Security Edition (3 years)"},
 CJ9S4PT:{kbm:"HP 125 wired keyboard and HP 128 laser wired mouse",security:"HP Wolf Pro Security Edition (3 years)"},
 CJ9S5PT:{wireless:"Intel Wi-Fi 6E AX211 (2×2) and Bluetooth 5.3",kbm:"HP 125 v2 wired keyboard and HP 125 wired mouse",security:"HP Wolf Pro Security Edition (3 years)",power:"500 W power supply, up to 90% efficiency, active PFC",portsRearExtra:"HP 1 GbE NIC Flex IO port"},
 DS3X4AT:{display:"14\" WUXGA (1920 × 1200), IPS, anti-glare, 400 nits, 100% sRGB",touch:"No",wireless:"Intel Wi-Fi 7 BE211 (2×2) and Bluetooth 6.0",battery:"HP Long Life 8-cell, 77 Wh polymer",power:"HP 140 W USB Type-C slim adapter"},
 DS3W9AT:{display:"14\" WUXGA (1920 × 1200), IPS, anti-glare, 400 nits, 100% sRGB",wireless:"Intel Wi-Fi 7 BE211 (2×2) and Bluetooth 6.0",battery:"HP Long Life 8-cell, 77 Wh polymer",power:"HP 140 W USB Type-C slim adapter"},
 DS3X5AT:{display:"16\" WUXGA (1920 × 1200), IPS, anti-glare, 400 nits, 100% sRGB",touch:"No",wireless:"Intel Wi-Fi 7 BE211 (2×2) and Bluetooth 6.0",battery:"HP Long Life 8-cell, 77 Wh polymer",power:"HP 140 W USB Type-C slim adapter"},
 DR1N0PT:{display:"16\" WUXGA (1920 × 1200), IPS, anti-glare, 300 nits, 45% NTSC",touch:"No",wireless:"Intel Wi-Fi 7 BE211 (2×2) and Bluetooth 6.0"},
 DR1N1PT:{display:"16\" WUXGA (1920 × 1200), IPS, anti-glare, 300 nits, 45% NTSC",touch:"No",wireless:"Intel Wi-Fi 7 BE211 (2×2) and Bluetooth 6.0"}
};
function hpDetails(p){var S=HPD_SERIES[p.family];if(!S)return null;var sz=screenIn(p)>=15?"16":"14",X=HPD_SKU[p.sku]||{},s=p.specs||{};
  var pick=function(k){return X[k]||S[k+sz]||S[k]||"";};
  var comp=function(re){var c=(p.components||[]).filter(function(c){return re.test(c.desc||"");})[0];return c?c.desc:"";};
  var ac=comp(/^ACADPT /i),acW=/(\d+)\s*W/i.exec(ac);var adapter=acW?"HP "+acW[1]+" W"+(/GaN/i.test(ac)?" GaN":"")+(/SLM/i.test(ac)?" slim":"")+(/USB-?C/i.test(ac)?" USB Type-C":"")+" adapter":"";
  var ps=comp(/^P\/S /i),psW=/(\d+)\s*W/i.exec(ps);var psu=psW?psW[1]+" W power supply":"";
  var d={exact:!!HPD_SKU[p.sku]&&!!HPD_SRC[p.sku],src:HPD_SRC[p.sku]||HPD_SRC[S.src]||"",srcSku:HPD_SRC[p.sku]?p.sku:S.src,
    os:s.os||"",chipset:pick("chipset"),form:pick("form"),color:pick("color"),
    display:X.display||[s.screen,s.display].filter(Boolean).join(" "),touch:X.touch||(s.touch?(/non/i.test(s.touch)?"No":s.touch):""),
    dims:pick("dims"),weight:pick("weight"),
    portsL:pick("portsL"),portsR:pick("portsR"),portsFront:pick("portsFront"),portsRear:[pick("portsRear"),X.portsRearExtra].filter(Boolean).join("; "),portsSide:pick("portsSide"),
    wireless:X.wireless||S.wireless||(p.components&&p.components.length&&!(p.components||[]).some(function(c){return /^WLAN /i.test(c.desc||"");})?"Not included (M.2 2230 WLAN slot available)":s.wifi)||"",lan:pick("lan"),
    battery:X.battery||S.battery||s.battery||"",charge:p.cat==="zbook"?pick("charge"):"",
    power:X.power||(p.cat==="zbook"?(S.power||adapter||s.powerAdapter||""):(S.power||psu||s.psu||"")),
    keyboard:pick("keyboard")||s.keyboard||"",pointing:pick("pointing"),camera:pick("camera")||s.camera||"",audio:pick("audio"),card:pick("card"),
    kbm:X.kbm||"",expansion:pick("expansion"),bays:pick("bays"),
    fingerprint:pick("fingerprint"),sensors:pick("sensors"),security:X.security||"",
    ecolabel:pick("ecolabel"),sustain:pick("sustain"),warranty:s.warranty||"",support:X.support||""};
  return d;}
var HPD_GROUPS=[
  ["Overview",[["os","Operating system"],["chipset","Chipset"],["form","Form factor"],["color","Colour"]]],
  ["Display",[["display","Display"],["touch","Touchscreen"]]],
  ["Size & weight",[["dims","Dimensions"],["weight","Weight"]]],
  ["Ports",[["portsL","Left side"],["portsR","Right side"],["portsFront","Front"],["portsSide","Side"],["portsRear","Rear"]]],
  ["Networking",[["wireless","Wireless"],["lan","Ethernet"]]],
  ["Battery & power",[["battery","Battery"],["charge","Fast charge"],["power","Power"]]],
  ["Input, camera & audio",[["keyboard","Keyboard"],["pointing","Pointing device"],["kbm","Keyboard & mouse included"],["camera","Camera"],["audio","Audio"],["card","Card reader"]]],
  ["Expansion",[["expansion","Expansion slots"],["bays","Drive bays"]]],
  ["Security",[["fingerprint","Fingerprint"],["sensors","Sensors & HP security features"],["security","Security software"]]],
  ["Warranty",[["warranty","Warranty"],["support","Support service included"]]],
  ["Sustainability",[["ecolabel","Ecolabel"],["sustain","Sustainability"]]]
];
function itemDetailsHtml(p,opts){var d=hpDetails(p);if(!d)return "";opts=opts||{};
  var groups=HPD_GROUPS.map(function(g){var rows=g[1].filter(function(f){return d[f[0]];});if(!rows.length)return "";
    return '<div class="idt-g"><h4>'+esc(g[0])+'</h4><dl>'+rows.map(function(f){return '<dt>'+esc(f[1])+'</dt><dd>'+esc(d[f[0]])+'</dd>';}).join("")+'</dl></div>';}).join("");
  return '<section class="panel idt"><div class="panel-h"><h2>'+esc(opts.title||"Item details")+'</h2><div class="btn-row">'+(A.isAdmin&&d.src?'<a class="small" href="'+esc(d.src)+'" target="_blank" rel="noopener">HP page'+(d.exact?' for '+esc(p.sku):' ('+esc(d.srcSku)+', same series)')+'</a>':'')+'<button class="btn btn-sm" data-act="idt-copy" data-id="'+esc(p.id)+'">'+ICON.copy+'Copy details</button></div></div><div class="idt-grid">'+groups+'</div>'+
    (opts.note?'<p class="small muted" style="margin:0;padding:0 16px 14px">'+esc(opts.note)+'</p>':'')+'</section>';}
function itemDetailsText(p){var d=hpDetails(p);if(!d)return "";var L=[p.name+" — SKU "+p.sku];
  HPD_GROUPS.forEach(function(g){var rows=g[1].filter(function(f){return d[f[0]];});if(!rows.length)return;L.push("");L.push(g[0].toUpperCase());rows.forEach(function(f){L.push(f[1]+": "+d[f[0]]);});});return L.join("\n");}
