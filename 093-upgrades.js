/* ============================== Upgradeability Checker — verified database (HP official sources, checked Oct 13, 2026) ============================== */
var UPG_VERIFIED="2026-10-13";
var UPG_SRC={
  ph:{t:"HP Philippines — ZBook mobile workstations (family maximums)",u:"https://www.hp.com/ph-en/workstations/mobile-workstation-pc.html"},
  z8g1:{t:"HP — ZBook 8 G1i overview (max memory / storage)",u:"https://www.hp.com/lamerica_nsc_carib-en/workstations/zbook-8.html"},
  z8g1spec:{t:"HP — ZBook 8 G1i 14 product specifications (memory slots)",u:"https://www.hp.com/emea_africa-en/products/workstations/product-details/product-specifications/2103225097"},
  z8g1cfg:{t:"HP Store — ZBook 8 G1i 14 configurator (memory, storage, battery options)",u:"https://www.hp.com/us-en/shop/pdp/hp-zbook-8-g1i-14-inch-ai-customizable-b25dqav-mb"},
  z8g2iTH:{t:"HP Thailand — ZBook 8 G2i 14 DS3W9AT specifications",u:"https://www.hp.com/th-en/shop/hp-zbook-8-g2i-14-inch-mobile-workstation-pc-ds3w9at.html"},
  z8g2icfg:{t:"HP Store — ZBook 8 G2i 16 configurator (memory, storage options)",u:"https://www.hp.com/us-en/shop/pdp/hp-zbook-8-g2i-16-inch-mobile-workstation-pc-customizable-c77a4av-mb"},
  z8g2acfg:{t:"HP Store — ZBook 8 G2a 14 configurator (memory, storage, WLAN options)",u:"https://www.hp.com/us-en/shop/pdp/hp-zbook-8-g2a-14-inch-mobile-workstation-pc-customizable-c8hd0av-mb"},
  zxg1:{t:"HP — ZBook X G1i overview (max memory / storage)",u:"https://www.hp.com/lamerica_nsc_carib-en/workstations/zbook-x.html"},
  zxg1cfg:{t:"HP Store — ZBook X G1i 16 configurator (2nd SSD, RAID, memory)",u:"https://www.hp.com/us-en/shop/pdp/hp-zbook-x-g1i-16-inch-mobile-workstation-pc-customizable-b4yu6av-mb"},
  zxg2PH:{t:"HP Philippines — ZBook X G2i DR1N0PT specifications",u:"https://www.hp.com/ph-en/products/workstations/product-details/product-specifications/2103980000"},
  zxg2cfg:{t:"HP Store — ZBook X G2i 16 configurator (memory up to 2×64 GB CSODIMM, 2nd SSD, RAID)",u:"https://www.hp.com/us-en/shop/pdp/hp-zbook-x-g2i-16-inch-mobile-workstation-pc-customizable-ce2y9av-mb"},
  zuMSG:{t:"HP ZBook Ultra G1a Maintenance & Service Guide (1st ed., Feb 2025)",u:"https://kaas.hpcloud.hp.com/pdf-public/pdf_11793263_en-US-1.pdf"},
  zucfg:{t:"HP Store — ZBook Ultra G1a configurator (“Memory soldered down”)",u:"https://www.hp.com/us-en/shop/pdp/hp-zbook-ultra-g1a-14-inch-mobile-workstation-pc-customizable-ay8k7av-mb"},
  z1:{t:"HP — Z1 Tower G1i overview (128 GB, 3 M.2 slots)",u:"https://www.hp.com/us-en/workstations/z1-entry-tower.html"},
  z1MSG:{t:"HP Z1 Tower G1i Maintenance & Service Guide (2nd ed., May 2026)",u:"https://kaas.hpcloud.hp.com/pdf-public/pdf_12028310_en-US-1.pdf"},
  z1cfg:{t:"HP Store — Z1 Tower G1i configurator (memory, 2nd/3rd SSD, graphics)",u:"https://www.hp.com/us-en/shop/pdp/hp-z1-tower-g1i-desktop-pc-customizable-am5u0av-mb"},
  z2t:{t:"HP — Z2 Tower G1i overview (memory, 36 TB storage, 1200 W PSU)",u:"https://www.hp.com/us-en/workstations/z2-tower.html"},
  z2tMSG:{t:"HP Z2 Tower G1i Maintenance & Service Guide (2nd ed., Sep 2026)",u:"https://kaas.hpcloud.hp.com/pdf-public/pdf_12128633_en-US-1.pdf"},
  z2tcfg:{t:"HP Store — Z2 Tower G1i configurator (memory incl. ECC & CUDIMM, M.2, GPU, PSU)",u:"https://www.hp.com/us-en/shop/custom/hp-z2-tower-g1i-workstation-desktop-pc-customizable-intel-core-ultra-32gb-ram-1tb-ssd-B04F0AV_2686005?catEntryId=3074457345622047318"},
  z2m:{t:"HP — Z2 Mini G1a overview (128 GB unified memory, dual NVMe up to 8 TB)",u:"https://www.hp.com/us-en/workstations/z2-mini-a.html"},
  z2mMSG:{t:"HP Z2 Mini G1a Maintenance & Service Guide (2nd ed., Nov 2025)",u:"https://kaas.hpcloud.hp.com/pdf-public/pdf_12139365_en-US-1.pdf"},
  z2mcfg:{t:"HP Store — Z2 Mini G1a configurator (memory bundles, 2nd SSD, RAID)",u:"https://www.hp.com/us-en/shop/custom/hp-z2-mini-g1a-workstation-desktop-pc-customizable-amd-ryzen-ai-64gb-ram-2tb-ssd-A74X0AV_165347?catEntryId=3074457345622107818"},
  damZ1:{t:"HP Asset Manager — HP Z1 Tower G1i Source Messaging (“Easily upgrade memory and storage as work evolves with tool-less access”)",u:"https://assetmanager.hp.com/dam/searchresults"},
  damZ2:{t:"HP Asset Manager — HP Z2 Tower G1i Source Messaging (“Need to upgrade graphics? Increase memory or storage? Add specialized PCIe cards?”)",u:"https://assetmanager.hp.com/dam/searchresults"},
  damXG1:{t:"HP Asset Manager — ZBook X G1 Sales Transition Playbook (“Up to 64 GB DDR5 SODIMM”, up to 8 TB)",u:"https://assetmanager.hp.com/dam/searchresults"},
  damZB:{t:"HP Asset Manager — ZBook 8 G1i/G2i/G2a, X G2i, Ultra G1a Source Messaging (family maximum memory and storage)",u:"https://assetmanager.hp.com/dam/searchresults"},
  pl:{t:"Iontech price list Oct 2026 — factory component list (HP AV codes) for the exact SKU",u:""}
};
/* status: up = Upgradeable, no = Not upgradeable, cond = Conditional, ver = Needs verification */
var UPG_LAPTOP_CPU={st:"no",max:"—",note:"Mobile processors are soldered to the system board; HP only offers the processor as a factory option. Changing it means replacing the system board, which is not an upgrade path."};
var UPG_LAPTOP_DGPU={st:"no",max:"—",note:"The discrete GPU is part of the base unit / system board (one HP part with the processor). Graphics must be chosen at purchase."};
var UPG_LAPTOP_DISPLAY={st:"ver",max:"—",note:"HP offers different panels only as factory options. Whether a different panel can be fitted later isn't documented for this model — treat as replacement-only unless HP confirms."};
var UPG_SERIES={
 "HP ZBook 8 G1i":{kind:"laptop",
  mem:{type:"DDR5-5600 SODIMM, non-ECC",slots:2,soldered:false,familyMax:64,skuMax:64,configs:"1×16, 2×8, 1×24, 1×32, 2×16, 2×24 GB (DDR5-5600 SODIMM); 16 GB and 2×16 GB DDR5-6400 CSODIMM factory options",
   notes:["Dual channel needs two SODIMMs of the same size and speed.","Mixed speeds run at the slower speed.","HP recommends HP-branded memory."],src:["damZB","z8g1","z8g1spec","z8g1cfg"]},
  ssd:{slots:1,slotsVerified:false,slotsNote:"HP offers no second-SSD option for this model",iface:"PCIe Gen4 ×4 NVMe",form:"M.2 2280",familyMax:"2 TB",skuMax:"2 TB",second:false,raid:false,src:["z8g1","z8g1cfg"]},
  cpu:UPG_LAPTOP_CPU,gpu:UPG_LAPTOP_DGPU,display:UPG_LAPTOP_DISPLAY,
  battery:{note:"HP offers 62 Wh (3-cell) or 77 Wh (8-cell). Internal battery — replacement with the HP service part only.",max:"77 Wh",src:["z8g1cfg"]},
  gaps:["M.2 slot count isn't stated by HP (no second-SSD option offered) — treat as single slot."]},
 "HP ZBook 8 G2i":{kind:"laptop",
  mem:{type:"DDR5-5600 SODIMM, non-ECC (this SKU)",slots:2,soldered:false,familyMax:64,skuMax:64,configs:"1×16, 2×8, 1×24, 1×32, 2×16, 2×24, 2×32 GB DDR5-5600 SODIMM; 16 GB and 2×16 GB DDR5-6400 CSODIMM",
   familyNote:"Some ZBook 8 G2i configurations (Intel Arc Pro graphics) use LPDDR5x memory instead of SODIMMs — this SKU uses SODIMMs.",
   notes:["Mixed speeds run at the slower speed.","HP recommends HP-branded memory."],src:["damZB","ph","z8g2iTH","z8g2icfg"]},
  ssd:{slots:1,slotsVerified:false,slotsNote:"HP offers no second-SSD option for this model",iface:"PCIe Gen5 ×4 NVMe",form:"M.2 2280",familyMax:"2 TB",skuMax:"2 TB",second:false,raid:false,src:["ph","z8g2icfg"]},
  cpu:UPG_LAPTOP_CPU,gpu:UPG_LAPTOP_DGPU,display:UPG_LAPTOP_DISPLAY,
  battery:{note:"Internal 8-cell 77 Wh battery — replacement with the HP service part only.",max:"77 Wh",src:["z8g2iTH"]},
  gaps:["M.2 slot count isn't stated by HP (no second-SSD option offered)."]},
 "HP ZBook 8 G2a":{kind:"laptop",
  mem:{type:"DDR5-5600 SODIMM, non-ECC",slots:2,soldered:false,familyMax:64,skuMax:64,configs:"1×16, 2×8, 1×24, 2×12, 1×32, 2×16, 2×24, 2×32 GB DDR5-5600 SODIMM",
   notes:["Mixed speeds run at the slower speed.","Integrated Radeon graphics use part of system memory (UMA) — more RAM also helps graphics."],src:["damZB","ph","z8g2acfg"]},
  ssd:{slots:1,slotsVerified:false,slotsNote:"HP offers no second-SSD option for this model",iface:"PCIe Gen5 ×4 NVMe",form:"M.2 2280",familyMax:"2 TB",skuMax:"2 TB",second:false,raid:false,src:["ph","z8g2acfg"]},
  cpu:UPG_LAPTOP_CPU,gpu:{st:"no",max:"—",note:"Integrated AMD Radeon graphics are part of the processor — not upgradeable."},display:UPG_LAPTOP_DISPLAY,
  battery:{note:"HP offers one battery for this model (68 Wh, 3-cell). Internal — replacement with the HP service part only.",max:"68 Wh",src:["z8g2acfg"]},
  gaps:["M.2 slot count isn't stated by HP (no second-SSD option offered)."]},
 "HP ZBook X G1i":{kind:"laptop",
  mem:{type:"DDR5-5600 SODIMM, non-ECC",slots:2,soldered:false,familyMax:64,skuMax:64,configs:"1×16, 2×8, 1×24, 1×32, 2×16, 2×24 GB in HP's configurator; 2×32 GB ships in SKU CW6L2PT",
   notes:["Dual channel needs two SODIMMs of the same size and speed.","Mixed speeds run at the slower speed."],src:["damXG1","zxg1","zxg1cfg"]},
  ssd:{slots:2,slotsVerified:true,slotsNote:"HP offers a 2nd internal M.2 SSD",iface:"PCIe Gen4 ×4 NVMe",form:"M.2 2280",familyMax:"8 TB",skuMax:"8 TB (2 × 4 TB)",second:true,raid:"NVMe RAID 0 or RAID 1 (two SSDs)",src:["zxg1","zxg1cfg"]},
  cpu:UPG_LAPTOP_CPU,gpu:UPG_LAPTOP_DGPU,display:UPG_LAPTOP_DISPLAY,
  battery:{note:"HP offers one battery for this model (83 Wh, 6-cell). Internal — replacement with the HP service part only.",max:"83 Wh",src:["zxg1cfg"]},
  gaps:[]},
 "HP ZBook X G2i":{kind:"laptop",
  mem:{type:"DDR5-5600 SODIMM, non-ECC",slots:2,soldered:false,familyMax:128,skuMax:128,configs:"Up to 2×32 GB DDR5-5600 SODIMM; 64 GB and 128 GB (2×64 GB) DDR5-6400 CSODIMM factory options",
   cond128:"128 GB uses 2 × 64 GB DDR5-6400 CSODIMMs (HP's factory option). With standard DDR5-5600 SODIMMs HP's largest option is 64 GB (2 × 32 GB). Confirm CSODIMM field-upgrade support with HP before quoting 128 GB.",
   notes:["Dual channel needs two SODIMMs of the same size and speed.","Mixed speeds run at the slower speed."],src:["damZB","ph","zxg2PH","zxg2cfg"]},
  ssd:{slots:2,slotsVerified:true,slotsNote:"HP offers a 2nd internal M.2 SSD",iface:"PCIe Gen5 ×4 NVMe",form:"M.2 2280",familyMax:"8 TB",skuMax:"8 TB",second:true,raid:"NVMe RAID 0 or RAID 1 (two SSDs)",
   restrict:"HP: the second SSD is not available with NVIDIA RTX PRO 3000 graphics.",src:["ph","zxg2cfg"]},
  cpu:UPG_LAPTOP_CPU,gpu:UPG_LAPTOP_DGPU,display:UPG_LAPTOP_DISPLAY,
  battery:{note:"HP offers 62 Wh (3-cell) or 96 Wh (6-cell). Internal — replacement with the HP service part only.",max:"96 Wh",src:["zxg2PH","zxg2cfg"]},
  gaps:["128 GB requires DDR5-6400 CSODIMMs — field-upgrade support not confirmed by HP."]},
 "HP ZBook Ultra G1a":{kind:"laptop",
  mem:{type:"LPDDR5x-8533, soldered (onboard)",slots:0,soldered:true,familyMax:128,skuMax:null,configs:"16, 32, 64 or 128 GB — chosen at purchase together with the processor",
   notes:["HP: “Memory soldered down. Supports dual channel memory.”","Unified memory is shared with the Radeon graphics."],src:["damZB","zuMSG","zucfg","ph"]},
  ssd:{slots:1,slotsVerified:false,slotsNote:"HP offers no second-SSD option for this model",iface:"PCIe Gen4 ×4 NVMe",form:"M.2 2280",familyMax:"4 TB",skuMax:"4 TB",second:false,raid:false,src:["zuMSG","zucfg","ph"]},
  cpu:{st:"no",max:"—",note:"HP sells the system board with the processor (and memory) as one part — not upgradeable."},
  gpu:{st:"no",max:"—",note:"Integrated AMD Radeon 8050S/8060S graphics are part of the processor — not upgradeable."},
  display:{st:"no",max:"—",note:"HP: individual panel parts are not offered — the display is replaced as a full hinge-up assembly by an authorized service provider."},
  keyboard:{st:"no",max:"—",note:"Keyboard is part of the top cover (one HP spare part), replaced by a service provider."},
  wlanFixed:{st:"no",note:"WLAN module is not offered as a field option (single factory WLAN: MediaTek MT7925)."},
  battery:{note:"74.5 Wh 4-cell battery. HP lists it as end-user replaceable (a revive kit is needed when installing a new battery). Only one battery size is offered.",max:"74.5 Wh",src:["zuMSG","zucfg"]},
  gaps:["M.2 slot count isn't stated in the service guide; HP offers no second SSD."]},
 "HP Z1 Tower G1i":{kind:"tower",
  mem:{type:"DDR5-5600 UDIMM, non-ECC",slots:4,soldered:false,familyMax:128,skuMax:128,configs:"8, 16, 24, 32 GB UDIMMs; HP options up to 4 × 32 GB (128 GB)",
   notes:["Tool-less access — memory and storage can be upgraded as work evolves.","Two DIMMs per channel must be symmetric (same size/rank).","Don't mix speeds or ranks within a channel.","HP doesn't state the memory speed with four DIMMs installed — confirm if speed matters."],src:["damZ1","z1","z1MSG","z1cfg"]},
  ssd:{slots:3,slotsVerified:true,slotsNote:"3 × M.2 2280 slots (HP)",iface:"PCIe Gen4 ×4 NVMe (Gen5-capable SSD options on some SKUs)",form:"M.2 2280",familyMax:"Up to 10 TB (HP)",skuMax:"Up to 10 TB (HP)",second:true,raid:"NVMe RAID 1 (HP option)",
   bays:"1 × 3.5\" drive bay plus room for a second drive on the cage (HP service guide); slim optical bay",src:["z1","z1MSG","z1cfg"]},
  cpu:{st:"cond",max:"Intel Core Ultra 9 285",note:"Socketed and replaceable (HP service procedure). HP-supported processors: Core Ultra 9 285, Core Ultra 7 265, Core Ultra 5 245/235/225. Use only HP-listed processors; check cooling for higher-power parts."},
  gpu:{st:"cond",max:"Per PSU — HP lists RTX A400/A1000, GeForce RTX 3050/4060/4070(S), Arc A380, Radeon RX 6300",note:"Graphics card is a PCIe card (1 × PCIe 5.0 x16 + 1 × PCIe 4.0 x16 wired x4). Upgrade is limited by the installed PSU (280 W, 400 W or 500 W) and HP-qualified cards."},
  psu:{note:"HP PSU options: 280 W, 400 W, 500 W.",src:["z1MSG"]},
  expansion:"2 × PCIe 3.0 x1, 1 × PCIe 5.0 x16, 1 × PCIe 4.0 x16 (x4 wired)",
  wlanNote:"M.2 WLAN module, one screw (HP options: Intel BE200 Wi-Fi 7, Realtek RTL8852CE Wi-Fi 6E).",
  gaps:["HP doesn't state memory speed with 4 DIMMs.","“Up to 10 TB” is HP's wording; the split between M.2 and HDD isn't stated."]},
 "HP Z2 Tower G1i":{kind:"tower",
  mem:{type:"DDR5-5600 UDIMM (non-ECC or ECC); DDR5-6400 CUDIMM options",slots:4,soldered:false,familyMax:256,skuMax:256,configs:"8, 16, 32, 48 GB UDIMM (ECC and non-ECC); 64 GB DDR5-6400 CUDIMM. HP options up to 4 × 48 GB (192 GB) UDIMM or 4 × 64 GB (256 GB) CUDIMM",
   notes:["Tool-less access with room to expand — graphics, memory, storage and PCIe cards can be upgraded as needs evolve.","Two DIMMs per channel must be symmetric; don't mix speeds or ranks in a channel.","Installed modules are non-ECC (NECC) — moving to ECC means replacing all modules.","256 GB uses DDR5-6400 CUDIMMs; 192 GB is the maximum with standard UDIMMs.","HP doesn't state the speed with four DIMMs — confirm if speed matters."],src:["damZ2","z2t","z2tMSG","z2tcfg"]},
  ssd:{slots:3,slotsVerified:true,slotsNote:"3 × M.2 NVMe (HP: “12TB with 3x NVMe”)",iface:"PCIe Gen4/Gen5 ×4 NVMe",form:"M.2 2280",familyMax:"36 TB total (12 TB NVMe + 24 TB HDD)",skuMax:"36 TB total",second:true,raid:"offered by HP (configure at purchase or confirm for field setup)",
   bays:"2 × 3.5\" HDD (HP: “24TB with 2x HDD”), slim ODD bay, external 5.25\" bay",src:["z2t","z2tMSG","z2tcfg"]},
  cpu:{st:"cond",max:"Intel Core Ultra 9 285K",note:"Socketed and replaceable (HP service procedure). HP-supported: Core Ultra 9 285/285K, Core Ultra 7 265/265K, Core Ultra 5 245/245K/235/225. K-series at 250 W sustained needs the 1200 W PSU, a 450 W+ GPU and the matching heat sink (65/90/125 W options)."},
  gpu:{st:"cond",max:"Up to 600 W triple-wide (e.g. RTX PRO 6000 Blackwell) — needs the 1200 W PSU",note:"PCIe graphics card, replaceable. The installed PSU limits the card: HP offers 500 W, 700 W and 1200 W PSUs. Large GPUs need the PSU upgrade first."},
  psu:{note:"HP PSU options: 500 W, 700 W, 1200 W.",src:["z2t","z2tcfg","z2tMSG"]},
  expansion:"PCIe slots for graphics and add-in cards (Thunderbolt 5, 10/25 GbE NICs listed by HP)",
  wlanNote:"Replaceable WLAN module (HP options: Intel AX211 Wi-Fi 6E, Intel BE200 Wi-Fi 7).",
  gaps:["HP doesn't state memory speed with 4 DIMMs or the GPU wattage allowed on the 500 W PSU."]},
 "HP Z2 Mini G1a":{kind:"mini",
  mem:{type:"LPDDR5x-8000 unified memory, onboard",slots:0,soldered:true,familyMax:128,skuMax:null,configs:"16, 32, 64 or 128 GB — bundled with the processor at purchase",
   notes:["HP sells the system board with processor and memory as one part.","Up to 96 GB can be assigned to the GPU (128 GB models)."],src:["z2mMSG","z2mcfg","z2m"]},
  ssd:{slots:2,slotsVerified:true,slotsNote:"Dual NVMe (HP offers a 2nd M.2 SSD)",iface:"PCIe Gen4 ×4 NVMe",form:"M.2 2280",familyMax:"8 TB (2 × 4 TB)",skuMax:"8 TB (2 × 4 TB)",second:true,raid:"RAID 0 or RAID 1 (two SSDs)",src:["z2m","z2mcfg","z2mMSG"]},
  cpu:{st:"no",max:"—",note:"HP: “System board (includes integrated processor and system memory)” — not upgradeable."},
  gpu:{st:"no",max:"—",note:"Integrated AMD Radeon graphics are part of the processor; there is no PCIe graphics slot."},
  psu:{note:"Internal 300 W PSU.",src:["z2m","z2mMSG"]},
  expansion:"2 × Flex I/O positions (USB-C, 2.5/10 GbE, fiber NIC, serial options)",
  wlanNote:"Removable WLAN module in a socket on the system board (HP option: MediaTek MT7925 Wi-Fi 7).",
  gaps:["This SKU's price-list component list shows no WLAN module — confirm whether one is fitted."]}
};
var UPG_STATUS={up:["Upgradeable","t-ok"],no:["Not upgradeable","t-bad"],cond:["Conditional","t-warn"],ver:["Needs verification","t-mute"],max:["At maximum","t-info"]};
function upgStatus(k){var s=UPG_STATUS[k]||UPG_STATUS.ver;return '<span class="tag '+s[1]+' upg-st">'+esc(s[0])+'</span>';}
function upgSkus(){return allProducts().filter(function(p){return p.cat!=="tc"&&UPG_SERIES[p.family];}).sort(familySort);}
function compLine(p,re){return (p.components||[]).filter(function(c){return re.test(c.desc||"");});}
/* installed memory from SKU data: specs.memoryConfig, else component line "RAM 32GB (1x32GB)" */
function upgMemInstalled(p){var s=p.specs||{},cfg=String(s.memoryConfig||""),m=/(\d+)\s*[×x]\s*(\d+)\s*GB/i.exec(cfg);
  if(!m){var c=compLine(p,/^RAM /i)[0];if(c){var mm=/\((\d+)x(\d+)GB\)/i.exec(c.desc);if(mm)m=mm;else{var t=/RAM (\d+)GB/i.exec(c.desc);if(t)return {total:+t[1],n:null,size:null,src:"pl"};}}}
  var total=ramGB(p)||null;if(m){var n=+m[1],sz=+m[2];if(n*sz!==total&&total&&String(sz).length>2)sz=Math.round(total/n);return {total:n*sz,n:n,size:sz};}
  return {total:total,n:null,size:null};}
function upgSsdInstalled(p){var lines=compLine(p,/^SSD /i);var caps=lines.map(function(c){var m=/(\d+)\s*(TB|T|GB)\b/i.exec(c.desc);return m?(/^T/i.test(m[2])?+m[1]*1000:+m[1]):null;}).filter(Boolean);
  if(!caps.length){var s=storageGB(p);if(s)caps=[s];}var sp=String((p.specs||{}).storage||"");if(lines.length<2&&/\+/.test(sp))caps=sp.split("+").map(function(x){var m=/(\d+)\s*(TB|GB)/i.exec(x);return m?(/TB/i.test(m[2])?+m[1]*1000:+m[1]):null;}).filter(Boolean);
  return {n:caps.length,caps:caps,total:caps.reduce(function(a,b){return a+b;},0)};}
function gbTxt(g){return g>=1000?(g/1000)+" TB":g+" GB";}
function upgWlan(p,S){var c=compLine(p,/^WLAN /i)[0];var spec=(p.specs||{}).wifi||"";
  if(S.wlanFixed)return {inst:spec||(c?c.desc.replace(/^WLAN\s+/,""):"")||"MediaTek MT7925 Wi-Fi 7",st:S.wlanFixed.st,note:S.wlanFixed.note+(c&&/SD\d{4}/.test(c.desc)?" Price-list part shows a solder-down (SD1418) module.":"")};
  if(!c&&((p.components||[]).length||!spec))return S.wlanNote?{inst:"Not fitted — M.2 2230 WLAN slot free",st:"cond",note:S.wlanNote+" Add an HP-qualified module; confirm part availability with HP."}:{inst:"No WLAN module in this SKU’s factory configuration",st:"ver",note:"Confirm with HP whether a WLAN module can be added."};
  var d=c?c.desc:"";
  if(/\b1216\b/.test(d))return {inst:spec||d.replace(/^WLAN\s+/,""),st:"no",note:"Price-list part code shows an M.2 1216 solder-down module — the wireless card is soldered to the system board."};
  if(/\b2230\b/.test(d))return {inst:spec||d.replace(/^WLAN\s+/,""),st:"cond",note:"M.2 2230 wireless card (per the price-list part code). Replaceable with HP-qualified modules only (BIOS whitelist and regional approvals apply)."};
  return {inst:spec||d.replace(/^WLAN\s+/,""),st:S.wlanNote?"cond":"ver",note:S.wlanNote?S.wlanNote+" Use HP-qualified modules only.":"Module type not documented — needs verification."};}
/* build all rows for one SKU */
function upgReport(p){var S=UPG_SERIES[p.family];if(!S)return null;var s=p.specs||{};var M=S.mem,D=S.ssd;var mi=upgMemInstalled(p),si=upgSsdInstalled(p);var rows=[],paths=[],limits=[],gaps=(S.gaps||[]).slice();
  // ---- RAM
  var used=mi.n,free=M.slots&&used!=null?M.slots-used:null;var memInst=(mi.total?mi.total+" GB":"—")+(mi.n?" ("+mi.n+" × "+mi.size+" GB)":"")+" "+(M.soldered?"LPDDR5x onboard":String(s.memory||"").replace(/^\d+\s*GB\s*/,""));
  var memSt,memMax,memNote;
  if(M.soldered){memSt="no";memMax="This SKU: "+(mi.total||"—")+" GB (fixed) · Family: up to "+M.familyMax+" GB";memNote="Memory is soldered to the system board. Choose the capacity at purchase — a different capacity means a different SKU.";
    }
  else{var atMax=mi.total>=M.skuMax;memSt=atMax?"max":"up";memMax="This SKU: "+M.skuMax+" GB · Family: "+M.familyMax+" GB";
    if(used==null){memSt="ver";gaps.push("Installed DIMM layout not listed for this SKU.");}
    memNote=(free!=null?used+" of "+M.slots+" slots used, "+free+" free. ":"")+(atMax?"Already at the maximum HP supports.":"");
    // upgrade path
    if(!atMax&&used!=null){var steps=[];
      if(M.slots===2){
        if(free>0){var add=Math.min(mi.size,M.skuMax-mi.total);steps.push("Add 1 × "+mi.size+" GB "+(M.type.split(",")[0])+" in the free slot → "+(mi.total+mi.size)+" GB, dual-channel (match size and speed).");}
        var after=mi.total+(free>0?mi.size:0);
        if(M.cond128&&M.skuMax===128){if(after<64)steps.push("For 64 GB: 2 × 32 GB DDR5-5600 SODIMM (replace the installed module"+(used>1?"s":"")+").");steps.push("For 128 GB: 2 × 64 GB DDR5-6400 CSODIMM (replace both) — conditional, see note.");if(mi.total>=64)memSt="cond";}
        else if(after<M.skuMax)steps.push("For "+M.skuMax+" GB: 2 × "+(M.skuMax/2)+" GB (replace the installed module"+(used>1?"s":"")+").");}
      else if(M.slots===4){var cur=mi.total;
        if(free>0&&mi.n){steps.push("Add "+mi.n+" × "+mi.size+" GB matching module"+(mi.n>1?"s":"")+" → "+(cur*2)+" GB"+(mi.n===1?" (dual-channel)":"")+(cur*2>M.skuMax?" (exceeds max — not valid)":"")+".");
          if(mi.n===1&&free>=3)steps.push("Or fill all four: add 3 × "+mi.size+" GB → "+(mi.size*4)+" GB (two DIMMs per channel must be symmetric).");}
        if(p.family==="HP Z2 Tower G1i"){steps.push("192 GB: 4 × 48 GB DDR5-5600 UDIMM (replace all).");steps.push("256 GB: 4 × 64 GB DDR5-6400 CUDIMM (HP option; replace all).");steps.push("ECC: replace all modules with HP ECC UDIMMs — don't mix ECC and non-ECC.");}
        else if(cur<M.skuMax&&!(mi.n===1&&mi.size*4>=M.skuMax)&&!(mi.n===2&&mi.size*4>=M.skuMax))steps.push(M.skuMax+" GB: 4 × "+(M.skuMax/4)+" GB DDR5-5600 UDIMM (replace all).");}
      steps.forEach(function(x){paths.push("RAM: "+x);});}
    if(atMax)paths.push("RAM: already at "+mi.total+" GB, the most HP supports for this model.");}
  if(M.familyNote)limits.push(M.familyNote);if(M.cond128&&!M.soldered&&mi.total<128)limits.push(M.cond128);if(!M.soldered)(M.notes||[]).forEach(function(n){limits.push(n);});
  rows.push({c:"Memory (RAM)",inst:memInst.trim(),st:memSt,max:memMax,note:memNote+" "+(M.soldered?"":"Type: "+M.type+". Supported: "+M.configs+"."),src:M.src});
  // ---- SSD
  var ssdFree=D.slots!=null?D.slots-si.n:null;var ssdSt="up";var ssdNote=[];
  if(D.second&&ssdFree>0){ssdNote.push(si.n+" of "+D.slots+" M.2 slots used — add "+(ssdFree>1?"up to "+ssdFree+" more SSDs":"a second SSD")+" or replace.");paths.push("Storage: add an "+D.form+" "+D.iface+" SSD in the free slot"+(ssdFree>1?" (up to "+ssdFree+" more)":"")+"."+(D.raid?" RAID: "+D.raid+".":""));}
  else if(D.second&&ssdFree===0){ssdNote.push("All "+D.slots+" M.2 slots used — replace a drive with a larger one.");paths.push("Storage: replace an installed SSD with a larger "+D.form+" "+D.iface+" drive.");}
  else{ssdNote.push("Single M.2 SSD — replace the existing drive (no second SSD). "+(D.slotsVerified?"":"("+D.slotsNote+".)"));paths.push("Storage: replace the "+gbTxt(si.total||storageGB(p)||0)+" SSD with a larger "+D.form+" "+D.iface+" drive, up to "+D.skuMax+". Clone or reinstall the OS.");}
  if(D.restrict)limits.push(D.restrict);if(D.bays){ssdNote.push("Drive bays: "+D.bays+".");}
  if(!D.slotsVerified)ssdSt="up";
  rows.push({c:"Storage (SSD)",inst:(si.n?si.caps.map(gbTxt).join(" + "):gbTxt(storageGB(p)||0))+" "+D.form+" "+D.iface+(D.slots?" · "+si.n+" of "+D.slots+" slot"+(D.slots>1?"s":"")+" used":""),st:ssdSt,max:"This SKU: "+D.skuMax+" · Family: "+D.familyMax,note:ssdNote.join(" ")+(D.raid?" RAID: "+D.raid+".":""),src:D.src});
  // ---- GPU
  var gpuInst=[s.graphics,s.vram&&!/shared/i.test(s.vram)?s.vram:""].filter(Boolean).join(", ")||"—";
  var G=S.gpu;if(S.kind==="laptop"&&!dedicated(p)&&G===UPG_LAPTOP_DGPU)G={st:"no",max:"—",note:"Integrated graphics are part of the processor — not upgradeable. A discrete GPU is only available as a different factory configuration."};
  rows.push({c:"Graphics (GPU)",inst:gpuInst,st:G.st,max:G.max,note:G.note});
  // ---- CPU
  rows.push({c:"Processor (CPU)",inst:s.processor||"—",st:S.cpu.st,max:S.cpu.max,note:S.cpu.note});
  // ---- others
  var w=upgWlan(p,S);rows.push({c:"Wireless card",inst:w.inst,st:w.st,max:"—",note:w.note});
  if(S.kind==="laptop"){
    rows.push({c:"Battery",inst:s.battery||"—",st:"no",max:S.battery.max,note:S.battery.note,src:S.battery.src});
    rows.push({c:"Display",inst:[s.screen,s.display].filter(Boolean).join(" ")||"—",st:S.display.st,max:"—",note:S.display.note});
    rows.push({c:"Keyboard",inst:s.keyboard||"—",st:S.keyboard?S.keyboard.st:"ver",max:"—",note:S.keyboard?S.keyboard.note:"Keyboard serviceability isn't documented by HP for this model yet — replacement-only assumed, not an upgrade."});}
  else{
    rows.push({c:"Power supply",inst:s.psu||((compLine(p,/^P\/S /i)[0]||{}).desc||"—"),st:S.kind==="mini"?"no":"cond",max:S.kind==="mini"?"300 W internal":(p.family==="HP Z2 Tower G1i"?"1200 W":"500 W"),note:S.psu.note+(S.kind==="mini"?" Fixed internal PSU.":" Upgrade the PSU before adding a higher-power GPU or CPU; HP-qualified PSUs only."),src:S.psu.src});
    rows.push({c:"Expansion",inst:S.kind==="mini"?"Flex I/O":"PCIe slots",st:S.kind==="mini"?"cond":"up",max:"—",note:S.expansion+"."});}
  var shown=rows.filter(function(r){return r.st==="up"||r.st==="cond"||r.st==="max";});
  return {p:p,S:S,rows:rows,shown:shown,paths:paths,limits:limits,gaps:gaps,mem:mi,ssd:si};}
function upgGapsAll(){return upgSkus().map(function(p){var r=upgReport(p);var g=r.gaps.slice();var d=typeof hpDetails==="function"?hpDetails(p):null;
  if(d&&!d.exact)g.push("Item details (ports, size, etc.) come from the same-series HP page for "+d.srcSku+"; display, battery and wireless come from this SKU’s price-list data.");if(d&&!d.weight)g.push("HP doesn’t list a weight for this configuration.");return {p:p,g:uniq(g)};}).filter(function(x){return x.g.length;});}
