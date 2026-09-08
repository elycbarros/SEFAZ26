/**
 * Service Worker — SEFAZ/SC 2026 PWA (v4.4)
 * Auto-limpeza e rede direta para garantir atualizações imediatas
 */

const CACHE_NAME = 'sefaz-sc-refined-4.4';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
