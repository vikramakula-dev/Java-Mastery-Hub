const CACHE = "jmh-v1";
const PRECACHE = ["./", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;

  e.respondWith(
    caches.match(request, { ignoreSearch: request.mode === "navigate" }).then((cached) => {
      // Serve from cache instantly, refresh the cache in the background
      const network = fetch(request)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(() => (request.mode === "navigate" ? caches.match("./") : undefined));
      return cached || network;
    })
  );
});
