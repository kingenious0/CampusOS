/**
 * Building Module - Handles building information display
 */

const BuildingModule = (() => {
    const infoPanel = document.getElementById('infoPanel');

    const displayInfo = (building) => {
        let html = `<h3>${building.name}</h3>`;
        html += `<p style="color: var(--text-light); margin-bottom: 1rem;">${building.type.replace('_', ' ').toUpperCase()}</p>`;

        html += '<div class="building-info">';

        if (building.description) {
            html += `<div class="info-item"><strong>Description:</strong></div><p style="color: var(--text-light); margin-bottom: 1rem;">${building.description}</p>`;
        }

        if (building.department) {
            html += `<div class="info-item"><strong>Department:</strong><span>${building.department}</span></div>`;
        }

        if (building.building) {
            html += `<div class="info-item"><strong>Building:</strong><span>${building.building}</span></div>`;
        }

        if (building.capacity) {
            html += `<div class="info-item"><strong>Capacity:</strong><span>${building.capacity} people</span></div>`;
        }

        if (building.floors) {
            html += `<div class="info-item"><strong>Floors:</strong><span>${building.floors}</span></div>`;
        }

        if (building.equipment) {
            html += `<div class="info-item"><strong>Equipment:</strong><span>${building.equipment.join(', ')}</span></div>`;
        }

        if (building.facilities) {
            html += `<div class="info-item"><strong>Facilities:</strong><span>${building.facilities.join(', ')}</span></div>`;
        }

        if (building.contact) {
            html += `<div class="info-item"><strong>Contact:</strong><span>${building.contact}</span></div>`;
        }

        if (building.office_hours) {
            html += `<div class="info-item"><strong>Hours:</strong><span>${building.office_hours}</span></div>`;
        }

        html += '</div>';

        if (building.lat && building.lng) {
            html += `<button class="route-btn" onclick="RouteModule.calculateRoute(${building.lat}, ${building.lng}, '${building.name}')">Get Directions</button>`;
        }

        infoPanel.innerHTML = html;
    };

    return {
        displayInfo
    };
})();