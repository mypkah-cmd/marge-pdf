// Donation UI is isolated from PDF processing and never gates downloads.
(() => {
 'use strict';
 const copy = {"ru": ["☕ Поддержать проект", "Зачем поддерживать marge-PDF?", "Поддержите дальнейшую разработку marge-PDF: исправление ошибок и улучшение PDF-инструментов.", "Поддержка добровольная. Все текущие инструменты доступны бесплатно, независимо от доната.", "Файл готов!", "Инструмент оказался полезным? Поддержите развитие marge-PDF небольшой суммой. Это добровольно, все текущие функции остаются бесплатными.", "Не сейчас"], "en": ["☕ Support the project", "Why support marge-PDF?", "Support further development of marge-PDF: bug fixes and improvements to the PDF tools.", "Support is voluntary. All current tools are free to use, whether you donate or not.", "Your file is ready!", "Was this tool useful? Support marge-PDF with a small contribution. It is voluntary, and all current features remain free.", "Not now"], "lv": ["☕ Atbalstīt projektu", "Kāpēc atbalstīt marge-PDF?", "Atbalstiet marge-PDF turpmāko izstrādi: kļūdu labošanu un PDF rīku uzlabošanu.", "Atbalsts ir brīvprātīgs. Visi pašreizējie rīki ir pieejami bez maksas neatkarīgi no ziedojuma.", "Fails ir gatavs!", "Vai rīks noderēja? Atbalstiet marge-PDF ar nelielu ziedojumu. Tas ir brīvprātīgi, un visas pašreizējās funkcijas paliek bez maksas.", "Ne tagad"], "de": ["☕ Projekt unterstützen", "Warum marge-PDF unterstützen?", "Unterstützen Sie die Weiterentwicklung von marge-PDF: Fehlerbehebungen und Verbesserungen der PDF-Werkzeuge.", "Die Unterstützung ist freiwillig. Alle aktuellen Werkzeuge sind unabhängig von einer Spende kostenlos nutzbar.", "Ihre Datei ist fertig!", "War dieses Werkzeug hilfreich? Unterstützen Sie marge-PDF mit einem kleinen Beitrag. Das ist freiwillig, alle aktuellen Funktionen bleiben kostenlos.", "Nicht jetzt"]};
 const keys = ['support.button','support.goalTitle','support.goal','support.voluntary','support.resultTitle','support.resultText','support.later'];
 Object.entries(copy).forEach(([lang,values]) => {
  if (!translations[lang]) return;
  keys.forEach((key,i) => { translations[lang][key]=values[i]; });
  translations[lang]['donate.subtitle']=values[2];
 });
 const panel=document.getElementById('supportResult');
 let offered=false;
 function updateCopy(){
  const lang=document.documentElement.lang;
  const values=copy[lang] || copy.en;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
   const key=el.getAttribute('data-i18n');
   const index=keys.indexOf(key);
   if(index>=0) el.textContent=values[index];
  });
  const subtitle=document.getElementById('donateDesc');
  if(subtitle) subtitle.textContent=values[2];
 }
 function offer(){
  if(offered) return;
  offered=true;
  // Do not compete with an already open donation window.
  if(document.getElementById('donateOverlay')?.classList.contains('active')) return;
  panel.hidden=false;
 }
 const originalShowStatus=window.showStatus;
 if(typeof originalShowStatus==='function'){
  window.showStatus=function(el,text,type){
   const result=originalShowStatus.apply(this,arguments);
   try {
    if(type==='ok' && el && (text===t('common.done') || text===t('editor.saved'))) offer();
   }catch(error){console.warn('Support prompt unavailable',error);}
   return result;
  };
 }
 document.getElementById('supportResultDismiss').onclick=()=>{panel.hidden=true;};
 document.getElementById('supportResultDonate').onclick=()=>{
  panel.hidden=true;
  if(typeof openDonate==='function') openDonate();
 };
 document.getElementById('donateBtn').addEventListener('click',()=>{offered=true;panel.hidden=true;});
 document.addEventListener('keydown',event=>{if(event.key==='Escape') panel.hidden=true;});
 new MutationObserver(updateCopy).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 updateCopy();
})();

