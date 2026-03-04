/**
 * Building Module - Displays building info in the sidebar panel
 */
const BuildingModule = (() => {

    const typeLabels = {
        faculty:        { label: 'Faculty',               color: '#4f46e5', icon: 'fa-university' },
        lecture_hall:   { label: 'Lecture Hall / Lab',    color: '#f59e0b', icon: 'fa-chalkboard' },
        hostel:         { label: 'Student Hostel',        color: '#10b981', icon: 'fa-bed' },
        administration: { label: 'Administration',        color: '#ef4444', icon: 'fa-building' },
        facility:       { label: 'Campus Facility',       color: '#8b5cf6', icon: 'fa-circle-info' }
    };

    const displayInfo = (building) => {
        const panel = document.getElementById('infoPanel');
        const cfg = typeLabels[building.type] || { label: building.type, color: '#6b7280', icon: 'fa-map-pin' };

        let html = `
            <div class="building-header">
                <div class="bh-icon" style="background:${cfg.color}20; color:${cfg.color}">
                    <i class="fas ${cfg.icon}"></i>
                </div>
                <div>
                    <h3>${building.name}</h3>
                    <span class="type-badge" style="background:${cfg.color}20; color:${cfg.color}">${cfg.label}</span>
                </div>
            </div>
        `;

        if (building.description) {
            html += `<p class="building-desc">${building.description}</p>`;
        }

        html += `<div class="info-list">`;

        if (building.capacity) {
            html += infoRow('fa-users', 'Capacity', `${building.capacity.toLocaleString()} people`);
        }
        if (building.floors) {
            html += infoRow('fa-layer-group', 'Floors', `${building.floors} floor${building.floors > 1 ? 's' : ''}`);
        }
        if (building.department) {
            html += infoRow('fa-sitemap', 'Department', building.department);
        }
        if (building.facilities?.length) {
            html += infoRow('fa-list-check', 'Facilities', building.facilities.join(' &bull; '));
        }
        if (building.equipment?.length) {
            html += infoRow('fa-plug', 'Equipment', building.equipment.join(' &bull; '));
        }
        if (building.contact) {
            html += infoRow('fa-envelope', 'Contact', `<a href="mailto:${building.contact}">${building.contact}</a>`);
        }
        if (building.office_hours) {
            html += infoRow('fa-clock', 'Hours', building.office_hours);
        }

        html += `</div>`;

        html += `
            <button class="route-btn" onclick="RouteModule.calculateRoute(${building.lat}, ${building.lng}, '${building.name.replace(/'/g, "\\'")}')">
                <i class="fas fa-diamond-turn-right"></i> Get Directions
            </button>
        `;

        panel.innerHTML = html;
    };

    const infoRow = (icon, label, value) => `
        <div class="info-row">
            <span class="info-icon"><i class="fas ${icon}"></i></span>
            <div class="info-content">
                <span class="info-label">${label}</span>
                <span class="info-value">${value}</span>
            </div>
        </div>
    `;

    return { displayInfo };
})();