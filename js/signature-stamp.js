/* ==========================================================
   SIGNATURE + STAMP
   ========================================================== */
const signatureOverlay = document.getElementById('signatureOverlay');
const sigDropZone = document.getElementById('sigDropZone');
const sigFileInput = document.getElementById('sigFileInput');
const sigContent = document.getElementById('sigContent');
const sigCanvas = document.getElementById('sigCanvas');
const sigStatus = document.getElementById('sigStatus');
const sigPlaceBtn = document.getElementById('sigPlaceBtn');
let sigPdfBytes=null, sigPdfDoc=null, sigTotalPages=0, sigCurrentPage=0;
let sigScale=1.5, sigMode='draw', sigColor='#1e293b', sigImageDataUrl=null;
let sigFontFamily="'Brush Script MT', cursive", sigDrawing=false, sigLastX=0, sigLastY=0;
let sigPlacedItems=[], sigPdfCanvas=null;

function openSignature() { signatureOverlay.classList.add('active'); sigPdfBytes=null; sigPdfDoc=null; sigTotalPages=0; sigCurrentPage=0; sigContent.classList.add('hidden'); sigDropZone.style.display='block'; sigStatus.className='status-msg hidden'; sigImageDataUrl=null; sigPlacedItems=[]; sigPdfCanvas=null; clearSigPad(); updateSigPreview(); }
function closeSignature() { signatureOverlay.classList.remove('active'); }
signatureOverlay.addEventListener('click', e => { if (e.target === signatureOverlay) closeSignature(); });
sigDropZone.addEventListener('click', () => sigFileInput.click());
sigDropZone.addEventListener('dragover', e => { e.preventDefault(); sigDropZone.classList.add('dragover'); });
sigDropZone.addEventListener('dragleave', () => sigDropZone.classList.remove('dragover'));
sigDropZone.addEventListener('drop', async e => { e.preventDefault(); sigDropZone.classList.remove('dragover'); const f=[...e.dataTransfer.files].find(x => x.name.toLowerCase().endsWith('.pdf')); if (f) await loadSigPdf(f); });
sigFileInput.addEventListener('change', async e => { if (e.target.files[0]) await loadSigPdf(e.target.files[0]); sigFileInput.value = ''; });
async function loadSigPdf(file) {
  try {
    showStatus(sigStatus, t('common.processing'), 'info');
    sigPdfBytes = new Uint8Array(await file.arrayBuffer());
    sigPdfDoc = await pdfjsLib.getDocument({ data: sigPdfBytes.slice() }).promise;
    sigTotalPages = sigPdfDoc.numPages; sigCurrentPage=0; sigPlacedItems=[];
    sigContent.classList.remove('hidden'); sigDropZone.style.display='none';
    showStatus(sigStatus, '', 'info');
    createSigPdfCanvas(); await renderSigPage();
  } catch (err) { console.error(err); showStatus(sigStatus, t('common.error') + err.message, 'err'); }
}
function createSigPdfCanvas() {
  if (sigPdfCanvas) return;
  const wrap=document.createElement('div'); wrap.className='editor-canvas-wrap'; wrap.style.marginTop='14px';
  const scroll=document.createElement('div'); scroll.className='editor-canvas-scroll';
  const inner=document.createElement('div'); inner.className='editor-canvas-inner';
  sigPdfCanvas = document.createElement('canvas');
  sigPdfCanvas.style.background='#fff'; sigPdfCanvas.style.cursor='crosshair'; sigPdfCanvas.style.display='block';
  inner.appendChild(sigPdfCanvas); scroll.appendChild(inner); wrap.appendChild(scroll);
  sigContent.appendChild(wrap);
  const nav=document.createElement('div'); nav.className='editor-pages';
  nav.innerHTML='<button class="page-nav-btn" id="sigPrev">◀ Prev</button><span class="page-counter" id="sigCounter">1 / 1</span><button class="page-nav-btn" id="sigNext">Next ▶</button>';
  sigContent.appendChild(nav);
  document.getElementById('sigPrev').addEventListener('click', async () => { if (sigCurrentPage>0) { sigCurrentPage--; await renderSigPage(); } });
  document.getElementById('sigNext').addEventListener('click', async () => { if (sigCurrentPage<sigTotalPages-1) { sigCurrentPage++; await renderSigPage(); } });
  sigPdfCanvas.addEventListener('click', async e => {
    if (!sigPdfDoc) return;
    let dataUrl=null;
    if (sigMode==='draw'||sigMode==='upload') { if (!sigImageDataUrl) { showStatus(sigStatus, t('sig.needSignature'), 'err'); return; } dataUrl=sigImageDataUrl; }
    else if (sigMode==='type') {
      const text=document.getElementById('sigTextInput').value.trim();
      if (!text) { showStatus(sigStatus, t('sig.needSignature'), 'err'); return; }
      const tc=document.createElement('canvas'); tc.width=600; tc.height=200;
      const tctx=tc.getContext('2d'); tctx.clearRect(0,0,600,200);
      tctx.font='72px '+sigFontFamily; tctx.fillStyle=sigColor; tctx.textAlign='center'; tctx.textBaseline='middle';
      tctx.fillText(text,300,100); dataUrl=tc.toDataURL('image/png');
    }
    const rect=sigPdfCanvas.getBoundingClientRect(); const scaleX=sigPdfCanvas.width/rect.width, scaleY=sigPdfCanvas.height/rect.height;
    const x=(e.clientX-rect.left)*scaleX, y=(e.clientY-rect.top)*scaleY; const w=200, h=80;
    const img=new Image(); img.onload=() => sigPdfCanvas.getContext('2d').drawImage(img, x-w/2, y-h/2, w, h); img.src=dataUrl;
    sigPlacedItems.push({ page:sigCurrentPage, x:x-w/2, y:y-h/2, w, h, dataUrl });
    showStatus(sigStatus, t('sig.placed'), 'ok');
  });
}
async function renderSigPage() {
  const page=await sigPdfDoc.getPage(sigCurrentPage+1); const viewport=page.getViewport({ scale:sigScale });
  sigPdfCanvas.width=viewport.width; sigPdfCanvas.height=viewport.height;
  const ctx=sigPdfCanvas.getContext('2d'); ctx.fillStyle='#fff'; ctx.fillRect(0,0,sigPdfCanvas.width,sigPdfCanvas.height);
  await page.render({ canvasContext:ctx, viewport }).promise;
  sigPlacedItems.filter(it => it.page===sigCurrentPage).forEach(it => { const img=new Image(); img.onload=() => ctx.drawImage(img,it.x,it.y,it.w,it.h); img.src=it.dataUrl; });
  const counter=document.getElementById('sigCounter'); if (counter) counter.textContent=(sigCurrentPage+1)+' / '+sigTotalPages;
  document.getElementById('sigPrev').disabled=sigCurrentPage===0; document.getElementById('sigNext').disabled=sigCurrentPage===sigTotalPages-1;
}
document.querySelectorAll('.sig-tab').forEach(tab => { tab.addEventListener('click', () => { document.querySelectorAll('.sig-tab').forEach(x => x.classList.remove('active')); tab.classList.add('active'); sigMode=tab.dataset.sigtab; document.querySelectorAll('.sig-tab-content').forEach(x => x.classList.remove('active')); const target=document.querySelector('[data-sigcontent="'+sigMode+'"]'); if (target) target.classList.add('active'); updateSigPreview(); }); });
document.querySelectorAll('.sig-font-btn').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.sig-font-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); sigFontFamily=btn.dataset.sigfont; updateSigPreview(); }); });
document.querySelectorAll('.sig-color').forEach(c => { c.addEventListener('click', () => { document.querySelectorAll('.sig-color').forEach(s => s.classList.remove('active')); c.classList.add('active'); sigColor=c.dataset.sigcolor; }); });
function updateSigPreview() { const input=document.getElementById('sigTextInput'); const preview=document.getElementById('sigPreview'); if (!input || !preview) return; preview.style.fontFamily=sigFontFamily; preview.textContent=input.value.trim() || 'Signature'; }
document.getElementById('sigTextInput').addEventListener('input', updateSigPreview);
function clearSigPad() { if (!sigCanvas) return; const ctx=sigCanvas.getContext('2d'); ctx.clearRect(0,0,sigCanvas.width,sigCanvas.height); ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,sigCanvas.width,sigCanvas.height); sigImageDataUrl=null; }
document.getElementById('sigClear').addEventListener('click', clearSigPad);
sigCanvas.addEventListener('mousedown', e => { sigDrawing=true; const r=sigCanvas.getBoundingClientRect(); sigLastX=(e.clientX-r.left)*(sigCanvas.width/r.width); sigLastY=(e.clientY-r.top)*(sigCanvas.height/r.height); });
sigCanvas.addEventListener('mousemove', e => { if (!sigDrawing) return; const r=sigCanvas.getBoundingClientRect(); const x=(e.clientX-r.left)*(sigCanvas.width/r.width); const y=(e.clientY-r.top)*(sigCanvas.height/r.height); const ctx=sigCanvas.getContext('2d'); ctx.strokeStyle=sigColor; ctx.lineWidth=3; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(sigLastX,sigLastY); ctx.lineTo(x,y); ctx.stroke(); sigLastX=x; sigLastY=y; });
sigCanvas.addEventListener('mouseup', () => { if (sigDrawing) { sigDrawing=false; sigImageDataUrl=sigCanvas.toDataURL('image/png'); } });
sigCanvas.addEventListener('mouseleave', () => { if (sigDrawing) { sigDrawing=false; sigImageDataUrl=sigCanvas.toDataURL('image/png'); } });
sigCanvas.addEventListener('touchstart', e => { e.preventDefault(); const t0=e.touches[0]; sigDrawing=true; const r=sigCanvas.getBoundingClientRect(); sigLastX=(t0.clientX-r.left)*(sigCanvas.width/r.width); sigLastY=(t0.clientY-r.top)*(sigCanvas.height/r.height); }, { passive: false });
sigCanvas.addEventListener('touchmove', e => { if (!sigDrawing) return; e.preventDefault(); const t0=e.touches[0]; const r=sigCanvas.getBoundingClientRect(); const x=(t0.clientX-r.left)*(sigCanvas.width/r.width); const y=(t0.clientY-r.top)*(sigCanvas.height/r.height); const ctx=sigCanvas.getContext('2d'); ctx.strokeStyle=sigColor; ctx.lineWidth=3; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(sigLastX,sigLastY); ctx.lineTo(x,y); ctx.stroke(); sigLastX=x; sigLastY=y; }, { passive: false });
sigCanvas.addEventListener('touchend', () => { if (sigDrawing) { sigDrawing=false; sigImageDataUrl=sigCanvas.toDataURL('image/png'); } });
const sigImageDropZone=document.getElementById('sigImageDropZone');
const sigImageInput=document.getElementById('sigImageInput');
const sigFilePreviewWrap=document.getElementById('sigFilePreviewWrap');
const sigFilePreview=document.getElementById('sigFilePreview');
sigImageDropZone.addEventListener('click', () => sigImageInput.click());
sigImageDropZone.addEventListener('dragover', e => { e.preventDefault(); sigImageDropZone.classList.add('dragover'); });
sigImageDropZone.addEventListener('dragleave', () => sigImageDropZone.classList.remove('dragover'));
sigImageDropZone.addEventListener('drop', async e => { e.preventDefault(); sigImageDropZone.classList.remove('dragover'); const f=e.dataTransfer.files[0]; if (f && f.type.startsWith('image/')) await loadSigImage(f); });
sigImageInput.addEventListener('change', async e => { if (e.target.files[0]) await loadSigImage(e.target.files[0]); sigImageInput.value = ''; });
async function loadSigImage(file) { const reader=new FileReader(); reader.onload=ev => { sigImageDataUrl=ev.target.result; sigFilePreview.src=sigImageDataUrl; sigFilePreviewWrap.style.display='flex'; }; reader.readAsDataURL(file); }
sigPlaceBtn.addEventListener('click', async () => {
  if (!sigPdfDoc) { showStatus(sigStatus, t('sig.needPDF'), 'err'); return; }
  try {
    showStatus(sigStatus, t('common.processing'), 'info');
    const pdfDoc=await PDFLib.PDFDocument.load(sigPdfBytes, { ignoreEncryption: true });
    const pages=pdfDoc.getPages();
    for (const it of sigPlacedItems) {
      const page=pages[it.page]; if (!page) continue;
      const pngBytes=await (await fetch(it.dataUrl)).arrayBuffer();
      const png=await pdfDoc.embedPng(pngBytes); const { height:pageH }=page.getSize();
      page.drawImage(png, { x:it.x/sigScale, y:pageH - it.y/sigScale - it.h/sigScale, width:it.w/sigScale, height:it.h/sigScale });
    }
    const bytes=await pdfDoc.save();
    downloadBlob(new Blob([bytes], { type:'application/pdf' }), 'signed.pdf');
    showStatus(sigStatus, t('common.done'), 'ok');
  } catch (err) { console.error(err); showStatus(sigStatus, t('common.error') + err.message, 'err'); }
});

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
