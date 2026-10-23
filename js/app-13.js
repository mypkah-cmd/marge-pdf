// Product UX: additive preview, explicit job state, result and feedback UI.
const ProductUX = (() => {
 'use strict';
 const dictionaries = {"ru": {"preview": "Предпросмотр страниц", "previewNote": "Для Merge можно выбрать страницы и изменить их порядок стрелками. В остальных инструментах это только просмотр. Порядок файлов меняется в списке файлов.", "more": "Ещё 12 страниц", "apply": "Применить и закрыть", "close": "Закрыть", "page": "Страница", "loading": "Загрузка миниатюр…", "result": "Результат обработки", "download": "Скачать файл", "another": "Обработать другой файл", "before": "Исходный размер", "after": "Размер результата", "smaller": "Уменьшение", "notSmaller": "Файл не уменьшился. Сжатие не гарантируется.", "progress": "Обработка", "cancel": "Отменить", "cancelling": "Отмена запрошена. Остановка на ближайшем этапе…", "cancelled": "Операция отменена. Результат не скачан.", "cancelNote": "Отмена проверяется между этапами. Текущий вызов библиотеки может завершиться перед остановкой. В визуальных редакторах эта отмена не подключена.", "feedback": "Сообщить об ошибке", "privacy": "Документы, их имена и содержимое не прикрепляются. Отправляется только выбранный инструмент и введённое вами описание. Не вставляйте конфиденциальные данные.", "tool": "Инструмент", "description": "Что произошло?", "send": "Открыть письмо", "copy": "Копировать текст", "copied": "Текст скопирован.", "mail": "Откроется почтовое приложение. Проверьте письмо и отправьте его самостоятельно.", "empty": "Опишите проблему.", "roadmap": "Развитие проекта", "release": "Добавлено в этой версии", "next": "Идеи следующих версий, без обещанных сроков", "none": "Выберите хотя бы одну страницу.", "busy": "Сначала завершите текущую операцию.", "noPdf": "PDF.js не загружен. Проверьте подключение библиотеки.", "noPreview": "Предпросмотр доступен для PDF.", "done": "Обработано", "files": "файлов", "pages": "страниц", "clearResult": "Убрать результат"}, "en": {"preview": "Page preview", "previewNote": "For Merge, select pages and reorder them with arrows. Other tools offer read-only preview. Reorder files in the file list.", "more": "12 more pages", "apply": "Apply and close", "close": "Close", "page": "Page", "loading": "Loading thumbnails…", "result": "Processing result", "download": "Download file", "another": "Process another file", "before": "Input size", "after": "Output size", "smaller": "Reduction", "notSmaller": "The file did not get smaller. Compression is not guaranteed.", "progress": "Processing", "cancel": "Cancel", "cancelling": "Cancellation requested. Stopping at the next checkpoint…", "cancelled": "Operation cancelled. No result downloaded.", "cancelNote": "Cancellation is checked between stages. The current library call may finish before stopping. Visual editors do not use this cancellation control.", "feedback": "Report a problem", "privacy": "No documents, filenames or document content are attached. Only the selected tool and your description are included. Do not enter confidential data.", "tool": "Tool", "description": "What happened?", "send": "Open email", "copy": "Copy text", "copied": "Text copied.", "mail": "Your email application will open. Review and send the message yourself.", "empty": "Describe the problem.", "roadmap": "Project development", "release": "Added in this version", "next": "Ideas for future versions, without promised dates", "none": "Select at least one page.", "busy": "Finish the current operation first.", "noPdf": "PDF.js is not loaded. Check the library connection.", "noPreview": "Preview is available for PDFs.", "done": "Processed", "files": "files", "pages": "pages", "clearResult": "Dismiss result"}, "lv": {"preview": "Lappušu priekšskatījums", "previewNote": "Apvienošanai atlasiet lappuses un mainiet secību ar bultiņām. Citos rīkos tas ir tikai priekšskatījums. Failu secību maina failu sarakstā.", "more": "Vēl 12 lappuses", "apply": "Lietot un aizvērt", "close": "Aizvērt", "page": "Lappuse", "loading": "Ielādē sīktēlus…", "result": "Apstrādes rezultāts", "download": "Lejupielādēt failu", "another": "Apstrādāt citu failu", "before": "Sākotnējais izmērs", "after": "Rezultāta izmērs", "smaller": "Samazinājums", "notSmaller": "Fails nekļuva mazāks. Saspiešana nav garantēta.", "progress": "Apstrāde", "cancel": "Atcelt", "cancelling": "Atcelšana pieprasīta. Apstāšanās nākamajā posmā…", "cancelled": "Darbība atcelta. Rezultāts nav lejupielādēts.", "cancelNote": "Atcelšana tiek pārbaudīta starp posmiem. Pašreizējais bibliotēkas izsaukums var pabeigties pirms apstāšanās. Vizuālajos redaktoros šī atcelšana nav pievienota.", "feedback": "Ziņot par kļūdu", "privacy": "Dokumenti, failu nosaukumi un dokumentu saturs netiek pievienoti. Iekļauts tikai atlasītais rīks un jūsu apraksts. Neievadiet konfidenciālus datus.", "tool": "Rīks", "description": "Kas notika?", "send": "Atvērt e-pastu", "copy": "Kopēt tekstu", "copied": "Teksts nokopēts.", "mail": "Atvērsies e-pasta lietotne. Pārbaudiet un nosūtiet vēstuli patstāvīgi.", "empty": "Aprakstiet problēmu.", "roadmap": "Projekta attīstība", "release": "Pievienots šajā versijā", "next": "Idejas nākamajām versijām bez solītiem termiņiem", "none": "Atlasiet vismaz vienu lappusi.", "busy": "Vispirms pabeidziet pašreizējo darbību.", "noPdf": "PDF.js nav ielādēts. Pārbaudiet bibliotēkas savienojumu.", "noPreview": "Priekšskatījums pieejams PDF failiem.", "done": "Apstrādāts", "files": "faili", "pages": "lappuses", "clearResult": "Paslēpt rezultātu"}, "de": {"preview": "Seitenvorschau", "previewNote": "Für Merge Seiten auswählen und mit Pfeilen umordnen. Andere Werkzeuge bieten nur eine Vorschau. Die Dateireihenfolge wird in der Dateiliste geändert.", "more": "12 weitere Seiten", "apply": "Übernehmen und schließen", "close": "Schließen", "page": "Seite", "loading": "Vorschaubilder werden geladen…", "result": "Verarbeitungsergebnis", "download": "Datei herunterladen", "another": "Andere Datei verarbeiten", "before": "Eingabegröße", "after": "Ergebnisgröße", "smaller": "Verkleinerung", "notSmaller": "Die Datei wurde nicht kleiner. Komprimierung ist nicht garantiert.", "progress": "Verarbeitung", "cancel": "Abbrechen", "cancelling": "Abbruch angefordert. Stopp am nächsten Prüfpunkt…", "cancelled": "Vorgang abgebrochen. Kein Ergebnis heruntergeladen.", "cancelNote": "Der Abbruch wird zwischen Schritten geprüft. Der aktuelle Bibliotheksaufruf kann zuvor noch fertig werden. Visuelle Editoren verwenden diese Abbruchfunktion nicht.", "feedback": "Problem melden", "privacy": "Keine Dokumente, Dateinamen oder Dokumentinhalte werden angehängt. Enthalten sind nur das gewählte Werkzeug und Ihre Beschreibung. Keine vertraulichen Daten eingeben.", "tool": "Werkzeug", "description": "Was ist passiert?", "send": "E-Mail öffnen", "copy": "Text kopieren", "copied": "Text kopiert.", "mail": "Ihr E-Mail-Programm wird geöffnet. Prüfen und senden Sie die Nachricht selbst.", "empty": "Beschreiben Sie das Problem.", "roadmap": "Projektentwicklung", "release": "In dieser Version hinzugefügt", "next": "Ideen für künftige Versionen ohne zugesagte Termine", "none": "Mindestens eine Seite auswählen.", "busy": "Zuerst den aktuellen Vorgang beenden.", "noPdf": "PDF.js ist nicht geladen. Bibliotheksverbindung prüfen.", "noPreview": "Die Vorschau ist für PDFs verfügbar.", "done": "Verarbeitet", "files": "Dateien", "pages": "Seiten", "clearResult": "Ergebnis ausblenden"}};
 const text = key => (dictionaries[document.documentElement.lang] || dictionaries.en)[key] || key;
 const plans = new WeakMap();
 let job = null;
 let lastResult = null;
 let preview = null;
 let previewToken = 0;
 let previewTask = null;
 let returnFocus = null;
 const $ = id => document.getElementById(id);
 const resultBox = $('uxResult');
 document.getElementById('toolsGrid').after(resultBox);
 const button = (label, action) => {
  const b=document.createElement('button');b.type='button';b.className='ux-button';b.textContent=label;b.onclick=action;return b;
 };
 const size = bytes => bytes.toLocaleString()+' B ('+(bytes/1024).toFixed(1)+' KiB)';
 function abortCheck(){if(job?.cancelled) throw new DOMException('Cancelled','AbortError');}
 async function step(done,total,unit='pages'){
  if(!job) return;
  await new Promise(resolve=>setTimeout(resolve,0));
  abortCheck();
  if(Number.isFinite(total) && total>0){
   job.progress.max=total;job.progress.value=done;
   job.label.textContent=text('done')+': '+done+' / '+total+' '+text(unit);
  }
 }
 function begin(tool){
  const panel=document.createElement('div');panel.id='uxProgress';panel.setAttribute('role','status');
  const label=document.createElement('p');label.textContent=text('progress')+'…';
  const progress=document.createElement('progress');progress.removeAttribute('value');
  const note=document.createElement('p');note.className='ux-note';note.textContent=text('cancelNote');
  const cancel=button(text('cancel'),()=>{job.cancelled=true;cancel.disabled=true;label.textContent=text('cancelling');});
  panel.append(label,progress,note,cancel);$('runBtn').before(panel);
  const controls=[...document.querySelectorAll('#modalOverlay button,#modalOverlay input,#modalOverlay select')].filter(el=>el!==cancel);
  const previous=controls.map(el=>[el,el.disabled]);controls.forEach(el=>el.disabled=true);
  job={tool:tool.id,inputBytes:currentFiles.reduce((sum,file)=>sum+file.size,0),cancelled:false,outputs:[],progress,label,panel,previous};
 }
 function finish(){if(!job)return;job.previous.forEach(([el,disabled])=>el.disabled=disabled);job.panel.remove();job=null;}
 function discard(){if(job)job.outputs=[];}
 function originalDownload(blob,name){
  rawDownload(blob,name);
  if(blob.size < 30*1024*1024 && typeof window.__idbAddFile === 'function') {
   try { Promise.resolve(window.__idbAddFile(name,blob,'result')).catch(()=>{}); } catch (_) {}
  }
 }
 function rawDownload(blob,name){
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
 }
 function showResult(blob,name,meta){
  lastResult={blob,name,meta};renderResult();
 }
 function renderResult(){
  if(!lastResult)return;
  const {blob,name,meta}=lastResult;resultBox.replaceChildren();resultBox.hidden=false;
  const title=document.createElement('h2');title.textContent=text('result');
  const filename=document.createElement('p');filename.textContent=name;filename.style.overflowWrap='anywhere';
  const info=document.createElement('p');info.className='ux-note';
  info.textContent=(meta?text('before')+': '+size(meta.inputBytes)+' · ':'')+text('after')+': '+size(blob.size);
  resultBox.append(title,filename,info);
  if(meta?.tool==='compress'){
   const p=document.createElement('p');p.className='ux-note';
   p.textContent=blob.size<meta.inputBytes?text('smaller')+': '+((1-blob.size/meta.inputBytes)*100).toFixed(1)+'%':text('notSmaller');resultBox.append(p);
  }
  const actions=document.createElement('div');actions.className='ux-actions';
  actions.append(button(text('download'),()=>rawDownload(blob,name)),button(text('another'),()=>{
   if(job)return;
   resultBox.hidden=true;lastResult=null;
   if(meta){const tool=TOOLS.find(t=>t.id===meta.tool);if(tool)openTool(tool);}
   else closeModal();
  }),button(text('clearResult'),()=>{resultBox.hidden=true;lastResult=null;}));
  resultBox.append(actions);
 }
 window.downloadBlob=function(blob,name){
  if(!(blob instanceof Blob))throw new Error('Empty output');
  abortCheck();
  if(job){job.outputs.push({blob,name});return;}
  originalDownload(blob,name);showResult(blob,name,null);
 };
 function commit(){
  abortCheck();
  for(const output of job.outputs){originalDownload(output.blob,output.name);showResult(output.blob,output.name,{tool:job.tool,inputBytes:job.inputBytes});}
  job.outputs=[];
 }
 for(const eventName of ['drop','dragstart']) {
  document.getElementById('modalOverlay').addEventListener(eventName,event=>{
   if(job){event.preventDefault();event.stopImmediatePropagation();}
  },true);
 }
 const originalClose=window.closeModal;
 window.closeModal=function(){if(job)return;return originalClose.apply(this,arguments);};
 const originalOpen=window.openTool;
 window.openTool=function(){if(job)return;return originalOpen.apply(this,arguments);};
 const originalRenderFiles=window.renderFileList;
 window.renderFileList=function(tool,list,run){
  originalRenderFiles.apply(this,arguments);
  [...list.children].forEach((li,index)=>{
   const file=currentFiles[index];if(!file || !/\.pdf$/i.test(file.name))return;
   li.append(button(text('preview'),()=>openPreview(file,tool.id==='merge')));
  });
 };
 function closePreview(){
  previewToken++;previewTask?.cancel();previewTask=null;
  const doc=preview?.doc;preview=null;if(doc)doc.destroy().catch(()=>{});
  $('uxPreviewGrid').replaceChildren();$('uxPreview').hidden=true;$('uxPreview').classList.remove('active');returnFocus?.focus();
 }
 async function openPreview(file,editable){
  if(job)return;
  returnFocus=document.activeElement;
  $('uxPreview').hidden=false;$('uxPreview').classList.add('active');
  $('uxPreviewTitle').textContent=text('preview');$('uxPreviewNote').textContent=text('previewNote');
  $('uxPreviewStatus').textContent=text('loading');$('uxPreviewGrid').replaceChildren();
  $('uxPreviewApply').textContent=editable?text('apply'):text('close');$('uxPreviewApply').disabled=true;
  $('uxPreviewMore').textContent=text('more');$('uxPreviewMore').hidden=true;
  $('uxPreviewClose').focus();
  const token=++previewToken;
  try{
   await LazyAssets.library('pdfjs');
   if(token!==previewToken)return;
   if(!window.pdfjsLib)throw new Error(text('noPdf'));
   const doc=await pdfjsLib.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise;
   if(token!==previewToken){await doc.destroy();return;}
   const saved=plans.get(file);
   preview={file,doc,editable,order:saved?[...saved.order]:Array.from({length:doc.numPages},(_,i)=>i),selected:new Set(saved?saved.selected:Array.from({length:doc.numPages},(_,i)=>i)),shown:Math.min(12,doc.numPages)};
   await renderPreview(token);
  }catch(error){if(token===previewToken)$('uxPreviewStatus').textContent=error.message;}
 }
 async function renderPreview(token=previewToken){
  if(!preview)return;
  const state=preview;const grid=$('uxPreviewGrid');grid.replaceChildren();
  $('uxPreviewApply').disabled=true;$('uxPreviewMore').disabled=true;
  $('uxPreviewStatus').textContent=text('loading');
  try{
   for(let pos=0;pos<state.shown;pos++){
    if(token!==previewToken || preview!==state)return;
    const pageIndex=state.order[pos];const page=await state.doc.getPage(pageIndex+1);
    const viewport=page.getViewport({scale:Math.min(.35,140/page.getViewport({scale:1}).width)});
    const card=document.createElement('div');card.className='ux-page';
    const canvas=document.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
    card.append(canvas);grid.append(card);
    previewTask=page.render({canvasContext:canvas.getContext('2d'),viewport});await previewTask.promise;previewTask=null;page.cleanup();
    const label=document.createElement('label');label.textContent=text('page')+' '+(pageIndex+1);
    if(state.editable){
     const check=document.createElement('input');check.type='checkbox';check.checked=state.selected.has(pageIndex);
     check.onchange=()=>{check.checked?state.selected.add(pageIndex):state.selected.delete(pageIndex);};label.prepend(check);
    }
    card.append(label);
    if(state.editable){
     const actions=document.createElement('div');actions.className='ux-actions';
     for(const delta of [-1,1]){
      const move=button(delta<0?'←':'→',()=>{
       const next=pos+delta;if(next<0||next>=state.order.length)return;
       [state.order[pos],state.order[next]]=[state.order[next],state.order[pos]];
       state.shown=Math.max(state.shown,next+1);renderPreview();
      });move.disabled=pos+delta<0||pos+delta>=state.order.length;
      move.dataset.disabled=String(move.disabled);move.disabled=true;
      move.setAttribute('aria-label',(delta<0?'← ':'→ ')+text('page')+' '+(pageIndex+1));actions.append(move);
     }
     card.append(actions);
    }
   }
   if(token!==previewToken || preview!==state)return;
   $('uxPreviewStatus').textContent=state.shown+' / '+state.doc.numPages;
   $('uxPreviewMore').hidden=state.shown>=state.doc.numPages;
  }catch(error){if(token===previewToken)$('uxPreviewStatus').textContent=error.message;}
  finally{if(token===previewToken){$('uxPreviewApply').disabled=false;$('uxPreviewMore').disabled=false;grid.querySelectorAll('button[data-disabled]').forEach(b=>b.disabled=b.dataset.disabled==='true');}}
 }
 $('uxPreviewClose').onclick=closePreview;
 $('uxPreviewMore').onclick=()=>{if(preview){preview.shown=Math.min(preview.shown+12,preview.doc.numPages);renderPreview();}};
 $('uxPreviewApply').onclick=()=>{
  if(preview?.editable){
   if(!preview.selected.size){$('uxPreviewStatus').textContent=text('none');return;}
   plans.set(preview.file,{order:[...preview.order],selected:[...preview.selected]});
  }
  closePreview();
 };
 function selection(file,count){const plan=plans.get(file);return plan?plan.order.filter(i=>plan.selected.includes(i)):Array.from({length:count},(_,i)=>i);}
 const footer=document.querySelector('.footer-buttons')||document.querySelector('footer');
 const feedbackButton=button(text('feedback'),()=>{
  $('uxFeedback').hidden=false;$('uxFeedback').classList.add('active');$('uxFeedbackTool').replaceChildren();
  TOOLS.forEach(tool=>{const option=document.createElement('option');option.value=tool.id;option.textContent=t('tool.'+tool.id+'.name');$('uxFeedbackTool').append(option);});
  if(currentTool)$('uxFeedbackTool').value=currentTool.id;
  $('uxFeedbackText').focus();
 });footer.append(feedbackButton);
 const roadmapLink=document.createElement('a');roadmapLink.className='footer-btn';roadmapLink.href='development.html';roadmapLink.textContent=text('roadmap');footer.append(roadmapLink);
 function feedbackText(){return 'marge-PDF\nTool: '+$('uxFeedbackTool').value+'\n\n'+$('uxFeedbackText').value.trim();}
 $('uxFeedbackSend').onclick=()=>{
  if(!$('uxFeedbackText').value.trim()){$('uxFeedbackStatus').textContent=text('empty');return;}
  location.href='mailto:'+CONFIG.EMAIL+'?subject='+encodeURIComponent('marge-PDF feedback')+'&body='+encodeURIComponent(feedbackText());
  $('uxFeedbackStatus').textContent=text('mail');
 };
 $('uxFeedbackCopy').onclick=async()=>{
  try{await navigator.clipboard.writeText(feedbackText());$('uxFeedbackStatus').textContent=text('copied');}
  catch(error){$('uxFeedbackStatus').textContent=feedbackText();}
 };
 $('uxFeedbackClose').onclick=()=>{$('uxFeedback').hidden=true;$('uxFeedback').classList.remove('active');feedbackButton.focus();};
 function updateLabels(){
  feedbackButton.textContent=text('feedback');roadmapLink.textContent=text('roadmap');
  $('uxFeedbackTitle').textContent=text('feedback');$('uxFeedbackNote').textContent=text('privacy');
  $('uxFeedbackToolLabel').textContent=text('tool');$('uxFeedbackTextLabel').textContent=text('description');
  $('uxFeedbackSend').textContent=text('send');$('uxFeedbackCopy').textContent=text('copy');
  renderResult();
 }
 new MutationObserver(updateLabels).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 document.addEventListener('keydown',event=>{
  if(event.key==='Escape'){if(!$('uxPreview').hidden)closePreview();if(!$('uxFeedback').hidden)$('uxFeedbackClose').click();}
 });
 updateLabels();
 return {text,step,begin,finish,discard,commit,selection,busy:()=>!!job};
})();

