/* ==========================================================
   NEW TOOLS (app-15.js) — QR Code, Unlock, Count
   Добавляет 3 инструмента поверх существующих, не меняя старый код.
   ========================================================== */
(function() {
  'use strict';

  // 1. Ждём, пока загрузится основной код (TOOLS, translations, executeTool)
  function initNewTools() {
    if (typeof TOOLS === 'undefined' || typeof translations === 'undefined') {
      setTimeout(initNewTools, 100);
      return;
    }

    // 2. Добавляем переводы
    const newTranslations = {
      en: {
        "tool.qrcode.name": "QR Code on PDF", "tool.qrcode.desc": "Add a clickable QR code to your PDF.",
        "tool.unlock.name": "Unlock PDF", "tool.unlock.desc": "Remove password protection from a PDF you own.",
        "tool.count.name": "Count Pages & Words", "tool.count.desc": "Get the page, word, and character count of a PDF.",
        "opt.qrText": "Text or URL for QR code", "opt.qrPosition": "Position",
        "count.pages": "Pages", "count.words": "Words", "count.chars": "Characters", "count.size": "File size", "opt.passwordHint": "Enter the current password",
      },
      ru: {
        "tool.qrcode.name": "QR-код на PDF", "tool.qrcode.desc": "Добавьте кликабельный QR-код в PDF.",
        "tool.unlock.name": "Снять пароль с PDF", "tool.unlock.desc": "Удалить защиту с PDF, если вы знаете пароль.",
        "tool.count.name": "Счётчик страниц и слов", "tool.count.desc": "Узнать количество страниц, слов и символов.",
        "opt.qrText": "Текст или ссылка для QR-кода", "opt.qrPosition": "Позиция",
        "count.pages": "Страниц", "count.words": "Слов", "count.chars": "Символов", "count.size": "Размер файла", "opt.passwordHint": "Введите текущий пароль",
      },
      lv: {
        "tool.qrcode.name": "QR kods uz PDF", "tool.qrcode.desc": "Pievienojiet PDF klikšķināmu QR kodu.",
        "tool.unlock.name": "Noņemt paroli no PDF", "tool.unlock.desc": "Noņemiet aizsardzību, ja zināt paroli.",
        "tool.count.name": "Lappušu un vārdu skaitītājs", "tool.count.desc": "Uzziniet lappušu, vārdu un rakstzīmju skaitu.",
        "opt.qrText": "Teksts vai saite QR kodam", "opt.qrPosition": "Pozīcija",
        "count.pages": "Lappuses", "count.words": "Vārdi", "count.chars": "Rakstzīmes", "count.size": "Faila izmērs", "opt.passwordHint": "Ievadiet pašreizējo paroli",
      },
      de: {
        "tool.qrcode.name": "QR-Code auf PDF", "tool.qrcode.desc": "Fügen Sie einen klickbaren QR-Code hinzu.",
        "tool.unlock.name": "PDF-Passwort entfernen", "tool.unlock.desc": "Entfernen Sie den Schutz, wenn Sie das Passwort kennen.",
        "tool.count.name": "Seiten- und Wortzähler", "tool.count.desc": "Seiten, Wörter und Zeichen zählen.",
        "opt.qrText": "Text oder URL für QR-Code", "opt.qrPosition": "Position",
        "count.pages": "Seiten", "count.words": "Wörter", "count.chars": "Zeichen", "count.size": "Dateigröße", "opt.passwordHint": "Aktuelles Passwort eingeben",
      }
    };

    Object.keys(newTranslations).forEach(lang => {
      if (translations[lang]) {
        Object.assign(translations[lang], newTranslations[lang]);
      }
    });

    // 3. Добавляем инструменты в TOOLS (если их ещё нет)
    const newTools = [
      { id: 'qrcode', icon: '📱', needs: 1 },
      { id: 'unlock', icon: '🔓', needs: 1 },
      { id: 'count', icon: '🔢', needs: 1 }
    ];
    newTools.forEach(t => {
      if (!TOOLS.find(x => x.id === t.id)) TOOLS.push(t);
    });

    // 4. Перерисовываем сетку, чтобы новые инструменты появились
    if (typeof renderTools === 'function') renderTools();

    // 5. Расширяем buildToolForm (добавляем поля)
    const originalBuildToolForm = window.buildToolForm;
    window.buildToolForm = function(tool) {
      let html = originalBuildToolForm(tool);
      // Вставляем extra-поля перед кнопкой runBtn
      if (tool.id === 'qrcode') {
        const extra = '<div class="options"><label>' + t('opt.qrText') + '</label><input type="text" id="qrText" value="https://margepdf.com"><label>' + t('opt.qrPosition') + '</label><select id="qrPosition"><option value="top-left">↖ Top left</option><option value="top-right">↗ Top right</option><option value="bottom-left">↙ Bottom left</option><option value="bottom-right" selected>↘ Bottom right</option></select></div>';
        html = html.replace('<button class="btn" id="runBtn"', extra + '<button class="btn" id="runBtn"');
      }
      if (tool.id === 'unlock') {
        const extra = '<div class="options"><label>' + t('opt.passwordHint') + '</label><input type="text" id="unlockPassword"></div>';
        html = html.replace('<button class="btn" id="runBtn"', extra + '<button class="btn" id="runBtn"');
      }
      return html;
    };

    // 6. Перехватываем executeTool, чтобы добавить новые инструменты
    const originalExecuteTool = window.executeTool;
    window.executeTool = async function(tool, statusMsg) {
      if (tool.id === 'qrcode') { return await executeQrCode(tool, statusMsg); }
      if (tool.id === 'unlock') { return await executeUnlock(tool, statusMsg); }
      if (tool.id === 'count') { return await executeCount(tool, statusMsg); }
      return originalExecuteTool.apply(this, arguments);
    };

    // 7. Функции для новых инструментов
    async function executeQrCode(tool, statusMsg) {
      const runBtn = document.getElementById('runBtn');
      runBtn.disabled = true;
      showStatus(statusMsg, t('common.processing'), 'info');
      try {
        await window.ensureLibs('donate');
        const text = document.getElementById('qrText').value || 'https://margepdf.com';
        const position = document.getElementById('qrPosition').value;
        const qrDiv = document.createElement('div');
        new QRCode(qrDiv, { text: text, width: 256, height: 256, correctLevel: QRCode.CorrectLevel.H });
        await new Promise(r => setTimeout(r, 300));
        const qrCanvas = qrDiv.querySelector('canvas');
        const qrDataUrl = qrCanvas.toDataURL('image/png');
        const qrBytes = await (await fetch(qrDataUrl)).arrayBuffer();
        const src = await PDFLib.PDFDocument.load(await currentFiles[0].arrayBuffer(), { ignoreEncryption: true });
        const png = await src.embedPng(qrBytes);
        src.getPages().forEach(page => {
          const { width, height } = page.getSize();
          const size = 100, margin = 20;
          let x = margin, y = margin;
          if (position === 'top-left') { x = margin; y = height - size - margin; }
          if (position === 'top-right') { x = width - size - margin; y = height - size - margin; }
          if (position === 'bottom-left') { x = margin; y = margin; }
          if (position === 'bottom-right') { x = width - size - margin; y = margin; }
          page.drawImage(png, { x, y, width: size, height: size });
        });
        downloadBlob(new Blob([await src.save()], { type: 'application/pdf' }), 'qr-code.pdf');
        showStatus(statusMsg, t('common.done'), 'ok');
      } catch (err) {
        console.error(err);
        showStatus(statusMsg, t('common.error') + err.message, 'err');
      } finally {
        runBtn.disabled = false;
      }
    }

    async function executeUnlock(tool, statusMsg) {
      const runBtn = document.getElementById('runBtn');
      runBtn.disabled = true;
      showStatus(statusMsg, t('common.processing'), 'info');
      try {
        const password = document.getElementById('unlockPassword').value;
        if (!password) throw new Error('Password required');
        const bytes = await currentFiles[0].arrayBuffer();
        let src;
        try {
          src = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true, password: password });
        } catch (e) {
          throw new Error('Wrong password or PDF is not encrypted');
        }
        const out = await src.save();
        downloadBlob(new Blob([out], { type: 'application/pdf' }), 'unlocked.pdf');
        showStatus(statusMsg, t('common.done'), 'ok');
      } catch (err) {
        console.error(err);
        showStatus(statusMsg, t('common.error') + err.message, 'err');
      } finally {
        runBtn.disabled = false;
      }
    }

    async function executeCount(tool, statusMsg) {
      const runBtn = document.getElementById('runBtn');
      runBtn.disabled = true;
      showStatus(statusMsg, t('common.processing'), 'info');
      try {
        const buffer = await currentFiles[0].arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
        let totalWords = 0, totalChars = 0;
        for (let i = 1; i <= pdf.numPages; i++) {
          const content = await (await pdf.getPage(i)).getTextContent();
          const text = content.items.map(item => item.str).join(' ');
          totalChars += text.length;
          totalWords += text.trim().split(/\s+/).filter(w => w.length > 0).length;
        }
        const sizeKB = (buffer.byteLength / 1024).toFixed(1);
        const resultBox = document.getElementById('uxResult');
        resultBox.hidden = false;
        resultBox.innerHTML = '<h2>' + t('tool.count.name') + '</h2>' +
          '<p><strong>' + t('count.pages') + ':</strong> ' + pdf.numPages + '</p>' +
          '<p><strong>' + t('count.words') + ':</strong> ' + totalWords.toLocaleString() + '</p>' +
          '<p><strong>' + t('count.chars') + ':</strong> ' + totalChars.toLocaleString() + '</p>' +
          '<p><strong>' + t('count.size') + ':</strong> ' + sizeKB + ' KB</p>' +
          '<div class="ux-actions"><button type="button" class="ux-button" onclick="closeModal();document.getElementById(\'uxResult\').hidden=true;">' + t('common.done') + '</button></div>';
        resultBox.scrollIntoView({ block: 'center' });
        showStatus(statusMsg, t('common.done'), 'ok');
      } catch (err) {
        console.error(err);
        showStatus(statusMsg, t('common.error') + err.message, 'err');
      } finally {
        runBtn.disabled = false;
      }
    }

    console.log('✅ New tools (QR, Unlock, Count) loaded.');
  }

  // Запускаем инициализацию, когда DOM готов
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNewTools);
  } else {
    initNewTools();
  }
})();