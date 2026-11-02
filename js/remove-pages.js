/* ==========================================================
   REMOVE PAGES
   ========================================================== */
const removePagesOverlay = document.getElementById('removePagesOverlay');
const rpDropZone = document.getElementById('rpDropZone');
const rpFileInput = document.getElementById('rpFileInput');
const rpContent = document.getElementById('rpContent');
const rpGrid = document.getElementById('rpGrid');
const rpRunBtn = document.getElementById('rpRunBtn');
const rpStatus = document.getElementById('rpStatus');
let rpPdfDoc=null, rpTotalPages=0, rpSelected=new Set();
function openRemovePages() { removePagesOverlay.classList.add('active'); rpPdfDoc=null; rpSelected=new Set(); rpContent.classList.add('hidden'); rpGrid.innerHTML=''; rpStatus.className='status-msg hidden'; rpDropZone.style.display='block'; }
function closeRemovePages() { removePagesOverlay.classList.remove('active'); }
removePagesOverlay.addEventListener('click', e => { if (e.target === removePagesOverlay) closeRemovePages(); });
rpDropZone.addEventListener('click', () => rpFileInput.click());
rpDropZone.addEventListener('dragover', e => { e.preventDefault(); rpDropZone.classList.add('dragover'); });
rpDropZone.addEventListener('dragleave', () => rpDropZone.classList.remove('dragover'));
rpDropZone.addEventListener('drop', async e => { e.preventDefault(); rpDropZone.classList.remove('dragover'); const f=[...e.dataTransfer.files].find(x => x.name.toLowerCase().endsWith('.pdf')); if (f) await loadRpPdf(f); });
rpFileInput.addEventListener('change', async e => { if (e.target.files[0]) await loadRpPdf(e.target.files[0]); rpFileInput.value = ''; });
let rpThumbDoc=null,rpObserver=null,rpGeneration=0;const rpThumbCache=new Map();
async function loadRpPdf(file){
 try{
  const bytes=new Uint8Array(await file.arrayBuffer());rpPdfDoc=await PDFLib.PDFDocument.load(bytes.slice());rpTotalPages=rpPdfDoc.getPageCount();rpSelected=new Set();
  await LazyAssets.library('pdfjs');if(rpThumbDoc)await rpThumbDoc.destroy();rpThumbDoc=await pdfjsLib.getDocument({isEvalSupported:false,data:bytes.slice()}).promise;rpThumbCache.clear();
  let controls=document.getElementById('rpSelectionTools');if(!controls){controls=document.createElement('div');controls.id='rpSelectionTools';controls.className='ux-actions';for(const [label,action] of [[ProTools.L('Все','All'),()=>{rpSelected=new Set(Array.from({length:rpTotalPages},(_,i)=>i));renderRpGrid();}],[ProTools.L('Снять выбор','Clear selection'),()=>{rpSelected.clear();renderRpGrid();}],[ProTools.L('Инвертировать','Invert'),()=>{rpSelected=new Set(Array.from({length:rpTotalPages},(_,i)=>i).filter(i=>!rpSelected.has(i)));renderRpGrid();}]]){const b=document.createElement('button');b.type='button';b.className='ux-button';b.textContent=label;b.onclick=action;controls.append(b);}rpGrid.before(controls);}
  renderRpGrid();rpContent.classList.remove('hidden');rpDropZone.style.display='none';showStatus(rpStatus,ProTools.L('Выберите страницы для удаления','Select pages to remove'),'info');
 }catch(error){showStatus(rpStatus,error.message,'err');}
}
function renderRpGrid(){
 rpObserver?.disconnect();const generation=++rpGeneration;rpGrid.replaceChildren();
 rpObserver=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){rpObserver.unobserve(e.target);renderThumb(e.target,generation);}}, {rootMargin:'150px'});
 for(let i=0;i<rpTotalPages;i++){const item=document.createElement('button');item.type='button';item.className='page-item'+(rpSelected.has(i)?' selected':'');item.dataset.page=i;item.setAttribute('aria-pressed',String(rpSelected.has(i)));const img=document.createElement('img');img.className='rp-thumb';img.alt=ProTools.L('Страница ','Page ')+(i+1);if(rpThumbCache.has(i))img.src=rpThumbCache.get(i);const label=document.createElement('span');label.textContent=String(i+1);item.append(img,label);item.onclick=()=>{rpSelected.has(i)?rpSelected.delete(i):rpSelected.add(i);item.classList.toggle('selected',rpSelected.has(i));item.setAttribute('aria-pressed',String(rpSelected.has(i)));showStatus(rpStatus,ProTools.L('Выбрано: ','Selected: ')+rpSelected.size+' / '+rpTotalPages,'info');};rpGrid.append(item);if(!rpThumbCache.has(i))rpObserver.observe(item);}
}
async function renderThumb(item,generation){
 try{if(!rpThumbDoc)return;const index=Number(item.dataset.page),page=await rpThumbDoc.getPage(index+1),base=page.getViewport({scale:1}),view=page.getViewport({scale:Math.min(160/base.width,200/base.height)});const canvas=document.createElement('canvas');canvas.width=Math.ceil(view.width);canvas.height=Math.ceil(view.height);await page.render({canvasContext:canvas.getContext('2d'),viewport:view}).promise;if(generation!==rpGeneration)return;const url=canvas.toDataURL('image/png');rpThumbCache.set(index,url);item.querySelector('img').src=url;canvas.width=canvas.height=0;}catch(_){item.querySelector('img').alt=ProTools.L('Страница ','Page ')+(Number(item.dataset.page)+1);}
}
rpRunBtn.addEventListener('click', async () => {
  if (rpSelected.size === 0) { showStatus(rpStatus, t('rp.selectOne'), 'err'); return; }
  if (rpSelected.size === rpTotalPages) { showStatus(rpStatus, t('rp.all'), 'err'); return; }
  rpRunBtn.disabled = true; showStatus(rpStatus, t('common.processing'), 'info');
  try {
    const newDoc = await PDFLib.PDFDocument.create();
    const keepIdx=[]; for (let i=0;i<rpTotalPages;i++) if (!rpSelected.has(i)) keepIdx.push(i);
    const pages = await newDoc.copyPages(rpPdfDoc, keepIdx); pages.forEach(p => newDoc.addPage(p));
    downloadBlob(new Blob([await newDoc.save()], { type:'application/pdf' }), 'pages-removed.pdf');
    showStatus(rpStatus, t('common.done'), 'ok');
  } catch (err) { console.error(err); showStatus(rpStatus, t('common.error') + err.message, 'err'); }
  finally { rpRunBtn.disabled = false; }
});
