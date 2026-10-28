/* ==========================================================
   marge-PDF — Service Worker
   Кеширует статику, работает офлайн после первого визита
   ========================================================== */

const CACHE_VERSION = 'marge-pdf-v2-2026-10-28';
const CACHE_STATIC = CACHE_VERSION;

/* Что кешировать сразу (оболочка приложения) */
const PRECACHE_URLS = [
  './',
  './css/site.css',
  './de/compress-pdf.html',
  './de/draw-on-pdf.html',
  './de/edit-pdf-text.html',
  './de/excel-to-pdf.html',
  './de/extract-pdf-pages.html',
  './de/jpg-to-pdf.html',
  './de/merge-pdf.html',
  './de/pdf-metadata.html',
  './de/pdf-page-numbers.html',
  './de/pdf-to-excel.html',
  './de/pdf-to-jpg.html',
  './de/pdf-to-word.html',
  './de/privacy.html',
  './de/remove-pdf-pages.html',
  './de/rotate-pdf.html',
  './de/sign-pdf.html',
  './de/split-pdf.html',
  './de/stamp-pdf.html',
  './de/terms.html',
  './de/watermark-pdf.html',
  './de/word-to-pdf.html',
  './en/compress-pdf.html',
  './en/draw-on-pdf.html',
  './en/edit-pdf-text.html',
  './en/excel-to-pdf.html',
  './en/extract-pdf-pages.html',
  './en/jpg-to-pdf.html',
  './en/merge-pdf.html',
  './en/pdf-metadata.html',
  './en/pdf-page-numbers.html',
  './en/pdf-to-excel.html',
  './en/pdf-to-jpg.html',
  './en/pdf-to-word.html',
  './en/privacy.html',
  './en/remove-pdf-pages.html',
  './en/rotate-pdf.html',
  './en/sign-pdf.html',
  './en/split-pdf.html',
  './en/stamp-pdf.html',
  './en/terms.html',
  './en/watermark-pdf.html',
  './en/word-to-pdf.html',
  './icon-192.png',
  './icon-512.png',
  './icon.svg',
  './index.html',
  './js/app-01.js',
  './js/app-02.js',
  './js/app-03.js',
  './js/app-04.js',
  './js/app-05.js',
  './js/app-06.js',
  './js/app-07.js',
  './js/app-08.js',
  './js/app-09.js',
  './js/app-10.js',
  './js/app-11.js',
  './js/app-12.js',
  './js/app-13.js',
  './js/app-14.js',
  './js/app-15.js',
  './js/draw-editor.js',
  './js/extra-entry.js',
  './js/extra-tools.js',
  './js/extras-menu.js',
  './js/hash-open.js',
  './js/lazy-loader.js',
  './js/legal-links.js',
  './js/page-text.js',
  './js/pdf-tools.js',
  './js/remove-pages.js',
  './js/signature-stamp.js',
  './js/site-locale.js',
  './js/text-editor.js',
  './lv/compress-pdf.html',
  './lv/draw-on-pdf.html',
  './lv/edit-pdf-text.html',
  './lv/excel-to-pdf.html',
  './lv/extract-pdf-pages.html',
  './lv/jpg-to-pdf.html',
  './lv/merge-pdf.html',
  './lv/pdf-metadata.html',
  './lv/pdf-page-numbers.html',
  './lv/pdf-to-excel.html',
  './lv/pdf-to-jpg.html',
  './lv/pdf-to-word.html',
  './lv/privacy.html',
  './lv/remove-pdf-pages.html',
  './lv/rotate-pdf.html',
  './lv/sign-pdf.html',
  './lv/split-pdf.html',
  './lv/stamp-pdf.html',
  './lv/terms.html',
  './lv/watermark-pdf.html',
  './lv/word-to-pdf.html',
  './manifest.webmanifest',
  './ru/compress-pdf.html',
  './ru/draw-on-pdf.html',
  './ru/edit-pdf-text.html',
  './ru/excel-to-pdf.html',
  './ru/extract-pdf-pages.html',
  './ru/jpg-to-pdf.html',
  './ru/merge-pdf.html',
  './ru/pdf-metadata.html',
  './ru/pdf-page-numbers.html',
  './ru/pdf-to-excel.html',
  './ru/pdf-to-jpg.html',
  './ru/pdf-to-word.html',
  './ru/privacy.html',
  './ru/remove-pdf-pages.html',
  './ru/rotate-pdf.html',
  './ru/sign-pdf.html',
  './ru/split-pdf.html',
  './ru/stamp-pdf.html',
  './ru/terms.html',
  './ru/watermark-pdf.html',
  './ru/word-to-pdf.html'
];

/* CDN-библиотеки, без которых ничего не работает */
const CDN_URLS = [
  'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.1/jspdf.plugin.autotable.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
];

/* === INSTALL: кешируем оболочку + CDN === */
self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_STATIC);
      const r = await Promise.allSettled(PRECACHE_URLS.map(u => cache.add(u)));
      r.forEach((x, i) => { if (x.status === 'rejected') console.warn('SW: precache failed', PRECACHE_URLS[i]); });
      await Promise.all(
        CDN_URLS.map(url =>
          cache.add(url).catch(() => console.warn('SW: не удалось кешировать', url))
        )
      );
      await self.skipWaiting();
    })()
  );
});

/* === ACTIVATE: чистим старые версии === */
self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter(k => k.startsWith('marge-pdf') && k !== CACHE_STATIC)
          .map(k => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

/* === FETCH: стратегии === */
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;

  // Google Analytics — не кешируем
  if (url.hostname.includes('googletagmanager.com') || url.hostname.includes('google-analytics.com')) {
    return;
  }

  // CDN (cdnjs): cache-first
  if (url.hostname.includes('cdnjs.cloudflare.com')) {
    event.respondWith(
      caches.match(req).then(cached => {
        if (cached) return cached;
        return fetch(req).then(res => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE_STATIC).then(c => c.put(req, copy));
          }
          return res;
        }).catch(() => cached);
      })
    );
    return;
  }

  // Свои файлы: network-first, fallback — кеш
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(req)
        .then(res => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE_STATIC).then(c => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req).then(cached => cached || caches.match('./index.html')))
    );
    return;
  }

  // Всё остальное
  event.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});

/* === Сообщения от страницы === */
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});