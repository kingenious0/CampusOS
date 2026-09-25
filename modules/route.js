/**
 * Route Module - Real walking routes via OSRM (open-source routing engine)
 * Uses the public OSRM demo server for walking directions
 */
const RouteModule = (() => {
    let activeRouteLine = null;
    let activeRouteMarkers = [];

    const OSRM_BASE = 'https://router.project-osrm.org/route/v1/foot';

    const calculateRoute = async (destLat, destLng, destName, options = {}) => {
        const map = MapModule.getMap();
        const origin = MapModule.getUserLocation();

        // Check if destination building has multiple entrances configured
        let targetLat = destLat;
        let targetLng = destLng;
        let finalDestName = destName;
        let chosenEntrance = null;

        const bList = (typeof buildingsData !== 'undefined' && buildingsData) ||
                      (typeof window !== 'undefined' && window.CAMPUS_SEED_DATA?.buildings) || [];
        const bldg = options.building || bList.find(b =>
            (b.name && b.name.toLowerCase() === destName?.toLowerCase()) ||
            (Math.abs(b.lat - destLat) < 0.0005 && Math.abs(b.lng - destLng) < 0.0005)
        );

        const normFn = (typeof window !== 'undefined' && window.normalizeEntrances) ? window.normalizeEntrances : null;
        const entrances = options.entrances ? (normFn ? normFn(options.entrances) : options.entrances) :
                          (bldg?.entrance ? (normFn ? normFn(bldg.entrance) : bldg.entrance) : []);

        if (Array.isArray(entrances) && entrances.length > 0) {
            if (entrances.length === 1) {
                chosenEntrance = entrances[0];
            } else {
                let minDist = Infinity;
                for (const ent of entrances) {
                    const coords = Array.isArray(ent.coords) ? ent.coords : ent;
                    const lat = coords[1];
                    const lng = coords[0];
                    const d = Math.hypot((lat - origin.lat), (lng - origin.lng));
                    if (d < minDist) {
                        minDist = d;
                        chosenEntrance = ent;
                    }
                }
            }
            if (chosenEntrance) {
                const coords = Array.isArray(chosenEntrance.coords) ? chosenEntrance.coords : chosenEntrance;
                targetLng = coords[0];
                targetLat = coords[1];
                if (chosenEntrance.label && !finalDestName.toLowerCase().includes(chosenEntrance.label.toLowerCase())) {
                    finalDestName = `${finalDestName} (${chosenEntrance.label})`;
                }
            }
        }

        clearRoute(map);
        showRouteLoading(finalDestName);

        try {
            const url = `${OSRM_BASE}/${origin.lng},${origin.lat};${targetLng},${targetLat}?overview=full&geometries=geojson&steps=false`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.code !== 'Ok' || !data.routes.length) {
                throw new Error('No route found');
            }

            const route = data.routes[0];
            const distanceM = Math.round(route.distance);
            const durationMin = Math.ceil(route.duration / 60);
            const coords = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);

            // Draw route polyline
            activeRouteLine = L.polyline(coords, {
                color: '#4f46e5',
                weight: 5,
                opacity: 0.85,
                lineJoin: 'round',
                lineCap: 'round'
            }).addTo(map);

            // Animated dashed overlay
            L.polyline(coords, {
                color: '#ffffff',
                weight: 2,
                opacity: 0.6,
                dashArray: '8 12'
            }).addTo(map);
            activeRouteMarkers.push(activeRouteLine);

            // Origin pulse marker
            const originMarker = L.circleMarker([origin.lat, origin.lng], {
                radius: 8, color: '#4f46e5', fillColor: '#4f46e5',
                fillOpacity: 1, weight: 3
            }).addTo(map).bindTooltip('Your Location', { permanent: false });
            activeRouteMarkers.push(originMarker);

            // Destination flag
            const destMarker = L.marker([targetLat, targetLng], {
                icon: L.divIcon({
                    html: `<div class="dest-flag"><i class="fas fa-flag-checkered"></i></div>`,
                    iconSize: [36, 36], iconAnchor: [18, 36], className: ''
                })
            }).addTo(map).bindTooltip(finalDestName, { permanent: false });
            activeRouteMarkers.push(destMarker);

            // Fit map to route
            map.fitBounds(activeRouteLine.getBounds(), { padding: [60, 60] });

            displayRouteInfo(finalDestName, distanceM, durationMin);

        } catch (err) {
            console.error('Routing error:', err);
            // Fallback: straight-line with Haversine distance
            fallbackRoute(origin, targetLat, targetLng, finalDestName, map);
        }
    };

    const fallbackRoute = (origin, destLat, destLng, destName, map) => {
        const distanceM = haversine(origin.lat, origin.lng, destLat, destLng);
        const durationMin = Math.ceil(distanceM / (1.4 * 60));

        activeRouteLine = L.polyline(
            [[origin.lat, origin.lng], [destLat, destLng]],
            { color: '#4f46e5', weight: 4, opacity: 0.7, dashArray: '10 8' }
        ).addTo(map);
        activeRouteMarkers.push(activeRouteLine);

        map.fitBounds(activeRouteLine.getBounds(), { padding: [60, 60] });
        displayRouteInfo(destName, distanceM, durationMin, true);
    };

    const haversine = (lat1, lng1, lat2, lng2) => {
        const R = 6371000;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
        return Math.round(2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    };

    const displayRouteInfo = (destName, distanceM, durationMin, isFallback = false) => {
        const panel = document.getElementById('infoPanel');
        const distLabel = distanceM >= 1000
            ? `${(distanceM / 1000).toFixed(2)} km`
            : `${distanceM} m`;

        panel.innerHTML = `
            <div class="route-header">
                <i class="fas fa-route" style="color:#4f46e5"></i>
                <h3>Route to ${destName}</h3>
            </div>
            <div class="route-stats">
                <div class="stat-card">
                    <i class="fas fa-ruler-horizontal"></i>
                    <span class="stat-val">${distLabel}</span>
                    <span class="stat-label">Distance</span>
                </div>
                <div class="stat-card">
                    <i class="fas fa-person-walking"></i>
                    <span class="stat-val">${durationMin} min</span>
                    <span class="stat-label">Walk Time</span>
                </div>
            </div>
            ${isFallback ? '<p class="fallback-note"><i class="fas fa-triangle-exclamation"></i> Straight-line estimate (routing service unavailable)</p>' : ''}
            <button class="route-btn clear-btn" onclick="RouteModule.clearActiveRoute()">
                <i class="fas fa-times"></i> Clear Route
            </button>
        `;
    };

    const showRouteLoading = (destName) => {
        document.getElementById('infoPanel').innerHTML = `
            <div class="route-loading">
                <div class="spinner"></div>
                <p>Finding route to <strong>${destName}</strong>…</p>
            </div>
        `;
    };

    const clearRoute = (map) => {
        if (activeRouteLine && map.hasLayer(activeRouteLine)) {
            map.removeLayer(activeRouteLine);
        }
        activeRouteMarkers.forEach(m => { if (map.hasLayer(m)) map.removeLayer(m); });
        activeRouteMarkers = [];
        activeRouteLine = null;
    };

    const clearActiveRoute = () => {
        try { clearRoute(MapModule.getMap()); } catch (e) {}
        document.getElementById('infoPanel').innerHTML = `
            <h3>Select a location</h3>
            <p>Click on a marker to view details</p>
        `;
    };

    return { calculateRoute, clearActiveRoute };
})();