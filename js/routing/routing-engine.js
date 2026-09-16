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
         * Calculate Route between two geographic locations
         * 
         * @param {Object} start { lat, lng, nodeId? }
         * @param {Object} dest { lat, lng, nodeId?, name? }
         * @param {Object} [options] { profile: 'pedestrian'|'accessible', maxSnapDistanceMeters: 60 }
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

            const profile = options.profile || 'pedestrian';
            const maxSnapMeters = options.maxSnapDistanceMeters || SpatialSnapper.DEFAULT_MAX_SNAP_METERS;

            // 1. Snap Start Location
            const snapStart = SpatialSnapper.snapLocation(this.preparedGraph, start.lat, start.lng, {
                maxSnapDistanceMeters: maxSnapMeters,
                preferredNodeId: start.nodeId
            });

            if (!snapStart.success) {
                return {
                    status: 'start_not_snapped',
                    message: 'Your starting location is outside the mapped walking network.',
                    distanceMeters: 0,
                    durationSeconds: 0,
                    nodes: [],
                    edges: [],
                    geometry: null,
                    maneuvers: [],
                    diagnostics: {
                        snapDistanceMeters: snapStart.distanceMeters,
                        maxSnapDistanceMeters: maxSnapMeters,
                        query: { lat: start.lat, lng: start.lng }
                    }
                };
            }

            // 2. Snap Destination Location
            const snapDest = SpatialSnapper.snapLocation(this.preparedGraph, dest.lat, dest.lng, {
                maxSnapDistanceMeters: maxSnapMeters,
                preferredNodeId: dest.nodeId
            });

            if (!snapDest.success) {
                return {
                    status: 'destination_not_reachable',
                    message: 'Destination is outside the mapped walking network.',
                    distanceMeters: 0,
                    durationSeconds: 0,
                    nodes: [],
                    edges: [],
                    geometry: null,
                    maneuvers: [],
                    diagnostics: {
                        snapDistanceMeters: snapDest.distanceMeters,
                        maxSnapDistanceMeters: maxSnapMeters,
                        query: { lat: dest.lat, lng: dest.lng }
                    }
                };
            }

            // 3. Configure costing function for search
            const costFn = (edge) => CostModel.calculateEdgeCost(edge, profile, options);

            // 4. Run A* pathfinding
            const astarResult = AStarRouter.findPath(
                this.preparedGraph,
                snapStart.nodeId,
                snapDest.nodeId,
                costFn,
                options
            );

            if (!astarResult.success) {
                return {
                    status: 'no_route',
                    message: 'Unable to find a connected walking route.',
                    distanceMeters: 0,
                    durationSeconds: 0,
                    nodes: [],
                    edges: [],
                    geometry: null,
                    maneuvers: [],
                    diagnostics: {
                        startNode: snapStart.nodeId,
                        destNode: snapDest.nodeId,
                        nodesVisited: astarResult.nodesVisited,
                        computeTimeMs: astarResult.computeTimeMs
                    }
                };
            }

            // 5. Construct full route geometry from network edges
            const coordinates = [];
            const pathNodeIds = astarResult.pathNodeIds;
            const pathEdges = astarResult.pathEdges;

            for (let i = 0; i < pathNodeIds.length; i++) {
                const node = this.preparedGraph.nodeMap.get(pathNodeIds[i]);
                if (node && node.lng !== null && node.lat !== null) {
                    coordinates.push([node.lng, node.lat]);
                }
            }

            // 6. Generate maneuvers
            const maneuvers = ManeuverGenerator.generateManeuvers(
                this.preparedGraph,
                pathNodeIds,
                pathEdges,
                {
                    startName: start.name || 'Your Location',
                    destName: dest.name || 'Destination'
                }
            );

            return {
                status: 'success',
                message: 'Route calculated successfully',
                distanceMeters: Math.round(astarResult.distanceMeters * 10) / 10,
                durationSeconds: Math.round(astarResult.durationSeconds),
                nodes: pathNodeIds,
                edges: pathEdges,
                geometry: {
                    type: 'LineString',
                    coordinates: coordinates
                },
                maneuvers: maneuvers,
                diagnostics: {
                    profile: profile,
                    routingSource: 'CampusOS Local Prepared Graph',
                    computeTimeMs: astarResult.computeTimeMs,
                    nodesVisited: astarResult.nodesVisited,
                    startSnapDistanceMeters: Math.round(snapStart.distanceMeters * 10) / 10,
                    destSnapDistanceMeters: Math.round(snapDest.distanceMeters * 10) / 10
                }
            };
        }
    }

    return {
        RoutingEngine
    };
}));
