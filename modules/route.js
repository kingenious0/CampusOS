/**
 * Route Module - Handles route calculation and distance estimation
 */

const RouteModule = (() => {
    let userLocation = null;
    let routePolyline = null;

    const calculateRoute = (destLat, destLng, destName) => {
        // Get user's current location or use campus center as default
        if (!userLocation) {
            userLocation = { lat: 6.8045, lng: -1.0265 };
        }

        const distance = getDistance(userLocation.lat, userLocation.lng, destLat, destLng);
        const time = estimateTime(distance);

        displayRoute(userLocation.lat, userLocation.lng, destLat, destLng, distance, time, destName);
    };

    const getDistance = (lat1, lng1, lat2, lng2) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c * 1000).toFixed(0); // Return in meters
    };

    const estimateTime = (distanceMeters) => {
        const avgSpeed = 1.4; // m/s (average walking speed)
        const seconds = distanceMeters / avgSpeed;
        const minutes = Math.ceil(seconds / 60);
        return minutes;
    };

    const displayRoute = (startLat, startLng, endLat, endLng, distance, time, destName) => {
        const infoPanel = document.getElementById('infoPanel');
        const map = document.querySelector('.map').__map || L.map('map');

        // Remove previous route
        if (routePolyline) {
            map.removeLayer(routePolyline);
        }

        // Draw route line
        routePolyline = L.polyline(
            [[startLat, startLng], [endLat, endLng]],
            { color: '#2563eb', weight: 3, opacity: 0.7, dashArray: '5, 5' }
        ).addTo(map);

        // Fit map to route
        const group = new L.featureGroup([routePolyline]);
        map.fitBounds(group.getBounds().pad(0.1));

        // Display route info
        let html = `<h3>Route to ${destName}</h3>`;
        html += `<div class="building-info">`;
        html += `<div class="info-item"><strong>Distance:</strong><span>${distance}m</span></div>`;
        html += `<div class="info-item"><strong>Estimated Time:</strong><span>${time} minutes</span></div>`;
        html += `<div class="info-item"><strong>Walking Speed:</strong><span>1.4 m/s (average)</span></div>`;
        html += `</div>`;
        html += `<button class="route-btn" onclick="location.reload()">Clear Route</button>`;

        infoPanel.innerHTML = html;
    };

    return {
        calculateRoute
    };
})();