/**
 * Canonical Routing Graph Schema Definition — Version 2.0
 * Defines the formal node, edge, and graph structures for CampusOS Routing Engine V2.
 */

(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.GraphSchema = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {

    const SCHEMA_VERSION = '2.0';

    const NODE_TYPES = Object.freeze([
        'junction',
        'entrance',
        'door',
        'room',
        'office',
        'stair',
        'lift',
        'ramp',
        'facility',
        'campus_gate',
        'path_anchor',
        'floor_connector'
    ]);

    const EDGE_TYPES = Object.freeze([
        'outdoor_path',
        'road',
        'walkway',
        'crossing',
        'corridor',
        'doorway',
        'entrance',
        'stairs',
        'lift',
        'ramp'
    ]);

    /**
     * Create a validated Node
     */
    function createNode(params) {
        if (!params || typeof params.id !== 'string' || !params.id.trim()) {
            throw new Error('GraphSchema: Node must have a valid non-empty string id');
        }
        const type = params.type || 'junction';
        if (!NODE_TYPES.includes(type)) {
            throw new Error(`GraphSchema: Invalid node type '${type}' for node ${params.id}`);
        }

        return {
            id: params.id,
            type: type,
            name: params.name || '',
            buildingId: params.buildingId || null,
            floorId: params.floorId || null,
            lat: typeof params.lat === 'number' && !isNaN(params.lat) ? params.lat : null,
            lng: typeof params.lng === 'number' && !isNaN(params.lng) ? params.lng : null,
            x: typeof params.x === 'number' && !isNaN(params.x) ? params.x : null,
            y: typeof params.y === 'number' && !isNaN(params.y) ? params.y : null,
            level: typeof params.level === 'number' ? params.level : 0,
            metadata: params.metadata && typeof params.metadata === 'object' ? { ...params.metadata } : {}
        };
    }

    /**
     * Create a validated Edge
     */
    function createEdge(params) {
        if (!params || typeof params.id !== 'string' || !params.id.trim()) {
            throw new Error('GraphSchema: Edge must have a valid non-empty string id');
        }
        if (!params.from || !params.to) {
            throw new Error(`GraphSchema: Edge ${params.id} missing 'from' or 'to' endpoint`);
        }
        const type = params.type || 'walkway';
        if (!EDGE_TYPES.includes(type)) {
            throw new Error(`GraphSchema: Invalid edge type '${type}' for edge ${params.id}`);
        }
        const distance = typeof params.distanceMeters === 'number' && !isNaN(params.distanceMeters) && params.distanceMeters >= 0
            ? params.distanceMeters
            : 0;

        return {
            id: params.id,
            from: params.from,
            to: params.to,
            type: type,
            distanceMeters: distance,
            bidirectional: params.bidirectional !== false, // default true
            accessible: params.accessible !== false,       // default true
            allowedModes: Array.isArray(params.allowedModes) && params.allowedModes.length > 0
                ? [...params.allowedModes]
                : ['foot'],
            floorChange: typeof params.floorChange === 'number' ? params.floorChange : 0,
            status: params.status || 'open', // open, closed, restricted
            geometry: params.geometry || null, // Optional GeoJSON LineString coordinates [[lng, lat], ...]
            metadata: params.metadata && typeof params.metadata === 'object' ? { ...params.metadata } : {}
        };
    }

    /**
     * Create an empty canonical Graph container
     */
    function createGraph(graphId = 'usted-campus', metadata = {}) {
        return {
            schemaVersion: SCHEMA_VERSION,
            graphId: graphId,
            version: '2.0.0',
            createdAt: new Date().toISOString(),
            nodes: [],
            edges: [],
            metadata: {
                description: 'CampusOS Canonical Routing Graph',
                ...metadata
            }
        };
    }

    return {
        SCHEMA_VERSION,
        NODE_TYPES,
        EDGE_TYPES,
        createNode,
        createEdge,
        createGraph
    };
}));
