/* ==========================================================
   TOOLS — all processing
   ========================================================== */
const overlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalBody = document.getElementById('modalBody');
let currentTool = null;
let currentFiles = [];

function openTool(tool) {
  currentTool = tool; currentFiles = [];
  modalTitle.textContent = t('tool.' + tool.id + '.name');
  modalDesc.textContent = t('tool.' + tool.id + '.desc');
  modalBody.innerHTML = buildToolForm(tool);
  overlay.classList.add('active');
  bindToolEvents(tool);
}
function closeModal() { overlay.classList.remove('active'); currentTool = null; currentFiles = []; }
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

function buildToolForm(tool) {
  let extra = '';
  if (tool.id === 'split' || tool.id === 'extract') extra = '<div class="options"><label>'+t('opt.range')+'</label><input type="text" id="pageRange" placeholder="1-3,5"></div>';
  if (tool.id === 'rotate') extra = '<div class="options"><label>'+t('opt.angle')+'</label><select id="rotateAngle"><option value="90">90°</option><option value="180">180°</option><option value="270">270°</option></select></div>';
  if (tool.id === 'watermark') extra = '<div class="options"><label>'+t('opt.text')+'</label><input type="text" id="wmText" value="CONFIDENTIAL"><label>'+t('opt.opacity')+'</label><input type="number" id="wmOpacity" value="0.3" step="0.1" min="0.1" max="1"></div>';
  if (tool.id === 'pagenum') extra = '<div class="options"><label>'+t('opt.position')+'</label><select id="pnPosition"><option value="bottom-center">↓ center</option><option value="bottom-right">↘ right</option><option value="bottom-left">↙ left</option></select></div>';
  if (tool.id === 'protect') extra = '<div class="options"><label>'+t('opt.password')+'</label><input type="text" id="pdfPassword"></div>';
  if (tool.id === 'metadata') extra = '<div class="options"><label>'+t('opt.title')+'</label><input type="text" id="metaTitle"><label>'+t('opt.author')+'</label><input type="text" id="metaAuthor"><label>'+t('opt.subject')+'</label><input type="text" id="metaSubject"></div>';
  const accept = tool.id === 'excel2pdf' ? '.xlsx,.xls' : tool.id === 'word2pdf' ? '.docx' : tool.id === 'img2pdf' ? 'image/*' : tool.id === 'pdf2excel' ? '.pdf' : 'application/pdf';
  const multiple = (tool.id === 'merge' || tool.id === 'img2pdf') ? 'multiple' : '';
  return '<div class="drop-zone" id="dropZone"><span class="big">📁</span><span>'+t('common.drop')+'</span><input type="file" id="fileInput" accept="'+accept+'" '+multiple+'></div><ul class="file-list" id="fileList"></ul>'+extra+'<button class="btn" id="runBtn" disabled>'+t('common.run')+'</button><div class="status-msg hidden" id="statusMsg"></div>';
}

function bindToolEvents(tool) {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  const fileList = document.getElementById('fileList');
  const runBtn = document.getElementById('runBtn');
  const statusMsg = document.getElementById('statusMsg');
  dropZone.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', e => { e.preventDefault(); dropZone.classList.remove('dragover'); addFiles([...e.dataTransfer.files]); });
  fileInput.addEventListener('change', e => { addFiles([...e.target.files]); fileInput.value = ''; });
  function addFiles(newFiles) {
    const filtered = newFiles.filter(f => {
      const n = f.name.toLowerCase();
      if (tool.id === 'excel2pdf') return n.endsWith('.xlsx') || n.endsWith('.xls');
      if (tool.id === 'word2pdf') return n.endsWith('.docx');
      if (tool.id === 'img2pdf') return f.type.startsWith('image/');
      return f.type === 'application/pdf' || n.endsWith('.pdf');
    });
    if (tool.id === 'merge' || tool.id === 'img2pdf') currentFiles.push(...filtered);
    else currentFiles = filtered.slice(0, 1);
    renderFileList(tool, fileList, runBtn);
  }
  runBtn.addEventListener('click', () => executeTool(tool, statusMsg));
}

function renderFileList(tool, fileList, runBtn) {
  fileList.innerHTML = '';
  const isMerge = (tool.id === 'merge' || tool.id === 'img2pdf');
  currentFiles.forEach((f, i) => {
    const li = document.createElement('li');
    if (isMerge) li.classList.add('draggable');
    const left = document.createElement('span');
    left.style.cssText = 'display:flex;align-items:center;gap:6px;min-width:0;flex:1;';
    if (isMerge) { const handle = document.createElement('span'); handle.className = 'drag-handle'; handle.textContent = '⋮⋮'; left.appendChild(handle); }
    const idx = document.createElement('span'); idx.className = 'file-index'; idx.textContent = (i + 1) + '.'; left.appendChild(idx);
    const nameSpan = document.createElement('span'); nameSpan.textContent = '📎 ' + f.name; nameSpan.style.cssText = 'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;'; left.appendChild(nameSpan);
    li.appendChild(left);
    const btn = document.createElement('button'); btn.className = 'remove'; btn.textContent = '×';
    btn.addEventListener('click', () => { currentFiles.splice(i, 1); renderFileList(tool, fileList, runBtn); });
    li.appendChild(btn);
    if (isMerge) {
      li.draggable = true;
      li.addEventListener('dragstart', e => { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(i)); li.classList.add('dragging'); });
      li.addEventListener('dragend', () => { li.classList.remove('dragging'); fileList.querySelectorAll('li').forEach(x => x.classList.remove('drag-over-top', 'drag-over-bottom')); });
      li.addEventListener('dragover', e => { e.preventDefault(); const rect = li.getBoundingClientRect(); const before = (e.clientY - rect.top) < rect.height / 2; fileList.querySelectorAll('li').forEach(x => x.classList.remove('drag-over-top', 'drag-over-bottom')); li.classList.add(before ? 'drag-over-top' : 'drag-over-bottom'); });
      li.addEventListener('dragleave', () => li.classList.remove('drag-over-top', 'drag-over-bottom'));
      li.addEventListener('drop', e => {
        e.preventDefault();
        const fromIdx = parseInt(e.dataTransfer.getData('text/plain'), 10);
        const rect = li.getBoundingClientRect();
        const before = (e.clientY - rect.top) < rect.height / 2;
        let toIdx = before ? i : i + 1;
        if (fromIdx === toIdx || fromIdx === toIdx - 1) { fileList.querySelectorAll('li').forEach(x => x.classList.remove('drag-over-top', 'drag-over-bottom')); return; }
        const [moved] = currentFiles.splice(fromIdx, 1);
        if (fromIdx < toIdx) toIdx--;
        currentFiles.splice(toIdx, 0, moved);
        renderFileList(tool, fileList, runBtn);
      });
    }
    fileList.appendChild(li);
  });
  runBtn.disabled = currentFiles.length < (tool.needs || 1);
}

function showStatus(el, text, type) { if (!el) return; el.textContent = text; el.className = 'status-msg ' + (type || 'info'); }

async function executeTool(tool, statusMsg) {
  if (ProductUX.busy()) return;
  const runBtn = document.getElementById('runBtn');
  let completed = false;
  ProductUX.begin(tool);
  showStatus(statusMsg, t('common.processing'), 'info');
  try {
    await LazyAssets.forTool(tool.id);
    await ProductUX.step();
    if (tool.id === 'merge') await toolMerge();
    else if (tool.id === 'pdf2jpg') await toolPdf2Jpg();
    else if (tool.id === 'pdf2word') await toolPdf2Word();
    else if (tool.id === 'split') await toolSplit();
    else if (tool.id === 'compress') await toolCompress();
    else if (tool.id === 'rotate') await toolRotate();
    else if (tool.id === 'extract') await toolExtract();
    else if (tool.id === 'watermark') await toolWatermark();
    else if (tool.id === 'pagenum') await toolPageNum();
    else if (tool.id === 'excel2pdf') await toolExcel2Pdf();
    else if (tool.id === 'pdf2excel') await toolPdf2Excel();
    else if (tool.id === 'word2pdf') await toolWord2Pdf();
    else if (tool.id === 'img2pdf') await toolImg2Pdf();
    else if (tool.id === 'protect') await toolProtect();
    else if (tool.id === 'metadata') await toolMetadata();

    await ProductUX.step();
    ProductUX.commit();
    completed = true;
    showStatus(statusMsg, t('common.done'), 'ok');
  } catch (err) {
    ProductUX.discard();
    showStatus(statusMsg, err.name === 'AbortError' ? ProductUX.text('cancelled') : t('common.error') + err.message, err.name === 'AbortError' ? 'info' : 'err');
  } finally {
    ProductUX.finish();
    if (runBtn && runBtn.isConnected) runBtn.disabled = false;
    if (completed) { closeModal(); document.getElementById('uxResult').scrollIntoView({block:'center'}); }
  }
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
  if (blob && blob.size && blob.size < 30 * 1024 * 1024 && typeof window.__idbAddFile === 'function') {
    window.__idbAddFile(filename, blob, 'result').catch(() => {});
  }
}

function parseRange(str, max) {
  const pages = new Set();
  str.split(',').forEach(part => {
    part = part.trim(); if (!part) return;
    if (part.includes('-')) {
      const ab = part.split('-');
      const a = parseInt(ab[0], 10), b = parseInt(ab[1], 10);
      for (let i = a; i <= Math.min(b, max); i++) pages.add(i - 1);
    } else {
      const n = parseInt(part, 10);
      if (n >= 1 && n <= max) pages.add(n - 1);
    }
  });
  return [...pages].sort((a, b) => a - b);
}

