/* ==========================================================
   PROXY / ZSCALER DETECTION
   ========================================================== */
(function detectCorporateProxy() {
  const hn = (window.location.hostname || '').toLowerCase();
  const href = (window.location.href || '').toLowerCase();
  const ref = (document.referrer || '').toLowerCase();
  const blockedHosts = ['zscaler.com','zscaler.net','zscalerone.net','zscalerthree.net','isolation.zscaler','nskope.com','goskope.com','netskope.com','menlosecurity.com','menlo.io','wss.symantec.com','symantec.com','forcepoint.com','websense.com','paloaltonetworks.com','prismaaccess.com','umbrella.com','opendns.com','mcas.ms','defender.microsoft.com','beyondcorp.google.com','cloudflare-gateway','warp.cloudflare.com'];
  const isProxy = blockedHosts.some(h => hn.includes(h) || href.includes(h) || ref.includes(h));
  if (isProxy) {
    const b = document.getElementById('proxyBanner');
    if (b) b.classList.add('show');
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 200);
  }
})();
