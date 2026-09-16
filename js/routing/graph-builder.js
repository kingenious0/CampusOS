/**
 * Graph Builder & Source Ingestion Engine — CampusOS Routing Engine V2
 * Ingests external source layers (roads.geojson, campus.geojson LineStrings)
 * and normalizes them into Canonical Routing Graph 2.0 without modifying source files.
 */

(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        const GraphSchema = require('./graph-schema');
        const SpatialSnapper = require('./spatial-snapper');
        module.exports = factory(GraphSchema, SpatialSnapper);
    } else {
        root.GraphBuilder = factory(root.GraphSchema, root.SpatialSnapper);
    }
}(typeof self !== 'undefined' ? self : this, function (GraphSchema, SpatialSnapper) {

    const haversine = SpatialSnapper.haversineDistance;

    /**
     * Build Canonical Graph from GeoJSON LineStrings (roads.geojson + campus.geojson).
     * Strictly creates clean nodes & edges without modifying source datasets.
     */
    function buildGraphFromGeoJSON(geojsonDataArray, options = {}) {
        const graph = GraphSchema.createGraph('usted-campus', {
            source: 'GeoJSON LineStrings ingestion',
            legacyFallback: true
        });

        const nodeCoordinateMap = new Map(); // Map<"lng,lat", nodeId>
        let nodeCounter = 0;
        let edgeCounter = 0;

        function getOrCreateNode(lng, lat) {
            // Round to 7 decimal places (~1.1cm precision) to coalesce shared junction vertices
            const key = `${lng.toFixed(7)},${lat.toFixed(7)}`;
            if (nodeCoordinateMap.has(key)) {
                return nodeCoordinateMap.get(key);
            }

            const nodeId = `node_${++nodeCounter}`;
            const node = GraphSchema.createNode({
                id: nodeId,
                type: 'junction',
                lat: lat,
                lng: lng,
                metadata: { coordKey: key }
            });

            graph.nodes.push(node);
            nodeCoordinateMap.set(key, nodeId);
            return nodeId;
        }

        geojsonDataArray.forEach(sourceData => {
            if (!sourceData || !Array.isArray(sourceData.features)) return;

            sourceData.features.forEach(feature => {
                if (!feature || !feature.geometry) return;
                const geomType = feature.geometry.type;
                const props = feature.properties || {};

                if (geomType === 'LineString') {
                    const coords = feature.geometry.coordinates;
                    if (!Array.isArray(coords) || coords.length < 2) return;

                    const edgeType = props.highway === 'footway' || props.highway === 'path' || props.pedestrian
                        ? 'walkway'
                        : 'road';

                    for (let i = 0; i < coords.length - 1; i++) {
                        const p1 = coords[i];
                        const p2 = coords[i + 1];
                        const uId = getOrCreateNode(p1[0], p1[1]);
                        const vId = getOrCreateNode(p2[0], p2[1]);

                        if (uId === vId) continue; // Skip zero-length loops

                        const dist = haversine(p1[1], p1[0], p2[1], p2[0]);
                        const edgeId = `edge_${++edgeCounter}`;

                        const edge = GraphSchema.createEdge({
                            id: edgeId,
                            from: uId,
                            to: vId,
                            type: edgeType,
                            distanceMeters: dist,
                            bidirectional: true,
                            accessible: true,
                            allowedModes: ['foot'],
                            geometry: {
                                type: 'LineString',
                                coordinates: [[p1[0], p1[1]], [p2[0], p2[1]]]
                            },
                            metadata: {
                                sourceFeatureId: feature.id || null,
                                name: props.name || ''
                            }
                        });

                        graph.edges.push(edge);
                    }
                }
            });
        });

        return graph;
    }

    /**
     * Prepares an in-memory graph index structure for fast O(1) lookups during A* search
     */
    function prepareGraph(graph) {
        const nodeMap = new Map();
        const adjacency = new Map();

        graph.nodes.forEach(node => {
            nodeMap.set(node.id, node);
            adjacency.set(node.id, []);
        });

        graph.edges.forEach(edge => {
            if (nodeMap.has(edge.from) && nodeMap.has(edge.to)) {
                adjacency.get(edge.from).push(edge);
                if (edge.bidirectional !== false) {
                    adjacency.get(edge.to).push(edge);
                }
            }
        });

        return {
            schemaVersion: graph.schemaVersion,
            graphId: graph.graphId,
            nodes: graph.nodes,
            edges: graph.edges,
            metadata: graph.metadata,
            nodeMap,
            adjacency
        };
    }

    return {
        buildGraphFromGeoJSON,
        prepareGraph
    };
}));
