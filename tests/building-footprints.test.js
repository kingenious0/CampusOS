/**
 * Building Footprints & 3D Extrusion Test Suite
 * Verifies geometry completeness and realistic normalized heights for Opoku Ware Hall,
 * Opoku Ware II Hall, and the 3D fill-extrusion pipeline.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== RUNNING BUILDING FOOTPRINTS & 3D EXTRUSIONS TEST SUITE ===\n');

// 1. Verify data/buildings.json
const buildingsPath = path.join(__dirname, '../data/buildings.json');
const buildings = JSON.parse(fs.readFileSync(buildingsPath, 'utf8'));

// Opoku Ware II Hall (id: 32)
const ow2 = buildings.find(b => b.id === 32 || b.name === 'Opoku Ware II Hall');
assert(ow2, 'Opoku Ware II Hall (id: 32) must exist in data/buildings.json');

// Check entrance coordinate: quadrangle portal connecting both wings
assert(Array.isArray(ow2.entrance), 'Opoku Ware II Hall must have entrance array');
assert.strictEqual(ow2.entrance[0], -1.68356, 'Entrance lng must be -1.68356 (portal walkway)');
assert.strictEqual(ow2.entrance[1], 6.69762, 'Entrance lat must be 6.69762 (portal walkway)');

// Check polygon footprint
assert(Array.isArray(ow2.polygon), 'Opoku Ware II Hall must have polygon array');
const ring = Array.isArray(ow2.polygon[0]) && Array.isArray(ow2.polygon[0][0]) ? ow2.polygon[0] : ow2.polygon;
assert(ring.length >= 12, `Opoku Ware II Hall polygon must have >= 12 vertices, found ${ring.length}`);

// Check that footprint spans across both west wing and east courtyard wing
const lngs = ring.map(p => p[0]);
const lats = ring.map(p => p[1]);
const minLng = Math.min(...lngs);
const maxLng = Math.max(...lngs);
const minLat = Math.min(...lats);
const maxLat = Math.max(...lats);

assert(minLng <= -1.6838, `Polygon must extend west toward Mosque (minLng <= -1.6838), got ${minLng}`);
assert(maxLng >= -1.68335, `Polygon must extend east covering courtyard wing (maxLng >= -1.68335), got ${maxLng}`);
assert(minLat <= 6.69745, `Polygon must terminate at south wing perimeter without lawn spillover, got ${minLat}`);
assert(maxLat >= 6.6978, `Polygon must cover north wing perimeter, got ${maxLat}`);

// Verify polygon ring is closed
const firstPt = ring[0];
const lastPt = ring[ring.length - 1];
assert.strictEqual(firstPt[0], lastPt[0], 'Polygon first and last lng must match (closed ring)');
assert.strictEqual(firstPt[1], lastPt[1], 'Polygon first and last lat must match (closed ring)');

// Check realistic normalized height
assert(ow2.height >= 7 && ow2.height <= 10, `OW2 height in data/buildings.json must be 7-10m, got ${ow2.height}`);

// Opoku Ware Hall (id: 11)
const ow1 = buildings.find(b => b.id === 11 || b.name === 'Opoku Ware Hall');
assert(ow1, 'Opoku Ware Hall (id: 11) must exist in data/buildings.json');
assert(Array.isArray(ow1.entrance), 'Opoku Ware Hall must have entrance array');
assert.strictEqual(ow1.entrance[0], -1.682884, 'OW1 entrance lng must match');
assert(Array.isArray(ow1.polygon), 'OW1 must have polygon array');
assert(ow1.height >= 7 && ow1.height <= 10, `OW1 height must be 7-10m, got ${ow1.height}`);

console.log('✓ PASS: data/buildings.json contains complete polygons, entrances, and normalized heights for Opoku Ware buildings');

// 2. Verify data/campus.geojson
const campusGeojsonPath = path.join(__dirname, '../data/campus.geojson');
const campusGeojson = JSON.parse(fs.readFileSync(campusGeojsonPath, 'utf8'));
const ow2Campus = campusGeojson.features.find(f => f.properties?.name === 'Opoku Ware II Hall');
assert(ow2Campus, 'Opoku Ware II Hall must be present in data/campus.geojson');
assert.strictEqual(ow2Campus.geometry.type, 'Polygon', 'Must be Polygon in campus.geojson');
assert(ow2Campus.properties.height >= 7 && ow2Campus.properties.height <= 10, `campus.geojson height must be 7-10m, got ${ow2Campus.properties.height}`);

console.log('✓ PASS: data/campus.geojson contains Opoku Ware II Hall with normalized height');

// 3. Verify seed data files
const seedSqlPath = path.join(__dirname, '../scripts/seed_data.sql');
const seedSql = fs.readFileSync(seedSqlPath, 'utf8');
assert(seedSql.includes('-1.68356') && seedSql.includes('6.69762'), 'seed_data.sql must contain updated OW II entrance [-1.68356, 6.69762]');
assert(seedSql.includes('-1.682884') && seedSql.includes('6.697843'), 'seed_data.sql must contain updated OW entrance');
assert(seedSql.includes('"polygon":'), 'seed_data.sql must contain polygon in metadata');

const adminSeedJsonPath = path.join(__dirname, '../admin/seed_data.json');
const adminSeedJson = JSON.parse(fs.readFileSync(adminSeedJsonPath, 'utf8'));

const ow2AdminJson = adminSeedJson.buildings.find(b => b.id == 32 || b.name === 'Opoku Ware II Hall');
assert(ow2AdminJson, 'OW II Hall must exist in admin/seed_data.json');
assert.strictEqual(ow2AdminJson.entrance[0], -1.68356, 'admin/seed_data.json entrance must match');
const polyData = ow2AdminJson.metadata?.polygon;
const adminRing = Array.isArray(polyData?.[0]?.[0]) ? polyData[0] : polyData;
assert(adminRing && adminRing.length >= 12, 'admin/seed_data.json must have polygon in metadata with >= 12 vertices');
assert(ow2AdminJson.metadata.height >= 7 && ow2AdminJson.metadata.height <= 10, 'OW2 admin metadata height must be 7-10m');

const ow1AdminJson = adminSeedJson.buildings.find(b => b.id == 11 || b.name === 'Opoku Ware Hall');
assert(ow1AdminJson, 'OW Hall must exist in admin/seed_data.json');
assert.strictEqual(ow1AdminJson.entrance[0], -1.682884, 'OW Hall entrance must match');
assert(ow1AdminJson.metadata?.polygon, 'OW Hall must have polygon in metadata');
assert(ow1AdminJson.metadata.height >= 7 && ow1AdminJson.metadata.height <= 10, 'OW1 admin metadata height must be 7-10m');

const adminSeedJsPath = path.join(__dirname, '../admin/seed_data.js');
const adminSeedJs = fs.readFileSync(adminSeedJsPath, 'utf8');
assert(adminSeedJs.includes('-1.68356') && adminSeedJs.includes('6.69762'), 'admin/seed_data.js must contain updated OW2 entrance');
assert(adminSeedJs.includes('-1.682884') && adminSeedJs.includes('6.697843'), 'admin/seed_data.js must contain updated OW1 entrance');

console.log('✓ PASS: scripts/seed_data.sql, admin/seed_data.json, and admin/seed_data.js contain synchronized footprints, entrances, and heights');

// 4. Verify map.html native 3D building integration and complete removal of redundant overlay
const mapHtmlPath = path.join(__dirname, '../map.html');
const mapHtml = fs.readFileSync(mapHtmlPath, 'utf8');
assert(mapHtml.includes('campus-3d-buildings'), 'map.html must define native campus-3d-buildings layer');
assert(mapHtml.includes("'fill-extrusion-height': [") && mapHtml.includes("['*', ['get', 'levels'], 3.5]"), 'map.html must implement fill-extrusion-height rule with levels * 3.5');
assert(!mapHtml.includes('campus-custom-3d-extrusions'), 'map.html must NOT contain redundant campus-custom-3d-extrusions layer');
assert(!mapHtml.includes('campus-custom-3d-features'), 'map.html must NOT contain campus-custom-3d-features source');
assert(!mapHtml.includes('syncCustom3DBuildings'), 'map.html must NOT contain syncCustom3DBuildings call');

console.log('✓ PASS: map.html cleanly renders native Mapbox 3D buildings without redundant ghost extrusions');

// 5. Verify obsolete campus-features.geojson is removed and not in sw.js
const campusFeaturesPath = path.join(__dirname, '../data/campus-features.geojson');
assert(!fs.existsSync(campusFeaturesPath), 'data/campus-features.geojson must be removed to avoid redundant data');

const swPath = path.join(__dirname, '../sw.js');
const sw = fs.readFileSync(swPath, 'utf8');
assert(!sw.includes("'./data/campus-features.geojson'"), 'sw.js must NOT precache obsolete ./data/campus-features.geojson');

console.log('✓ PASS: sw.js cleanly excludes obsolete campus-features.geojson');

console.log('\n=== ALL BUILDING FOOTPRINT & 3D EXTRUSION TESTS PASSED (100%)! ===');
