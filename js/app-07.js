/* ==========================================================
   COOKIES
   ========================================================== */
const GA_ID = 'G-30RLVLY5JJ';
function acceptCookies() { v2Storage.setItem('pdfnest_cookies', 'accepted'); document.getElementById('cookieBanner').classList.add('hidden'); window['ga-disable-' + GA_ID] = false; }
function declineCookies() { v2Storage.setItem('pdfnest_cookies', 'declined'); document.getElementById('cookieBanner').classList.add('hidden'); window['ga-disable-' + GA_ID] = true; }
window.acceptCookies = acceptCookies;
window.declineCookies = declineCookies;
document.addEventListener('DOMContentLoaded', () => { const b = document.getElementById('cookieBanner'); if (!b) return; const c = v2Storage.getItem('pdfnest_cookies'); if (!c) { b.classList.remove('hidden'); window['ga-disable-' + GA_ID] = true; } });
