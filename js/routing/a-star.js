/**
 * A* Pathfinding Engine with MinHeap — CampusOS Routing Engine V2
 * Flexible, admissible heuristic graph search separating costing from topological search.
 */

(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.AStarRouter = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {

    /**
     * Binary Min-Heap Priority Queue for optimal O(log N) operations
     */
    class MinHeap {
        constructor() {
            this.heap = [];
        }

        push(node, priority) {
            this.heap.push({ node, priority });
            this._bubbleUp(this.heap.length - 1);
        }

        pop() {
            if (this.isEmpty()) return null;
            const top = this.heap[0];
            const bottom = this.heap.pop();
            if (this.heap.length > 0) {
                this.heap[0] = bottom;
                this._sinkDown(0);
            }
            return top;
        }

        isEmpty() {
            return this.heap.length === 0;
        }

        _bubbleUp(n) {
            const element = this.heap[n];
            while (n > 0) {
                const parentN = Math.floor((n - 1) / 2);
                const parent = this.heap[parentN];
                if (element.priority >= parent.priority) break;
                this.heap[parentN] = element;
                this.heap[n] = parent;
                n = parentN;
            }
        }

        _sinkDown(n) {
            const length = this.heap.length;
            const element = this.heap[n];
            while (true) {
                let leftChildN = 2 * n + 1;
                let rightChildN = 2 * n + 2;
                let swap = null;

                if (leftChildN < length) {
                    const leftChild = this.heap[leftChildN];
                    if (leftChild.priority < element.priority) {
                        swap = leftChildN;
                    }
                }

                if (rightChildN < length) {
                    const rightChild = this.heap[rightChildN];
                    if (
                        (swap === null && rightChild.priority < element.priority) ||
                        (swap !== null && rightChild.priority < this.heap[swap].priority)
                    ) {
                        swap = rightChildN;
                    }
                }

                if (swap === null) break;
                this.heap[n] = this.heap[swap];
                this.heap[swap] = element;
                n = swap;
            }
        }
    }

    /**
     * Great-circle distance (Haversine)
     */
    function haversine(lat1, lon1, lat2, lon2) {
        if (lat1 === lat2 && lon1 === lon2) return 0;
        const R = 6371000;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    /**
     * Euclidean 2D distance for indoor/local coordinates
     */
    function euclideanDistance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Admissible heuristic h(u, v):
     * Never overestimates actual cost to reach goal.
     * Expressed in equivalent impedance time (seconds) using max walking speed (e.g. 1.5 m/s).
     */
    function calculateHeuristic(nodeA, nodeB, maxWalkingSpeed = 1.5) {
        if (!nodeA || !nodeB) return 0;

        // Outdoor geographic coordinates
        if (nodeA.lat !== null && nodeA.lng !== null && nodeB.lat !== null && nodeB.lng !== null) {
            const straightDistance = haversine(nodeA.lat, nodeA.lng, nodeB.lat, nodeB.lng);
            return straightDistance / maxWalkingSpeed;
        }

        // Indoor local coordinates
        if (nodeA.x !== null && nodeA.y !== null && nodeB.x !== null && nodeB.y !== null) {
            const straightDistance = euclideanDistance(nodeA.x, nodeA.y, nodeB.x, nodeB.y);
            return straightDistance / maxWalkingSpeed;
        }

        return 0;
    }

    /**
     * Find shortest path using A*
     * 
     * @param {Object} preparedGraph Prepared graph indexed with nodeMap and adjacency
     * @param {string} startNodeId Origin node ID
     * @param {string} destNodeId Destination node ID
     * @param {Function} costCalculator Function(edge) returning { traversable, cost, durationSeconds, distanceMeters }
     * @param {Object} [options]
     * @returns {Object} Search result: { success, pathNodeIds, pathEdges, distanceMeters, durationSeconds, nodesVisited }
     */
    function findPath(preparedGraph, startNodeId, destNodeId, costCalculator, options = {}) {
        const startTime = Date.now();
        const nodeMap = preparedGraph.nodeMap;
        const adjacency = preparedGraph.adjacency;

        if (!nodeMap.has(startNodeId)) {
            return { success: false, status: 'invalid_start', reason: `Start node '${startNodeId}' not in graph` };
        }
        if (!nodeMap.has(destNodeId)) {
            return { success: false, status: 'invalid_destination', reason: `Destination node '${destNodeId}' not in graph` };
        }

        if (startNodeId === destNodeId) {
            const node = nodeMap.get(startNodeId);
            return {
                success: true,
                status: 'success',
                pathNodeIds: [startNodeId],
                pathEdges: [],
                distanceMeters: 0,
                durationSeconds: 0,
                nodesVisited: 1,
                computeTimeMs: Date.now() - startTime
            };
        }

        const targetNode = nodeMap.get(destNodeId);
        const maxSpeed = options.maxWalkingSpeed || 1.5;

        // A* State data structures
        const gScore = new Map(); // Best cost from start to node
        const fScore = new Map(); // Estimated total cost: gScore + h
        const cameFrom = new Map(); // Map<nodeId, { fromNodeId, edge }>
        const openSet = new MinHeap();
        const closedSet = new Set();

        gScore.set(startNodeId, 0);
        const startH = calculateHeuristic(nodeMap.get(startNodeId), targetNode, maxSpeed);
        fScore.set(startNodeId, startH);
        openSet.push(startNodeId, startH);

        let nodesVisited = 0;

        while (!openSet.isEmpty()) {
            const { node: currId } = openSet.pop();

            if (currId === destNodeId) {
                // Target reached! Reconstruct path.
                const pathNodeIds = [];
                const pathEdges = [];
                let curr = destNodeId;
                let totalDist = 0;
                let totalDuration = 0;

                while (curr !== startNodeId) {
                    pathNodeIds.unshift(curr);
                    const edgeData = cameFrom.get(curr);
                    if (!edgeData) break;
                    pathEdges.unshift(edgeData.edge);
                    totalDist += edgeData.edge.distanceMeters || 0;
                    totalDuration += edgeData.costResult.durationSeconds || (edgeData.edge.distanceMeters / 1.35);
                    curr = edgeData.fromNodeId;
                }
                pathNodeIds.unshift(startNodeId);

                return {
                    success: true,
                    status: 'success',
                    pathNodeIds,
                    pathEdges,
                    distanceMeters: totalDist,
                    durationSeconds: totalDuration,
                    nodesVisited,
                    computeTimeMs: Date.now() - startTime
                };
            }

            if (closedSet.has(currId)) continue;
            closedSet.add(currId);
            nodesVisited++;

            const currentG = gScore.get(currId);
            const outgoingEdges = adjacency.get(currId) || [];

            for (let i = 0; i < outgoingEdges.length; i++) {
                const edge = outgoingEdges[i];

                // Respect directionality:
                // If edge is one-way (bidirectional === false), verify edge.from === currId
                if (edge.bidirectional === false && edge.from !== currId) {
                    continue; // Disallow reverse traversal of one-way edge
                }

                const neighborId = (edge.from === currId) ? edge.to : edge.from;
                if (closedSet.has(neighborId)) continue;

                // Evaluate costing profile
                const costResult = costCalculator(edge);
                if (!costResult.traversable || !isFinite(costResult.cost)) {
                    continue; // Skip impassable/restricted edge
                }

                const tentativeG = currentG + costResult.cost;
                const neighborG = gScore.has(neighborId) ? gScore.get(neighborId) : Infinity;

                if (tentativeG < neighborG) {
                    gScore.set(neighborId, tentativeG);
                    const h = calculateHeuristic(nodeMap.get(neighborId), targetNode, maxSpeed);
                    const f = tentativeG + h;
                    fScore.set(neighborId, f);
                    cameFrom.set(neighborId, { fromNodeId: currId, edge, costResult });
                    openSet.push(neighborId, f);
                }
            }
        }

        // Target unreachable
        return {
            success: false,
            status: 'no_route',
            reason: 'No connected navigable route exists between points',
            nodesVisited,
            computeTimeMs: Date.now() - startTime
        };
    }

    return {
        MinHeap,
        haversine,
        calculateHeuristic,
        findPath
    };
}));
