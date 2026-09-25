/**
 * USTED NAV Service Worker — Offline Support
 * Caches app shell + tile images for offline use
 */

const CACHE_NAME  = 'ustednav-v1.2.2';
const TILE_CACHE  = 'ustednav-tiles-v1';

// App shell files to cache on install (Deduplicated clean paths)
const APP_SHELL = [
    './',
    './index.html',
    './map.html',
    './config.js',
    './modules/data-loader.js',
    './modules/search.js',
    './modules/map.js',
    './admin/',
    './admin/index.html',
    './admin/app.js',
    './admin/sync.js',
    './admin/config.js',
    './admin/seed_data.js',
    './admin/seed_data.json',
    './admin/manifest.webmanifest',
    './logo.png',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-192-maskable.png',
    './icons/icon-512.png',
    './icons/icon-512-maskable.png',
    './screenshots/screenshot-mobile.png',
    './screenshots/screenshot-desktop.png',
    './data/buildings.json',
    './data/people.json',
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

// ── INSTALL: cache app shell safely with deduplication & skipWaiting ──
self.addEventListener('install', e => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME).then(async cache => {
            // Deduplicate resolved URLs
            const resolvedUrls = Array.from(new Set(APP_SHELL.map(url => {
                try {
                    return new URL(url, self.location.href).href;
                } catch(err) {
                    return url;
                }
            })));

            // Cache items individually so one non-critical failure doesn't abort whole install
            return Promise.all(
                resolvedUrls.map(url =>
                    cache.add(url).catch(err => {
                        console.warn('SW: Cache failed for asset:', url, err);
                    })
                )
            );
        })
    );
});

// ── ACTIVATE: clean up old caches & claim clients immediately ──
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

// ── FETCH: Stale-While-Revalidate for HTML, JS, CSS, JSON & Assets ──
self.addEventListener('fetch', e => {
    // Only handle GET requests
    if (e.request.method !== 'GET') return;

    const url = new URL(e.request.url);
    if (!url.protocol.startsWith('http')) return;

    // Bypass Supabase API requests (handled directly by offline-first IndexedDB queue)
    if (url.hostname.includes('supabase.co')) return;

    // Skip Mapbox events/telemetry
    if (url.hostname.includes('events.mapbox.com')) return;

    // Cache map tiles & Mapbox API with tile cache
    if (url.hostname.includes('tile.openstreetmap.org') ||
        url.hostname.includes('arcgisonline.com') ||
        url.hostname.includes('tiles.mapbox.com') ||
        url.hostname.includes('api.mapbox.com')) {
        e.respondWith(cacheTile(e.request));
        return;
    }

    // Network-First for dynamic JSON data endpoints (e.g. data/people.json, data/buildings.json)
    // Ensures cache busting for local fetches while preserving 100% offline fallback
    if (url.pathname.endsWith('.json') || url.pathname.includes('/data/')) {
        e.respondWith(
            fetch(e.request).then(networkResponse => {
                if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
                    const cloned = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(e.request, cloned));
                }
                return networkResponse;
            }).catch(async () => {
                const cached = await caches.match(e.request);
                if (cached) return cached;
                return new Response(JSON.stringify([]), {
                    headers: { 'Content-Type': 'application/json' },
                    status: 200
                });
            })
        );
        return;
    }

    // Stale-While-Revalidate strategy for app shell, data, and styles
    e.respondWith(
        caches.open(CACHE_NAME).then(async cache => {
            const cachedResponse = await cache.match(e.request);

            // Revalidate in background from network
            const networkFetch = fetch(e.request).then(networkResponse => {
                if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
                    cache.put(e.request, networkResponse.clone());
                }
                return networkResponse;
            }).catch(() => null);

            // Return cached version immediately if available
            if (cachedResponse) {
                return cachedResponse;
            }

            // Otherwise wait for network response
            const netResp = await networkFetch;
            if (netResp) return netResp;

            // Offline document fallback
            if (e.request.destination === 'document' || e.request.mode === 'navigate') {
                if (url.pathname.startsWith('/admin')) {
                    const adminFallback = await cache.match('./admin/index.html') || await cache.match('/admin/index.html') || await cache.match('./admin/');
                    if (adminFallback) return adminFallback;
                }
                const fallback = await cache.match('./map.html') || await cache.match('/map.html') || await cache.match('./index.html');
                if (fallback) return fallback;
            }

            return new Response('Offline: Content not available in cache.', {
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'text/plain' }
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

// ── BACKGROUND SYNC ──
self.addEventListener('sync', event => {
    if (event.tag === 'sync-campus-data') {
        event.waitUntil(
            caches.open(CACHE_NAME).then(cache => cache.addAll([
                './data/buildings.json',
                './data/campus.geojson'
            ])).catch(() => {})
        );
    }
});

// ── PERIODIC BACKGROUND SYNC ──
self.addEventListener('periodicsync', event => {
    if (event.tag === 'update-campus-cache') {
        event.waitUntil(
            caches.open(CACHE_NAME).then(cache => cache.addAll([
                './data/buildings.json',
                './data/roads.geojson'
            ])).catch(() => {})
        );
    }
});

// ── PUSH NOTIFICATIONS ──
self.addEventListener('push', event => {
    const title = 'USTED Nav';
    const options = {
        body: event.data ? event.data.text() : 'Campus updates and room navigation are ready.',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png'
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(clientList => {
            for (const client of clientList) {
                if (client.url.includes('map.html') && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/map.html');
            }
        })
    );
});
