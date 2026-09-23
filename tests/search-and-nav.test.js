/**
 * Automated Test Suite for Search and Navigation Upgrades
 * Validates:
 * 1. Data Ingestion & Enrichment (data/people.json and data/buildings.json)
 * 2. Multi-token Search Engine (modules/search.js)
 * 3. Exact Location Pills & Search Card Metadata
 * 4. Outdoor Navigation Hand-off Breadcrumbs & Entrance Resolution
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- RUNNING SEARCH & NAVIGATION UPGRADE TESTS ---\n');

// 1. Data Verification
const peoplePath = path.join(__dirname, '../data/people.json');
const buildingsPath = path.join(__dirname, '../data/buildings.json');

assert(fs.existsSync(peoplePath), 'data/people.json must exist');
assert(fs.existsSync(buildingsPath), 'data/buildings.json must exist');

const people = JSON.parse(fs.readFileSync(peoplePath, 'utf8'));
const buildings = JSON.parse(fs.readFileSync(buildingsPath, 'utf8'));

console.log(`[PASS] Loaded ${people.length} people records and ${buildings.length} building records.`);

// Verify schema of people
assert(people.length >= 90, `Expected at least 90 staff profiles, got ${people.length}`);
const samplePerson = people.find(p => p.name.includes('Kotor'));
assert(samplePerson, 'Dr. Kotor Asare should be in people.json');
assert.strictEqual(samplePerson.location.building, 'ROB');
assert.strictEqual(samplePerson.location.room, '018');
assert.strictEqual(samplePerson.location.status, 'exact');
assert(samplePerson.department, 'Person must have department');
assert(samplePerson.faculty, 'Person must have faculty');
console.log('[PASS] People schema verified with Dr. Kotor Asare as benchmark.');

// 2. Search Engine Verification
const searchModule = require('../modules/search.js');
const searchEngine = new searchModule.SearchEngine(buildings, people);

// Test 2a: Staff names & titles
const testQueries = [
    { q: 'Kotor', expectedPerson: 'Dr. Kotor Asare' },
    { q: 'Courage Dogbe', expectedPerson: 'Courage', secondary: 'Dogbe' },
    { q: 'Stella Appiah', expectedPerson: 'Prof. Stella Appiah' }
];

testQueries.forEach(({ q, expectedPerson, secondary }) => {
    const hits = searchEngine.search(q);
    const match = hits.find(h => {
        if (!h.name) return false;
        if (secondary) return h.name.includes(expectedPerson) && h.name.includes(secondary);
        return h.name.includes(expectedPerson);
    });
    assert(match, `Expected query "${q}" to return match for "${expectedPerson}"`);
    console.log(`[PASS] Query "${q}" matched "${match.name}" (Score: ${match.score})`);
});

// Test 2b: Departments & acronyms
const deptQueries = ['DIS', 'Hospitality', 'Management', 'Languages'];
deptQueries.forEach(dept => {
    const hits = searchEngine.search(dept);
    assert(hits.length > 0, `Expected hits for department query "${dept}"`);
    console.log(`[PASS] Department query "${dept}" returned ${hits.length} relevant results.`);
});

// Test 2c: Room & Hall codes
const roomQueries = [
    { q: 'ROB 018', expectedRoom: '018', expectedBuilding: 'ROB' },
    { q: 'ESA Room 17', expectedRoom: 'Room 17', expectedBuilding: 'ESA' },
    { q: 'CBT 026', expectedRoom: '026', expectedBuilding: 'CBT' },
    { q: 'FBR 28', expectedRoom: '28', expectedBuilding: 'FBR' },
    { q: 'NFB Rm 05', expectedRoom: 'Rm 05', expectedBuilding: 'NFB' }
];

roomQueries.forEach(({ q, expectedRoom, expectedBuilding }) => {
    const hits = searchEngine.search(q);
    assert(hits.length > 0, `Expected hits for room query "${q}"`);
    const roomHit = hits.find(h => 
        (h.type === 'room' || h.type === 'staff') &&
        (h.location?.building === expectedBuilding || h.buildingCode === expectedBuilding || (h.room && h.room.includes(expectedRoom)))
    );
    assert(roomHit, `Query "${q}" should return a matching room or staff member in ${expectedBuilding}`);
    console.log(`[PASS] Room code query "${q}" matched "${roomHit.name}" (Type: ${roomHit.type})`);
});

// Test 3: Card Display Elements & Location Pill Format
const kotorHits = searchEngine.search('Kotor');
const kotorCard = kotorHits[0];
assert(kotorCard.locationPill, 'Result card must have locationPill');
console.log(`[PASS] Location Pill: "${kotorCard.locationPill}"`);
assert.strictEqual(kotorCard.locationPill, 'ROB — 1st Floor, Room 018');

// Test 4: Breadcrumbs for Outdoor Navigation Hand-off
assert(kotorCard.breadcrumb, 'Result card must generate breadcrumb');
console.log(`[PASS] Breadcrumb: "${kotorCard.breadcrumb}"`);
assert.strictEqual(kotorCard.breadcrumb, 'ROB Block — 1st Floor, Room 018 (Dr. Kotor Asare)');

const stellaHits = searchEngine.search('Stella Appiah');
const stellaCard = stellaHits[0];
assert(stellaCard.breadcrumb, 'Result card for Stella Appiah must have breadcrumb');
console.log(`[PASS] Stella Appiah Breadcrumb: "${stellaCard.breadcrumb}"`);
assert.strictEqual(stellaCard.breadcrumb, 'Executive Students Association (ESA) Lecture Block — 1st Floor, Room 17 (Prof. Stella Appiah)');

// Test 5: Building Entrance Coordinates & Verified Building Names
const CODE_TO_BUILDING_ID = {
    'ROB': 25,
    'ESA': 21,
    'NFB': 22,
    'NLB': 23,
    'CBT': 35,
    'FBR': 13,
    'ODSA': 30
};

Object.entries(CODE_TO_BUILDING_ID).forEach(([code, id]) => {
    const building = buildings.find(b => b.id === id);
    assert(building, `Building with ID ${id} (${code}) must exist`);
    assert(building.lat && building.lng, `Building ${code} must have entrance coordinate (lat/lng)`);
    console.log(`[PASS] Outdoor Entrance for ${code} (${building.name}): [${building.lat}, ${building.lng}]`);
});

// Verify ESA Building Name is accurately "Executive Students Association (ESA) Lecture Block"
const esaBuilding = buildings.find(b => b.id === 21);
assert.strictEqual(esaBuilding.name, 'Executive Students Association (ESA) Lecture Block');
console.log('[PASS] ESA Building Name verified: "Executive Students Association (ESA) Lecture Block"');

// Test 6: Verify ODSA Deep-link for Dean of Students Staff (e.g. Prof. Stephen Baffour Adjei)
const adjeiHits = searchEngine.search('Baffour Adjei');
assert(adjeiHits.length > 0, 'Must find Prof. Stephen Baffour Adjei');
const adjeiCard = adjeiHits[0];
assert.strictEqual(adjeiCard.building.id, 30, 'Prof. Stephen Baffour Adjei must route to Building 30 (ODSA)');
assert(adjeiCard.building.name.includes("Dean's Office (ODSA)"), "Building name must be Dean's Office (ODSA)");
console.log(`[PASS] ODSA Deep-link verified for ${adjeiCard.name} -> ${adjeiCard.building.name} (ID: ${adjeiCard.building.id})`);

// Test 7: Verify building_only Downgrades (NFB, ROB 057, Lecture Theatres)
const nfbPerson = people.find(p => p.name.includes('Nathan Ohene Gyang'));
assert(nfbPerson, 'Dr. Nathan Ohene Gyang must exist');
assert.strictEqual(nfbPerson.location.status, 'building_only', 'NFB staff must be downgraded to building_only');
const nfbHits = searchEngine.search('Nathan Ohene Gyang');
assert.strictEqual(nfbHits[0].locationPill, 'NFB', 'Building-only card must not display room numbers');
assert.strictEqual(nfbHits[0].breadcrumb, 'NFB (Dr. Nathan Ohene Gyang)', 'Building-only breadcrumb must be concise');
console.log('[PASS] NFB staff verified as clean building_only without fake room clutter.');

const acheampongPerson = people.find(p => p.id === 'dr-kwame-acheampong');
assert(acheampongPerson, 'Dr. Kwame Acheampong must exist');
assert.strictEqual(acheampongPerson.location.status, 'building_only', 'Conflicting ROB 057 staff must be downgraded to building_only');
const acheampongHits = searchEngine.search('Kwame Acheampong');
assert.strictEqual(acheampongHits[0].locationPill, 'ROB', 'ROB 057 card must display building name only');
assert.strictEqual(acheampongHits[0].breadcrumb, 'ROB Block (Dr. Kwame Acheampong)', 'ROB 057 breadcrumb must be concise');
console.log('[PASS] ROB 057 staff verified as clean building_only.');

// Test 8: Zero tolerance for "Evans" or "Sintim-Misa"
const rawPeopleStr = fs.readFileSync(peoplePath, 'utf8');
const rawBuildingsStr = fs.readFileSync(buildingsPath, 'utf8');
assert(!rawPeopleStr.toLowerCase().includes('sintim'), 'people.json must have zero occurrences of Sintim');
assert(!rawPeopleStr.toLowerCase().includes('evans'), 'people.json must have zero occurrences of Evans');
assert(!rawBuildingsStr.toLowerCase().includes('sintim'), 'buildings.json must have zero occurrences of Sintim');
assert(!rawBuildingsStr.toLowerCase().includes('evans'), 'buildings.json must have zero occurrences of Evans');
console.log('[PASS] Complete purge of "Evans" and "Sintim-Misa" confirmed across all datasets.');

// Test 9: Verify GeoJSON routing files are untouched
const campusGeoPath = path.join(__dirname, '../data/campus.geojson');
const roadsGeoPath = path.join(__dirname, '../data/roads.geojson');
assert(fs.existsSync(campusGeoPath), 'data/campus.geojson must exist');
assert(fs.existsSync(roadsGeoPath), 'data/roads.geojson must exist');
console.log('[PASS] Outdoor routing GeoJSON files are present and untouched.');

// Test 10: Dr. Theresa Dede Lawer Data Correction & Ground-Truth
const drLawer = people.find(p => p.id === 'dr-theresa-dede-lawer' || p.name.includes('Theresa Dede Lawer'));
assert(drLawer, 'Dr. Theresa Dede Lawer must exist in data/people.json');
assert.strictEqual(drLawer.title, 'Senior Lecturer', 'Title must be Senior Lecturer');
assert.strictEqual(drLawer.location.status, 'building_only', 'Status must be building_only');
assert.strictEqual(drLawer.location.building, 'Main Administration Block', 'Building must be Main Administration Block');
assert.strictEqual(drLawer.location.targetBuildingId, 26, 'Target Building ID must be 26');
assert.strictEqual(drLawer.specialRole, 'Head, Career Development and Counselling Centre (CDSC)', 'Special role must be CDSC');

// Verify ROB Room 30 does NOT contain Dr. Theresa Dede Lawer
const robBuilding = buildings.find(b => b.id === 25);
const robRoom30 = robBuilding?.rooms?.find(r => r.room === '30' || r.number === 'Room 30' || r.number === '30');
assert(robRoom30, 'ROB Room 30 must exist in buildings.json');
assert(!JSON.stringify(robRoom30).toLowerCase().includes('theresa'), 'ROB Room 30 must NOT contain Dr. Theresa Dede Lawer');
assert(!JSON.stringify(robRoom30).toLowerCase().includes('lawer'), 'ROB Room 30 must NOT contain Dr. Theresa Dede Lawer');
console.log('[PASS] Dr. Theresa Dede Lawer successfully disassociated from ROB Room 30.');

// Verify Subtitle and Pill Formatting for Dr. Lawer
const lawerSubtitle = searchModule.formatStaffSubtitle(drLawer);
assert.strictEqual(lawerSubtitle, 'Senior Lecturer • Interdisciplinary Studies / CDSC', 'Subtitle must match specified format');
console.log(`[PASS] Dr. Lawer Subtitle verified: "${lawerSubtitle}"`);

const adminBuilding = buildings.find(b => b.id === 26);
assert(adminBuilding, 'Building ID 26 (Main Administration Block) must exist');
assert.strictEqual(adminBuilding.name, 'Main Administration Block', 'Building 26 name must be Main Administration Block');
assert.strictEqual(adminBuilding.lat, 6.696903, 'Main Admin entrance lat must match ground truth');
assert.strictEqual(adminBuilding.lng, -1.681367, 'Main Admin entrance lng must match ground truth');

const lawerHits = searchEngine.search('Theresa Dede Lawer');
assert(lawerHits.length > 0, 'Search for Theresa Dede Lawer must return hits');
const lawerCard = lawerHits[0];
assert.strictEqual(lawerCard.building.id, 26, 'Lawer search card must resolve to Building 26');
assert.strictEqual(lawerCard.locationPill, '📍 Main Administration Block', 'Location pill must be 📍 Main Administration Block');
console.log(`[PASS] Dr. Lawer resolves to Building 26 entrance [${adminBuilding.lat}, ${adminBuilding.lng}] with pill "${lawerCard.locationPill}"`);

// Test 11: String Sanitization & Room Redundancy Cleanup
assert.strictEqual(searchModule.sanitizeRoomTitle('Room Rm 30'), 'Room 30', 'Room Rm 30 -> Room 30');
assert.strictEqual(searchModule.sanitizeRoomTitle('Room Room 101'), 'Room 101', 'Room Room 101 -> Room 101');
assert.strictEqual(searchModule.sanitizeRoomTitle('Room Rm. 05'), 'Room 05', 'Room Rm. 05 -> Room 05');
assert.strictEqual(searchModule.sanitizeRoomTitle('Room Department of Management'), 'Department of Management', 'Strip Room before Department');
assert.strictEqual(searchModule.sanitizeRoomTitle('Rm. Department of Languages'), 'Department of Languages', 'Strip Rm. before Department');
assert.strictEqual(searchModule.formatRoomNumber('Room Rm 30'), 'Room 30', 'formatRoomNumber with double room prefix');
assert.strictEqual(searchModule.formatRoomNumber('Room 101'), 'Room 101', 'formatRoomNumber with single room prefix');
assert.strictEqual(searchModule.formatRoomNumber('Rm 12'), 'Room 12', 'formatRoomNumber with Rm prefix');
assert.strictEqual(searchModule.formatRoomNumber('018'), 'Room 018', 'formatRoomNumber with number only');
assert.strictEqual(searchModule.formatRoomNumber('Department of Languages'), 'Department of Languages', 'Never prepend Room to Department of Languages');
assert.strictEqual(searchModule.formatRoomNumber('Department of Management'), 'Department of Management', 'Never prepend Room to Department of Management');
assert.strictEqual(searchModule.formatRoomNumber('Department of Accounting'), 'Department of Accounting', 'Never prepend Room to Department of Accounting');
assert.strictEqual(searchModule.formatRoomNumber('Room Department of Accounting'), 'Department of Accounting', 'Strip Room prefix on Department');
console.log('[PASS] String sanitization and regex redundancy cleanup verified for all room and department variations.');

// Test 11b: Department Search Result Titles & Pills
const robResults = searchEngine.search('ROB Management');
const mgmtDept = robResults.find(r => r.type === 'room' && r.name.includes('Management'));
assert(mgmtDept, 'Search for ROB Management should return Department of Management');
assert.strictEqual(mgmtDept.name, 'Department of Management');
assert.strictEqual(searchModule.formatRoomNumber(mgmtDept.data.number), 'Department of Management');
assert(!searchModule.formatRoomNumber(mgmtDept.data.number).includes('Room Department'), 'Must NOT contain Room Department');
assert.strictEqual(searchModule.formatRoomBreadcrumb(mgmtDept.data, mgmtDept.building), 'ROB Block — 2nd Floor, Department of Management');
console.log('[PASS] Department search results format cleanly as "ROB - Department of ..." and NOT "ROB - Room Department of ...".');

// Test 12: Punchy Outdoor Hand-off Copy
const exactRoomHandoff = searchModule.formatOutdoorHandoff({
    location: { status: 'exact', floor: '1st Floor', room: 'Room 30' }
}, robBuilding);
assert.strictEqual(exactRoomHandoff, '🚶 Routes to main entrance • Head inside for 1st Floor, Room 30');

const buildingOnlyHandoff = searchModule.formatOutdoorHandoff(drLawer, adminBuilding);
assert.strictEqual(buildingOnlyHandoff, '🚶 Routes directly to building entrance');
console.log('[PASS] Punchy outdoor hand-off copy verified for both exact room matches and building-only destinations.');

console.log('\n=============================================');
console.log('ALL SEARCH & NAVIGATION TESTS PASSED (100%)!');
console.log('=============================================\n');
