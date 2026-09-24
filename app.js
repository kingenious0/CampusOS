/**
 * Main Application – USTED NAV USTED Kumasi
 */

// Service Worker Registration with Automatic Background Update & Controller Reload
let refreshing = false;
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            refreshing = true;
            window.location.reload();
        }
    });

    navigator.serviceWorker.register('/sw.js').then((reg) => {
        // Check for background worker update on every page load
        reg.update();
    }).catch(err => console.warn('SW registration failed:', err));
}

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