const CACHE_NAME = 'mente-libre-v4-force-fresh';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Network-first strategy: always fetch latest from server
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
