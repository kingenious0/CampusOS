/**
 * Building Module - Displays building info in the sidebar panel
 */
const BuildingModule = (() => {

    const typeLabels = {
        faculty:        { label: 'Faculty',               color: '#4f46e5', icon: 'fa-university' },
        lecture_hall:   { label: 'Lecture Hall / Lab',    color: '#f59e0b', icon: 'fa-chalkboard' },
        hostel:         { label: 'Hall of Residence',     color: '#10b981', icon: 'fa-bed' },
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

    const displayServiceOrRoom = (building, item) => {
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

        // Display specific service or room info
        if (item.type === 'service') {
            html += infoRow('fa-concierge-bell', 'Service', item.name);
            if (item.description) html += infoRow('fa-info-circle', 'Description', item.description);
            if (item.requirements) html += infoRow('fa-list-check', 'Requirements', item.requirements);
            if (item.hours) html += infoRow('fa-clock', 'Hours', item.hours);
        } else if (item.type === 'room') {
            html += infoRow('fa-door-open', 'Room Number', item.number);
            if (item.floor) html += infoRow('fa-layer-group', 'Floor', item.floor);
            if (item.description) html += infoRow('fa-info-circle', 'Description', item.description);
        }

        // Add building hours if available
        if (building.hours) {
            html += infoRow('fa-clock', 'Building Hours', building.hours);
        }

        if (building.contact) {
            html += infoRow('fa-envelope', 'Contact', `<a href="mailto:${building.contact}">${building.contact}</a>`);
        }

        html += `</div>`;

        html += `
            <button class="route-btn" onclick="RouteModule.calculateRoute(${building.lat}, ${building.lng}, '${building.name.replace(/'/g, "\\'")}')">
                <i class="fas fa-diamond-turn-right"></i> Get Directions
            </button>
        `;

        panel.innerHTML = html;
    };

    const displayStaff = (building, person) => {
        const panel = document.getElementById('infoPanel');
        if (!panel) return;
        const b = building || { name: person.location?.building || 'Campus Building', lat: 6.697332, lng: -1.681513 };
        const bName = b.name;
        const floor = person.location?.floor;
        const room = person.location?.room;
        const roomStr = room ? (room.match(/^(room|rm|office)/i) ? room : `Room ${room}`) : '';
        
        let breadcrumb = bName;
        if (person.location?.status === 'building_only' || !roomStr) {
            breadcrumb = `${bName} (${person.name})`;
        } else if (floor && roomStr) {
            breadcrumb = `${bName} — ${floor}, ${roomStr} (${person.name})`;
        } else if (roomStr) {
            breadcrumb = `${bName} — ${roomStr} (${person.name})`;
        } else if (floor) {
            breadcrumb = `${bName} — ${floor} (${person.name})`;
        } else {
            breadcrumb = `${bName} (${person.name})`;
        }

        let html = `
            <div class="building-header">
                <div class="bh-icon" style="background:#4f46e520; color:#4f46e5">
                    <i class="fas fa-user-graduate"></i>
                </div>
                <div>
                    <h3>${person.name}</h3>
                    <span class="type-badge" style="background:#4f46e520; color:#4f46e5">${person.position || 'Academic Staff'}</span>
                </div>
            </div>
        `;

        if (person.department) {
            html += `<p class="building-desc">${person.department}${person.faculty ? ' &bull; ' + person.faculty : ''}</p>`;
        }

        html += `<div class="info-list">`;
        if (b.name) {
            html += infoRow('fa-building', 'Building', b.name);
        }
        if (person.location?.status !== 'building_only') {
            if (person.location?.floor) {
                html += infoRow('fa-layer-group', 'Floor Level', person.location.floor);
            }
            if (person.location?.room) {
                html += infoRow('fa-door-open', 'Office / Room', person.location.room);
            }
        }
        if (person.contact?.email) {
            html += infoRow('fa-envelope', 'Email', `<a href="mailto:${person.contact.email}">${person.contact.email}</a>`);
        }
        if (person.contact?.phone) {
            html += infoRow('fa-phone', 'Phone', `<a href="tel:${person.contact.phone.replace(/[^0-9+]/g, '')}">${person.contact.phone}</a>`);
        }
        html += `</div>`;

        html += `
            <button class="route-btn" onclick="RouteModule.calculateRoute(${b.lat}, ${b.lng}, '${breadcrumb.replace(/'/g, "\\'")}')">
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

    return { displayInfo, displayServiceOrRoom, displayStaff };
})();