const CACHE_NAME = "kataduke-navi-v9";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./mobile.html",
  "./styles.css?v=craftmincho-1",
  "./app.js",
  "./manifest.webmanifest?v=kataduke-navi-1",
  "./assets/chibi-broom.png",
  "./assets/chibi-laundry.png",
  "./assets/chibi-cleaning-header.png",
  "./assets/coach/gene-task.png",
  "./assets/coach/gene-ending.png",
  "./assets/coach/gene-encourage.png",
  "./assets/coach/nadia-task.png",
  "./assets/coach/nadia-celebrate.png",
  "./assets/coach/nadia-encourage.png",
  "./assets/fonts/craftmincho.otf?v=craftmincho-1",
  "./assets/icons/favicon-32.png",
  "./assets/icons/apple-touch-icon.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/maskable-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    })
  );
});
