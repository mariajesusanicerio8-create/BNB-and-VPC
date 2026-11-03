/* ============================== promos & news (replaces Resources) ============================== */
var NEWS_KINDS=[["promo","Promotion"],["upcoming","Coming soon"],["new","New model"],["price","Price update"],["news","News"],["advisory","Sales advisory"],["discontinued","Discontinued"]];
function newsKind(k){var x=NEWS_KINDS.find(function(n){return n[0]===k;});return x?x[1]:"News";}
/* live or upcoming promos that list this SKU (drives the promo tags on cards and product pages) */
function promoTagsOf(p){if(!p||!A.announcements)return [];return A.announcements.filter(function(a){return a.kind==="promo"&&newsState(a)!=="past"&&(a.skus||[]).some(function(s){return normSku(s)===normSku(p.sku);});});}
function promoTagsHtml(p,sm){return promoTagsOf(p).map(function(a){var soon=newsState(a)==="soon";return '<button class="tag t-promo'+(soon?" is-soon":"")+'" data-go="news" title="'+esc(a.title+(soon?" (starts "+fmtDate(a.starts)+")":""))+'">'+ICON.megaphone+esc(a.tag||(sm?"Promo":a.title))+'</button>';}).join("");}
function newsState(a){var t=today();if(a.expires&&a.expires<t)return "past";if(a.starts&&a.starts>t)return "soon";return "live";}
function newsList(which){var order={promo:0,upcoming:1,new:2,price:3,news:4,advisory:5,discontinued:6};
  return A.announcements.filter(function(a){var s=newsState(a);return which==="past"?s==="past":s!=="past";})
    .sort(function(a,b){if(a.pinned!==b.pinned)return a.pinned?-1:1;var sa=newsState(a),sb=newsState(b);if(sa!==sb)return sa==="live"?-1:1;return (order[a.kind]==null?9:order[a.kind])-(order[b.kind]==null?9:order[b.kind])||(b.at||"").localeCompare(a.at||"");});}
function newsWhen(a){var s=newsState(a),t=today();
  if(s==="soon")return "Starts "+fmtDate(a.starts)+(a.expires?" · until "+fmtDate(a.expires):"");
  if(s==="past")return "Ended "+fmtDate(a.expires);
  if(a.expires){var d=daysBetween(t,a.expires);return d===0?"Ends today":d<=7?"Ends in "+d+" day"+(d===1?"":"s")+" · "+fmtDate(a.expires):"Until "+fmtDate(a.expires);}
  return "Posted "+fmtDate((a.at||"").slice(0,10));}
function newsCard(a,compact){var ps=(a.skus||[]).map(bySku).filter(Boolean);var s=newsState(a);
  var urgent=s==="live"&&a.expires&&daysBetween(today(),a.expires)<=7;
  return '<article class="news k-'+esc(a.kind||"news")+(s!=="live"?" is-"+s:"")+'">'+
    '<div class="news-top"><span class="news-kind">'+esc(s==="soon"&&a.kind!=="upcoming"?"Coming soon · "+newsKind(a.kind):newsKind(a.kind))+'</span>'+(a.pinned?'<span class="news-pin">Pinned</span>':'')+'</div>'+
    newsPoster(a,compact)+
    '<h3>'+esc(a.title)+'</h3>'+(a.body?'<p>'+esc(compact&&a.body.length>150?a.body.slice(0,147)+"…":a.body)+'</p>':'')+
    (ps.length?'<div class="news-skus">'+ps.slice(0,compact?3:12).map(function(p){var sp=sellPrice(p.id);return '<button data-open="'+p.id+'" title="'+esc(p.name)+'"><span class="sku">'+esc(p.sku)+'</span>'+(sp?'<b>'+peso(sp.amount)+'</b>':'')+'</button>';}).join("")+(compact&&ps.length>3?'<span class="small muted">+'+(ps.length-3)+' more</span>':'')+(!compact&&ps.length>12?'<button class="btn btn-quiet btn-sm" data-act="news-all" data-id="'+a._id+'">See all '+ps.length+' models</button>':'')+'</div>':'')+
    ((a.images||[]).length?'<div class="news-dl"><button class="btn btn-sm btn-primary" data-act="news-pdf" data-id="'+a._id+'">'+ICON.dl+'Download PDF</button><button class="btn btn-sm" data-act="news-jpg" data-id="'+a._id+'">'+ICON.dl+'JPEG'+(a.images.length>1?" ("+a.images.length+")":"")+'</button></div>':'')+
    '<div class="news-f"><span class="'+(urgent?"news-urgent":"")+'">'+esc(newsWhen(a))+'</span>'+(A.isAdmin&&!compact?'<span class="btn-row"><button class="btn btn-sm" data-act="news-edit" data-id="'+a._id+'">Edit</button><button class="btn btn-sm btn-danger" data-delann="'+a._id+'">Delete</button></span>':'')+'</div></article>';}
/* tile shown under the banner on Products (everyone) and on the admin dashboard */
function newsTile(){var list=newsList("current");
  if(!list.length&&!A.isAdmin)return "";
  return '<section class="news-tile" aria-label="Promotions and news"><div class="news-tile-h"><span class="nt-ic">'+ICON.megaphone+'</span><div><h2>Promos &amp; news</h2><span class="small muted">'+(list.length?list.length+" current item"+(list.length===1?"":"s"):"Nothing posted yet")+'</span></div><span class="btn-row" style="margin-left:auto">'+(A.isAdmin?'<button class="btn btn-sm" data-act="news-new">'+ICON.plus+'Post</button>':'')+(list.length?'<button class="btn btn-sm btn-quiet" data-go="news">See all</button>':'')+'</span></div>'+
    (list.length?'<div class="news-row">'+list.slice(0,4).map(function(a){return newsCard(a,true);}).join("")+'</div>':'<div class="empty" style="padding:6px 2px 2px">Post a promotion, a model that’s coming soon or a price update. It shows here for the whole team.</div>')+'</section>';}
function viewNews(){var cur=newsList("current"),past=newsList("past");var F=A.newsF||"all";
  var kinds=uniq(cur.map(function(a){return a.kind||"news";}));
  var shown=cur.filter(function(a){return F==="all"||(a.kind||"news")===F||(F==="soon"&&newsState(a)==="soon");});
  var lastPost=A.announcements.map(function(a){return a.editedAt||a.at||"";}).sort().pop();
  return banner({compact:true,updated:lastPost?'Last post <b>'+esc(fmtUpdate(lastPost))+'</b>':false,title:"Promos &amp; news",sub:"Approved promotions, models coming soon, price updates and announcements for the sales team.",
      chips:[[cur.filter(function(a){return a.kind==="promo"&&newsState(a)==="live";}).length,"live promos"],[cur.filter(function(a){return newsState(a)==="soon"||a.kind==="upcoming";}).length,"coming soon"],[cur.length,"current items"]],
      actions:A.isAdmin?'<button class="btn btn-hero" data-act="news-new">'+ICON.plus+'Post promo or news</button>':''})+
    (cur.length?'<div class="seg" role="tablist" aria-label="Type">'+[["all","All"]].concat(kinds.map(function(k){return [k,newsKind(k)];})).map(function(k){var n=k[0]==="all"?cur.length:cur.filter(function(a){return (a.kind||"news")===k[0];}).length;return '<button role="tab" data-act="news-f" data-k="'+k[0]+'" aria-selected="'+(F===k[0])+'">'+esc(k[1])+'<span>'+n+'</span></button>';}).join("")+'</div>':'')+
    (shown.length?'<div class="news-grid">'+shown.map(function(a){return newsCard(a,false);}).join("")+'</div>':'<div class="panel empty">'+(A.isAdmin?'Nothing posted yet. Use “Post promo or news” to add a promotion, an upcoming model or a price update.':'No promotions or news right now. Check back soon.')+'</div>')+
    (A.isAdmin&&past.length?'<details class="panel panel-b"><summary class="small" style="cursor:pointer"><b>Ended ('+past.length+')</b> — visible to admins only</summary><div class="news-grid" style="margin-top:12px">'+past.map(function(a){return newsCard(a,false);}).join("")+'</div></details>':'');}
function newsEditor(id){if(!A.isAdmin)return;var a=id?A.announcements.find(function(x){return x._id===id;}):null;a=a||{kind:"promo"};
  modal({title:id?"Edit post":"Post promo or news",body:'<div class="form-grid">'+
    '<div class="field"><label for="nw-kind">Type</label><select id="nw-kind">'+NEWS_KINDS.map(function(k){return '<option value="'+k[0]+'"'+(a.kind===k[0]?" selected":"")+'>'+k[1]+'</option>';}).join("")+'</select></div>'+
    '<div class="field"><label class="chk" style="margin-top:24px"><input type="checkbox" id="nw-pin"'+(a.pinned?" checked":"")+'> Pin to the top</label></div>'+
    '<div class="field" style="grid-column:1/-1"><label for="nw-title">Headline</label><input id="nw-title" value="'+esc(a.title||"")+'" placeholder="e.g. Free 3-year onsite upgrade on ZBook X G2i"></div>'+
    '<div class="field" style="grid-column:1/-1"><label for="nw-body">Details</label><textarea id="nw-body" rows="4" placeholder="Mechanics, eligible models, conditions, who to contact">'+esc(a.body||"")+'</textarea></div>'+
    '<div class="field"><label for="nw-tag">Short tag on product cards (optional)</label><input id="nw-tag" maxlength="24" value="'+esc(a.tag||"")+'" placeholder="e.g. Smart Buy"></div><div class="field"></div>'+
    '<div class="field"><label for="nw-start">Starts (optional)</label><input id="nw-start" type="date" value="'+esc(a.starts||"")+'"></div>'+
    '<div class="field"><label for="nw-exp">Show until (optional)</label><input id="nw-exp" type="date" value="'+esc(a.expires||"")+'"></div>'+
    '<div class="field" style="grid-column:1/-1"><label for="nw-img">Poster images (JPEG or PNG, optional)</label><input id="nw-img" type="file" accept="image/jpeg,image/png" multiple><span class="hint">Shown on the post for the team to share with dealers. Sales can download them as a PDF (one page per image) or as JPEG.</span>'+
      ((a.images||[]).length?'<div class="nw-imgs">'+a.images.map(function(im,i){return '<label class="nw-im"><img src="/_blob/'+esc(im.id)+'" alt=""><span><input type="checkbox" data-keepimg="'+i+'" checked> Keep</span></label>';}).join("")+'</div>':'')+'</div>'+
    '<div class="field" style="grid-column:1/-1"><label for="nw-skus">Related SKUs (optional)</label><input id="nw-skus" value="'+esc((a.skus||[]).join(", "))+'" placeholder="Comma-separated, e.g. DR1N2PT, CJ9S1PT"></div></div>'+
    '<p class="small muted">Everyone with access sees current posts on the Products page and in Promos &amp; news. A post with a future start date shows as “Coming soon”; after its end date it moves to Ended, which only admins see.</p>',
    actions:[["Cancel","close"],[id?"Save":"Post","save","btn-primary"]],onAction:function(act,w,b){if(act!=="save")return;
      var title=$("#nw-title").value.trim();if(!title){toast("Add a headline",true);return;}
      var raw=$("#nw-skus").value.split(/[,\s]+/).map(normSku).filter(Boolean);var bad=raw.filter(function(s){return !bySku(s);});
      if(bad.length){toast("Not recognized: "+bad.join(", "),true);return;}
      var st=$("#nw-start").value||null,ex=$("#nw-exp").value||null;if(st&&ex&&ex<st){toast("The end date is before the start date",true);return;}
      var doc={kind:$("#nw-kind").value,title:title,body:$("#nw-body").value.trim(),starts:st,expires:ex,skus:raw.map(function(s){return bySku(s).sku;}),pinned:$("#nw-pin").checked,tag:($("#nw-tag").value||"").trim()||null,at:a.at||nowISO(),byName:a.byName||actorName()};
      if(id){doc.editedAt=nowISO();doc.editedBy=actorName();}
      var keep=(a.images||[]).filter(function(im,i){var c=w.querySelector('[data-keepimg="'+i+'"]');return !c||c.checked;});
      var removed=(a.images||[]).filter(function(im){return keep.indexOf(im)<0;});
      var files=Array.prototype.slice.call($("#nw-img").files||[]);
      if(files.some(function(f){return !/^image\/(jpeg|png)$/.test(f.type);})){toast("Use JPEG or PNG images",true);return;}
      if(files.length&&!A.assets){toast("Uploading isn’t available in this view",true);return;}
      b.disabled=true;b.textContent=files.length?"Uploading…":"Saving…";
      files.reduce(function(pr,f){return pr.then(function(){return posterJpeg(f).then(function(j){return A.assets.upload(j.blob,{type:"image/jpeg"}).then(function(res){keep.push({id:res.id,w:j.w,h:j.h,name:f.name.replace(/\.[^.]+$/,"")});});});});},Promise.resolve()).then(function(){
      doc.images=keep;
      return (id?A.db.doc("announcements/"+id).set(doc):A.db.collection("announcements").add(doc)).then(function(){audit(id?"announcement.update":"announcement.create",title);closeModal();toast(id?"Post updated":"Posted for the team");removed.forEach(function(im){if(A.assets)A.assets.delete(im.id).catch(function(){});});});}).catch(function(e){b.disabled=false;b.textContent=id?"Save":"Post";if(e&&e.code==="too_large")toast("An image is over the upload limit (20 MB)",true);else writeErr(e);});}});}
/* keep the original JPEG when it is already RGB and a sensible size; otherwise re-encode */
function posterJpeg(file){return createImageBitmap(file).then(function(bmp){var w=bmp.width,h=bmp.height;
  var reencode=function(){var sc=Math.min(1,4000/Math.max(w,h));var c=document.createElement("canvas");c.width=Math.round(w*sc);c.height=Math.round(h*sc);var x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);x.drawImage(bmp,0,0,c.width,c.height);
    return new Promise(function(r){c.toBlob(function(bl){r({blob:bl,w:c.width,h:c.height});},"image/jpeg",0.92);});};
  if(file.type!=="image/jpeg"||Math.max(w,h)>6000||file.size>15e6)return reencode();
  return file.arrayBuffer().then(function(buf){var info=jpegInfo(new Uint8Array(buf));if(!info||info.c===4)return reencode();return {blob:file,w:w,h:h};});});}
function newsPoster(a,compact){var im=(a.images||[]);if(!im.length)return "";
  return '<div class="news-img'+(compact?" sm":"")+'"><button data-zoom="/_blob/'+esc(im[0].id)+'" aria-label="Enlarge poster"><img src="/_blob/'+esc(im[0].id)+'" alt="'+esc(a.title)+'" loading="lazy"></button>'+(im.length>1?'<span class="news-more">+'+(im.length-1)+'</span>':'')+
    (!compact&&im.length>1?'<div class="news-thumbs">'+im.slice(1).map(function(x){return '<button data-zoom="/_blob/'+esc(x.id)+'" aria-label="Enlarge image"><img src="/_blob/'+esc(x.id)+'" alt="" loading="lazy"></button>';}).join("")+'</div>':'')+'</div>';}
function newsFileBase(a){return (S("companyName").replace(/\s*Inc\.?$/,"")+" "+(a.title||"Promo")).replace(/[\\/:*?"<>|#]+/g," ").replace(/\s+/g," ").trim().slice(0,90);}
function posterPdf(a){return Promise.all((a.images||[]).map(function(im){return loadJpeg(im.id);})).then(function(imgs){
  var d=new PDF();imgs.forEach(function(img,i){var W=img.w>=img.h?841.89:595.28,H=W*img.h/img.w;if(i===0){d.W=W;d.H=H;d.p.W=W;d.p.H=H;}else d.addPage(W,H);d.image(img.bin,img.w,img.h,img.c,0,0,W,H);});return d.output();});}
function newsDownload(id,kind){var a=A.announcements.find(function(x){return x._id===id;});if(!a||!(a.images||[]).length)return;var base=newsFileBase(a);
  if(kind==="pdf"){toast("Preparing PDF…");posterPdf(a).then(function(bl){if(typeof logEvent==="function")logEvent("promo_pdf");return saveFile(base+".pdf",bl);}).catch(function(e){console.error(e);toast("Couldn’t build the PDF",true);});return;}
  a.images.reduce(function(pr,im,i){return pr.then(function(){return fetch("/_blob/"+im.id).then(function(r){if(!r.ok)throw new Error("image "+r.status);return r.blob();}).then(function(bl){return saveFile(base+(a.images.length>1?" "+(i+1):"")+".jpg",new Blob([bl],{type:"image/jpeg"}));});});},Promise.resolve()).catch(function(){toast("Couldn’t download the image",true);});}
