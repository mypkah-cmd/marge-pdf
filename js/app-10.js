try {

/* ==========================================================
   PWA — Service Worker
   ========================================================== */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    Promise.resolve().then(() => navigator.serviceWorker.register('./service-worker.js'))
      .then(reg => console.log('✅ SW:', reg.scope))
      .catch(err => console.warn('⚠️ SW failed:', err));
  });
}

} catch (error) { console.warn("PWA unavailable",error); }
