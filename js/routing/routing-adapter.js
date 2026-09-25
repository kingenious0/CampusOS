/**
 * Routing Adapter & Public Interface — CampusOS Routing Engine V2
 * Provides seamless drop-in compatibility for existing callers of OfflineRouter in map.html,
 * wrapping RoutingEngineV2 while preserving the expected { distance, duration, geometry, steps } interface.
 */

(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        const RoutingEngineModule = require('./routing-engine');
        module.exports = factory(RoutingEngineModule);
    } else {
        root.OfflineRouterV2 = factory(root.RoutingEngineV2);
        // Expose as global OfflineRouter to maintain 100% backward compatibility with existing map.html logic
        root.OfflineRouter = root.OfflineRouterV2;
    }
}(typeof self !== 'undefined' ? self : this, function (RoutingEngineModule) {

    const engine = new RoutingEngineModule.RoutingEngine();

    return {
        /**
         * Initialize by loading campus.geojson and roads.geojson without modifying them
         */
        init: async () => {
            try {
                const [res1, res2] = await Promise.all([
                    fetch('./data/campus.geojson').then(r => r.json()),
                    fetch('./data/roads.geojson').then(r => r.json()).catch(() => ({ features: [] }))
                ]);

                const loadResult = engine.loadFromGeoJSON([res1, res2]);
                if (!loadResult.success) {
                    console.warn('OfflineRouterV2: Engine load issue:', loadResult.validation.errors);
                } else {
                    console.log('OfflineRouterV2: Engine ready with', engine.stats);
                }
            } catch (err) {
                console.warn('OfflineRouterV2 init error:', err);
            }
        },

        /**
         * Direct access to underlying RoutingEngine instance
         */
        getEngine: () => engine,

        /**
         * Backward compatible compute method called by map.html startRoute()
         * Signature: compute(slat, slng, dlat, dlng, options)
         * Returns { distance, duration, geometry, steps, status?, diagnostics? } or null
         */
        compute: (slat, slng, dlat, dlng, options = {}) => {
            const start = { lat: slat, lng: slng };
            const dest = {
                lat: dlat,
                lng: dlng,
                name: options.destName,
                entrance: options.entrance,
                entrances: options.entrances
            };

            const result = engine.calculateRoute(start, dest, options);

            if (result.status !== 'success' || !result.geometry) {
                return null;
            }

            // Map structured result into the shape expected by map.html startRoute() & liveNav
            return {
                distance: result.distanceMeters,
                duration: result.durationSeconds,
                geometry: result.geometry,
                steps: result.maneuvers,
                status: result.status,
                selectedEntrance: result.selectedEntrance,
                entranceName: result.entranceName,
                diagnostics: result.diagnostics
            };
        }
    };
}));
