async function toolMerge() {
  const merged = await PDFLib.PDFDocument.create();
  let completedFiles = 0;
  for (const file of currentFiles) {
    await ProductUX.step();
    const bytes = await file.arrayBuffer();
    const pdf = await PDFLib.PDFDocument.load(bytes);
    const selection = ProductUX.selection(file, pdf.getPageCount());
    const pages = await merged.copyPages(pdf, selection);
    pages.forEach(p => merged.addPage(p));
    await ProductUX.step(++completedFiles, currentFiles.length, 'files');
  }
  downloadBlob(new Blob([await merged.save()], { type: 'application/pdf' }), 'merged.pdf');
}
async function toolSplit() { return ProTools.split(); }

async function toolExtract() {
  const rangeStr = document.getElementById('pageRange').value;
  const src = await PDFLib.PDFDocument.load(await currentFiles[0].arrayBuffer());
  const idx = parseRange(rangeStr, src.getPageCount());
  if (!idx.length) throw new Error('No valid pages');
  const out = await PDFLib.PDFDocument.create();
  const pages = await out.copyPages(src, idx);
  pages.forEach(p => out.addPage(p));
  downloadBlob(new Blob([await out.save()], { type: 'application/pdf' }), 'extracted.pdf');
}
async function toolCompress() { return ProTools.compress(); }

async function toolRotate() { return ProTools.rotate(); }

async function toolWatermark() { return ProTools.watermark(); }

async function toolPageNum() { return ProTools.numbers(); }

async function toolExcel2Pdf() { return ProTools.workbook(); }

async function toolPdf2Excel() { return ProTools.excel(); }

async function toolWord2Pdf() { return ProTools.word(); }

async function toolImg2Pdf() { return ProTools.images(); }

async function toolProtect() { return ProTools.protect(); }

async function toolMetadata() { return ProTools.metadata(); }

async function toolPdf2Jpg() { return ProTools.jpg(); }

async function toolPdf2Word() { return ProTools.docx(); }
