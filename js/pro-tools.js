/* Stronger tool options and implementations. All processing stays local. */
const ProTools=(()=>{
 const lang=()=>document.documentElement.lang;
 const L=(ru,en)=>lang()==='ru'?ru:en;
 const $=id=>document.getElementById(id);
 const val=(id,fallback='')=>$(id)?.value??fallback;
 const checked=id=>!!$(id)?.checked;
 const number=(id,fallback,min,max)=>{const n=Number(val(id,String(fallback)));if(!Number.isFinite(n)||n<min||n>max)throw new Error(L('Проверьте значение: ','Check value: ')+id);return n;};
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
 const options=(id,items)=>'<select id="'+id+'">'+items.map(([v,t])=>'<option value="'+v+'">'+t+'</option>').join('')+'</select>';
 const field=(text,html)=>'<label>'+text+'</label>'+html;
 const range=()=>field(L('Страницы (пусто — все)','Pages (blank = all)'),'<input id="operationPages" placeholder="1-3,5">');
 const selectPages=count=>parseRange(val('operationPages'),count);
 const originalBuild=buildToolForm;
 buildToolForm=function(tool){
  let html=originalBuild(tool),extra='';
  const notice=(ru,en)=>'<p class="ux-note">'+L(ru,en)+'</p>';
  if(tool.id==='protect'){
   html=html.replace('type="text" id="pdfPassword"','type="password" autocomplete="new-password" id="pdfPassword"');
   extra+=field(L('Повторите пароль','Confirm password'),'<input type="password" autocomplete="new-password" id="pdfPasswordAgain">')+notice('Настоящее шифрование AES-256. Пароль потребуется для открытия. Не забывайте пароль: восстановление не предусмотрено.','AES-256 encryption. Opening the file requires this password. There is no password recovery.');
  }
  if(tool.id==='compress')extra+=field(L('Режим','Mode'),options('compressionMode',[['lossless',L('Без потери качества — QPDF','Lossless — QPDF')],['images',L('Сильнее: страницы как JPEG','Smaller: pages as JPEG')]]))+field('DPI',options('compressionDpi',[['144','144'],['96','96'],['216','216']]))+field(L('Качество JPEG (0.5–1)','JPEG quality (0.5–1)'),'<input id="compressionQuality" type="number" min="0.5" max="1" step="0.05" value="0.8">')+notice('Режим JPEG удаляет поисковый текст, формы, ссылки и подписи. Используйте его только для визуальной копии.','JPEG mode removes searchable text, forms, links and signatures. Use only for a visual copy.')+'<label><input type="checkbox" id="lossyConsent"> '+L('Понимаю потери режима JPEG','I understand the losses of JPEG mode')+'</label>';
  if(tool.id==='split')extra+=field(L('Результат','Output'),options('splitMode',[['selection',L('Выбранные страницы в один PDF','Selected pages in one PDF')],['each',L('Отдельный PDF на страницу, ZIP','One PDF per page, ZIP')]]));
  if(['rotate','watermark','pagenum','pdf2jpg'].includes(tool.id))extra+=range();
  if(tool.id==='watermark')extra+=field(L('Размер шрифта, pt','Font size, pt'),'<input id="wmSize" type="number" min="6" max="200" value="48">')+field(L('Положение','Position'),options('wmPosition',[['center',L('По центру','Center')],['top',L('Вверху','Top')],['bottom',L('Внизу','Bottom')]]))+field(L('Поворот, градусы','Rotation, degrees'),'<input id="wmAngle" type="number" min="-180" max="180" value="35">');
  if(tool.id==='pagenum')extra+=field(L('Первый номер','First number'),'<input id="pnStart" type="number" min="1" max="1000000" value="1">')+field(L('Формат: {n} — номер, {total} — всего','Format: {n} number, {total} total'),'<input id="pnFormat" value="{n} / {total}" maxlength="120">');
  if(tool.id==='metadata')extra+='<label><input type="checkbox" id="metaClear"> '+L('Удалить стандартные метаданные и XMP','Remove standard metadata and XMP')+'</label>';
  if(tool.id==='pdf2jpg')extra+=field('DPI',options('jpgDpi',[['144','144'],['96','96'],['216','216'],['288','288']]))+field(L('Качество JPEG (0.5–1)','JPEG quality (0.5–1)'),'<input id="jpgQuality" type="number" min="0.5" max="1" step="0.05" value="0.92">');
  if(tool.id==='img2pdf')extra+=field(L('Размер страницы','Page size'),options('imagePaper',[['a4','A4'],['a3','A3'],['original',L('По размеру изображения','Original image size')]]))+field(L('Ориентация','Orientation'),options('imageOrientation',[['auto',L('Автоматически','Automatic')],['portrait',L('Книжная','Portrait')],['landscape',L('Альбомная','Landscape')]]))+field(L('Поля, pt','Margins, pt'),'<input id="imageMargin" type="number" min="0" max="100" value="24">');
  if(tool.id==='pdf2word')extra+=notice('Результат — настоящий DOCX с редактируемым извлечённым текстом и разрывами страниц. Сложная вёрстка и изображения не восстанавливаются. Для сканов без текста нужен OCR.','Creates a real DOCX with editable extracted text and page breaks. Complex layout and images are not reconstructed. Image-only scans require OCR.');
  if(tool.id==='pdf2excel')extra+=field(L('Извлечение','Extraction'),options('excelExtraction',[['columns',L('Столбцы по координатам текста','Columns from text coordinates')],['lines',L('Строки текста','Text lines')]]))+notice('Отдельный лист для каждой страницы. Это эвристика: проверьте объединённые ячейки и сложные таблицы.','One sheet per page. Extraction is heuristic: review merged cells and complex tables.');
  if(tool.id==='excel2pdf'||tool.id==='word2pdf')extra+=field(L('Размер страницы','Page size'),options('officePaper',[['a4','A4'],['a3','A3']]))+field(L('Ориентация','Orientation'),options('officeOrientation',[[tool.id==='excel2pdf'?'landscape':'portrait',tool.id==='excel2pdf'?L('Альбомная','Landscape'):L('Книжная','Portrait')],[tool.id==='excel2pdf'?'portrait':'landscape',tool.id==='excel2pdf'?L('Книжная','Portrait'):L('Альбомная','Landscape')]]));
  if(tool.id==='word2pdf')extra+=notice('Переносятся абзацы, заголовки, списки, обычные таблицы и встроенные изображения DOCX. Колонтитулы, сложные стили и точная пагинация Word не гарантируются.','Converts paragraphs, headings, lists, basic tables and embedded DOCX images. Headers, complex styling and exact Word pagination are not guaranteed.');
  extra+=field(L('Имя результата (без расширения)','Output name (without extension)'),'<input id="outputName" maxlength="100" placeholder="'+L('Необязательно','Optional')+'">');
  return html.replace('<button class="btn" id="runBtn"','<div class="options pro-options">'+extra+'</div><button class="btn" id="runBtn"');
 };
 const originalDownload=downloadBlob;
 downloadBlob=function(blob,name){const custom=val('outputName').trim();if(custom&&overlay.classList.contains('active')){const ext=name.split('.').pop();name=custom.replace(/[<>:"/\\|?*\x00-\x1f]/g,'_').replace(/\.+$/,'')+'.'+ext;}return originalDownload(blob,name);};
 const originalClose=closeModal;closeModal=function(){document.querySelectorAll('#modalBody input[type=password]').forEach(x=>x.value='');return originalClose();};
 async function protect(){
  const password=val('pdfPassword'),confirm=val('pdfPasswordAgain');if(!password)throw new Error(L('Введите пароль','Enter a password'));if(password!==confirm)throw new Error(L('Пароли не совпадают','Passwords do not match'));if(password.includes('\0'))throw new Error('Invalid password');
  const encrypted=await PdfEngine.run('encrypt',await currentFiles[0].arrayBuffer(),password);
  await LazyAssets.library('pdfjs');let doc;
  try{doc=await pdfjsLib.getDocument({isEvalSupported:false,data:encrypted.slice(),password}).promise;if(!doc.numPages)throw new Error('No pages');}finally{await doc?.destroy();}
  downloadBlob(new Blob([encrypted],{type:'application/pdf'}),'protected.pdf');
 }
 async function raster(doc,scale,quality,step=()=>Promise.resolve()){
  const out=await PDFLib.PDFDocument.create();
  for(let i=1;i<=doc.numPages;i++){
   await step(i-1,doc.numPages);const page=await doc.getPage(i),view=page.getViewport({scale});
   if(view.width*view.height>24000000)throw new Error(L('Страница слишком велика: уменьшите DPI','Page too large: reduce DPI'));
   const canvas=document.createElement('canvas');canvas.width=Math.ceil(view.width);canvas.height=Math.ceil(view.height);const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);await page.render({canvasContext:ctx,viewport:view}).promise;
   const image=await out.embedJpg(canvas.toDataURL('image/jpeg',quality));const base=page.getViewport({scale:1});out.addPage([base.width,base.height]).drawImage(image,{x:0,y:0,width:base.width,height:base.height});canvas.width=canvas.height=0;page.cleanup();
  }
  return out.save();
 }
 async function compress(){
  const original=new Uint8Array(await currentFiles[0].arrayBuffer());let result;
  if(val('compressionMode','lossless')==='lossless')result=await PdfEngine.run('optimize',original);
  else{
   if(!checked('lossyConsent'))throw new Error(L('Подтвердите потери режима JPEG','Confirm the losses of JPEG mode'));
   await LazyAssets.library('pdfjs');const doc=await pdfjsLib.getDocument({isEvalSupported:false,data:original.slice()}).promise;
   try{result=await raster(doc,number('compressionDpi',144,72,288)/72,number('compressionQuality',.8,.5,1),(n,total)=>ProductUX.step(n,total));}finally{await doc.destroy();}
  }
  downloadBlob(new Blob([result.length<original.length?result:original],{type:'application/pdf'}),'compressed.pdf');
 }
 async function split(){
  if(val('splitMode','selection')==='selection'){
   const source=await PDFLib.PDFDocument.load(await currentFiles[0].arrayBuffer());const out=await PDFLib.PDFDocument.create();const ids=parseRange(val('pageRange'),source.getPageCount());for(const p of await out.copyPages(source,ids))out.addPage(p);downloadBlob(new Blob([await out.save()],{type:'application/pdf'}),'split.pdf');return;
  }
  await LazyAssets.library('zip');const source=await PDFLib.PDFDocument.load(await currentFiles[0].arrayBuffer());const zip=new JSZip();const ids=parseRange(val('pageRange'),source.getPageCount());
  for(let n=0;n<ids.length;n++){await ProductUX.step(n,ids.length);const out=await PDFLib.PDFDocument.create();out.addPage((await out.copyPages(source,[ids[n]]))[0]);zip.file('page-'+String(ids[n]+1).padStart(3,'0')+'.pdf',await out.save());}
  downloadBlob(await zip.generateAsync({type:'blob'}),'split-pages.zip');
 }
 async function rotate(){const doc=await PDFLib.PDFDocument.load(await currentFiles[0].arrayBuffer());const angle=number('rotateAngle',90,0,360);for(const i of selectPages(doc.getPageCount()))doc.getPage(i).setRotation(PDFLib.degrees((doc.getPage(i).getRotation().angle+angle)%360));downloadBlob(new Blob([await doc.save()],{type:'application/pdf'}),'rotated.pdf');}
 async function watermark(){
  const doc=await PDFLib.PDFDocument.load(await currentFiles[0].arrayBuffer());const font=await LazyAssets.pdfFont(doc),text=val('wmText').trim();if(!text)throw new Error(L('Введите текст','Enter text'));
  const opacity=number('wmOpacity',.3,.01,1),desired=number('wmSize',48,6,200),angle=number('wmAngle',35,-180,180);
  for(const i of selectPages(doc.getPageCount())){const page=doc.getPage(i),box=page.getCropBox();const size=Math.min(desired,(box.width-40)/Math.max(.1,font.widthOfTextAtSize(text,1)));const w=font.widthOfTextAtSize(text,size);const a=angle*Math.PI/180,cx=box.x+box.width/2,cy=box.y+(val('wmPosition','center')==='top'?box.height-45:val('wmPosition','center')==='bottom'?45:box.height/2);page.drawText(text,{x:cx-w*Math.cos(a)/2,y:cy-w*Math.sin(a)/2,size,font,color:PDFLib.rgb(.4,.35,.55),opacity,rotate:PDFLib.degrees(angle)});}
  downloadBlob(new Blob([await doc.save()],{type:'application/pdf'}),'watermarked.pdf');
 }
 async function numbers(){
  const doc=await PDFLib.PDFDocument.load(await currentFiles[0].arrayBuffer());const font=await LazyAssets.pdfFont(doc),ids=selectPages(doc.getPageCount());const start=number('pnStart',1,1,1000000),format=val('pnFormat','{n} / {total}');if(!format.includes('{n}'))throw new Error(L('В формате должен быть {n}','Format must include {n}'));
  ids.forEach((index,n)=>{const page=doc.getPage(index),box=page.getCropBox(),text=format.replaceAll('{n}',String(start+n)).replaceAll('{total}',String(ids.length)),width=font.widthOfTextAtSize(text,11);if(width>box.width-20)throw new Error(L('Слишком длинный формат номера','Page number format too wide'));let x=box.x+(box.width-width)/2;if(val('pnPosition')==='bottom-left')x=box.x+20;if(val('pnPosition')==='bottom-right')x=box.x+box.width-width-20;page.drawText(text,{x,y:box.y+18,size:11,font,color:PDFLib.rgb(.3,.3,.3)});});downloadBlob(new Blob([await doc.save()],{type:'application/pdf'}),'numbered.pdf');
 }
 async function metadata(){
  const doc=await PDFLib.PDFDocument.load(await currentFiles[0].arrayBuffer(),{updateMetadata:false});
  if(checked('metaClear')){const info=doc.context.lookup(doc.context.trailerInfo.Info);if(info?.keys)for(const key of info.keys())info.delete(key);doc.catalog.delete(PDFLib.PDFName.of('Metadata'));}
  for(const [id,set] of [['metaTitle','setTitle'],['metaAuthor','setAuthor'],['metaSubject','setSubject']])if(val(id).trim())doc[set](val(id).trim());
  downloadBlob(new Blob([await doc.save()],{type:'application/pdf'}),'metadata.pdf');
 }
 async function jpg(){
  const doc=await pdfjsLib.getDocument({isEvalSupported:false,data:await currentFiles[0].arrayBuffer()}).promise;
  try{const ids=selectPages(doc.numPages),zip=new JSZip(),scale=number('jpgDpi',144,72,288)/72,quality=number('jpgQuality',.92,.5,1);for(let n=0;n<ids.length;n++){await ProductUX.step(n,ids.length);const page=await doc.getPage(ids[n]+1),view=page.getViewport({scale});if(view.width*view.height>24000000)throw new Error(L('Уменьшите DPI: слишком большая страница','Reduce DPI: page is too large'));const c=document.createElement('canvas');c.width=Math.ceil(view.width);c.height=Math.ceil(view.height);const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);await page.render({canvasContext:ctx,viewport:view}).promise;const blob=await new Promise(r=>c.toBlob(r,'image/jpeg',quality));if(!blob)throw new Error('JPEG encoding failed');if(ids.length===1){downloadBlob(blob,'page-'+(ids[n]+1)+'.jpg');return;}zip.file('page-'+String(ids[n]+1).padStart(3,'0')+'.jpg',await blob.arrayBuffer());c.width=c.height=0;page.cleanup();}downloadBlob(await zip.generateAsync({type:'blob'}),'pdf-pages.zip');}finally{await doc.destroy();}
 }
 function lines(content){const out=[];for(const it of content.items){if(!it.str.trim())continue;const y=Math.round(it.transform[5]/3)*3;let row=out.find(x=>Math.abs(x.y-y)<=2);if(!row){row={y,items:[]};out.push(row);}row.items.push(it);}return out.sort((a,b)=>b.y-a.y).map(r=>r.items.sort((a,b)=>a.transform[4]-b.transform[4]));}
 async function docx(){
  await LazyAssets.library('zip');const doc=await pdfjsLib.getDocument({isEvalSupported:false,data:await currentFiles[0].arrayBuffer()}).promise;let paragraphs=[],words=0;
  try{for(let i=1;i<=doc.numPages;i++){await ProductUX.step(i-1,doc.numPages);const content=await (await doc.getPage(i)).getTextContent();for(const row of lines(content)){const text=row.map(it=>it.str).join(' ').trim();words+=text.length;paragraphs.push('<w:p><w:r><w:t xml:space="preserve">'+esc(text)+'</w:t></w:r></w:p>');}if(i<doc.numPages)paragraphs.push('<w:p><w:r><w:br w:type="page"/></w:r></w:p>');}if(!words)throw new Error(L('Текстового слоя нет. Для сканов нужен OCR.','No text layer found. Scans require OCR.'));
   const z=new JSZip();z.file('[Content_Types].xml','<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>');z.file('_rels/.rels','<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');z.file('word/document.xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+paragraphs.join('')+'<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1000" w:right="1000" w:bottom="1000" w:left="1000"/></w:sectPr></w:body></w:document>');downloadBlob(await z.generateAsync({type:'blob',mimeType:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}),'extracted.docx');
  }finally{await doc.destroy();}
 }
 async function excel(){
  const doc=await pdfjsLib.getDocument({isEvalSupported:false,data:await currentFiles[0].arrayBuffer()}).promise;const wb=XLSX.utils.book_new();let total=0;
  try{for(let n=1;n<=doc.numPages;n++){await ProductUX.step(n-1,doc.numPages);const rows=lines(await (await doc.getPage(n)).getTextContent());let data;
   if(val('excelExtraction','columns')==='lines')data=rows.map(row=>[row.map(x=>x.str).join(' ')]);
   else {const anchors=[];for(const row of rows)for(const it of row){const x=it.transform[4];if(!anchors.some(a=>Math.abs(a-x)<16))anchors.push(x);}anchors.sort((a,b)=>a-b);data=rows.map(row=>{const cells=[];for(const it of row){let idx=anchors.reduce((best,a,i)=>Math.abs(a-it.transform[4])<Math.abs(anchors[best]-it.transform[4])?i:best,0);cells[idx]=(cells[idx]?cells[idx]+' ':'')+it.str;}return cells;});}
   total+=rows.length;const sheet=XLSX.utils.aoa_to_sheet(data);sheet['!cols']=Array.from({length:Math.max(1,...data.map(x=>x.length))},()=>({wch:24}));XLSX.utils.book_append_sheet(wb,sheet,'Page '+n);
  }if(!total)throw new Error(L('В PDF нет извлекаемого текста. Нужен OCR.','No extractable text. OCR is required.'));downloadBlob(new Blob([XLSX.write(wb,{type:'array',bookType:'xlsx'})],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),'extracted.xlsx');}finally{await doc.destroy();}
 }
 async function workbook(){
  const wb=XLSX.read(await currentFiles[0].arrayBuffer(),{type:'array',cellDates:true});if(!wb.SheetNames.length)throw new Error('Empty workbook');const doc=new jspdf.jsPDF({orientation:val('officeOrientation','landscape'),format:val('officePaper','a4')});await LazyAssets.jsFont(doc);
  wb.SheetNames.forEach((name,n)=>{if(n)doc.addPage();const rows=XLSX.utils.sheet_to_json(wb.Sheets[name],{header:1,defval:'',raw:false});doc.setFontSize(14);doc.text(name,14,15);doc.autoTable({head:rows.length?[rows[0]]:[],body:rows.slice(1),startY:22,margin:14,styles:{font:'NotoSans',fontStyle:'normal',fontSize:9,overflow:'linebreak',cellPadding:2.5},headStyles:{font:'NotoSans',fontStyle:'normal',fillColor:[104,84,218]},showHead:'everyPage'});});downloadBlob(doc.output('blob'),'excel.pdf');
 }
 async function word(){
  await LazyAssets.library('autotable');const converted=await mammoth.convertToHtml({arrayBuffer:await currentFiles[0].arrayBuffer()});const html=new DOMParser().parseFromString(converted.value,'text/html');const doc=new jspdf.jsPDF({unit:'pt',format:val('officePaper','a4'),orientation:val('officeOrientation','portrait')});await LazyAssets.jsFont(doc);const width=doc.internal.pageSize.getWidth(),height=doc.internal.pageSize.getHeight(),margin=40;let y=margin;
  const next=needed=>{if(y+needed>height-margin){doc.addPage();y=margin;}};
  async function render(node){
   if(node.nodeType!==1)return;const tag=node.tagName;
   if(tag==='TABLE'){const rows=[...node.rows].map(r=>[...r.cells].map(c=>c.textContent.trim()));doc.autoTable({body:rows,startY:y,margin,styles:{font:'NotoSans',fontStyle:'normal',fontSize:10,overflow:'linebreak'},theme:'grid'});y=doc.lastAutoTable.finalY+14;return;}
   if(tag==='IMG'){try{const image=new Image();const source=node.getAttribute('src')||'';if(!/^data:image\/(png|jpe?g|gif|webp|bmp);base64,/i.test(source))throw new Error('Unsupported embedded image format');image.src=source;await image.decode();const w=Math.min(image.naturalWidth,width-2*margin),h=w*image.naturalHeight/image.naturalWidth;const scale=Math.min(1,(height-2*margin)/h);next(h*scale+12);doc.addImage(image,margin,y,w*scale,h*scale);y+=h*scale+12;}catch(_){throw new Error(L('Не удалось перенести изображение DOCX','Unable to convert a DOCX image'));}return;}
   if(['UL','OL','DIV','SECTION'].includes(tag)){for(const child of node.children)await render(child);return;}
   const headings=/^H[1-6]$/.test(tag),size=headings?Math.max(13,23-Number(tag[1])*2):11;doc.setFontSize(size);const clone=node.cloneNode(true);clone.querySelectorAll('img').forEach(x=>x.remove());clone.querySelectorAll('br').forEach(x=>x.replaceWith('\n'));const text=(tag==='LI'?'• ':'')+clone.textContent.trim();
   for(const line of doc.splitTextToSize(text,width-2*margin)){await ProductUX.step();next(size*1.5);doc.text(line,margin,y+size);y+=size*1.5;}y+=headings?10:7;for(const img of node.querySelectorAll('img'))await render(img);
  }
  for(const node of html.body.children)await render(node);downloadBlob(doc.output('blob'),'word.pdf');
 }
 async function images(){
  const doc=await PDFLib.PDFDocument.create();for(let n=0;n<currentFiles.length;n++){await ProductUX.step(n,currentFiles.length);const file=currentFiles[n];let img;
   if(file.type==='image/png')img=await doc.embedPng(await file.arrayBuffer());else if(file.type==='image/jpeg'||/\.jpe?g$/i.test(file.name))img=await doc.embedJpg(await file.arrayBuffer());else{const b=await createImageBitmap(file);if(b.width*b.height>24000000){b.close();throw new Error('Image too large');}const c=document.createElement('canvas');c.width=b.width;c.height=b.height;c.getContext('2d').drawImage(b,0,0);b.close();img=await doc.embedPng(c.toDataURL('image/png'));}
   let size=val('imagePaper','a4')==='original'?[img.width,img.height]:val('imagePaper','a4')==='a3'?[841.89,1190.55]:[595.28,841.89];if(val('imagePaper','a4')!=='original'&&(val('imageOrientation','auto')==='landscape'||val('imageOrientation','auto')==='auto'&&img.width>img.height))size.reverse();const margin=val('imagePaper','a4')==='original'?0:number('imageMargin',24,0,100),scale=Math.min((size[0]-2*margin)/img.width,(size[1]-2*margin)/img.height);const page=doc.addPage(size);page.drawImage(img,{x:(size[0]-img.width*scale)/2,y:(size[1]-img.height*scale)/2,width:img.width*scale,height:img.height*scale});
  }downloadBlob(new Blob([await doc.save()],{type:'application/pdf'}),'images.pdf');
 }
 // Password-free structure-preserving copy is also available to the extra tool.
 async function decrypt(file,password){return PdfEngine.run('decrypt',await file.arrayBuffer(),password);}
 return {L,val,selectPages,protect,compress,split,rotate,watermark,numbers,metadata,jpg,docx,excel,workbook,word,images,decrypt,raster};
})();
