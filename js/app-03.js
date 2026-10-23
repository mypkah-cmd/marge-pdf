/* ==========================================================
   CONFIG
   ========================================================== */
const CONFIG = { EMAIL: 'margepdf@gmail.com', PAYPAL: 'KosatiT', SITE_NAME: 'marge-PDF' };

/* ==========================================================
   TRANSLATIONS
   ========================================================== */
const translations = {
  en: {
    "hero.title":"Merge PDFs. Beyond the margins.","hero.subtitle":"All your PDF tools in one place — free, fast, and 100% private.",
    "footer.text":"Made with ❤️ — All processing happens in your browser","adSlot.text":"Your ad could be here","mirror.text":"Mirror",
    "proxy.title":"🔒 Working from a corporate computer?","proxy.text":"If your security system blocks file uploads — try the mirror:",
    "why.privacy.title":"100% Private","why.privacy.desc":"Your files never leave your browser.","why.fast.title":"Lightning Fast","why.fast.desc":"Libraries load when you need them.","why.free.title":"Completely Free","why.free.desc":"No limits, no registration, no hidden fees.","why.all.title":"Works Everywhere","why.all.desc":"Any device with a modern browser.",
    "about.btnText":"Why is it free?",
    "about.title":"✨ Why marge-PDF is Free","about.subtitle":"And always will be",
    "about.block1.title":"No limits. Ever.","about.block1.desc":"Merge 5, 10, or 50 PDF files — without limits, without subscription, without hidden fees. The project runs on voluntary donations, not on users.",
    "about.block2.title":"Your files never leave your device","about.block2.desc":"Everything happens directly in your browser. No uploads to any server, no email confirmations, no accounts. The selected tool loads its libraries on first use; that first load needs an internet connection.",
    "about.block3.title":"So how does it survive?","about.block3.desc":"Almost zero costs: no servers to pay for, no databases, no analytics trackers. Just static files on Cloudflare Workers. That's why marge-PDF stays free forever — no ads, no subscription.",
    "about.block4.title":"Thank you for being here","about.block4.desc":"Every visitor, every shared link, every coffee donation keeps this project alive. You make marge-PDF worth building.",
    "about.supportBtn":"💰 Support the project",
    "contact.btnText":"Contact us","contact.title":"✉️ Contact Us","contact.subtitle":"We'd love to hear from you","contact.emailLabel":"Email","contact.note":"Questions, suggestions, bug reports — drop us a line.",
    "donate.qrLabel":"📱 Scan QR to donate via PayPal","donate.title":"💰 Support the Project","donate.subtitle":"Every coffee counts — and helps keep the tools free for everyone.","donate.oneTime":"Donate $1","donate.oneTimeDesc":"One-time support","donate.sub":"Donate $5","donate.subDesc":"Bigger support","donate.thanks":"Thank you! ❤️",
    "common.drop":"Drop files here or click to browse","common.run":"Run","common.processing":"Processing...","common.done":"Done! File downloaded.","common.error":"Error: ",
    "tool.merge.name":"Merge PDF","tool.merge.desc":"Combine multiple PDFs. Drag to reorder.","tool.split.name":"Split PDF","tool.split.desc":"Extract a page range.","tool.compress.name":"Compress PDF","tool.compress.desc":"Reduce PDF size.","tool.rotate.name":"Rotate PDF","tool.rotate.desc":"Rotate pages.","tool.extract.name":"Extract Pages","tool.extract.desc":"Pull pages into a separate PDF.","tool.watermark.name":"Watermark","tool.watermark.desc":"Stamp text on pages.","tool.pagenum.name":"Page Numbers","tool.pagenum.desc":"Add page numbers.","tool.excel2pdf.name":"Excel → PDF","tool.excel2pdf.desc":"Convert Excel to PDF.","tool.pdf2excel.name":"PDF → Excel","tool.pdf2excel.desc":"Extract text to Excel.","tool.word2pdf.name":"Word → PDF","tool.word2pdf.desc":"Convert .docx to PDF.","tool.img2pdf.name":"Images → PDF","tool.img2pdf.desc":"Combine images. Drag to reorder.","tool.protect.name":"Protect PDF","tool.protect.desc":"Add password.","tool.metadata.name":"Edit Metadata","tool.metadata.desc":"Change title, author, subject.","tool.removepages.name":"Remove Pages","tool.removepages.desc":"Click pages to remove.","tool.editor.name":"Edit PDF (Draw)","tool.editor.desc":"Draw, select, move, rotate, pick color.","tool.pdf2jpg.name":"PDF → JPG","tool.pdf2jpg.desc":"Each page to JPG.","tool.pdf2word.name":"PDF → Word","tool.pdf2word.desc":"Extract text to Word.","tool.signature.name":"Add Signature","tool.signature.desc":"Draw, type, or upload signature.","tool.stamp.name":"Add Stamp","tool.stamp.desc":"Add APPROVED / DRAFT stamps.","tool.textedit.name":"Edit Text on PDF","tool.textedit.desc":"Edit existing text or add new.",
    "opt.range":"Page range (e.g. 1-3,5)","opt.angle":"Angle","opt.text":"Watermark text","opt.opacity":"Opacity (0.1 – 1)","opt.position":"Position","opt.password":"Password","opt.title":"Title","opt.author":"Author","opt.subject":"Subject",
    "timer.title":"⏱️ Timer","timer.desc":"Set a countdown.","timer.hours":"Hours","timer.minutes":"Minutes","timer.seconds":"Seconds","timer.start":"▶ Start","timer.stop":"⏹ Stop","timer.stopSound":"Stop sound","timer.finished":"⏰ Time's up!",
    "alarm.title":"🔔 Alarm","alarm.desc":"Set a time.","alarm.timeLabel":"Alarm time","alarm.labelLabel":"Label","alarm.set":"🔔 Set Alarm","alarm.added":"Alarm set for","alarm.needTime":"Please choose a valid time","alarm.ringing":"🔔 Alarm!",
    "rp.title":"🗑️ Remove Pages","rp.desc":"Click on pages you want to delete.","rp.drop":"Drop a PDF here","rp.hint":"Click pages","rp.run":"🗑️ Delete Selected","rp.selectOne":"Please select at least one page","rp.all":"You cannot delete all pages",
    "editor.title":"✏️ Edit PDF","editor.desc":"Draw on your PDF.","editor.save":"💾 Save & Download","editor.saved":"Done!","editor.textPrompt":"Text:","editor.hint":"💡 select/move · rotate 15° · picker · Del — delete · Ctrl+wheel — zoom","editor.selectFirst":"Select an object first","editor.colorPicked":"🎨 Color picked: ",
    "saveChoice.title":"💾 Save PDF","saveChoice.desc":"Choose method.","saveChoice.vectorTitle":"Save with text","saveChoice.vectorDesc":"Text stays copyable.","saveChoice.rasterTitle":"Save as image","saveChoice.rasterDesc":"Exact look.",
    "sig.title":"✍️ Add Signature","sig.desc":"Draw, type, or upload.","sig.tab.draw":"✏️ Draw","sig.tab.type":"⌨️ Type","sig.tab.upload":"📤 Upload","sig.type.label":"Your name","sig.upload.hint":"Upload signature image (PNG)","sig.place":"📌 Place on PDF","sig.needPDF":"Please upload a PDF first","sig.needSignature":"Please draw, type or upload a signature first","sig.placed":"Signature placed!",
    "stamp.title":"🔖 Add Stamp","stamp.desc":"Choose a preset stamp.","stamp.custom":"Custom text (optional)","stamp.place":"📌 Place on PDF","stamp.needPDF":"Please upload a PDF first","stamp.hintPlace":"💡 Click on PDF to place stamp","stamp.placed":"✅ Placed: ",
    "text.title":"✏️ Edit Text on PDF","text.desc":"Click on the page to add text.","text.font":"Font:","text.size":"Size:","text.hint":"💡 Click on the page to add text.","text.hintLong":"💡 Click existing text to edit · Click empty to add · Ctrl+wheel — zoom","text.needPDF":"Please upload a PDF first","text.promptText":"Enter text:",
    "recent.title":"🕓 Recent files","fmt.font":"Font:","fmt.size":"Size:","fmt.color":"Color:","fmt.apply":"Apply","fmt.cancel":"Cancel","fmt.editing":"✏️ Editing:",
    "help.btn":"Help","help.title":"❓ How to use","help.subtitle":"Quick guide to all tools","help.close":"Got it",
    "help.intro.title":"🎉 Welcome to marge-PDF!","help.intro.text":"All your PDF tools work directly in your browser. Nothing is uploaded, no registration needed. Just click a tool, drop a file, and get the result.",
    "help.group.basic":"Basic tools","help.group.editors":"Visual editors","help.group.media":"Media & documents","help.group.extra":"Extra features",
    "help.merge.title":"🔗 Merge PDF — combine files","help.merge.text":"Drop 2+ PDFs. Reorder by dragging. Click Run to download.",
    "help.split.title":"✂️ Split / Extract — pick pages","help.split.text":"Load one PDF, type a range like 1-3,5,7. Split cuts them into a new file; Extract pulls them out separately.",
    "help.compress.title":"🗜️ Compress — smaller PDF","help.compress.text":"Rewrites the PDF structure to shrink size.",
    "help.rotate.title":"🔄 Rotate — turn pages","help.rotate.text":"Rotate every page by 90°, 180° or 270° in one click.",
    "help.watermark.title":"💧 Watermark — protect with text","help.watermark.text":"Stamp any text diagonally on every page.",
    "help.pagenum.title":"🔢 Page numbers — add footer","help.pagenum.text":"Number pages at the bottom-left, center, or bottom-right.",
    "help.protect.title":"🔐 Protect — add password","help.protect.text":"Set a password. The file opens only after entering it.",
    "help.metadata.title":"🏷️ Metadata — change title/author","help.metadata.text":"Edit title, author, and subject.",
    "help.removepages.title":"🗑️ Remove pages — delete by clicking","help.removepages.text":"Click on page thumbnails to mark them for deletion.",
    "help.editor.title":"✏️ Draw on PDF — full visual editor","help.editor.text":"Draw with pen/marker/eraser, add shapes and text. Use 🖱️ to select & move objects, 🔄 to rotate 15°, 💧 to pick any color.",
    "help.textedit.title":"📝 Edit text on PDF — modify existing text","help.textedit.text":"Click on ANY existing text to open the formatting panel. White-out and redact modes hide content.",
    "help.signature.title":"✍️ Signature — sign documents","help.signature.text":"Three ways: draw with mouse/touch, type your name in a script font, or upload a PNG.",
    "help.stamp.title":"🔖 Stamp — official marks","help.stamp.text":"Pick a preset (APPROVED, REJECTED, DRAFT, URGENT...) or type your own.",
    "help.img2pdf.title":"🖼️ Images → PDF — combine photos","help.img2pdf.text":"Drop multiple JPG/PNG. Each image becomes one PDF page.",
    "help.pdf2jpg.title":"📷 PDF → JPG — screenshots per page","help.pdf2jpg.text":"Each page becomes a high-quality JPG.",
    "help.pdf2word.title":"📝 PDF → Word — extract text","help.pdf2word.text":"Extracts all text into a .doc file.",
    "help.word2pdf.title":"📄 Word → PDF — convert .docx","help.word2pdf.text":"Converts .docx text into a clean PDF.",
    "help.excel2pdf.title":"📊 Excel → PDF — table export","help.excel2pdf.text":"Each Excel sheet becomes a PDF page with a formatted table.",
    "help.pdf2excel.title":"📈 PDF → Excel — extract text into rows","help.pdf2excel.text":"Text from each PDF page lands in an .xlsx spreadsheet as rows.",
    "help.recent.title":"🕓 Recent files — auto history","help.recent.text":"Every downloaded result is saved in your browser (IndexedDB) for quick re-download.",
    "help.timer.title":"⏱️ Timer & 🔔 Alarm","help.timer.text":"Set a countdown or an alarm using your device’s local time.",
    "help.theme.title":"🌙 Theme & 🌐 Languages","help.theme.text":"Switch between light and dark. Change language via the globe icon — EN, RU, LV, DE.",
    "tip.clock":"Your device’s local time","tip.mirror":"Alternative mirror — if the main site is blocked","tip.ad":"Place your ad here","tip.donate":"Support the project","tip.theme":"Light / dark theme","tip.timer":"Timer — set a countdown","tip.alarm":"Alarm — set a fixed time","tip.help":"How to use all tools","tip.lang":"Change language",
    "tip.pen":"Pen — free drawing","tip.marker":"Marker — translucent drawing","tip.eraser":"Eraser","tip.line":"Line","tip.rect":"Rectangle","tip.circle":"Circle / ellipse","tip.arrow":"Arrow","tip.textBtn":"Add text","tip.select":"Select & move object","tip.rotateTool":"Rotate selected 15°","tip.picker":"Color picker — pick color from page",
    "tip.lw2":"Thin line","tip.lw4":"Medium line","tip.lw8":"Thick line","tip.lw14":"Extra thick line",
    "tip.colorRed":"Red color","tip.colorBlue":"Blue color","tip.colorGreen":"Green color","tip.colorOrange":"Orange color","tip.colorBlack":"Black color",
    "tip.undo":"Undo last action","tip.clear":"Clear all","tip.zoomIn":"Zoom in","tip.zoomOut":"Zoom out","tip.zoomReset":"Reset zoom"
  },
  ru: {
    "hero.title":"Объединяйте PDF. За гранью обычного.","hero.subtitle":"Все PDF-инструменты в одном месте — бесплатно, быстро и безопасно.",
    "footer.text":"Сделано с ❤️ — вся обработка в вашем браузере","adSlot.text":"Здесь могла бы быть ваша реклама","mirror.text":"Зеркало",
    "proxy.title":"🔒 Работаете с корпоративного компьютера?","proxy.text":"Если ваша система защиты блокирует загрузку файлов — попробуйте зеркало:",
    "why.privacy.title":"100% Приватно","why.privacy.desc":"Файлы не покидают браузер.","why.fast.title":"Молниеносно","why.fast.desc":"Библиотеки загружаются по необходимости.","why.free.title":"Бесплатно","why.free.desc":"Без ограничений, без регистрации и скрытых платежей.","why.all.title":"Работает Везде","why.all.desc":"Любое устройство с браузером.",
    "about.btnText":"Почему бесплатно?",
    "about.title":"✨ Почему marge-PDF бесплатный","about.subtitle":"И таким останется",
    "about.block1.title":"Без ограничений. Никогда.","about.block1.desc":"Объединяйте 5, 10 или 50 PDF-файлов — без лимитов, без подписки, без скрытых платежей. Проект существует за счёт добровольных донатов, а не за счёт пользователей.",
    "about.block2.title":"Ваши файлы никогда не покидают устройство","about.block2.desc":"Вся обработка происходит прямо в браузере. Нет загрузок на сервер, нет подтверждений email, нет аккаунтов. Библиотеки выбранного инструмента загружаются при первом использовании; для этой загрузки нужен интернет.",
    "about.block3.title":"Как проект выживает?","about.block3.desc":"Почти нулевые расходы: не нужно платить за серверы, базы данных и трекеры аналитики. Только статические файлы на Cloudflare Workers. Поэтому marge-PDF остаётся бесплатным навсегда — без рекламы, без подписки.",
    "about.block4.title":"Спасибо, что вы здесь","about.block4.desc":"Каждый посетитель, каждая пересланная ссылка и каждая чашка кофе в донат — поддерживают проект. Именно вы делаете marge-PDF нужным.",
    "about.supportBtn":"💰 Поддержать проект",
    "contact.btnText":"Связаться с нами","contact.title":"✉️ Связаться с нами","contact.subtitle":"Будем рады вашему сообщению","contact.emailLabel":"Email","contact.note":"Вопросы, предложения, баг-репорты — напишите нам.",
    "donate.qrLabel":"📱 Сканируйте QR для доната","donate.title":"💰 Поддержать проект","donate.subtitle":"Каждая чашка кофе важна — она помогает оставить инструменты бесплатными для всех.","donate.oneTime":"Донат $1","donate.oneTimeDesc":"Разовая поддержка","donate.sub":"Донат $5","donate.subDesc":"Большая поддержка","donate.thanks":"Спасибо! ❤️",
    "common.drop":"Перетащите файлы сюда или нажмите","common.run":"Выполнить","common.processing":"Обработка...","common.done":"Готово!","common.error":"Ошибка: ",
    "tool.merge.name":"Объединить PDF","tool.merge.desc":"Соедините несколько PDF. Перетаскивайте для порядка.","tool.split.name":"Разделить PDF","tool.split.desc":"Извлеките диапазон страниц.","tool.compress.name":"Сжать PDF","tool.compress.desc":"Уменьшить размер.","tool.rotate.name":"Повернуть PDF","tool.rotate.desc":"Повернуть страницы.","tool.extract.name":"Извлечь страницы","tool.extract.desc":"Отдельный PDF из страниц.","tool.watermark.name":"Водяной знак","tool.watermark.desc":"Текст на каждой странице.","tool.pagenum.name":"Номера страниц","tool.pagenum.desc":"Добавить номера.","tool.excel2pdf.name":"Excel → PDF","tool.excel2pdf.desc":"Преобразовать Excel.","tool.pdf2excel.name":"PDF → Excel","tool.pdf2excel.desc":"Извлечь текст в Excel.","tool.word2pdf.name":"Word → PDF","tool.word2pdf.desc":"Конвертировать .docx.","tool.img2pdf.name":"Картинки → PDF","tool.img2pdf.desc":"Объединить JPG/PNG.","tool.protect.name":"Защитить PDF","tool.protect.desc":"Добавить пароль.","tool.metadata.name":"Метаданные","tool.metadata.desc":"Название, автор, тема.","tool.removepages.name":"Удалить страницы","tool.removepages.desc":"Нажмите, чтобы удалить.","tool.editor.name":"Рисовать на PDF","tool.editor.desc":"Рисуйте, выбирайте, двигайте, поворачивайте.","tool.pdf2jpg.name":"PDF → JPG","tool.pdf2jpg.desc":"Каждая страница в JPG.","tool.pdf2word.name":"PDF → Word","tool.pdf2word.desc":"Извлечь текст в Word.","tool.signature.name":"Подпись","tool.signature.desc":"Нарисуйте или загрузите подпись.","tool.stamp.name":"Штамп","tool.stamp.desc":"APPROVED, DRAFT, URGENT.","tool.textedit.name":"Редактор текста","tool.textedit.desc":"Правьте существующий или добавьте новый текст.",
    "opt.range":"Диапазон (напр. 1-3,5)","opt.angle":"Угол","opt.text":"Текст","opt.opacity":"Прозрачность","opt.position":"Позиция","opt.password":"Пароль","opt.title":"Название","opt.author":"Автор","opt.subject":"Тема",
    "timer.title":"⏱️ Таймер","timer.desc":"Обратный отсчёт.","timer.hours":"Часы","timer.minutes":"Минуты","timer.seconds":"Секунды","timer.start":"▶ Старт","timer.stop":"⏹ Стоп","timer.stopSound":"Остановить звук","timer.finished":"⏰ Время вышло!",
    "alarm.title":"🔔 Будильник","alarm.desc":"Установите время.","alarm.timeLabel":"Время","alarm.labelLabel":"Название","alarm.set":"🔔 Поставить","alarm.added":"Будильник на","alarm.needTime":"Некорректное время","alarm.ringing":"🔔 Будильник!",
    "rp.title":"🗑️ Удалить страницы","rp.desc":"Нажмите на страницы.","rp.drop":"Перетащите PDF","rp.hint":"Нажмите на страницы","rp.run":"🗑️ Удалить выбранные","rp.selectOne":"Выберите хотя бы одну","rp.all":"Нельзя удалить все",
    "editor.title":"✏️ Редактор PDF","editor.desc":"Рисуйте на PDF.","editor.save":"💾 Сохранить","editor.saved":"Готово!","editor.textPrompt":"Текст:","editor.hint":"💡 выбери/двигай · повернуть 15° · пипетка · Del — удалить · Ctrl+колесо — зум","editor.selectFirst":"Сначала выберите объект","editor.colorPicked":"🎨 Взят цвет: ",
    "saveChoice.title":"💾 Сохранить PDF","saveChoice.desc":"Выберите способ.","saveChoice.vectorTitle":"С текстом","saveChoice.vectorDesc":"Текст копируемый.","saveChoice.rasterTitle":"Как картинку","saveChoice.rasterDesc":"Точное соответствие.",
    "sig.title":"✍️ Подпись","sig.desc":"Нарисуйте, напечатайте или загрузите.","sig.tab.draw":"✏️ Нарисовать","sig.tab.type":"⌨️ Напечатать","sig.tab.upload":"📤 Загрузить","sig.type.label":"Ваше имя","sig.upload.hint":"Загрузите PNG подписи","sig.place":"📌 Поставить на PDF","sig.needPDF":"Сначала загрузите PDF","sig.needSignature":"Сначала создайте подпись","sig.placed":"Подпись поставлена!",
    "stamp.title":"🔖 Штамп","stamp.desc":"Выберите штамп.","stamp.custom":"Свой текст","stamp.place":"📌 Поставить на PDF","stamp.needPDF":"Сначала загрузите PDF","stamp.hintPlace":"💡 Кликните по PDF, чтобы поставить штамп","stamp.placed":"✅ Поставлено: ",
    "text.title":"✏️ Редактор текста","text.desc":"Кликните по странице.","text.font":"Шрифт:","text.size":"Размер:","text.hint":"💡 Клик по странице","text.hintLong":"💡 Клик по тексту — правка · Клик в пустое — добавить · Ctrl+колесо — зум","text.needPDF":"Сначала загрузите PDF","text.promptText":"Введите текст:",
    "recent.title":"🕓 Недавние файлы","fmt.font":"Шрифт:","fmt.size":"Размер:","fmt.color":"Цвет:","fmt.apply":"Применить","fmt.cancel":"Отмена","fmt.editing":"✏️ Правим:",
    "help.btn":"Помощь","help.title":"❓ Как пользоваться","help.subtitle":"Краткий гид по всем инструментам","help.close":"Понятно",
    "help.intro.title":"🎉 Добро пожаловать в marge-PDF!","help.intro.text":"Все инструменты работают прямо в браузере. Ничего не загружается на сервер, регистрация не нужна.",
    "help.group.basic":"Базовые инструменты","help.group.editors":"Визуальные редакторы","help.group.media":"Медиа и документы","help.group.extra":"Дополнительно",
    "help.merge.title":"🔗 Объединить PDF — склейка файлов","help.merge.text":"Закинь 2+ PDF. Меняй порядок перетаскиванием. Жми «Выполнить».",
    "help.split.title":"✂️ Разделить / Извлечь","help.split.text":"Загрузи один PDF, введи диапазон вроде 1-3,5,7.",
    "help.compress.title":"🗜️ Сжать — уменьшить размер","help.compress.text":"Пересобирает структуру PDF, чтобы уменьшить вес.",
    "help.rotate.title":"🔄 Повернуть — разворот страниц","help.rotate.text":"Поворот всех страниц на 90°, 180° или 270° в один клик.",
    "help.watermark.title":"💧 Водяной знак","help.watermark.text":"Ставит текст по диагонали на каждой странице.",
    "help.pagenum.title":"🔢 Номера страниц","help.pagenum.text":"Номера внизу слева, по центру или справа.",
    "help.protect.title":"🔐 Защитить — пароль","help.protect.text":"Устанавливает пароль. Файл откроется только после ввода.",
    "help.metadata.title":"🏷️ Метаданные","help.metadata.text":"Меняет заголовок, автора и тему файла.",
    "help.removepages.title":"🗑️ Удалить страницы","help.removepages.text":"Кликай по миниатюрам, чтобы отметить на удаление.",
    "help.editor.title":"✏️ Рисовать на PDF","help.editor.text":"Рисуй пером/маркером/ластиком, добавляй фигуры и текст.",
    "help.textedit.title":"📝 Редактор текста","help.textedit.text":"Клик по любому тексту открывает панель форматирования.",
    "help.signature.title":"✍️ Подпись","help.signature.text":"Три способа: нарисовать, напечатать или загрузить PNG.",
    "help.stamp.title":"🔖 Штамп","help.stamp.text":"Выбери готовый или введи свой.",
    "help.img2pdf.title":"🖼️ Картинки → PDF","help.img2pdf.text":"Закинь несколько JPG/PNG. Каждая картинка = страница PDF.",
    "help.pdf2jpg.title":"📷 PDF → JPG","help.pdf2jpg.text":"Каждая страница = качественный JPG.",
    "help.pdf2word.title":"📝 PDF → Word","help.pdf2word.text":"Извлекает весь текст в файл .doc.",
    "help.word2pdf.title":"📄 Word → PDF","help.word2pdf.text":"Преобразует .docx в аккуратный PDF.",
    "help.excel2pdf.title":"📊 Excel → PDF","help.excel2pdf.text":"Каждый лист Excel = страница PDF с таблицей.",
    "help.pdf2excel.title":"📈 PDF → Excel","help.pdf2excel.text":"Текст с каждой страницы попадёт в .xlsx строками.",
    "help.recent.title":"🕓 Недавние файлы","help.recent.text":"Каждый результат сохраняется в браузере (IndexedDB).",
    "help.timer.title":"⏱️ Таймер и 🔔 Будильник","help.timer.text":"Обратный отсчёт или будильник по местному времени вашего устройства.",
    "help.theme.title":"🌙 Тема и 🌐 Языки","help.theme.text":"Переключение светлой и тёмной темы.",
    "tip.clock":"Местное время вашего устройства","tip.mirror":"Альтернативное зеркало — если основной сайт заблокирован","tip.ad":"Здесь может быть ваша реклама","tip.donate":"Поддержать проект","tip.theme":"Светлая / тёмная тема","tip.timer":"Таймер — обратный отсчёт","tip.alarm":"Будильник — на определённое время","tip.help":"Как пользоваться инструментами","tip.lang":"Сменить язык",
    "tip.pen":"Перо — свободное рисование","tip.marker":"Маркер — полупрозрачное рисование","tip.eraser":"Ластик","tip.line":"Линия","tip.rect":"Прямоугольник","tip.circle":"Круг / овал","tip.arrow":"Стрелка","tip.textBtn":"Добавить текст","tip.select":"Выбрать и двигать объект","tip.rotateTool":"Повернуть выбранное на 15°","tip.picker":"Пипетка — взять цвет с листа",
    "tip.lw2":"Тонкая линия","tip.lw4":"Средняя линия","tip.lw8":"Толстая линия","tip.lw14":"Очень толстая линия",
    "tip.colorRed":"Красный цвет","tip.colorBlue":"Синий цвет","tip.colorGreen":"Зелёный цвет","tip.colorOrange":"Оранжевый цвет","tip.colorBlack":"Чёрный цвет",
    "tip.undo":"Отменить последнее действие","tip.clear":"Очистить всё","tip.zoomIn":"Увеличить","tip.zoomOut":"Уменьшить","tip.zoomReset":"Сбросить масштаб"
  },
  lv: {
    "hero.title":"Apvienojiet PDF. Ārpus malām.","hero.subtitle":"Visi PDF rīki vienuviet — bez maksas, ātri un droši.",
    "footer.text":"Veidots ar ❤️ — visa apstrāde notiek jūsu pārlūkā","adSlot.text":"Šeit varētu būt jūsu reklāma","mirror.text":"Spogulis",
    "proxy.title":"🔒 Strādājat no korporatīvā datora?","proxy.text":"Ja jūsu drošības sistēma bloķē failu augšupielādi — izmēģiniet spoguli:",
    "why.privacy.title":"100% Privāti","why.privacy.desc":"Jūsu faili nekad neatstāj pārlūku.","why.fast.title":"Zibens ātrs","why.fast.desc":"Bibliotēkas ielādējas pēc vajadzības.","why.free.title":"Pilnīgi Bezmaksas","why.free.desc":"Bez ierobežojumiem, bez reģistrācijas, bez maksām.","why.all.title":"Strādā Visur","why.all.desc":"Jebkura ierīce ar pārlūku.",
    "about.btnText":"Kāpēc bez maksas?",
    "about.title":"✨ Kāpēc marge-PDF ir bez maksas","about.subtitle":"Un tāds tas paliks",
    "about.block1.title":"Bez ierobežojumiem. Nekad.","about.block1.desc":"Apvienojiet 5, 10 vai 50 PDF failus — bez limita, bez abonementa, bez slēptām maksām.",
    "about.block2.title":"Jūsu faili nekad neatstāj ierīci","about.block2.desc":"Visa apstrāde notiek tieši pārlūkā. Nav augšupielāžu serverī, nav e-pasta apstiprinājumu, nav kontu.",
    "about.block3.title":"Kā projekts izdzīvo?","about.block3.desc":"Gandrīz nulles izmaksas: nav jāmaksā par serveriem, datubāzēm vai analītikas izsekotājiem.",
    "about.block4.title":"Paldies, ka esat šeit","about.block4.desc":"Katrs apmeklētājs, katra kopīgotā saite un katra kafijas ziedojuma reize uztur šo projektu dzīvu.",
    "about.supportBtn":"💰 Atbalstīt projektu",
    "contact.btnText":"Sazināties ar mums","contact.title":"✉️ Sazināties ar mums","contact.subtitle":"Mēs labprāt dzirdēsim no jums","contact.emailLabel":"E-pasts","contact.note":"Jautājumi, ieteikumi, kļūdu ziņojumi — rakstiet mums.",
    "donate.qrLabel":"📱 Skenējiet QR, lai ziedotu caur PayPal","donate.title":"💰 Atbalstīt projektu","donate.subtitle":"Katra kafija ir svarīga — tā palīdz saglabāt rīkus bez maksas visiem.","donate.oneTime":"Ziedot $1","donate.oneTimeDesc":"Vienreizējs atbalsts","donate.sub":"Ziedot $5","donate.subDesc":"Lielāks atbalsts","donate.thanks":"Paldies! ❤️",
    "common.drop":"Ievelciet failus šeit vai noklikšķiniet","common.run":"Palaist","common.processing":"Apstrāde...","common.done":"Gatavs!","common.error":"Kļūda: ",
    "tool.merge.name":"Apvienot PDF","tool.merge.desc":"Apvienojiet vairākus PDF. Velciet, lai mainītu kārtību.","tool.split.name":"Sadalīt PDF","tool.split.desc":"Izvelciet lappušu diapazonu.","tool.compress.name":"Saspiest PDF","tool.compress.desc":"Samaziniet izmēru.","tool.rotate.name":"Pagriezt PDF","tool.rotate.desc":"Pagrieziet lappuses.","tool.extract.name":"Izvilkt lappuses","tool.extract.desc":"Atsevišķs PDF.","tool.watermark.name":"Ūdenszīme","tool.watermark.desc":"Pievienojiet tekstu.","tool.pagenum.name":"Lappušu numuri","tool.pagenum.desc":"Pievienojiet numurus.","tool.excel2pdf.name":"Excel → PDF","tool.excel2pdf.desc":"Konvertējiet Excel.","tool.pdf2excel.name":"PDF → Excel","tool.pdf2excel.desc":"Izvelciet tekstu.","tool.word2pdf.name":"Word → PDF","tool.word2pdf.desc":"Konvertējiet Word.","tool.img2pdf.name":"Attēli → PDF","tool.img2pdf.desc":"Apvienojiet attēlus.","tool.protect.name":"Aizsargāt PDF","tool.protect.desc":"Pievienojiet paroli.","tool.metadata.name":"Metadati","tool.metadata.desc":"Mainiet nosaukumu.","tool.removepages.name":"Noņemt lappuses","tool.removepages.desc":"Noklikšķiniet uz lappusēm.","tool.editor.name":"Rediģēt PDF","tool.editor.desc":"Zīmējiet, atlasiet, pārvietojiet, pagrieziet.","tool.pdf2jpg.name":"PDF → JPG","tool.pdf2jpg.desc":"Katra lappuse uz JPG.","tool.pdf2word.name":"PDF → Word","tool.pdf2word.desc":"Izvelciet tekstu uz Word.","tool.signature.name":"Paraksts","tool.signature.desc":"Uzzīmējiet vai augšupielādējiet.","tool.stamp.name":"Zīmogs","tool.stamp.desc":"APPROVED, DRAFT, URGENT.","tool.textedit.name":"Rediģēt tekstu","tool.textedit.desc":"Rediģējiet esošo vai pievienojiet jaunu tekstu.",
    "opt.range":"Lappušu diapazons","opt.angle":"Leņķis","opt.text":"Teksts","opt.opacity":"Necaurredzamība","opt.position":"Pozīcija","opt.password":"Parole","opt.title":"Nosaukums","opt.author":"Autors","opt.subject":"Tēma",
    "timer.title":"⏱️ Taimeris","timer.desc":"Iestatiet atskaiti.","timer.hours":"Stundas","timer.minutes":"Minūtes","timer.seconds":"Sekundes","timer.start":"▶ Sākt","timer.stop":"⏹ Apturēt","timer.stopSound":"Apturēt skaņu","timer.finished":"⏰ Laiks beidzās!",
    "alarm.title":"🔔 Modinātājs","alarm.desc":"Iestatiet laiku.","alarm.timeLabel":"Modinātāja laiks","alarm.labelLabel":"Apzīmējums","alarm.set":"🔔 Iestatīt","alarm.added":"Modinātājs uz","alarm.needTime":"Ievadiet derīgu laiku","alarm.ringing":"🔔 Modinātājs!",
    "rp.title":"🗑️ Noņemt lappuses","rp.desc":"Noklikšķiniet uz lappusēm.","rp.drop":"Ievelciet PDF šeit","rp.hint":"Noklikšķiniet uz lappusēm","rp.run":"🗑️ Dzēst atzīmētās","rp.selectOne":"Izvēlieties vismaz vienu","rp.all":"Nevar dzēst visas",
    "editor.title":"✏️ Rediģēt PDF","editor.desc":"Zīmējiet.","editor.save":"💾 Saglabāt","editor.saved":"Gatavs!","editor.textPrompt":"Teksts:","editor.hint":"💡 atlasīt/pārvietot · pagriezt 15° · pipete · Del — dzēst · Ctrl+ritenis — tālummaiņa","editor.selectFirst":"Vispirms atlasiet objektu","editor.colorPicked":"🎨 Izvēlēta krāsa: ",
    "saveChoice.title":"💾 Saglabāt PDF","saveChoice.desc":"Izvēlieties.","saveChoice.vectorTitle":"Ar tekstu","saveChoice.vectorDesc":"Teksts paliek kopējams.","saveChoice.rasterTitle":"Kā attēlu","saveChoice.rasterDesc":"Precīzs izskats.",
    "sig.title":"✍️ Paraksts","sig.desc":"Uzzīmējiet, ierakstiet vai augšupielādējiet.","sig.tab.draw":"✏️ Zīmēt","sig.tab.type":"⌨️ Ierakstīt","sig.tab.upload":"📤 Augšupielādēt","sig.type.label":"Jūsu vārds","sig.upload.hint":"Augšupielādējiet PNG","sig.place":"📌 Novietot uz PDF","sig.needPDF":"Vispirms augšupielādējiet PDF","sig.needSignature":"Vispirms izveidojiet parakstu","sig.placed":"Paraksts novietots!",
    "stamp.title":"🔖 Zīmogs","stamp.desc":"Izvēlieties zīmogu.","stamp.custom":"Savs teksts","stamp.place":"📌 Novietot uz PDF","stamp.needPDF":"Vispirms augšupielādējiet PDF","stamp.hintPlace":"💡 Noklikšķiniet uz PDF, lai novietotu zīmogu","stamp.placed":"✅ Novietots: ",
    "text.title":"✏️ Rediģēt tekstu","text.desc":"Noklikšķiniet uz lappuses.","text.font":"Fonts:","text.size":"Izmērs:","text.hint":"💡 Noklikšķiniet uz lappuses","text.hintLong":"💡 Klikšķis uz teksta — labot · Klikšķis tukšā vietā — pievienot · Ctrl+ritenis — tālummaiņa","text.needPDF":"Vispirms augšupielādējiet PDF","text.promptText":"Ievadiet tekstu:",
    "recent.title":"🕓 Nesenās datnes","fmt.font":"Fonts:","fmt.size":"Izmērs:","fmt.color":"Krāsa:","fmt.apply":"Lietot","fmt.cancel":"Atcelt","fmt.editing":"✏️ Labo:",
    "help.btn":"Palīdzība","help.title":"❓ Kā lietot","help.subtitle":"Īss ceļvedis","help.close":"Sapratu",
    "help.intro.title":"🎉 Laipni lūdzam marge-PDF!","help.intro.text":"Visi rīki darbojas tieši pārlūkā. Nekas netiek augšupielādēts, reģistrācija nav nepieciešama.",
    "help.group.basic":"Pamata rīki","help.group.editors":"Vizuālie redaktori","help.group.media":"Mediji un dokumenti","help.group.extra":"Papildu funkcijas",
    "help.merge.title":"🔗 Apvienot PDF","help.merge.text":"Ievelciet 2+ PDF failus. Nospiediet Palaist, lai lejupielādētu.",
    "help.split.title":"✂️ Sadalīt / Izvilkt","help.split.text":"Ielādējiet vienu PDF, ievadiet diapazonu, piemēram, 1-3,5,7.",
    "help.compress.title":"🗜️ Saspiest","help.compress.text":"Pārraksta PDF struktūru, lai samazinātu izmēru.",
    "help.rotate.title":"🔄 Pagriezt","help.rotate.text":"Pagrieziet visas lappuses par 90°, 180° vai 270°.",
    "help.watermark.title":"💧 Ūdenszīme","help.watermark.text":"Uzliek tekstu pa diagonāli uz katras lappuses.",
    "help.pagenum.title":"🔢 Lappušu numuri","help.pagenum.text":"Numuri apakšā pa kreisi, centrā vai pa labi.",
    "help.protect.title":"🔐 Aizsargāt","help.protect.text":"Uzstāda paroli. Fails atvērsies tikai pēc tās ievadīšanas.",
    "help.metadata.title":"🏷️ Metadati","help.metadata.text":"Maina virsrakstu, autoru un tēmu.",
    "help.removepages.title":"🗑️ Noņemt lappuses","help.removepages.text":"Klikšķiniet uz sīktēliem, lai atzīmētu dzēšanai.",
    "help.editor.title":"✏️ Zīmēt uz PDF","help.editor.text":"Zīmējiet ar pildspalvu/marķieri/dzēsēju, pievienojiet figūras un tekstu.",
    "help.textedit.title":"📝 Rediģēt tekstu","help.textedit.text":"Klikšķis uz jebkura teksta atver formatēšanas paneli.",
    "help.signature.title":"✍️ Paraksts","help.signature.text":"Trīs veidi: uzzīmēt, ierakstīt vai augšupielādēt PNG.",
    "help.stamp.title":"🔖 Zīmogs","help.stamp.text":"Izvēlieties gatavu vai ierakstiet savu.",
    "help.img2pdf.title":"🖼️ Attēli → PDF","help.img2pdf.text":"Ievelciet vairākus JPG/PNG. Katrs attēls = viena PDF lappuse.",
    "help.pdf2jpg.title":"📷 PDF → JPG","help.pdf2jpg.text":"Katra lappuse kļūst par augstas kvalitātes JPG.",
    "help.pdf2word.title":"📝 PDF → Word","help.pdf2word.text":"Izvelk visu tekstu .doc failā.",
    "help.word2pdf.title":"📄 Word → PDF","help.word2pdf.text":"Pārvērš .docx tekstu tīrā PDF.",
    "help.excel2pdf.title":"📊 Excel → PDF","help.excel2pdf.text":"Katra Excel lapa kļūst par PDF lappusi ar formatētu tabulu.",
    "help.pdf2excel.title":"📈 PDF → Excel","help.pdf2excel.text":"Teksts nonāk .xlsx izklājlapā kā rindas.",
    "help.recent.title":"🕓 Nesenās datnes","help.recent.text":"Katrs lejupielādētais rezultāts tiek saglabāts pārlūkā (IndexedDB).",
    "help.timer.title":"⏱️ Taimeris un 🔔 Modinātājs","help.timer.text":"Iestatiet atskaiti vai modinātāju pēc ierīces vietējā laika.",
    "help.theme.title":"🌙 Tēma un 🌐 Valodas","help.theme.text":"Pārslēgšanās starp gaišo un tumšo.",
    "tip.clock":"Ierīces vietējais laiks","tip.mirror":"Alternatīvs spogulis — ja galvenā vietne ir bloķēta","tip.ad":"Šeit varētu būt jūsu reklāma","tip.donate":"Atbalstīt projektu","tip.theme":"Gaišā / tumšā tēma","tip.timer":"Taimeris — atskaites laiks","tip.alarm":"Modinātājs — noteikts laiks","tip.help":"Kā lietot rīkus","tip.lang":"Mainīt valodu",
    "tip.pen":"Pildspalva — brīva zīmēšana","tip.marker":"Marķieris — caurspīdīga zīmēšana","tip.eraser":"Dzēsējs","tip.line":"Līnija","tip.rect":"Taisnstūris","tip.circle":"Aplis / ovāls","tip.arrow":"Bulta","tip.textBtn":"Pievienot tekstu","tip.select":"Atlasīt un pārvietot objektu","tip.rotateTool":"Pagriezt atlasīto par 15°","tip.picker":"Pipete — paņemt krāsu no lapas",
    "tip.lw2":"Plāna līnija","tip.lw4":"Vidēja līnija","tip.lw8":"Bieza līnija","tip.lw14":"Ļoti bieza līnija",
    "tip.colorRed":"Sarkana krāsa","tip.colorBlue":"Zila krāsa","tip.colorGreen":"Zaļa krāsa","tip.colorOrange":"Oranža krāsa","tip.colorBlack":"Melna krāsa",
    "tip.undo":"Atsaukt pēdējo darbību","tip.clear":"Notīrīt visu","tip.zoomIn":"Pietuvināt","tip.zoomOut":"Attālināt","tip.zoomReset":"Atjaunot mērogu"
  },
  de: {
    "hero.title":"PDF zusammenführen. Jenseits der Grenzen.","hero.subtitle":"Alle PDF-Werkzeuge an einem Ort — kostenlos, schnell und sicher.",
    "footer.text":"Mit ❤️ erstellt – Verarbeitung in Ihrem Browser","adSlot.text":"Hier könnte Ihre Werbung stehen","mirror.text":"Spiegel",
    "proxy.title":"🔒 Arbeiten Sie an einem Firmencomputer?","proxy.text":"Wenn Ihr Sicherheitssystem Datei-Uploads blockiert — versuchen Sie den Spiegel:",
    "why.privacy.title":"100% Privat","why.privacy.desc":"Ihre Dateien verlassen den Browser nie.","why.fast.title":"Blitzschnell","why.fast.desc":"Bibliotheken werden bei Bedarf geladen.","why.free.title":"Völlig Kostenlos","why.free.desc":"Keine Limits, keine Registrierung, keine versteckten Kosten.","why.free.desc":"Keine Limits, keine Registrierung, keine versteckten Kosten.","why.all.title":"Funktioniert Überall","why.all.desc":"Jedes Gerät mit modernem Browser.",
    "about.btnText":"Warum kostenlos?",
    "about.title":"✨ Warum marge-PDF kostenlos ist","about.subtitle":"Und das bleibt auch so",
    "about.block1.title":"Keine Limits. Nie.","about.block1.desc":"Führen Sie 5, 10 oder 50 PDF-Dateien zusammen — ohne Limits, ohne Abonnement, ohne versteckte Kosten.",
    "about.block2.title":"Ihre Dateien verlassen nie Ihr Gerät","about.block2.desc":"Alles läuft direkt im Browser. Keine Uploads auf einen Server, keine E-Mail-Bestätigungen, keine Konten.",
    "about.block3.title":"Wie überlebt das Projekt?","about.block3.desc":"Fast keine Kosten: keine Server, keine Datenbanken, keine Analytics-Tracker.",
    "about.block4.title":"Danke, dass Sie hier sind","about.block4.desc":"Jeder Besucher, jeder geteilte Link und jede Kaffee-Spende halten dieses Projekt am Leben.",
    "about.supportBtn":"💰 Projekt unterstützen",
    "contact.btnText":"Kontakt","contact.title":"✉️ Kontakt","contact.subtitle":"Wir freuen uns auf Ihre Nachricht","contact.emailLabel":"E-Mail","contact.note":"Fragen, Vorschläge, Bug-Reports — schreiben Sie uns.",
    "donate.qrLabel":"📱 QR scannen für PayPal-Spende","donate.title":"💰 Projekt unterstützen","donate.subtitle":"Jeder Kaffee zählt — und hilft, die Werkzeuge für alle kostenlos zu halten.","donate.oneTime":"$1 spenden","donate.oneTimeDesc":"Einmalige Unterstützung","donate.sub":"$5 spenden","donate.subDesc":"Größere Unterstützung","donate.thanks":"Vielen Dank! ❤️",
    "common.drop":"Dateien hier ablegen oder klicken","common.run":"Ausführen","common.processing":"Verarbeitung...","common.done":"Fertig!","common.error":"Fehler: ",
    "tool.merge.name":"PDF zusammenführen","tool.merge.desc":"Mehrere PDFs kombinieren. Ziehen zum Sortieren.","tool.split.name":"PDF teilen","tool.split.desc":"Bereich extrahieren.","tool.compress.name":"PDF komprimieren","tool.compress.desc":"Größe reduzieren.","tool.rotate.name":"PDF drehen","tool.rotate.desc":"Seiten drehen.","tool.extract.name":"Seiten extrahieren","tool.extract.desc":"Seiten extrahieren.","tool.watermark.name":"Wasserzeichen","tool.watermark.desc":"Text stempeln.","tool.pagenum.name":"Seitennummern","tool.pagenum.desc":"Nummern hinzufügen.","tool.excel2pdf.name":"Excel → PDF","tool.excel2pdf.desc":"Excel konvertieren.","tool.pdf2excel.name":"PDF → Excel","tool.pdf2excel.desc":"Text extrahieren.","tool.word2pdf.name":"Word → PDF","tool.word2pdf.desc":"Word konvertieren.","tool.img2pdf.name":"Bilder → PDF","tool.img2pdf.desc":"Bilder kombinieren.","tool.protect.name":"PDF schützen","tool.protect.desc":"Passwort hinzufügen.","tool.metadata.name":"Metadaten","tool.metadata.desc":"Titel ändern.","tool.removepages.name":"Seiten entfernen","tool.removepages.desc":"Seiten löschen.","tool.editor.name":"PDF bearbeiten","tool.editor.desc":"Zeichnen, auswählen, bewegen, drehen.","tool.pdf2jpg.name":"PDF → JPG","tool.pdf2jpg.desc":"Jede Seite in JPG.","tool.pdf2word.name":"PDF → Word","tool.pdf2word.desc":"Text in Word.","tool.signature.name":"Unterschrift","tool.signature.desc":"Zeichnen oder laden.","tool.stamp.name":"Stempel","tool.stamp.desc":"APPROVED, DRAFT, URGENT.","tool.textedit.name":"Text bearbeiten","tool.textedit.desc":"Vorhandenen Text bearbeiten oder neuen hinzufügen.",
    "opt.range":"Seitenbereich","opt.angle":"Winkel","opt.text":"Text","opt.opacity":"Deckkraft","opt.position":"Position","opt.password":"Passwort","opt.title":"Titel","opt.author":"Autor","opt.subject":"Betreff",
    "timer.title":"⏱️ Timer","timer.desc":"Countdown.","timer.hours":"Stunden","timer.minutes":"Minuten","timer.seconds":"Sekunden","timer.start":"▶ Start","timer.stop":"⏹ Stopp","timer.stopSound":"Ton stoppen","timer.finished":"⏰ Zeit abgelaufen!",
    "alarm.title":"🔔 Wecker","alarm.desc":"Zeit einstellen.","alarm.timeLabel":"Weckzeit","alarm.labelLabel":"Bezeichnung","alarm.set":"🔔 Stellen","alarm.added":"Wecker für","alarm.needTime":"Gültige Zeit","alarm.ringing":"🔔 Wecker!",
    "rp.title":"🗑️ Seiten entfernen","rp.desc":"Seiten anklicken.","rp.drop":"PDF ablegen","rp.hint":"Seiten anklicken","rp.run":"🗑️ Löschen","rp.selectOne":"Mindestens eine","rp.all":"Nicht alle",
    "editor.title":"✏️ PDF bearbeiten","editor.desc":"Zeichnen.","editor.save":"💾 Speichern","editor.saved":"Fertig!","editor.textPrompt":"Text:","editor.hint":"💡 auswählen/bewegen · 15° drehen · Pipette · Entf — löschen · Strg+Mausrad — Zoom","editor.selectFirst":"Bitte zuerst Objekt auswählen","editor.colorPicked":"🎨 Farbe gewählt: ",
    "saveChoice.title":"💾 PDF speichern","saveChoice.desc":"Wählen.","saveChoice.vectorTitle":"Mit Text","saveChoice.vectorDesc":"Text bleibt.","saveChoice.rasterTitle":"Als Bild","saveChoice.rasterDesc":"Genaues Aussehen.",
    "sig.title":"✍️ Unterschrift","sig.desc":"Zeichnen, tippen oder laden.","sig.tab.draw":"✏️ Zeichnen","sig.tab.type":"⌨️ Tippen","sig.tab.upload":"📤 Hochladen","sig.type.label":"Ihr Name","sig.upload.hint":"PNG hochladen","sig.place":"📌 Auf PDF platzieren","sig.needPDF":"Bitte erst PDF hochladen","sig.needSignature":"Bitte erst Unterschrift erstellen","sig.placed":"Unterschrift platziert!",
    "stamp.title":"🔖 Stempel","stamp.desc":"Stempel wählen.","stamp.custom":"Eigener Text","stamp.place":"📌 Auf PDF platzieren","stamp.needPDF":"Bitte erst PDF hochladen","stamp.hintPlace":"💡 Klicken Sie auf das PDF, um den Stempel zu platzieren","stamp.placed":"✅ Platziert: ",
    "text.title":"✏️ Text bearbeiten","text.desc":"Auf Seite klicken.","text.font":"Schrift:","text.size":"Größe:","text.hint":"💡 Auf Seite klicken","text.hintLong":"💡 Klick auf Text — bearbeiten · Klick auf leere Stelle — hinzufügen · Strg+Mausrad — Zoom","text.needPDF":"Bitte erst PDF hochladen","text.promptText":"Text eingeben:",
    "recent.title":"🕓 Letzte Dateien","fmt.font":"Schrift:","fmt.size":"Größe:","fmt.color":"Farbe:","fmt.apply":"Anwenden","fmt.cancel":"Abbrechen","fmt.editing":"✏️ Bearbeite:",
    "help.btn":"Hilfe","help.title":"❓ Wie benutzen","help.subtitle":"Kurzanleitung","help.close":"Verstanden",
    "help.intro.title":"🎉 Willkommen bei marge-PDF!","help.intro.text":"Alle Werkzeuge laufen direkt in Ihrem Browser. Nichts wird hochgeladen, keine Registrierung nötig.",
    "help.group.basic":"Grundwerkzeuge","help.group.editors":"Visuelle Editoren","help.group.media":"Medien & Dokumente","help.group.extra":"Zusatzfunktionen",
    "help.merge.title":"🔗 PDF zusammenführen","help.merge.text":"Legen Sie 2+ PDFs ab. Auf Ausführen klicken zum Herunterladen.",
    "help.split.title":"✂️ Teilen / Extrahieren","help.split.text":"Laden Sie ein PDF, geben Sie einen Bereich wie 1-3,5,7 ein.",
    "help.compress.title":"🗜️ Komprimieren","help.compress.text":"Schreibt die PDF-Struktur um, um die Größe zu verringern.",
    "help.rotate.title":"🔄 Drehen","help.rotate.text":"Drehen Sie jede Seite um 90°, 180° oder 270°.",
    "help.watermark.title":"💧 Wasserzeichen","help.watermark.text":"Stempelt Text diagonal auf jede Seite.",
    "help.pagenum.title":"🔢 Seitennummern","help.pagenum.text":"Nummern unten links, mittig oder rechts.",
    "help.protect.title":"🔐 Schützen","help.protect.text":"Setzt ein Passwort. Die Datei öffnet sich erst nach Eingabe.",
    "help.metadata.title":"🏷️ Metadaten","help.metadata.text":"Bearbeitet Titel, Autor und Betreff.",
    "help.removepages.title":"🗑️ Seiten entfernen","help.removepages.text":"Klicken Sie auf Miniaturansichten, um sie zum Löschen zu markieren.",
    "help.editor.title":"✏️ Zeichnen auf PDF","help.editor.text":"Zeichnen Sie mit Stift/Marker/Radierer, fügen Sie Formen und Text hinzu.",
    "help.textedit.title":"📝 Text auf PDF bearbeiten","help.textedit.text":"Klick auf beliebigen Text öffnet das Formatierungsfenster.",
    "help.signature.title":"✍️ Unterschrift","help.signature.text":"Drei Wege: zeichnen, tippen oder PNG hochladen.",
    "help.stamp.title":"🔖 Stempel","help.stamp.text":"Wählen Sie eine Voreinstellung oder geben Sie eigenen Text ein.",
    "help.img2pdf.title":"🖼️ Bilder → PDF","help.img2pdf.text":"Legen Sie mehrere JPG/PNG ab. Jedes Bild = eine PDF-Seite.",
    "help.pdf2jpg.title":"📷 PDF → JPG","help.pdf2jpg.text":"Jede Seite wird ein hochwertiges JPG.",
    "help.pdf2word.title":"📝 PDF → Word","help.pdf2word.text":"Extrahiert allen Text in eine .doc-Datei.",
    "help.word2pdf.title":"📄 Word → PDF","help.word2pdf.text":"Wandelt .docx-Text in ein sauberes PDF um.",
    "help.excel2pdf.title":"📊 Excel → PDF","help.excel2pdf.text":"Jedes Excel-Blatt wird eine PDF-Seite mit formatierter Tabelle.",
    "help.pdf2excel.title":"📈 PDF → Excel","help.pdf2excel.text":"Text jeder PDF-Seite landet in einer .xlsx-Tabelle als Zeilen.",
    "help.recent.title":"🕓 Letzte Dateien","help.recent.text":"Jedes heruntergeladene Ergebnis wird im Browser (IndexedDB) gespeichert.",
    "help.timer.title":"⏱️ Timer & 🔔 Wecker","help.timer.text":"Countdown oder Wecker nach der lokalen Uhrzeit Ihres Geräts.",
    "help.theme.title":"🌙 Theme & 🌐 Sprachen","help.theme.text":"Zwischen hell und dunkel wechseln.",
    "tip.clock":"Lokale Uhrzeit Ihres Geräts","tip.mirror":"Alternativer Spiegel — wenn die Hauptseite blockiert ist","tip.ad":"Hier könnte Ihre Werbung stehen","tip.donate":"Projekt unterstützen","tip.theme":"Hell / dunkel","tip.timer":"Timer — Countdown","tip.alarm":"Wecker — feste Zeit","tip.help":"Bedienungsanleitung","tip.lang":"Sprache ändern",
    "tip.pen":"Stift — freies Zeichnen","tip.marker":"Marker — halbtransparent","tip.eraser":"Radierer","tip.line":"Linie","tip.rect":"Rechteck","tip.circle":"Kreis / Ellipse","tip.arrow":"Pfeil","tip.textBtn":"Text hinzufügen","tip.select":"Objekt auswählen & bewegen","tip.rotateTool":"Ausgewähltes um 15° drehen","tip.picker":"Pipette — Farbe von Seite aufnehmen",
    "tip.lw2":"Dünne Linie","tip.lw4":"Mittlere Linie","tip.lw8":"Dicke Linie","tip.lw14":"Sehr dicke Linie",
    "tip.colorRed":"Rote Farbe","tip.colorBlue":"Blaue Farbe","tip.colorGreen":"Grüne Farbe","tip.colorOrange":"Orange Farbe","tip.colorBlack":"Schwarze Farbe",
    "tip.undo":"Letzte Aktion rückgängig","tip.clear":"Alles löschen","tip.zoomIn":"Vergrößern","tip.zoomOut":"Verkleinern","tip.zoomReset":"Zoom zurücksetzen"
  }
};

let currentLang = 'en';
const t = (k) => (translations[currentLang] && translations[currentLang][k]) || (translations.en && translations.en[k]) || k;

function applyTooltips(lang) {
  document.querySelectorAll('[data-tooltip-i18n]').forEach(el => {
    const key = el.getAttribute('data-tooltip-i18n');
    const value = translations[lang][key] || translations.en[key] || '';
    el.setAttribute('data-tooltip', value);
  });
}

function setLang(lang) {
  if (!translations[lang]) lang = 'en';
  currentLang = lang;
  document.documentElement.lang = lang;
  v2Storage.setItem('pdfnest_lang', lang);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    const v = translations[lang][k] || translations.en[k];
    if (v) el.textContent = v;
  });
  document.querySelectorAll('.lang-menu button').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  const codeEl = document.getElementById('langCurrentCode');
  if (codeEl) codeEl.textContent = { en:'EN', ru:'RU', lv:'LV', de:'DE' }[lang];
  applyTooltips(lang);
  if (typeof renderTools === 'function') renderTools();
  if (typeof renderRecent === 'function') renderRecent();
}

const langDropdown = document.getElementById('langDropdown');
document.getElementById('langBtn').addEventListener('click', e => { e.stopPropagation(); langDropdown.classList.toggle('open'); });
document.addEventListener('click', () => langDropdown.classList.remove('open'));
document.getElementById('langMenu').addEventListener('click', e => {
  const btn = e.target.closest('button[data-lang]');
  if (btn) { setLang(btn.dataset.lang); langDropdown.classList.remove('open'); }
});

(function applyConfig(){
  document.getElementById('siteNameLogo').textContent = CONFIG.SITE_NAME;
  document.title = CONFIG.SITE_NAME + ' — All-in-One PDF Toolkit';
  document.getElementById('contactEmailLink').href = 'mailto:' + CONFIG.EMAIL;
  document.getElementById('contactEmailText').textContent = CONFIG.EMAIL;
  document.getElementById('donateOneTimeLink').href = 'https://www.paypal.com/paypalme/' + CONFIG.PAYPAL + '/1';
  document.getElementById('donateSubLink').href = 'https://www.paypal.com/paypalme/' + CONFIG.PAYPAL + '/5';
  if (typeof QRCode !== 'undefined') {
    new QRCode(document.getElementById('qrContainer'), {
      text: 'https://www.paypal.com/paypalme/' + CONFIG.PAYPAL,
      width: 200, height: 200, correctLevel: QRCode.CorrectLevel.H
    });
  }
})();

const TOOLS = [
  { id:'merge',icon:'🔗',needs:2 },{ id:'pdf2jpg',icon:'📷',needs:1 },{ id:'pdf2word',icon:'📝',needs:1 },
  { id:'split',icon:'✂️',needs:1 },{ id:'compress',icon:'🗜️',needs:1 },{ id:'rotate',icon:'🔄',needs:1 },
  { id:'extract',icon:'📑',needs:1 },{ id:'watermark',icon:'💧',needs:1 },{ id:'pagenum',icon:'🔢',needs:1 },
  { id:'excel2pdf',icon:'📊',needs:1 },{ id:'pdf2excel',icon:'📈',needs:1 },{ id:'word2pdf',icon:'📄',needs:1 },
  { id:'img2pdf',icon:'🖼️',needs:1 },{ id:'protect',icon:'🔐',needs:1 },{ id:'metadata',icon:'🏷️',needs:1 },
  { id:'removepages',icon:'🗑️',needs:1,custom:'removePages' },
  { id:'editor',icon:'✏️',needs:1,custom:'editor' },
  { id:'signature',icon:'✍️',needs:1,custom:'signature' },
  { id:'stamp',icon:'🔖',needs:1,custom:'stamp' },
  { id:'textedit',icon:'🅃',needs:1,custom:'textedit' }
];

function renderTools() {
  const grid = document.getElementById('toolsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  TOOLS.forEach(tool => {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.innerHTML = '<span class="tool-icon">' + tool.icon + '</span><h3>' + t('tool.' + tool.id + '.name') + '</h3>';
    card.addEventListener('click', () => {
      if (tool.custom === 'removePages') openRemovePages();
      else if (tool.custom === 'editor') openEditor();
      else if (tool.custom === 'signature') openSignature();
      else if (tool.custom === 'stamp') openStamp();
      else if (tool.custom === 'textedit') openTextEditor();
      else openTool(tool);
    });
    grid.appendChild(card);
  });
}

/* ==========================================================
   LOOPING ALARM SOUND
   ========================================================== */
let alarmLoopInterval = null;
let alarmAudioCtx = null;
let alarmIsPlaying = false;

function playAlarmTone() {
  try {
    if (!alarmAudioCtx) alarmAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = alarmAudioCtx;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.connect(g); g.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.value = 880;
    g.gain.setValueAtTime(0.3, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch(e) { console.warn('Audio error:', e); }
}

function startAlarmLoop() {
  if (alarmIsPlaying) return;
  alarmIsPlaying = true;
  playAlarmTone();
  alarmLoopInterval = setInterval(playAlarmTone, 700);
}

function stopAlarmLoop() {
  if (alarmLoopInterval) { clearInterval(alarmLoopInterval); alarmLoopInterval = null; }
  alarmIsPlaying = false;
}

function warmupAudio() {
  if (!alarmAudioCtx) {
    try { alarmAudioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
  }
  if (alarmAudioCtx && alarmAudioCtx.state === 'suspended') {
    alarmAudioCtx.resume().catch(() => {});
  }
}
document.addEventListener('click', warmupAudio);
document.addEventListener('touchstart', warmupAudio);

/* ==========================================================
   TIMER
   ========================================================== */
let timerInterval = null, timerRemaining = 0, timerFinished = false;
const timerOverlay = document.getElementById('timerOverlay');
const timerDisplay = document.getElementById('timerDisplay');
const timerStartBtn = document.getElementById('timerStartBtn');
const timerStopBtn = document.getElementById('timerStopBtn');
const timerStatus = document.getElementById('timerStatus');

function openTimerModal() { timerOverlay.classList.add('active'); }
function closeTimerModal() {
  timerOverlay.classList.remove('active');
  stopAlarmLoop();
  timerFinished = false;
  if (timerStartBtn) timerStartBtn.textContent = t('timer.start');
}
timerOverlay.addEventListener('click', e => { if (e.target === timerOverlay) closeTimerModal(); });

function formatHMS(sec) { return String(Math.floor(sec/3600)).padStart(2,'0')+':'+String(Math.floor((sec%3600)/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0'); }

function tickTimer() {
  timerRemaining--;
  timerDisplay.textContent = formatHMS(timerRemaining);
  if (timerRemaining <= 0) {
    clearInterval(timerInterval);
    timerInterval = null;
    timerDisplay.textContent = '00:00:00';
    timerFinished = true;
    timerStartBtn.style.display = 'block';
    timerStartBtn.textContent = '🔕 ' + t('timer.stopSound');
    timerStopBtn.style.display = 'none';
    showStatus(timerStatus, t('timer.finished'), 'ok');
    startAlarmLoop();
  }
}

function startTimerDefault() {
  stopAlarmLoop();
  timerFinished = false;
  const h = parseInt(document.getElementById('timerH').value, 10) || 0;
  const m = parseInt(document.getElementById('timerM').value, 10) || 0;
  const s = parseInt(document.getElementById('timerS').value, 10) || 0;
  const total = h * 3600 + m * 60 + s;
  if (total <= 0) { showStatus(timerStatus, 'Set time > 0', 'err'); return; }
  timerRemaining = total;
  timerDisplay.textContent = formatHMS(timerRemaining);
  timerStartBtn.style.display = 'none';
  timerStopBtn.style.display = 'block';
  timerInterval = setInterval(tickTimer, 1000);
}

timerStartBtn.addEventListener('click', () => {
  if (timerFinished) {
    stopAlarmLoop();
    timerFinished = false;
    timerStartBtn.textContent = t('timer.start');
    showStatus(timerStatus, '', 'info');
  } else {
    startTimerDefault();
  }
});

timerStopBtn.addEventListener('click', () => {
  stopAlarmLoop();
  clearInterval(timerInterval);
  timerInterval = null;
  timerFinished = false;
  timerDisplay.textContent = '00:00:00';
  timerStartBtn.style.display = 'block';
  timerStartBtn.textContent = t('timer.start');
  timerStopBtn.style.display = 'none';
});

/* ==========================================================
   ALARM — каждую секунду + логирование
   ========================================================== */
const alarmOverlay = document.getElementById('alarmOverlay');
const alarmSetBtn = document.getElementById('alarmSetBtn');
const alarmStatus = document.getElementById('alarmStatus');
const alarmList = document.getElementById('alarmList');
let alarms = [];
let lastCheckedMinute = '';

function openAlarmModal() { alarmOverlay.classList.add('active'); renderAlarms(); }
function closeAlarmModal() {
  alarmOverlay.classList.remove('active');
  stopAlarmLoop();
  const banner = document.getElementById('alarmRingingBanner');
  if (banner) banner.remove();
  document.getElementById('alarmBtn').classList.remove('ringing');
}
alarmOverlay.addEventListener('click', e => { if (e.target === alarmOverlay) closeAlarmModal(); });

function renderAlarms() { alarmList.innerHTML=''; alarms.forEach((a,i) => { const li=document.createElement('li'); if (a.active) li.classList.add('active'); li.innerHTML='<span>'+a.time+' '+(a.label||'')+'</span>'; const del=document.createElement('button'); del.className='alarm-del'; del.textContent='×'; del.addEventListener('click', () => { alarms.splice(i,1); renderAlarms(); }); li.appendChild(del); alarmList.appendChild(li); }); }

alarmSetBtn.addEventListener('click', () => { const h=parseInt(document.getElementById('alarmHour').value,10); const m=parseInt(document.getElementById('alarmMinute').value,10); if (isNaN(h)||isNaN(m)||h<0||h>23||m<0||m>59) { showStatus(alarmStatus, t('alarm.needTime'), 'err'); return; } const time=String(h).padStart(2,'0')+':'+String(m).padStart(2,'0'); alarms.push({ time, label:document.getElementById('alarmLabel').value||'', active:true, fired:false }); showStatus(alarmStatus, t('alarm.added')+' '+time, 'ok'); document.getElementById('alarmLabel').value=''; renderAlarms(); });

function localDeviceTime(date, seconds = false) {
  const parts = [date.getHours(), date.getMinutes()];
  if (seconds) parts.push(date.getSeconds());
  return parts.map(value => String(value).padStart(2, '0')).join(':');
}
function checkAlarms() {
  const now = new Date();
  const lvTime = localDeviceTime(now);
  if (lvTime !== lastCheckedMinute) {
    console.log('⏰ Проверка будильника — местное время:', lvTime, '| активных:', alarms.filter(a => a.active && !a.fired).length);
    lastCheckedMinute = lvTime;
  }
  alarms.forEach(a => {
    if (!a.fired && a.active && a.time === lvTime) {
      console.log('🔔 БУДИЛЬНИК СРАБОТАЛ!', a.time, a.label);
      a.fired = true;
      a.active = false;
      startAlarmLoop();
      showAlarmRingingBanner(a.label || a.time);
      renderAlarms();
      document.getElementById('alarmBtn').classList.add('ringing');
    }
  });
}

function showAlarmRingingBanner(label) {
  const old = document.getElementById('alarmRingingBanner');
  if (old) old.remove();
  const banner = document.createElement('div');
  banner.id = 'alarmRingingBanner';
  banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:99999;background:linear-gradient(135deg,#ef4444,#f59e0b);color:#fff;padding:20px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.4);font-size:16px;';
  banner.innerHTML = '<div style="font-size:24px;margin-bottom:8px;">🔔 ' + t('alarm.ringing') + '</div><div style="margin-bottom:14px;font-weight:600;">' + label + '</div><button id="stopAlarmBtn" style="padding:12px 28px;font-size:16px;font-weight:700;background:#fff;color:#ef4444;border:none;border-radius:10px;cursor:pointer;">🔕 ' + t('timer.stopSound') + '</button>';
  document.body.appendChild(banner);
  document.getElementById('stopAlarmBtn').addEventListener('click', () => {
    stopAlarmLoop();
    banner.remove();
    document.getElementById('alarmBtn').classList.remove('ringing');
  });
}

document.getElementById('timerBtn').addEventListener('click', openTimerModal);
document.getElementById('alarmBtn').addEventListener('click', openAlarmModal);
setInterval(checkAlarms, 1000);
checkAlarms();

function updateLvClock() { const el=document.getElementById('lvTime'); if (el) el.textContent=localDeviceTime(new Date(), true); }
const themeBtn = document.getElementById('themeBtn');
function applyTheme(dark) { document.body.classList.toggle('dark', dark); themeBtn.textContent = dark ? '☀️' : '🌙'; v2Storage.setItem('pdfnest_theme', dark ? 'dark' : 'light'); }
themeBtn.addEventListener('click', () => applyTheme(!document.body.classList.contains('dark')));
if (v2Storage.getItem('pdfnest_theme') === 'dark') applyTheme(true);
