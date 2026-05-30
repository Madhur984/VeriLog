// Bump this whenever the caching strategy changes — the activate handler below
// deletes every cache that isn't the current one, so old (stale) precaches go.
const CACHE_NAME = "ece-pokedex-v6";
const PRECACHE_URLS = ["/", "/index.html", "/manifest.json"];

self.addEventListener("install", (event) => {
  // Take over as soon as installed instead of waiting for all tabs to close,
  // so a fix ships on the next reload rather than "sometime later".
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // don't touch cross-origin

  // Build assets / dev modules: ALWAYS go to network so a new deploy's hashed
  // chunk files are fetched fresh. Serving a stale chunk reference is the root
  // cause of the "blank page, reload fixes it" bug after code-splitting.
  const isAsset =
    url.pathname.startsWith("/assets/") ||
    url.pathname.startsWith("/src/") ||
    url.pathname.startsWith("/@") ||
    url.pathname.startsWith("/node_modules/") ||
    url.pathname.startsWith("/mascot/"); // mascot art: always fresh so redesigns show
  if (isAsset) {
    event.respondWith(fetch(request).catch(() => caches.match(request)));
    return;
  }

  // Navigations / HTML: network-first. index.html (and the chunk hashes it
  // references) must be current; fall back to cache only when offline.
  const isNavigation =
    request.mode === "navigate" ||
    (request.headers.get("accept") || "").includes("text/html");
  if (isNavigation) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("/index.html", copy));
          return response;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match("/index.html")))
    );
    return;
  }

  // Everything else (manifest, icons, etc.): cache-first with network fallback.
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request)));
});
