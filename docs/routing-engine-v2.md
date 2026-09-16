# Routing Engine V2 — Architecture & Technical Reference
**CampusOS (USTED Kumasi Campus)**  
**Version:** 2.0.0  
**Status:** Implemented & Verified

---

## 1. Executive Summary & Architecture
Routing Engine V2 is an industry-inspired, campus-scale offline pedestrian routing system designed following the core principles of engines such as OSRM and Valhalla.

The engine separates:
- **Canonical Routing Graph Data** (`js/routing/graph-schema.js`, `js/routing/graph-builder.js`) from graph search algorithms.
- **Location Snapping & Spatial Correlation** (`js/routing/spatial-snapper.js`) from route computation.
- **Traversal Costing & Profile Evaluation** (`js/routing/cost-model.js`) from path search.
- **Path Search (A*)** (`js/routing/a-star.js`) from user-facing turn instructions.
- **Maneuver Generation** (`js/routing/maneuver-generator.js`) from geometric graph edges.
- **Runtime Orchestration & In-Memory Preparation** (`js/routing/routing-engine.js`, `js/routing/routing-adapter.js`).

```
                              ┌────────────────────────────────────────┐
                              │ Source Data Ingestion (Read-Only)      │
                              │ - data/campus.geojson                  │
                              │ - data/roads.geojson                   │
                              └──────────────────┬─────────────────────┘
                                                 │
                                                 ▼
┌───────────────────────┐            ┌───────────────────────┐
│ Graph Validation      │◄───────────┤ GraphBuilder          │
│ (graph-validator.js)  │            │ (Ingest & Normalize)  │
└───────────────────────┘            └───────────┬───────────┘
                                                 │
                                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Prepared In-Memory Graph Index (Map<nodeId, Node>, Map<nodeId, Edge[]>) │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
   ┌───────────────────────────┐           ┌───────────────────────────┐
   │ SpatialSnapper            │           │ CostModel                 │
   │ (Nearest node/edge proj)  │           │ (Pedestrian / Accessible) │
   └─────────────┬─────────────┘           └─────────────┬─────────────┘
                 │                                       │
                 └───────────────────┬───────────────────┘
                                     ▼
                      ┌─────────────────────────────┐
                      │ A* Router (MinHeap + H)     │
                      │ (a-star.js)                 │
                      └──────────────┬──────────────┘
                                     │
                                     ▼
                      ┌─────────────────────────────┐
                      │ ManeuverGenerator           │
                      │ (Turn/stairs/arrive steps)  │
                      └──────────────┬──────────────┘
                                     │
                                     ▼
                      ┌─────────────────────────────┐
                      │ Structured Route Result     │
                      │ (Distance, Duration, Geom)  │
                      └──────────────┬──────────────┘
                                     │
                                     ▼
                      ┌─────────────────────────────┐
                      │ RoutingAdapter              │
                      │ (Drop-in for OfflineRouter) │
                      └─────────────────────────────┘
```

---

## 2. Canonical Routing Graph Schema (v2.0)
The canonical graph specification lives in [js/routing/graph-schema.js](file:///c:/Users/kinge/CampusMap/CampusOS/js/routing/graph-schema.js).

### Graph Container:
```json
{
  "schemaVersion": "2.0",
  "graphId": "usted-campus",
  "version": "2.0.0",
  "createdAt": "2026-09-16T...",
  "nodes": [],
  "edges": [],
  "metadata": {}
}
```

### Supported Node Types:
- `junction`
- `entrance`
- `door`
- `room`
- `office`
- `stair`
- `lift`
- `ramp`
- `facility`
- `campus_gate`
- `path_anchor`
- `floor_connector`

**Node Fields:**
`id`, `type`, `name`, `buildingId`, `floorId`, `lat`, `lng`, `x`, `y`, `level`, `metadata`.

### Supported Edge Types:
- `outdoor_path`
- `road`
- `walkway`
- `crossing`
- `corridor`
- `doorway`
- `entrance`
- `stairs`
- `lift`
- `ramp`

**Edge Fields:**
`id`, `from`, `to`, `type`, `distanceMeters`, `bidirectional`, `accessible`, `allowedModes`, `floorChange`, `status` (`open` | `closed` | `restricted`), `geometry`, `metadata`.

---

## 3. Data Integrity & Legacy Ingestion Rules
> [!IMPORTANT]
> The routing engine cannot compensate for inaccurate or incomplete source network data.

> [!NOTE]
> `roads.geojson` is currently a legacy/fallback routing source and is not automatically treated as a surveyed authoritative pedestrian network.

- `data/buildings.json`, `data/campus.geojson`, and `data/roads.geojson` remain **completely untouched**.
- [js/routing/graph-builder.js](file:///c:/Users/kinge/CampusMap/CampusOS/js/routing/graph-builder.js) ingests the LineStrings from source GeoJSON at runtime without mutating or rewriting disk files.
- Shared vertices between road and campus LineStrings are merged cleanly with 7-decimal place coordinate precision (~1.1 cm), building valid topology without fabricating non-existent physical connections.

---

## 4. Graph Search: A* Algorithm
Implemented in [js/routing/a-star.js](file:///c:/Users/kinge/CampusMap/CampusOS/js/routing/a-star.js).
- **Priority Queue:** Uses a binary MinHeap for $O(\log N)$ priority operations.
- **Admissible Heuristic:** $h(u, v) = \text{haversine}(u, v) / v_{\max}$, where $v_{\max} = 1.5\text{ m/s}$. Since straight-line distance divided by the maximum walking speed is strictly less than or equal to true path time, $h$ is guaranteed to never overestimate remaining travel cost.
- **Mixed Coordinates:** Supports Euclidean 2D distance for indoor local coordinates ($x, y$).

---

## 5. Costing & Profiles
Implemented in [js/routing/cost-model.js](file:///c:/Users/kinge/CampusMap/CampusOS/js/routing/cost-model.js).
- **Pedestrian Profile:** Standard walking pace ($1.35\text{ m/s}$). Permits stairs with an effort multiplier of $2.0\times$ and ramps with $1.2\times$.
- **Accessible Profile:** Strict wheelchair/stroller routing. Stairs yield `cost = Infinity` (impassable). Edges marked `accessible: false` are strictly avoided.
- **Edge Status:** Blocked edges (`status: "closed"`) are completely avoided during search.

---

## 6. Location Snapping & Network Correlation
Implemented in [js/routing/spatial-snapper.js](file:///c:/Users/kinge/CampusMap/CampusOS/js/routing/spatial-snapper.js).
- **Algorithm:** Checks both direct node distances and orthogonal projections onto edge segments using equirectangular projection.
- **Maximum Threshold:** Configured to $60\text{ meters}$ (`DEFAULT_MAX_SNAP_METERS`).
- If a GPS query is farther than $60\text{m}$ from any valid edge or node, the engine cleanly rejects the request with status `start_not_snapped` rather than silently mapping to an unrelated distant road.
- Preserves raw GPS coordinate and provides snap confidence diagnostics.

---

## 7. Maneuver Generation
Implemented in [js/routing/maneuver-generator.js](file:///c:/Users/kinge/CampusMap/CampusOS/js/routing/maneuver-generator.js).
- Computes azimuth bearings between consecutive vertices.
- Classifies turns deterministically: `straight`, `slight left/right`, `left/right`, `sharp left/right`.
- Generates domain-aware transitions: `take_stairs`, `take_lift`, `enter_building`, `cross_street`.
- Generates initial `depart` and terminal `arrive` steps.

---

## 8. Validation Engine
Implemented in [js/routing/graph-validator.js](file:///c:/Users/kinge/CampusMap/CampusOS/js/routing/graph-validator.js).
Checks:
1. Duplicate node IDs.
2. Missing node endpoint references on edges.
3. Coordinate validity.
4. Non-numeric or negative edge lengths.
5. Isolated nodes (degree 0).
6. Disconnected sub-networks / component counting using breadth-first search.

---

## 9. Prepared Graph & Offline Caching
- The canonical graph is parsed and indexed **once** on application boot.
- Adjacency and node maps are cached in memory. Subsequent route requests reuse the prepared graph in $O(1)$ time without rebuilding.
- Service Worker (`sw.js`) caches all routing engine modules under `ustednav-v4`.

---

## 10. Automated Test Suite (12 Core Tests)
Verified via `node tests/routing-engine.test.js`:
- **Test 1:** Simple graph $A \to B \to C$.
- **Test 2:** Two possible paths (chooses shortest).
- **Test 3:** Disconnected destination (`no_route`).
- **Test 4:** Blocked edge avoidance (`status: "closed"`).
- **Test 5:** One-way edge reverse traversal rejection.
- **Test 6:** Stairs traversal permitted under pedestrian profile.
- **Test 7:** Stairs avoided and ramp selected under accessible profile.
- **Test 8:** Nearby GPS snapping within threshold.
- **Test 9:** Out-of-bounds GPS rejected (`start_not_snapped`).
- **Test 10:** Multi-floor synthetic transition (Floor 0 to Floor 1 via stairs).
- **Test 11:** Route geometry fidelity (follows actual graph vertices, no shortcuts).
- **Test 12:** Legacy `roads.geojson` and `campus.geojson` ingestion and live routing.

All 29 assertions across 12 tests pass 100%.
