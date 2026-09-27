/**
 * CampusOS Studio - Offline-First Sync & IndexedDB Engine
 * 
 * Manages local storage, mutation queue, and two-way Supabase replication.
 * Works seamlessly in 100% Offline / Local Sandbox mode.
 */

const CampusSync = (() => {
    const DB_NAME = 'CampusOS_Studio_DB';
    const DB_VERSION = 1;
    const DB_SCHEMA = 'usted_nav';
    let db = null;
    let supabaseClient = null;
    let activeSyncPromise = null;
    let syncRequestedAgain = false;

    // Config storage keys
    const STORAGE_KEY_CONFIG = 'campusos_supabase_config';
    const STORAGE_KEY_AUTH = 'campusos_supabase_auth';
    const STORAGE_KEY_TOMBSTONES = 'campusos_tombstones';
    const STORAGE_KEY_TIMESTAMP = 'campusos_data_timestamp';

    // Deleted record / tombstone tracking (prevents deleted IDs from resurrecting)
    function getTombstones() {
        try {
            const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY_TOMBSTONES) : null;
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    }

    function recordTombstone(storeName, id) {
        if (id === null || id === undefined) return;
        try {
            const tombstones = getTombstones();
            if (!tombstones[storeName]) tombstones[storeName] = {};
            tombstones[storeName][String(id)] = Date.now();
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(STORAGE_KEY_TOMBSTONES, JSON.stringify(tombstones));
                localStorage.setItem(STORAGE_KEY_TIMESTAMP, String(Date.now()));
            }
        } catch (e) {}
    }

    function isTombstoned(storeName, id) {
        if (id === null || id === undefined) return false;
        try {
            const tombstones = getTombstones();
            const tableMap = tombstones[storeName];
            return !!(tableMap && tableMap[String(id)]);
        } catch (e) {
            return false;
        }
    }

    function clearTombstone(storeName, id) {
        if (id === null || id === undefined) return;
        try {
            const tombstones = getTombstones();
            if (tombstones[storeName] && tombstones[storeName][String(id)]) {
                delete tombstones[storeName][String(id)];
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem(STORAGE_KEY_TOMBSTONES, JSON.stringify(tombstones));
                    localStorage.setItem(STORAGE_KEY_TIMESTAMP, String(Date.now()));
                }
            }
        } catch (e) {}
    }

    function clearAllTombstones() {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem(STORAGE_KEY_TOMBSTONES);
                localStorage.setItem(STORAGE_KEY_TIMESTAMP, String(Date.now()));
            }
        } catch (e) {}
    }

    // Reliable online detection across browsers, PWA, and Node 21+ environments
    function checkIsOnline() {
        if (typeof navigator === 'undefined') return true;
        if (navigator.onLine === undefined) return true;
        return navigator.onLine !== false;
    }

    // In-memory callbacks for status updates
    const statusListeners = [];

    // Default connection configuration
    let config = {
        supabaseUrl: '',
        supabaseAnonKey: '',
        orgId: 'usted-ksi',
        isSandbox: true
    };

    let currentUser = null;
    let isSyncing = false;

    // Initialize Supabase Client with isolated schema and profile headers
    function getSupabaseClient() {
        if (supabaseClient) return supabaseClient;
        const sb = (typeof window !== 'undefined' && window.supabase) || 
                   (typeof globalThis !== 'undefined' && globalThis.supabase) ||
                   (typeof global !== 'undefined' && global.supabase);

        const cleanUrl = (config.supabaseUrl || '').trim().replace(/\/+$/, '');
        const cleanKey = (config.supabaseAnonKey || '').trim();

        if (sb && typeof sb.createClient === 'function' && cleanUrl && cleanKey) {
            const token = currentUser?.access_token || cleanKey;
            const headers = {
                'apikey': cleanKey,
                'Authorization': `Bearer ${token}`,
                'Accept-Profile': DB_SCHEMA,
                'Content-Profile': DB_SCHEMA,
                'Prefer': 'return=representation,resolution=merge-duplicates'
            };

            supabaseClient = sb.createClient(cleanUrl, cleanKey, {
                db: {
                    schema: DB_SCHEMA
                },
                auth: {
                    persistSession: true,
                    autoRefreshToken: true
                },
                global: {
                    headers
                }
            });

            if (currentUser?.access_token && typeof supabaseClient.auth?.setSession === 'function') {
                supabaseClient.auth.setSession({
                    access_token: currentUser.access_token,
                    refresh_token: currentUser.refresh_token || ''
                }).catch(e => console.warn('[Sync] Set session notice:', e));
            }

            return supabaseClient;
        }
        return null;
    }

    // Refresh Supabase auth token if expiring or expired
    async function refreshAuthToken() {
        if (!currentUser?.refresh_token || !config.supabaseUrl || !config.supabaseAnonKey) return null;
        try {
            const res = await fetch(`${config.supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': config.supabaseAnonKey
                },
                body: JSON.stringify({ refresh_token: currentUser.refresh_token })
            });
            if (res.ok) {
                const data = await res.json();
                currentUser.access_token = data.access_token;
                currentUser.refresh_token = data.refresh_token || currentUser.refresh_token;
                currentUser.expires_at = data.expires_at || (Math.floor(Date.now() / 1000) + (data.expires_in || 3600));
                localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(currentUser));
                supabaseClient = null;
                notifyListeners();
                return currentUser.access_token;
            } else {
                console.warn('[Sync] Stale auth session cleared (refresh rejected with status ' + res.status + ')');
                currentUser = null;
                supabaseClient = null;
                localStorage.removeItem(STORAGE_KEY_AUTH);
                notifyListeners();
                return null;
            }
        } catch (e) {
            console.warn('[Sync] Failed to refresh auth token:', e);
            return null;
        }
    }

    async function ensureValidAuthToken() {
        if (!currentUser) return null;
        const nowSec = Math.floor(Date.now() / 1000);
        if (currentUser.expires_at && currentUser.expires_at <= nowSec + 60) {
            return await refreshAuthToken();
        }
        return currentUser.access_token;
    }

    function getActiveEnv() {
        return (typeof window !== 'undefined' && window.ENV) ||
               (typeof globalThis !== 'undefined' && globalThis.ENV) ||
               (typeof global !== 'undefined' && global.ENV) || null;
    }

    // Initialize configuration from localStorage and window.ENV defaults
    function loadConfig() {
        try {
            const env = getActiveEnv();
            const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
            let parsed = saved ? JSON.parse(saved) : {};

            const rawUrl = parsed.supabaseUrl || (env ? env.supabaseUrl : '') || (typeof APP_CONFIG !== 'undefined' ? APP_CONFIG.SUPABASE_URL : '');
            const rawKey = parsed.supabaseAnonKey || (env ? env.supabaseKey : '') || (typeof APP_CONFIG !== 'undefined' ? APP_CONFIG.SUPABASE_ANON_KEY : '');
            const rawOrg = parsed.orgId || (env ? env.orgId : '') || (typeof APP_CONFIG !== 'undefined' ? APP_CONFIG.DEFAULT_ORG_ID : 'usted-ksi');

            config.supabaseUrl = (rawUrl || '').trim().replace(/\/+$/, '');
            config.supabaseAnonKey = (rawKey || '').trim();
            config.orgId = (rawOrg || 'usted-ksi').trim();

            const authSaved = localStorage.getItem(STORAGE_KEY_AUTH);
            if (authSaved) {
                currentUser = JSON.parse(authSaved);
            }
        } catch (e) {
            console.warn('[Sync] Failed to read saved config from localStorage', e);
        }
        config.isSandbox = !config.supabaseUrl || !config.supabaseAnonKey;
        supabaseClient = null;
    }

    function saveConfig(newConfig) {
        if (newConfig) {
            if (newConfig.supabaseUrl !== undefined) {
                config.supabaseUrl = (newConfig.supabaseUrl || '').trim().replace(/\/+$/, '');
                try { localStorage.setItem('supabase_url', config.supabaseUrl); } catch (e) {}
            }
            if (newConfig.supabaseAnonKey !== undefined) {
                config.supabaseAnonKey = (newConfig.supabaseAnonKey || '').trim();
                try { localStorage.setItem('supabase_anon_key', config.supabaseAnonKey); } catch (e) {}
            }
            if (newConfig.orgId !== undefined) {
                config.orgId = (newConfig.orgId || 'usted-ksi').trim();
                try { localStorage.setItem('campus_org_id', config.orgId); } catch (e) {}
            }
            if (newConfig.isSandbox !== undefined) {
                config.isSandbox = !!newConfig.isSandbox;
            }
        }
        config.isSandbox = !config.supabaseUrl || !config.supabaseAnonKey;
        supabaseClient = null;
        try {
            localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
        } catch (e) {}
        notifyListeners();
    }

    // In-memory fallback if IndexedDB is blocked or unavailable
    const memoryStore = {
        buildings: new Map(),
        rooms: new Map(),
        staff_directory: new Map(),
        mutation_queue: []
    };

    // Open IndexedDB database with object stores (with fail-safe fallback)
    async function initDB() {
        if (typeof indexedDB === 'undefined') {
            console.warn('[Sync] IndexedDB not available, using in-memory store.');
            return null;
        }

        return new Promise((resolve) => {
            try {
                const request = indexedDB.open(DB_NAME, DB_VERSION);

                request.onupgradeneeded = (e) => {
                    const database = e.target.result;

                    // 1. Buildings Store
                    if (!database.objectStoreNames.contains('buildings')) {
                        const bStore = database.createObjectStore('buildings', { keyPath: 'id' });
                        bStore.createIndex('code', 'code', { unique: false });
                        bStore.createIndex('type', 'type', { unique: false });
                        bStore.createIndex('org_id', 'org_id', { unique: false });
                    }

                    // 2. Rooms Store
                    if (!database.objectStoreNames.contains('rooms')) {
                        const rStore = database.createObjectStore('rooms', { keyPath: 'id' });
                        rStore.createIndex('building_id', 'building_id', { unique: false });
                        rStore.createIndex('floor', 'floor', { unique: false });
                        rStore.createIndex('org_id', 'org_id', { unique: false });
                    }

                    // 3. Staff Directory Store
                    if (!database.objectStoreNames.contains('staff_directory')) {
                        const sStore = database.createObjectStore('staff_directory', { keyPath: 'id' });
                        sStore.createIndex('building_id', 'building_id', { unique: false });
                        sStore.createIndex('room_id', 'room_id', { unique: false });
                        sStore.createIndex('department', 'department', { unique: false });
                        sStore.createIndex('org_id', 'org_id', { unique: false });
                    }

                    // 4. Mutation Queue Store
                    if (!database.objectStoreNames.contains('mutation_queue')) {
                        const qStore = database.createObjectStore('mutation_queue', { keyPath: 'queue_id', autoIncrement: true });
                        qStore.createIndex('synced', 'synced', { unique: false });
                        qStore.createIndex('timestamp', 'timestamp', { unique: false });
                    }
                };

                request.onsuccess = (e) => {
                    db = e.target.result;
                    resolve(db);
                };

                request.onerror = (e) => {
                    console.warn('[Sync] IndexedDB open error (falling back to memory):', e);
                    db = null;
                    resolve(null);
                };
            } catch (err) {
                console.warn('[Sync] IndexedDB exception (falling back to memory):', err);
                db = null;
                resolve(null);
            }
        });
    }

    // Check if initial seeding is needed from window.CAMPUS_SEED_DATA or seed_data.json
    async function checkAndBootstrapData() {
        try {
            const buildingCount = await countRecords('buildings');
            if (buildingCount === 0) {
                console.log('[Sync] Database is empty. Loading initial seed dataset...');
                let data = null;

                // Priority 1: Instant in-memory seed dataset
                if (typeof window !== 'undefined' && window.CAMPUS_SEED_DATA) {
                    data = window.CAMPUS_SEED_DATA;
                } else {
                    // Priority 2: Network fetch
                    let res = await fetch('/admin/seed_data.json').catch(() => null);
                    if (!res || !res.ok) {
                        res = await fetch('seed_data.json').catch(() => null);
                    }
                    if (res && res.ok) {
                        data = await res.json();
                    }
                }

                if (data) {
                    const b = (data.buildings || []).filter(item => !isTombstoned('buildings', item.id));
                    const r = (data.rooms || []).filter(item => !isTombstoned('rooms', item.id));
                    const s = (data.staff || []).filter(item => !isTombstoned('staff_directory', item.id));
                    await bulkPut('buildings', b);
                    await bulkPut('rooms', r);
                    await bulkPut('staff_directory', s);
                    console.log(`[Sync] Bootstrapped with ${b.length} buildings, ${r.length} rooms, ${s.length} staff members.`);
                }
            }
        } catch (err) {
            console.warn('[Sync] Could not auto-bootstrap seed_data:', err);
        }
    }

    // Helper: Count records in a store
    async function countRecords(storeName) {
        if (!db) {
            return memoryStore[storeName] ? memoryStore[storeName].size : 0;
        }
        return new Promise((resolve) => {
            try {
                const tx = db.transaction([storeName], 'readonly');
                const store = tx.objectStore(storeName);
                const req = store.count();
                req.onsuccess = () => resolve(req.result || 0);
                req.onerror = () => resolve(memoryStore[storeName] ? memoryStore[storeName].size : 0);
            } catch (e) {
                resolve(memoryStore[storeName] ? memoryStore[storeName].size : 0);
            }
        });
    }

    // Helper: Bulk put items into a store
    async function bulkPut(storeName, items) {
        if (!items || items.length === 0) return;
        // Always mirror to memory store as backup
        if (memoryStore[storeName]) {
            items.forEach(item => memoryStore[storeName].set(item.id, item));
        }
        if (!db) return;
        return new Promise((resolve) => {
            try {
                const tx = db.transaction([storeName], 'readwrite');
                const store = tx.objectStore(storeName);
                items.forEach(item => store.put(item));
                tx.oncomplete = () => resolve();
                tx.onerror = () => resolve();
            } catch (e) {
                resolve();
            }
        });
    }

    // =========================================================================
    // CRUD Operations (Local-First: writes immediately to IndexedDB & Queue)
    // =========================================================================

    async function getAll(storeName) {
        const getFallbackData = () => {
            let data = [];
            if (memoryStore[storeName] && memoryStore[storeName].size > 0) {
                data = Array.from(memoryStore[storeName].values());
            } else if (typeof window !== 'undefined' && window.CAMPUS_SEED_DATA) {
                if (storeName === 'buildings') data = window.CAMPUS_SEED_DATA.buildings || [];
                if (storeName === 'rooms') data = window.CAMPUS_SEED_DATA.rooms || [];
                if (storeName === 'staff_directory') data = window.CAMPUS_SEED_DATA.staff || [];
            }
            return data.filter(item => !isTombstoned(storeName, item.id));
        };

        if (!db) {
            return getFallbackData();
        }

        return new Promise((resolve) => {
            try {
                const tx = db.transaction([storeName], 'readonly');
                const store = tx.objectStore(storeName);
                const req = store.getAll();
                req.onsuccess = () => {
                    const result = req.result || [];
                    if (result.length === 0) {
                        resolve(getFallbackData());
                    } else {
                        const filtered = result.filter(item => !isTombstoned(storeName, item.id));
                        if (memoryStore[storeName]) {
                            filtered.forEach(item => memoryStore[storeName].set(item.id, item));
                        }
                        resolve(filtered);
                    }
                };
                req.onerror = () => resolve(getFallbackData());
            } catch (e) {
                resolve(getFallbackData());
            }
        });
    }

    async function getById(storeName, id) {
        if (!db) {
            return memoryStore[storeName] ? (memoryStore[storeName].get(id) || null) : null;
        }
        return new Promise((resolve) => {
            try {
                const tx = db.transaction([storeName], 'readonly');
                const store = tx.objectStore(storeName);
                const req = store.get(id);
                req.onsuccess = () => resolve(req.result || (memoryStore[storeName] ? memoryStore[storeName].get(id) : null) || null);
                req.onerror = () => resolve(memoryStore[storeName] ? (memoryStore[storeName].get(id) || null) : null);
            } catch (e) {
                resolve(memoryStore[storeName] ? (memoryStore[storeName].get(id) || null) : null);
            }
        });
    }

    async function saveRecord(storeName, record) {
        record.updated_at = new Date().toISOString();
        if (!record.created_at) record.created_at = record.updated_at;
        if (!record.org_id) record.org_id = config.orgId;

        // Clear any previous tombstone for this ID since it's actively being saved
        clearTombstone(storeName, record.id);

        // Mirror to memory store
        if (memoryStore[storeName]) {
            memoryStore[storeName].set(record.id, record);
        }

        // 1. Write to local IndexedDB store if available
        if (db) {
            await new Promise((resolve) => {
                try {
                    const tx = db.transaction([storeName], 'readwrite');
                    const store = tx.objectStore(storeName);
                    const req = store.put(record);
                    req.onsuccess = () => resolve(req.result);
                    req.onerror = () => resolve(record);
                } catch (e) {
                    resolve(record);
                }
            });
        }

        // 2. Queue mutation
        await enqueueMutation(storeName, 'UPSERT', record);
        notifyListeners();

        // 3. Attempt immediate sync if connected
        if (!config.isSandbox && checkIsOnline()) {
            await triggerSync();
        }

        return record;
    }

    async function deleteRecord(storeName, id) {
        // Record tombstone immediately to prevent any reload resurrection
        recordTombstone(storeName, id);

        // Flexible ID representations
        const idStr = String(id);
        const idNum = !isNaN(Number(id)) ? Number(id) : null;

        // Mirror deletion to memory store
        if (memoryStore[storeName]) {
            memoryStore[storeName].delete(id);
            memoryStore[storeName].delete(idStr);
            if (idNum !== null) memoryStore[storeName].delete(idNum);
        }

        // 1. Delete from local IndexedDB if available (handle both string & integer keys)
        if (db) {
            await new Promise((resolve) => {
                try {
                    const tx = db.transaction([storeName], 'readwrite');
                    const store = tx.objectStore(storeName);
                    try { store.delete(id); } catch (e) {}
                    try { store.delete(idStr); } catch (e) {}
                    if (idNum !== null) {
                        try { store.delete(idNum); } catch (e) {}
                    }
                    tx.oncomplete = () => resolve();
                    tx.onerror = () => resolve();
                    tx.onabort = () => resolve();
                } catch (e) {
                    resolve();
                }
            });

            // 1b. Remove any un-synced pending UPSERT mutations for this item from queue
            await new Promise((resolve) => {
                try {
                    const tx = db.transaction(['mutation_queue'], 'readwrite');
                    const store = tx.objectStore('mutation_queue');
                    const req = store.getAll();
                    req.onsuccess = () => {
                        const items = req.result || [];
                        items.forEach(m => {
                            if (m.table === storeName && String(m.record_id) === idStr && m.action === 'UPSERT') {
                                try { store.delete(m.queue_id); } catch (e) {}
                            }
                        });
                        resolve();
                    };
                    req.onerror = () => resolve();
                } catch (e) {
                    resolve();
                }
            });
        }

        memoryStore.mutation_queue = memoryStore.mutation_queue.filter(
            m => !(m.table === storeName && String(m.record_id) === idStr && m.action === 'UPSERT')
        );

        // 2. Queue delete mutation
        await enqueueMutation(storeName, 'DELETE', { id, org_id: config.orgId });
        notifyListeners();

        // 3. Await sync so remote DELETE executes in Supabase before resolving
        if (!config.isSandbox && checkIsOnline()) {
            await triggerSync();
        }
    }

    // =========================================================================
    // Mutation Queue Management
    // =========================================================================

    async function enqueueMutation(table, action, data) {
        const entry = {
            queue_id: Date.now() + Math.random(),
            table,
            action,
            record_id: data.id,
            payload: data,
            timestamp: new Date().toISOString(),
            synced: false,
            attempts: 0,
            last_error: null
        };

        memoryStore.mutation_queue.push(entry);

        if (!db) return entry.queue_id;

        return new Promise((resolve) => {
            try {
                const tx = db.transaction(['mutation_queue'], 'readwrite');
                const store = tx.objectStore('mutation_queue');
                const req = store.add(entry);
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => resolve(entry.queue_id);
            } catch (e) {
                resolve(entry.queue_id);
            }
        });
    }

    async function getPendingMutations() {
        if (!db) {
            return memoryStore.mutation_queue.filter(m => !m.synced);
        }

        return new Promise((resolve) => {
            try {
                const tx = db.transaction(['mutation_queue'], 'readonly');
                const store = tx.objectStore('mutation_queue');
                const req = store.getAll();
                req.onsuccess = () => {
                    const all = req.result || [];
                    const pending = all.filter(m => !m.synced);
                    resolve(pending.length > 0 ? pending : memoryStore.mutation_queue.filter(m => !m.synced));
                };
                req.onerror = () => resolve(memoryStore.mutation_queue.filter(m => !m.synced));
            } catch (e) {
                resolve(memoryStore.mutation_queue.filter(m => !m.synced));
            }
        });
    }

    async function markMutationSynced(queueId) {
        const idx = memoryStore.mutation_queue.findIndex(m => m.queue_id === queueId);
        if (idx > -1) memoryStore.mutation_queue.splice(idx, 1);

        if (!db) return;

        return new Promise((resolve, reject) => {
            try {
                const tx = db.transaction(['mutation_queue'], 'readwrite');
                const store = tx.objectStore('mutation_queue');
                const req = store.delete(queueId);
                req.onsuccess = () => resolve();
                req.onerror = (e) => reject(e);
            } catch (e) {
                resolve();
            }
        });
    }

    // =========================================================================
    // Supabase Remote Replication & Auth
    // =========================================================================

    async function triggerSync() {
        if (config.isSandbox || !checkIsOnline()) return;
        if (activeSyncPromise) {
            syncRequestedAgain = true;
            return activeSyncPromise;
        }

        activeSyncPromise = (async () => {
            isSyncing = true;
            notifyListeners();
            try {
                do {
                    syncRequestedAgain = false;
                    await performSyncPass();
                } while (syncRequestedAgain);
            } finally {
                isSyncing = false;
                activeSyncPromise = null;
                notifyListeners();
            }
        })();

        return activeSyncPromise;
    }

    async function performSyncPass() {
        try {
            await ensureValidAuthToken();
            const pending = await getPendingMutations();
            console.log(`[Sync] Processing ${pending.length} pending mutations to Supabase (${DB_SCHEMA} schema)...`);

            const cleanUrl = (config.supabaseUrl || '').trim().replace(/\/+$/, '');
            const cleanKey = (config.supabaseAnonKey || '').trim();
            const token = currentUser?.access_token || cleanKey;
            const headers = {
                'Content-Type': 'application/json',
                'apikey': cleanKey,
                'Authorization': `Bearer ${token}`,
                'Accept-Profile': DB_SCHEMA,
                'Content-Profile': DB_SCHEMA,
                'Prefer': 'return=representation,resolution=merge-duplicates'
            };

            const client = getSupabaseClient();

            for (const item of pending) {
                try {
                    if (client && typeof client.schema === 'function') {
                        const target = client.schema(DB_SCHEMA).from(item.table);
                        if (item.action === 'UPSERT') {
                            const { error } = await target.upsert(item.payload, { onConflict: 'id' });
                            if (error) {
                                error.status = error.status || (error.code === '42501' || error.message?.includes('401') ? 401 : null);
                                throw error;
                            }
                        } else if (item.action === 'DELETE') {
                            const { error } = await target.delete().eq('id', item.record_id);
                            if (error) {
                                error.status = error.status || (error.code === '42501' || error.message?.includes('401') ? 401 : null);
                                throw error;
                            }
                        }
                        await markMutationSynced(item.queue_id);
                        continue;
                    }

                    // Raw REST API fallback with PostgREST schema headers
                    const endpoint = `${cleanUrl}/rest/v1/${item.table}`;
                    if (item.action === 'UPSERT') {
                        const res = await fetch(`${endpoint}?on_conflict=id`, {
                            method: 'POST',
                            headers,
                            body: JSON.stringify(item.payload)
                        });
                        if (!res.ok) {
                            const errBody = await res.text();
                            const err = new Error(`${res.status}: ${errBody}`);
                            err.status = res.status;
                            throw err;
                        }
                    } else if (item.action === 'DELETE') {
                        const res = await fetch(`${endpoint}?id=eq.${encodeURIComponent(item.record_id)}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                'apikey': cleanKey,
                                'Authorization': `Bearer ${token}`,
                                'Accept-Profile': DB_SCHEMA,
                                'Content-Profile': DB_SCHEMA
                            }
                        });
                        if (!res.ok) {
                            const errBody = await res.text();
                            const err = new Error(`${res.status}: ${errBody}`);
                            err.status = res.status;
                            throw err;
                        }
                    }
                    await markMutationSynced(item.queue_id);
                } catch (itemErr) {
                    const status = itemErr.status || 
                                   (itemErr.message && itemErr.message.includes('401') ? 401 : null) ||
                                   (itemErr.code === '401' ? 401 : null);

                    if (status === 401 || (itemErr.message && itemErr.message.includes('JWT'))) {
                        console.error(`[Sync] Mutation #${item.queue_id} failed with 401 Unauthorized:`, itemErr);
                        console.warn('[Sync] Supabase rejected write operation. If using Anon key without login, enable Anon write policy in Supabase RLS (see scripts/schema.sql), or sign in with an Administrator account in Settings.');
                        if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
                            window.showToast('Supabase write 401: Sign in under Settings or enable Anon write policy', 'error');
                        }
                    } else {
                        console.error(`[Sync] Failed mutation #${item.queue_id}:`, itemErr);
                    }
                    item.attempts = (item.attempts || 0) + 1;
                    item.last_error = itemErr.message || String(itemErr);
                }
            }

            // After pushing local mutations, fetch latest remote records (two-way pull)
            await pullRemoteRecords('buildings');
            await pullRemoteRecords('rooms');
            await pullRemoteRecords('staff_directory');

        } catch (syncErr) {
            console.error('[Sync] Full synchronization pass error:', syncErr);
        }
    }

    async function pullRemoteRecords(tableName) {
        if (config.isSandbox || !config.supabaseUrl) return;
        try {
            let records = null;
            const client = getSupabaseClient();
            if (client && typeof client.schema === 'function') {
                const { data, error } = await client
                    .schema(DB_SCHEMA)
                    .from(tableName)
                    .select('*')
                    .eq('org_id', config.orgId);
                if (error) throw error;
                records = data || [];
            } else {
                // Raw REST API fallback with PostgREST schema headers
                const cleanUrl = (config.supabaseUrl || '').trim().replace(/\/+$/, '');
                const cleanKey = (config.supabaseAnonKey || '').trim();
                const url = `${cleanUrl}/rest/v1/${tableName}?org_id=eq.${encodeURIComponent(config.orgId)}&select=*`;
                const token = currentUser?.access_token || cleanKey;
                const res = await fetch(url, {
                    headers: {
                        'apikey': cleanKey,
                        'Authorization': `Bearer ${token}`,
                        'Accept-Profile': DB_SCHEMA,
                        'Content-Profile': DB_SCHEMA
                    }
                });
                if (res.ok) {
                    records = await res.json();
                } else {
                    const errBody = await res.text();
                    console.warn(`[Sync] Pull returned ${res.status} for ${tableName}:`, errBody);
                }
            }

            if (Array.isArray(records)) {
                // 1. Filter out records that are locally tombstoned or pending local DELETE
                const pending = await getPendingMutations();
                const pendingDeletes = new Set(
                    pending.filter(m => m.table === tableName && m.action === 'DELETE')
                           .map(m => String(m.record_id))
                );

                const validRecords = records.filter(r => 
                    !isTombstoned(tableName, r.id) && !pendingDeletes.has(String(r.id))
                );

                // 2. Identify records that currently exist locally in IndexedDB and prune missing ones
                if (db) {
                    await new Promise((resolve) => {
                        try {
                            const tx = db.transaction([tableName], 'readwrite');
                            const store = tx.objectStore(tableName);
                            const getKeysReq = store.getAllKeys();
                            getKeysReq.onsuccess = () => {
                                const localKeys = getKeysReq.result || [];
                                const remoteKeySet = new Set(
                                    validRecords.flatMap(r => [
                                        String(r.id),
                                        r.id,
                                        !isNaN(Number(r.id)) ? Number(r.id) : null
                                    ].filter(Boolean))
                                );

                                // Pending UPSERT mutations should NOT be pruned from local
                                const pendingUpserts = new Set(
                                    pending.filter(m => m.table === tableName && m.action === 'UPSERT')
                                           .map(m => String(m.record_id))
                                );

                                localKeys.forEach(k => {
                                    const kStr = String(k);
                                    if (!remoteKeySet.has(k) && !remoteKeySet.has(kStr) && !pendingUpserts.has(kStr)) {
                                        // Record was deleted remotely! Prune from local store.
                                        try { store.delete(k); } catch (e) {}
                                        if (memoryStore[tableName]) {
                                            memoryStore[tableName].delete(k);
                                            memoryStore[tableName].delete(kStr);
                                        }
                                    }
                                });
                                resolve();
                            };
                            getKeysReq.onerror = () => resolve();
                        } catch (e) {
                            resolve();
                        }
                    });
                }

                // 3. Put authoritative remote records into local store
                if (validRecords.length > 0) {
                    await bulkPut(tableName, validRecords);
                }
            }
        } catch (e) {
            console.warn(`[Sync] Pull failed for table ${tableName}:`, e);
        }
    }

    // =========================================================================
    // Supabase Auth (Email / Password)
    // =========================================================================

    async function login(email, password) {
        if (config.isSandbox) {
            throw new Error('Configure Supabase Project URL and Anon Key in Settings before logging in.');
        }

        const cleanUrl = (config.supabaseUrl || '').trim().replace(/\/+$/, '');
        const cleanKey = (config.supabaseAnonKey || '').trim();

        const res = await fetch(`${cleanUrl}/auth/v1/token?grant_type=password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': cleanKey
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error_description || data.message || 'Login failed');
        }

        currentUser = {
            email: data.user?.email,
            id: data.user?.id,
            access_token: data.access_token,
            expires_at: data.expires_at || (Math.floor(Date.now() / 1000) + (data.expires_in || 3600)),
            refresh_token: data.refresh_token || ''
        };

        supabaseClient = null; // Re-instantiate client with authenticated credentials
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(currentUser));
        notifyListeners();
        triggerSync();
        return currentUser;
    }

    function logout() {
        currentUser = null;
        supabaseClient = null;
        localStorage.removeItem(STORAGE_KEY_AUTH);
        notifyListeners();
    }

    // Listeners for UI updates
    function subscribe(callback) {
        statusListeners.push(callback);
        return () => {
            const idx = statusListeners.indexOf(callback);
            if (idx > -1) statusListeners.splice(idx, 1);
        };
    }

    async function getStatus() {
        const pending = await getPendingMutations();
        return {
            isOnline: checkIsOnline(),
            isSandbox: config.isSandbox,
            isSyncing,
            pendingCount: pending.length,
            orgId: config.orgId,
            user: currentUser,
            supabaseUrl: config.supabaseUrl
        };
    }

    async function notifyListeners() {
        const status = await getStatus();
        statusListeners.forEach(cb => {
            try { cb(status); } catch (e) { console.error(e); }
        });
    }

    // Initialize module
    async function init() {
        loadConfig();
        await initDB();
        await checkAndBootstrapData();

        window.addEventListener('online', () => {
            console.log('[Sync] Device is online.');
            notifyListeners();
            if (!config.isSandbox) triggerSync();
        });

        window.addEventListener('offline', () => {
            console.log('[Sync] Device is offline. Operating in local-first queue mode.');
            notifyListeners();
        });

        notifyListeners();

        // Flush any pending queue mutations on initialization if online
        if (!config.isSandbox && checkIsOnline()) {
            triggerSync();
        }
    }

    return {
        init,
        getConfig: () => ({ ...config }),
        saveConfig,
        getAll,
        getById,
        saveRecord,
        deleteRecord,
        getPendingMutations,
        triggerSync,
        processPendingQueue: triggerSync,
        login,
        logout,
        subscribe,
        getStatus,
        bulkPut,
        getSupabaseClient: () => getSupabaseClient(),
        getSchema: () => DB_SCHEMA,
        pullRemoteRecords,
        getTombstones,
        isTombstoned,
        recordTombstone,
        clearTombstone,
        clearAllTombstones
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CampusSync;
}
