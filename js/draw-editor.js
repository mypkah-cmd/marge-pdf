/* ==========================================================
   DRAW EDITOR
   ========================================================== */
const editorOverlay = document.getElementById('editorOverlay');
const editorDropZone = document.getElementById('editorDropZone');
const editorFileInput = document.getElementById('editorFileInput');
const editorContent = document.getElementById('editorContent');
const editorCanvas = document.getElementById('editorCanvas');
const editorStatus = document.getElementById('editorStatus');
const editorPageCounter = document.getElementById('editorPageCounter');
const editorPrev = document.getElementById('editorPrev');
const editorNext = document.getElementById('editorNext');
const editorUndo = document.getElementById('editorUndo');
const editorClear = document.getElementById('editorClear');
const editorSave = document.getElementById('editorSave');
const editorScroll = document.getElementById('editorScroll');
const editorZoomLevel = document.getElementById('editorZoomLevel');
let edPdfBytes = null, edPdfDoc = null, edTotalPages = 0, edCurrentPage = 0;
let edBaseScale = 1.5, edZoom = 1;
let edCanvasWidth = 0, edCanvasHeight = 0;
let edTool = 'pen', edColor = '#ef4444', edLineWidth = 4;
const edHistory = {}; const edVectorOps = {};
let edDrawing = false, edStartX = 0, edStartY = 0, edSnapshot = null, edCurrentPenPath = [];
let edPanning = false, edPanStartX = 0, edPanStartY = 0, edPanScrollLeft = 0, edPanScrollTop = 0;
let edSpacePressed = false;
let edSelectedOp = null; let edDragStart = null; let edRotateStart = null; let edNextOpId = 1;

function opBBox(op) {
  const k = edZoom / (op.zoom || 1);
  if (op.type === 'pen' || op.type === 'marker' || op.type === 'eraser') {
    let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
    op.points.forEach(p => { const x=p.x*k, y=p.y*k; if(x<minX)minX=x; if(y<minY)minY=y; if(x>maxX)maxX=x; if(y>maxY)maxY=y; });
    const pad=(op.width||4)*k;
    return { x:minX-pad, y:minY-pad, w:maxX-minX+pad*2, h:maxY-minY+pad*2 };
  }
  if (op.type === 'rect') { const x=op.x*k,y=op.y*k,w=op.w*k,h=op.h*k; return { x:Math.min(x,x+w)-4, y:Math.min(y,y+h)-4, w:Math.abs(w)+8, h:Math.abs(h)+8 }; }
  if (op.type === 'circle') { const x1=Math.min(op.x1,op.x2)*k,y1=Math.min(op.y1,op.y2)*k,x2=Math.max(op.x1,op.x2)*k,y2=Math.max(op.y1,op.y2)*k; return { x:x1-4, y:y1-4, w:x2-x1+8, h:y2-y1+8 }; }
  if (op.type === 'line' || op.type === 'arrow') { const x1=Math.min(op.x1,op.x2)*k,y1=Math.min(op.y1,op.y2)*k,x2=Math.max(op.x1,op.x2)*k,y2=Math.max(op.y1,op.y2)*k; return { x:x1-8, y:y1-8, w:x2-x1+16, h:y2-y1+16 }; }
  if (op.type === 'text') { const ctx=editorCanvas.getContext('2d'); const fs=24*k; ctx.font=fs+'px sans-serif'; const w=ctx.measureText(op.text).width; return { x:op.x*k-4, y:op.y*k-fs, w:w+8, h:fs+8 }; }
  return { x:0, y:0, w:0, h:0 };
}
function isPointInOp(op, x, y) { const b = opBBox(op); const m=6; return x>=b.x-m && x<=b.x+b.w+m && y>=b.y-m && y<=b.y+b.h+m; }
function getOpCenter(op) { const b = opBBox(op); return { x: b.x + b.w/2, y: b.y + b.h/2 }; }
function renderSelectionBox() {
  editorScroll.querySelectorAll('.ed-selection-box, .ed-selection-handle, .ed-rotate-line').forEach(el => el.remove());
  if (!edSelectedOp || edTool !== 'select') return;
  const box = opBBox(edSelectedOp);
  const rect = editorCanvas.getBoundingClientRect();
  const parentRect = editorScroll.getBoundingClientRect();
  const cssX = (box.x / editorCanvas.width) * rect.width + (rect.left - parentRect.left) + editorScroll.scrollLeft;
  const cssY = (box.y / editorCanvas.height) * rect.height + (rect.top - parentRect.top) + editorScroll.scrollTop;
  const cssW = (box.w / editorCanvas.width) * rect.width;
  const cssH = (box.h / editorCanvas.height) * rect.height;
  const sel = document.createElement('div'); sel.className = 'ed-selection-box';
  sel.style.left=cssX+'px'; sel.style.top=cssY+'px'; sel.style.width=cssW+'px'; sel.style.height=cssH+'px';
  editorScroll.appendChild(sel);
  const rot = document.createElement('div'); rot.className = 'ed-selection-handle rot';
  rot.style.left=(cssX + cssW/2 - 8)+'px'; rot.style.top=(cssY-24)+'px';
  editorScroll.appendChild(rot); rot.addEventListener('mousedown', startRotate);
  const line = document.createElement('div'); line.className = 'ed-rotate-line';
  line.style.left=(cssX + cssW/2)+'px'; line.style.top=(cssY-26)+'px'; line.style.height='22px';
  editorScroll.appendChild(line);
}
function rotateOpAround(op, cx, cy, dRad) {
  const k = edZoom / (op.zoom || 1);
  const cosA=Math.cos(dRad), sinA=Math.sin(dRad);
  function rp(px, py) { const rx=px-cx, ry=py-cy; return { x: rx*cosA-ry*sinA+cx, y: rx*sinA+ry*cosA+cy }; }
  if (op.type === 'pen' || op.type === 'marker' || op.type === 'eraser') { op.points = op.points.map(p => { const q=rp(p.x*k, p.y*k); return { x:q.x/k, y:q.y/k }; }); }
  else if (op.type === 'line' || op.type === 'arrow') { const p1=rp(op.x1*k,op.y1*k), p2=rp(op.x2*k,op.y2*k); op.x1=p1.x/k;op.y1=p1.y/k;op.x2=p2.x/k;op.y2=p2.y/k; }
  else if (op.type === 'rect') { const p=rp(op.x*k,op.y*k); op.x=p.x/k;op.y=p.y/k; op.rotation=(op.rotation||0)+dRad; }
  else if (op.type === 'circle') { const p1=rp(op.x1*k,op.y1*k), p2=rp(op.x2*k,op.y2*k); op.x1=p1.x/k;op.y1=p1.y/k;op.x2=p2.x/k;op.y2=p2.y/k; }
  else if (op.type === 'text') { const p=rp(op.x*k,op.y*k); op.x=p.x/k;op.y=p.y/k; op.rotation=(op.rotation||0)+dRad; }
}
function startRotate(e) { e.preventDefault(); e.stopPropagation(); if (!edSelectedOp) return; const c=getOpCenter(edSelectedOp); const pos=getCanvasPos(e); edRotateStart={cx:c.x,cy:c.y,startAngle:Math.atan2(pos.y-c.y,pos.x-c.x)}; window.addEventListener('mousemove', onRotateMove); window.addEventListener('mouseup', onRotateEnd); }
function onRotateMove(e) { if (!edRotateStart || !edSelectedOp) return; const pos=getCanvasPos(e); const angle=Math.atan2(pos.y-edRotateStart.cy, pos.x-edRotateStart.cx); const d=angle-edRotateStart.startAngle; edRotateStart.startAngle=angle; rotateOpAround(edSelectedOp, edRotateStart.cx, edRotateStart.cy, d); renderEditorPage(); }
function onRotateEnd() { edRotateStart=null; window.removeEventListener('mousemove', onRotateMove); window.removeEventListener('mouseup', onRotateEnd); }

function openEditor() { editorOverlay.classList.add('active'); edPdfBytes=null; edPdfDoc=null; edTotalPages=0; edCurrentPage=0; edZoom=1; edSelectedOp=null; updateEdZoomUI(); Object.keys(edHistory).forEach(k => delete edHistory[k]); Object.keys(edVectorOps).forEach(k => delete edVectorOps[k]); editorContent.classList.add('hidden'); editorDropZone.style.display='block'; editorStatus.className='status-msg hidden'; }
function closeEditor() { PageText.finish(); editorOverlay.classList.remove('active'); }
editorOverlay.addEventListener('click', e => { if (e.target === editorOverlay) closeEditor(); });
function updateEdZoomUI() { if (editorZoomLevel) editorZoomLevel.textContent = Math.round(edZoom * 100) + '%'; }
editorDropZone.addEventListener('click', () => editorFileInput.click());
editorDropZone.addEventListener('dragover', e => { e.preventDefault(); editorDropZone.classList.add('dragover'); });
editorDropZone.addEventListener('dragleave', () => editorDropZone.classList.remove('dragover'));
editorDropZone.addEventListener('drop', async e => { e.preventDefault(); editorDropZone.classList.remove('dragover'); const f=[...e.dataTransfer.files].find(x => x.name.toLowerCase().endsWith('.pdf')); if (f) await loadEditorPdf(f); });
editorFileInput.addEventListener('change', async e => { if (e.target.files[0]) await loadEditorPdf(e.target.files[0]); editorFileInput.value = ''; });
async function loadEditorPdf(file) {
  try {
    showStatus(editorStatus, t('common.processing'), 'info');
    edPdfBytes = new Uint8Array(await file.arrayBuffer());
    edPdfDoc = await pdfjsLib.getDocument({ data: edPdfBytes.slice() }).promise;
    edTotalPages = edPdfDoc.numPages; edCurrentPage = 0;
    Object.keys(edHistory).forEach(k => delete edHistory[k]); Object.keys(edVectorOps).forEach(k => delete edVectorOps[k]);
    edSelectedOp = null;
    editorContent.classList.remove('hidden'); editorDropZone.style.display = 'none';
    showStatus(editorStatus, '', 'info');
    await renderEditorPage();
  } catch (err) { console.error(err); showStatus(editorStatus, t('common.error') + err.message, 'err'); }
}
function drawVectorOp(ctx, op) {
  const k = edZoom / (op.zoom || 1);
  const alpha = op.alpha != null ? op.alpha : 1;
  ctx.save(); ctx.globalAlpha = alpha;
  ctx.strokeStyle = op.color || '#ef4444'; ctx.fillStyle = op.color || '#ef4444';
  ctx.lineWidth = (op.width || 4) * k; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (op.type === 'pen' || op.type === 'marker' || op.type === 'eraser') {
    if (!op.points || op.points.length < 2) { ctx.restore(); return; }
    if (op.type === 'eraser') ctx.strokeStyle = '#ffffff';
    ctx.beginPath(); ctx.moveTo(op.points[0].x*k, op.points[0].y*k);
    for (let i=1;i<op.points.length;i++) ctx.lineTo(op.points[i].x*k, op.points[i].y*k);
    ctx.stroke();
  } else if (op.type === 'line') { ctx.beginPath(); ctx.moveTo(op.x1*k,op.y1*k); ctx.lineTo(op.x2*k,op.y2*k); ctx.stroke(); }
  else if (op.type === 'rect') { const cx=(op.x+op.w/2)*k, cy=(op.y+op.h/2)*k; ctx.translate(cx,cy); if (op.rotation) ctx.rotate(op.rotation); ctx.strokeRect(-op.w/2*k, -op.h/2*k, op.w*k, op.h*k); }
  else if (op.type === 'circle') { const cx=(op.x1+op.x2)/2*k, cy=(op.y1+op.y2)/2*k; const rx=Math.abs(op.x2-op.x1)/2*k, ry=Math.abs(op.y2-op.y1)/2*k; ctx.beginPath(); ctx.ellipse(cx,cy,rx,ry,0,0,2*Math.PI); ctx.stroke(); }
  else if (op.type === 'arrow') { const x1=op.x1*k,y1=op.y1*k,x2=op.x2*k,y2=op.y2*k; const hl=16*k; const a=Math.atan2(y2-y1,x2-x1); ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x2,y2); ctx.lineTo(x2-hl*Math.cos(a-Math.PI/6), y2-hl*Math.sin(a-Math.PI/6)); ctx.lineTo(x2-hl*Math.cos(a+Math.PI/6), y2-hl*Math.sin(a+Math.PI/6)); ctx.closePath(); ctx.fillStyle = op.color || '#ef4444'; ctx.fill(); }
  else if (op.type === 'text') { const fs=24*k; ctx.font=fs+'px sans-serif'; ctx.textBaseline='alphabetic'; ctx.fillStyle=op.color||'#ef4444'; if (op.rotation) { ctx.translate(op.x*k,op.y*k); ctx.rotate(op.rotation); ctx.fillText(op.text, 0, 0); } else { ctx.fillText(op.text, op.x*k, op.y*k); } }
  ctx.restore();
}
async function renderEditorPage() {
  const page = await edPdfDoc.getPage(edCurrentPage + 1);
  const scale = edBaseScale * edZoom;
  const viewport = page.getViewport({ scale });
  edCanvasWidth = viewport.width; edCanvasHeight = viewport.height;
  editorCanvas.width = edCanvasWidth; editorCanvas.height = edCanvasHeight;
  editorCanvas.style.width = edCanvasWidth+'px'; editorCanvas.style.height = edCanvasHeight+'px';
  const ctx = editorCanvas.getContext('2d');
  ctx.setTransform(1,0,0,1,0,0); ctx.globalAlpha=1;
  ctx.fillStyle='#fff'; ctx.fillRect(0,0,edCanvasWidth,edCanvasHeight);
  await page.render({ canvasContext: ctx, viewport }).promise;
  const ops = edVectorOps[edCurrentPage] || [];
  ops.forEach(op => drawVectorOp(ctx, op));
  editorPageCounter.textContent = (edCurrentPage + 1) + ' / ' + edTotalPages;
  editorPrev.disabled = edCurrentPage === 0;
  editorNext.disabled = edCurrentPage === edTotalPages - 1;
  updateEdZoomUI(); renderSelectionBox();
}
function pushVectorOp(op) { if (!edVectorOps[edCurrentPage]) edVectorOps[edCurrentPage]=[]; op.id=edNextOpId++; edVectorOps[edCurrentPage].push(op); return op; }

document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.tool-btn[data-tool]').forEach(b => b.classList.remove('active')); btn.classList.add('active'); edTool=btn.dataset.tool; if (edTool !== 'select') { edSelectedOp=null; renderSelectionBox(); } editorCanvas.style.cursor = (edTool==='select')?'default':'crosshair'; }); });
document.querySelectorAll('.color-swatch[data-color]').forEach(sw => { sw.addEventListener('click', () => { document.querySelectorAll('.color-swatch[data-color]').forEach(s => s.classList.remove('active')); sw.classList.add('active'); edColor=sw.dataset.color; }); });
document.querySelectorAll('.line-width-btn').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.line-width-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); edLineWidth = parseInt(btn.dataset.lw,10) || 4; }); });

editorUndo.addEventListener('click', () => { const ops=edVectorOps[edCurrentPage]; if (!ops||!ops.length) return; const r=ops.pop(); if (edSelectedOp===r) edSelectedOp=null; renderEditorPage(); });
editorClear.addEventListener('click', async () => { if (!confirm('Clear all drawings on this page?')) return; edVectorOps[edCurrentPage]=[]; edSelectedOp=null; await renderEditorPage(); });
editorPrev.addEventListener('click', async () => { if (edCurrentPage>0) { edCurrentPage--; edSelectedOp=null; await renderEditorPage(); } });
editorNext.addEventListener('click', async () => { if (edCurrentPage<edTotalPages-1) { edCurrentPage++; edSelectedOp=null; await renderEditorPage(); } });
document.getElementById('editorZoomIn').addEventListener('click', async () => { edZoom = Math.min(3, edZoom + 0.25); await renderEditorPage(); });
document.getElementById('editorZoomOut').addEventListener('click', async () => { edZoom = Math.max(0.5, edZoom - 0.25); await renderEditorPage(); });
document.getElementById('editorZoomReset').addEventListener('click', async () => { edZoom = 1; await renderEditorPage(); });
editorScroll.addEventListener('wheel', async e => { if (!e.ctrlKey && !e.metaKey) return; e.preventDefault(); if (e.deltaY<0) edZoom=Math.min(3,edZoom+0.1); else edZoom=Math.max(0.5,edZoom-0.1); await renderEditorPage(); }, { passive: false });
document.addEventListener('keydown', e => { if (!editorOverlay.classList.contains('active')) return; if(e.target.isContentEditable)return; if (e.code === 'Space' && e.target.tagName!=='INPUT' && e.target.tagName!=='TEXTAREA') { e.preventDefault(); edSpacePressed=true; editorScroll.style.cursor='grab'; } if ((e.key==='Delete'||e.key==='Backspace') && edSelectedOp && e.target.tagName!=='INPUT' && e.target.tagName!=='TEXTAREA') { e.preventDefault(); const ops=edVectorOps[edCurrentPage]; const idx=ops.indexOf(edSelectedOp); if (idx>=0) ops.splice(idx,1); edSelectedOp=null; renderEditorPage(); } });
document.addEventListener('keyup', e => { if (e.code === 'Space') { edSpacePressed=false; editorScroll.style.cursor=''; editorScroll.classList.remove('panning'); } });
editorScroll.addEventListener('mousedown', e => { if (edSpacePressed || e.button === 1) { e.preventDefault(); edPanning=true; editorScroll.classList.add('panning'); edPanStartX=e.clientX; edPanStartY=e.clientY; edPanScrollLeft=editorScroll.scrollLeft; edPanScrollTop=editorScroll.scrollTop; } });
editorScroll.addEventListener('mousemove', e => { if (!edPanning) return; e.preventDefault(); editorScroll.scrollLeft=edPanScrollLeft-(e.clientX-edPanStartX); editorScroll.scrollTop=edPanScrollTop-(e.clientY-edPanStartY); });
editorScroll.addEventListener('mouseup', () => { edPanning=false; editorScroll.classList.remove('panning'); });
editorScroll.addEventListener('mouseleave', () => { edPanning=false; editorScroll.classList.remove('panning'); });

function getCanvasPos(e) {
  const rect = editorCanvas.getBoundingClientRect();
  const scaleX = editorCanvas.width / rect.width, scaleY = editorCanvas.height / rect.height;
  let x,y;
  if (e.touches && e.touches.length) { x=(e.touches[0].clientX-rect.left)*scaleX; y=(e.touches[0].clientY-rect.top)*scaleY; }
  else { x=(e.clientX-rect.left)*scaleX; y=(e.clientY-rect.top)*scaleY; }
  return { x, y };
}
function saveSnapshot() { edSnapshot = editorCanvas.getContext('2d').getImageData(0,0,edCanvasWidth,edCanvasHeight); }

function startDraw(e) {
  if (!edPdfDoc) return; if (edSpacePressed || edPanning) return; if (e.button === 1) return;
  const pos = getCanvasPos(e);
  if(edTool==='text'){e.preventDefault();edDrawing=false;showInlineTextInput(pos.x,pos.y);return;}
  if (edTool === 'select') { e.preventDefault(); const ops=edVectorOps[edCurrentPage]||[]; let hit=null; for (let i=ops.length-1;i>=0;i--) { if (isPointInOp(ops[i], pos.x, pos.y)) { hit=ops[i]; break; } } edSelectedOp=hit; renderSelectionBox(); if (hit) edDragStart={ mouseX:pos.x, mouseY:pos.y, orig:JSON.parse(JSON.stringify(hit)) }; return; }
  if (edTool === 'picker') { e.preventDefault(); const ctx=editorCanvas.getContext('2d'); const d=ctx.getImageData(Math.floor(pos.x),Math.floor(pos.y),1,1).data; const hex='#'+[d[0],d[1],d[2]].map(v=>v.toString(16).padStart(2,'0')).join(''); edColor=hex; document.querySelectorAll('.color-swatch[data-color]').forEach(s => s.classList.remove('active')); showStatus(editorStatus, t('editor.colorPicked')+hex, 'ok'); edTool='pen'; document.querySelectorAll('.tool-btn[data-tool]').forEach(b => b.classList.toggle('active', b.dataset.tool==='pen')); editorCanvas.style.cursor='crosshair'; return; }
  if (edTool === 'rotate') { e.preventDefault(); if (!edSelectedOp) { showStatus(editorStatus, t('editor.selectFirst'), 'err'); return; } const c=getOpCenter(edSelectedOp); rotateOpAround(edSelectedOp, c.x, c.y, Math.PI/12); renderEditorPage(); return; }
  e.preventDefault(); edDrawing=true; saveSnapshot();
  const ctx = editorCanvas.getContext('2d');
  ctx.globalAlpha = edTool === 'marker' ? 0.3 : 1;
  ctx.strokeStyle = edTool === 'eraser' ? '#ffffff' : edColor;
  ctx.fillStyle = edColor;
  ctx.lineWidth = (edTool === 'eraser' ? edLineWidth*3 : edLineWidth) * edZoom;
  ctx.lineCap='round'; ctx.lineJoin='round';
  edStartX=pos.x; edStartY=pos.y; edCurrentPenPath=[{ x:pos.x, y:pos.y }];
  if (edTool==='pen'||edTool==='marker'||edTool==='eraser') { ctx.beginPath(); ctx.moveTo(pos.x,pos.y); }
  else if (edTool==='text') { showInlineTextInput(pos.x,pos.y); edDrawing=false; }
}
function showInlineTextInput(x,y) {
 const color=edColor,zoom=edZoom,page=edCurrentPage;
 PageText.start({canvas:editorCanvas,parent:editorScroll,x,y,
  font:(24*edZoom)+'px sans-serif',color:edColor,
  commit(text){if(text.trim()){if(!edVectorOps[page])edVectorOps[page]=[];edVectorOps[page].push({type:'text',x,y,text,color,zoom,id:edNextOpId++});}renderEditorPage();},
  cancel(){renderEditorPage();}
 });
}
function moveDraw(e) {
  if (edTool === 'select' && edDragStart && edSelectedOp) {
    e.preventDefault();
    const pos = getCanvasPos(e);
    const dx = pos.x - edDragStart.mouseX, dy = pos.y - edDragStart.mouseY;
    const orig = edDragStart.orig; const op = edSelectedOp; const k = edZoom / (op.zoom || 1);
    if (op.type==='pen'||op.type==='marker'||op.type==='eraser') { op.points = orig.points.map(p => ({ x:p.x+dx/k, y:p.y+dy/k })); }
    else if (op.type==='line'||op.type==='arrow') { op.x1=orig.x1+dx/k;op.y1=orig.y1+dy/k;op.x2=orig.x2+dx/k;op.y2=orig.y2+dy/k; }
    else if (op.type==='rect') { op.x=orig.x+dx/k;op.y=orig.y+dy/k; }
    else if (op.type==='circle') { op.x1=orig.x1+dx/k;op.y1=orig.y1+dy/k;op.x2=orig.x2+dx/k;op.y2=orig.y2+dy/k; }
    else if (op.type==='text') { op.x=orig.x+dx/k;op.y=orig.y+dy/k; }
    renderEditorPage(); return;
  }
  if (!edDrawing) return;
  e.preventDefault();
  const ctx = editorCanvas.getContext('2d'); const pos = getCanvasPos(e);
  if (edTool==='pen'||edTool==='marker'||edTool==='eraser') { ctx.lineTo(pos.x,pos.y); ctx.stroke(); edCurrentPenPath.push({ x:pos.x, y:pos.y }); }
  else if (edTool==='line') { ctx.globalAlpha=1; ctx.putImageData(edSnapshot,0,0); ctx.beginPath(); ctx.moveTo(edStartX,edStartY); ctx.lineTo(pos.x,pos.y); ctx.stroke(); }
  else if (edTool==='rect') { ctx.globalAlpha=1; ctx.putImageData(edSnapshot,0,0); ctx.strokeRect(edStartX,edStartY,pos.x-edStartX,pos.y-edStartY); }
  else if (edTool==='circle') { ctx.globalAlpha=1; ctx.putImageData(edSnapshot,0,0); const cx=(edStartX+pos.x)/2, cy=(edStartY+pos.y)/2; const rx=Math.abs(pos.x-edStartX)/2, ry=Math.abs(pos.y-edStartY)/2; ctx.beginPath(); ctx.ellipse(cx,cy,rx,ry,0,0,2*Math.PI); ctx.stroke(); }
  else if (edTool==='arrow') { ctx.globalAlpha=1; ctx.putImageData(edSnapshot,0,0); const hl=16*edZoom; const a=Math.atan2(pos.y-edStartY, pos.x-edStartX); ctx.beginPath(); ctx.moveTo(edStartX,edStartY); ctx.lineTo(pos.x,pos.y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(pos.x,pos.y); ctx.lineTo(pos.x-hl*Math.cos(a-Math.PI/6), pos.y-hl*Math.sin(a-Math.PI/6)); ctx.lineTo(pos.x-hl*Math.cos(a+Math.PI/6), pos.y-hl*Math.sin(a+Math.PI/6)); ctx.closePath(); ctx.fillStyle=edColor; ctx.fill(); }
}
function endDraw(e) {
  if (edTool === 'select') { edDragStart = null; return; }
  if (!edDrawing) return; edDrawing = false;
  const pos = getCanvasPos(e);
  const opColor=edColor, opWidth=edLineWidth, opZoom=edZoom;
  if (edTool==='pen'||edTool==='marker') { if (edCurrentPenPath.length>1) pushVectorOp({ type:edTool, points:edCurrentPenPath.slice(), color:opColor, width:opWidth, alpha:edTool==='marker'?0.3:1, zoom:opZoom }); }
  else if (edTool==='eraser') { if (edCurrentPenPath.length>1) pushVectorOp({ type:'eraser', points:edCurrentPenPath.slice(), color:'#ffffff', width:opWidth*3, alpha:1, zoom:opZoom }); }
  else if (edTool==='line') pushVectorOp({ type:'line', x1:edStartX, y1:edStartY, x2:pos.x, y2:pos.y, color:opColor, width:opWidth, zoom:opZoom });
  else if (edTool==='rect') pushVectorOp({ type:'rect', x:edStartX, y:edStartY, w:pos.x-edStartX, h:pos.y-edStartY, color:opColor, width:opWidth, zoom:opZoom });
  else if (edTool==='circle') pushVectorOp({ type:'circle', x1:edStartX, y1:edStartY, x2:pos.x, y2:pos.y, color:opColor, width:opWidth, zoom:opZoom });
  else if (edTool==='arrow') pushVectorOp({ type:'arrow', x1:edStartX, y1:edStartY, x2:pos.x, y2:pos.y, color:opColor, width:opWidth, zoom:opZoom });
  edCurrentPenPath=[]; edSnapshot=null; renderEditorPage();
}
editorCanvas.addEventListener('mousedown', startDraw);
editorCanvas.addEventListener('mousemove', moveDraw);
editorCanvas.addEventListener('mouseup', endDraw);
editorCanvas.addEventListener('mouseleave', endDraw);
editorCanvas.addEventListener('touchstart', startDraw, { passive: false });
editorCanvas.addEventListener('touchmove', moveDraw, { passive: false });
editorCanvas.addEventListener('touchend', endDraw);

/* ==========================================================
   SAVE CHOICE
   ========================================================== */
const saveChoiceOverlay = document.getElementById('saveChoiceOverlay');
const saveChoiceStatus = document.getElementById('saveChoiceStatus');
editorSave.addEventListener('click', () => { if (!edPdfDoc) return; saveChoiceStatus.className='status-msg hidden'; saveChoiceOverlay.classList.add('active'); });
function closeSaveChoice() { saveChoiceOverlay.classList.remove('active'); }
saveChoiceOverlay.addEventListener('click', e => { if (e.target === saveChoiceOverlay) closeSaveChoice(); });

document.getElementById('saveVectorBtn').addEventListener('click', async () => {
  saveChoiceStatus.className='status-msg hidden'; showStatus(saveChoiceStatus, t('common.processing'), 'info');
  try {
    const pdfDoc = await PDFLib.PDFDocument.load(edPdfBytes, { ignoreEncryption: true });
    const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
    function hexToRgb(hex) { const h=hex.replace('#',''); return PDFLib.rgb(parseInt(h.substring(0,2),16)/255, parseInt(h.substring(2,4),16)/255, parseInt(h.substring(4,6),16)/255); }
    const pages = pdfDoc.getPages();
    pages.forEach((page, pageIdx) => {
      const ops = edVectorOps[pageIdx]; if (!ops || !ops.length) return;
      const pageH = page.getSize().height;
      ops.forEach(op => {
        const color = hexToRgb(op.color || '#ef4444');
        const lineWidth = op.width || 4;
        const opZoom = op.zoom || 1;
        const divScale = edBaseScale * opZoom;
        if (op.type === 'pen' || op.type === 'marker') { const alpha = op.type==='marker'?0.3:1; for (let i=1;i<op.points.length;i++) { const p1=op.points[i-1], p2=op.points[i]; page.drawLine({ start:{ x:p1.x/divScale, y:pageH-p1.y/divScale }, end:{ x:p2.x/divScale, y:pageH-p2.y/divScale }, thickness:lineWidth/edBaseScale, color, opacity:alpha }); } }
        else if (op.type === 'eraser') { for (let i=1;i<op.points.length;i++) { const p1=op.points[i-1], p2=op.points[i]; page.drawLine({ start:{ x:p1.x/divScale, y:pageH-p1.y/divScale }, end:{ x:p2.x/divScale, y:pageH-p2.y/divScale }, thickness:lineWidth/edBaseScale, color:PDFLib.rgb(1,1,1) }); } }
        else if (op.type === 'line') { page.drawLine({ start:{ x:op.x1/divScale, y:pageH-op.y1/divScale }, end:{ x:op.x2/divScale, y:pageH-op.y2/divScale }, thickness:lineWidth/edBaseScale, color }); }
        else if (op.type === 'rect') { const k=divScale; const w=op.w/k, h=op.h/k; const cx=(op.x+op.w/2)/k, cy=pageH-(op.y+op.h/2)/k; if (op.rotation) { page.drawRectangle({ x:cx-w/2, y:cy-h/2, width:w, height:h, borderColor:color, borderWidth:lineWidth/edBaseScale, rotate:PDFLib.degrees(-op.rotation*180/Math.PI) }); } else { const cx1=op.x/k, cy1=pageH-op.y/k, cx2=(op.x+op.w)/k, cy2=pageH-(op.y+op.h)/k; page.drawRectangle({ x:Math.min(cx1,cx2), y:Math.min(cy1,cy2), width:Math.abs(cx2-cx1), height:Math.abs(cy2-cy1), borderColor:color, borderWidth:lineWidth/edBaseScale }); } }
        else if (op.type === 'circle') { const x1=op.x1/divScale, y1=pageH-op.y1/divScale, x2=op.x2/divScale, y2=pageH-op.y2/divScale; page.drawEllipse({ x:(x1+x2)/2, y:(y1+y2)/2, xScale:Math.abs(x2-x1)/2, yScale:Math.abs(y2-y1)/2, borderColor:color, borderWidth:lineWidth/edBaseScale }); }
        else if (op.type === 'arrow') { const ax1=op.x1/divScale, ay1=pageH-op.y1/divScale, ax2=op.x2/divScale, ay2=pageH-op.y2/divScale; page.drawLine({ start:{ x:ax1, y:ay1 }, end:{ x:ax2, y:ay2 }, thickness:lineWidth/edBaseScale, color }); const adx=ax2-ax1, ady=ay2-ay1, aangle=Math.atan2(ady,adx); const aheadlen=14/divScale, arrowAngle=Math.PI/7; page.drawLine({ start:{ x:ax2, y:ay2 }, end:{ x:ax2-aheadlen*Math.cos(aangle-arrowAngle), y:ay2-aheadlen*Math.sin(aangle-arrowAngle) }, thickness:lineWidth/edBaseScale, color }); page.drawLine({ start:{ x:ax2, y:ay2 }, end:{ x:ax2-aheadlen*Math.cos(aangle+arrowAngle), y:ay2-aheadlen*Math.sin(aangle+arrowAngle) }, thickness:lineWidth/edBaseScale, color }); }
        else if (op.type === 'text') { const k=divScale; page.drawText(op.text, { x:op.x/k, y:pageH-op.y/k, size:24/edBaseScale, font, color, rotate: op.rotation ? PDFLib.degrees(-op.rotation*180/Math.PI) : undefined }); }
      });
    });
    downloadBlob(new Blob([await pdfDoc.save()], { type:'application/pdf' }), 'edited-text.pdf');
    showStatus(saveChoiceStatus, t('editor.saved'), 'ok'); setTimeout(closeSaveChoice, 1200);
  } catch (err) { console.error(err); showStatus(saveChoiceStatus, t('common.error') + err.message, 'err'); }
});

document.getElementById('saveRasterBtn').addEventListener('click', async () => {
  saveChoiceStatus.className='status-msg hidden'; showStatus(saveChoiceStatus, t('common.processing'), 'info');
  try {
    const outDoc = await PDFLib.PDFDocument.create();
    const savedPage=edCurrentPage, savedZoom=edZoom;
    edZoom = 1;
    for (let i=0;i<edTotalPages;i++) { edCurrentPage=i; await renderEditorPage(); const dataUrl=editorCanvas.toDataURL('image/png'); const pngBytes=await (await fetch(dataUrl)).arrayBuffer(); const png=await outDoc.embedPng(pngBytes); const pageW=edCanvasWidth/edBaseScale, pageH=edCanvasHeight/edBaseScale; const page=outDoc.addPage([pageW, pageH]); page.drawImage(png, { x:0, y:0, width:pageW, height:pageH }); }
    edCurrentPage=savedPage; edZoom=savedZoom; await renderEditorPage();
    downloadBlob(new Blob([await outDoc.save()], { type:'application/pdf' }), 'edited-image.pdf');
    showStatus(saveChoiceStatus, t('editor.saved'), 'ok'); setTimeout(closeSaveChoice, 1200);
  } catch (err) { console.error(err); showStatus(saveChoiceStatus, t('common.error') + err.message, 'err'); }
});
