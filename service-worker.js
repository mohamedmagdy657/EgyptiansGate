const APP_VERSION = '20260807-2';
const CACHE_NAME = `egate-cache-${APP_VERSION}`;
const PRECACHE_URLS = [
  './',
  './index.html',
  './styles.css?v=20260807-2',
  './app.js?v=20260807-2',
  './data.js?v=20260807-2',
  './manifest.webmanifest',
  './assets/images/placeholder.svg',
  './assets/images/favicon.svg',
];

function networkFirst(request) {
  return caches.open(CACHE_NAME).then(cache =>
    fetch(request, { cache: 'no-store' })
      .then(response => {
        if (response && response.ok) {
          cache.put(request, response.clone());
        }
        return response;
      })
      .catch(() => cache.match(request))
  );
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then(response => {
          if (response && response.ok) {
            caches.open(CACHE_NAME).then(cache => cache.put('./index.html', response.clone()));
          }
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(networkFirst(request));
});
