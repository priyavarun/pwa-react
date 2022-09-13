console.log("In Service Worker");

const CACHE_NAME = "PWA";
const URLS_TO_CACHE = ["index.html", "offline.html"];

const self = this;

// Install Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Listen for requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(() => {
      return fetch(event.request).catch(() => {
          console.log("No internet");
          return caches.match("offline.html");
        });
    })
  );
});

// Activate the Service Worker
self.addEventListener("activate", (event) => {
  const whitelistedCaches = [];
  whitelistedCaches.push(CACHE_NAME);

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!whitelistedCaches.includes(cacheName)) {
            return delete caches.delete(cacheName);
          }
          return cacheName;
        })
      );
    })
  );
});
