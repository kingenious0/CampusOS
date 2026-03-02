/**
 * Map Module - Handles Leaflet map initialization and marker management
 */

const MapModule = (() => {
    let map;
    let markers = {};
    let buildingsData = [];

    const init = async () => {
        // Initialize map centered on campus
        map = L.map('map').setView([6.8045, -1.0265], 16);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);

        // Load buildings data
        await loadBuildingsData();
        addMarkers();
    };

    const loadBuildingsData = async () => {
        try {
            const response = await fetch('data/buildings.json');
            buildingsData = await response.json();
        } catch (error) {
            console.error('Error loading buildings data:', error);
        }
    };

    const addMarkers = () => {
        buildingsData.forEach(building => {
            addMarker(building);
        });
    };

    const addMarker = (building) => {
        const icon = getMarkerIcon(building.type);
        const marker = L.marker([building.lat, building.lng], { icon })
            .addTo(map)
            .bindPopup(`<strong>${building.name}</strong><br>${building.type}`);

        marker.on('click', () => {
            BuildingModule.displayInfo(building);
        });

        markers[building.id] = marker;
    };

    const getMarkerIcon = (type) => {
        const colors = {
            building: '#2563eb',
            lecture_hall: '#f59e0b',
            hostel: '#10b981',
            department: '#8b5cf6'
        };

        return L.divIcon({
            html: `<div style="background-color: ${colors[type] || '#2563eb'}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"><i class="fas fa-map-pin" style="font-size: 14px;"></i></div>`,
            iconSize: [30, 30],
            className: 'custom-marker'
        });
    };

    const filterMarkers = (filters) => {
        Object.values(markers).forEach(marker => {
            map.removeLayer(marker);
        });
        markers = {};

        buildingsData.forEach(building => {
            if (filters.includes(building.type)) {
                addMarker(building);
            }
        });
    };

    const centerOnBuilding = (building) => {
        map.setView([building.lat, building.lng], 17);
        if (markers[building.id]) {
            markers[building.id].openPopup();
        }
    };

    const getBuildingsData = () => buildingsData;

    return {
        init,
        filterMarkers,
        centerOnBuilding,
        getBuildingsData
    };
})();