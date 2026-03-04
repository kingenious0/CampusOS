/**
 * CampusOS Service Worker — Offline Support
 * Caches app shell + tile images for offline use
 */

const CACHE_NAME  = 'campusos-v1';
const TILE_CACHE  = 'campusos-tiles-v1';

// App shell files to cache on install
const APP_SHELL = [
    './map.html',
    './index.html',
    './data/buildings.json',
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
];

// ── INSTALL: cache app shell ──
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

// ── ACTIVATE: clean up old caches ──
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys
                .filter(k => k !== CACHE_NAME && k !== TILE_CACHE)
                .map(k => caches.delete(k))
            )
        ).then(() => self.clients.claim())
    );
});

// ── FETCH: serve from cache, fallback to network ──
self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);

    // Cache map tiles (OSM + satellite)
    if (url.hostname.includes('tile.openstreetmap.org') ||
        url.hostname.includes('arcgisonline.com')) {
        e.respondWith(cacheTile(e.request));
        return;
    }

    // App shell — cache first
    e.respondWith(
        caches.match(e.request).then(cached => {
            if (cached) return cached;
            return fetch(e.request).then(resp => {
                if (!resp || resp.status !== 200 || resp.type === 'opaque') return resp;
                const clone = resp.clone();
                caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
                return resp;
            }).catch(() => {
                // Offline fallback for HTML pages
                if (e.request.destination === 'document') {
                    return caches.match('./map.html');
                }
            });
        })
    );
});

// Cache tile with stale-while-revalidate
async function cacheTile(request) {
    const cache  = await caches.open(TILE_CACHE);
    const cached = await cache.match(request);

    const networkFetch = fetch(request).then(resp => {
        if (resp && resp.status === 200) {
            cache.put(request, resp.clone());
        }
        return resp;
    }).catch(() => null);

    return cached || await networkFetch;
}
