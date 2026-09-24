/**
 * CampusOS Studio Admin - Service Worker
 * Ensures the Admin CMS works 100% offline with local IndexedDB mutations.
 */

const CACHE_NAME = 'campusos-studio-v1.0.0';
const STATIC_ASSETS = [
    './',
    './index.html',
    './app.js',
    './sync.js',
    './seed_data.json',
    '../icons/icon-192.png'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        }).catch(err => {
            console.warn('[Admin SW] Cache addAll warning:', err);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Skip Supabase API / auth requests from service worker caching
    if (url.origin.includes('supabase.co')) {
        return;
    }

    event.respondWith(
        caches.open(CACHE_NAME).then(async (cache) => {
            const cachedResponse = await cache.match(event.request);

            // Stale-While-Revalidate
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
                    cache.put(event.request, networkResponse.clone());
                }
                return networkResponse;
            }).catch(() => cachedResponse);

            return cachedResponse || fetchPromise;
        })
    );
});
