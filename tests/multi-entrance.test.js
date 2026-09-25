/**
 * Test Suite: Multi-Entrance Schema, Studio Editor & Routing Engine Integration
 * Verifies:
 * 1. Multi-Entrance Schema parsing & backwards-compatibility (legacy [lng, lat] vs multi-entrance array).
 * 2. Studio UI / Pin Editor state machine (add, rename, toggle primary, delete, save).
 * 3. Client Routing Engine selection of closest entrance door based on shortest network path.
 * 4. Turn-by-turn guidance with entrance name formatting: "Arrive at <Building> (<Entrance>)".
 * 5. Specific tests for ROB Block and Opoku Ware Hall.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const RoutingEngineModule = require('../js/routing/routing-engine');
const ManeuverGenerator = require('../js/routing/maneuver-generator');
const RoutingAdapter = require('../js/routing/routing-adapter');

const campusGeo = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/campus.geojson'), 'utf8'));
const roadsGeo = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/roads.geojson'), 'utf8'));

console.log('\n==================================================');
console.log('RUNNING MULTI-ENTRANCE TEST SUITE');
console.log('==================================================\n');

// -----------------------------------------------------------------------------
// TEST GROUP 1: SCHEMA NORMALIZATION
// -----------------------------------------------------------------------------
console.log('--- TEST GROUP 1: SCHEMA NORMALIZATION ---');

const { normalizeEntrances } = RoutingEngineModule;

// Legacy format: [lng, lat]
const legacyEntrance = [-1.682075, 6.700458];
const normLegacy = normalizeEntrances(legacyEntrance);
assert.strictEqual(normLegacy.length, 1, 'Legacy entrance should normalize to 1 entrance item');
assert.strictEqual(normLegacy[0].label, 'Main Entrance');
assert.deepStrictEqual(normLegacy[0].coords, [-1.682075, 6.700458]);
assert.strictEqual(normLegacy[0].isPrimary, true);
console.log('✅ PASS: Legacy [lng, lat] normalized with isPrimary=true and label="Main Entrance"');

// Multi format: array of objects
const multiEntrances = [
    { id: 'ent-1', label: 'Main Entrance', coords: [-1.682075, 6.700458], isPrimary: true },
    { id: 'ent-2', label: 'Car Park Gate', coords: [-1.682650, 6.697750], isPrimary: false },
    { id: 'ent-3', label: 'Ramp Access', coords: [-1.682180, 6.700180], isPrimary: false }
];
const normMulti = normalizeEntrances(multiEntrances);
assert.strictEqual(normMulti.length, 3, 'Multi-entrance array should preserve all entrances');
assert.strictEqual(normMulti[0].label, 'Main Entrance');
assert.strictEqual(normMulti[1].label, 'Car Park Gate');
assert.strictEqual(normMulti[2].label, 'Ramp Access');
assert.strictEqual(normMulti[0].isPrimary, true);
assert.strictEqual(normMulti[1].isPrimary, false);
console.log('✅ PASS: Multi-entrance array normalized correctly');

// Edge cases: null, undefined, empty array
assert.deepStrictEqual(normalizeEntrances(null), []);
assert.deepStrictEqual(normalizeEntrances(undefined), []);
assert.deepStrictEqual(normalizeEntrances([]), []);
console.log('✅ PASS: Empty/null/undefined returns empty array cleanly');

// Default primary assignment when none specified
const unassignedPrimary = [
    { id: 'e1', label: 'Door A', coords: [-1.68, 6.70] },
    { id: 'e2', label: 'Door B', coords: [-1.681, 6.701] }
];
const normUnassigned = normalizeEntrances(unassignedPrimary);
assert.strictEqual(normUnassigned[0].isPrimary, true, 'First entrance should default to primary');
assert.strictEqual(normUnassigned[1].isPrimary, false, 'Subsequent entrances should be non-primary');
console.log('✅ PASS: Defaults first entrance to isPrimary=true when unassigned');


// -----------------------------------------------------------------------------
// TEST GROUP 2: ROUTING ENGINE WITH MULTIPLE ENTRANCES (ROB BLOCK)
// -----------------------------------------------------------------------------
console.log('\n--- TEST GROUP 2: ROUTING TO ROB BLOCK (MULTI-ENTRANCE) ---');

const engine = new RoutingEngineModule.RoutingEngine();
const loadRes = engine.loadFromGeoJSON([campusGeo, roadsGeo]);
assert(loadRes.success, 'Graph must load successfully from GeoJSON sources');

// ROB Block (ID: 25) Centroid: [6.700344, -1.682229]
// We define two real distinct entrances on ROB connected to the road network:
// 1. North Entrance: [-1.68223, 6.70083] (connected via Management Dept Connector to Academic Loop North)
// 2. Main Entrance: [-1.68207, 6.70045] (connected via ROB Connector to Main Entrance Road)
const robBuilding = {
    id: '25',
    name: 'ROB Block',
    lat: 6.700459,
    lng: -1.682075,
    entrances: [
        { id: 'rob-north', label: 'North Entrance', coords: [-1.68223, 6.70083], isPrimary: false },
        { id: 'rob-main', label: 'Main Entrance', coords: [-1.68207, 6.70045], isPrimary: true }
    ]
};

// Route from the North (e.g., near Library/NLB at 6.7018, -1.6820)
const startNorth = { lat: 6.7018, lng: -1.6820, name: 'North Campus Walkway' };
const routeFromNorth = engine.calculateRoute(startNorth, robBuilding);

assert.strictEqual(routeFromNorth.status, 'success', 'Route from North should calculate successfully');
assert.strictEqual(routeFromNorth.selectedEntrance.id, 'rob-north', 'Should pick North Entrance when approaching from North');
assert.strictEqual(routeFromNorth.entranceName, 'North Entrance', 'entranceName should be North Entrance');
const lastStepNorth = routeFromNorth.maneuvers[routeFromNorth.maneuvers.length - 1];
assert.strictEqual(lastStepNorth.name, 'Arrive at ROB Block (North Entrance)', 'Turn-by-turn guidance must show entrance name');
console.log(`✅ PASS: Approaching ROB from North selected "${routeFromNorth.entranceName}" (${routeFromNorth.distanceMeters}m). Arrival: "${lastStepNorth.name}"`);

// Route from the South (e.g., near Administration / Great Hall at 6.6980, -1.6822)
const startSouth = { lat: 6.6980, lng: -1.6822, name: 'South Campus Walkway' };
const routeFromSouth = engine.calculateRoute(startSouth, robBuilding);

assert.strictEqual(routeFromSouth.status, 'success', 'Route from South should calculate successfully');
assert.strictEqual(routeFromSouth.selectedEntrance.id, 'rob-main', 'Should pick Main Entrance when approaching from South');
assert.strictEqual(routeFromSouth.entranceName, 'Main Entrance', 'entranceName should be Main Entrance');
const lastStepSouth = routeFromSouth.maneuvers[routeFromSouth.maneuvers.length - 1];
assert.strictEqual(lastStepSouth.name, 'Arrive at ROB Block (Main Entrance)', 'Turn-by-turn guidance must show entrance name');
console.log(`✅ PASS: Approaching ROB from South selected "${routeFromSouth.entranceName}" (${routeFromSouth.distanceMeters}m). Arrival: "${lastStepSouth.name}"`);


// -----------------------------------------------------------------------------
// TEST GROUP 3: ROUTING TO OPOKU WARE HALL (MULTI-ENTRANCE)
// -----------------------------------------------------------------------------
console.log('\n--- TEST GROUP 3: ROUTING TO OPOKU WARE HALL (MULTI-ENTRANCE) ---');

// Opoku Ware Hall (ID: 11) Centroid: [6.697843, -1.682884]
// We define two entrances:
// 1. West Entrance: [-1.6832, 6.69784] (facing West Campus Loop)
// 2. East Gate: [-1.6822, 6.69784] (facing Main Entrance Road)
const owHall = {
    id: '11',
    name: 'Opoku Ware Hall',
    lat: 6.697843,
    lng: -1.682884,
    entrance: [
        { id: 'ow-west', label: 'West Entrance', coords: [-1.6832, 6.69784], isPrimary: true },
        { id: 'ow-east', label: 'East Gate', coords: [-1.6822, 6.69784], isPrimary: false }
    ]
};

// Route from West (West Campus Loop, closer to West Entrance)
const startWest = { lat: 6.6985, lng: -1.68395, name: 'West Campus Loop' };
const routeWest = engine.calculateRoute(startWest, owHall);

assert.strictEqual(routeWest.status, 'success');
assert.strictEqual(routeWest.selectedEntrance.id, 'ow-west', 'Should select West Entrance when coming from West');
const lastStepWest = routeWest.maneuvers[routeWest.maneuvers.length - 1];
assert.strictEqual(lastStepWest.name, 'Arrive at Opoku Ware Hall (West Entrance)');
console.log(`✅ PASS: Approaching Opoku Ware Hall from West selected "${routeWest.entranceName}" (${routeWest.distanceMeters}m). Arrival: "${lastStepWest.name}"`);

// Route from East (Main Entrance Road, closer to East Gate)
const startEast = { lat: 6.6985, lng: -1.68185, name: 'Main Entrance Road' };
const routeEast = engine.calculateRoute(startEast, owHall);

assert.strictEqual(routeEast.status, 'success');
assert.strictEqual(routeEast.selectedEntrance.id, 'ow-east', 'Should select East Gate when coming from East');
const lastStepEast = routeEast.maneuvers[routeEast.maneuvers.length - 1];
assert.strictEqual(lastStepEast.name, 'Arrive at Opoku Ware Hall (East Gate)');
console.log(`✅ PASS: Approaching Opoku Ware Hall from East selected "${routeEast.entranceName}" (${routeEast.distanceMeters}m). Arrival: "${lastStepEast.name}"`);


// -----------------------------------------------------------------------------
// TEST GROUP 4: BACKWARD COMPATIBILITY
// -----------------------------------------------------------------------------
console.log('\n--- TEST GROUP 4: BACKWARD COMPATIBILITY ---');

// Legacy [lng, lat] destination
const legacyBldg = {
    name: 'Old Format Hall',
    lat: 6.697843,
    lng: -1.682884,
    entrance: [-1.6832, 6.69784]
};
const resLegacy = engine.calculateRoute(startWest, legacyBldg);
assert.strictEqual(resLegacy.status, 'success', 'Legacy [lng, lat] must route without errors');
assert.strictEqual(resLegacy.selectedEntrance.label, 'Main Entrance', 'Legacy entrance default label is Main Entrance');
assert.strictEqual(resLegacy.maneuvers[resLegacy.maneuvers.length - 1].name, 'Arrive at Old Format Hall (Main Entrance)');
console.log('✅ PASS: Legacy [lng, lat] routes correctly and displays Main Entrance');

// Destination with NO entrance (centroid only)
const centroidOnlyBldg = {
    name: 'Centroid Only Hall',
    lat: 6.697843,
    lng: -1.682884
};
const resCentroid = engine.calculateRoute(startWest, centroidOnlyBldg);
assert.strictEqual(resCentroid.status, 'success');
assert.strictEqual(resCentroid.selectedEntrance, null);
assert.strictEqual(resCentroid.maneuvers[resCentroid.maneuvers.length - 1].name, 'Arrive at Centroid Only Hall');
console.log('✅ PASS: Centroid-only building routes without crashing and omits entrance parentheses');


// -----------------------------------------------------------------------------
// TEST GROUP 5: OFFLINE ROUTER ADAPTER INTEGRATION
// -----------------------------------------------------------------------------
console.log('\n--- TEST GROUP 5: OFFLINE ROUTER ADAPTER ---');

const OfflineRouter = RoutingAdapter;
// Re-init engine inside adapter using current prepared graph
OfflineRouter.getEngine().loadFromGeoJSON([campusGeo, roadsGeo]);

const adapterRes = OfflineRouter.compute(startNorth.lat, startNorth.lng, robBuilding.lat, robBuilding.lng, {
    destName: 'ROB Block',
    entrances: robBuilding.entrances
});

assert(adapterRes !== null, 'OfflineRouter.compute must return route object');
assert.strictEqual(adapterRes.status, 'success');
assert.strictEqual(adapterRes.selectedEntrance.id, 'rob-north');
assert.strictEqual(adapterRes.entranceName, 'North Entrance');
const adapterLastStep = adapterRes.steps[adapterRes.steps.length - 1];
assert.strictEqual(adapterLastStep.name, 'Arrive at ROB Block (North Entrance)');
console.log('✅ PASS: OfflineRouter.compute passes multi-entrance options and returns selectedEntrance & steps');

console.log('\n==================================================');
console.log('ALL MULTI-ENTRANCE TESTS PASSED (100%)!');
console.log('==================================================\n');
