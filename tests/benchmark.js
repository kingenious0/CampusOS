/**
 * Diagnostic & Regression Analysis Script — Phase 2B Hardening Review
 * Gathers exact graph statistics, compares old vs new router, and runs performance benchmarks.
 */

const fs = require('fs');
const path = require('path');

const { RoutingEngine } = require('../js/routing/routing-engine');
const GraphValidator = require('../js/routing/graph-validator');
const SpatialSnapper = require('../js/routing/spatial-snapper');
const { haversineDistance } = SpatialSnapper;

const roadsGeo = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/roads.geojson'), 'utf8'));
const campusGeo = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/campus.geojson'), 'utf8'));
const buildingsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/buildings.json'), 'utf8'));

// -------------------------------------------------------------
// 1. LEGACY ROUTER RE-CREATION FOR REGRESSION CHECK
// -------------------------------------------------------------
class OldPriorityQueue {
    constructor() { this.items = []; }
    enqueue(element, priority) {
        const node = { element, priority };
        let added = false;
        for (let i = 0; i < this.items.length; i++) {
            if (node.priority < this.items[i].priority) { this.items.splice(i, 0, node); added = true; break; }
        }
        if (!added) this.items.push(node);
    }
    dequeue() { return this.items.shift(); }
    isEmpty() { return this.items.length === 0; }
}

const OldOfflineRouter = (() => {
    let graph = {}; let nodes = [];
    return {
        init: (cGeo, rGeo) => {
            [...cGeo.features, ...rGeo.features].filter(f => f.geometry.type === 'LineString').forEach(road => {
                const coords = road.geometry.coordinates;
                for (let i = 0; i < coords.length - 1; i++) {
                    const p1 = coords[i], p2 = coords[i + 1];
                    const k1 = `${p1[0]},${p1[1]}`, k2 = `${p2[0]},${p2[1]}`;
                    const dist = haversineDistance(p1[1], p1[0], p2[1], p2[0]);
                    if (!graph[k1]) graph[k1] = []; if (!graph[k2]) graph[k2] = [];
                    graph[k1].push({ node: k2, dist, coords: p2 });
                    graph[k2].push({ node: k1, dist, coords: p1 });
                }
            });
            nodes = Object.keys(graph);
        },
        compute: (slat, slng, dlat, dlng) => {
            let sNode = null, dNode = null, sMin = Infinity, dMin = Infinity;
            nodes.forEach(k => {
                const [nLng, nLat] = k.split(',').map(Number);
                const ds = haversineDistance(slat, slng, nLat, nLng); if (ds < sMin) { sMin = ds; sNode = k; }
                const dd = haversineDistance(dlat, dlng, nLat, nLng); if (dd < dMin) { dMin = dd; dNode = k; }
            });
            if (!sNode || !dNode) return null;
            const dists = {}, prev = {}, pq = new OldPriorityQueue();
            nodes.forEach(n => dists[n] = Infinity); dists[sNode] = 0; pq.enqueue(sNode, 0);
            while (!pq.isEmpty()) {
                const { element: curr } = pq.dequeue(); if (curr === dNode) break;
                graph[curr]?.forEach(nb => {
                    const alt = dists[curr] + nb.dist;
                    if (alt < dists[nb.node]) { dists[nb.node] = alt; prev[nb.node] = curr; pq.enqueue(nb.node, alt); }
                });
            }
            if (dists[dNode] === Infinity) return null;
            const pathArr = []; let curr = dNode;
            while (curr) { const [lng, lat] = curr.split(',').map(Number); pathArr.unshift([lng, lat]); curr = prev[curr]; }
            return {
                distance: dists[dNode],
                duration: dists[dNode] / 1.4,
                geometry: { type: 'LineString', coordinates: pathArr }
            };
        }
    };
})();

OldOfflineRouter.init(campusGeo, roadsGeo);

// -------------------------------------------------------------
// 2. ENGINE V2 INITIALIZATION & GRAPH STATS
// -------------------------------------------------------------
const engine = new RoutingEngine();
const t0 = performance.now();
const loadRes = engine.loadFromGeoJSON([campusGeo, roadsGeo]);
const t1 = performance.now();

const validation = GraphValidator.validateGraph(engine.rawGraph);

console.log('=== GRAPH STATISTICS ===');
console.log('Total Nodes:', engine.rawGraph.nodes.length);
console.log('Total Edges:', engine.rawGraph.edges.length);
console.log('Connected Components:', validation.stats.connectedComponents);
console.log('Isolated Nodes:', validation.stats.isolatedNodes);
console.log('Validation Errors:', validation.errors.length);
console.log('Validation Warnings:', validation.warnings.length);
console.log('Graph Load + Prep Time:', (t1 - t0).toFixed(2), 'ms\n');

// -------------------------------------------------------------
// 3. REGRESSION COMPARISON: IDENTICAL ORIGIN & DESTINATION PAIRS
// -------------------------------------------------------------
const testPairs = [
    {
        name: 'Commercial Area to Faculty Block',
        start: { lat: 6.697400, lng: -1.681400 },
        dest: { lat: 6.700400, lng: -1.682000 }
    },
    {
        name: 'Main Gate to Campus Center',
        start: { lat: 6.694600, lng: -1.681600 },
        dest: { lat: 6.697332, lng: -1.681514 }
    },
    {
        name: 'Hostel Zone to Administration Block',
        start: { lat: 6.696000, lng: -1.683000 },
        dest: { lat: 6.700500, lng: -1.681000 }
    },
    {
        name: 'Distant Out of Bounds (Off-Campus 1.5km)',
        start: { lat: 6.715000, lng: -1.680000 },
        dest: { lat: 6.697400, lng: -1.681400 }
    }
];

console.log('=== REGRESSION COMPARISON: OLD VS NEW ROUTER ===');
testPairs.forEach((pair, idx) => {
    console.log(`\nTest Pair ${idx + 1}: ${pair.name}`);
    
    // Old Router
    const tOldStart = performance.now();
    const oldRes = OldOfflineRouter.compute(pair.start.lat, pair.start.lng, pair.dest.lat, pair.dest.lng);
    const tOldEnd = performance.now();

    // New Router
    const tNewStart = performance.now();
    const newRes = engine.calculateRoute(pair.start, pair.dest, { maxSnapDistanceMeters: 60 });
    const tNewEnd = performance.now();

    if (oldRes) {
        console.log(`  Old Router: status=success, dist=${oldRes.distance.toFixed(1)}m, time=${(tOldEnd - tOldStart).toFixed(2)}ms, waypoints=${oldRes.geometry.coordinates.length}`);
    } else {
        console.log(`  Old Router: status=null`);
    }

    console.log(`  New Router: status=${newRes.status}, dist=${newRes.distanceMeters}m, time=${(tNewEnd - tNewStart).toFixed(2)}ms, visitedNodes=${newRes.diagnostics?.nodesVisited || 0}, waypoints=${newRes.geometry?.coordinates.length || 0}`);
    if (newRes.diagnostics?.snapDistanceMeters) {
        console.log(`              diagnostics: snapDist=${newRes.diagnostics.snapDistanceMeters}m`);
    }
});
