(() => {
 'use strict';
 const copy={
 ru:{tag:'ВАШЕ ПРОСТРАНСТВО ДЛЯ ДОКУМЕНТОВ',title:'Меньше рутины.<br><em>Больше порядка.</em>',subtitle:'Объединяйте, редактируйте и конвертируйте PDF. Всё нужное для документов — в одном спокойном пространстве.',foot:'Без регистрации · Обработка файлов на вашем устройстве',tools:'Все инструменты',nav:'Инструменты',how:'Как это работает',about:'О проекте',count:'Выберите задачу — мы поможем с остальным',steps:['Три шага.<br>И готово.','Выберите инструмент','Найдите нужную задачу или воспользуйтесь поиском.','Добавьте документы','Файлы обрабатываются локально в браузере.','Скачайте результат','Проверьте готовый документ и сохраните его.'],more:'Дополнительно',blocked:'Защита паролем: пока недоступна'},
 en:{tag:'YOUR SPACE FOR DOCUMENTS',title:'Less busywork.<br><em>More clarity.</em>',subtitle:'Merge, edit and convert PDFs. Everything your documents need, in one thoughtfully simple workspace.',foot:'No account needed · Files processed on your device',tools:'All tools',nav:'Tools',how:'How it works',about:'About',count:'Choose a task. We’ll help with the rest.',steps:['Three steps.<br>All done.','Choose a tool','Find your task or use the search below.','Add your documents','Files are processed locally in your browser.','Download the result','Review your document and save the finished file.'],more:'More options',blocked:'Password encryption: unavailable'},
 lv:{tag:'JŪSU VIETA DOKUMENTIEM',title:'Mazāk rutīnas.<br><em>Vairāk kārtības.</em>',subtitle:'Apvienojiet, rediģējiet un konvertējiet PDF. Viss nepieciešamais dokumentiem vienā ērtā vietā.',foot:'Bez reģistrācijas · Apstrāde jūsu ierīcē',tools:'Visi rīki',nav:'Rīki',how:'Kā tas darbojas',about:'Par projektu',count:'Izvēlieties uzdevumu — par pārējo palīdzēsim.',steps:['Trīs soļi.<br>Gatavs.','Izvēlieties rīku','Atrodiet vajadzīgo uzdevumu vai izmantojiet meklētāju.','Pievienojiet dokumentus','Faili tiek apstrādāti lokāli pārlūkā.','Lejupielādējiet rezultātu','Pārbaudiet un saglabājiet gatavo dokumentu.'],more:'Papildu iespējas',blocked:'Aizsardzība ar paroli: nav pieejama'},
 de:{tag:'IHR RAUM FÜR DOKUMENTE',title:'Weniger Aufwand.<br><em>Mehr Klarheit.</em>',subtitle:'PDFs verbinden, bearbeiten und konvertieren. Alles für Ihre Dokumente an einem übersichtlichen Ort.',foot:'Ohne Registrierung · Verarbeitung auf Ihrem Gerät',tools:'Alle Werkzeuge',nav:'Werkzeuge',how:'So funktioniert’s',about:'Über das Projekt',count:'Wählen Sie eine Aufgabe — wir helfen beim Rest.',steps:['Drei Schritte.<br>Erledigt.','Werkzeug wählen','Finden Sie Ihre Aufgabe oder nutzen Sie die Suche.','Dokumente hinzufügen','Dateien werden lokal im Browser verarbeitet.','Ergebnis herunterladen','Prüfen und speichern Sie Ihr fertiges Dokument.'],more:'Weitere Optionen',blocked:'Passwortschutz: nicht verfügbar'}
 };
 const unavailable={ru:'Временно недоступно · шифрование не реализовано',en:'Unavailable · encryption is not implemented',lv:'Nav pieejams · šifrēšana nav ieviesta',de:'Nicht verfügbar · Verschlüsselung fehlt'};
 
 const shapes={merge:'<rect x="3" y="3" width="7" height="10" rx="1.5"/><rect x="14" y="3" width="7" height="10" rx="1.5"/><path d="M6.5 16v4h11v-4M12 20v-7m-3 3 3-3 3 3"/>',split:'<path d="M12 3v7m0 3-7 7m7-7 7 7M8 7l4 4 4-4M3 17v4h4m10 0h4v-4"/>',compress:'<path d="M4 3h5v5M20 3h-5v5M4 21h5v-5m11 5h-5v-5M9 8 3 2m12 6 6-6M9 16l-6 6m12-6 6 6"/>',rotate:'<path d="M20 10a8 8 0 1 0-1 7M20 4v6h-6"/>',extract:'<rect x="3" y="3" width="12" height="15" rx="2"/><path d="M8 7h3m-3 4h3m7 1 4 4-4 4m-5-4h9"/>',watermark:'<path d="M12 3s-7 7-7 12a7 7 0 0 0 14 0c0-5-7-12-7-12Z"/><path d="M8 15a4 4 0 0 0 4 4"/>',pagenum:'<path d="M5 8h14M4 16h14M10 3 6 21M18 3l-4 18"/>',img2pdf:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 5-5 4 4 4-7 5 8"/>',signature:'<path d="m4 15 11-11 5 5L9 20H4v-5Zm9-9 5 5M3 23h18"/>',stamp:'<path d="M8 13V7a4 4 0 1 1 8 0v6l4 3v3H4v-3l4-3Zm-3 9h14"/>',textedit:'<path d="M4 4h16M12 4v16m-4 0h8M4 1v6m16-6v6"/>',editor:'<path d="m4 17 12-13 4 4L8 21H3l1-4Zm10-11 4 4"/>',metadata:'<path d="M14 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9L14 3Zm0 0v7h7M7 14h10M7 17h6"/>',removepages:'<path d="M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7"/>',protect:'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3m-4 4v3"/>',unlockcopy:'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 7-2m-3 9v3"/>',qrpdf:'<path d="M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h3v3h4v4h-7v-4m7-3v1"/>',pdfcount:'<path d="M5 3h14v18H5zM8 7h8m-8 4h8m-8 4h3m3 0h2m-8 3h3"/>',default:'<path d="M5 3h9l5 5v13H5V3Zm9 0v6h5M8 13h8m-8 4h5"/>'};
 const hero=document.querySelector('.hero');const wrap=document.createElement('div');wrap.className='hero-copy';
 while(hero.firstChild)wrap.append(hero.firstChild);hero.append(wrap);
 const tag=document.createElement('span');tag.className='hero-tag';wrap.prepend(tag);const foot=document.createElement('p');foot.className='hero-footnote';wrap.append(foot);
 const art=document.createElement('div');art.className='hero-art';art.setAttribute('aria-hidden','true');art.innerHTML=`<svg viewBox="0 0 460 360" xmlns="http://www.w3.org/2000/svg"><g transform="rotate(-12 190 170)"><rect x="94" y="75" width="170" height="220" rx="14" fill="#e2dcef" stroke="#d5cbe9"/><path d="M122 119h93m-93 15h73m-73 44h112m-112 15h112m-112 15h90" stroke="#beb1db" stroke-width="5" stroke-linecap="round"/></g><g transform="rotate(9 260 180)"><rect x="179" y="47" width="180" height="240" rx="14" fill="white" stroke="#dfd8ee"/><rect x="199" y="70" width="48" height="24" rx="6" fill="#f0eafc"/><text x="210" y="86" fill="#8c6cce" font-size="11" font-family="Arial" font-weight="bold">PDF</text><path d="M200 124h135m-135 16h102m-102 30h135m-135 16h135m-135 16h94" stroke="#e7e2ef" stroke-width="5" stroke-linecap="round"/><rect x="199" y="225" width="135" height="38" rx="7" fill="#f5f1fc"/><path d="m212 251 19-15 18 12 21-10 21 13 20-14" stroke="#b09bd9" stroke-width="2" fill="none"/></g><rect x="135" y="234" width="65" height="65" rx="18" fill="#7960cf"/><path d="M154 263h26m-13-13v26m-7-6 7 7 7-7" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="357" cy="81" r="23" fill="#e4f1eb" stroke="white" stroke-width="4"/><path d="m348 81 6 6 12-13" stroke="#6da88e" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="82" cy="202" r="4" fill="#c4b3e4"/><circle cx="355" cy="309" r="5" fill="#cec0e8"/><path d="m390 182 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" fill="#cbbce5"/></svg>`;hero.append(art);
 const nav=document.createElement('nav');nav.className='modern-nav';nav.setAttribute('aria-label','Navigation');nav.innerHTML='<a href="#v2Controls"></a><a href="#modernHow"></a><a href="#siteFooter"></a>';document.querySelector('.logo').after(nav);
 document.querySelector('footer').id='siteFooter';
 const how=document.createElement('section');how.id='modernHow';how.className='modern-how';document.querySelector('.v2-diagnostics').before(how);
 const head=document.createElement('div');head.className='catalog-head';head.innerHTML='<h2></h2><span></span>';document.querySelector('#v2Controls').prepend(head);
 document.querySelector('label[for=toolSearch]').style.cssText='position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);';
 const more=document.createElement('div');more.className='modern-more';more.innerHTML='<button type="button" class="icon-btn" aria-expanded="false">•••</button><div class="modern-more-menu"></div>';document.querySelector('#langDropdown').before(more);
 const menu=more.lastElementChild;for(const selector of ['.lv-clock','#timerBtn','#alarmBtn','#helpBtn','.mirror-btn']){const el=document.querySelector('header '+selector);if(el)menu.append(el);}
 more.firstElementChild.onclick=()=>{const open=more.classList.toggle('open');more.firstElementChild.setAttribute('aria-expanded',String(open));};
 document.addEventListener('click',e=>{if(!more.contains(e.target)){more.classList.remove('open');more.firstElementChild.setAttribute('aria-expanded','false');}});
 const logo=document.querySelector('.logo');logo.onclick=()=>{window.scrollTo({top:0,behavior:'smooth'});};logo.setAttribute('role','button');logo.tabIndex=0;logo.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();logo.click();}};
 function update(){
  const c=copy[document.documentElement.lang]||copy.en;
  tag.textContent=c.tag;hero.querySelector('h1').innerHTML=c.title;hero.querySelector('p:not(.hero-footnote)').textContent=c.subtitle;foot.textContent=c.foot;
  [...nav.children].forEach((a,i)=>a.textContent=[c.nav,c.how,c.about][i]);head.firstElementChild.textContent=c.tools;head.lastElementChild.textContent=c.count;
  how.innerHTML='<div><h2>'+c.steps[0]+'</h2></div>'+[0,1,2].map((n)=>'<div><span class="step-num">0'+(n+1)+'</span><h3>'+c.steps[1+n*2]+'</h3><p>'+c.steps[2+n*2]+'</p></div>').join('');
  more.firstElementChild.setAttribute('aria-label',c.more);
 }
 function icons(){document.querySelectorAll('#toolsGrid .tool-card').forEach(card=>{
  const icon=card.querySelector('.tool-icon');if(!icon||icon.dataset.modern)return;icon.dataset.modern='yes';
  icon.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+(shapes[card.dataset.tool]||shapes.default)+'</svg>';
  
 });}
 new MutationObserver(icons).observe(document.getElementById('toolsGrid'),{childList:true,subtree:true});
 new MutationObserver(update).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});

 const support=document.getElementById('supportResult');if(support)document.getElementById('uxResult').after(support);
 function openHash(){const id=location.hash.slice(1);if(!TOOLS.some(tool=>tool.id===id))return;document.getElementById('v2Reset').click();document.querySelector('#toolsGrid [data-tool="'+id+'"] button')?.click();}
 window.addEventListener('hashchange',openHash);openHash();

 let previousModal=null,previousFocus=null;
 const modalCheck=()=>{
  const active=[...document.querySelectorAll('.modal-overlay.active')].at(-1);
  if(active!==previousModal){
   if(active){previousFocus=document.activeElement;const box=active.querySelector('.modal');if(box){box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');const h=box.querySelector('h2');if(h){h.id ||=active.id+'Title';box.setAttribute('aria-labelledby',h.id);}box.querySelector('button:not([disabled]),input:not([type=hidden]):not([disabled]),select')?.focus();}}
   else if(previousFocus?.isConnected)previousFocus.focus();
   previousModal=active;
  }
 };
 new MutationObserver(modalCheck).observe(document.body,{attributes:true,subtree:true,attributeFilter:['class']});
 document.addEventListener('keydown',e=>{if(e.key!=='Tab'||!previousModal)return;const nodes=[...previousModal.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]')].filter(x=>x.getClientRects().length);if(!nodes.length)return;const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
 renderTools();update();icons();
})();
