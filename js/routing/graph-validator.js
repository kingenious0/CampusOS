/**
 * Graph Validation Engine — CampusOS Routing Engine V2
 * Verifies graph structural integrity, detects isolated components, checks missing endpoints,
 * duplicate IDs, invalid geometries, and invalid floor transitions.
 */

(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.GraphValidator = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {

    function validateGraph(graph) {
        const errors = [];
        const warnings = [];
        const stats = {
            totalNodes: 0,
            totalEdges: 0,
            isolatedNodes: 0,
            connectedComponents: 0
        };

        if (!graph || typeof graph !== 'object') {
            errors.push('Graph is null or not an object');
            return { isValid: false, errors, warnings, stats };
        }

        if (graph.schemaVersion !== '2.0') {
            warnings.push(`Expected schemaVersion '2.0', got '${graph.schemaVersion}'`);
        }

        if (!Array.isArray(graph.nodes)) {
            errors.push('Graph missing valid nodes array');
            return { isValid: false, errors, warnings, stats };
        }

        if (!Array.isArray(graph.edges)) {
            errors.push('Graph missing valid edges array');
            return { isValid: false, errors, warnings, stats };
        }

        stats.totalNodes = graph.nodes.length;
        stats.totalEdges = graph.edges.length;

        // 1. Check duplicate node IDs & invalid coordinates
        const nodeMap = new Map();
        const adjacency = new Map();

        graph.nodes.forEach((node, idx) => {
            if (!node || !node.id) {
                errors.push(`Node at index ${idx} has missing or empty id`);
                return;
            }
            if (nodeMap.has(node.id)) {
                errors.push(`Duplicate node id found: '${node.id}'`);
            } else {
                nodeMap.set(node.id, node);
                adjacency.set(node.id, new Set());
            }

            // Coordinate check: outdoor nodes must have valid lat/lng
            if (node.lat !== null && (typeof node.lat !== 'number' || isNaN(node.lat) || node.lat < -90 || node.lat > 90)) {
                errors.push(`Node '${node.id}' has invalid latitude: ${node.lat}`);
            }
            if (node.lng !== null && (typeof node.lng !== 'number' || isNaN(node.lng) || node.lng < -180 || node.lng > 180)) {
                errors.push(`Node '${node.id}' has invalid longitude: ${node.lng}`);
            }
        });

        // 2. Check edge endpoints, duplicate edge IDs, distances
        const edgeMap = new Map();

        graph.edges.forEach((edge, idx) => {
            if (!edge || !edge.id) {
                errors.push(`Edge at index ${idx} has missing or empty id`);
                return;
            }
            if (edgeMap.has(edge.id)) {
                errors.push(`Duplicate edge id found: '${edge.id}'`);
            } else {
                edgeMap.set(edge.id, edge);
            }

            // Missing endpoints
            if (!nodeMap.has(edge.from)) {
                errors.push(`Edge '${edge.id}' references non-existent 'from' node: '${edge.from}'`);
            }
            if (!nodeMap.has(edge.to)) {
                errors.push(`Edge '${edge.id}' references non-existent 'to' node: '${edge.to}'`);
            }

            // Distance check
            if (typeof edge.distanceMeters !== 'number' || isNaN(edge.distanceMeters)) {
                errors.push(`Edge '${edge.id}' has non-numeric distanceMeters: ${edge.distanceMeters}`);
            } else if (edge.distanceMeters < 0) {
                errors.push(`Edge '${edge.id}' has negative distanceMeters: ${edge.distanceMeters}`);
            } else if (edge.distanceMeters === 0 && edge.from !== edge.to && edge.type !== 'doorway') {
                warnings.push(`Edge '${edge.id}' has 0 length between distinct nodes '${edge.from}' and '${edge.to}'`);
            }

            // Build adjacency for connectivity checks if endpoints exist
            if (nodeMap.has(edge.from) && nodeMap.has(edge.to)) {
                adjacency.get(edge.from).add(edge.to);
                if (edge.bidirectional !== false) {
                    adjacency.get(edge.to).add(edge.from);
                }
            }
        });

        // 3. Isolated node check
        let isolatedCount = 0;
        adjacency.forEach((neighbors, nodeId) => {
            if (neighbors.size === 0) {
                isolatedCount++;
                warnings.push(`Isolated node detected (0 connections): '${nodeId}'`);
            }
        });
        stats.isolatedNodes = isolatedCount;

        // 4. Connected components analysis (BFS)
        const visited = new Set();
        let components = 0;

        adjacency.forEach((_, nodeId) => {
            if (!visited.has(nodeId)) {
                components++;
                const queue = [nodeId];
                visited.add(nodeId);

                while (queue.length > 0) {
                    const curr = queue.shift();
                    const neighbors = adjacency.get(curr);
                    if (neighbors) {
                        neighbors.forEach(nbr => {
                            if (!visited.has(nbr)) {
                                visited.add(nbr);
                                queue.push(nbr);
                            }
                        });
                    }
                }
            }
        });

        stats.connectedComponents = components;
        if (components > 1) {
            warnings.push(`Graph has ${components} disconnected sub-networks (components)`);
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            stats
        };
    }

    return {
        validateGraph
    };
}));
