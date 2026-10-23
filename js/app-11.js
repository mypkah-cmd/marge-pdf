// Additive interface. Original tool handlers are retained.
(() => {
  'use strict';
  const grid = document.getElementById('toolsGrid');
  if (!grid || typeof TOOLS === 'undefined' || typeof t !== 'function') return;
  const words = {
    ru:['Найти инструмент…','Все','Страницы PDF','Конвертация','Редактирование','Избранное','Показано','Сбросить','Ничего не найдено','Диагностика загрузки','Объединить PDF','Подписать PDF','Загрузится при необходимости','загружена','История файлов: отключить','История файлов: включить','Добавить в избранное','Убрать из избранного','Сохранение истории выключено. Уже сохранённые файлы можно удалить в блоке недавних файлов.'],
    en:['Find a tool…','All','PDF pages','Convert','Edit','Favorites','Shown','Reset','No matching tools','Load diagnostics','Merge PDF','Sign PDF','Loads when needed','loaded','File history: disable','File history: enable','Add to favorites','Remove from favorites','History saving is disabled. Previously saved files can be removed in Recent files.'],
    lv:['Meklēt rīku…','Visi','PDF lapas','Konvertēt','Rediģēt','Izlase','Parādīti','Atiestatīt','Nekas nav atrasts','Ielādes diagnostika','Apvienot PDF','Parakstīt PDF','Ielādēsies pēc vajadzības','ielādēta','Failu vēsture: izslēgt','Failu vēsture: ieslēgt','Pievienot izlasei','Noņemt no izlases','Vēstures saglabāšana ir izslēgta. Iepriekš saglabātos failus var dzēst neseno failu sadaļā.'],
    de:['Werkzeug suchen…','Alle','PDF-Seiten','Konvertieren','Bearbeiten','Favoriten','Angezeigt','Zurücksetzen','Keine Treffer','Ladediagnose','PDF verbinden','PDF unterschreiben','Wird bei Bedarf geladen','geladen','Dateiverlauf: aus','Dateiverlauf: ein','Zu Favoriten','Aus Favoriten entfernen','Verlaufsspeicherung deaktiviert. Gespeicherte Dateien lassen sich unter Letzte Dateien entfernen.']
  };
  let category = 'all';
  let query = '';
  let favorites;
  try { favorites = new Set(JSON.parse(v2Storage.getItem('marge_v2_favorites') || '[]')); }
  catch (_) { favorites = new Set(); }
  let historyEnabled = v2Storage.getItem('marge_v2_history') === 'yes';
  const groups = {
    pages:['unlockcopy','pdfcount','merge','split','compress','rotate','extract','removepages'],
    convert:['pdf2jpg','pdf2word','excel2pdf','pdf2excel','word2pdf','img2pdf'],
    edit:['qrpdf','watermark','pagenum','metadata','editor','signature','stamp','textedit','protect']
  };
  const controls = document.getElementById('v2Controls');
  const search = document.getElementById('toolSearch');
  const tabs = document.getElementById('v2Tabs');
  const count = document.getElementById('v2Count');
  const reset = document.getElementById('v2Reset');
  const diagnostics = document.createElement('details');
  diagnostics.className = 'v2-diagnostics';
  const diagnosticTitle = document.createElement('summary');
  const diagnosticList = document.createElement('ul');
  const historyButton = document.createElement('button');
  historyButton.type = 'button';
  historyButton.className = 'footer-btn';
  historyButton.style.marginTop = '12px';
  const historyNote = document.createElement('p');
  historyNote.style.marginTop = '12px';
  diagnostics.append(diagnosticTitle,diagnosticList,historyButton,historyNote);
  grid.after(diagnostics);
  const quick = document.createElement('div');
  quick.className = 'v2-quick';
  document.querySelector('.hero')?.append(quick);
  const originalHistory = window.__idbAddFile;
  if (typeof originalHistory === 'function') {
    window.__idbAddFile = (...args) => historyEnabled ? originalHistory(...args) : Promise.resolve();
  }
  const language = () => words[document.documentElement.lang] || words.en;
  function open(tool) {
    if (tool.custom === 'removePages') openRemovePages();
    else if (tool.custom === 'editor') openEditor();
    else if (tool.custom === 'signature') openSignature();
    else if (tool.custom === 'stamp') openStamp();
    else if (tool.custom === 'textedit') openTextEditor();
    else openTool(tool);
  }
  function render() {
    const w = language();
    search.placeholder = w[0];
    search.setAttribute('aria-label',w[0]);
    reset.textContent = w[7];
    tabs.replaceChildren();
    [['all',1],['pages',2],['convert',3],['edit',4],['favorites',5]].forEach(([id,n]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = w[n];
      button.setAttribute('aria-pressed',String(category === id));
      button.onclick = () => { category = id; render(); };
      tabs.append(button);
    });
    grid.replaceChildren();
    const filtered = TOOLS.filter(tool => {
      const text = [tool.id,t('tool.'+tool.id+'.name'),t('tool.'+tool.id+'.desc')].join(' ').toLocaleLowerCase();
      const match = category === 'all' || (category === 'favorites' ? favorites.has(tool.id) : groups[category]?.includes(tool.id));
      return match && text.includes(query.toLocaleLowerCase().trim());
    });
    filtered.forEach(tool => {
      const card = document.createElement('div');
      card.className = 'tool-card';
      const launch = document.createElement('button');
      launch.type = 'button';
      launch.style.cssText = 'border:0;background:transparent;color:inherit;text-align:left;font:inherit;width:100%;cursor:pointer;';
      const icon = document.createElement('span');
      icon.className = 'tool-icon';
      icon.textContent = tool.icon;
      icon.setAttribute('aria-hidden','true');
      const title = document.createElement('h3');
      title.textContent = t('tool.'+tool.id+'.name');
      const description = document.createElement('p');
      description.className = 'v2-description';
      description.textContent = t('tool.'+tool.id+'.desc');
      launch.append(icon,title,description);
      launch.onclick = () => open(tool);
      const star = document.createElement('button');
      star.type = 'button';
      star.className = 'v2-star';
      star.textContent = favorites.has(tool.id) ? '★' : '☆';
      star.setAttribute('aria-label',favorites.has(tool.id) ? w[17] : w[16]);
      star.setAttribute('aria-pressed',String(favorites.has(tool.id)));
      star.onclick = () => {
        favorites.has(tool.id) ? favorites.delete(tool.id) : favorites.add(tool.id);
        v2Storage.setItem('marge_v2_favorites',JSON.stringify([...favorites]));
        render();
      };
      card.append(launch,star);
      grid.append(card);
    });
    count.textContent = w[6]+': '+filtered.length+' / '+TOOLS.length;
    if (!filtered.length) {
      const empty = document.createElement('p');
      empty.className = 'v2-empty';
      empty.textContent = w[8];
      grid.append(empty);
    }
    quick.replaceChildren();
    [['merge',10],['signature',11]].forEach(([id,n]) => {
      const tool = TOOLS.find(x => x.id === id);
      if (!tool) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = w[n];
      button.onclick = () => open(tool);
      quick.append(button);
    });
    diagnosticTitle.textContent = w[9];
    diagnosticList.replaceChildren();
    [['PDF-Lib',!!window.PDFLib],['PDF.js',!!window.pdfjsLib],['jsPDF',!!window.jspdf],['XLSX',!!window.XLSX],['Mammoth',!!window.mammoth],['JSZip',!!window.JSZip]].forEach(([name,ok]) => {
      const li = document.createElement('li');
      li.textContent = (ok ? '✓ ' : '⚠ ')+name+': '+(ok ? w[13] : w[12]);
      diagnosticList.append(li);
    });
    historyButton.textContent = historyEnabled ? w[14] : w[15];
    historyNote.textContent = historyEnabled ? '' : w[18];
  }
  search.addEventListener('input',() => { query = search.value; render(); });
  reset.onclick = () => { query = ''; category = 'all'; search.value = ''; render(); };
  historyButton.onclick = () => {
    historyEnabled = !historyEnabled;
    v2Storage.setItem('marge_v2_history',historyEnabled ? 'yes' : 'no');
    render();
  };
  new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  document.addEventListener('keydown',event => {
    if (event.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active .modal-close').forEach(button => button.click());
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault(); search.focus();
    }
  });
  window.renderTools = render;
  render();
})();

