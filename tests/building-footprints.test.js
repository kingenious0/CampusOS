/**
 * Building Footprints & 3D Extrusion Test Suite
 * Verifies geometry completeness for Opoku Ware II Hall and custom 3D extrusion pipeline.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== RUNNING BUILDING FOOTPRINTS & 3D EXTRUSIONS TEST SUITE ===\n');

// 1. Verify data/buildings.json
const buildingsPath = path.join(__dirname, '../data/buildings.json');
const buildings = JSON.parse(fs.readFileSync(buildingsPath, 'utf8'));

const ow2 = buildings.find(b => b.id === 32 || b.name === 'Opoku Ware II Hall');
assert(ow2, 'Opoku Ware II Hall (id: 32) must exist in data/buildings.json');

// Check entrance coordinate: quadrangle portal connecting both wings
assert(Array.isArray(ow2.entrance), 'Opoku Ware II Hall must have entrance array');
assert.strictEqual(ow2.entrance[0], -1.68356, 'Entrance lng must be -1.68356 (portal walkway)');
assert.strictEqual(ow2.entrance[1], 6.69762, 'Entrance lat must be 6.69762 (portal walkway)');

// Check polygon footprint
assert(Array.isArray(ow2.polygon), 'Opoku Ware II Hall must have polygon array');
const ring = Array.isArray(ow2.polygon[0]) && Array.isArray(ow2.polygon[0][0]) ? ow2.polygon[0] : ow2.polygon;
assert(ring.length >= 15, `Opoku Ware II Hall polygon must have >= 15 vertices, found ${ring.length}`);

// Check that footprint spans across both west wing and east courtyard wing
const lngs = ring.map(p => p[0]);
const lats = ring.map(p => p[1]);
const minLng = Math.min(...lngs);
const maxLng = Math.max(...lngs);
const minLat = Math.min(...lats);
const maxLat = Math.max(...lats);

assert(minLng <= -1.6838, `Polygon must extend west toward Mosque (minLng <= -1.6838), got ${minLng}`);
assert(maxLng >= -1.6833, `Polygon must extend east covering courtyard wing (maxLng >= -1.6833), got ${maxLng}`);
assert(minLat <= 6.6973, `Polygon must cover south wing perimeter, got ${minLat}`);
assert(maxLat >= 6.6978, `Polygon must cover north wing perimeter, got ${maxLat}`);

// Verify polygon ring is closed
const firstPt = ring[0];
const lastPt = ring[ring.length - 1];
assert.strictEqual(firstPt[0], lastPt[0], 'Polygon first and last lng must match (closed ring)');
assert.strictEqual(firstPt[1], lastPt[1], 'Polygon first and last lat must match (closed ring)');

console.log('✓ PASS: data/buildings.json contains complete Opoku Ware II Hall polygon spanning west and east wings with quadrangle entrance [-1.68356, 6.69762]');

// 2. Verify data/campus-features.geojson
const campusFeaturesPath = path.join(__dirname, '../data/campus-features.geojson');
assert(fs.existsSync(campusFeaturesPath), 'data/campus-features.geojson must exist');
const campusFeatures = JSON.parse(fs.readFileSync(campusFeaturesPath, 'utf8'));
assert.strictEqual(campusFeatures.type, 'FeatureCollection', 'Must be a GeoJSON FeatureCollection');

const ow2Feature = campusFeatures.features.find(f => f.id === 'opoku-ware-ii-hall' || f.properties?.name === 'Opoku Ware II Hall');
assert(ow2Feature, 'Opoku Ware II Hall feature must exist in campus-features.geojson');
assert.strictEqual(ow2Feature.geometry.type, 'Polygon', 'Must be a Polygon geometry');
assert.strictEqual(ow2Feature.properties.height, 16, 'Extrusion height must be 16');
assert.strictEqual(ow2Feature.properties.extrude, true, 'Extrude property must be true');
assert.deepStrictEqual(ow2Feature.properties.entrance, [-1.68356, 6.69762], 'Entrance property must match portal walkway');

console.log('✓ PASS: data/campus-features.geojson contains 3D extrusion feature for Opoku Ware II Hall');

// 3. Verify data/campus.geojson
const campusGeojsonPath = path.join(__dirname, '../data/campus.geojson');
const campusGeojson = JSON.parse(fs.readFileSync(campusGeojsonPath, 'utf8'));
const ow2Campus = campusGeojson.features.find(f => f.properties?.name === 'Opoku Ware II Hall');
assert(ow2Campus, 'Opoku Ware II Hall must be present in data/campus.geojson');
assert.strictEqual(ow2Campus.geometry.type, 'Polygon', 'Must be Polygon in campus.geojson');

console.log('✓ PASS: data/campus.geojson contains Opoku Ware II Hall');

// 4. Verify seed data files
const seedSqlPath = path.join(__dirname, '../scripts/seed_data.sql');
const seedSql = fs.readFileSync(seedSqlPath, 'utf8');
assert(seedSql.includes('-1.68356') && seedSql.includes('6.69762'), 'seed_data.sql must contain updated entrance [-1.68356, 6.69762]');
assert(seedSql.includes('"polygon":'), 'seed_data.sql must contain polygon in metadata');

const adminSeedJsonPath = path.join(__dirname, '../admin/seed_data.json');
const adminSeedJson = JSON.parse(fs.readFileSync(adminSeedJsonPath, 'utf8'));
const ow2AdminJson = adminSeedJson.buildings.find(b => b.id === 32 || b.name === 'Opoku Ware II Hall');
assert(ow2AdminJson, 'OW II Hall must exist in admin/seed_data.json');
assert.strictEqual(ow2AdminJson.entrance[0], -1.68356, 'admin/seed_data.json entrance must match');
const adminRing = Array.isArray(ow2AdminJson.metadata?.polygon?.[0]?.[0]) ? ow2AdminJson.metadata.polygon[0] : ow2AdminJson.metadata?.polygon;
assert(adminRing && adminRing.length >= 15, 'admin/seed_data.json must have polygon in metadata');

const adminSeedJsPath = path.join(__dirname, '../admin/seed_data.js');
const adminSeedJs = fs.readFileSync(adminSeedJsPath, 'utf8');
assert(adminSeedJs.includes('-1.68356') && adminSeedJs.includes('6.69762'), 'admin/seed_data.js must contain updated entrance');

console.log('✓ PASS: scripts/seed_data.sql, admin/seed_data.json, and admin/seed_data.js contain synchronized footprint & entrance');

// 5. Verify map.html 3D extrusion integration
const mapHtmlPath = path.join(__dirname, '../map.html');
const mapHtml = fs.readFileSync(mapHtmlPath, 'utf8');
assert(mapHtml.includes('campus-custom-3d-features'), 'map.html must define campus-custom-3d-features source');
assert(mapHtml.includes('campus-custom-3d-extrusions'), 'map.html must define campus-custom-3d-extrusions layer');
assert(mapHtml.includes('syncCustom3DBuildings'), 'map.html must include syncCustom3DBuildings method');
assert(mapHtml.includes('data/campus-features.geojson'), 'map.html must load data/campus-features.geojson');

console.log('✓ PASS: map.html includes custom 3D fill-extrusion layers and dynamic polygon synchronization');

// 6. Verify sw.js precache
const swPath = path.join(__dirname, '../sw.js');
const sw = fs.readFileSync(swPath, 'utf8');
assert(sw.includes("'./data/campus-features.geojson'"), 'sw.js must precache ./data/campus-features.geojson');

console.log('✓ PASS: sw.js precaches ./data/campus-features.geojson');

console.log('\n=== ALL BUILDING FOOTPRINT & 3D EXTRUSION TESTS PASSED (100%)! ===');
