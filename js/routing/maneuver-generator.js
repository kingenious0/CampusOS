/**
 * Maneuver & Turn-by-Turn Instruction Generator — CampusOS Routing Engine V2
 * Analyzes sequence of graph nodes and edges to produce deterministic navigation steps.
 */

(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.ManeuverGenerator = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {

    /**
     * Compute initial bearing (azimuth) from coordinate A to coordinate B in degrees [0, 360)
     */
    function computeBearing(lat1, lon1, lat2, lon2) {
        const rad = Math.PI / 180;
        const φ1 = lat1 * rad;
        const φ2 = lat2 * rad;
        const Δλ = (lon2 - lon1) * rad;

        const y = Math.sin(Δλ) * Math.cos(φ2);
        const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
        const θ = Math.atan2(y, x);
        return (θ * 180 / Math.PI + 360) % 360;
    }

    /**
     * Determine turn direction based on angular bearing difference
     */
    function classifyTurn(bearingDiff) {
        // Normalize diff to (-180, 180]
        let diff = (bearingDiff + 180) % 360 - 180;
        if (diff < -180) diff += 360;

        if (Math.abs(diff) < 20) return { type: 'continue', modifier: 'straight' };
        if (diff >= 20 && diff < 45) return { type: 'turn', modifier: 'slight right' };
        if (diff >= 45 && diff < 135) return { type: 'turn', modifier: 'right' };
        if (diff >= 135) return { type: 'turn', modifier: 'sharp right' };
        if (diff <= -20 && diff > -45) return { type: 'turn', modifier: 'slight left' };
        if (diff <= -45 && diff > -135) return { type: 'turn', modifier: 'left' };
        if (diff <= -135) return { type: 'turn', modifier: 'sharp left' };
        return { type: 'continue', modifier: 'straight' };
    }

    /**
     * Generate structured maneuver steps from calculated path
     * 
     * @param {Object} graph Prepared graph containing nodeMap
     * @param {Array<string>} pathNodeIds Sequence of node IDs along path
     * @param {Array<Object>} pathEdges Sequence of edge objects traversed
     * @param {Object} [options]
     * @returns {Array<Object>} Array of Mapbox/CampusOS-compatible step objects
     */
    function generateManeuvers(graph, pathNodeIds, pathEdges, options = {}) {
        if (!pathNodeIds || pathNodeIds.length === 0) return [];

        const nodeMap = graph.nodeMap || new Map();
        const steps = [];

        // 1. Depart maneuver
        const firstNode = nodeMap.get(pathNodeIds[0]);
        const startName = options.startName || (firstNode && firstNode.name) || 'Start location';
        steps.push({
            maneuver: {
                type: 'depart',
                modifier: '',
                location: firstNode && firstNode.lng !== null ? [firstNode.lng, firstNode.lat] : [0, 0]
            },
            name: `Depart from ${startName}`,
            distance: 0,
            duration: 0,
            intersections: firstNode && firstNode.lng !== null ? [{ location: [firstNode.lng, firstNode.lat] }] : []
        });

        if (pathEdges.length === 0) {
            // Already at destination
            steps.push({
                maneuver: { type: 'arrive', modifier: '', location: steps[0].maneuver.location },
                name: 'You are at your destination',
                distance: 0,
                duration: 0,
                intersections: steps[0].intersections
            });
            return steps;
        }

        let currentBearing = null;

        // Process edges
        for (let i = 0; i < pathEdges.length; i++) {
            const edge = pathEdges[i];
            const uId = pathNodeIds[i];
            const vId = pathNodeIds[i + 1];
            const uNode = nodeMap.get(uId);
            const vNode = nodeMap.get(vId);

            const hasCoords = uNode && vNode && uNode.lat !== null && vNode.lat !== null;
            let nextBearing = null;
            if (hasCoords) {
                nextBearing = computeBearing(uNode.lat, uNode.lng, vNode.lat, vNode.lng);
            }

            // Detect special structural transitions
            if (edge.type === 'stairs') {
                steps.push({
                    maneuver: { type: 'take_stairs', modifier: edge.floorChange > 0 ? 'up' : 'down' },
                    name: edge.floorChange > 0 ? 'Take stairs up' : 'Take stairs down',
                    distance: edge.distanceMeters,
                    duration: edge.distanceMeters / 1.0,
                    intersections: hasCoords ? [{ location: [uNode.lng, uNode.lat] }] : []
                });
            } else if (edge.type === 'lift') {
                steps.push({
                    maneuver: { type: 'take_lift', modifier: '' },
                    name: 'Take elevator to target floor',
                    distance: edge.distanceMeters,
                    duration: 30,
                    intersections: hasCoords ? [{ location: [uNode.lng, uNode.lat] }] : []
                });
            } else if (edge.type === 'entrance') {
                const bName = vNode && vNode.buildingId ? ` ${vNode.buildingId}` : '';
                steps.push({
                    maneuver: { type: 'enter_building', modifier: '' },
                    name: `Enter building${bName}`,
                    distance: edge.distanceMeters,
                    duration: edge.distanceMeters / 1.35,
                    intersections: hasCoords ? [{ location: [uNode.lng, uNode.lat] }] : []
                });
            } else if (edge.type === 'crossing') {
                steps.push({
                    maneuver: { type: 'cross_street', modifier: '' },
                    name: 'Cross designated walkway',
                    distance: edge.distanceMeters,
                    duration: edge.distanceMeters / 1.2,
                    intersections: hasCoords ? [{ location: [uNode.lng, uNode.lat] }] : []
                });
            } else if (currentBearing !== null && nextBearing !== null) {
                // Check if turn is needed
                const turn = classifyTurn(nextBearing - currentBearing);
                if (turn.type === 'turn') {
                    steps.push({
                        maneuver: { type: 'turn', modifier: turn.modifier },
                        name: `Turn ${turn.modifier}`,
                        distance: edge.distanceMeters,
                        duration: edge.distanceMeters / 1.35,
                        intersections: hasCoords ? [{ location: [uNode.lng, uNode.lat] }] : []
                    });
                } else {
                    // Continue along path
                    steps.push({
                        maneuver: { type: 'continue', modifier: 'straight' },
                        name: 'Continue along path',
                        distance: edge.distanceMeters,
                        duration: edge.distanceMeters / 1.35,
                        intersections: hasCoords ? [{ location: [uNode.lng, uNode.lat] }] : []
                    });
                }
            } else {
                steps.push({
                    maneuver: { type: 'continue', modifier: 'straight' },
                    name: 'Follow campus path',
                    distance: edge.distanceMeters,
                    duration: edge.distanceMeters / 1.35,
                    intersections: hasCoords ? [{ location: [uNode.lng, uNode.lat] }] : []
                });
            }

            if (nextBearing !== null) {
                currentBearing = nextBearing;
            }
        }

        // 3. Arrive maneuver
        const lastNode = nodeMap.get(pathNodeIds[pathNodeIds.length - 1]);
        const destName = options.destName || (lastNode && lastNode.name) || 'Destination';
        steps.push({
            maneuver: {
                type: 'arrive',
                modifier: '',
                location: lastNode && lastNode.lng !== null ? [lastNode.lng, lastNode.lat] : [0, 0]
            },
            name: `Arrive at ${destName}`,
            distance: 0,
            duration: 0,
            intersections: lastNode && lastNode.lng !== null ? [{ location: [lastNode.lng, lastNode.lat] }] : []
        });

        return steps;
    }

    return {
        computeBearing,
        classifyTurn,
        generateManeuvers
    };
}));
