/**
 * Verification Test: CampusOS Studio Admin Offline Navigation & Service Worker Precaching
 * Ensures sw.js precaches all /admin suite assets, CDNs, styles, and provides dedicated
 * offline navigation routing to prevent ERR_FAILED in standalone PWA mode.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('=== RUNNING ADMIN OFFLINE SW & PRECACHE TESTS ===\n');

// 1. Check sw.js contents
const swPath = path.join(__dirname, '../sw.js');
const swContent = fs.readFileSync(swPath, 'utf8');

// A. PRECACHE_ASSETS array definition
assert(swContent.includes('const PRECACHE_ASSETS = ['), 'sw.js must define PRECACHE_ASSETS array');

// Required Studio root & shell paths
const requiredStudioAssets = [
    "'/'",
    "'/index.html'",
    "'/map.html'",
    "'/admin/'",
    "'/admin/index.html'",
    "'/admin/app.js'",
    "'/admin/sync.js'",
    "'/admin/config.js'",
    "'/admin/seed_data.js'",
    "'/admin/seed_data.json'",
    "'/admin/manifest.webmanifest'",
    "'/admin/sw.js'",
    "'./admin/'",
    "'./admin/index.html'",
    "'./admin/app.js'",
    "'./admin/sync.js'",
    "'./admin/config.js'",
    "'./admin/seed_data.js'",
    "'./admin/seed_data.json'",
    "'./admin/manifest.webmanifest'",
    "'./admin/sw.js'"
];

for (const asset of requiredStudioAssets) {
    assert(swContent.includes(asset), `sw.js PRECACHE_ASSETS must include ${asset}`);
}
console.log('✓ PASS: sw.js PRECACHE_ASSETS includes all required /admin files');

// Required external styles & CDNs for Studio
const requiredCDNs = [
    "'https://cdn.tailwindcss.com'",
    "'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'",
    "'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'",
    "'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'",
    "'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap'"
];

for (const cdn of requiredCDNs) {
    assert(swContent.includes(cdn), `sw.js PRECACHE_ASSETS must include CDN ${cdn}`);
}
console.log('✓ PASS: sw.js PRECACHE_ASSETS includes all Studio CDN styles, Leaflet, and fonts');

// Required icons & logos
const requiredIcons = [
    "'/icons/icon-192.png'",
    "'/icons/icon-512.png'",
    "'/logo.png'"
];

for (const icon of requiredIcons) {
    assert(swContent.includes(icon), `sw.js PRECACHE_ASSETS must include icon ${icon}`);
}
console.log('✓ PASS: sw.js PRECACHE_ASSETS includes Studio and PWA icons');

// B. Dedicated Offline Navigation Routing Check
assert(
    swContent.includes("e.request.mode === 'navigate'") &&
    swContent.includes("url.pathname.startsWith('/admin')"),
    'sw.js must have dedicated navigation routing for /admin requests'
);
assert(
    swContent.includes("cache.match('/admin/index.html')") ||
    swContent.includes("cache.match('/admin/')"),
    'sw.js navigation routing must fallback to cached admin shell'
);
assert(
    !swContent.includes("status: 503"),
    'sw.js must NOT return 503 Service Unavailable which triggers ERR_FAILED in Chrome PWA'
);
console.log('✓ PASS: sw.js implements dedicated offline navigation routing without 503 failures');

// 2. Check admin/sw.js fallback worker
const adminSwPath = path.join(__dirname, '../admin/sw.js');
const adminSwContent = fs.readFileSync(adminSwPath, 'utf8');

assert(adminSwContent.includes("'/admin/'"), 'admin/sw.js must precache /admin/');
assert(adminSwContent.includes("'/admin/index.html'"), 'admin/sw.js must precache /admin/index.html');
assert(adminSwContent.includes("'/admin/app.js'"), 'admin/sw.js must precache /admin/app.js');
assert(adminSwContent.includes("'/admin/sync.js'"), 'admin/sw.js must precache /admin/sync.js');
assert(adminSwContent.includes("'/admin/config.js'"), 'admin/sw.js must precache /admin/config.js');
assert(adminSwContent.includes("event.request.mode === 'navigate'"), 'admin/sw.js must handle offline navigation routing');
console.log('✓ PASS: admin/sw.js also contains complete static assets and navigation fallback');

console.log('\n=== ALL ADMIN OFFLINE SW & PRECACHE TESTS PASSED (100%)! ===');
