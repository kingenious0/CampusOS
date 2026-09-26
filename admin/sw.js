/**
 * CampusOS Studio Admin - Service Worker
 * Ensures the Admin CMS works 100% offline with local IndexedDB mutations.
 */

const CACHE_NAME = 'campusos-studio-v1.0.2';
const STATIC_ASSETS = [
    './',
    './index.html',
    './app.js',
    './sync.js',
    './config.js',
    './seed_data.js',
    './seed_data.json',
    './manifest.webmanifest',
    './sw.js',
    '/admin/',
    '/admin/index.html',
    '/admin/app.js',
    '/admin/sync.js',
    '/admin/config.js',
    '/admin/seed_data.js',
    '/admin/seed_data.json',
    '/admin/manifest.webmanifest',
    '/admin/sw.js',
    '../icons/icon-192.png',
    '../icons/icon-512.png',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
    'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            const resolvedUrls = Array.from(new Set(STATIC_ASSETS.map(url => {
                try {
                    return new URL(url, self.location.href).href;
                } catch(err) {
                    return url;
                }
            })));
            return Promise.all(
                resolvedUrls.map(url =>
                    cache.add(url).catch(err => {
                        console.warn('[Admin SW] Cache failed for asset:', url, err);
                    })
                )
            );
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

    // Navigation fallback for offline Studio
    if (event.request.mode === 'navigate' || event.request.destination === 'document') {
        event.respondWith(
            fetch(event.request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const cloned = networkResponse.clone();
                    caches.open(CACHE_NAME).then(c => c.put(event.request, cloned));
                }
                return networkResponse;
            }).catch(async () => {
                const cache = await caches.open(CACHE_NAME);
                const match = (await cache.match(event.request, { ignoreSearch: true })) ||
                              (await cache.match('./index.html')) ||
                              (await cache.match('./')) ||
                              (await cache.match('/admin/index.html')) ||
                              (await cache.match('/admin/'));
                if (match) return match;
                return new Response('<!DOCTYPE html><html><head><meta charset="utf-8"><title>CampusOS Studio - Offline</title><base href="/admin/"><link rel="manifest" href="/admin/manifest.webmanifest"></head><body style="background:#090d16;color:#e2e8f0;font-family:sans-serif;padding:2rem;text-align:center;"><h2>CampusOS Studio is Offline</h2><button onclick="location.reload()" style="background:#4f46e5;color:#fff;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;">Retry</button></body></html>', {
                    status: 200,
                    headers: { 'Content-Type': 'text/html; charset=utf-8' }
                });
            })
        );
        return;
    }

    event.respondWith(
        caches.open(CACHE_NAME).then(async (cache) => {
            const cachedResponse = (await cache.match(event.request, { ignoreSearch: true })) ||
                                   (await cache.match(url.pathname));

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
