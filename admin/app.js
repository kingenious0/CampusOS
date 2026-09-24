/**
 * CampusOS Studio - Admin CMS Application Controller
 * Handles UI interactions, CRUD modals, Leaflet entrance spatial editor, and sync status.
 */

document.addEventListener('DOMContentLoaded', async () => {
    // State caches
    let buildings = [];
    let rooms = [];
    let staff = [];
    let activeTab = 'buildings';
    
    // Entrance editor state
    let editorMap = null;
    let selectedBuildingId = null;
    let buildingMarker = null;
    let entranceMarker = null;
    let pendingEntranceCoords = null; // [lng, lat]

    // DOM Elements
    const views = {
        buildings: document.getElementById('view-buildings'),
        rooms: document.getElementById('view-rooms'),
        staff: document.getElementById('view-staff'),
        'entrance-editor': document.getElementById('view-entrance-editor'),
        'sync-queue': document.getElementById('view-sync-queue')
    };

    const badges = {
        buildings: document.getElementById('badge-buildings-count'),
        rooms: document.getElementById('badge-rooms-count'),
        staff: document.getElementById('badge-staff-count')
    };

    // 1. Initialize Sync Engine
    await CampusSync.init();

    // 2. Initial Data Load
    async function refreshData() {
        buildings = await CampusSync.getAll('buildings');
        rooms = await CampusSync.getAll('rooms');
        staff = await CampusSync.getAll('staff_directory');

        // Update counts
        if (badges.buildings) badges.buildings.textContent = buildings.length;
        if (badges.rooms) badges.rooms.textContent = rooms.length;
        if (badges.staff) badges.staff.textContent = staff.length;

        renderCurrentTab();
        populateDropdowns();
    }

    // 3. Tab Switching
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });

    function switchTab(tabName) {
        activeTab = tabName;
        document.querySelectorAll('.nav-tab-btn').forEach(b => {
            const isMatch = b.getAttribute('data-tab') === tabName;
            b.classList.toggle('active', isMatch);
            b.classList.toggle('bg-brand-600/20', isMatch);
            b.classList.toggle('text-brand-300', isMatch);
            b.classList.toggle('border-brand-500/30', isMatch);
            b.classList.toggle('text-slate-400', !isMatch);
        });

        Object.keys(views).forEach(vKey => {
            if (views[vKey]) {
                views[vKey].classList.toggle('hidden', vKey !== tabName);
            }
        });

        if (tabName === 'entrance-editor') {
            initOrResizeEditorMap();
        }

        renderCurrentTab();
    }

    function renderCurrentTab() {
        if (activeTab === 'buildings') renderBuildingsTable();
        else if (activeTab === 'rooms') renderRoomsTable();
        else if (activeTab === 'staff') renderStaffTable();
        else if (activeTab === 'entrance-editor') renderEditorBuildingList();
        else if (activeTab === 'sync-queue') renderSyncQueue();
    }

    // =========================================================================
    // BUILDINGS TABLE & CRUD
    // =========================================================================

    const buildingsTableBody = document.getElementById('buildings-table-body');
    const searchBuildingsInput = document.getElementById('search-buildings');

    searchBuildingsInput.addEventListener('input', () => renderBuildingsTable());

    function renderBuildingsTable() {
        const query = (searchBuildingsInput.value || '').trim().toLowerCase();
        const filtered = buildings.filter(b => {
            return (b.name && b.name.toLowerCase().includes(query)) ||
                   (b.code && b.code.toLowerCase().includes(query)) ||
                   (b.type && b.type.toLowerCase().includes(query));
        });

        buildingsTableBody.innerHTML = filtered.map(b => {
            const hasEntrance = Array.isArray(b.entrance) && b.entrance.length >= 2;
            const entranceBadge = hasEntrance ?
                `<span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 w-fit">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Set [${b.entrance[1].toFixed(5)}, ${b.entrance[0].toFixed(5)}]
                 </span>` :
                `<span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700/60">Not Set</span>`;

            return `
                <tr class="hover:bg-slate-800/30 transition">
                    <td class="p-3.5 font-mono font-semibold text-slate-200">${b.code || b.id}</td>
                    <td class="p-3.5 font-medium text-white">${b.name}</td>
                    <td class="p-3.5 capitalize text-slate-400"><span class="px-2 py-0.5 rounded bg-slate-800 text-slate-300">${b.type || 'academic'}</span></td>
                    <td class="p-3.5 font-mono text-slate-400">${b.lat.toFixed(5)}, ${b.lng.toFixed(5)}</td>
                    <td class="p-3.5">${entranceBadge}</td>
                    <td class="p-3.5 text-slate-400">${b.hours || '—'}</td>
                    <td class="p-3.5 text-right space-x-1.5">
                        <button onclick="window.editBuilding('${b.id}')" class="px-2.5 py-1 rounded-lg text-xs font-medium text-brand-400 hover:bg-brand-500/10 transition">Edit</button>
                        <button onclick="window.jumpToEntranceEditor('${b.id}')" class="px-2.5 py-1 rounded-lg text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 transition">Pin Doorway</button>
                        <button onclick="window.deleteBuilding('${b.id}')" class="px-2.5 py-1 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    const modalBuilding = document.getElementById('modal-building');
    const formBuilding = document.getElementById('form-building');

    document.getElementById('btn-add-building').addEventListener('click', () => {
        document.getElementById('modal-building-title').textContent = 'Add Campus Building';
        formBuilding.reset();
        document.getElementById('building-id').value = '';
        modalBuilding.classList.remove('hidden');
    });

    window.editBuilding = (id) => {
        const b = buildings.find(x => x.id === id);
        if (!b) return;
        document.getElementById('modal-building-title').textContent = 'Edit Building';
        document.getElementById('building-id').value = b.id;
        document.getElementById('building-name').value = b.name || '';
        document.getElementById('building-code').value = b.code || '';
        document.getElementById('building-type').value = b.type || 'academic';
        document.getElementById('building-lat').value = b.lat;
        document.getElementById('building-lng').value = b.lng;
        document.getElementById('building-description').value = b.description || '';
        modalBuilding.classList.remove('hidden');
    };

    window.deleteBuilding = async (id) => {
        if (!confirm('Are you sure you want to delete this building? Connected rooms and staff links may be affected.')) return;
        await CampusSync.deleteRecord('buildings', id);
        showToast('Building deleted', 'success');
        await refreshData();
    };

    formBuilding.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('building-id').value || `bldg-${Date.now()}`;
        const existing = buildings.find(x => x.id === id) || {};

        const record = {
            ...existing,
            id,
            name: document.getElementById('building-name').value.trim(),
            code: (document.getElementById('building-code').value || '').trim().toUpperCase(),
            short_name: (document.getElementById('building-code').value || document.getElementById('building-name').value).trim(),
            type: document.getElementById('building-type').value,
            lat: parseFloat(document.getElementById('building-lat').value),
            lng: parseFloat(document.getElementById('building-lng').value),
            description: document.getElementById('building-description').value.trim()
        };

        await CampusSync.saveRecord('buildings', record);
        modalBuilding.classList.add('hidden');
        showToast('Building saved successfully', 'success');
        await refreshData();
    });

    // =========================================================================
    // ROOMS TABLE & CRUD
    // =========================================================================

    const roomsTableBody = document.getElementById('rooms-table-body');
    const searchRoomsInput = document.getElementById('search-rooms');
    const filterRoomsBuilding = document.getElementById('filter-rooms-building');

    searchRoomsInput.addEventListener('input', () => renderRoomsTable());
    filterRoomsBuilding.addEventListener('change', () => renderRoomsTable());

    function renderRoomsTable() {
        const query = (searchRoomsInput.value || '').trim().toLowerCase();
        const bFilter = filterRoomsBuilding.value;

        const bldgMap = new Map(buildings.map(b => [b.id, b]));

        const filtered = rooms.filter(r => {
            const matchesBldg = !bFilter || r.building_id === bFilter;
            const bName = bldgMap.get(r.building_id)?.name || '';
            const matchesQuery = !query ||
                r.room_number.toLowerCase().includes(query) ||
                (r.description && r.description.toLowerCase().includes(query)) ||
                bName.toLowerCase().includes(query) ||
                (r.keywords && r.keywords.some(k => k.toLowerCase().includes(query)));
            return matchesBldg && matchesQuery;
        });

        roomsTableBody.innerHTML = filtered.map(r => {
            const bldg = bldgMap.get(r.building_id);
            const bldgName = bldg ? `${bldg.name} (${bldg.code || bldg.id})` : r.building_id;
            const floorText = r.floor === 0 ? 'Ground' : (r.floor === 1 ? '1st Floor' : (r.floor === 2 ? '2nd Floor' : `Floor ${r.floor}`));

            return `
                <tr class="hover:bg-slate-800/30 transition">
                    <td class="p-3.5 font-bold font-mono text-white">${r.room_number}</td>
                    <td class="p-3.5 text-slate-300 font-medium">${bldgName}</td>
                    <td class="p-3.5"><span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">${floorText}</span></td>
                    <td class="p-3.5 text-slate-400">${r.description || '—'}</td>
                    <td class="p-3.5 text-slate-500 font-mono text-[11px]">${(r.keywords || []).slice(0, 3).join(', ')}</td>
                    <td class="p-3.5 text-right space-x-2">
                        <button onclick="window.editRoom('${r.id}')" class="px-2.5 py-1 rounded-lg text-xs font-medium text-brand-400 hover:bg-brand-500/10 transition">Edit</button>
                        <button onclick="window.deleteRoom('${r.id}')" class="px-2.5 py-1 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    const modalRoom = document.getElementById('modal-room');
    const formRoom = document.getElementById('form-room');
    const roomBuildingSelect = document.getElementById('room-building-select');

    document.getElementById('btn-add-room').addEventListener('click', () => {
        document.getElementById('modal-room-title').textContent = 'Add Room Allocation';
        formRoom.reset();
        document.getElementById('room-id').value = '';
        modalRoom.classList.remove('hidden');
    });

    window.editRoom = (id) => {
        const r = rooms.find(x => x.id === id);
        if (!r) return;
        document.getElementById('modal-room-title').textContent = 'Edit Room Allocation';
        document.getElementById('room-id').value = r.id;
        roomBuildingSelect.value = r.building_id;
        document.getElementById('room-number').value = r.room_number;
        document.getElementById('room-floor').value = r.floor;
        document.getElementById('room-description').value = r.description || '';
        document.getElementById('room-keywords').value = (r.keywords || []).join(', ');
        modalRoom.classList.remove('hidden');
    };

    window.deleteRoom = async (id) => {
        if (!confirm('Are you sure you want to delete this room?')) return;
        await CampusSync.deleteRecord('rooms', id);
        showToast('Room deleted', 'success');
        await refreshData();
    };

    formRoom.addEventListener('submit', async (e) => {
        e.preventDefault();
        const bId = roomBuildingSelect.value;
        const num = document.getElementById('room-number').value.trim();
        const id = document.getElementById('room-id').value || `${bId}-${num.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        const existing = rooms.find(x => x.id === id) || {};

        const rawKeywords = document.getElementById('room-keywords').value;
        const kwArray = rawKeywords.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);

        const record = {
            ...existing,
            id,
            building_id: bId,
            room_number: num,
            floor: parseInt(document.getElementById('room-floor').value, 10),
            description: document.getElementById('room-description').value.trim(),
            keywords: kwArray
        };

        await CampusSync.saveRecord('rooms', record);
        modalRoom.classList.add('hidden');
        showToast('Room allocation saved', 'success');
        await refreshData();
    });

    // =========================================================================
    // STAFF DIRECTORY TABLE & CRUD
    // =========================================================================

    const staffTableBody = document.getElementById('staff-table-body');
    const searchStaffInput = document.getElementById('search-staff');
    const filterStaffDept = document.getElementById('filter-staff-department');

    searchStaffInput.addEventListener('input', () => renderStaffTable());
    filterStaffDept.addEventListener('change', () => renderStaffTable());

    function renderStaffTable() {
        const query = (searchStaffInput.value || '').trim().toLowerCase();
        const deptFilter = filterStaffDept.value;

        const bldgMap = new Map(buildings.map(b => [b.id, b]));
        const roomMap = new Map(rooms.map(r => [r.id, r]));

        const filtered = staff.filter(s => {
            const matchesDept = !deptFilter || s.department === deptFilter;
            const matchesQuery = !query ||
                s.name.toLowerCase().includes(query) ||
                (s.department && s.department.toLowerCase().includes(query)) ||
                (s.position && s.position.toLowerCase().includes(query)) ||
                (s.email && s.email.toLowerCase().includes(query));
            return matchesDept && matchesQuery;
        });

        staffTableBody.innerHTML = filtered.map(s => {
            const bldg = bldgMap.get(s.building_id);
            const room = roomMap.get(s.room_id);
            
            let locPill = `<span class="text-slate-500 italic text-[11px]">Unassigned</span>`;
            if (bldg && room) {
                locPill = `<span class="px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">📍 ${bldg.code || bldg.short_name} — Rm ${room.room_number}</span>`;
            } else if (bldg) {
                locPill = `<span class="px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">📍 ${bldg.code || bldg.short_name} (Block Only)</span>`;
            }

            return `
                <tr class="hover:bg-slate-800/30 transition">
                    <td class="p-3.5">
                        <div class="font-bold text-white">${s.title ? s.title + ' ' : ''}${s.name}</div>
                    </td>
                    <td class="p-3.5 text-slate-300">${s.position || 'Lecturer'}</td>
                    <td class="p-3.5 text-slate-400">
                        <div class="font-medium text-slate-300">${s.department || '—'}</div>
                        <div class="text-[10px] text-slate-500">${s.faculty || ''}</div>
                    </td>
                    <td class="p-3.5">${locPill}</td>
                    <td class="p-3.5 font-mono text-[11px] text-slate-400">
                        <div>${s.email || '—'}</div>
                        <div class="text-slate-500">${s.phone || ''}</div>
                    </td>
                    <td class="p-3.5 text-right space-x-2">
                        <button onclick="window.editStaff('${s.id}')" class="px-2.5 py-1 rounded-lg text-xs font-medium text-brand-400 hover:bg-brand-500/10 transition">Edit</button>
                        <button onclick="window.deleteStaff('${s.id}')" class="px-2.5 py-1 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    const modalStaff = document.getElementById('modal-staff');
    const formStaff = document.getElementById('form-staff');
    const staffBuildingSelect = document.getElementById('staff-building-select');
    const staffRoomSelect = document.getElementById('staff-room-select');

    staffBuildingSelect.addEventListener('change', () => {
        updateStaffRoomDropdown(staffBuildingSelect.value);
    });

    function updateStaffRoomDropdown(buildingId, selectedRoomId = '') {
        staffRoomSelect.innerHTML = '<option value="">(No Room Assigned)</option>';
        if (!buildingId) return;
        const bldgRooms = rooms.filter(r => r.building_id === buildingId);
        bldgRooms.forEach(r => {
            const opt = document.createElement('option');
            opt.value = r.id;
            opt.textContent = `Room ${r.room_number} (Floor ${r.floor})`;
            if (r.id === selectedRoomId) opt.selected = true;
            staffRoomSelect.appendChild(opt);
        });
    }

    document.getElementById('btn-add-staff').addEventListener('click', () => {
        document.getElementById('modal-staff-title').textContent = 'Add Staff Member';
        formStaff.reset();
        document.getElementById('staff-id').value = '';
        updateStaffRoomDropdown('');
        modalStaff.classList.remove('hidden');
    });

    window.editStaff = (id) => {
        const s = staff.find(x => x.id === id);
        if (!s) return;
        document.getElementById('modal-staff-title').textContent = 'Edit Staff Member';
        document.getElementById('staff-id').value = s.id;
        document.getElementById('staff-title').value = s.title || '';
        document.getElementById('staff-name').value = s.name;
        document.getElementById('staff-position').value = s.position || '';
        document.getElementById('staff-department').value = s.department || '';
        staffBuildingSelect.value = s.building_id || '';
        updateStaffRoomDropdown(s.building_id || '', s.room_id || '');
        document.getElementById('staff-email').value = s.email || '';
        document.getElementById('staff-phone').value = s.phone || '';
        modalStaff.classList.remove('hidden');
    };

    window.deleteStaff = async (id) => {
        if (!confirm('Are you sure you want to delete this staff record?')) return;
        await CampusSync.deleteRecord('staff_directory', id);
        showToast('Staff member deleted', 'success');
        await refreshData();
    };

    formStaff.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('staff-name').value.trim();
        const id = document.getElementById('staff-id').value || `staff-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        const existing = staff.find(x => x.id === id) || {};

        const bId = staffBuildingSelect.value || null;
        const rId = staffRoomSelect.value || null;

        const record = {
            ...existing,
            id,
            title: document.getElementById('staff-title').value.trim(),
            name,
            position: document.getElementById('staff-position').value.trim(),
            department: document.getElementById('staff-department').value.trim(),
            building_id: bId,
            room_id: rId,
            email: document.getElementById('staff-email').value.trim(),
            phone: document.getElementById('staff-phone').value.trim(),
            location_status: (bId && rId) ? 'exact' : (bId ? 'building_only' : 'unresolved')
        };

        await CampusSync.saveRecord('staff_directory', record);
        modalStaff.classList.add('hidden');
        showToast('Staff record saved', 'success');
        await refreshData();
    });

    // =========================================================================
    // OUTDOOR ENTRANCE & PIN SPATIAL EDITOR (LEAFLET)
    // =========================================================================

    const editorBuildingList = document.getElementById('editor-building-list');
    const searchEditorBuilding = document.getElementById('search-editor-building');
    const btnSaveEntrance = document.getElementById('btn-save-entrance');

    searchEditorBuilding.addEventListener('input', () => renderEditorBuildingList());

    function initOrResizeEditorMap() {
        if (!editorMap) {
            editorMap = L.map('editor-map', {
                center: [6.6985, -1.6815],
                zoom: 17,
                maxZoom: 20
            });

            // Clean CartoDB Dark/Voyager or OpenStreetMap layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(editorMap);

            editorMap.on('click', (e) => {
                if (!selectedBuildingId) {
                    showToast('Please select a building from the list first', 'info');
                    return;
                }
                const lat = e.latlng.lat;
                const lng = e.latlng.lng;
                setPendingEntrance(lng, lat);
            });
        }

        setTimeout(() => {
            if (editorMap) editorMap.invalidateSize();
        }, 150);
    }

    function renderEditorBuildingList() {
        const query = (searchEditorBuilding.value || '').trim().toLowerCase();
        const filtered = buildings.filter(b => {
            return (b.name && b.name.toLowerCase().includes(query)) ||
                   (b.code && b.code.toLowerCase().includes(query));
        });

        editorBuildingList.innerHTML = filtered.map(b => {
            const isSelected = b.id === selectedBuildingId;
            const hasEntrance = Array.isArray(b.entrance) && b.entrance.length >= 2;
            return `
                <div onclick="window.selectEditorBuilding('${b.id}')" class="p-2.5 rounded-xl cursor-pointer transition border ${isSelected ? 'bg-brand-600/20 border-brand-500 text-white' : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 text-slate-300'}">
                    <div class="flex items-center justify-between">
                        <span class="font-bold text-xs">${b.name}</span>
                        ${hasEntrance ? '<span class="w-2 h-2 rounded-full bg-emerald-400" title="Entrance pin set"></span>' : '<span class="w-2 h-2 rounded-full bg-slate-600" title="No entrance set"></span>'}
                    </div>
                    <div class="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                        <span class="font-mono">${b.code || b.id}</span>
                        <span>${hasEntrance ? 'Doorway Set' : 'Centroid only'}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    window.jumpToEntranceEditor = (buildingId) => {
        switchTab('entrance-editor');
        window.selectEditorBuilding(buildingId);
    };

    window.selectEditorBuilding = (id) => {
        selectedBuildingId = id;
        renderEditorBuildingList();
        const b = buildings.find(x => x.id === id);
        if (!b || !editorMap) return;

        // Clear existing markers
        if (buildingMarker) editorMap.removeLayer(buildingMarker);
        if (entranceMarker) editorMap.removeLayer(entranceMarker);
        pendingEntranceCoords = null;
        btnSaveEntrance.disabled = true;

        // Centroid marker (Blue pin)
        buildingMarker = L.marker([b.lat, b.lng], {
            icon: L.divIcon({
                className: 'custom-centroid-pin',
                html: `<div class="w-6 h-6 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-lg">🏢</div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            })
        }).addTo(editorMap).bindPopup(`<b>${b.name}</b><br>Geometric Centroid`);

        // If entrance already exists, place green doorway pin
        if (Array.isArray(b.entrance) && b.entrance.length >= 2) {
            placeEntranceMarker(b.entrance[0], b.entrance[1], false);
        }

        editorMap.flyTo([b.lat, b.lng], 18, { duration: 0.8 });
    };

    function setPendingEntrance(lng, lat) {
        pendingEntranceCoords = [lng, lat];
        placeEntranceMarker(lng, lat, true);
        btnSaveEntrance.disabled = false;
        showToast('Entrance position picked. Click "Save Entrance Pin" to commit.', 'info');
    }

    function placeEntranceMarker(lng, lat, isDraggable) {
        if (entranceMarker && editorMap) editorMap.removeLayer(entranceMarker);

        entranceMarker = L.marker([lat, lng], {
            draggable: true,
            icon: L.divIcon({
                className: 'custom-entrance-pin',
                html: `<div class="w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-xl animate-bounce">🚪</div>`,
                iconSize: [28, 28],
                iconAnchor: [14, 14]
            })
        }).addTo(editorMap).bindPopup(`<b>Entrance Doorway</b><br>[${lat.toFixed(6)}, ${lng.toFixed(6)}]`).openPopup();

        entranceMarker.on('dragend', (e) => {
            const pos = e.target.getLatLng();
            pendingEntranceCoords = [pos.lng, pos.lat];
            btnSaveEntrance.disabled = false;
        });
    }

    btnSaveEntrance.addEventListener('click', async () => {
        if (!selectedBuildingId || !pendingEntranceCoords) return;
        const b = buildings.find(x => x.id === selectedBuildingId);
        if (!b) return;

        const updated = {
            ...b,
            entrance: pendingEntranceCoords
        };

        await CampusSync.saveRecord('buildings', updated);
        btnSaveEntrance.disabled = true;
        showToast(`Entrance pin saved for ${b.name}!`, 'success');
        await refreshData();
    });

    // =========================================================================
    // SYNC QUEUE & AUDIT LOG VIEW
    // =========================================================================

    const queueList = document.getElementById('queue-list');
    const btnForceSync = document.getElementById('btn-force-sync');
    const btnSyncTrigger = document.getElementById('btn-sync-trigger');

    async function renderSyncQueue() {
        const pending = await CampusSync.getPendingMutations();
        if (pending.length === 0) {
            queueList.innerHTML = `
                <div class="p-8 text-center text-slate-500">
                    <svg class="w-12 h-12 mx-auto text-slate-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <div class="font-medium text-slate-300">All Changes Fully Synced</div>
                    <div class="text-xs mt-1">There are no pending local mutations in IndexedDB.</div>
                </div>
            `;
            return;
        }

        queueList.innerHTML = pending.map(item => `
            <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div class="flex items-center gap-3">
                    <span class="px-2 py-0.5 rounded font-mono font-bold uppercase text-[10px] ${item.action === 'DELETE' ? 'bg-rose-500/20 text-rose-400' : 'bg-brand-500/20 text-brand-300'}">${item.action}</span>
                    <div>
                        <div class="font-semibold text-slate-200">${item.table} &rarr; <span class="font-mono text-slate-400">${item.record_id}</span></div>
                        <div class="text-[10px] text-slate-500">${new Date(item.timestamp).toLocaleString()}</div>
                    </div>
                </div>
                <div class="text-right">
                    <span class="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">Queued in IndexedDB</span>
                </div>
            </div>
        `).join('');
    }

    btnForceSync.addEventListener('click', () => CampusSync.triggerSync());
    btnSyncTrigger.addEventListener('click', () => CampusSync.triggerSync());

    // =========================================================================
    // SETTINGS / CONNECT DRAWER & AUTH
    // =========================================================================

    const settingsDrawer = document.getElementById('settings-drawer');
    const btnOpenSettings = document.getElementById('btn-open-settings');
    const btnCloseSettings = document.getElementById('btn-close-settings');
    const drawerBackdrop = document.getElementById('drawer-backdrop');

    const inputOrgId = document.getElementById('input-org-id');
    const inputSupabaseUrl = document.getElementById('input-supabase-url');
    const inputSupabaseKey = document.getElementById('input-supabase-key');
    const btnSaveConnection = document.getElementById('btn-save-connection');

    const authUnlogged = document.getElementById('auth-unlogged');
    const authLogged = document.getElementById('auth-logged');
    const authEmail = document.getElementById('auth-email');
    const authPassword = document.getElementById('auth-password');
    const btnAuthLogin = document.getElementById('btn-auth-login');
    const btnAuthLogout = document.getElementById('btn-auth-logout');
    const userDisplayEmail = document.getElementById('user-display-email');
    const btnResetSeed = document.getElementById('btn-reset-seed');

    function openSettings() {
        const cfg = CampusSync.getConfig();
        inputOrgId.value = cfg.orgId || 'usted-ksi';
        inputSupabaseUrl.value = cfg.supabaseUrl || '';
        inputSupabaseKey.value = cfg.supabaseAnonKey || '';

        settingsDrawer.classList.remove('pointer-events-none', 'opacity-0');
    }

    function closeSettings() {
        settingsDrawer.classList.add('pointer-events-none', 'opacity-0');
    }

    btnOpenSettings.addEventListener('click', openSettings);
    btnCloseSettings.addEventListener('click', closeSettings);
    drawerBackdrop.addEventListener('click', closeSettings);

    btnSaveConnection.addEventListener('click', async () => {
        CampusSync.saveConfig({
            orgId: inputOrgId.value.trim() || 'usted-ksi',
            supabaseUrl: inputSupabaseUrl.value.trim().replace(/\/+$/, ''),
            supabaseAnonKey: inputSupabaseKey.value.trim()
        });
        showToast('Connection settings saved', 'success');
        CampusSync.triggerSync();
        closeSettings();
    });

    btnAuthLogin.addEventListener('click', async () => {
        try {
            const email = authEmail.value.trim();
            const password = authPassword.value;
            await CampusSync.login(email, password);
            showToast('Signed in successfully', 'success');
        } catch (err) {
            showToast(err.message, 'error');
        }
    });

    btnAuthLogout.addEventListener('click', () => {
        CampusSync.logout();
        showToast('Signed out', 'info');
    });

    btnResetSeed.addEventListener('click', async () => {
        if (!confirm('This will wipe your local IndexedDB and re-import data/buildings.json and data/people.json. Proceed?')) return;
        try {
            const res = await fetch('seed_data.json');
            if (res.ok) {
                const data = await res.json();
                await CampusSync.bulkPut('buildings', data.buildings || []);
                await CampusSync.bulkPut('rooms', data.rooms || []);
                await CampusSync.bulkPut('staff_directory', data.staff || []);
                showToast('Database reset to clean seed data', 'success');
                await refreshData();
                closeSettings();
            }
        } catch (err) {
            showToast('Failed to reset: ' + err.message, 'error');
        }
    });

    // Snapshot Export
    document.getElementById('btn-export-backup').addEventListener('click', () => {
        const snapshot = {
            exported_at: new Date().toISOString(),
            org_id: CampusSync.getConfig().orgId,
            buildings,
            rooms,
            staff
        };
        const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `campusos_snapshot_${Date.now()}.json`;
        a.click();
    });

    // =========================================================================
    // POPULATE DROPDOWNS & MODAL CONTROLS
    // =========================================================================

    function populateDropdowns() {
        // Buildings dropdown for rooms & staff
        roomBuildingSelect.innerHTML = buildings.map(b => `<option value="${b.id}">${b.name} (${b.code || b.id})</option>`).join('');
        filterRoomsBuilding.innerHTML = '<option value="">All Buildings</option>' + buildings.map(b => `<option value="${b.id}">${b.name}</option>`).join('');

        staffBuildingSelect.innerHTML = '<option value="">(No Building Assigned)</option>' + buildings.map(b => `<option value="${b.id}">${b.name}</option>`).join('');

        // Department dropdown for staff filter
        const depts = Array.from(new Set(staff.map(s => s.department).filter(Boolean))).sort();
        filterStaffDept.innerHTML = '<option value="">All Departments</option>' + depts.map(d => `<option value="${d}">${d}</option>`).join('');
    }

    document.querySelectorAll('.btn-close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            modalBuilding.classList.add('hidden');
            modalRoom.classList.add('hidden');
            modalStaff.classList.add('hidden');
        });
    });

    document.querySelectorAll('.modal-backdrop').forEach(bd => {
        bd.addEventListener('click', () => {
            modalBuilding.classList.add('hidden');
            modalRoom.classList.add('hidden');
            modalStaff.classList.add('hidden');
        });
    });

    // =========================================================================
    // SYNC STATUS SUBSCRIBER
    // =========================================================================

    const envBadge = document.getElementById('env-badge');
    const envText = document.getElementById('env-text');
    const syncCountText = document.getElementById('sync-count-text');
    const syncIcon = document.getElementById('sync-icon');

    CampusSync.subscribe((status) => {
        if (status.isSandbox) {
            envBadge.className = 'px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 bg-amber-500/10 text-amber-300 border border-amber-500/30';
            envText.textContent = 'Local Sandbox Mode';
        } else {
            envBadge.className = 'px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30';
            envText.textContent = 'Supabase Connected';
        }

        syncCountText.textContent = `${status.pendingCount} Pending`;
        if (status.isSyncing) {
            syncIcon.classList.add('animate-spin');
        } else {
            syncIcon.classList.remove('animate-spin');
        }

        // Auth display
        if (status.user) {
            authUnlogged.classList.add('hidden');
            authLogged.classList.remove('hidden');
            userDisplayEmail.textContent = status.user.email;
        } else {
            authUnlogged.classList.remove('hidden');
            authLogged.classList.add('hidden');
        }

        if (activeTab === 'sync-queue') {
            renderSyncQueue();
        }
    });

    // Toast helper
    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        const color = type === 'success' ? 'bg-emerald-950 border-emerald-500/50 text-emerald-200' :
                      type === 'error' ? 'bg-rose-950 border-rose-500/50 text-rose-200' :
                      'bg-slate-900 border-slate-700 text-slate-200';
        toast.className = `px-4 py-3 rounded-xl border shadow-2xl text-xs font-medium transition duration-300 transform translate-y-2 opacity-0 pointer-events-auto ${color}`;
        toast.textContent = message;
        container.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-2', 'opacity-0');
        });

        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-2');
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }

    // Initial render
    await refreshData();
});
