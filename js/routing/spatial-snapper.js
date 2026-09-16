/**
 * Location Snapper & Network Correlator — CampusOS Routing Engine V2
 * Snaps raw GPS or query points to the closest routable node or edge segment
 * subject to a strict maximum snapping threshold.
 */

(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.SpatialSnapper = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {

    // Default maximum snapping distance: 60 meters for a walkable campus network
    const DEFAULT_MAX_SNAP_METERS = 60.0;

    /**
     * Great-circle distance between two coordinates in meters (Haversine formula)
     */
    function haversineDistance(lat1, lon1, lat2, lon2) {
        if (lat1 === lat2 && lon1 === lon2) return 0;
        const R = 6371000; // Earth radius in meters
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    /**
     * Project point P (lat, lng) onto line segment AB (latA, lngA) -> (latB, lngB).
     * Uses equirectangular approximation suitable for local campus scale (< 1 km).
     * Returns projected point { lat, lng } and distance in meters to P.
     */
    function projectPointOnSegment(pLat, pLng, aLat, aLng, bLat, bLng) {
        // Convert to local Cartesian meters relative to point A
        const R = 6371000;
        const rad = Math.PI / 180;
        const cosLat = Math.cos(((aLat + bLat) / 2) * rad);

        // Vector AB
        const dx = (bLng - aLng) * rad * R * cosLat;
        const dy = (bLat - aLat) * rad * R;
        const segLenSq = dx * dx + dy * dy;

        if (segLenSq === 0) {
            const dist = haversineDistance(pLat, pLng, aLat, aLng);
            return { lat: aLat, lng: aLng, distanceMeters: dist, t: 0 };
        }

        // Vector AP
        const px = (pLng - aLng) * rad * R * cosLat;
        const py = (pLat - aLat) * rad * R;

        // Scalar projection factor t, clamped to [0, 1]
        let t = (px * dx + py * dy) / segLenSq;
        t = Math.max(0, Math.min(1, t));

        // Projected coordinate
        const projLat = aLat + t * (bLat - aLat);
        const projLng = aLng + t * (bLng - aLng);
        const dist = haversineDistance(pLat, pLng, projLat, projLng);

        return { lat: projLat, lng: projLng, distanceMeters: dist, t };
    }

    /**
     * Snaps a query point to the network.
     * Searches both graph nodes and edge line segments.
     * 
     * @param {Object} graph Prepared graph containing nodes and edges
     * @param {number} lat Query latitude
     * @param {number} lng Query longitude
     * @param {Object} [options] Snapping options
     * @returns {Object} Snapping result with candidate node ID, snapped coords, distance, and success flag
     */
    function snapLocation(graph, lat, lng, options = {}) {
        const maxSnapMeters = options.maxSnapDistanceMeters || DEFAULT_MAX_SNAP_METERS;
        const targetNodeId = options.preferredNodeId;

        // If a specific preferred node is specified (e.g. authoritative building POI node)
        if (targetNodeId && graph.nodeMap && graph.nodeMap.has(targetNodeId)) {
            const node = graph.nodeMap.get(targetNodeId);
            if (node.lat !== null && node.lng !== null) {
                const dist = haversineDistance(lat, lng, node.lat, node.lng);
                if (dist <= maxSnapMeters) {
                    return {
                        success: true,
                        nodeId: node.id,
                        snappedLat: node.lat,
                        snappedLng: node.lng,
                        distanceMeters: dist,
                        snapType: 'exact_poi_node',
                        originalLat: lat,
                        originalLng: lng
                    };
                }
            }
        }

        let bestCandidate = null;
        let minDistance = Infinity;

        // 1. Check direct node distance
        if (graph.nodes && Array.isArray(graph.nodes)) {
            for (let i = 0; i < graph.nodes.length; i++) {
                const node = graph.nodes[i];
                if (node.lat === null || node.lng === null) continue;
                const d = haversineDistance(lat, lng, node.lat, node.lng);
                if (d < minDistance) {
                    minDistance = d;
                    bestCandidate = {
                        nodeId: node.id,
                        snappedLat: node.lat,
                        snappedLng: node.lng,
                        distanceMeters: d,
                        snapType: 'node_vertex'
                    };
                }
            }
        }

        // 2. Check edge segments for closer projection (sub-segment snapping)
        if (graph.edges && Array.isArray(graph.edges)) {
            for (let i = 0; i < graph.edges.length; i++) {
                const edge = graph.edges[i];
                if (edge.status === 'closed') continue;

                // Get segment endpoints
                let coords = null;
                if (edge.geometry && Array.isArray(edge.geometry.coordinates) && edge.geometry.coordinates.length >= 2) {
                    coords = edge.geometry.coordinates;
                } else if (graph.nodeMap) {
                    const u = graph.nodeMap.get(edge.from);
                    const v = graph.nodeMap.get(edge.to);
                    if (u && v && u.lat !== null && v.lat !== null) {
                        coords = [[u.lng, u.lat], [v.lng, v.lat]];
                    }
                }

                if (!coords) continue;

                for (let c = 0; c < coords.length - 1; c++) {
                    const p1 = coords[c];
                    const p2 = coords[c + 1];
                    const proj = projectPointOnSegment(lat, lng, p1[1], p1[0], p2[1], p2[0]);

                    if (proj.distanceMeters < minDistance) {
                        minDistance = proj.distanceMeters;
                        // Choose closer endpoint node ID as routing anchor for search
                        const dFrom = haversineDistance(proj.lat, proj.lng, p1[1], p1[0]);
                        const dTo = haversineDistance(proj.lat, proj.lng, p2[1], p2[0]);
                        const anchorNodeId = (dFrom <= dTo) ? edge.from : edge.to;

                        bestCandidate = {
                            nodeId: anchorNodeId,
                            edgeId: edge.id,
                            snappedLat: proj.lat,
                            snappedLng: proj.lng,
                            distanceMeters: proj.distanceMeters,
                            snapType: 'edge_projection',
                            projectionT: proj.t
                        };
                    }
                }
            }
        }

        // 3. Evaluate candidate against maxSnapMeters threshold
        if (!bestCandidate || minDistance > maxSnapMeters) {
            return {
                success: false,
                reason: 'out_of_bounds',
                distanceMeters: minDistance,
                maxSnapDistanceMeters: maxSnapMeters,
                originalLat: lat,
                originalLng: lng
            };
        }

        return {
            success: true,
            nodeId: bestCandidate.nodeId,
            edgeId: bestCandidate.edgeId || null,
            snappedLat: bestCandidate.snappedLat,
            snappedLng: bestCandidate.snappedLng,
            distanceMeters: bestCandidate.distanceMeters,
            snapType: bestCandidate.snapType,
            originalLat: lat,
            originalLng: lng
        };
    }

    return {
        DEFAULT_MAX_SNAP_METERS,
        haversineDistance,
        projectPointOnSegment,
        snapLocation
    };
}));
