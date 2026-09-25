/**
 * Verification test for Supabase PostgREST Mutation Headers, URL/Key Sanitization,
 * Auto-Retry Pending Queue, Baked-in Project Credentials, and Standalone PWA Installation.
 */

const assert = require('assert');
const fs = require('fs');

console.log('=== RUNNING SYNC HEADERS, PWA & CONFIG VERIFICATION ===\n');

// 1. Check admin/manifest.webmanifest
const manifestRaw = fs.readFileSync('admin/manifest.webmanifest', 'utf8');
const manifest = JSON.parse(manifestRaw);
assert.strictEqual(manifest.name, 'CampusOS Studio');
assert.strictEqual(manifest.short_name, 'CampusOS');
assert.strictEqual(manifest.start_url, '/admin/');
assert.strictEqual(manifest.scope, '/admin/');
assert.strictEqual(manifest.display, 'standalone');
assert.strictEqual(manifest.theme_color, '#4f46e5');
assert.strictEqual(manifest.background_color, '#0d1117');
assert(Array.isArray(manifest.icons) && manifest.icons.length >= 2, 'Must include icons for PWA');
console.log('✓ PASS: admin/manifest.webmanifest is valid PWA standalone manifest');

// 2. Check admin/index.html PWA tags & Install Button
const adminHtml = fs.readFileSync('admin/index.html', 'utf8');
assert(adminHtml.includes('<link rel="manifest" href="/admin/manifest.webmanifest">'), 'Must link /admin/manifest.webmanifest');
assert(adminHtml.includes('<meta name="theme-color" content="#4f46e5">'), 'Must declare theme-color #4f46e5');
assert(adminHtml.includes('apple-mobile-web-app-capable'), 'Must declare apple-mobile-web-app-capable');
assert(adminHtml.includes('apple-mobile-web-app-status-bar-style'), 'Must declare apple-mobile-web-app-status-bar-style');
assert(adminHtml.includes('id="btn-install-studio"'), 'Must include #btn-install-studio in top header');
assert(adminHtml.includes('id="btn-reset-connection-defaults"'), 'Must include #btn-reset-connection-defaults in Settings drawer');
assert(adminHtml.includes('<script src="config.js"></script>'), 'Must load config.js before sync.js');
assert(adminHtml.includes("navigator.serviceWorker.register('/sw.js', { scope: '/' })"), 'Must register /sw.js with scope /');
console.log('✓ PASS: admin/index.html includes all required PWA manifest links, meta tags, and buttons');

// 3. Check sw.js precache & bypass
const swContent = fs.readFileSync('sw.js', 'utf8');
assert(swContent.includes("'./admin/'"), 'sw.js must precache ./admin/');
assert(swContent.includes("'./admin/index.html'"), 'sw.js must precache ./admin/index.html');
assert(swContent.includes("'./admin/app.js'"), 'sw.js must precache ./admin/app.js');
assert(swContent.includes("'./admin/sync.js'"), 'sw.js must precache ./admin/sync.js');
assert(swContent.includes("'./admin/config.js'"), 'sw.js must precache ./admin/config.js');
assert(swContent.includes("'./admin/manifest.webmanifest'"), 'sw.js must precache ./admin/manifest.webmanifest');
assert(!swContent.includes("if (url.pathname.startsWith('/admin')) return;"), 'sw.js must NOT bypass /admin');
assert(swContent.includes("if (url.hostname.includes('supabase.co')) return;"), 'sw.js must bypass supabase.co');
console.log('✓ PASS: sw.js precaches admin studio assets and enables offline support');

// 4. Test Config & Baked-in Credentials
const { APP_CONFIG, ENV } = require('../admin/config.js');
assert.strictEqual(APP_CONFIG.SUPABASE_URL, 'https://mzxmbkulgrehujpvwadt.supabase.co');
assert.strictEqual(APP_CONFIG.DEFAULT_SCHEMA, 'usted_nav');
assert.strictEqual(APP_CONFIG.DEFAULT_ORG_ID, 'usted-ksi');
assert(APP_CONFIG.SUPABASE_ANON_KEY.length > 20, 'Must have valid anon key string');

// Setup minimal browser-like environment for Node.js
global.navigator = { onLine: true };
global.window = {
    addEventListener: () => {},
    removeEventListener: () => {}
};

// Test ENV getters fallback to APP_CONFIG when localStorage is empty
global.localStorage = {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; }
};

assert.strictEqual(ENV.supabaseUrl, 'https://mzxmbkulgrehujpvwadt.supabase.co');
assert.strictEqual(ENV.supabaseKey, APP_CONFIG.SUPABASE_ANON_KEY);
assert.strictEqual(ENV.schema, 'usted_nav');
assert.strictEqual(ENV.orgId, 'usted-ksi');

// Test ENV localStorage override
localStorage.setItem('supabase_url', 'https://custom-project.supabase.co//');
assert.strictEqual(ENV.supabaseUrl, 'https://custom-project.supabase.co', 'Getter must sanitize and trim trailing slashes');
ENV.resetDefaults();
assert.strictEqual(ENV.supabaseUrl, 'https://mzxmbkulgrehujpvwadt.supabase.co', 'resetDefaults must restore APP_CONFIG');
console.log('✓ PASS: Baked-in APP_CONFIG and window.ENV getters & resetDefaults function properly');

// 5. Test admin/sync.js URL/Key sanitization & PostgREST headers on mutations
const CampusSync = require('../admin/sync.js');
assert.strictEqual(typeof CampusSync.processPendingQueue, 'function', 'Must export processPendingQueue');

(async () => {
    // Save unsanitized credentials with whitespace & trailing slashes
    CampusSync.saveConfig({
        supabaseUrl: '  https://mzxmbkulgrehujpvwadt.supabase.co/// \n',
        supabaseAnonKey: '  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xyz  \n',
        orgId: '  usted-ksi  '
    });

    const cfg = CampusSync.getConfig();
    assert.strictEqual(cfg.supabaseUrl, 'https://mzxmbkulgrehujpvwadt.supabase.co', 'URL must be sanitized');
    assert.strictEqual(cfg.supabaseAnonKey, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xyz', 'Key must be trimmed');
    assert.strictEqual(cfg.orgId, 'usted-ksi', 'OrgId must be trimmed');
    console.log('✓ PASS: Supabase URL and Key sanitization strips whitespace and trailing slashes');

    // Test PostgREST headers captured during mutation sync
    let capturedFetch = [];
    global.fetch = async (url, opts = {}) => {
        capturedFetch.push({ url, opts });
        return {
            ok: true,
            status: 200,
            json: async () => ({ id: 'test-record' }),
            text: async () => '{"status":"ok"}'
        };
    };

    // Clear client so it uses raw REST fetch fallback for header inspection
    global.supabase = undefined;

    // 1. Queue a mutation while in Sandbox mode (offline queue)
    CampusSync.saveConfig({
        supabaseUrl: '',
        supabaseAnonKey: '',
        isSandbox: true
    });

    await CampusSync.saveRecord('buildings', {
        id: 'test_bld_99',
        name: 'Test Innovation Center',
        org_id: 'usted-ksi'
    });

    const pendingBefore = await CampusSync.getPendingMutations();
    assert.strictEqual(pendingBefore.length, 1, 'Mutation must be in pending queue');

    // 2. Connect to Supabase credentials (sanitized) and flush via processPendingQueue
    CampusSync.saveConfig({
        supabaseUrl: '  https://mzxmbkulgrehujpvwadt.supabase.co///  ',
        supabaseAnonKey: '  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xyz  ',
        orgId: '  usted-ksi  ',
        isSandbox: false
    });

    // Trigger processPendingQueue (simulating "Save Connection & Test Sync")
    await CampusSync.processPendingQueue();

    const pendingAfter = await CampusSync.getPendingMutations();
    assert.strictEqual(pendingAfter.length, 0, 'Pending queue must be completely flushed');

    const upsertReq = capturedFetch.find(r => r.url.includes('/rest/v1/buildings?on_conflict=id'));
    assert(upsertReq, 'Must have sent upsert request for buildings table');

    const headers = upsertReq.opts.headers;
    assert.strictEqual(headers['Content-Type'], 'application/json');
    assert.strictEqual(headers['apikey'], 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xyz');
    assert.strictEqual(headers['Authorization'], 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xyz');
    assert.strictEqual(headers['Accept-Profile'], 'usted_nav');
    assert.strictEqual(headers['Content-Profile'], 'usted_nav');
    assert.strictEqual(headers['Prefer'], 'return=representation,resolution=merge-duplicates');
    console.log('✓ PASS: All required PostgREST headers (Prefer, Accept-Profile, Content-Profile, apikey, Authorization) attached on mutation sync');

    console.log('\n=== ALL SYNC, PWA & CONFIG TESTS PASSED (100%)! ===');
})();
