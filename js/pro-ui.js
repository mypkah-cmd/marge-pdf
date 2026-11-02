(() => {
 const ru=()=>document.documentElement.lang==='ru';
 const copy={
  protect:['Шифрование AES-256 с паролем открытия.','AES-256 encryption with an opening password.'],
  compress:['Оптимизация без потерь или сжатие изображений.','Lossless optimization or image compression.'],
  pdf2word:['Редактируемый DOCX из текстового слоя PDF.','Editable DOCX from the PDF text layer.'],
  pdf2excel:['Извлечение строк и столбцов по страницам.','Extract rows and columns, one sheet per page.'],
  textedit:['Замена и стирание с безопасным экспортом.','Replace or erase text with safe export.'],
  unlockcopy:['Снять шифрование по известному паролю.','Decrypt with the known password.'],
  img2pdf:['Размер, ориентация и поля страниц.','Page size, orientation and margins.']
 };
 for(const lang of ['ru','en','lv','de'])for(const [id,words] of Object.entries(copy))translations[lang]['tool.'+id+'.desc']=words[lang==='ru'?0:1];
 function refresh(){
  document.querySelectorAll('.v2-quick').forEach(el=>el.hidden=true);
  document.querySelectorAll('[data-tool="protect"]').forEach(el=>{el.classList.remove('tool-unavailable');el.removeAttribute('title');});
 }
 new MutationObserver(refresh).observe(document.getElementById('toolsGrid'),{childList:true});
 new MutationObserver(()=>{for(const [id,words] of Object.entries(copy))translations[document.documentElement.lang]['tool.'+id+'.desc']=words[ru()?0:1];}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 // In-page state never logs or stores passwords.
 document.addEventListener('change',e=>{if(e.target.id==='compressionMode'){document.getElementById('lossyConsent').closest('label').style.opacity=e.target.value==='images'?'1':'.6';}});
 const overlays=new MutationObserver(()=>{
  document.querySelectorAll('.options label:not([for])').forEach(label=>{const next=label.nextElementSibling;if(!label.querySelector('input')&&next?.id&&['INPUT','SELECT','TEXTAREA'].includes(next.tagName))label.htmlFor=next.id;});
  const stamp=document.getElementById('stampOverlay');
  if(stamp?.classList.contains('active')&&typeof stampPlacedItems!=='undefined'&&!document.getElementById('proStampSize')){
   const controls=document.createElement('div');controls.className='options pro-stamp-controls';controls.innerHTML='<label>'+ (ru()?'Размер штампа, pt':'Stamp width, pt')+'</label><input id="proStampSize" type="number" min="24" max="300" value="120"><button id="proStampUndo" type="button" class="ux-button">'+(ru()?'Убрать последний штамп':'Undo last stamp')+'</button>';stamp.querySelector('.modal').append(controls);controls.querySelector('button').onclick=()=>{stampPlacedItems.pop();renderStampPage();};
  }
  const draw=document.getElementById('editorOverlay');if(draw?.classList.contains('active')&&!document.getElementById('proDrawNotice')){const p=document.createElement('p');p.id='proDrawNotice';p.className='ux-note';p.textContent=ru()?'Ластик здесь закрывает содержимое визуально. Для удаления старого текста используйте «Редактор текста» и безопасный экспорт.':'The eraser here is a visual cover. To remove original text, use the text editor and safe export.';draw.querySelector('.modal').prepend(p);}
 });overlays.observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});
 renderTools();refresh();
})();
