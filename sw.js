const CACHE_NAME = 'notebooklm-v1.0.1';
const STATIC_ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'metadata.json'
];

const CDN_DOMAINS = [
  'esm.sh',
  'cdn.tailwindcss.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com'
];

// Install: Cache core static assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching static assets');
      // Using relative paths works well with caches.addAll
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch: Strategy-based routing
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Strategy 1: Stale-While-Revalidate for local static assets
  // Check if the request matches any of our static assets relative to the service worker location
  const isStaticAsset = STATIC_ASSETS.some(asset => {
    // Basic match: if the path ends with the asset name
    // (excluding leading ./ for matching purposes)
    const normalizedAsset = asset.startsWith('./') ? asset.slice(2) : asset;
    return url.pathname.endsWith(normalizedAsset) || (normalizedAsset === '' && url.pathname.endsWith('/'));
  });

  if (isStaticAsset) {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  // Strategy 2: Cache-First for specific CDNs (ESM modules and fonts)
  if (CDN_DOMAINS.some(domain => url.hostname.includes(domain))) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // Strategy 3: Network-First for everything else (including Gemini API calls)
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  const networkPromise = fetch(request).then((networkResponse) => {
    // Only cache successful GET responses
    if (networkResponse.ok && request.method === 'GET') {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(err => {
    console.warn('[SW] Fetch failed for:', request.url, err);
    return cachedResponse;
  });
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
    console.warn('[SW] Cache-first network fetch failed for:', request.url);
    return cachedResponse;
  }
}