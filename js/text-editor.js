/* ==========================================================
   TEXT EDITOR
   ========================================================== */
const textEditorOverlay = document.getElementById('textEditorOverlay');
const textEditorDropZone = document.getElementById('textEditorDropZone');
const textEditorFileInput = document.getElementById('textEditorFileInput');
const textEditorContent = document.getElementById('textEditorContent');
const textEditorCanvas = document.getElementById('textEditorCanvas');
const textEditorStatus = document.getElementById('textEditorStatus');
const teScroll = document.getElementById('teScroll');
const teZoomLevel = document.getElementById('teZoomLevel');
const teFormatPanel = document.getElementById('teFormatPanel');
const fmtFont=document.getElementById('fmtFont');
const fmtSize=document.getElementById('fmtSize');
const fmtBold=document.getElementById('fmtBold');
const fmtItalic=document.getElementById('fmtItalic');
const fmtColor=document.getElementById('fmtColor');
const fmtApply=document.getElementById('fmtApply');
const fmtCancel=document.getElementById('fmtCancel');
let tePdfBytes=null, tePdfDoc=null, teTotalPages=0, teCurrentPage=0;
let teBaseScale=1.5, teZoom=1;
let teFont='Helvetica', teSize=16, teColor='#1e293b';
let teItems=[], teMode='text', teDrawingBox=false;
let teBoxStartX=0, teBoxStartY=0, teBoxSnapshot=null;
const tePageTextCache = {};

function openTextEditor() { textEditorOverlay.classList.add('active'); tePdfBytes=null; tePdfDoc=null; teTotalPages=0; teCurrentPage=0; teZoom=1; teItems=[]; teFormatPanel.classList.remove('active'); Object.keys(tePageTextCache).forEach(k => delete tePageTextCache[k]); textEditorContent.classList.add('hidden'); textEditorDropZone.style.display='block'; textEditorStatus.className='status-msg hidden'; updateTeZoomUI(); }
function closeTextEditor() { PageText.finish(); textEditorOverlay.classList.remove('active'); }
textEditorOverlay.addEventListener('click', e => { if (e.target === textEditorOverlay) closeTextEditor(); });
function updateTeZoomUI() { if (teZoomLevel) teZoomLevel.textContent = Math.round(teZoom * 100) + '%'; }
textEditorDropZone.addEventListener('click', () => textEditorFileInput.click());
textEditorDropZone.addEventListener('dragover', e => { e.preventDefault(); textEditorDropZone.classList.add('dragover'); });
textEditorDropZone.addEventListener('dragleave', () => textEditorDropZone.classList.remove('dragover'));
textEditorDropZone.addEventListener('drop', async e => { e.preventDefault(); textEditorDropZone.classList.remove('dragover'); const f=[...e.dataTransfer.files].find(x => x.name.toLowerCase().endsWith('.pdf')); if (f) await loadTextEditorPdf(f); });
textEditorFileInput.addEventListener('change', async e => { if (e.target.files[0]) await loadTextEditorPdf(e.target.files[0]); textEditorFileInput.value = ''; });
async function loadTextEditorPdf(file) {
  try {
    showStatus(textEditorStatus, t('common.processing'), 'info');
    tePdfBytes = new Uint8Array(await file.arrayBuffer());
    tePdfDoc = await pdfjsLib.getDocument({ data: tePdfBytes.slice() }).promise;
    teTotalPages = tePdfDoc.numPages; teCurrentPage = 0;
    Object.keys(tePageTextCache).forEach(k => delete tePageTextCache[k]);
    textEditorContent.classList.remove('hidden'); textEditorDropZone.style.display='none';
    showStatus(textEditorStatus, '', 'info');
    await renderTextEditorPage();
  } catch (err) { console.error(err); showStatus(textEditorStatus, t('common.error') + err.message, 'err'); }
}
async function getPageTextItems(pageNum) {
  if (tePageTextCache[pageNum]) return tePageTextCache[pageNum];
  const page = await tePdfDoc.getPage(pageNum + 1);
  const content = await page.getTextContent();
  const items = content.items.map(it => { const tx=it.transform; return { str:it.str, x:tx[4], y:tx[5], width:it.width, height:it.height, fontSize:Math.hypot(tx[2],tx[3])||Math.abs(tx[3])||12 }; });
  tePageTextCache[pageNum] = items; return items;
}
function buildCanvasFont(it) {
  const fs = it.size * teBaseScale * teZoom;
  const style = it.italic ? 'italic ' : '';
  const weight = it.bold ? '700 ' : '400 ';
  const familyMap = { 'Helvetica':'Arial, Helvetica, sans-serif', 'TimesRoman':'"Times New Roman", Times, serif', 'Courier':'"Courier New", monospace' };
  return style + weight + fs + 'px ' + (familyMap[it.font] || 'sans-serif');
}
async function renderTextEditorPage() {
  const page = await tePdfDoc.getPage(teCurrentPage + 1);
  const scale = teBaseScale * teZoom;
  const viewport = page.getViewport({ scale });
  textEditorCanvas.width = viewport.width; textEditorCanvas.height = viewport.height;
  textEditorCanvas.style.width = viewport.width+'px'; textEditorCanvas.style.height = viewport.height+'px';
  const ctx = textEditorCanvas.getContext('2d');
  ctx.fillStyle='#fff'; ctx.fillRect(0,0,textEditorCanvas.width,textEditorCanvas.height);
  await page.render({ canvasContext: ctx, viewport }).promise;
  teItems.filter(it => it.page === teCurrentPage).forEach(it => {
    if (it.kind === 'whiteout' || it.kind === 'redact') { ctx.fillStyle = it.kind==='whiteout' ? '#ffffff' : '#000000'; ctx.fillRect(it.x*teZoom, it.y*teZoom, it.w*teZoom, it.h*teZoom); }
    else { ctx.font = buildCanvasFont(it); ctx.fillStyle = it.color; ctx.textBaseline = 'alphabetic'; ctx.fillText(it.text, it.x*teZoom, it.y*teZoom); }
  });
  const counter = document.getElementById('tePageCounter'); if (counter) counter.textContent=(teCurrentPage+1)+' / '+teTotalPages;
  document.getElementById('tePagePrev').disabled = teCurrentPage === 0;
  document.getElementById('tePageNext').disabled = teCurrentPage === teTotalPages-1;
  updateTeZoomUI();
}
document.querySelectorAll('.te-mode-btn').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.te-mode-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); teMode=btn.dataset.temode; textEditorCanvas.style.cursor = teMode==='text'?'text':'crosshair'; if (teMode!=='text') hideFormatPanel(); }); });
document.getElementById('teFont').addEventListener('change', e => { teFont=e.target.value; });
document.getElementById('teSize').addEventListener('input', e => { teSize = parseInt(e.target.value, 10) || 16; });
document.querySelectorAll('[data-tecolor]').forEach(c => { c.addEventListener('click', () => { document.querySelectorAll('[data-tecolor]').forEach(x => x.classList.remove('active')); c.classList.add('active'); teColor=c.dataset.tecolor; }); });
window.addEventListener('wheel', e => { if (!textEditorOverlay.classList.contains('active')) return; if (!e.ctrlKey && !e.metaKey) return; e.preventDefault(); e.stopPropagation(); teZoom = (e.deltaY<0) ? Math.min(3, teZoom+0.15) : Math.max(0.5, teZoom-0.15); renderTextEditorPage(); }, { passive: false, capture: true });
document.getElementById('teUndo').addEventListener('click', async () => { const items=teItems.filter(it => it.page === teCurrentPage); if (!items.length) return; const last=items[items.length-1]; teItems.splice(teItems.indexOf(last), 1); await renderTextEditorPage(); });
document.getElementById('teClear').addEventListener('click', async () => { teItems = teItems.filter(it => it.page !== teCurrentPage); await renderTextEditorPage(); });
document.getElementById('tePagePrev').addEventListener('click', async () => { if (teCurrentPage>0) { teCurrentPage--; hideFormatPanel(); await renderTextEditorPage(); } });
document.getElementById('tePageNext').addEventListener('click', async () => { if (teCurrentPage<teTotalPages-1) { teCurrentPage++; hideFormatPanel(); await renderTextEditorPage(); } });
document.getElementById('teZoomIn').addEventListener('click', async () => { teZoom=Math.min(3,teZoom+0.25); await renderTextEditorPage(); });
document.getElementById('teZoomOut').addEventListener('click', async () => { teZoom=Math.max(0.5,teZoom-0.25); await renderTextEditorPage(); });
document.getElementById('teZoomReset').addEventListener('click', async () => { teZoom=1; await renderTextEditorPage(); });

function showFormatPanel(hit, detectedSizePt) {
  teEditingHit=hit;
  fmtFont.value=teFont; fmtSize.value=Math.max(6, Math.min(120, Math.round(detectedSizePt)));
  fmtColor.value = teColor.startsWith('#') ? teColor : '#000000';
  document.getElementById('teFormatPanelLabel').textContent = t('fmt.editing') + ' "' + hit.str.slice(0,30) + '"';
  teFormatPanel.classList.add('active');
}
function hideFormatPanel() { teFormatPanel.classList.remove('active'); }
fmtBold.addEventListener('click', () => { fmtBold.classList.toggle('active'); });
fmtItalic.addEventListener('click', () => { fmtItalic.classList.toggle('active'); });
fmtApply.addEventListener('click', () => applyFormatting());
fmtCancel.addEventListener('click', () => hideFormatPanel());

let teEditingHit = null;
function applyFormatting() {
  if (!teEditingHit) return;
  const hit=teEditingHit;
  const newFont=fmtFont.value;
  const newSize=Math.max(6, Math.min(120, parseInt(fmtSize.value, 10) || 16));
  const newColor=fmtColor.value;
  const newBold=fmtBold.classList.contains('active');
  const newItalic=fmtItalic.classList.contains('active');
  const baseH = textEditorCanvas.height / teZoom;
  const bottomBase = baseH - hit.y;
  const topBase = bottomBase - (hit.height || hit.fontSize);
  const leftBase = hit.x;
  const rightBase = hit.x + hit.width;
  teItems.push({ kind:'whiteout', page:teCurrentPage, x:leftBase, y:topBase, w:(rightBase-leftBase)+2, h:(bottomBase-topBase)+2 });
  teItems.push({ kind:'text', page:teCurrentPage, x:leftBase, y:bottomBase, text:hit.str, font:newFont, size:newSize, color:newColor, bold:newBold, italic:newItalic });
  renderTextEditorPage(); hideFormatPanel();
  showStatus(textEditorStatus, '✅ ' + t('fmt.apply'), 'ok');
}

textEditorCanvas.addEventListener('click', async e => {
 if(!tePdfDoc || teMode!=='text' || teDrawingBox)return;
 PageText.finish();
 const rect=textEditorCanvas.getBoundingClientRect();
 const canvasX=(e.clientX-rect.left)*textEditorCanvas.width/rect.width;
 const canvasY=(e.clientY-rect.top)*textEditorCanvas.height/rect.height;
 const px=canvasX/teZoom,py=canvasY/teZoom;
 const pageIndex=teCurrentPage;
 const items=await getPageTextItems(pageIndex);
 if(pageIndex!==teCurrentPage)return;
 const baseH=textEditorCanvas.height/teZoom;
 let hit=null;
 for(const item of items){
  const bottom=baseH-item.y,top=bottom-(item.height||item.fontSize);
  if(px>=item.x && px<=item.x+item.width && py>=top-2 && py<=bottom+2){hit=item;break;}
 }
 const x=hit?hit.x:px,y=hit?baseH-hit.y:py;
 if(hit){teSize=Math.max(8,Math.min(72,Math.round(hit.fontSize*.75)));document.getElementById('teSize').value=teSize;}
 const style={font:teFont,size:teSize,color:teColor};
 // Temporarily cover the old glyphs while editing; Escape restores the page.
 if(hit){const ctx=textEditorCanvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(x*teZoom,(y-(hit.height||hit.fontSize))*teZoom,(hit.width+2)*teZoom,((hit.height||hit.fontSize)+2)*teZoom);}
 const families={Helvetica:'Arial, Helvetica, sans-serif',TimesRoman:'"Times New Roman", Times, serif',Courier:'"Courier New", monospace'};
 PageText.start({canvas:textEditorCanvas,parent:teScroll,x:x*teZoom,y:y*teZoom,
  font:(style.size*teBaseScale*teZoom)+'px '+(families[style.font]||'sans-serif'),color:style.color,
  value:hit?hit.str:'',select:!!hit,
  commit(text){
   if(hit && text===hit.str){renderTextEditorPage();return;}
   if(hit)teItems.push({kind:'whiteout',page:pageIndex,x,y:y-(hit.height||hit.fontSize),w:hit.width+2,h:(hit.height||hit.fontSize)+2});
   if(text.trim())teItems.push({kind:'text',page:pageIndex,x,y,text,font:style.font,size:style.size,color:style.color});
   renderTextEditorPage();
  },cancel(){renderTextEditorPage();}
 });
});
function teGetCanvasPos(e) {
  const rect=textEditorCanvas.getBoundingClientRect();
  const scaleX=textEditorCanvas.width/rect.width, scaleY=textEditorCanvas.height/rect.height;
  let px, py;
  if (e.touches && e.touches.length) { px=e.touches[0].clientX-rect.left; py=e.touches[0].clientY-rect.top; }
  else if (e.changedTouches && e.changedTouches.length) { px=e.changedTouches[0].clientX-rect.left; py=e.changedTouches[0].clientY-rect.top; }
  else { px=e.clientX-rect.left; py=e.clientY-rect.top; }
  return { x:(px*scaleX)/teZoom, y:(py*scaleY)/teZoom };
}
textEditorCanvas.addEventListener('mousedown', e => { if (teMode!=='whiteout' && teMode!=='redact') return; if (!tePdfDoc) return; e.preventDefault(); teDrawingBox=true; const ctx=textEditorCanvas.getContext('2d'); teBoxSnapshot=ctx.getImageData(0,0,textEditorCanvas.width,textEditorCanvas.height); const pos=teGetCanvasPos(e); teBoxStartX=pos.x; teBoxStartY=pos.y; });
textEditorCanvas.addEventListener('mousemove', e => { if (!teDrawingBox) return; e.preventDefault(); const ctx=textEditorCanvas.getContext('2d'); ctx.putImageData(teBoxSnapshot,0,0); const pos=teGetCanvasPos(e); ctx.fillStyle = teMode==='whiteout'?'#ffffff':'#000000'; ctx.fillRect(Math.min(teBoxStartX,pos.x)*teZoom, Math.min(teBoxStartY,pos.y)*teZoom, Math.abs(pos.x-teBoxStartX)*teZoom, Math.abs(pos.y-teBoxStartY)*teZoom); });
textEditorCanvas.addEventListener('mouseup', e => { if (!teDrawingBox) return; teDrawingBox=false; const pos=teGetCanvasPos(e); const x=Math.min(teBoxStartX,pos.x), y=Math.min(teBoxStartY,pos.y); const w=Math.abs(pos.x-teBoxStartX), h=Math.abs(pos.y-teBoxStartY); if (w<4||h<4) { renderTextEditorPage(); return; } teItems.push({ kind: teMode==='whiteout'?'whiteout':'redact', page:teCurrentPage, x, y, w, h }); renderTextEditorPage(); });
textEditorCanvas.addEventListener('mouseleave', () => { if (teDrawingBox) { teDrawingBox=false; renderTextEditorPage(); } });

document.getElementById('teSaveBtn').addEventListener('click', async () => {
  if (!tePdfDoc) { showStatus(textEditorStatus, t('text.needPDF'), 'err'); return; }
  try {
    showStatus(textEditorStatus, t('common.processing'), 'info');
    const { PDFDocument, rgb, StandardFonts } = PDFLib;
    const pdfDoc = await PDFDocument.load(tePdfBytes, { ignoreEncryption: true });
    function hexToRgb(hex) { const h=hex.replace('#',''); return rgb(parseInt(h.substring(0,2),16)/255, parseInt(h.substring(2,4),16)/255, parseInt(h.substring(4,6),16)/255); }
    const FONTS = {
      'Helvetica': { regular:StandardFonts.Helvetica, bold:StandardFonts.HelveticaBold, italic:StandardFonts.HelveticaOblique, boldItalic:StandardFonts.HelveticaBoldOblique },
      'TimesRoman': { regular:StandardFonts.TimesRoman, bold:StandardFonts.TimesRomanBold, italic:StandardFonts.TimesRomanItalic, boldItalic:StandardFonts.TimesRomanBoldItalic },
      'Courier': { regular:StandardFonts.Courier, bold:StandardFonts.CourierBold, italic:StandardFonts.CourierOblique, boldItalic:StandardFonts.CourierBoldOblique }
    };
    const embedded = {};
    async function getFont(name, bold, italic) {
      const key = name+'|'+(bold?1:0)+(italic?1:0);
      if (embedded[key]) return embedded[key];
      const map = FONTS[name] || FONTS['Helvetica'];
      let stdName = map.regular;
      if (bold && italic) stdName = map.boldItalic; else if (bold) stdName = map.bold; else if (italic) stdName = map.italic;
      const f = await pdfDoc.embedFont(stdName); embedded[key] = f; return f;
    }
    const pages = pdfDoc.getPages(); const scaleDiv = teBaseScale;
    for (const item of teItems) {
      const page = pages[item.page]; if (!page) continue;
      const { height: pageH } = page.getSize();
      if (item.kind === 'whiteout' || item.kind === 'redact') {
        const color = item.kind==='whiteout' ? rgb(1,1,1) : rgb(0,0,0);
        page.drawRectangle({ x:item.x/scaleDiv, y:pageH - (item.y+item.h)/scaleDiv, width:item.w/scaleDiv, height:item.h/scaleDiv, color });
      } else {
        const font = await getFont(item.font, item.bold, item.italic);
        page.drawText(item.text, { x:item.x/scaleDiv, y:pageH - item.y/scaleDiv, size:item.size, font, color:hexToRgb(item.color) });
      }
    }
    const bytes = await pdfDoc.save();
    downloadBlob(new Blob([bytes], { type:'application/pdf' }), 'text-edited.pdf');
    showStatus(textEditorStatus, t('common.done'), 'ok');
  } catch (err) { console.error(err); showStatus(textEditorStatus, t('common.error') + err.message, 'err'); }
});
