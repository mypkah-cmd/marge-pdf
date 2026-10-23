/* ==========================================================
   INIT
   ========================================================== */
if (window.pdfjsLib) { pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'; }
function detectBrowserLang() {
  const saved = v2Storage.getItem('pdfnest_lang');
  if (saved && translations[saved]) return saved;
  const langs = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || 'en'];
  for (const lang of langs) {
    const short = lang.toLowerCase().split('-')[0];
    if (translations[short]) return short;
  }
  return 'en';
}
setLang(detectBrowserLang());
updateLvClock();
setInterval(updateLvClock, 1000);
renderRecent();
setInterval(renderRecent, 5000);
