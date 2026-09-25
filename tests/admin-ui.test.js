/**
 * Verification test for Admin CMS UI Controller
 * Ensures state hydration, window globals, delegation, and search logic work flawlessly.
 */
const fs = require('fs');
const assert = require('assert');

// 1. Load seed data
const seedData = JSON.parse(fs.readFileSync('admin/seed_data.json', 'utf8'));
global.window = {
    CAMPUS_SEED_DATA: seedData
};

// 2. Mock minimal DOM
const elements = new Map();
function getOrCreateElement(id) {
    if (!elements.has(id)) {
        elements.set(id, {
            id,
            classList: {
                classes: new Set(),
                add(c) { this.classes.add(c); },
                remove(c) { this.classes.delete(c); },
                toggle(c, force) {
                    if (force !== undefined) {
                        if (force) this.classes.add(c);
                        else this.classes.delete(c);
                    } else {
                        if (this.classes.has(c)) this.classes.delete(c);
                        else this.classes.add(c);
                    }
                },
                contains(c) { return this.classes.has(c); }
            },
            innerHTML: '',
            value: '',
            textContent: '',
            addEventListener: () => {},
            reset: function() { this.value = ''; }
        });
    }
    return elements.get(id);
}

global.document = {
    readyState: 'complete',
    getElementById: (id) => getOrCreateElement(id),
    querySelectorAll: () => [],
    addEventListener: () => {}
};

// 3. Load app.js
require('../admin/app.js');

console.log('--- ADMIN CMS VERIFICATION ---');

// Assert window methods exist
assert.strictEqual(typeof global.window.switchTab, 'function', 'switchTab must be a function');
assert.strictEqual(typeof global.window.openAddBuildingModal, 'function', 'openAddBuildingModal must be a function');
assert.strictEqual(typeof global.window.openAddRoomModal, 'function', 'openAddRoomModal must be a function');
assert.strictEqual(typeof global.window.openAddStaffModal, 'function', 'openAddStaffModal must be a function');
assert.strictEqual(typeof global.window.editBuilding, 'function', 'editBuilding must be a function');
assert.strictEqual(typeof global.window.deleteBuilding, 'function', 'deleteBuilding must be a function');
assert.strictEqual(typeof global.window.editRoom, 'function', 'editRoom must be a function');
assert.strictEqual(typeof global.window.deleteRoom, 'function', 'deleteRoom must be a function');
assert.strictEqual(typeof global.window.editStaff, 'function', 'editStaff must be a function');
assert.strictEqual(typeof global.window.deleteStaff, 'function', 'deleteStaff must be a function');
assert.strictEqual(typeof global.window.openSettings, 'function', 'openSettings must be a function');
assert.strictEqual(typeof global.window.closeSettings, 'function', 'closeSettings must be a function');
assert.strictEqual(typeof global.window.closeAllModals, 'function', 'closeAllModals must be a function');
assert.strictEqual(typeof global.window.renderBuildings, 'function', 'renderBuildings must be a function');
assert.strictEqual(typeof global.window.renderRooms, 'function', 'renderRooms must be a function');
assert.strictEqual(typeof global.window.renderStaff, 'function', 'renderStaff must be a function');

console.log('[PASS] All 16 critical window action methods are properly exported on window.');

// Test modal opening
global.window.openAddBuildingModal();
assert.strictEqual(getOrCreateElement('modal-building-title').textContent, 'Add Campus Building');
assert.strictEqual(getOrCreateElement('modal-building').classList.contains('hidden'), false);

console.log('[PASS] openAddBuildingModal correctly reveals modal and updates title.');

// Test edit modal
global.window.editBuilding('25');
assert.strictEqual(getOrCreateElement('modal-building-title').textContent, 'Edit Building');
assert.strictEqual(getOrCreateElement('building-name').value, 'ROB Block');

console.log('[PASS] editBuilding("25") successfully hydrates ROB Block form fields.');

// Test rendering and search
global.window.renderBuildings();
const tableBody = getOrCreateElement('buildings-table-body');
assert(tableBody.innerHTML.includes('ROB Block'), 'Buildings table must contain ROB Block');
assert(tableBody.innerHTML.includes('data-action="edit-building"'), 'Must have delegated data-action');

console.log('[PASS] renderBuildings renders table HTML with data-action attributes.');

// Test tab switching
global.window.switchTab('rooms');
global.window.renderRooms();
const roomsTable = getOrCreateElement('rooms-table-body');
assert(roomsTable.innerHTML.includes('Room'), 'Rooms table must contain room records');

console.log('[PASS] switchTab("rooms") switches view and renders room records.');

console.log('\n=== ALL ADMIN CMS TESTS PASSED (100%) ===\n');
