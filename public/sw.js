/// <reference lib="webworker" />

import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { clientsClaim } from "workbox-core";

self.skipWaiting();
clientsClaim();

// Limpiar caches antiguas
cleanupOutdatedCaches();

// Precaching automático de Vite (solo assets locales)
precacheAndRoute(self.__WB_MANIFEST || []);

// ======================
// Cache de CDN externos (Bootstrap, FontAwesome, etc.)
// ======================
registerRoute(
  ({ url }) =>
    url.origin === "https://stackpath.bootstrapcdn.com" ||
    url.origin === "https://cdnjs.cloudflare.com",
  new CacheFirst({
    cacheName: "cdn-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 año
      }),
    ],
  })
);

// ======================
// Cache de APIs con NetworkFirst (URLs dinámicas)
// ======================
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new NetworkFirst({
    cacheName: "api-cache",
    networkTimeoutSeconds: 5,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 5, // 5 minutos
      }),
    ],
  })
);

// ======================
// Cache de imágenes (Cache First)
// ======================
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "images-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 días
      }),
    ],
  })
);

// ======================
// Cache de fuentes (Cache First)
// ======================
registerRoute(
  ({ request }) => request.destination === "font",
  new CacheFirst({
    cacheName: "fonts-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 año
      }),
    ],
  })
);

// ======================
// Cache de scripts y estilos (Stale While Revalidate)
// ======================
registerRoute(
  ({ request }) => request.destination === "script" || request.destination === "style",
  new StaleWhileRevalidate({
    cacheName: "assets-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 días
      }),
    ],
  })
);

// ======================
// Fallback offline para navegación
// ======================
registerRoute(
  ({ request }) => request.mode === "navigate",
  new NetworkFirst({
    cacheName: "html-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 60 * 60 * 24 * 7, // 7 días
      }),
    ],
  })
);
