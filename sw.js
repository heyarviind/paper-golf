const CACHE_NAME = "mini-golf-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/styles.css",
  "/game.js",
  "/manifest.json",
  "/icons/tree.svg",
  "/icons/arrow-up.svg",
  "/icons/hamburger.svg",
  "/icons/refresh.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
