/* Signature placement v2. UI and styles are injected; index.html is unchanged. */
const signatureOverlay=document.getElementById('signatureOverlay');
const sigDropZone=document.getElementById('sigDropZone');
const sigFileInput=document.getElementById('sigFileInput');
const sigContent=document.getElementById('sigContent');
const sigCanvas=document.getElementById('sigCanvas');
const sigStatus=document.getElementById('sigStatus');
const sigPlaceBtn=document.getElementById('sigPlaceBtn');
let sigPdfBytes=null,sigPdfDoc=null,sigTotalPages=0,sigCurrentPage=0;
let sigScale=1.5,sigMode='draw',sigColor='#1e293b',sigImageDataUrl=null;
let sigFontFamily="'Brush Script MT', cursive",sigPlacedItems=[],sigPdfCanvas=null;
let sigSelected=null,sigViewport=null,sigTask=null,sigVersion=0,sigSaving=false,sigRendering=false,sigDrawing=false,sigLast=null;
const sigCopy={
 ru:['Добавить подпись на страницу','Скачать PDF','Нарисуйте, напечатайте или загрузите подпись, затем нажмите «Добавить». Подпись появится в центре видимой части страницы. Перетащите её; за нижний правый угол меняется размер.','Удалить выбранную','Загрузите PDF.','Создайте подпись.','Сначала добавьте подпись на страницу.','Подпись добавлена. Перетащите её в нужное место.','Готово. PDF передан на скачивание.','Страница','Это изображение подписи, не криптографическая цифровая подпись. Изменение PDF может нарушить существующие цифровые подписи.'],
 en:['Add signature to page','Download PDF','Draw, type or upload a signature, then press Add. It appears in the visible page area. Drag to position; resize using the bottom-right corner.','Delete selected','Load a PDF.','Create a signature.','Add a signature to the page first.','Signature added. Drag it into place.','Done. PDF sent to download.','Page','This is a signature image, not a cryptographic digital signature. Editing a PDF may invalidate existing digital signatures.'],
 lv:['Pievienot parakstu lappusei','Lejupielādēt PDF','Izveidojiet parakstu un nospiediet Pievienot. Velciet parakstu; izmēru maina apakšējais labais stūris.','Dzēst atlasīto','Ielādējiet PDF.','Izveidojiet parakstu.','Vispirms pievienojiet parakstu lappusei.','Paraksts pievienots. Velciet to vajadzīgajā vietā.','PDF nodots lejupielādei.','Lappuse','Tas ir paraksta attēls, nevis kriptogrāfisks digitālais paraksts. PDF izmaiņas var padarīt esošos digitālos parakstus nederīgus.'],
 de:['Unterschrift auf Seite hinzufügen','PDF herunterladen','Unterschrift erstellen und Hinzufügen drücken. Zum Platzieren ziehen; Größe an der unteren rechten Ecke ändern.','Auswahl löschen','PDF laden.','Unterschrift erstellen.','Zuerst eine Unterschrift auf der Seite hinzufügen.','Unterschrift hinzugefügt. An die gewünschte Stelle ziehen.','PDF zum Download übergeben.','Seite','Dies ist ein Unterschriftsbild, keine kryptografische digitale Signatur. PDF-Änderungen können bestehende digitale Signaturen ungültig machen.']
};
const sigWords=()=>sigCopy[document.documentElement.lang]||sigCopy.en;
const sigStyle=document.createElement('style');
sigStyle.textContent=`
#signatureOverlay .modal {max-width:980px!important;}
#sigCanvas {background:white;touch-action:none;max-width:100%;}
#sigWorkspace {margin-top:16px;}
#sigStage {position:relative;line-height:0;width:100%;background:white;}
#sigStage>canvas {display:block;width:100%;height:auto;background:white;}
#sigLayer {position:absolute;inset:0;pointer-events:none;}
.sig-object {position:absolute;pointer-events:auto;touch-action:none;cursor:move;box-sizing:border-box;outline:1px dashed #6554e8;}
.sig-object.selected {outline:2px solid #6554e8;}
.sig-object img {display:block;width:100%;height:100%;pointer-events:none;user-select:none;}
.sig-resize {position:absolute;right:-9px;bottom:-9px;width:20px;height:20px;border:2px solid white;border-radius:4px;background:#6554e8;cursor:nwse-resize;touch-action:none;}
.sig-placement-actions {display:flex;gap:8px;flex-wrap:wrap;margin:12px 0;align-items:center;}
.sig-placement-actions button {padding:10px 14px;border:1px solid var(--border,#bbb);border-radius:8px;background:var(--card,white);color:var(--text,#222);cursor:pointer;}
#sigHint,#sigWarning {font-size:13px;line-height:1.6;color:var(--muted,#666);margin:12px 0;}
#sigWorkspaceScroll {max-height:60vh;overflow:auto;border:1px solid var(--border,#bbb);border-radius:8px;background:#ddd;}
#sigDownload {margin-top:12px;}
#signatureOverlay button:disabled {opacity:.5;cursor:not-allowed;}
`;
document.head.append(sigStyle);
const sigWorkspace=document.createElement('div');sigWorkspace.id='sigWorkspace';sigWorkspace.hidden=true;
sigWorkspace.innerHTML='<p id="sigHint"></p><div class="sig-placement-actions"><button type="button" id="sigPrev">◀</button><span id="sigCounter"></span><button type="button" id="sigNext">▶</button><button type="button" id="sigDelete"></button></div><div id="sigWorkspaceScroll"><div id="sigStage"><canvas id="sigPageCanvas"></canvas><div id="sigLayer"></div></div></div><button type="button" class="btn" id="sigDownload"></button><p id="sigWarning"></p>';
sigContent.append(sigWorkspace);sigPdfCanvas=document.getElementById('sigPageCanvas');
const sigStage=document.getElementById('sigStage'),sigLayer=document.getElementById('sigLayer');
const sigScroll=document.getElementById('sigWorkspaceScroll');
function sigLabels(){const w=sigWords();sigPlaceBtn.removeAttribute('data-i18n');sigPlaceBtn.textContent='＋ '+w[0];document.getElementById('sigDownload').textContent='💾 '+w[1];document.getElementById('sigHint').textContent=w[2];document.getElementById('sigDelete').textContent=w[3];document.getElementById('sigWarning').textContent=w[10];}
function sigButtons(){sigPlaceBtn.disabled=!sigPdfDoc||sigSaving||sigRendering;document.getElementById('sigDownload').disabled=!sigPlacedItems.length||sigSaving||sigRendering;document.getElementById('sigDelete').disabled=!sigSelected||sigSaving;document.getElementById('sigPrev').disabled=sigSaving||sigRendering||sigCurrentPage===0;document.getElementById('sigNext').disabled=sigSaving||sigRendering||sigCurrentPage>=sigTotalPages-1;}
function sigMsg(message,type='info'){showStatus(sigStatus,message,type);}
function openSignature(){if(sigSaving)return;signatureOverlay.classList.add('active');sigLabels();sigButtons();if(!sigPdfDoc){sigContent.classList.add('hidden');sigDropZone.style.display='block';clearSigPad();updateSigPreview();}}
function closeSignature(){if(!sigSaving)signatureOverlay.classList.remove('active');}
signatureOverlay.addEventListener('click',e=>{if(e.target===signatureOverlay)closeSignature();});
sigDropZone.addEventListener('click',e=>{if(e.target!==sigFileInput)sigFileInput.click();});
sigDropZone.addEventListener('dragover',e=>{e.preventDefault();sigDropZone.classList.add('dragover');});
sigDropZone.addEventListener('dragleave',()=>sigDropZone.classList.remove('dragover'));
sigDropZone.addEventListener('drop',e=>{e.preventDefault();sigDropZone.classList.remove('dragover');const file=[...e.dataTransfer.files].find(f=>/\.pdf$/i.test(f.name));if(file)loadSigPdf(file);});
sigFileInput.addEventListener('change',e=>{const file=e.target.files[0];if(file)loadSigPdf(file);sigFileInput.value='';});
async function loadSigPdf(file){
 if(sigSaving||sigRendering)return;
 try{
  sigMsg(t('common.processing'));sigRendering=true;sigButtons();
  const bytes=new Uint8Array(await file.arrayBuffer());const doc=await pdfjsLib.getDocument({data:bytes.slice()}).promise;
  if(sigPdfDoc)await sigPdfDoc.destroy();sigPdfDoc=doc;sigPdfBytes=bytes;sigTotalPages=doc.numPages;sigCurrentPage=0;sigPlacedItems=[];sigSelected=null;
  sigContent.classList.remove('hidden');sigDropZone.style.display='none';sigWorkspace.hidden=false;sigRendering=false;
  await renderSigPage();sigMsg(sigWords()[2]);
 }catch(error){sigRendering=false;sigButtons();sigMsg(error.message,'err');}
}
async function renderSigPage(){
 if(!sigPdfDoc)return;
 const version=++sigVersion;sigTask?.cancel();sigRendering=true;sigButtons();sigLayer.replaceChildren();
 try{
  const page=await sigPdfDoc.getPage(sigCurrentPage+1);if(version!==sigVersion)return;
  sigViewport=page.getViewport({scale:sigScale});sigPdfCanvas.width=Math.ceil(sigViewport.width);sigPdfCanvas.height=Math.ceil(sigViewport.height);
  const ctx=sigPdfCanvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,sigPdfCanvas.width,sigPdfCanvas.height);
  sigTask=page.render({canvasContext:ctx,viewport:sigViewport});await sigTask.promise;if(version!==sigVersion)return;
  sigTask=null;sigScroll.scrollTop=0;sigObjects();document.getElementById('sigCounter').textContent=sigWords()[9]+' '+(sigCurrentPage+1)+' / '+sigTotalPages;
 }catch(error){if(error.name!=='RenderingCancelledException')sigMsg(error.message,'err');}
 finally{if(version===sigVersion){sigRendering=false;sigButtons();}}
}
function sigPosition(item,node){node.style.left=(item.x/sigViewport.width*100)+'%';node.style.top=(item.y/sigViewport.height*100)+'%';node.style.width=(item.w/sigViewport.width*100)+'%';node.style.height=(item.h/sigViewport.height*100)+'%';}
function sigObjects(){
 sigLayer.replaceChildren();
 for(const item of sigPlacedItems.filter(it=>it.page===sigCurrentPage)){
  const node=document.createElement('div');node.className='sig-object'+(sigSelected===item?' selected':'');node.tabIndex=0;node.setAttribute('role','group');node.setAttribute('aria-label',sigWords()[0]);
  const image=document.createElement('img');image.src=item.dataUrl;image.alt='';image.draggable=false;
  const handle=document.createElement('span');handle.className='sig-resize';handle.setAttribute('aria-label','Resize');node.append(image,handle);sigPosition(item,node);sigLayer.append(node);
  node.addEventListener('pointerdown',e=>{
   if(sigSaving||sigRendering)return;e.preventDefault();e.stopPropagation();sigSelected=item;sigLayer.querySelectorAll('.sig-object').forEach(n=>n.classList.toggle('selected',n===node));sigButtons();node.focus();
   const rect=sigStage.getBoundingClientRect();const start={cx:e.clientX,cy:e.clientY,x:item.x,y:item.y,w:item.w,h:item.h};const resizing=e.target===handle;
   node.setPointerCapture(e.pointerId);
   function move(ev){
    const dx=(ev.clientX-start.cx)*sigViewport.width/rect.width,dy=(ev.clientY-start.cy)*sigViewport.height/rect.height;
    if(resizing){const ratio=start.w/start.h;const desired=Math.max(start.w+dx,(start.h+dy)*ratio);item.w=Math.max(Math.min(24,sigViewport.width-item.x),Math.min(desired,sigViewport.width-item.x,(sigViewport.height-item.y)*ratio));item.h=item.w/ratio;}
    else{item.x=Math.max(0,Math.min(sigViewport.width-item.w,start.x+dx));item.y=Math.max(0,Math.min(sigViewport.height-item.h,start.y+dy));}
    sigPosition(item,node);
   }
   function end(){node.removeEventListener('pointermove',move);node.removeEventListener('pointerup',end);node.removeEventListener('pointercancel',end);}
   node.addEventListener('pointermove',move);node.addEventListener('pointerup',end);node.addEventListener('pointercancel',end);
  });
  node.addEventListener('keydown',e=>{
   if(sigSaving)return;const delta=e.shiftKey?10:1;let used=true;
   if(e.key==='Delete'||e.key==='Backspace'){sigPlacedItems=sigPlacedItems.filter(it=>it!==item);sigSelected=null;sigObjects();}
   else if(e.key==='ArrowLeft')item.x=Math.max(0,item.x-delta);
   else if(e.key==='ArrowRight')item.x=Math.min(sigViewport.width-item.w,item.x+delta);
   else if(e.key==='ArrowUp')item.y=Math.max(0,item.y-delta);
   else if(e.key==='ArrowDown')item.y=Math.min(sigViewport.height-item.h,item.y+delta);
   else used=false;
   if(used){e.preventDefault();e.stopPropagation();sigPosition(item,node);sigButtons();}
  });
 }
 sigButtons();
}
function sigImage(url){return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('Unable to load signature image'));image.src=url;});}
function sigCrop(canvas){
 const ctx=canvas.getContext('2d'),{width,height}=canvas;const pixels=ctx.getImageData(0,0,width,height).data;
 let left=width,top=height,right=-1,bottom=-1;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){if(pixels[(y*width+x)*4+3]>8){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}}
 if(right<0)throw new Error(sigWords()[5]);
 const out=document.createElement('canvas');out.width=right-left+9;out.height=bottom-top+9;out.getContext('2d').drawImage(canvas,left,top,right-left+1,bottom-top+1,4,4,right-left+1,bottom-top+1);return out;
}
async function sigSource(){
 if(sigMode==='draw')return sigCrop(sigCanvas);
 if(sigMode==='type'){
  const text=document.getElementById('sigTextInput').value.trim();if(!text)throw new Error(sigWords()[5]);
  await document.fonts.ready;const canvas=document.createElement('canvas');let ctx=canvas.getContext('2d');ctx.font='72px '+sigFontFamily;const metrics=ctx.measureText(text);canvas.width=Math.min(6000,Math.ceil(metrics.width+60));canvas.height=200;ctx=canvas.getContext('2d');ctx.font='72px '+sigFontFamily;ctx.fillStyle=sigColor;ctx.textBaseline='alphabetic';ctx.fillText(text,30,125);return sigCrop(canvas);
 }
 if(!sigImageDataUrl)throw new Error(sigWords()[5]);const image=await sigImage(sigImageDataUrl);const canvas=document.createElement('canvas');const factor=Math.min(1,2000/Math.max(image.width,image.height));canvas.width=Math.ceil(image.width*factor);canvas.height=Math.ceil(image.height*factor);canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);return sigCrop(canvas);
}
sigPlaceBtn.addEventListener('click',async()=>{
 if(!sigPdfDoc||sigRendering||sigSaving)return;
 sigPlaceBtn.disabled=true;
 try{
  const canvas=await sigSource();const ratio=canvas.width/canvas.height;
  const w=Math.min(sigViewport.width*.3,300,sigViewport.height*.25*ratio),h=w/ratio;
  const stageRect=sigStage.getBoundingClientRect(),scrollRect=sigScroll.getBoundingClientRect();
  const visibleTop=Math.max(stageRect.top,scrollRect.top),visibleBottom=Math.min(stageRect.bottom,scrollRect.bottom);
  const cy=visibleBottom>visibleTop?((visibleTop+visibleBottom)/2-stageRect.top)*sigViewport.height/stageRect.height:sigViewport.height/2;
  const item={page:sigCurrentPage,x:(sigViewport.width-w)/2,y:Math.max(0,Math.min(sigViewport.height-h,cy-h/2)),w,h,dataUrl:canvas.toDataURL('image/png')};
  sigPlacedItems.push(item);sigSelected=item;sigObjects();sigMsg(sigWords()[7],'ok');
  sigWorkspace.scrollIntoView({block:'nearest'});
  sigLayer.querySelector('.selected')?.scrollIntoView({block:'center',inline:'nearest'});
 }catch(error){sigMsg(error.message,'err');}finally{sigButtons();}
});
document.getElementById('sigDelete').onclick=()=>{if(sigSaving)return;sigPlacedItems=sigPlacedItems.filter(it=>it!==sigSelected);sigSelected=null;sigObjects();};
document.getElementById('sigPrev').onclick=()=>{if(sigCurrentPage>0&&!sigRendering&&!sigSaving){sigCurrentPage--;sigSelected=null;renderSigPage();}};
document.getElementById('sigNext').onclick=()=>{if(sigCurrentPage<sigTotalPages-1&&!sigRendering&&!sigSaving){sigCurrentPage++;sigSelected=null;renderSigPage();}};
document.getElementById('sigDownload').onclick=async()=>{
 if(sigSaving||sigRendering)return;if(!sigPlacedItems.length){sigMsg(sigWords()[6],'err');return;}
 sigSaving=true;sigButtons();
 try{
  sigMsg(t('common.processing'));const doc=await PDFLib.PDFDocument.load(sigPdfBytes.slice());const pages=doc.getPages();
  for(const item of sigPlacedItems){
   const source=await sigPdfDoc.getPage(item.page+1);const viewport=source.getViewport({scale:sigScale});
   const tl=viewport.convertToPdfPoint(item.x,item.y),tr=viewport.convertToPdfPoint(item.x+item.w,item.y),bl=viewport.convertToPdfPoint(item.x,item.y+item.h);
   const bytes=Uint8Array.from(atob(item.dataUrl.split(',')[1]),c=>c.charCodeAt(0));const image=await doc.embedPng(bytes);
   pages[item.page].drawImage(image,{x:bl[0],y:bl[1],width:Math.hypot(tr[0]-tl[0],tr[1]-tl[1]),height:Math.hypot(tl[0]-bl[0],tl[1]-bl[1]),rotate:PDFLib.degrees(Math.atan2(tr[1]-tl[1],tr[0]-tl[0])*180/Math.PI)});
  }
  const bytes=await doc.save();downloadBlob(new Blob([bytes],{type:'application/pdf'}),'signed.pdf');sigMsg(sigWords()[8],'ok');
 }catch(error){sigMsg(error.message,'err');}finally{sigSaving=false;sigButtons();}
};
document.querySelectorAll('.sig-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.sig-tab').forEach(el=>el.classList.toggle('active',el===tab));sigMode=tab.dataset.sigtab;document.querySelectorAll('.sig-tab-content').forEach(el=>el.classList.toggle('active',el.dataset.sigcontent===sigMode));updateSigPreview();}));
document.querySelectorAll('.sig-font-btn').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.sig-font-btn').forEach(el=>el.classList.toggle('active',el===btn));sigFontFamily=btn.dataset.sigfont;updateSigPreview();}));
document.querySelectorAll('.sig-color').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.sig-color').forEach(el=>el.classList.toggle('active',el===btn));sigColor=btn.dataset.sigcolor;updateSigPreview();}));
function updateSigPreview(){const preview=document.getElementById('sigPreview');preview.style.fontFamily=sigFontFamily;preview.style.color=sigColor;preview.style.background='#fff';preview.textContent=document.getElementById('sigTextInput').value.trim()||'Signature';}
document.getElementById('sigTextInput').addEventListener('input',updateSigPreview);
function clearSigPad(){sigCanvas.getContext('2d').clearRect(0,0,sigCanvas.width,sigCanvas.height);sigImageDataUrl=null;}
document.getElementById('sigClear').addEventListener('click',clearSigPad);
function sigPadPoint(e){const r=sigCanvas.getBoundingClientRect();return {x:(e.clientX-r.left)*sigCanvas.width/r.width,y:(e.clientY-r.top)*sigCanvas.height/r.height};}
sigCanvas.addEventListener('pointerdown',e=>{e.preventDefault();sigDrawing=true;sigLast=sigPadPoint(e);sigCanvas.setPointerCapture(e.pointerId);});
sigCanvas.addEventListener('pointermove',e=>{if(!sigDrawing)return;e.preventDefault();const pos=sigPadPoint(e),ctx=sigCanvas.getContext('2d');ctx.strokeStyle=sigColor;ctx.lineWidth=3;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(sigLast.x,sigLast.y);ctx.lineTo(pos.x,pos.y);ctx.stroke();sigLast=pos;});
function sigEndDraw(){sigDrawing=false;sigLast=null;}
sigCanvas.addEventListener('pointerup',sigEndDraw);sigCanvas.addEventListener('pointercancel',sigEndDraw);
const sigImageDropZone=document.getElementById('sigImageDropZone'),sigImageInput=document.getElementById('sigImageInput');
async function loadSigImage(file){
 if(!file.type.startsWith('image/'))return;
 try{const url=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(reader.error);reader.readAsDataURL(file);});await sigImage(url);sigImageDataUrl=url;document.getElementById('sigFilePreview').src=url;document.getElementById('sigFilePreviewWrap').style.display='flex';}catch(error){sigMsg(error.message,'err');}
}
sigImageDropZone.addEventListener('click',e=>{if(e.target!==sigImageInput)sigImageInput.click();});
sigImageDropZone.addEventListener('dragover',e=>e.preventDefault());sigImageDropZone.addEventListener('drop',e=>{e.preventDefault();if(e.dataTransfer.files[0])loadSigImage(e.dataTransfer.files[0]);});
sigImageInput.addEventListener('change',e=>{if(e.target.files[0])loadSigImage(e.target.files[0]);sigImageInput.value='';});
new MutationObserver(sigLabels).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
sigLabels();sigButtons();

const stampOverlay=document.getElementById('stampOverlay');
const stampDropZone=document.getElementById('stampDropZone');
const stampFileInput=document.getElementById('stampFileInput');
const stampContent=document.getElementById('stampContent');
const stampStatus=document.getElementById('stampStatus');
const stampCanvasHolder=document.getElementById('stampCanvasHolder');
let stampPdfBytes=null, stampPdfDoc=null, stampTotalPages=0, stampCurrentPage=0;
let stampScale=1.5, stampText='APPROVED', stampColor='#10b981';
let stampPlacedItems=[], stampCanvasEl=null;
function openStamp() { stampOverlay.classList.add('active'); stampPdfBytes=null; stampPdfDoc=null; stampTotalPages=0; stampCurrentPage=0; stampContent.classList.add('hidden'); stampDropZone.style.display='block'; stampStatus.className='status-msg hidden'; stampPlacedItems=[]; stampCanvasHolder.classList.add('hidden'); }
function closeStamp() { stampOverlay.classList.remove('active'); }
stampOverlay.addEventListener('click', e => { if (e.target === stampOverlay) closeStamp(); });
stampDropZone.addEventListener('click', () => stampFileInput.click());
stampDropZone.addEventListener('dragover', e => { e.preventDefault(); stampDropZone.classList.add('dragover'); });
stampDropZone.addEventListener('dragleave', () => stampDropZone.classList.remove('dragover'));
stampDropZone.addEventListener('drop', async e => { e.preventDefault(); stampDropZone.classList.remove('dragover'); const f=[...e.dataTransfer.files].find(x => x.name.toLowerCase().endsWith('.pdf')); if (f) await loadStampPdf(f); });
stampFileInput.addEventListener('change', async e => { if (e.target.files[0]) await loadStampPdf(e.target.files[0]); stampFileInput.value = ''; });
async function loadStampPdf(file) {
  try {
    showStatus(stampStatus, t('common.processing'), 'info');
    stampPdfBytes=new Uint8Array(await file.arrayBuffer());
    stampPdfDoc=await pdfjsLib.getDocument({ data: stampPdfBytes.slice() }).promise;
    stampTotalPages=stampPdfDoc.numPages; stampCurrentPage=0; stampPlacedItems=[];
    stampContent.classList.remove('hidden'); stampDropZone.style.display='none';
    stampCanvasHolder.classList.remove('hidden'); showStatus(stampStatus, '', 'info');
    stampCanvasEl=document.getElementById('stampCanvas');
    setupStampNav(); stampCanvasEl.onclick=onStampCanvasClick; await renderStampPage();
  } catch (err) { console.error(err); showStatus(stampStatus, t('common.error') + err.message, 'err'); }
}
function setupStampNav() { if (document.getElementById('stampPrev')) return; const nav=document.createElement('div'); nav.className='editor-pages'; nav.innerHTML='<button class="page-nav-btn" id="stampPrev">◀ Prev</button><span class="page-counter" id="stampCounter">1 / 1</span><button class="page-nav-btn" id="stampNext">Next ▶</button>'; stampCanvasHolder.appendChild(nav); document.getElementById('stampPrev').addEventListener('click', async () => { if (stampCurrentPage>0) { stampCurrentPage--; await renderStampPage(); } }); document.getElementById('stampNext').addEventListener('click', async () => { if (stampCurrentPage<stampTotalPages-1) { stampCurrentPage++; await renderStampPage(); } }); }
async function renderStampPage() {
  const page=await stampPdfDoc.getPage(stampCurrentPage+1); const viewport=page.getViewport({ scale:stampScale });
  stampCanvasEl.width=viewport.width; stampCanvasEl.height=viewport.height;
  const ctx=stampCanvasEl.getContext('2d'); ctx.fillStyle='#fff'; ctx.fillRect(0,0,stampCanvasEl.width,stampCanvasEl.height);
  await page.render({ canvasContext:ctx, viewport }).promise;
  stampPlacedItems.filter(it => it.page===stampCurrentPage).forEach(it => { const img=new Image(); img.onload=() => ctx.drawImage(img,it.x,it.y,it.w,it.h); img.src=it.dataUrl; });
  const counter=document.getElementById('stampCounter'); if (counter) counter.textContent=(stampCurrentPage+1)+' / '+stampTotalPages;
  document.getElementById('stampPrev').disabled=stampCurrentPage===0; document.getElementById('stampNext').disabled=stampCurrentPage===stampTotalPages-1;
}
function onStampCanvasClick(e) {
  if (!stampPdfDoc) return;
  const rect=stampCanvasEl.getBoundingClientRect(); const scaleX=stampCanvasEl.width/rect.width, scaleY=stampCanvasEl.height/rect.height;
  const x=(e.clientX-rect.left)*scaleX, y=(e.clientY-rect.top)*scaleY;
  const tc=document.createElement('canvas'); tc.width=400; tc.height=120;
  const tctx=tc.getContext('2d'); tctx.clearRect(0,0,400,120);
  tctx.font='bold 42px Arial, sans-serif'; tctx.fillStyle=stampColor; tctx.textAlign='center'; tctx.textBaseline='middle';
  tctx.strokeStyle=stampColor; tctx.lineWidth=4; tctx.strokeRect(10,20,380,80); tctx.fillText(stampText,200,60);
  const dataUrl=tc.toDataURL('image/png'); const w=180, h=54;
  const img=new Image(); img.onload=() => stampCanvasEl.getContext('2d').drawImage(img, x-w/2, y-h/2, w, h); img.src=dataUrl;
  stampPlacedItems.push({ page:stampCurrentPage, x:x-w/2, y:y-h/2, w, h, dataUrl });
  showStatus(stampStatus, t('stamp.placed') + stampText, 'ok');
}
document.querySelectorAll('.stamp-preset').forEach(p => { p.addEventListener('click', () => { document.querySelectorAll('.stamp-preset').forEach(x => x.classList.remove('active')); p.classList.add('active'); stampText=p.dataset.stamp; stampColor=p.dataset.color; }); });
document.getElementById('stampCustomText').addEventListener('input', e => { const val=e.target.value.trim(); if (val) { document.querySelectorAll('.stamp-preset').forEach(x => x.classList.remove('active')); stampText=val.toUpperCase(); stampColor='#4f46e5'; } });
document.getElementById('stampPlaceBtn').addEventListener('click', async () => {
  if (!stampPdfDoc) { showStatus(stampStatus, t('stamp.needPDF'), 'err'); return; }
  try {
    showStatus(stampStatus, t('common.processing'), 'info');
    const pdfDoc=await PDFLib.PDFDocument.load(stampPdfBytes, { ignoreEncryption: true });
    const pages=pdfDoc.getPages();
    for (const it of stampPlacedItems) {
      const page=pages[it.page]; if (!page) continue;
      const pngBytes=await (await fetch(it.dataUrl)).arrayBuffer();
      const png=await pdfDoc.embedPng(pngBytes); const { height:pageH }=page.getSize();
      page.drawImage(png, { x:it.x/stampScale, y:pageH - it.y/stampScale - it.h/stampScale, width:it.w/stampScale, height:it.h/stampScale });
    }
    const bytes=await pdfDoc.save();
    downloadBlob(new Blob([bytes], { type:'application/pdf' }), 'stamped.pdf');
    showStatus(stampStatus, t('common.done'), 'ok');
  } catch (err) { console.error(err); showStatus(stampStatus, t('common.error') + err.message, 'err'); }
});
