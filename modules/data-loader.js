/**
 * CampusOS / USTED Nav - Stale-While-Revalidate Data Loader
 * 
 * Unifies local IndexedDB caching (CampusOS_Studio_DB / campus_data)
 * with background live synchronization from Supabase 'usted_nav' schema,
 * and reliable offline fallback to bundled static data/*.json.
 */

const DataLoader = (() => {
    const DB_NAME = 'CampusOS_Studio_DB';
    const DB_VERSION = 1;

    // Helper to get safe environment configuration
    function getConfig() {
        const root = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : global);
        const env = root.ENV || null;
        const appCfg = root.APP_CONFIG || {
            SUPABASE_URL: 'https://mzxmbkulgrehujpvwadt.supabase.co',
            SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16eG1ia3VsZ3JlaHVqcHZ3YWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1Njk5NjQsImV4cCI6MjEwMDE0NTk2NH0.PQMuAN1Hr82re8sgIJCbwwU09u6594UC3oIdTGoJfaE',
            DEFAULT_SCHEMA: 'usted_nav',
            DEFAULT_ORG_ID: 'usted-ksi'
        };

        const supabaseUrl = (env?.supabaseUrl || appCfg.SUPABASE_URL || '').trim().replace(/\/+$/, '');
        const supabaseAnonKey = (env?.supabaseKey || appCfg.SUPABASE_ANON_KEY || '').trim();
        const schema = (env?.schema || appCfg.DEFAULT_SCHEMA || 'usted_nav').trim();
        const orgId = (env?.orgId || appCfg.DEFAULT_ORG_ID || 'usted-ksi').trim();

        return { supabaseUrl, supabaseAnonKey, schema, orgId };
    }

    // 1. IndexedDB Helper: Open / upgrade Studio DB
    function openIDB(dbName = DB_NAME) {
        const idb = typeof indexedDB !== 'undefined' ? indexedDB : null;
        if (!idb) return Promise.resolve(null);

        return new Promise((resolve) => {
            try {
                const req = idb.open(dbName, DB_VERSION);
                req.onupgradeneeded = (e) => {
                    const database = e.target.result;
                    if (!database.objectStoreNames.contains('buildings')) {
                        database.createObjectStore('buildings', { keyPath: 'id' });
                    }
                    if (!database.objectStoreNames.contains('rooms')) {
                        database.createObjectStore('rooms', { keyPath: 'id' });
                    }
                    if (!database.objectStoreNames.contains('staff_directory')) {
                        database.createObjectStore('staff_directory', { keyPath: 'id' });
                    }
                    if (!database.objectStoreNames.contains('mutation_queue')) {
                        database.createObjectStore('mutation_queue', { keyPath: 'queue_id', autoIncrement: true });
                    }
                };
                req.onsuccess = (e) => resolve(e.target.result);
                req.onerror = () => resolve(null);
            } catch (err) {
                resolve(null);
            }
        });
    }

    // 2. Read from IndexedDB
    async function readFromIndexedDB(dbName = DB_NAME) {
        const database = await openIDB(dbName);
        if (!database) return null;

        return new Promise((resolve) => {
            try {
                const requiredStores = ['buildings', 'rooms', 'staff_directory'];
                const available = requiredStores.filter(s => database.objectStoreNames.contains(s));
                if (available.length < 2) {
                    return resolve(null);
                }

                const tx = database.transaction(available, 'readonly');
                const bStore = database.objectStoreNames.contains('buildings') ? tx.objectStore('buildings') : null;
                const rStore = database.objectStoreNames.contains('rooms') ? tx.objectStore('rooms') : null;
                const sStore = database.objectStoreNames.contains('staff_directory') ? tx.objectStore('staff_directory') : null;

                const bReq = bStore ? bStore.getAll() : null;
                const rReq = rStore ? rStore.getAll() : null;
                const sReq = sStore ? sStore.getAll() : null;

                tx.oncomplete = () => {
                    const buildings = bReq?.result || [];
                    const rooms = rReq?.result || [];
                    const staff = sReq?.result || [];

                    if (buildings.length === 0 && staff.length === 0) {
                        return resolve(null);
                    }
                    resolve({ buildings, rooms, staff });
                };

                tx.onerror = () => resolve(null);
            } catch (err) {
                resolve(null);
            }
        });
    }

    // 3. Write to IndexedDB with automatic pruning of remote-deleted records
    async function writeToIndexedDB({ buildings = [], rooms = [], staff = [] }, dbName = DB_NAME) {
        const database = await openIDB(dbName);
        if (!database) return false;

        return new Promise((resolve) => {
            try {
                const stores = ['buildings', 'rooms', 'staff_directory'].filter(s => database.objectStoreNames.contains(s));
                if (stores.length === 0) return resolve(false);

                const tx = database.transaction(stores, 'readwrite');

                const syncStore = (storeName, items) => {
                    if (!database.objectStoreNames.contains(storeName)) return;
                    const store = tx.objectStore(storeName);

                    // 1. Put current items
                    items.forEach(item => {
                        try { store.put(item); } catch (e) {}
                    });

                    // 2. Prune records that no longer exist in the authoritative remote set
                    const reqKeys = store.getAllKeys();
                    reqKeys.onsuccess = () => {
                        const localKeys = reqKeys.result || [];
                        const validKeys = new Set(
                            items.flatMap(item => [
                                String(item.id),
                                item.id,
                                !isNaN(Number(item.id)) ? Number(item.id) : null
                            ].filter(Boolean))
                        );

                        localKeys.forEach(k => {
                            if (!validKeys.has(k) && !validKeys.has(String(k))) {
                                try { store.delete(k); } catch (e) {}
                            }
                        });
                    };
                };

                if (Array.isArray(buildings)) syncStore('buildings', buildings);
                if (Array.isArray(rooms)) syncStore('rooms', rooms);
                if (Array.isArray(staff)) syncStore('staff_directory', staff);

                tx.oncomplete = () => resolve(true);
                tx.onerror = () => resolve(false);
            } catch (err) {
                resolve(false);
            }
        });
    }

    // 4. Load bundled static JSON
    async function loadBundledJson() {
        let buildings = [];
        let people = [];

        try {
            const bRes = await fetch('data/buildings.json');
            if (bRes.ok) buildings = await bRes.json();
        } catch (e) {
            try {
                const bRes2 = await fetch('/data/buildings.json');
                if (bRes2.ok) buildings = await bRes2.json();
            } catch (e2) {}
        }

        try {
            const pRes = await fetch('data/people.json');
            if (pRes.ok) people = await pRes.json();
        } catch (e) {
            try {
                const pRes2 = await fetch('/data/people.json');
                if (pRes2.ok) people = await pRes2.json();
            } catch (e2) {}
        }

        return { buildings, people };
    }

    // 5. Fetch from Supabase (usted_nav schema)
    async function fetchFromSupabase() {
        const { supabaseUrl, supabaseAnonKey, schema, orgId } = getConfig();
        if (!supabaseUrl || !supabaseAnonKey) return null;

        const root = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : global);
        const sb = root.supabase;

        // Try using the Supabase JS SDK client if available
        if (sb && typeof sb.createClient === 'function') {
            try {
                const client = sb.createClient(supabaseUrl, supabaseAnonKey, {
                    db: { schema },
                    global: {
                        headers: {
                            'Accept-Profile': schema,
                            'Content-Profile': schema,
                            'Prefer': 'return=representation'
                        }
                    }
                });

                const [bRes, rRes, sRes] = await Promise.all([
                    client.schema(schema).from('buildings').select('*').eq('org_id', orgId),
                    client.schema(schema).from('rooms').select('*').eq('org_id', orgId),
                    client.schema(schema).from('staff_directory').select('*').eq('org_id', orgId)
                ]);

                if (!bRes.error && bRes.data && bRes.data.length > 0) {
                    return {
                        buildings: bRes.data || [],
                        rooms: rRes.data || [],
                        staff: sRes.data || []
                    };
                }
            } catch (sdkErr) {
                // Fall through to raw fetch
            }
        }

        // Direct PostgREST fetch fallback with explicit headers
        const headers = {
            'Content-Type': 'application/json',
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Accept-Profile': schema,
            'Content-Profile': schema,
            'Prefer': 'return=representation'
        };

        try {
            const orgParam = orgId ? `?org_id=eq.${encodeURIComponent(orgId)}&select=*` : '?select=*';
            const [bRes, rRes, sRes] = await Promise.all([
                fetch(`${supabaseUrl}/rest/v1/buildings${orgParam}`, { headers }),
                fetch(`${supabaseUrl}/rest/v1/rooms${orgParam}`, { headers }),
                fetch(`${supabaseUrl}/rest/v1/staff_directory${orgParam}`, { headers })
            ]);

            if (bRes && bRes.ok) {
                const buildings = await bRes.json();
                const rooms = (rRes && rRes.ok) ? await rRes.json() : [];
                const staff = (sRes && sRes.ok) ? await sRes.json() : [];
                if (buildings && buildings.length > 0) {
                    return { buildings, rooms, staff };
                }
            }
        } catch (fetchErr) {
            return null;
        }

        return null;
    }

    // 6. Dataset Normalizer: Bridge Database Rows -> Client Map/Search Engine Structure
    function normalizeDataset({ buildings = [], rooms = [], staff = [], fallbackBuildings = [], fallbackPeople = [] }) {
        // Read tombstones from localStorage if any
        let tombstones = {};
        try {
            const rawTombstones = typeof localStorage !== 'undefined' ? localStorage.getItem('campusos_tombstones') : null;
            if (rawTombstones) tombstones = JSON.parse(rawTombstones);
        } catch (e) {}

        const isTombstoned = (storeName, id) => {
            if (id === null || id === undefined || !tombstones[storeName]) return false;
            return !!tombstones[storeName][String(id)];
        };

        const buildingsMap = new Map();
        const hasDbBuildings = Array.isArray(buildings) && buildings.length > 0;

        // Build fallback lookup map for property enrichment (polygon, coordinates, services, hours)
        const fallbackBldgMap = new Map((fallbackBuildings || []).map(b => [String(b.id), b]));

        if (hasDbBuildings) {
            // When authoritative database / cached records exist, ONLY include buildings from that dataset!
            buildings.forEach(b => {
                if (isTombstoned('buildings', b.id)) return;
                const idStr = String(b.id);
                const fb = fallbackBldgMap.get(idStr) || {};
                buildingsMap.set(idStr, {
                    ...fb,
                    ...b,
                    id: isNaN(Number(b.id)) ? b.id : Number(b.id),
                    name: b.name || fb.name || '',
                    shortName: b.shortName || b.short_name || b.code || fb.shortName || '',
                    type: b.type || fb.type || 'facility',
                    lat: typeof b.lat === 'number' ? b.lat : (parseFloat(b.lat) || fb.lat || 0),
                    lng: typeof b.lng === 'number' ? b.lng : (parseFloat(b.lng) || fb.lng || 0),
                    entrance: b.entrance !== undefined ? b.entrance : fb.entrance,
                    entrances: b.entrances || fb.entrances || (Array.isArray(b.entrance) && typeof b.entrance[0] === 'object' ? b.entrance : null),
                    polygon: b.polygon || fb.polygon || (b.metadata && b.metadata.polygon) || null,
                    coordinates: b.coordinates || fb.coordinates || (b.metadata && b.metadata.coordinates) || null,
                    metadata: b.metadata || fb.metadata || {},
                    description: b.description || fb.description || '',
                    hours: b.hours || fb.hours || '',
                    services: b.services || fb.services || [],
                    keywords: b.keywords || fb.keywords || [],
                    rooms: []
                });
            });
        } else {
            // Pure fallback mode (only when database is completely empty/uninitialized)
            (fallbackBuildings || []).forEach(b => {
                if (isTombstoned('buildings', b.id)) return;
                buildingsMap.set(String(b.id), { ...b, rooms: [...(b.rooms || [])] });
            });
        }

        // Index rooms by ID and Building ID
        const roomsById = new Map();
        const roomsByBldg = new Map();

        rooms.forEach(r => {
            if (isTombstoned('rooms', r.id)) return;
            const bIdStr = String(r.building_id);
            const rIdStr = String(r.id);
            const roomNum = String(r.room_number || r.number || '');
            const flNum = r.floor;
            const floorLabel = typeof flNum === 'number' 
                ? (flNum === 0 ? 'Ground Floor' : (flNum === 1 ? '1st Floor' : (flNum === 2 ? '2nd Floor' : `${flNum}th Floor`)))
                : (r.floor || 'Ground Floor');

            const roomObj = {
                id: r.id,
                building_id: r.building_id,
                number: roomNum.startsWith('Room') ? roomNum : `Room ${roomNum}`,
                room: roomNum.replace(/^Room\s+/i, ''),
                floor: floorLabel,
                description: r.description || '',
                keywords: r.keywords || [],
                staff: Array.isArray(r.staff) ? [...r.staff] : []
            };

            roomsById.set(rIdStr, roomObj);
            roomsById.set(roomNum.toLowerCase(), roomObj);
            roomsById.set(`${bIdStr}-${roomNum}`.toLowerCase(), roomObj);

            const bArr = roomsByBldg.get(bIdStr) || [];
            bArr.push(roomObj);
            roomsByBldg.set(bIdStr, bArr);
        });

        // Attach rooms to buildings
        buildingsMap.forEach((bObj, idStr) => {
            const dbRooms = roomsByBldg.get(idStr);
            if (dbRooms && dbRooms.length > 0) {
                bObj.rooms = [...dbRooms];
            } else if (!hasDbBuildings && bObj.rooms) {
                bObj.rooms = (bObj.rooms || []).filter(r => !isTombstoned('rooms', r.id));
            } else {
                bObj.rooms = [];
            }
        });

        // Build Staff / People Data
        const peopleMap = new Map();
        const hasDbStaff = Array.isArray(staff) && staff.length > 0;
        const fallbackPeopleMap = new Map((fallbackPeople || []).map(p => [String(p.id), p]));

        if (hasDbStaff) {
            // Authoritative database staff only
            staff.forEach(s => {
                if (isTombstoned('staff_directory', s.id)) return;
                const sId = String(s.id);
                const fb = fallbackPeopleMap.get(sId) || {};
                const bIdStr = s.building_id ? String(s.building_id) : '';
                const bldg = bIdStr ? buildingsMap.get(bIdStr) : null;
                const bCode = bldg ? (bldg.shortName || bldg.code || bldg.name) : (s.building_id || '');

                // Resolve precise room details
                let roomDisplay = '';
                let floorDisplay = '';
                let roomDesc = '';
                if (s.room_id) {
                    const rStr = String(s.room_id);
                    const rMatch = roomsById.get(rStr) || roomsById.get(`${bIdStr}-${rStr}`.toLowerCase());
                    if (rMatch) {
                        roomDisplay = rMatch.room || rMatch.number;
                        floorDisplay = rMatch.floor;
                        roomDesc = rMatch.description || '';
                    } else {
                        roomDisplay = rStr.replace(new RegExp(`^${bIdStr}-`, 'i'), '').replace(/^Room\s+/i, '');
                    }
                }

                if (!floorDisplay && s.floor !== undefined && s.floor !== null) {
                    floorDisplay = typeof s.floor === 'number'
                        ? (s.floor === 0 ? 'Ground Floor' : (s.floor === 1 ? '1st Floor' : `${s.floor}th Floor`))
                        : String(s.floor);
                }

                const targetBuildingId = bldg ? (isNaN(Number(bldg.id)) ? bldg.id : Number(bldg.id)) : (isNaN(Number(s.building_id)) ? undefined : Number(s.building_id));

                const personObj = {
                    ...fb,
                    id: s.id,
                    name: s.name || fb.name || '',
                    title: s.title || fb.title || '',
                    position: s.position || fb.position || '',
                    department: s.department || fb.department || '',
                    faculty: s.faculty || fb.faculty || '',
                    location: {
                        building: bCode || fb.location?.building || '',
                        targetBuildingId: targetBuildingId || fb.location?.targetBuildingId,
                        floor: floorDisplay || fb.location?.floor || '',
                        room: roomDisplay || fb.location?.room || '',
                        description: roomDesc || fb.location?.description || '',
                        status: s.location_status || fb.location?.status || (bCode && (roomDisplay || roomDesc) ? 'exact' : (bCode ? 'building_only' : 'unresolved'))
                    },
                    contact: {
                        email: s.email || fb.contact?.email || '',
                        phone: s.phone || fb.contact?.phone || ''
                    }
                };

                peopleMap.set(sId, personObj);

                // Ensure the room in the building includes this staff member
                if (bldg && roomDisplay) {
                    const cleanRoomNum = roomDisplay.replace(/^Room\s+/i, '').toLowerCase();
                    let bRoom = (bldg.rooms || []).find(r => 
                        String(r.number || '').toLowerCase().includes(cleanRoomNum) ||
                        String(r.room || '').toLowerCase() === cleanRoomNum
                    );

                    if (!bRoom) {
                        bRoom = {
                            number: `Room ${roomDisplay.replace(/^Room\s+/i, '')}`,
                            room: roomDisplay.replace(/^Room\s+/i, ''),
                            floor: floorDisplay || 'Ground Floor',
                            description: `Staff Office – ${personObj.name} (${personObj.department || ''})`,
                            staff: [personObj.name],
                            keywords: [personObj.name.toUpperCase(), cleanRoomNum, `${bldg.shortName} ${cleanRoomNum}`.toUpperCase()]
                        };
                        bldg.rooms = bldg.rooms || [];
                        bldg.rooms.push(bRoom);
                    } else {
                        bRoom.staff = bRoom.staff || [];
                        if (!bRoom.staff.includes(personObj.name)) {
                            bRoom.staff.push(personObj.name);
                        }
                    }
                }

                // Clean up room associations in any other buildings where this staff member is not located
                buildingsMap.forEach((bldgItem, bldgIdStr) => {
                    if (bldgIdStr !== String(targetBuildingId) && bldgItem.rooms) {
                        bldgItem.rooms.forEach(r => {
                            if (r.staff && r.staff.includes(personObj.name)) {
                                r.staff = r.staff.filter(st => st !== personObj.name);
                            }
                        });
                    }
                });
            });
        } else {
            // Pure fallback mode
            (fallbackPeople || []).forEach(p => {
                if (isTombstoned('staff_directory', p.id)) return;
                peopleMap.set(String(p.id), { ...p });
            });
        }

        const buildingsData = Array.from(buildingsMap.values());
        const peopleData = Array.from(peopleMap.values());

        return { buildingsData, peopleData };
    }

    // 7. Stale-While-Revalidate Master Loader
    async function loadCampusData(onUpdate) {
        let initialData = null;

        // Step 1: Read cached datasets from IndexedDB
        try {
            const idbData = await readFromIndexedDB();
            if (idbData && idbData.buildings && idbData.buildings.length > 0) {
                const normalized = normalizeDataset(idbData);
                if (normalized.buildingsData.length > 0) {
                    initialData = { ...normalized, source: 'indexeddb' };
                }
            }
        } catch (e) {
            console.warn('[DataLoader] IndexedDB read notice:', e);
        }

        // Step 2: Fallback to bundled static JSON if IndexedDB is empty
        if (!initialData) {
            try {
                const bundled = await loadBundledJson();
                const normalized = normalizeDataset({
                    fallbackBuildings: bundled.buildings || [],
                    fallbackPeople: bundled.people || []
                });
                initialData = { ...normalized, source: 'bundled' };

                // Seed IndexedDB in background so future visits are instant offline
                if (bundled.buildings.length > 0) {
                    writeToIndexedDB({
                        buildings: bundled.buildings,
                        staff: (bundled.people || []).map(p => ({
                            id: p.id,
                            name: p.name,
                            title: p.title,
                            position: p.position,
                            department: p.department,
                            faculty: p.faculty,
                            building_id: p.location?.targetBuildingId ? String(p.location.targetBuildingId) : p.location?.building,
                            room_id: p.location?.room,
                            floor: p.location?.floor,
                            location_status: p.location?.status || 'exact',
                            email: p.contact?.email,
                            phone: p.contact?.phone
                        }))
                    }).catch(() => {});
                }
            } catch (bundledErr) {
                console.warn('[DataLoader] Bundled JSON fallback notice:', bundledErr);
                initialData = { buildingsData: [], peopleData: [], source: 'empty' };
            }
        }

        // Step 3: Background fetch from Supabase (usted_nav schema)
        const revalidateFromCloud = async () => {
            const nav = typeof navigator !== 'undefined' ? navigator : null;
            if (nav && nav.onLine === false) return;

            try {
                const cloudData = await fetchFromSupabase();
                if (cloudData && cloudData.buildings && cloudData.buildings.length > 0) {
                    // Update IndexedDB cache
                    await writeToIndexedDB(cloudData);

                    // Normalize and publish updated dataset
                    const updated = normalizeDataset({
                        buildings: cloudData.buildings,
                        rooms: cloudData.rooms,
                        staff: cloudData.staff,
                        fallbackBuildings: initialData?.buildingsData || [],
                        fallbackPeople: initialData?.peopleData || []
                    });

                    const result = { ...updated, source: 'supabase' };

                    if (typeof onUpdate === 'function') {
                        onUpdate(result);
                    }

                    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
                        window.dispatchEvent(new CustomEvent('campusos:data-updated', { detail: result }));
                    }

                    console.log(`[DataLoader] Background revalidation succeeded (${cloudData.buildings.length} bldgs, ${cloudData.staff.length} staff).`);
                }
            } catch (err) {
                console.warn('[DataLoader] Background revalidation failed (using local cache):', err);
            }
        };

        // Trigger background revalidation non-blockingly
        if (typeof setTimeout !== 'undefined') {
            setTimeout(revalidateFromCloud, 50);
        } else {
            revalidateFromCloud();
        }

        if (typeof window !== 'undefined') {
            window.addEventListener('online', revalidateFromCloud);
            window.addEventListener('storage', (e) => {
                if (e.key === 'campusos_data_timestamp' || e.key === 'campusos_tombstones') {
                    readFromIndexedDB().then(idb => {
                        if (idb && idb.buildings) {
                            const updated = normalizeDataset(idb);
                            if (typeof onUpdate === 'function') onUpdate({ ...updated, source: 'indexeddb' });
                            window.dispatchEvent(new CustomEvent('campusos:data-updated', { detail: { ...updated, source: 'indexeddb' } }));
                        }
                    }).catch(() => {});
                    revalidateFromCloud();
                }
            });
        }

        return initialData;
    }

    return {
        loadCampusData,
        readFromIndexedDB,
        writeToIndexedDB,
        loadBundledJson,
        fetchFromSupabase,
        normalizeDataset,
        getConfig
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataLoader;
}
if (typeof window !== 'undefined') {
    window.DataLoader = DataLoader;
    window.CampusData = DataLoader;
}
