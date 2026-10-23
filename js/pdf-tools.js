async function toolMerge() {
  const merged = await PDFLib.PDFDocument.create();
  let completedFiles = 0;
  for (const file of currentFiles) {
    await ProductUX.step();
    const bytes = await file.arrayBuffer();
    const pdf = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
    const selection = ProductUX.selection(file, pdf.getPageCount());
    const pages = await merged.copyPages(pdf, selection);
    pages.forEach(p => merged.addPage(p));
    await ProductUX.step(++completedFiles, currentFiles.length, 'files');
  }
  downloadBlob(new Blob([await merged.save()], { type: 'application/pdf' }), 'merged.pdf');
}
async function toolSplit() {
  const rangeStr = document.getElementById('pageRange').value;
  const src = await PDFLib.PDFDocument.load(await currentFiles[0].arrayBuffer(), { ignoreEncryption: true });
  const idx = parseRange(rangeStr, src.getPageCount());
  if (!idx.length) throw new Error('No valid pages');
  const out = await PDFLib.PDFDocument.create();
  const pages = await out.copyPages(src, idx);
  pages.forEach(p => out.addPage(p));
  downloadBlob(new Blob([await out.save()], { type: 'application/pdf' }), 'split.pdf');
}
async function toolExtract() {
  const rangeStr = document.getElementById('pageRange').value;
  const src = await PDFLib.PDFDocument.load(await currentFiles[0].arrayBuffer(), { ignoreEncryption: true });
  const idx = parseRange(rangeStr, src.getPageCount());
  if (!idx.length) throw new Error('No valid pages');
  const out = await PDFLib.PDFDocument.create();
  const pages = await out.copyPages(src, idx);
  pages.forEach(p => out.addPage(p));
  downloadBlob(new Blob([await out.save()], { type: 'application/pdf' }), 'extracted.pdf');
}
async function toolCompress() {
  const src = await PDFLib.PDFDocument.load(await currentFiles[0].arrayBuffer(), { ignoreEncryption: true });
  const bytes = await src.save({ useObjectStreams: true });
  downloadBlob(new Blob([bytes], { type: 'application/pdf' }), 'compressed.pdf');
}
async function toolRotate() {
  const angle = parseInt(document.getElementById('rotateAngle').value, 10);
  const src = await PDFLib.PDFDocument.load(await currentFiles[0].arrayBuffer(), { ignoreEncryption: true });
  src.getPages().forEach(p => p.setRotation(PDFLib.degrees(angle)));
  downloadBlob(new Blob([await src.save()], { type: 'application/pdf' }), 'rotated.pdf');
}
async function toolWatermark() {
  const text = document.getElementById('wmText').value || 'CONFIDENTIAL';
  const opacity = parseFloat(document.getElementById('wmOpacity').value) || 0.3;
  const src = await PDFLib.PDFDocument.load(await currentFiles[0].arrayBuffer(), { ignoreEncryption: true });
  const font = await src.embedFont(PDFLib.StandardFonts.HelveticaBold);
  src.getPages().forEach(page => {
    const wh = page.getSize();
    page.drawText(text, { x: wh.width/4, y: wh.height/2, size: 60, font, color: PDFLib.rgb(0.5,0.5,0.5), opacity, rotate: PDFLib.degrees(45) });
  });
  downloadBlob(new Blob([await src.save()], { type: 'application/pdf' }), 'watermarked.pdf');
}
async function toolPageNum() {
  const pos = document.getElementById('pnPosition').value;
  const src = await PDFLib.PDFDocument.load(await currentFiles[0].arrayBuffer(), { ignoreEncryption: true });
  const font = await src.embedFont(PDFLib.StandardFonts.Helvetica);
  const pages = src.getPages();
  pages.forEach((page, i) => {
    const label = (i + 1) + ' / ' + pages.length;
    const w = page.getSize().width;
    const tw = font.widthOfTextAtSize(label, 12);
    let x = (w - tw) / 2;
    if (pos === 'bottom-right') x = w - tw - 40;
    if (pos === 'bottom-left') x = 40;
    page.drawText(label, { x, y: 20, size: 12, font, color: PDFLib.rgb(0.3,0.3,0.3) });
  });
  downloadBlob(new Blob([await src.save()], { type: 'application/pdf' }), 'numbered.pdf');
}
async function toolExcel2Pdf() {
  const jsPDF = window.jspdf.jsPDF;
  const workbook = XLSX.read(await currentFiles[0].arrayBuffer(), { type: 'array' });
  const doc = new jsPDF({ orientation: 'landscape' });
  let first = true;
  workbook.SheetNames.forEach(sheetName => {
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: '' });
    if (!first) doc.addPage(); first = false;
    doc.setFontSize(14); doc.text(sheetName, 14, 14);
    doc.autoTable({ head: rows.length ? [rows[0]] : [], body: rows.slice(1), startY: 20, styles: { fontSize: 9 }, headStyles: { fillColor: [79,70,229] } });
  });
  downloadBlob(doc.output('blob'), 'excel.pdf');
}
async function toolPdf2Excel() {
  const pdf = await pdfjsLib.getDocument({ data: await currentFiles[0].arrayBuffer() }).promise;
  const allRows = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    await ProductUX.step(i-1, pdf.numPages);
    const content = await (await pdf.getPage(i)).getTextContent();
    const lines = {};
    content.items.forEach(item => {
      const y = Math.round(item.transform[5]);
      if (!lines[y]) lines[y] = [];
      lines[y].push({ x: item.transform[4], text: item.str });
    });
    Object.keys(lines).map(Number).sort((a,b)=>b-a).forEach(y => {
      lines[y].sort((a,b)=>a.x-b.x);
      const row = lines[y].map(o => o.text).join(' ').trim();
      if (row) allRows.push([row]);
    });
    allRows.push(['--- Page ' + i + ' ---']);
  }
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(allRows), 'Extracted');
  downloadBlob(new Blob([XLSX.write(wb, {bookType:'xlsx',type:'array'})], {type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}), 'extracted.xlsx');
}
async function toolWord2Pdf() {
  const jsPDF = window.jspdf.jsPDF;
  const result = await mammoth.extractRawText({ arrayBuffer: await currentFiles[0].arrayBuffer() });
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  doc.setFontSize(11);
  const margin = 40, pw = doc.internal.pageSize.getWidth(), ph = doc.internal.pageSize.getHeight();
  const lines = doc.splitTextToSize(result.value || '', pw - margin * 2);
  let y = margin;
  lines.forEach(line => { if (y > ph - margin) { doc.addPage(); y = margin; } doc.text(line, margin, y); y += 16; });
  downloadBlob(doc.output('blob'), 'word.pdf');
}
async function toolImg2Pdf() {
  const pdf = await PDFLib.PDFDocument.create();
  for (const file of currentFiles) {
    await ProductUX.step();
    const bytes = await file.arrayBuffer();
    const img = file.type === 'image/png' ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
    const page = pdf.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  }
  downloadBlob(new Blob([await pdf.save()], { type: 'application/pdf' }), 'images.pdf');
}
async function toolProtect() {
  const password = document.getElementById('pdfPassword').value;
  if (!password) throw new Error('Password required');
  const src = await PDFLib.PDFDocument.load(await currentFiles[0].arrayBuffer(), { ignoreEncryption: true });
  const bytes = await src.save({ userPassword: password, ownerPassword: password });
  downloadBlob(new Blob([bytes], { type: 'application/pdf' }), 'protected.pdf');
}
async function toolMetadata() {
  const src = await PDFLib.PDFDocument.load(await currentFiles[0].arrayBuffer(), { ignoreEncryption: true });
  const title = document.getElementById('metaTitle').value;
  const author = document.getElementById('metaAuthor').value;
  const subject = document.getElementById('metaSubject').value;
  if (title) src.setTitle(title);
  if (author) src.setAuthor(author);
  if (subject) src.setSubject(subject);
  downloadBlob(new Blob([await src.save()], { type: 'application/pdf' }), 'metadata.pdf');
}
async function toolPdf2Jpg() {
  const buffer = await currentFiles[0].arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const total = pdf.numPages;
  if (total === 1) {
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width; canvas.height = viewport.height;
    const ctx = canvas.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0,0,canvas.width,canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
    const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.92));
    downloadBlob(blob, 'page-1.jpg'); return;
  }
  const zip = new JSZip();
  for (let i = 1; i <= total; i++) {
    await ProductUX.step(i-1, total);
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas'); canvas.width = viewport.width; canvas.height = viewport.height;
    const ctx = canvas.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0,0,canvas.width,canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    zip.file('page-' + String(i).padStart(3,'0') + '.jpg', dataUrl.split(',')[1], { base64: true });
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(blob, 'pdf-pages.zip');
}
async function toolPdf2Word() {
  const buffer = await currentFiles[0].arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  let html = '<html><head><meta charset="utf-8"></head><body>';
  for (let i = 1; i <= pdf.numPages; i++) {
    await ProductUX.step(i-1, pdf.numPages);
    const content = await (await pdf.getPage(i)).getTextContent();
    const lines = {};
    content.items.forEach(item => {
      const y = Math.round(item.transform[5]);
      if (!lines[y]) lines[y] = [];
      lines[y].push({ x: item.transform[4], text: item.str });
    });
    Object.keys(lines).map(Number).sort((a,b)=>b-a).forEach(y => {
      lines[y].sort((a,b)=>a.x-b.x);
      const row = lines[y].map(o => o.text).join(' ').trim();
      if (row) html += '<p>' + row.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</p>';
    });
    if (i < pdf.numPages) html += '<br style="page-break-before:always">';
  }
  html += '</body></html>';
  downloadBlob(new Blob([html], { type: 'application/msword' }), 'extracted.doc');
}
