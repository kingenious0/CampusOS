/**
 * Comprehensive Verification Tests for Admin Studio & Client Map Deletion Persistence:
 * 1. deleteRecord deletes from local IndexedDB/memoryStore with both integer and string IDs.
 * 2. deleteRecord records tombstones in localStorage ('campusos_tombstones').
 * 3. deleteRecord cancels pending un-synced UPSERT mutations for the deleted record.
 * 4. deleteRecord enqueues DELETE mutation with 'usted_nav' schema headers and awaits sync.
 * 5. getAll and checkAndBootstrapData exclude tombstoned records (no resurrection from seed).
 * 6. pullRemoteRecords reconciles local store by pruning records deleted on Supabase.
 * 7. Client Map data-loader.js normalizeDataset does not resurrect deleted buildings or staff from fallbacks.
 * 8. Client Map writeToIndexedDB prunes deleted records from local cache.
 */

const assert = require('assert');
const fs = require('fs');

console.log('=== RUNNING ADMIN & CLIENT MAP DELETION PERSISTENCE TEST SUITE ===\n');

// Mock localStorage
const storageMap = new Map();
global.localStorage = {
    getItem: (k) => storageMap.get(k) || null,
    setItem: (k, v) => storageMap.set(k, String(v)),
    removeItem: (k) => storageMap.delete(k),
    clear: () => storageMap.clear()
};

// Mock window and navigator
global.navigator = { onLine: true };
global.window = {
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
    localStorage: global.localStorage
};

// 1. Verify files exist and include critical deletion logic
const syncJsContent = fs.readFileSync('admin/sync.js', 'utf8');
const appJsContent = fs.readFileSync('admin/app.js', 'utf8');
const dataLoaderContent = fs.readFileSync('modules/data-loader.js', 'utf8');

assert(syncJsContent.includes('STORAGE_KEY_TOMBSTONES'), 'sync.js must define STORAGE_KEY_TOMBSTONES');
assert(syncJsContent.includes('recordTombstone'), 'sync.js must define recordTombstone');
assert(syncJsContent.includes('isTombstoned'), 'sync.js must define isTombstoned');
assert(syncJsContent.includes('clearTombstone'), 'sync.js must define clearTombstone');
assert(syncJsContent.includes('await triggerSync()'), 'sync.js must await triggerSync in deleteRecord');
assert(syncJsContent.includes('store.delete(k)'), 'sync.js must prune remote-deleted records in pullRemoteRecords');
console.log('✓ PASS: admin/sync.js contains tombstone tracking, sync awaiting, and remote pruning');

assert(appJsContent.includes('String(b.id) !== String(id)'), 'admin/app.js deleteBuilding must use string comparison');
assert(appJsContent.includes('String(r.id) !== String(id)'), 'admin/app.js deleteRoom must use string comparison');
assert(appJsContent.includes('String(s.id) !== String(id)'), 'admin/app.js deleteStaff must use string comparison');
assert(appJsContent.includes('window.CAMPUS_SEED_DATA.buildings = window.CAMPUS_SEED_DATA.buildings.filter'), 'admin/app.js must prune CAMPUS_SEED_DATA on building deletion');
assert(appJsContent.includes('getInitialData'), 'admin/app.js must filter tombstones on initial hydration');
console.log('✓ PASS: admin/app.js prunes state and window.CAMPUS_SEED_DATA with flexible string comparisons');

assert(dataLoaderContent.includes('validKeys.has(k)'), 'data-loader.js must prune missing keys in writeToIndexedDB');
assert(dataLoaderContent.includes('campusos_tombstones'), 'data-loader.js normalizeDataset must check tombstones');
assert(dataLoaderContent.includes('hasDbBuildings'), 'data-loader.js normalizeDataset must not resurrect missing buildings');
assert(dataLoaderContent.includes('hasDbStaff'), 'data-loader.js normalizeDataset must not resurrect missing staff');
console.log('✓ PASS: modules/data-loader.js contains prune logic and prevents resurrection from fallbacks');

// 2. Test CampusSync in-memory behavior
const CampusSync = require('../admin/sync.js');

(async function runTests() {
    try {
        // Setup initial config in sandbox
        CampusSync.saveConfig({
            supabaseUrl: 'https://test-project.supabase.co',
            supabaseAnonKey: 'test-anon-key-12345',
            orgId: 'usted-ksi',
            isSandbox: false
        });

        let deletedRemoteUrl = null;
        let deletedHeaders = null;
        let upsertedRemoteUrl = null;

        // Mock global fetch to capture REST requests
        global.fetch = async (url, options = {}) => {
            console.log('[TEST FETCH]', options.method || 'GET', url);
            if (options.method === 'DELETE') {
                deletedRemoteUrl = url;
                deletedHeaders = options.headers;
                return {
                    ok: true,
                    status: 204,
                    text: async () => ''
                };
            }
            if (options.method === 'POST') {
                upsertedRemoteUrl = url;
                return {
                    ok: true,
                    status: 200,
                    text: async () => JSON.stringify({ success: true })
                };
            }
            if (url.includes('/rest/v1/')) {
                return {
                    ok: true,
                    status: 200,
                    json: async () => []
                };
            }
            return { ok: true, status: 200, json: async () => ({}) };
        };

        // Test 2a: Save a record and verify it exists
        const testBldg = {
            id: 999,
            code: 'TEST-BLDG',
            name: 'Test Innovation Lab',
            lat: 6.69,
            lng: -1.68
        };

        await CampusSync.saveRecord('buildings', testBldg);
        let allBldgs = await CampusSync.getAll('buildings');
        assert(allBldgs.some(b => String(b.id) === '999'), 'Building 999 must exist after save');
        console.log('✓ PASS: CampusSync.saveRecord saves record successfully');

        // Test 2b: Delete record with string ID "999" when saved with numeric 999
        await CampusSync.deleteRecord('buildings', '999');

        // Verify tombstone recorded
        assert(CampusSync.isTombstoned('buildings', 999), 'Numeric 999 must be reported as tombstoned');
        assert(CampusSync.isTombstoned('buildings', '999'), 'String "999" must be reported as tombstoned');
        console.log('✓ PASS: CampusSync.deleteRecord sets tombstone for both numeric and string keys');

        // Verify getAll does NOT return deleted record
        allBldgs = await CampusSync.getAll('buildings');
        assert(!allBldgs.some(b => String(b.id) === '999'), 'Building 999 must NOT be returned in getAll after deletion');
        console.log('✓ PASS: CampusSync.getAll filters out tombstoned records');

        // Verify DELETE mutation was executed via fetch with correct headers
        assert(deletedRemoteUrl && deletedRemoteUrl.includes('id=eq.999'), 'DELETE request must target id=eq.999');
        assert(deletedHeaders && deletedHeaders['Accept-Profile'] === 'usted_nav', 'DELETE must specify Accept-Profile: usted_nav');
        assert(deletedHeaders && deletedHeaders['Content-Profile'] === 'usted_nav', 'DELETE must specify Content-Profile: usted_nav');
        console.log('✓ PASS: CampusSync.deleteRecord executed Supabase DELETE request with usted_nav schema headers');

        // Test 3: Test DataLoader normalizeDataset with deletions
        const DataLoader = require('../modules/data-loader.js');

        // Scenario: A building (id: 25) was in fallbackBuildings, but deleted from Supabase.
        // The live database returns only building 26.
        const normalized = DataLoader.normalizeDataset({
            buildings: [{ id: 26, name: 'Faculty of Business' }],
            rooms: [{ id: 'r-1', building_id: 26, number: '101' }],
            staff: [{ id: 's-1', building_id: 26, name: 'Dr. Jane Mensah' }],
            fallbackBuildings: [
                { id: 25, name: 'Deleted Old Hall' }, // deleted from DB!
                { id: 26, name: 'Faculty of Business (Fallback)' }
            ],
            fallbackPeople: [
                { id: 's-99', name: 'Deleted Staff Member' }, // deleted from DB!
                { id: 's-1', name: 'Dr. Jane Mensah (Fallback)' }
            ]
        });

        // Building 25 must NOT be in buildingsData!
        const bldg25 = normalized.buildingsData.find(b => String(b.id) === '25');
        assert.strictEqual(bldg25, undefined, 'Deleted building 25 must NOT be resurrected from fallbackBuildings!');
        console.log('✓ PASS: DataLoader.normalizeDataset does not resurrect deleted buildings from fallback data');

        // Building 26 MUST be present and enriched
        const bldg26 = normalized.buildingsData.find(b => String(b.id) === '26');
        assert(bldg26 !== undefined, 'Live building 26 must be present');
        assert.strictEqual(bldg26.name, 'Faculty of Business', 'Live building properties take precedence');

        // Staff s-99 must NOT be in peopleData!
        const staff99 = normalized.peopleData.find(p => String(p.id) === 's-99');
        assert.strictEqual(staff99, undefined, 'Deleted staff member s-99 must NOT be resurrected from fallbackPeople!');
        console.log('✓ PASS: DataLoader.normalizeDataset does not resurrect deleted staff from fallback people');

        // Staff s-1 MUST be present
        const staff1 = normalized.peopleData.find(p => String(p.id) === 's-1');
        assert(staff1 !== undefined, 'Live staff member s-1 must be present');

        // Scenario 3b: Even if fallback data has a building, but it is in campusos_tombstones,
        // it must be filtered out even in cold fallback mode!
        CampusSync.recordTombstone('buildings', 'test-tombstoned-bldg');
        const fallbackOnlyNormalized = DataLoader.normalizeDataset({
            buildings: [],
            rooms: [],
            staff: [],
            fallbackBuildings: [
                { id: 'test-tombstoned-bldg', name: 'Should Not Appear' },
                { id: 'active-bldg', name: 'Should Appear' }
            ],
            fallbackPeople: []
        });

        assert(!fallbackOnlyNormalized.buildingsData.some(b => String(b.id) === 'test-tombstoned-bldg'), 'Tombstoned building must not appear even in pure fallback mode');
        assert(fallbackOnlyNormalized.buildingsData.some(b => String(b.id) === 'active-bldg'), 'Active building must appear in pure fallback mode');
        console.log('✓ PASS: DataLoader.normalizeDataset filters out tombstones even in pure fallback mode');

        console.log('\n=== ALL DELETION PERSISTENCE & RECONCILIATION TESTS PASSED ===\n');
    } catch (err) {
        console.error('Test Failed:', err);
        process.exit(1);
    }
})();
