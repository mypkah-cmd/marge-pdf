window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
(function(){
  var ok = false;
  try { ok = (v2Storage.getItem('pdfnest_cookies') === 'accepted'); } catch (_) {}
  window['ga-disable-G-30RLVLY5JJ'] = !ok;
  window.loadGA = function(){ if (window.__ga) return; window.__ga = 1; var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=G-30RLVLY5JJ'; document.head.appendChild(s); };
  if (ok) window.loadGA();
  gtag('consent', 'default', { analytics_storage: ok ? 'granted' : 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
})();
gtag('js', new Date());
gtag('config', 'G-30RLVLY5JJ', { 'anonymize_ip': true });
