/**
 * Search Module - Handles search functionality and filtering
 */

const SearchModule = (() => {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    let buildingsData = [];

    const init = () => {
        buildingsData = MapModule.getBuildingsData();
        searchInput.addEventListener('input', handleSearch);
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (query.length === 0) {
            searchResults.innerHTML = '';
            return;
        }

        const results = buildingsData.filter(building =>
            building.name.toLowerCase().includes(query) ||
            building.type.toLowerCase().includes(query) ||
            (building.department && building.department.toLowerCase().includes(query)) ||
            (building.building && building.building.toLowerCase().includes(query))
        );

        displayResults(results);
    };

    const displayResults = (results) => {
        searchResults.innerHTML = '';

        if (results.length === 0) {
            searchResults.innerHTML = '<p style="color: var(--text-light); padding: 0.75rem;">No results found</p>';
            return;
        }

        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <strong>${result.name}</strong>
                <small>${result.type.replace('_', ' ').toUpperCase()}</small>
            `;
            resultItem.addEventListener('click', () => {
                MapModule.centerOnBuilding(result);
                BuildingModule.displayInfo(result);
                searchInput.value = result.name;
                searchResults.innerHTML = '';
            });
            searchResults.appendChild(resultItem);
        });
    };

    return {
        init
    };
})();