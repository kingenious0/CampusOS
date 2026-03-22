/**
 * Search Module - Smart campus location search for AAMUSTED
 */
const SearchModule = (() => {
    let searchInput, searchResults;
    let buildingsData = [];
    let debounceTimer;

    const typeLabels = {
        faculty: 'Faculty',
        lecture_hall: 'Lecture Hall / Lab',
        hostel: 'Hostel',
        administration: 'Administration',
        facility: 'Facility',
        service: 'Service',
        room: 'Room'
    };

    const typeColors = {
        faculty: '#4f46e5',
        lecture_hall: '#f59e0b',
        hostel: '#10b981',
        administration: '#ef4444',
        facility: '#8b5cf6',
        service: '#06b6d4',
        room: '#84cc16'
    };

    const init = () => {
        searchInput = document.getElementById('searchInput');
        searchResults = document.getElementById('searchResults');
        buildingsData = MapModule.getBuildingsData();

        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => handleSearch(e.target.value), 200);
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') clearSearch();
        });

        // Close results on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-section')) clearSearch();
        });
    };

    const handleSearch = (query) => {
        const q = query.toLowerCase().trim();
        searchResults.innerHTML = '';

        if (q.length < 2) return;

        let results = [];

        // Search buildings as before
        const buildingResults = buildingsData.filter(b =>
            b.name.toLowerCase().includes(q) ||
            (b.type && b.type.replace('_', ' ').toLowerCase().includes(q)) ||
            (b.description && b.description.toLowerCase().includes(q)) ||
            (b.department && b.department.toLowerCase().includes(q)) ||
            (b.facilities && b.facilities.some(f => f.toLowerCase().includes(q)))
        );

        // Search services
        const serviceResults = buildingsData.filter(b => b.services).flatMap(b =>
            b.services.filter(s => s.name.toLowerCase().includes(q)).map(s => ({...s, building: b, type: 'service'}))
        );

        // Search rooms
        const roomResults = buildingsData.filter(b => b.rooms).flatMap(b =>
            b.rooms.filter(r => r.number.toLowerCase().includes(q)).map(r => ({...r, building: b, type: 'room'}))
        );

        results = [...buildingResults, ...serviceResults, ...roomResults];

        displayResults(results, q);
    };

    const displayResults = (results, query) => {
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search-minus"></i>
                    <span>No results for "<strong>${query}</strong>"</span>
                </div>`;
            return;
        }

        results.forEach(r => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            const color = typeColors[r.type] || '#6b7280';
            const label = typeLabels[r.type] || r.type;

            let displayName = r.name;
            let subtitle = label;

            if (r.type === 'service') {
                displayName = r.name;
                subtitle = `Service at ${r.building.name}`;
            } else if (r.type === 'room') {
                displayName = r.number;
                subtitle = `Room in ${r.building.name}`;
            }

            item.innerHTML = `
                <div class="result-icon" style="background:${color}20; color:${color}">
                    <i class="fas ${getTypeIcon(r.type)}"></i>
                </div>
                <div class="result-text">
                    <strong>${highlightMatch(displayName, query)}</strong>
                    <small style="color:${color}">${subtitle}</small>
                </div>
            `;
            item.addEventListener('click', () => {
                if (r.type === 'service' || r.type === 'room') {
                    MapModule.centerOnBuilding(r.building);
                    BuildingModule.displayServiceOrRoom(r.building, r);
                } else {
                    MapModule.centerOnBuilding(r);
                    BuildingModule.displayInfo(r);
                }
                searchInput.value = displayName;
                searchResults.innerHTML = '';
            });
            searchResults.appendChild(item);
        });
    };

    const highlightMatch = (text, query) => {
        const idx = text.toLowerCase().indexOf(query.toLowerCase());
        if (idx === -1) return text;
        return text.slice(0, idx) +
            `<mark>${text.slice(idx, idx + query.length)}</mark>` +
            text.slice(idx + query.length);
    };

    const getTypeIcon = (type) => {
        const icons = {
            faculty: 'fa-university',
            lecture_hall: 'fa-chalkboard',
            hostel: 'fa-bed',
            administration: 'fa-building',
            facility: 'fa-circle-info',
            service: 'fa-concierge-bell',
            room: 'fa-door-open'
        };
        return icons[type] || 'fa-map-pin';
    };

    const clearSearch = () => {
        searchResults.innerHTML = '';
    };

    return { init };
})();