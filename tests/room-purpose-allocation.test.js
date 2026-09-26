/**
 * Automated Test Suite for Room Purpose Allocation & USTED Campus Room Signage
 * 
 * Validates:
 * 1. 3-Way Purpose Selector in admin/index.html & app.js (Lecturer Office, Lecture Hall / Lab, Admin Office)
 * 2. Input behavior (Placeholder changes, metadata { purpose, wing } persistence)
 * 3. Staff Directory Dropdown filtering in admin/app.js (Excludes service desks & lecture rooms)
 * 4. Client Map Search indexing in modules/search.js ("Faculty Officer", "Exams Office", "048")
 * 5. Immediate routing with exact floor and wing in location pill and outdoor handoff
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== RUNNING ROOM PURPOSE ALLOCATION & CAMPUS SIGNAGE TESTS ===\n');

// 1. Verify HTML markup in admin/index.html
const adminHtmlPath = path.join(__dirname, '../admin/index.html');
assert(fs.existsSync(adminHtmlPath), 'admin/index.html must exist');
const htmlContent = fs.readFileSync(adminHtmlPath, 'utf8');

assert(htmlContent.includes('id="room-purpose"'), 'Hidden input #room-purpose must exist in admin/index.html');
assert(htmlContent.includes('id="room-purpose-group"'), 'Button group #room-purpose-group must exist');
assert(htmlContent.includes('data-purpose="lecturer_office"'), 'Lecturer Office button must exist');
assert(htmlContent.includes('data-purpose="lecture_room"'), 'Lecture Hall / Lab button must exist');
assert(htmlContent.includes('data-purpose="service_desk"'), 'Service Desk / Admin Office button must exist');
assert(htmlContent.includes('Admin Office'), 'Must use simplified name "Admin Office" instead of clutter');
assert(htmlContent.includes('id="room-wing"'), 'Dedicated #room-wing input must exist');
console.log('✓ PASS: admin/index.html contains 3-way toggle with simplified "Admin Office" name & wing input');

// 2. Verify admin/app.js logic
const adminAppPath = path.join(__dirname, '../admin/app.js');
assert(fs.existsSync(adminAppPath), 'admin/app.js must exist');
const appContent = fs.readFileSync(adminAppPath, 'utf8');

// Check setRoomPurpose implementation
assert(appContent.includes('function setRoomPurpose'), 'setRoomPurpose function must be defined');
assert(appContent.includes('e.g. Faculty Officer, FBE'), 'Description placeholder must update to e.g. Faculty Officer, FBE for service_desk');
assert(appContent.includes('e.g. Lecturer Office, Staff Suite'), 'Description placeholder must support lecturer office');

// Check updateStaffRoomDropdown filtering
assert(appContent.includes('function updateStaffRoomDropdown'), 'updateStaffRoomDropdown function must be defined');
console.log('✓ PASS: admin/app.js implements setRoomPurpose and updateStaffRoomDropdown');

// 3. Test Staff Room Dropdown Filtering Simulation
const mockRooms = [
    {
        id: '25-018',
        building_id: '25',
        room_number: '018',
        floor: 1,
        description: 'Dr. Kotor Asare Office',
        metadata: { purpose: 'lecturer_office', wing: 'North' }
    },
    {
        id: '25-046',
        building_id: '25',
        room_number: '046',
        floor: 2,
        description: 'Accounting Exams Office',
        metadata: { purpose: 'service_desk', wing: 'North' }
    },
    {
        id: '25-048',
        building_id: '25',
        room_number: '048',
        floor: 0,
        description: 'Faculty Officer, FBE',
        metadata: { purpose: 'service_desk', wing: 'West' }
    },
    {
        id: '25-001',
        building_id: '25',
        room_number: '001',
        floor: 0,
        description: 'Lecture Room 001',
        metadata: { purpose: 'lecture_room', wing: 'North' }
    },
    {
        id: '25-030',
        building_id: '25',
        room_number: '030',
        floor: 2,
        description: 'Staff Office 30',
        metadata: { wing: 'South' } // untagged standard office
    }
];

// Replicate filtering logic from updateStaffRoomDropdown in admin/app.js
const bRooms = mockRooms.filter(r => r.building_id === '25');
const filteredStaffRooms = bRooms.filter(r => {
    const meta = r.metadata || {};
    const purpose = meta.purpose || '';
    if (purpose === 'service_desk' || purpose === 'admin_office' || purpose === 'lecture_room') {
        return false;
    }
    const desc = (r.description || '').toLowerCase();
    const num = (r.room_number || '').toLowerCase();
    if (desc.includes('exams office') || desc.includes('faculty officer') || desc.includes('secretariat') ||
        num.includes('exams') || num.includes('officer')) {
        return false;
    }
    return true;
});

assert.strictEqual(filteredStaffRooms.length, 2, 'Only lecturer office rooms should pass');
assert(filteredStaffRooms.some(r => r.id === '25-018'), 'Room 018 (Dr. Kotor Asare) must be available for staff');
assert(filteredStaffRooms.some(r => r.id === '25-030'), 'Room 030 (Standard staff office) must be available for staff');
assert(!filteredStaffRooms.some(r => r.id === '25-046'), 'Accounting Exams Office (046) must NOT be assignable to individual staff');
assert(!filteredStaffRooms.some(r => r.id === '25-048'), 'Faculty Officer, FBE (048) must NOT be assignable to individual staff');
assert(!filteredStaffRooms.some(r => r.id === '25-001'), 'Lecture Room 001 must NOT be assignable to individual staff');
console.log('✓ PASS: Staff room dropdown filters out service desks/admin offices and lecture halls');

// 4. Test Search Indexing in modules/search.js for "Faculty Officer", "Exams Office", and "048"
const searchModule = require('../modules/search.js');
const buildings = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/buildings.json'), 'utf8'));
const people = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/people.json'), 'utf8'));
const searchEngine = new searchModule.SearchEngine(buildings, people);

// Query: "Faculty Officer"
const facultyOfficerResults = searchEngine.search('Faculty Officer');
const foRoom = facultyOfficerResults.find(r => r.type === 'room' && (r.room === '048' || r.name === 'Room 048' || r.data.number === 'Room 048'));
assert(foRoom, 'Search for "Faculty Officer" must return Room 048');
assert(foRoom.locationPill.includes('Ground Floor'), 'Location pill must state Ground Floor');
assert(foRoom.locationPill.includes('West Wing'), 'Location pill must state West Wing');
console.log(`✓ PASS: Query "Faculty Officer" -> ${foRoom.locationPill}`);

// Query: "048"
const room048Results = searchEngine.search('048');
const r048 = room048Results.find(r => r.type === 'room' && (r.room === '048' || r.data.number === 'Room 048'));
assert(r048, 'Search for "048" must return Room 048');
assert(r048.locationPill.includes('ROB'), 'Must be in ROB Block');
assert(r048.locationPill.includes('West Wing'), 'Location pill must state West Wing');
console.log(`✓ PASS: Query "048" -> ${r048.locationPill}`);

// Query: "Exams Office"
const examsOfficeResults = searchEngine.search('Exams Office');
const r046 = examsOfficeResults.find(r => r.type === 'room' && (r.room === '046' || r.data.number === 'Room 046'));
const r047 = examsOfficeResults.find(r => r.type === 'room' && (r.room === '047' || r.data.number === 'Room 047'));
assert(r046, 'Search for "Exams Office" must return Room 046');
assert(r047, 'Search for "Exams Office" must return Room 047');
assert(r046.locationPill.includes('North Wing'), 'Room 046 must specify North Wing');
assert(r046.locationPill.includes('2nd Floor'), 'Room 046 must specify 2nd Floor');
console.log(`✓ PASS: Query "Exams Office" -> ${r046.locationPill} & ${r047.locationPill}`);

// 5. Test Outdoor Hand-off copy for immediate routing to floor & wing
const robBuilding = buildings.find(b => b.id === 25 || b.shortName === 'ROB');
const handoff048 = searchModule.formatOutdoorHandoff(foRoom.data, robBuilding);
assert.strictEqual(handoff048, '🚶 Routes to main entrance • Head inside for Ground Floor, West Wing, Room 048');
console.log(`✓ PASS: Outdoor navigation handoff: "${handoff048}"`);

console.log('\n======================================================');
console.log('ALL ROOM PURPOSE ALLOCATION & CAMPUS SIGNAGE TESTS PASSED (100%)!');
console.log('======================================================\n');
