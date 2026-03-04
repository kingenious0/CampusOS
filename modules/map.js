/**
 * Map Module - Leaflet + OpenStreetMap for AAMUSTED Kumasi Campus
 */
const MapModule = (() => {
    let map;
    let markers = {};
    let buildingsData = [];
    let userMarker = null;
    let userLocation = null;

    // AAMUSTED campus centre — Google Maps verified
    const CAMPUS_CENTER = [6.697332044485389, -1.6815135625745574];
    const DEFAULT_ZOOM = 17;

    const typeConfig = {
        faculty:        { color: '#4f46e5', icon: 'fa-university',    label: 'Faculty' },
        lecture_hall:   { color: '#f59e0b', icon: 'fa-chalkboard',    label: 'Lecture Hall / Lab' },
        hostel:         { color: '#10b981', icon: 'fa-bed',           label: 'Hostel' },
        administration: { color: '#ef4444', icon: 'fa-building',      label: 'Administration' },
        facility:       { color: '#8b5cf6', icon: 'fa-circle-info',   label: 'Facility' }
    };

    const init = async () => {
        map = L.map('map', { zoomControl: true }).setView(CAMPUS_CENTER, DEFAULT_ZOOM);

        // OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | CampusOS – AAMUSTED Kumasi',
            maxZoom: 20
        }).addTo(map);

        await loadBuildingsData();
        addMarkers();
        requestUserLocation();

        // Campus boundary ring — 800m covers all campus buildings
        L.circle(CAMPUS_CENTER, {
            radius: 800,
            color: '#4f46e5',
            fillColor: '#4f46e5',
            fillOpacity: 0.04,
            weight: 2,
            dashArray: '6 4'
        }).addTo(map).bindTooltip('AAMUSTED Kumasi Campus', { permanent: false });
    };

    const loadBuildingsData = async () => {
        try {
            const response = await fetch('data/buildings.json');
            buildingsData = await response.json();
        } catch (error) {
            console.error('Error loading buildings data:', error);
            showMapError('Could not load campus data. Please refresh.');
        }
    };

    const addMarkers = () => {
        buildingsData.forEach(b => addMarker(b));
    };

    const addMarker = (building) => {
        const cfg = typeConfig[building.type] || typeConfig.facility;
        const icon = L.divIcon({
            html: `
                <div class="campus-marker" style="background:${cfg.color}">
                    <i class="fas ${cfg.icon}"></i>
                </div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
            popupAnchor: [0, -20],
            className: ''
        });

        const marker = L.marker([building.lat, building.lng], { icon })
            .addTo(map)
            .bindPopup(`
                <div class="map-popup">
                    <strong>${building.name}</strong>
                    <span class="popup-type" style="color:${cfg.color}">${cfg.label}</span>
                </div>
            `, { maxWidth: 220 });

        marker.on('click', () => {
            BuildingModule.displayInfo(building);
            // highlight active marker
            document.querySelectorAll('.campus-marker').forEach(el => el.classList.remove('active'));
            marker.getElement()?.querySelector('.campus-marker')?.classList.add('active');
        });

        markers[building.id] = marker;
    };

    const requestUserLocation = () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.watchPosition(
            (pos) => {
                const { latitude: lat, longitude: lng } = pos.coords;
                userLocation = { lat, lng };

                if (userMarker) {
                    userMarker.setLatLng([lat, lng]);
                } else {
                    userMarker = L.marker([lat, lng], {
                        icon: L.divIcon({
                            html: `<div class="user-marker"><i class="fas fa-person-walking"></i></div>`,
                            iconSize: [36, 36],
                            iconAnchor: [18, 18],
                            className: ''
                        }),
                        zIndexOffset: 1000
                    }).addTo(map).bindTooltip('You are here', { permanent: false });
                }
            },
            (err) => {
                console.warn('Geolocation unavailable:', err.message);
                // use campus center as fallback
                userLocation = { lat: CAMPUS_CENTER[0], lng: CAMPUS_CENTER[1] };
            },
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
        );
    };

    const filterMarkers = (filters) => {
        buildingsData.forEach(building => {
            const marker = markers[building.id];
            if (!marker) return;
            if (filters.includes(building.type)) {
                if (!map.hasLayer(marker)) marker.addTo(map);
            } else {
                if (map.hasLayer(marker)) map.removeLayer(marker);
            }
        });
    };

    const centerOnBuilding = (building) => {
        map.flyTo([building.lat, building.lng], 19, { duration: 1 });
        setTimeout(() => {
            if (markers[building.id]) markers[building.id].openPopup();
        }, 1100);
    };

    const showMapError = (msg) => {
        const el = document.getElementById('mapError');
        if (el) { el.textContent = msg; el.style.display = 'block'; }
    };

    const getMap = () => map;
    const getBuildingsData = () => buildingsData;
    const getUserLocation = () => userLocation || { lat: CAMPUS_CENTER[0], lng: CAMPUS_CENTER[1] };

    return { init, filterMarkers, centerOnBuilding, getBuildingsData, getMap, getUserLocation };
})();