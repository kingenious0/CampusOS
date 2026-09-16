/**
 * Automated Test Suite — CampusOS Routing Engine V2
 * Tests 12 core scenarios covering canonical graph building, A*, costing,
 * snapping, accessibility, floor transitions, and legacy data compatibility.
 */

const fs = require('fs');
const path = require('path');

const GraphSchema = require('../js/routing/graph-schema');
const GraphValidator = require('../js/routing/graph-validator');
const GraphBuilder = require('../js/routing/graph-builder');
const CostModel = require('../js/routing/cost-model');
const SpatialSnapper = require('../js/routing/spatial-snapper');
const AStarRouter = require('../js/routing/a-star');
const ManeuverGenerator = require('../js/routing/maneuver-generator');
const { RoutingEngine } = require('../js/routing/routing-engine');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
    totalTests++;
    if (!condition) {
        console.error(`❌ FAIL: ${message}`);
        throw new Error(`Test failed: ${message}`);
    } else {
        console.log(`✅ PASS: ${message}`);
        passedTests++;
    }
}

console.log('\n==================================================');
console.log('RUNNING ROUTING ENGINE V2 TEST SUITE');
console.log('==================================================\n');

try {
    // -------------------------------------------------------------
    // TEST 1: Simple graph A -> B -> C
    // -------------------------------------------------------------
    {
        const g = GraphSchema.createGraph('test1');
        g.nodes.push(GraphSchema.createNode({ id: 'A', lat: 6.7000, lng: -1.6800 }));
        g.nodes.push(GraphSchema.createNode({ id: 'B', lat: 6.7005, lng: -1.6800 }));
        g.nodes.push(GraphSchema.createNode({ id: 'C', lat: 6.7010, lng: -1.6800 }));

        g.edges.push(GraphSchema.createEdge({ id: 'e1', from: 'A', to: 'B', distanceMeters: 50 }));
        g.edges.push(GraphSchema.createEdge({ id: 'e2', from: 'B', to: 'C', distanceMeters: 50 }));

        const engine = new RoutingEngine();
        engine.loadFromCanonical(g);

        const res = engine.calculateRoute({ lat: 6.7000, lng: -1.6800 }, { lat: 6.7010, lng: -1.6800 });
        assert(res.status === 'success', 'Test 1: Route computes successfully');
        assert(res.nodes.join('->') === 'A->B->C', 'Test 1: Sequence is A -> B -> C');
        assert(res.distanceMeters === 100, 'Test 1: Total distance is 100m');
    }

    // -------------------------------------------------------------
    // TEST 2: Two possible routes (selects shortest valid route)
    // -------------------------------------------------------------
    {
        const g = GraphSchema.createGraph('test2');
        g.nodes.push(GraphSchema.createNode({ id: 'A', lat: 6.7000, lng: -1.6800 }));
        g.nodes.push(GraphSchema.createNode({ id: 'B1', lat: 6.7005, lng: -1.6801 }));
        g.nodes.push(GraphSchema.createNode({ id: 'B2', lat: 6.7005, lng: -1.6799 }));
        g.nodes.push(GraphSchema.createNode({ id: 'C', lat: 6.7010, lng: -1.6800 }));

        // Path 1 via B1: 40 + 40 = 80m
        g.edges.push(GraphSchema.createEdge({ id: 'e1', from: 'A', to: 'B1', distanceMeters: 40 }));
        g.edges.push(GraphSchema.createEdge({ id: 'e2', from: 'B1', to: 'C', distanceMeters: 40 }));

        // Path 2 via B2: 60 + 60 = 120m
        g.edges.push(GraphSchema.createEdge({ id: 'e3', from: 'A', to: 'B2', distanceMeters: 60 }));
        g.edges.push(GraphSchema.createEdge({ id: 'e4', from: 'B2', to: 'C', distanceMeters: 60 }));

        const engine = new RoutingEngine();
        engine.loadFromCanonical(g);

        const res = engine.calculateRoute({ lat: 6.7000, lng: -1.6800 }, { lat: 6.7010, lng: -1.6800 });
        assert(res.status === 'success', 'Test 2: Shortest route computed');
        assert(res.nodes.join('->') === 'A->B1->C', 'Test 2: Chooses shorter path via B1');
        assert(res.distanceMeters === 80, 'Test 2: Distance matches shorter path (80m)');
    }

    // -------------------------------------------------------------
    // TEST 3: Disconnected destination
    // -------------------------------------------------------------
    {
        const g = GraphSchema.createGraph('test3');
        g.nodes.push(GraphSchema.createNode({ id: 'A', lat: 6.7000, lng: -1.6800 }));
        g.nodes.push(GraphSchema.createNode({ id: 'B', lat: 6.7005, lng: -1.6800 }));
        g.nodes.push(GraphSchema.createNode({ id: 'Island', lat: 6.7003, lng: -1.6802 })); // disconnected

        g.edges.push(GraphSchema.createEdge({ id: 'e1', from: 'A', to: 'B', distanceMeters: 50 }));

        const engine = new RoutingEngine();
        engine.loadFromCanonical(g);

        const res = engine.calculateRoute({ lat: 6.7000, lng: -1.6800 }, { lat: 6.7003, lng: -1.6802 });
        assert(res.status === 'no_route', 'Test 3: Returns no_route for disconnected destination');
    }

    // -------------------------------------------------------------
    // TEST 4: Blocked edge avoidance
    // -------------------------------------------------------------
    {
        const g = GraphSchema.createGraph('test4');
        g.nodes.push(GraphSchema.createNode({ id: 'A', lat: 6.7000, lng: -1.6800 }));
        g.nodes.push(GraphSchema.createNode({ id: 'B_closed', lat: 6.7005, lng: -1.6801 }));
        g.nodes.push(GraphSchema.createNode({ id: 'B_open', lat: 6.7005, lng: -1.6799 }));
        g.nodes.push(GraphSchema.createNode({ id: 'C', lat: 6.7010, lng: -1.6800 }));

        // Shorter direct path closed: status: 'closed'
        g.edges.push(GraphSchema.createEdge({ id: 'e1', from: 'A', to: 'B_closed', distanceMeters: 20, status: 'closed' }));
        g.edges.push(GraphSchema.createEdge({ id: 'e2', from: 'B_closed', to: 'C', distanceMeters: 20, status: 'closed' }));

        // Longer detour open
        g.edges.push(GraphSchema.createEdge({ id: 'e3', from: 'A', to: 'B_open', distanceMeters: 50 }));
        g.edges.push(GraphSchema.createEdge({ id: 'e4', from: 'B_open', to: 'C', distanceMeters: 50 }));

        const engine = new RoutingEngine();
        engine.loadFromCanonical(g);

        const res = engine.calculateRoute({ lat: 6.7000, lng: -1.6800 }, { lat: 6.7010, lng: -1.6800 });
        assert(res.status === 'success', 'Test 4: Route found despite closure');
        assert(res.nodes.join('->') === 'A->B_open->C', 'Test 4: Router circumvents blocked edge via B_open');
    }

    // -------------------------------------------------------------
    // TEST 5: One-way edge reverse traversal rejection
    // -------------------------------------------------------------
    {
        const g = GraphSchema.createGraph('test5');
        g.nodes.push(GraphSchema.createNode({ id: 'A', lat: 6.7000, lng: -1.6800 }));
        g.nodes.push(GraphSchema.createNode({ id: 'B', lat: 6.7005, lng: -1.6800 }));

        // One-way from A to B
        g.edges.push(GraphSchema.createEdge({ id: 'e1', from: 'A', to: 'B', distanceMeters: 50, bidirectional: false }));

        const engine = new RoutingEngine();
        engine.loadFromCanonical(g);

        // Forward traversal: A -> B
        const resFwd = engine.calculateRoute({ lat: 6.7000, lng: -1.6800 }, { lat: 6.7005, lng: -1.6800 });
        assert(resFwd.status === 'success', 'Test 5: Forward traversal along one-way allowed');

        // Reverse traversal: B -> A
        const resRev = engine.calculateRoute({ lat: 6.7005, lng: -1.6800 }, { lat: 6.7000, lng: -1.6800 });
        assert(resRev.status === 'no_route', 'Test 5: Reverse traversal along one-way rejected');
    }

    // -------------------------------------------------------------
    // TEST 6: Stairs traversal permitted in pedestrian profile
    // -------------------------------------------------------------
    {
        const g = GraphSchema.createGraph('test6');
        g.nodes.push(GraphSchema.createNode({ id: 'Ground', lat: 6.7000, lng: -1.6800 }));
        g.nodes.push(GraphSchema.createNode({ id: 'Upper', lat: 6.7002, lng: -1.6800 }));

        g.edges.push(GraphSchema.createEdge({ id: 'e_stair', from: 'Ground', to: 'Upper', type: 'stairs', distanceMeters: 15, floorChange: 1 }));

        const engine = new RoutingEngine();
        engine.loadFromCanonical(g);

        const res = engine.calculateRoute({ lat: 6.7000, lng: -1.6800 }, { lat: 6.7002, lng: -1.6800 }, { profile: 'pedestrian' });
        assert(res.status === 'success', 'Test 6: Pedestrian profile traverses stairs');
        assert(res.maneuvers.some(m => m.maneuver.type === 'take_stairs'), 'Test 6: Take stairs maneuver generated');
    }

    // -------------------------------------------------------------
    // TEST 7: Accessibility profile avoids stairs
    // -------------------------------------------------------------
    {
        const g = GraphSchema.createGraph('test7');
        g.nodes.push(GraphSchema.createNode({ id: 'Start', lat: 6.7000, lng: -1.6800 }));
        g.nodes.push(GraphSchema.createNode({ id: 'MidStairs', lat: 6.7003, lng: -1.6801 }));
        g.nodes.push(GraphSchema.createNode({ id: 'MidRamp', lat: 6.7003, lng: -1.6799 }));
        g.nodes.push(GraphSchema.createNode({ id: 'End', lat: 6.7006, lng: -1.6800 }));

        // Path A via stairs (shorter: 20 + 20 = 40m)
        g.edges.push(GraphSchema.createEdge({ id: 'e_stairs_1', from: 'Start', to: 'MidStairs', type: 'stairs', distanceMeters: 20, accessible: false }));
        g.edges.push(GraphSchema.createEdge({ id: 'e_stairs_2', from: 'MidStairs', to: 'End', distanceMeters: 20 }));

        // Path B via accessible ramp (longer: 40 + 40 = 80m)
        g.edges.push(GraphSchema.createEdge({ id: 'e_ramp_1', from: 'Start', to: 'MidRamp', type: 'ramp', distanceMeters: 40, accessible: true }));
        g.edges.push(GraphSchema.createEdge({ id: 'e_ramp_2', from: 'MidRamp', to: 'End', distanceMeters: 40, accessible: true }));

        const engine = new RoutingEngine();
        engine.loadFromCanonical(g);

        const res = engine.calculateRoute({ lat: 6.7000, lng: -1.6800 }, { lat: 6.7006, lng: -1.6800 }, { profile: 'accessible' });
        assert(res.status === 'success', 'Test 7: Route found under accessibility profile');
        assert(res.nodes.join('->') === 'Start->MidRamp->End', 'Test 7: Accessibility profile takes ramp and avoids stairs');
    }

    // -------------------------------------------------------------
    // TEST 8: GPS snapping to nearby edge
    // -------------------------------------------------------------
    {
        const g = GraphSchema.createGraph('test8');
        g.nodes.push(GraphSchema.createNode({ id: 'Node1', lat: 6.7000, lng: -1.6800 }));
        g.nodes.push(GraphSchema.createNode({ id: 'Node2', lat: 6.7010, lng: -1.6800 }));
        g.edges.push(GraphSchema.createEdge({ id: 'edge1', from: 'Node1', to: 'Node2', distanceMeters: 111 }));

        const engine = new RoutingEngine();
        engine.loadFromCanonical(g);

        // GPS point 10 meters east of Node1
        const gpsStart = { lat: 6.7000, lng: -1.67991 };
        const dest = { lat: 6.7010, lng: -1.6800 };

        const res = engine.calculateRoute(gpsStart, dest, { maxSnapDistanceMeters: 30 });
        assert(res.status === 'success', 'Test 8: Nearby GPS successfully snaps');
        assert(res.diagnostics.startSnapDistanceMeters < 15, 'Test 8: Snap distance within 15m');
    }

    // -------------------------------------------------------------
    // TEST 9: GPS too far away (start_not_snapped)
    // -------------------------------------------------------------
    {
        const g = GraphSchema.createGraph('test9');
        g.nodes.push(GraphSchema.createNode({ id: 'Node1', lat: 6.7000, lng: -1.6800 }));
        g.nodes.push(GraphSchema.createNode({ id: 'Node2', lat: 6.7010, lng: -1.6800 }));
        g.edges.push(GraphSchema.createEdge({ id: 'edge1', from: 'Node1', to: 'Node2', distanceMeters: 111 }));

        const engine = new RoutingEngine();
        engine.loadFromCanonical(g);

        // GPS point 500m away (outside maximum threshold of 60m)
        const farGps = { lat: 6.7050, lng: -1.6800 };
        const dest = { lat: 6.7010, lng: -1.6800 };

        const res = engine.calculateRoute(farGps, dest, { maxSnapDistanceMeters: 60 });
        assert(res.status === 'start_not_snapped', 'Test 9: Out of bounds GPS yields start_not_snapped');
    }

    // -------------------------------------------------------------
    // TEST 10: Indoor floor transition (Synthetic graph)
    // -------------------------------------------------------------
    {
        const g = GraphSchema.createGraph('test10');
        // Floor 0
        g.nodes.push(GraphSchema.createNode({ id: 'Room001', type: 'room', x: 5, y: 10, level: 0, buildingId: 'SynthBuilding' }));
        g.nodes.push(GraphSchema.createNode({ id: 'Stair0', type: 'stair', x: 20, y: 10, level: 0, buildingId: 'SynthBuilding' }));
        // Floor 1
        g.nodes.push(GraphSchema.createNode({ id: 'Stair1', type: 'stair', x: 20, y: 10, level: 1, buildingId: 'SynthBuilding' }));
        g.nodes.push(GraphSchema.createNode({ id: 'Room101', type: 'room', x: 35, y: 10, level: 1, buildingId: 'SynthBuilding' }));

        g.edges.push(GraphSchema.createEdge({ id: 'e_corr_0', from: 'Room001', to: 'Stair0', type: 'corridor', distanceMeters: 15 }));
        g.edges.push(GraphSchema.createEdge({ id: 'e_stair_trans', from: 'Stair0', to: 'Stair1', type: 'stairs', distanceMeters: 10, floorChange: 1 }));
        g.edges.push(GraphSchema.createEdge({ id: 'e_corr_1', from: 'Stair1', to: 'Room101', type: 'corridor', distanceMeters: 15 }));

        const prepared = GraphBuilder.prepareGraph(g);
        const costFn = (edge) => CostModel.calculateEdgeCost(edge, 'pedestrian');
        const path = AStarRouter.findPath(prepared, 'Room001', 'Room101', costFn);

        assert(path.success === true, 'Test 10: Indoor multi-floor path found');
        assert(path.pathNodeIds.join('->') === 'Room001->Stair0->Stair1->Room101', 'Test 10: Multi-floor sequence verified');
    }

    // -------------------------------------------------------------
    // TEST 11: Route geometry follows graph edges
    // -------------------------------------------------------------
    {
        const g = GraphSchema.createGraph('test11');
        g.nodes.push(GraphSchema.createNode({ id: 'A', lat: 6.7000, lng: -1.6800 }));
        g.nodes.push(GraphSchema.createNode({ id: 'B', lat: 6.7000, lng: -1.6810 })); // L-shape corner
        g.nodes.push(GraphSchema.createNode({ id: 'C', lat: 6.7010, lng: -1.6810 }));

        g.edges.push(GraphSchema.createEdge({ id: 'e1', from: 'A', to: 'B', distanceMeters: 111 }));
        g.edges.push(GraphSchema.createEdge({ id: 'e2', from: 'B', to: 'C', distanceMeters: 111 }));

        const engine = new RoutingEngine();
        engine.loadFromCanonical(g);

        const res = engine.calculateRoute({ lat: 6.7000, lng: -1.6800 }, { lat: 6.7010, lng: -1.6810 });
        assert(res.status === 'success', 'Test 11: Route computed');
        const coords = res.geometry.coordinates;
        assert(coords.length === 3, 'Test 11: Geometry includes corner vertex B (not straight line)');
        assert(coords[1][0] === -1.6810 && coords[1][1] === 6.7000, 'Test 11: Vertex B coordinate accurately matched');
    }

    // -------------------------------------------------------------
    // TEST 12: Legacy roads.geojson adapter verification
    // -------------------------------------------------------------
    {
        const roadsPath = path.join(__dirname, '../data/roads.geojson');
        const campusPath = path.join(__dirname, '../data/campus.geojson');

        const roadsGeo = JSON.parse(fs.readFileSync(roadsPath, 'utf8'));
        const campusGeo = JSON.parse(fs.readFileSync(campusPath, 'utf8'));

        const engine = new RoutingEngine();
        const loadRes = engine.loadFromGeoJSON([campusGeo, roadsGeo]);
        assert(loadRes.success === true, 'Test 12: Legacy roads & campus GeoJSON ingested into Graph 2.0');
        assert(engine.rawGraph.nodes.length >= 30, 'Test 12: Over 30 nodes derived from source datasets');
        assert(engine.rawGraph.edges.length >= 40, 'Test 12: Over 40 edges derived from source datasets');

        // Test route between two campus points on roads.geojson
        // e.g., near Commercial Area (-1.6814, 6.6974) to near Admin (-1.6820, 6.7004)
        const res = engine.calculateRoute(
            { lat: 6.6974, lng: -1.6814 },
            { lat: 6.7004, lng: -1.6820 },
            { maxSnapDistanceMeters: 100 }
        );
        assert(res.status === 'success', 'Test 12: Route computed across campus network');
        assert(res.geometry.coordinates.length > 2, 'Test 12: Realistic multi-segment route generated');
        assert(res.maneuvers.length >= 3, 'Test 12: Maneuvers generated for navigation');
    }

    // -------------------------------------------------------------
    // TEST 13: Snapping Review — Very close, moderate, beyond threshold & multiple candidate edges
    // -------------------------------------------------------------
    {
        const g = GraphSchema.createGraph('test13');
        // Two parallel edges:
        // Edge 1 (West Road): (6.7000, -1.6802) to (6.7010, -1.6802)
        // Edge 2 (East Road): (6.7000, -1.6800) to (6.7010, -1.6800)
        g.nodes.push(GraphSchema.createNode({ id: 'W1', lat: 6.7000, lng: -1.6802 }));
        g.nodes.push(GraphSchema.createNode({ id: 'W2', lat: 6.7010, lng: -1.6802 }));
        g.nodes.push(GraphSchema.createNode({ id: 'E1', lat: 6.7000, lng: -1.6800 }));
        g.nodes.push(GraphSchema.createNode({ id: 'E2', lat: 6.7010, lng: -1.6800 }));

        g.edges.push(GraphSchema.createEdge({ id: 'edge_w', from: 'W1', to: 'W2', distanceMeters: 111 }));
        g.edges.push(GraphSchema.createEdge({ id: 'edge_e', from: 'E1', to: 'E2', distanceMeters: 111 }));

        const prepared = GraphBuilder.prepareGraph(g);

        // Case A: Very close GPS (2 meters from E1)
        const snapVeryClose = SpatialSnapper.snapLocation(prepared, 6.7000, -1.680018, { maxSnapDistanceMeters: 50 });
        assert(snapVeryClose.success === true, 'Test 13A: Very close GPS snaps successfully');
        assert(snapVeryClose.distanceMeters < 3, 'Test 13A: Snap distance is accurately reported (< 3m)');
        assert(snapVeryClose.originalLat === 6.7000, 'Test 13A: Original GPS latitude preserved');

        // Case B: Moderate distance GPS (20 meters from East edge, but 40m from West edge)
        // GPS at (6.7005, -1.68018) -> Closer to West road than East road!
        const snapMulti = SpatialSnapper.snapLocation(prepared, 6.7005, -1.68018, { maxSnapDistanceMeters: 50 });
        assert(snapMulti.success === true, 'Test 13B: Moderate distance GPS selects nearest candidate edge');
        assert(snapMulti.edgeId === 'edge_w', 'Test 13B: Correctly chose closer West edge over East edge');

        // Case C: Beyond threshold GPS (70 meters away with 50m threshold)
        const snapFar = SpatialSnapper.snapLocation(prepared, 6.7000, -1.6793, { maxSnapDistanceMeters: 50 });
        assert(snapFar.success === false, 'Test 13C: Beyond threshold GPS rejected');
        assert(snapFar.reason === 'out_of_bounds', 'Test 13C: Rejection reason is out_of_bounds');
        assert(snapFar.distanceMeters > 50, 'Test 13C: Distance exceeds 50m threshold');
    }

    // -------------------------------------------------------------
    // TEST 14: Route Geometry Verification — Strict edge compliance (no straight-line shortcuts)
    // -------------------------------------------------------------
    {
        const g = GraphSchema.createGraph('test14');
        // Horseshoe detour: A -> B -> C -> D
        g.nodes.push(GraphSchema.createNode({ id: 'A', lat: 6.7000, lng: -1.6800 }));
        g.nodes.push(GraphSchema.createNode({ id: 'B', lat: 6.7000, lng: -1.6820 }));
        g.nodes.push(GraphSchema.createNode({ id: 'C', lat: 6.7020, lng: -1.6820 }));
        g.nodes.push(GraphSchema.createNode({ id: 'D', lat: 6.7020, lng: -1.6800 }));

        g.edges.push(GraphSchema.createEdge({ id: 'e1', from: 'A', to: 'B', distanceMeters: 222 }));
        g.edges.push(GraphSchema.createEdge({ id: 'e2', from: 'B', to: 'C', distanceMeters: 222 }));
        g.edges.push(GraphSchema.createEdge({ id: 'e3', from: 'C', to: 'D', distanceMeters: 222 }));

        const engine = new RoutingEngine();
        engine.loadFromCanonical(g);

        const res = engine.calculateRoute({ lat: 6.7000, lng: -1.6800 }, { lat: 6.7020, lng: -1.6800 });
        assert(res.status === 'success', 'Test 14: Route calculated');
        assert(res.nodes.length === 4, 'Test 14: Route visits all 4 detour nodes (no A->D direct shortcut)');
        assert(res.geometry.coordinates.length === 4, 'Test 14: Rendered geometry follows horseshoe edges exactly');
        assert(res.distanceMeters === 666, 'Test 14: Distance reflects true edge path (666m), not straight-line (222m)');
    }

    console.log(`\n==================================================`);
    console.log(`ALL TESTS PASSED: ${passedTests}/${totalTests}`);
    console.log(`==================================================\n`);

} catch (err) {
    console.error('\n❌ TEST SUITE FAILED WITH ERROR:', err);
    process.exit(1);
}
