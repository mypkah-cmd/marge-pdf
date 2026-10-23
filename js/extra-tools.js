
window.ExtraTools=(()=>{
 let busy=false,cancelled=false,task=null,renderTask=null;
 const box=document.createElement('div');box.className='modal-overlay';box.id='extraToolsOverlay';
 box.innerHTML=`<div class="modal" role="dialog" aria-modal="true" aria-labelledby="extraTitle">
 <button class="modal-close" id="extraClose" type="button" aria-label="Close">×</button><h2 id="extraTitle"></h2>
 <p class="ux-note" id="extraNote"></p><label id="extraDrop" class="drop-zone" for="extraFile" tabindex="0"><span class="extra-file-icon" aria-hidden="true">📄</span><strong id="extraFileLabel"></strong><span id="extraFileName"></span><input id="extraFile" type="file" accept="application/pdf,.pdf" hidden></label>
 <div class="ux-actions"><label id="extraPasswordLabel" for="extraPassword"></label><input id="extraPassword" type="password" autocomplete="off"></div>
 <div id="extraQR"><label id="extraQRLabel" for="extraQRValue"></label><input id="extraQRValue" type="text" maxlength="800" placeholder="https://…">
 <div class="ux-actions"><label id="extraPagesLabel" for="extraPages"></label><input id="extraPages" placeholder="1,3-5">
 <label id="extraSizeLabel" for="extraSize"></label><input id="extraSize" type="number" min="24" max="200" value="72">
 <select id="extraPosition"><option value="br">↘</option><option value="bl">↙</option><option value="tr">↗</option><option value="tl">↖</option></select></div></div>
 <label id="extraConsent" class="ux-note"><input id="extraConsentCheck" type="checkbox"><span id="extraConsentText"></span></label>
 <div class="ux-actions"><button type="button" class="btn" id="extraRun"></button><button type="button" class="ux-button" id="extraCancel"></button></div>
 <progress id="extraProgress" hidden style="width:100%"></progress><p id="extraStatus" role="status" class="ux-note"></p><div id="extraResult"></div></div>`;
 document.body.append(box);

 // Scoped visual alignment with the existing tool dialogs.
 const style=document.createElement('style');style.id='extra-tools-theme';
 style.textContent=`
 #extraToolsOverlay .modal {max-width:560px;}
 #extraToolsOverlay input:not([type=file]):not([type=checkbox]),#extraToolsOverlay select {
  width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid var(--border);
  border-radius:8px;background:var(--bg);color:var(--text);font:inherit;font-size:14px;min-width:0;
 }
 #extraToolsOverlay input:focus-visible,#extraToolsOverlay select:focus-visible,#extraDrop:focus-visible {
  outline:2px solid var(--primary);outline-offset:2px;
 }
 #extraToolsOverlay label:not(.drop-zone) {font-size:13px;font-weight:500;color:var(--text);}
 #extraToolsOverlay .ux-actions {display:flex;flex-direction:column;align-items:stretch;gap:8px;margin:16px 0;}
 #extraToolsOverlay #extraQRLabel {display:block;margin:16px 0 8px;}
 #extraDrop {display:flex;flex-direction:column;align-items:center;gap:8px;}
 #extraDrop:hover,#extraDrop.dragover {border-color:var(--primary);background:var(--bg);}
 #extraDrop .extra-file-icon {font-size:32px;line-height:1.3;}
 #extraFileName {max-width:100%;overflow-wrap:anywhere;font-size:13px;color:var(--muted);}
 #extraNote {margin-bottom:18px;}
 #extraConsent:not([hidden]) {display:flex;align-items:flex-start;gap:10px;padding:12px;border:1px solid var(--border);border-radius:10px;background:var(--bg);line-height:1.6;}
 #extraConsent input {margin-top:5px;flex-shrink:0;accent-color:var(--primary);}
 #extraToolsOverlay #extraCancel {width:100%;padding:11px;border-radius:10px;}
 #extraToolsOverlay #extraResult {overflow-x:auto;}
 #extraToolsOverlay #extraResult td {padding:10px 8px;border-bottom:1px solid var(--border);font-size:14px;}
 #extraToolsOverlay #extraResult tr:first-child {font-weight:600;color:var(--primary);}
 #extraToolsOverlay progress {accent-color:var(--primary);}
 #extraToolsOverlay [hidden] {display:none!important;}
 `;
 document.head.append(style);
 const fileInput=document.getElementById('extraFile'),drop=document.getElementById('extraDrop');
 function fileLabel(){
  document.getElementById('extraFileName').textContent=fileInput.files[0]?.name || (document.documentElement.lang==='ru'?'Перетащите PDF сюда или нажмите для выбора':'Drop a PDF here or click to choose');
 }
 fileInput.addEventListener('change',fileLabel);
 drop.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!fileInput.disabled){e.preventDefault();fileInput.click();}});
 drop.addEventListener('dragover',e=>{e.preventDefault();if(!fileInput.disabled)drop.classList.add('dragover');});
 drop.addEventListener('dragleave',()=>drop.classList.remove('dragover'));
 drop.addEventListener('drop',e=>{
  e.preventDefault();drop.classList.remove('dragover');if(fileInput.disabled)return;
  const file=[...e.dataTransfer.files].find(f=>/\.pdf$/i.test(f.name));if(!file)return;
  const transfer=new DataTransfer();transfer.items.add(file);fileInput.files=transfer.files;fileLabel();
 });

 const $=id=>document.getElementById(id);
 const ru=()=>document.documentElement.lang==='ru';
 const t=(a,b)=>ru()?a:b;
 let mode='';
 function set(id,a,b){$(id).textContent=t(a,b);}
 function open(id){
  if(busy)return;mode=id;box.classList.add('active');
  $('extraTitle').textContent=translations[document.documentElement.lang]?.['tool.'+id+'.name']||id;
  set('extraFileLabel','PDF-файл','PDF file');set('extraPasswordLabel','Пароль (если нужен)','Password (if needed)');
  set('extraQRLabel','Текст или ссылка для QR','QR text or URL');set('extraPagesLabel','Страницы (пусто = все)','Pages (blank = all)');set('extraSizeLabel','Размер, pt','Size, pt');
  set('extraRun','Выполнить','Run');set('extraCancel','Отменить','Cancel');
  set('extraConsentText',' У меня есть право на обработку. Я понимаю: страницы станут изображениями; текст, ссылки, формы и подписи не сохранятся как интерактивные объекты.',' I am authorized to process this file. Pages become images; searchable text, links, forms and signatures are not retained as interactive objects.');
  $('extraQR').hidden=id!=='qrpdf';$('extraConsent').hidden=id!=='unlockcopy';
  $('extraNote').textContent=id==='unlockcopy'?t('Это не снятие шифрования с сохранением структуры. Создаётся новый PDF из изображений, 144 dpi. Введите известный пароль; подбора пароля нет.','This is not structure-preserving decryption. A new PDF is created from 144 dpi page images. Enter the known password; no password cracking.'):
   id==='pdfcount'?t('Слова считаются только в текстовом слое. Сканы без OCR могут дать 0 слов. Сегментация зависит от языка и качества текста.','Only the text layer is counted. Scans without OCR may have zero words. Segmentation depends on language and text quality.'):
   t('QR добавляется с белым полем, отступом 18 pt. Размер задаётся в PDF-пунктах. Подписанные PDF после изменения могут потерять действительность подписи.','QR includes a white quiet zone and 18 pt margin. Size uses PDF points. Editing signed PDFs may invalidate signatures.');
  $('extraStatus').textContent='';$('extraResult').replaceChildren();$('extraFile').value='';$('extraPassword').value='';$('extraConsentCheck').checked=false;$('extraProgress').hidden=true;fileLabel();
 }
 function check(){if(cancelled)throw new DOMException('Cancelled','AbortError');}
 async function step(done,total){await new Promise(r=>setTimeout(r,0));check();$('extraProgress').hidden=false;$('extraProgress').max=total;$('extraProgress').value=done;$('extraStatus').textContent=done+' / '+total;}
 function words(text){
  if(typeof Intl.Segmenter==='function')return [...new Intl.Segmenter(document.documentElement.lang||undefined,{granularity:'word'}).segment(text)].filter(x=>x.isWordLike).length;
  return (text.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu)||[]).length;
 }
 async function openPDF(file){
  await LazyAssets.library('pdfjs');check();
  task=pdfjsLib.getDocument({data:new Uint8Array(await file.arrayBuffer()),password:$('extraPassword').value});
  return task.promise;
 }
 function range(str,max){
  if(!str.trim())return Array.from({length:max},(_,i)=>i);
  const out=new Set();for(const part of str.split(',')){
   const m=part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);if(!m)throw new Error(t('Неверный диапазон страниц','Invalid page range'));
   const a=+m[1],b=+(m[2]||m[1]);if(a<1||b<a||b>max)throw new Error(t('Диапазон вне документа','Page range out of bounds'));
   for(let i=a;i<=b;i++)out.add(i-1);
  }return [...out];
 }
 function report(rows){
  const table=document.createElement('table');table.style.width='100%';
  for(const row of rows){const tr=document.createElement('tr');for(const value of row){const td=document.createElement('td');td.textContent=value;tr.append(td);}table.append(tr);}
  $('extraResult').append(table);
 }
 $('extraClose').onclick=()=>{if(!busy){box.classList.remove('active');$('extraPassword').value='';}};
 $('extraCancel').onclick=()=>{if(busy){cancelled=true;renderTask?.cancel();task?.destroy().catch(()=>{});$('extraStatus').textContent=t('Отмена…','Cancelling…');}else $('extraClose').click();};
 $('extraRun').onclick=async()=>{
  if(busy)return;
  const file=$('extraFile').files[0];if(!file){$('extraStatus').textContent=t('Выберите PDF','Choose a PDF');return;}
  if(mode==='unlockcopy'&&!$('extraConsentCheck').checked){$('extraStatus').textContent=t('Подтвердите ограничения копии','Confirm the copy limitations');return;}
  busy=true;cancelled=false;$('extraResult').replaceChildren();$('extraRun').disabled=true;
  const locked=[...box.querySelectorAll('input,select')];locked.forEach(el=>el.disabled=true);
  let doc=null;
  try{
   $('extraStatus').textContent=t('Загрузка библиотек…','Loading libraries…');
   if(mode==='qrpdf'){
    const value=$('extraQRValue').value.trim();if(!value)throw new Error(t('Введите текст QR','Enter QR text'));
    await Promise.all([LazyAssets.library('pdfLib'),LazyAssets.library('qr')]);check();
    const pdf=await PDFLib.PDFDocument.load(await file.arrayBuffer());
    const indices=range($('extraPages').value,pdf.getPageCount());
    const size=Number($('extraSize').value);if(!Number.isFinite(size)||size<24||size>200)throw new Error('Size: 24–200 pt');
    const host=document.createElement('div');host.style.cssText='position:fixed;left:-10000px;top:0';document.body.append(host);
    let data;
    try{new QRCode(host,{text:value,width:512,height:512,correctLevel:QRCode.CorrectLevel.M});
     const canvas=host.querySelector('canvas');if(!canvas)throw new Error('QR canvas unavailable');
     const padded=document.createElement('canvas');padded.width=padded.height=640;const ctx=padded.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,640,640);ctx.drawImage(canvas,64,64,512,512);data=padded.toDataURL('image/png');
    }finally{host.remove();}
    const image=await pdf.embedPng(data);
    for(let n=0;n<indices.length;n++){
     await step(n,indices.length);const page=pdf.getPage(indices[n]);
     if(page.getRotation().angle%360!==0)throw new Error(t('Для QR сначала нормализуйте поворот страниц (0°).','Normalize page rotation to 0° before adding QR.'));
     const crop=page.getCropBox();if(size+36>Math.min(crop.width,crop.height))throw new Error(t('QR слишком большой для страницы','QR too large for page'));
     const pos=$('extraPosition').value;page.drawImage(image,{x:crop.x+(pos.endsWith('r')?crop.width-size-18:18),y:crop.y+(pos.startsWith('t')?crop.height-size-18:18),width:size,height:size});
    }
    const bytes=await pdf.save();check();downloadBlob(new Blob([bytes],{type:'application/pdf'}),'qr-'+file.name);
   }else{
    doc=await openPDF(file);check();
    if(mode==='pdfcount'){
     const rows=[[t('Страница','Page'),t('Слова','Words')]];let total=0,empty=0;
     for(let i=1;i<=doc.numPages;i++){
      await step(i-1,doc.numPages);const page=await doc.getPage(i);const content=await page.getTextContent();
      const text=content.items.map(item=>item.str+(item.hasEOL?'\n':' ')).join('');const count=words(text);total+=count;if(!text.trim())empty++;rows.push([i,count]);page.cleanup();
     }
     check();rows.push([t('Всего страниц','Total pages'),doc.numPages],[t('Всего слов','Total words'),total],[t('Без извлечённого текста','Without extracted text'),empty]);report(rows);
    }else{
     await LazyAssets.library('pdfLib');check();const out=await PDFLib.PDFDocument.create();
     for(let i=1;i<=doc.numPages;i++){
      await step(i-1,doc.numPages);const page=await doc.getPage(i);const base=page.getViewport({scale:1}),view=page.getViewport({scale:2});
      if(view.width*view.height>24000000)throw new Error(t('Слишком большая страница для безопасной обработки','Page exceeds the rendering memory limit'));
      const canvas=document.createElement('canvas');canvas.width=Math.ceil(view.width);canvas.height=Math.ceil(view.height);const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);
      renderTask=page.render({canvasContext:ctx,viewport:view});await renderTask.promise;renderTask=null;check();
      const image=await out.embedJpg(canvas.toDataURL('image/jpeg',.94));out.addPage([base.width,base.height]).drawImage(image,{x:0,y:0,width:base.width,height:base.height});canvas.width=canvas.height=0;page.cleanup();
     }
     const bytes=await out.save();check();downloadBlob(new Blob([bytes],{type:'application/pdf'}),'unlocked-image-copy.pdf');
    }
   }
   $('extraStatus').textContent=t('Готово','Done');$('extraProgress').hidden=true;
  }catch(error){$('extraStatus').textContent=cancelled?t('Операция отменена','Cancelled'):error.name==='PasswordException'?t('Нужен правильный пароль. Введите его и повторите.','Enter the correct password and retry.'):error.message;}
  finally{renderTask=null;if(doc)await doc.destroy().catch(()=>{});task=null;$('extraPassword').value='';busy=false;$('extraRun').disabled=false;locked.forEach(el=>el.disabled=false);}
 };
 return {open,words,range};
})();
