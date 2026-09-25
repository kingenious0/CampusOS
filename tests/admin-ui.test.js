/**
 * Verification test for Admin CMS UI Controller & Overlay Traps
 * Ensures state hydration, window globals, delegation, modal isolation, and overlay safety.
 */
const fs = require('fs');
const assert = require('assert');

// 1. Load seed data
const seedData = JSON.parse(fs.readFileSync('admin/seed_data.json', 'utf8'));
global.window = {
    CAMPUS_SEED_DATA: seedData
};

// 2. Mock minimal DOM with querySelector and event delegation support
const elements = new Map();
const documentListeners = {};

function getOrCreateElement(id) {
    if (!elements.has(id)) {
        elements.set(id, {
            id,
            classList: {
                classes: new Set(),
                add(...args) { args.forEach(c => this.classes.add(c)); },
                remove(...args) { args.forEach(c => this.classes.delete(c)); },
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
            reset: function() { this.value = ''; },
            querySelector: function(selector) {
                if (selector === '.modal-backdrop') {
                    return getOrCreateElement(`${this.id}-backdrop`);
                }
                return null;
            }
        });
    }
    return elements.get(id);
}

global.document = {
    readyState: 'complete',
    getElementById: (id) => getOrCreateElement(id),
    querySelectorAll: () => [],
    addEventListener: (event, cb) => {
        if (!documentListeners[event]) documentListeners[event] = [];
        documentListeners[event].push(cb);
    }
};

// 3. Load app.js
require('../admin/app.js');

console.log('--- ADMIN CMS VERIFICATION ---');

// Assert window methods exist
assert.strictEqual(typeof global.window.switchTab, 'function', 'switchTab must be a function');
assert.strictEqual(typeof global.window.openModal, 'function', 'openModal must be a function');
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

console.log('[PASS] All critical window action methods are properly exported on window.');

// Test modal opening & overlay pointer-events transitions
const modalBuilding = getOrCreateElement('modal-building');
const modalBuildingBackdrop = getOrCreateElement('modal-building-backdrop');

global.window.openAddBuildingModal();
assert.strictEqual(getOrCreateElement('modal-building-title').textContent, 'Add Campus Building');
assert.strictEqual(modalBuilding.classList.contains('hidden'), false, 'Modal must not be hidden when open');
assert.strictEqual(modalBuilding.classList.contains('pointer-events-auto'), true, 'Modal must have pointer-events-auto when open');
assert.strictEqual(modalBuilding.classList.contains('pointer-events-none'), false, 'Modal must not have pointer-events-none when open');
assert.strictEqual(modalBuildingBackdrop.classList.contains('pointer-events-auto'), true, 'Backdrop must have pointer-events-auto when open');

// Test closeAllModals
global.window.closeAllModals();
assert.strictEqual(modalBuilding.classList.contains('hidden'), true, 'Modal must be hidden when closed');
assert.strictEqual(modalBuilding.classList.contains('pointer-events-none'), true, 'Modal must have pointer-events-none when closed');
assert.strictEqual(modalBuilding.classList.contains('pointer-events-auto'), false, 'Modal must not have pointer-events-auto when closed');
assert.strictEqual(modalBuildingBackdrop.classList.contains('pointer-events-none'), true, 'Backdrop must have pointer-events-none when closed');

console.log('[PASS] openAddBuildingModal and closeAllModals correctly toggle hidden and pointer-events classes.');

// Test edit modal
global.window.editBuilding('25');
assert.strictEqual(getOrCreateElement('modal-building-title').textContent, 'Edit Building');
assert.strictEqual(getOrCreateElement('building-name').value, 'ROB Block');
assert.strictEqual(modalBuilding.classList.contains('hidden'), false);
assert.strictEqual(modalBuilding.classList.contains('pointer-events-auto'), true);

console.log('[PASS] editBuilding("25") successfully hydrates ROB Block and opens modal.');

// Test settings drawer opening and closing
const settingsDrawer = getOrCreateElement('settings-drawer');
const drawerBackdrop = getOrCreateElement('drawer-backdrop');

global.window.openSettings();
assert.strictEqual(settingsDrawer.classList.contains('hidden'), false, 'Settings drawer must not be hidden when open');
assert.strictEqual(settingsDrawer.classList.contains('pointer-events-auto'), true, 'Settings drawer must be pointer-events-auto when open');
assert.strictEqual(drawerBackdrop.classList.contains('pointer-events-auto'), true, 'Drawer backdrop must be pointer-events-auto when open');

global.window.closeSettings();
assert.strictEqual(settingsDrawer.classList.contains('pointer-events-none'), true, 'Settings drawer must be pointer-events-none when closed');
assert.strictEqual(drawerBackdrop.classList.contains('pointer-events-none'), true, 'Drawer backdrop must be pointer-events-none when closed');

console.log('[PASS] openSettings and closeSettings correctly manage pointer-events and drawer visibility.');

// Test rendering and search
global.window.renderBuildings();
const tableBody = getOrCreateElement('buildings-table-body');
assert(tableBody.innerHTML.includes('ROB Block'), 'Buildings table must contain ROB Block');
assert(tableBody.innerHTML.includes('data-action="edit-building"'), 'Must have delegated data-action');
assert(tableBody.innerHTML.includes('event.stopPropagation()'), 'Must contain stopPropagation inline');
assert(tableBody.innerHTML.includes('cursor-pointer'), 'Must contain cursor-pointer class');

console.log('[PASS] renderBuildings renders table HTML with data-action attributes, stopPropagation, and cursor-pointer.');

// Test tab switching
global.window.switchTab('rooms');
global.window.renderRooms();
const roomsTable = getOrCreateElement('rooms-table-body');
assert(roomsTable.innerHTML.includes('Room'), 'Rooms table must contain room records');
assert(roomsTable.innerHTML.includes('event.stopPropagation()'), 'Rooms table must contain stopPropagation');

console.log('[PASS] switchTab("rooms") switches view and renders room records with stopPropagation.');

// Test Document Click Delegation
const clickListeners = documentListeners['click'] || [];
assert(clickListeners.length > 0, 'Must have registered click listener on document');

function simulateClick(targetObj) {
    let stopped = false;
    const event = {
        target: targetObj,
        stopPropagation: () => { stopped = true; }
    };
    clickListeners.forEach(listener => listener(event));
    return { stopped };
}

// 1. Click on #btn-settings
let openedDrawer = false;
simulateClick({
    closest: (sel) => {
        if (sel.includes('#btn-settings') || sel.includes('#btn-open-settings')) return { id: 'btn-settings' };
        return null;
    },
    classList: { contains: () => false }
});
assert.strictEqual(settingsDrawer.classList.contains('pointer-events-auto'), true, 'Clicking #btn-settings must open settings drawer');

// Close settings
global.window.closeSettings();

// 2. Click on #btn-add-building
global.window.closeAllModals();
simulateClick({
    closest: (sel) => {
        if (sel.includes('#btn-add-building')) return { id: 'btn-add-building' };
        return null;
    },
    classList: { contains: () => false }
});
assert.strictEqual(modalBuilding.classList.contains('hidden'), false, 'Clicking #btn-add-building must open building modal');

// 3. Click on row action [data-action="edit-building"]
const actionResult = simulateClick({
    closest: (sel) => {
        if (sel.includes('[data-action]')) {
            return {
                getAttribute: (attr) => attr === 'data-action' ? 'edit-building' : '25'
            };
        }
        return null;
    },
    classList: { contains: () => false }
});
assert.strictEqual(actionResult.stopped, true, 'Row action click must stop propagation');

console.log('[PASS] Global click event listener correctly handles #btn-settings, #btn-add-building, and row actions with stopPropagation.');

// 4. Audit admin/index.html directly
const indexHtml = fs.readFileSync('admin/index.html', 'utf8');

// Check modal overlays have hidden and pointer-events-none by default
assert(indexHtml.includes('id="settings-drawer" class="fixed inset-0 z-50 hidden pointer-events-none'), 'settings-drawer must have hidden pointer-events-none in HTML');
assert(indexHtml.includes('id="drawer-backdrop" class="absolute inset-0 bg-slate-950/75 backdrop-blur-sm pointer-events-none"'), 'drawer-backdrop must have pointer-events-none in HTML');
assert(indexHtml.includes('id="modal-building" class="fixed inset-0 z-50 hidden pointer-events-none'), 'modal-building must have hidden pointer-events-none in HTML');
assert(indexHtml.includes('id="modal-room" class="fixed inset-0 z-50 hidden pointer-events-none'), 'modal-room must have hidden pointer-events-none in HTML');
assert(indexHtml.includes('id="modal-staff" class="fixed inset-0 z-50 hidden pointer-events-none'), 'modal-staff must have hidden pointer-events-none in HTML');
assert(indexHtml.includes('id="mobile-sidebar-backdrop" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 hidden pointer-events-none'), 'mobile-sidebar-backdrop must have hidden pointer-events-none in HTML');

// Check button and header layering
assert(indexHtml.includes('header class="h-16 border-b border-slate-800/80 bg-slate-900/95 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between relative z-30 shrink-0"'), 'header must be elevated with relative z-30');
assert(indexHtml.includes('cursor: pointer'), 'CSS must define cursor: pointer for buttons');

console.log('[PASS] HTML markup audit confirmed: Inactive modals neutralized, header & buttons properly layered.');

console.log('\n=== ALL ADMIN CMS TESTS PASSED (100%) ===\n');
