/**
 * Main Application – CampusOS AAMUSTED Kumasi
 */
document.addEventListener('DOMContentLoaded', () => {
    // Only init map modules on the map page
    if (document.getElementById('map')) {
        MapModule.init().then(() => {
            SearchModule.init();
        });

        // Filter checkboxes
        document.querySelectorAll('.filter-checkbox').forEach(cb => {
            cb.addEventListener('change', () => {
                const active = Array.from(document.querySelectorAll('.filter-checkbox'))
                    .filter(c => c.checked)
                    .map(c => c.value);
                MapModule.filterMarkers(active);
            });
        });
    }
});