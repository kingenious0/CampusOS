/**
 * USTED NAV Service Worker — Offline Support
 * Caches app shell + tile images for offline use
 */

const CACHE_NAME  = 'ustednav-v1';
const TILE_CACHE  = 'ustednav-tiles-v1';

// App shell files to cache on install
const APP_SHELL = [
    './map.html',
    './index.html',
    './logo.png',
    './manifest.json',
    '/manifest.json',
    './icons/icon-192.png',
    '/icons/icon-192.png',
    './icons/icon-192-maskable.png',
    '/icons/icon-192-maskable.png',
    './icons/icon-512.png',
    '/icons/icon-512.png',
    './icons/icon-512-maskable.png',
    '/icons/icon-512-maskable.png',
    './data/buildings.json',
    './data/campus.geojson',
    './data/roads.geojson',
    './js/cesium-viewer.js',
    './js/view-controller.js',
    './js/routing/graph-schema.js',
    './js/routing/graph-validator.js',
    './js/routing/cost-model.js',
    './js/routing/spatial-snapper.js',
    './js/routing/a-star.js',
    './js/routing/maneuver-generator.js',
    './js/routing/graph-builder.js',
    './js/routing/routing-engine.js',
    './js/routing/routing-adapter.js',
    'https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.js',
    'https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.css',
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
    // Only handle GET requests
    if (e.request.method !== 'GET') return;

    const url = new URL(e.request.url);
    if (!url.protocol.startsWith('http')) return;

    // Skip Mapbox events/telemetry
    if (url.hostname.includes('events.mapbox.com')) return;

    // Cache map tiles & Mapbox API
    if (url.hostname.includes('tile.openstreetmap.org') ||
        url.hostname.includes('arcgisonline.com') ||
        url.hostname.includes('tiles.mapbox.com') ||
        url.hostname.includes('api.mapbox.com')) {
        e.respondWith(cacheTile(e.request));
        return;
    }

    e.respondWith(
        caches.match(e.request).then(cached => {
            if (cached) return cached;
            return fetch(e.request).then(resp => {
                if (!resp || resp.status !== 200 || resp.type === 'opaque') return resp;
                const clone = resp.clone();
                caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
                return resp;
            }).catch(() => {
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

    if (!navigator.onLine && cached) {
        return cached;
    }

    const networkFetch = fetch(request).then(resp => {
        if (resp && (resp.status === 200 || resp.type === 'opaque')) {
            cache.put(request, resp.clone());
        }
        return resp;
    }).catch(() => null);

    if (cached) return cached;
    const netResp = await networkFetch;
    if (netResp) return netResp;

    // Return empty 204 or transparent fallback if tile cannot be fetched while offline
    return new Response('', { status: 204, statusText: 'No Content (Offline)' });
}
