// import { precacheAndRoute } from "workbox-precaching";
importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js");
// Workbox maneja la precaché automática (workbox-precache-v2)
// precacheAndRoute(self.__WB_MANIFEST || []);
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

// URLs de API que tendrán fallback offline
const apiOfflineFallbacks = [
  "http://localhost:4000/api/auth/renew",
  "http://localhost:4000/api/events",
];

// Fetch - manejo de APIs con fallback offline
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Manejo de APIs específicas con fallback
  if (apiOfflineFallbacks.includes(request.url)) {
    const resp = fetch(request)
      .then((response) => {
        if (!response) {
          return caches.match(request);
        }

        caches.open("cache-dynamic").then((cache) => {
          cache.put(request, response);
        });

        return response.clone();
      })
      .catch((err) => {
        console.log("[SW] Offline response for:", request.url);
        return caches.match(request);
      });

    event.respondWith(resp);
    return;
  }

  // 2. Manejo general para el resto de recursos (assets, HTML, etc.)
  // Estrategia: Cache First, fallback a Network
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((response) => {
          // Solo cachear respuestas válidas del mismo origen
          if (response && response.status === 200 && url.origin === location.origin) {
            const responseClone = response.clone();
            caches.open("cache-dynamic").then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Si es una navegación (HTML), devolver index.html desde caché
          if (request.mode === "navigate") {
            return caches.match("/index.html");
          }
          return new Response("Offline", { status: 503 });
        });
    })
  );
});

self.addEventListener("install", async (event) => {
  const cache = await caches.open("cache-1");
  await cache.addAll([
    "https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.0-2/css/all.min.css",
    "/favicon.ico",
  ]);
});
