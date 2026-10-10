// Offline cache for the fridge board.
// The app's files are served from the cache straight away, so the board opens without a network.
// While online, each launch also fetches fresh copies in the background; they are used from the
// next launch on. Change CACHE only when the list of files changes.
const CACHE = 'fridge-notes-v1';
const FILES = ['index.html', 'manifest.webmanifest', 'icon-180.png', 'icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const scope = new URL(self.registration.scope);
  if (url.origin !== scope.origin || url.pathname.indexOf(scope.pathname) !== 0) return;
  const path = url.pathname.slice(scope.pathname.length) || 'index.html';
  if (FILES.indexOf(path) < 0) return; // anything else (such as devtest.html) goes to the network as usual

  const fresh = caches.open(CACHE).then((cache) => fetch(path, { cache: 'no-cache' }).then((response) => {
    if (response.ok) return cache.put(path, response.clone()).then(() => response);
    return response;
  }));
  event.respondWith(caches.open(CACHE).then((cache) => cache.match(path)).then((cached) => cached || fresh));
  event.waitUntil(fresh.catch(() => { /* offline: the cached copy is used */ }));
});
