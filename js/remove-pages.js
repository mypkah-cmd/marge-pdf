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
async function loadRpPdf(file) { rpPdfDoc = await PDFLib.PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true }); rpTotalPages = rpPdfDoc.getPageCount(); rpSelected = new Set(); renderRpGrid(); rpContent.classList.remove('hidden'); rpDropZone.style.display='none'; }
function renderRpGrid() { rpGrid.innerHTML=''; for (let i=0;i<rpTotalPages;i++) { const item=document.createElement('div'); item.className='page-item'+(rpSelected.has(i)?' selected':''); item.innerHTML='<span class="page-num">'+(i+1)+'</span>'; item.addEventListener('click', () => { if (rpSelected.has(i)) rpSelected.delete(i); else rpSelected.add(i); renderRpGrid(); }); rpGrid.appendChild(item); } }
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
