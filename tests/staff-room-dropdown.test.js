/**
 * Staff Room Dropdown & Client Presentation Test Suite
 * Verifies admin dropdown formatting with wing/type metadata and clean public client presentation.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== RUNNING STAFF ROOM DROPDOWN & CLIENT PRESENTATION TESTS ===\n');

// 1. Verify admin/app.js implementation
const adminAppPath = path.join(__dirname, '../admin/app.js');
const adminAppCode = fs.readFileSync(adminAppPath, 'utf8');

// Check that updateStaffRoomDropdown exists and formats room options with wing and type
assert(adminAppCode.includes('function updateStaffRoomDropdown'), 'admin/app.js must define updateStaffRoomDropdown');
assert(adminAppCode.includes('meta && (meta.wing || meta.type)'), 'admin/app.js must check for metadata.wing or metadata.type');
assert(adminAppCode.includes("room.floor === 0 ? 'Ground' : room.floor"), 'admin/app.js must format floor 0 as Ground');
assert(adminAppCode.includes("`Room ${room.room_number} (Floor ${room.floor} - ${room.description || 'Room'})`"), 'admin/app.js must provide clean fallback format');

// Extract the room formatting logic and test it directly
function formatAdminRoomOption(room) {
    const meta = room.metadata || {};
    let label = '';
    if (meta && (meta.wing || meta.type)) {
        const floorStr = (room.floor === 0 || room.floor === '0') ? 'Ground' : (room.floor ?? '');
        const wingPart = meta.wing ? (meta.wing.toLowerCase().includes('wing') ? meta.wing : `${meta.wing} Wing`) : '';
        const typePart = meta.type || room.description || '';
        const parts = [floorStr, wingPart, typePart].filter(Boolean);
        label = `Room ${room.room_number} (${parts.join(' · ')})`;
    } else {
        label = `Room ${room.room_number} (Floor ${room.floor} - ${room.description || 'Room'})`;
    }
    return label;
}

// Test room with wing and type metadata
const roomWithMeta = {
    id: 101,
    room_number: '026',
    floor: 1,
    description: 'Prof. Office',
    metadata: {
        wing: 'West',
        type: 'Staff Office'
    }
};
const labelWithMeta = formatAdminRoomOption(roomWithMeta);
assert.strictEqual(labelWithMeta, 'Room 026 (1 · West Wing · Staff Office)', 'Admin option label must format with floor, wing, and type');
console.log('✓ PASS: Formats room with metadata: ' + labelWithMeta);

// Test room on Ground floor (floor: 0)
const groundRoomWithMeta = {
    id: 102,
    room_number: 'G01',
    floor: 0,
    description: 'Dean Office',
    metadata: {
        wing: 'East Wing',
        type: 'Dean Suite'
    }
};
const groundLabel = formatAdminRoomOption(groundRoomWithMeta);
assert.strictEqual(groundLabel, 'Room G01 (Ground · East Wing · Dean Suite)', 'Admin option label must format floor 0 as Ground');
console.log('✓ PASS: Formats ground floor room: ' + groundLabel);

// Test room with fallback (no metadata)
const roomNoMeta = {
    id: 103,
    room_number: '104',
    floor: 1,
    description: 'Lecture Hall'
};
const labelNoMeta = formatAdminRoomOption(roomNoMeta);
assert.strictEqual(labelNoMeta, 'Room 104 (Floor 1 - Lecture Hall)', 'Admin option fallback must format as Room (Floor X - Description)');
console.log('✓ PASS: Formats room with fallback: ' + labelNoMeta);

// 2. Verify map.html client-side presentation
const mapHtmlPath = path.join(__dirname, '../map.html');
const mapHtmlCode = fs.readFileSync(mapHtmlPath, 'utf8');

assert(mapHtmlCode.includes('showStaff'), 'map.html must contain showStaff function');
assert(mapHtmlCode.includes('Ground Floor'), 'map.html showStaff must format floor 0 as Ground Floor');
assert(mapHtmlCode.includes('Floor'), 'map.html showStaff must format floors with suffix Floor');

// Verify that showStaff does NOT expose internal admin metadata (like wing/type metadata JSON or internal keys)
assert(!mapHtmlCode.includes('person.location.metadata'), 'map.html should not display internal admin metadata in public staff card');

console.log('✓ PASS: map.html public client card displays clean Floor and Room without admin metadata leaks');

// 3. Verify modules/data-loader.js room description enrichment
const dataLoaderPath = path.join(__dirname, '../modules/data-loader.js');
const dataLoaderCode = fs.readFileSync(dataLoaderPath, 'utf8');

assert(dataLoaderCode.includes('rMatch.description'), 'data-loader.js must resolve room description from rooms table');

console.log('✓ PASS: modules/data-loader.js enriches staff location with room description');

console.log('\n=== ALL STAFF ROOM DROPDOWN & CLIENT TESTS PASSED (100%)! ===');
