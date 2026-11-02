(()=>{'use strict';
function init(){
 const overlay=document.getElementById('textEditorOverlay');
 const save=document.getElementById('teSaveBtn');
 if(!overlay||!save||save.dataset.exportDialogReady)return;
 // The original export panel is created lazily by SafeTextExport.setup().
 // Initialize it before wiring the dialog, otherwise the previous version silently returned.
 if(!document.getElementById('teExportOptions')){
   if(typeof SafeTextExport==='undefined'||typeof SafeTextExport.setup!=='function')return;
   SafeTextExport.setup();
 }
 const panel=document.getElementById('teExportOptions');if(!panel)return;
 save.dataset.exportDialogReady='1';
 const messages={
  ru:['Сохранение PDF','Безопасное удаление создаёт PDF из изображений страниц. Исходный текст перестанет выделяться.','Отмена','Скачать PDF'],
  en:['Save PDF','Safe removal creates image-based PDF pages. Original text will no longer be selectable.','Cancel','Download PDF'],
  lv:['Saglabāt PDF','Droša satura noņemšana izveido PDF no lapu attēliem. Sākotnējo tekstu vairs nevarēs atlasīt.','Atcelt','Lejupielādēt PDF'],
  de:['PDF speichern','Beim sicheren Entfernen werden PDF-Seiten in Bilder umgewandelt. Der ursprüngliche Text ist danach nicht mehr auswählbar.','Abbrechen','PDF herunterladen']
 };
 const language=()=>{const lang=(document.documentElement.lang||localStorage.getItem('marge-lang')||'en').toLowerCase().slice(0,2);return messages[lang]?lang:'en';};
 const msg=()=>messages[language()];
 const backdrop=document.createElement('div');backdrop.className='studio-export-backdrop';backdrop.hidden=true;backdrop.style.display='none';overlay.append(backdrop);overlay.append(panel);
 const title=document.createElement('div');title.className='studio-export-title';title.textContent=msg()[0];panel.prepend(title);
 const hint=document.createElement('div');hint.className='studio-export-hint';hint.textContent=msg()[1];title.after(hint);
 const actions=document.createElement('div');actions.className='studio-export-actions';
 const cancel=document.createElement('button');cancel.type='button';cancel.textContent=msg()[2];
 const confirm=document.createElement('button');confirm.type='button';confirm.className='studio-export-confirm';confirm.textContent=msg()[3];actions.append(cancel,confirm);panel.append(actions);
 panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label',title.textContent);
 let allowSave=false,priorFocus=null,submitting=false;
 function close(){panel.classList.remove('studio-export-open');backdrop.hidden=true;backdrop.style.display='none';if(priorFocus?.isConnected)priorFocus.focus();}
 function open(){if(save.disabled)return;title.textContent=msg()[0];hint.textContent=msg()[1];cancel.textContent=msg()[2];confirm.textContent=msg()[3];panel.setAttribute('aria-label',msg()[0]);priorFocus=document.activeElement;panel.classList.add('studio-export-open');backdrop.hidden=false;backdrop.style.display='block';confirm.focus();}
 // Capture before the legacy bubble-phase export listener.
 save.addEventListener('click',e=>{if(allowSave)return;e.preventDefault();e.stopImmediatePropagation();open();},true);
 confirm.addEventListener('click',()=>{if(submitting)return;submitting=true;confirm.disabled=true;close();allowSave=true;try{save.click();}finally{allowSave=false;submitting=false;confirm.disabled=false;}});
 cancel.addEventListener('click',close);backdrop.addEventListener('click',close);
 overlay.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel.classList.contains('studio-export-open')){e.preventDefault();close();}});
 panel.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const nodes=[...panel.querySelectorAll('select,button:not([disabled])')].filter(el=>getComputedStyle(el).display!=='none');if(!nodes.length)return;const first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();