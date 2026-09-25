/**
 * Routing Engine V2 Orchestrator — CampusOS
 * Manages prepared graph lifecycle, location snapping, costing profile evaluation,
 * A* search execution, maneuver generation, and structured route result output.
 */

(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        const GraphSchema = require('./graph-schema');
        const GraphValidator = require('./graph-validator');
        const GraphBuilder = require('./graph-builder');
        const CostModel = require('./cost-model');
        const SpatialSnapper = require('./spatial-snapper');
        const AStarRouter = require('./a-star');
        const ManeuverGenerator = require('./maneuver-generator');

        module.exports = factory(
            GraphSchema,
            GraphValidator,
            GraphBuilder,
            CostModel,
            SpatialSnapper,
            AStarRouter,
            ManeuverGenerator
        );
    } else {
        root.RoutingEngineV2 = factory(
            root.GraphSchema,
            root.GraphValidator,
            root.GraphBuilder,
            root.CostModel,
            root.SpatialSnapper,
            root.AStarRouter,
            root.ManeuverGenerator
        );
    }
}(typeof self !== 'undefined' ? self : this, function (
    GraphSchema,
    GraphValidator,
    GraphBuilder,
    CostModel,
    SpatialSnapper,
    AStarRouter,
    ManeuverGenerator
) {

    class RoutingEngine {
        constructor() {
            this.rawGraph = null;
            this.preparedGraph = null;
            this.isReady = false;
            this.stats = null;
        }

        /**
         * Initialize with canonical graph data or GeoJSON sources
         */
        loadFromCanonical(canonicalGraph) {
            const validation = GraphValidator.validateGraph(canonicalGraph);
            if (!validation.isValid) {
                console.error('RoutingEngineV2: Graph validation failed:', validation.errors);
                return { success: false, validation };
            }
            if (validation.warnings.length > 0) {
                console.warn('RoutingEngineV2: Graph validation warnings:', validation.warnings);
            }

            this.rawGraph = canonicalGraph;
            this.preparedGraph = GraphBuilder.prepareGraph(canonicalGraph);
            this.stats = validation.stats;
            this.isReady = true;
            return { success: true, validation };
        }

        /**
         * Ingest GeoJSON array (roads.geojson + campus.geojson) and prepare graph
         */
        loadFromGeoJSON(geojsonDataArray) {
            const graph = GraphBuilder.buildGraphFromGeoJSON(geojsonDataArray);
            return this.loadFromCanonical(graph);
        }

        /**
         * Normalize entrance data from various formats (legacy [lng, lat], object, array of objects/coords)
         */
        static normalizeEntrances(raw) {
            if (!raw) return [];
            // Legacy single entrance: [lng, lat]
            if (Array.isArray(raw) && raw.length === 2 && typeof raw[0] === 'number' && typeof raw[1] === 'number') {
                return [{
                    id: 'ent-1',
                    label: 'Main Entrance',
                    coords: [raw[0], raw[1]],
                    isPrimary: true
                }];
            }
            // Multi-entrance format: array of entrance objects or coordinates
            if (Array.isArray(raw)) {
                let hasPrimary = false;
                const normalized = raw.map((item, idx) => {
                    if (!item) return null;
                    if (Array.isArray(item.coords) && item.coords.length >= 2) {
                        const isPrimary = item.isPrimary === true;
                        if (isPrimary && !hasPrimary) hasPrimary = true;
                        return {
                            id: String(item.id || `ent-${idx + 1}`),
                            label: String(item.label || (idx === 0 ? 'Main Entrance' : `Entrance ${idx + 1}`)),
                            coords: [Number(item.coords[0]), Number(item.coords[1])],
                            isPrimary: isPrimary
                        };
                    } else if (Array.isArray(item) && item.length >= 2 && typeof item[0] === 'number') {
                        return {
                            id: `ent-${idx + 1}`,
                            label: idx === 0 ? 'Main Entrance' : `Entrance ${idx + 1}`,
                            coords: [Number(item[0]), Number(item[1])],
                            isPrimary: idx === 0
                        };
                    }
                    return null;
                }).filter(Boolean);

                if (normalized.length > 0 && !hasPrimary) {
                    normalized[0].isPrimary = true;
                }
                return normalized;
            }
            return [];
        }

        /**
         * Calculate Route between two geographic locations with Virtual Edge Projection & Fallback Connectors.
         * Automatically selects closest entrance if multiple entrances are provided.
         * 
         * @param {Object} start { lat, lng, nodeId? }
         * @param {Object} dest { lat, lng, nodeId?, name?, entrance?: [lng, lat] | Array<Entrance> }
         * @param {Object} [options] { profile: 'pedestrian'|'accessible', maxSnapDistanceMeters: 150, buildings: [], entrances: [] }
         * @returns {Object} Structured route result
         */
        calculateRoute(start, dest, options = {}) {
            if (!this.isReady || !this.preparedGraph) {
                return {
                    status: 'graph_invalid',
                    message: 'Routing graph is not loaded or ready',
                    distanceMeters: 0,
                    durationSeconds: 0,
                    nodes: [],
                    edges: [],
                    geometry: null,
                    maneuvers: [],
                    diagnostics: { reason: 'prepared_graph_missing' }
                };
            }

            // Normalize any candidate entrances
            const rawEntrances = (options && options.entrances) || (options && options.entrance) || (dest && dest.entrances) || (dest && dest.entrance);
            const candidateEntrances = RoutingEngine.normalizeEntrances(rawEntrances);

            // If building has multiple entrances, calculate route to all available entrances and select the closest one
            if (candidateEntrances.length > 1) {
                let bestResult = null;
                let minDistance = Infinity;
                let bestEntrance = null;

                for (const ent of candidateEntrances) {
                    const singleDest = {
                        ...dest,
                        entrance: [ent.coords[0], ent.coords[1]],
                        entrances: undefined,
                        selectedEntrance: ent
                    };
                    const singleOptions = {
                        ...options,
                        entrance: [ent.coords[0], ent.coords[1]],
                        entrances: undefined,
                        entranceLabel: ent.label
                    };

                    const r = this._calculateSingleRoute(start, singleDest, singleOptions);
                    if (r && r.status === 'success') {
                        const dist = r.distanceMeters;
                        if (dist < minDistance || (dist === minDistance && ent.isPrimary && bestEntrance && !bestEntrance.isPrimary)) {
                            minDistance = dist;
                            bestResult = r;
                            bestEntrance = ent;
                        }
                    }
                }

                if (bestResult) {
                    bestResult.selectedEntrance = bestEntrance;
                    bestResult.entranceName = bestEntrance.label;
                    bestResult.allCandidateEntrances = candidateEntrances;
                    return bestResult;
                }
            }

            // Single entrance or centroid route
            const singleEntrance = candidateEntrances.length === 1 ? candidateEntrances[0] : null;
            const singleOptions = {
                ...options,
                entranceLabel: options.entranceLabel || (singleEntrance ? singleEntrance.label : undefined)
            };
            const singleDest = singleEntrance ? {
                ...dest,
                entrance: [singleEntrance.coords[0], singleEntrance.coords[1]],
                selectedEntrance: singleEntrance
            } : dest;

            const res = this._calculateSingleRoute(start, singleDest, singleOptions);
            if (res && res.status === 'success' && singleEntrance) {
                res.selectedEntrance = singleEntrance;
                res.entranceName = singleEntrance.label;
                res.allCandidateEntrances = candidateEntrances;
            }
            return res;
        }

        /**
         * Internal core calculation to a single coordinate target/entrance
         */
        _calculateSingleRoute(start, dest, options = {}) {
            const profile = options.profile || 'pedestrian';
            const maxSnapMeters = options.maxSnapDistanceMeters || SpatialSnapper.DEFAULT_MAX_SNAP_METERS;

            // Target destination coords (honoring explicit entrance coordinate if specified)
            const hasEntrance = Array.isArray(dest.entrance) && dest.entrance.length >= 2;
            const targetLat = hasEntrance ? dest.entrance[1] : dest.lat;
            const targetLng = hasEntrance ? dest.entrance[0] : dest.lng;

            // 1. Snap Start Location
            const snapStart = SpatialSnapper.snapLocation(this.preparedGraph, start.lat, start.lng, {
                maxSnapDistanceMeters: maxSnapMeters,
                preferredNodeId: start.nodeId
            });

            if (!snapStart.success) {
                return {
                    status: 'start_not_snapped',
                    message: 'Could not snap origin location to the routing network',
                    distanceMeters: 0,
                    durationSeconds: 0,
                    nodes: [],
                    edges: [],
                    geometry: null,
                    maneuvers: [],
                    diagnostics: {
                        snapDistanceMeters: snapStart.distanceMeters,
                        thresholdMeters: maxSnapMeters
                    }
                };
            }

            // 2. Snap Destination Location (at target/entrance)
            let snapDest = SpatialSnapper.snapLocation(this.preparedGraph, targetLat, targetLng, {
                maxSnapDistanceMeters: maxSnapMeters,
                preferredNodeId: dest.nodeId
            });

            const enableSafeFallback = options.safeFallback === true || options.buildings !== undefined || options.entrance !== undefined;

            if (!snapDest.success && enableSafeFallback) {
                const fallbackSnap = SpatialSnapper.snapLocation(this.preparedGraph, targetLat, targetLng, {
                    maxSnapDistanceMeters: Infinity,
                    fallbackToNearest: true
                });
                if (fallbackSnap.success) {
                    snapDest = fallbackSnap;
                }
            }

            if (!snapDest.success) {
                return {
                    status: 'dest_not_snapped',
                    message: 'Could not snap destination location to the routing network',
                    distanceMeters: 0,
                    durationSeconds: 0,
                    nodes: [],
                    edges: [],
                    geometry: null,
                    maneuvers: [],
                    diagnostics: {
                        snapDistanceMeters: snapDest.distanceMeters,
                        thresholdMeters: maxSnapMeters
                    }
                };
            }

            const cleanups = [];
            let startNodeId = snapStart.nodeId;
            let destNodeId = snapDest.nodeId;

            // 3. Virtual Edge Projection Injection:
            // If query point projects onto an edge segment, inject temporary virtual junction
            if (snapStart.snapType === 'edge_projection' && snapStart.edgeFrom && snapStart.edgeTo) {
                const vStartId = `_v_start_${Date.now()}`;
                const vRes = this._injectVirtualNode(vStartId, snapStart.snappedLat, snapStart.snappedLng, snapStart.edgeFrom, snapStart.edgeTo, snapStart.edgeType);
                if (vRes) {
                    startNodeId = vRes.virtualId;
                    cleanups.push(vRes.cleanup);
                }
            }

            if (snapDest.snapType === 'edge_projection' && snapDest.edgeFrom && snapDest.edgeTo) {
                const vDestId = `_v_dest_${Date.now()}`;
                const vRes = this._injectVirtualNode(vDestId, snapDest.snappedLat, snapDest.snappedLng, snapDest.edgeFrom, snapDest.edgeTo, snapDest.edgeType);
                if (vRes) {
                    destNodeId = vRes.virtualId;
                    cleanups.push(vRes.cleanup);
                }
            }

            // 4. Configure costing function for search
            const costFn = (edge) => CostModel.calculateEdgeCost(edge, profile, options);

            // 5. Run A* pathfinding
            let astarResult = AStarRouter.findPath(
                this.preparedGraph,
                startNodeId,
                destNodeId,
                costFn,
                options
            );

            let hasVirtualConnector = false;
            let minReachableDist = 0;

            // 6. Safe Fallback: If destination is in an isolated island, route to closest reachable node on network
            if (!astarResult.success && enableSafeFallback) {
                const reachable = new Set();
                const q = [startNodeId];
                reachable.add(startNodeId);
                while (q.length > 0) {
                    const curr = q.shift();
                    const edges = this.preparedGraph.adjacency.get(curr) || [];
                    for (const e of edges) {
                        const neighbor = e.from === curr ? e.to : e.from;
                        if (!reachable.has(neighbor)) {
                            reachable.add(neighbor);
                            q.push(neighbor);
                        }
                    }
                }

                let closestReachableId = null;
                let minDist = Infinity;
                for (const rId of reachable) {
                    const rNode = this.preparedGraph.nodeMap.get(rId);
                    if (!rNode || rNode.lat === null) continue;
                    const d = SpatialSnapper.haversineDistance(rNode.lat, rNode.lng, targetLat, targetLng);
                    if (d < minDist) {
                        minDist = d;
                        closestReachableId = rId;
                    }
                }

                if (closestReachableId && closestReachableId !== startNodeId) {
                    astarResult = AStarRouter.findPath(
                        this.preparedGraph,
                        startNodeId,
                        closestReachableId,
                        costFn,
                        options
                    );
                    if (astarResult.success) {
                        hasVirtualConnector = true;
                        minReachableDist = minDist;
                    }
                }
            }

            if (!astarResult.success) {
                cleanups.forEach(cleanupFn => cleanupFn());
                return {
                    status: 'no_route',
                    message: `No traversable path found: ${astarResult.message || 'target unreachable'}`,
                    diagnostics: {
                        profile: profile,
                        routingSource: 'CampusOS Local Prepared Graph',
                        computeTimeMs: astarResult.computeTimeMs,
                        nodesVisited: astarResult.nodesVisited
                    }
                };
            }

            // 7. Construct coordinates array
            const coordinates = [];
            const pathNodeIds = astarResult.success ? astarResult.pathNodeIds : [];
            const pathEdges = astarResult.success ? astarResult.pathEdges : [];

            // Add starting GPS position if offset from first graph point
            coordinates.push([start.lng, start.lat]);

            for (let i = 0; i < pathNodeIds.length; i++) {
                const node = this.preparedGraph.nodeMap.get(pathNodeIds[i]);
                if (node && node.lng !== null && node.lat !== null) {
                    // Avoid duplicating exact point
                    const last = coordinates[coordinates.length - 1];
                    if (!last || Math.abs(last[0] - node.lng) > 1e-7 || Math.abs(last[1] - node.lat) > 1e-7) {
                        coordinates.push([node.lng, node.lat]);
                    }
                }
            }

            // Add entrance / target coordinates
            const lastPoint = coordinates[coordinates.length - 1];
            if (SpatialSnapper.haversineDistance(lastPoint[1], lastPoint[0], targetLat, targetLng) > 1.5) {
                coordinates.push([targetLng, targetLat]);
            }

            // Clean up temporary virtual graph vertices & edges immediately
            cleanups.forEach(cleanupFn => cleanupFn());

            // 8. Compute accurate total distance
            let totalDistanceMeters = (astarResult && typeof astarResult.distanceMeters === 'number' && astarResult.distanceMeters > 0)
                ? astarResult.distanceMeters
                : 0;
            if (hasVirtualConnector && minReachableDist) {
                totalDistanceMeters += minReachableDist;
            } else if (!totalDistanceMeters) {
                for (let c = 0; c < coordinates.length - 1; c++) {
                    totalDistanceMeters += SpatialSnapper.haversineDistance(
                        coordinates[c][1], coordinates[c][0],
                        coordinates[c + 1][1], coordinates[c + 1][0]
                    );
                }
            } else {
                // Include connector walking distance to/from entrance doorway and origin
                if (snapDest && typeof snapDest.distanceMeters === 'number' && snapDest.distanceMeters > 1.0) {
                    totalDistanceMeters += snapDest.distanceMeters;
                }
                if (snapStart && typeof snapStart.distanceMeters === 'number' && snapStart.distanceMeters > 1.0) {
                    totalDistanceMeters += snapStart.distanceMeters;
                }
            }
            totalDistanceMeters = Math.round(totalDistanceMeters * 10) / 10;
            const durationSeconds = Math.round(totalDistanceMeters / 1.35); // standard ~4.8 km/h pedestrian speed

            // 9. If virtual connector was used, inject virtual connector edge into pathEdges
            if (hasVirtualConnector) {
                pathEdges.push({
                    id: 'virtual_entrance_connector',
                    type: 'virtual_connector',
                    distanceMeters: minReachableDist || 10,
                    status: 'open'
                });
            }

            // 10. Generate maneuvers with landmark cross-referencing
            const maneuvers = ManeuverGenerator.generateManeuvers(
                this.preparedGraph,
                pathNodeIds,
                pathEdges,
                {
                    startName: start.name || 'Your Location',
                    destName: dest.name || 'Destination',
                    entranceLabel: options.entranceLabel || (dest.selectedEntrance?.label),
                    buildings: options.buildings || []
                }
            );

            return {
                status: 'success',
                message: 'Route calculated successfully',
                distanceMeters: Math.round(totalDistanceMeters * 10) / 10,
                durationSeconds: durationSeconds,
                nodes: pathNodeIds,
                edges: pathEdges,
                geometry: {
                    type: 'LineString',
                    coordinates: coordinates
                },
                maneuvers: maneuvers,
                hasVirtualConnector: hasVirtualConnector,
                selectedEntrance: dest.selectedEntrance || null,
                entranceName: dest.selectedEntrance?.label || options.entranceLabel || null,
                diagnostics: {
                    profile: profile,
                    routingSource: 'CampusOS Local Prepared Graph',
                    computeTimeMs: astarResult.computeTimeMs || 1,
                    nodesVisited: astarResult.nodesVisited || coordinates.length,
                    startSnapDistanceMeters: Math.round(snapStart.distanceMeters * 10) / 10,
                    destSnapDistanceMeters: Math.round(snapDest.distanceMeters * 10) / 10,
                    hasEntranceOverride: hasEntrance
                }
            };
        }

        /**
         * Helper: Temporarily inject virtual projection vertex on edge
         */
        _injectVirtualNode(virtualId, lat, lng, fromId, toId, edgeType) {
            const u = this.preparedGraph.nodeMap.get(fromId);
            const v = this.preparedGraph.nodeMap.get(toId);
            if (!u || !v) return null;

            const vNode = {
                id: virtualId,
                type: 'virtual_projection',
                lat: lat,
                lng: lng,
                metadata: { virtual: true }
            };

            this.preparedGraph.nodeMap.set(virtualId, vNode);
            this.preparedGraph.adjacency.set(virtualId, []);

            const dU = SpatialSnapper.haversineDistance(u.lat, u.lng, lat, lng);
            const dV = SpatialSnapper.haversineDistance(lat, lng, v.lat, v.lng);

            const e1 = {
                id: `${virtualId}_e1`,
                from: fromId,
                to: virtualId,
                type: edgeType || 'walkway',
                distanceMeters: dU,
                bidirectional: true,
                allowedModes: ['foot'],
                status: 'open'
            };
            const e2 = {
                id: `${virtualId}_e2`,
                from: virtualId,
                to: toId,
                type: edgeType || 'walkway',
                distanceMeters: dV,
                bidirectional: true,
                allowedModes: ['foot'],
                status: 'open'
            };

            this.preparedGraph.adjacency.get(fromId).push(e1);
            this.preparedGraph.adjacency.get(virtualId).push(e1, e2);
            this.preparedGraph.adjacency.get(toId).push(e2);

            return {
                virtualId,
                cleanup: () => {
                    this.preparedGraph.nodeMap.delete(virtualId);
                    this.preparedGraph.adjacency.delete(virtualId);
                    const adjU = this.preparedGraph.adjacency.get(fromId);
                    if (adjU) {
                        const idx = adjU.findIndex(e => e.id === e1.id);
                        if (idx !== -1) adjU.splice(idx, 1);
                    }
                    const adjV = this.preparedGraph.adjacency.get(toId);
                    if (adjV) {
                        const idx = adjV.findIndex(e => e.id === e2.id);
                        if (idx !== -1) adjV.splice(idx, 1);
                    }
                }
            };
        }
    }

    return {
        RoutingEngine,
        normalizeEntrances: RoutingEngine.normalizeEntrances
    };
}));
