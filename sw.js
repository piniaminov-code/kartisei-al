/* כרטיסי על – service worker.
   Caches ONLY the static app shell that the site already ships (HTML, JS, CSS, fonts, icons).
   Children's names, answers and cards live in localStorage on the device and never pass through here:
   the app makes no network requests with user data, and this worker caches nothing but same-origin
   static files. Bump VERSION whenever shipped files change; old caches are deleted on activate. */
const VERSION = 'kartisei-v12';
const SHELL = [
  './', './index.html', './manifest.webmanifest',
  './app.js?v=12', './sentences.js?v=12', './icons/emoji.js?v=12', './fonts/fonts.css',
  './vendor/html2canvas-1.4.1.min.js', './vendor/jspdf-2.5.1.umd.min.js',
  './icons/app/icon-192.png', './icons/app/icon-512.png', './icons/app/icon-maskable-512.png',
  './icons/app/apple-touch-icon.png', './icons/app/favicon-32.png'
];
const STATIC = /\.(?:js|css|woff2|png|svg|webmanifest)$/;

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    await cache.addAll(SHELL);
    // the font files listed in fonts.css, so the PDF can use any font offline
    try {
      const css = await (await fetch('./fonts/fonts.css', {cache: 'no-cache'})).text();
      const urls = [...css.matchAll(/url\(([^)]+\.woff2)\)/g)].map(m => new URL(m[1], new URL('./fonts/', self.registration.scope)).href);
      await cache.addAll([...new Set(urls)]);
    } catch (e) { /* fonts are then cached on first use */ }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('kartisei-') && k !== VERSION).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  const scope = new URL(self.registration.scope);
  if (!url.pathname.startsWith(scope.pathname)) return;
  const rel = url.pathname.slice(scope.pathname.length);
  if (/^(?:docs|tests)\//.test(rel)) return;

  // HTML: network first, so a new version is picked up at once; cached shell when offline
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith((async () => {
      try {
        const res = await fetch(req, {cache: 'no-cache'});
        if (res.ok && (rel === '' || rel === 'index.html')) (await caches.open(VERSION)).put('./index.html', res.clone());
        return res;
      } catch (e) {
        return (await caches.match('./index.html')) || (await caches.match('./')) || Response.error();
      }
    })());
    return;
  }
  // shipped static files: cache first (they are versioned by ?v= or by the cache VERSION)
  if (STATIC.test(url.pathname)) {
    event.respondWith((async () => {
      const hit = await caches.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok && res.type === 'basic') (await caches.open(VERSION)).put(req, res.clone());
      return res;
    })());
  }
});
