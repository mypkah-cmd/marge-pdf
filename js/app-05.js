/* ==========================================================
   HELP + ABOUT + DONATE + CONTACT
   ========================================================== */
const helpOverlay = document.getElementById('helpOverlay');
function openHelp() {
  helpOverlay.classList.add('active');
  const body = document.getElementById('helpBody');
  body.innerHTML = '';
  const sections = [
    { titleKey:'help.intro.title', textKey:'help.intro.text' },
    { group:'help.group.basic', items:[ { id:'merge',icon:'🔗' },{ id:'split',icon:'✂️' },{ id:'compress',icon:'🗜️' },{ id:'rotate',icon:'🔄' },{ id:'watermark',icon:'💧' },{ id:'pagenum',icon:'🔢' },{ id:'protect',icon:'🔐' },{ id:'metadata',icon:'🏷️' },{ id:'removepages',icon:'🗑️' } ] },
    { group:'help.group.editors', items:[ { id:'editor',icon:'✏️' },{ id:'textedit',icon:'📝' },{ id:'signature',icon:'✍️' },{ id:'stamp',icon:'🔖' } ] },
    { group:'help.group.media', items:[ { id:'img2pdf',icon:'🖼️' },{ id:'pdf2jpg',icon:'📷' },{ id:'pdf2word',icon:'📝' },{ id:'word2pdf',icon:'📄' },{ id:'excel2pdf',icon:'📊' },{ id:'pdf2excel',icon:'📈' } ] },
    { group:'help.group.extra', items:[ { id:'recent',icon:'🕓' },{ id:'timer',icon:'⏱️' },{ id:'theme',icon:'🌙' } ] }
  ];
  sections.forEach(sec => {
    if (sec.titleKey) {
      const div = document.createElement('div'); div.className='help-item';
      div.innerHTML = '<div class="help-text"><strong>' + t(sec.titleKey) + '</strong><p>' + t(sec.textKey) + '</p></div>';
      body.appendChild(div); return;
    }
    if (sec.group) {
      const h = document.createElement('div'); h.className='help-group-title'; h.textContent = t(sec.group);
      body.appendChild(h);
      sec.items.forEach(it => {
        const div = document.createElement('div'); div.className='help-item';
        div.innerHTML = '<div class="help-icon">' + it.icon + '</div><div class="help-text"><strong>' + t('help.'+it.id+'.title') + '</strong><p>' + t('help.'+it.id+'.text') + '</p></div>';
        body.appendChild(div);
      });
    }
  });
  document.getElementById('helpTitle').textContent = t('help.title');
  document.getElementById('helpSubtitle').textContent = t('help.subtitle');
}
function closeHelp() { helpOverlay.classList.remove('active'); }
helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) closeHelp(); });
document.getElementById('helpBtn').addEventListener('click', openHelp);

const donateOverlay = document.getElementById('donateOverlay');
function openDonate() { donateOverlay.classList.add('active'); LazyAssets.qr().catch(error => console.warn('QR unavailable',error)); }
function closeDonate() { donateOverlay.classList.remove('active'); }
donateOverlay.addEventListener('click', e => { if (e.target === donateOverlay) closeDonate(); });
document.getElementById('donateBtn').addEventListener('click', openDonate);

const aboutOverlay = document.getElementById('aboutOverlay');
function openAbout() { aboutOverlay.classList.add('active'); }
function closeAbout() { aboutOverlay.classList.remove('active'); }
aboutOverlay.addEventListener('click', e => { if (e.target === aboutOverlay) closeAbout(); });

const contactOverlay = document.getElementById('contactOverlay');
function openContact() { contactOverlay.classList.add('active'); document.getElementById('contactEmailText').textContent = CONFIG.EMAIL; }
function closeContact() { contactOverlay.classList.remove('active'); }
contactOverlay.addEventListener('click', e => { if (e.target === contactOverlay) closeContact(); });
document.getElementById('contactEmailLink').addEventListener('click', e => {
  e.preventDefault();
  navigator.clipboard.writeText(CONFIG.EMAIL).then(() => {
    const emailText = document.getElementById('contactEmailText');
    if (emailText) {
      const orig = emailText.textContent;
      emailText.textContent = 'Email copied!';
      setTimeout(() => { emailText.textContent = orig; }, 1500);
    }
  });
});
function contactUs(e) { e.preventDefault(); openContact(); }
window.contactUs = contactUs;
