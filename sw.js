const CACHE_NAME = 'notebooklm-v1.0.5';
const STATIC_ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'metadata.json',
  'offline.html'
];

const CDN_DOMAINS = [
  'esm.sh',
  'cdn.tailwindcss.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Strategy 1: Network-Only for Gemini API
  // We strictly do NOT cache AI responses to prevent serving stale data or sensitive leaks in shared caches.
  if (url.hostname.includes('generativelanguage.googleapis.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Strategy 2: Stale-While-Revalidate for Local Static Assets
  const isStaticAsset = STATIC_ASSETS.some(asset => {
    const normalizedAsset = asset.startsWith('./') ? asset.slice(2) : asset;
    return url.pathname.endsWith(normalizedAsset) || (normalizedAsset === '' && url.pathname.endsWith('/'));
  });

  if (isStaticAsset) {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  // Strategy 3: Navigation Fallback for Offline Support
  // If the user navigates to a page and the network fails, serve offline.html.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('offline.html') || caches.match('./offline.html');
      })
    );
    return;
  }

  // Strategy 4: Cache-First for CDNs (Immutable/Versioned)
  if (CDN_DOMAINS.some(domain => url.hostname.includes(domain))) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // Strategy 5: Default Network with Cache Fallback
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  const networkPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok && request.method === 'GET') {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || networkPromise;
}

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;
  
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    if (networkResponse.ok && request.method === 'GET') {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    return cachedResponse;
  }
}