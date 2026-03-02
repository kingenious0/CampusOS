/**
 * Main Application - Initializes all modules
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize map
    MapModule.init();

    // Initialize search
    setTimeout(() => {
        SearchModule.init();
    }, 500);

    // Handle filter checkboxes
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const activeFilters = Array.from(filterCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
            MapModule.filterMarkers(activeFilters);
        });
    });
});