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

    // Config storage keys
    const STORAGE_KEY_CONFIG = 'campusos_supabase_config';
    const STORAGE_KEY_AUTH = 'campusos_supabase_auth';

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

        if (sb && typeof sb.createClient === 'function' && config.supabaseUrl && config.supabaseAnonKey) {
            supabaseClient = sb.createClient(config.supabaseUrl, config.supabaseAnonKey, {
                db: {
                    schema: DB_SCHEMA
                },
                global: {
                    headers: {
                        'Accept-Profile': DB_SCHEMA,
                        'Content-Profile': DB_SCHEMA
                    }
                }
            });
            return supabaseClient;
        }
        return null;
    }

    // Initialize configuration from localStorage
    function loadConfig() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
            if (saved) {
                config = { ...config, ...JSON.parse(saved) };
            }
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
        config = { ...config, ...newConfig };
        config.isSandbox = !config.supabaseUrl || !config.supabaseAnonKey;
        supabaseClient = null;
        localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
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
                    await bulkPut('buildings', data.buildings || []);
                    await bulkPut('rooms', data.rooms || []);
                    await bulkPut('staff_directory', data.staff || []);
                    console.log(`[Sync] Bootstrapped with ${data.buildings?.length} buildings, ${data.rooms?.length} rooms, ${data.staff?.length} staff members.`);
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
            if (memoryStore[storeName] && memoryStore[storeName].size > 0) {
                return Array.from(memoryStore[storeName].values());
            }
            if (typeof window !== 'undefined' && window.CAMPUS_SEED_DATA) {
                if (storeName === 'buildings') return window.CAMPUS_SEED_DATA.buildings || [];
                if (storeName === 'rooms') return window.CAMPUS_SEED_DATA.rooms || [];
                if (storeName === 'staff_directory') return window.CAMPUS_SEED_DATA.staff || [];
            }
            return [];
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
                        if (memoryStore[storeName]) {
                            result.forEach(item => memoryStore[storeName].set(item.id, item));
                        }
                        resolve(result);
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
        if (!config.isSandbox && navigator.onLine) {
            triggerSync();
        }

        return record;
    }

    async function deleteRecord(storeName, id) {
        // Mirror to memory store
        if (memoryStore[storeName]) {
            memoryStore[storeName].delete(id);
        }

        // 1. Delete from local IndexedDB if available
        if (db) {
            await new Promise((resolve) => {
                try {
                    const tx = db.transaction([storeName], 'readwrite');
                    const store = tx.objectStore(storeName);
                    const req = store.delete(id);
                    req.onsuccess = () => resolve();
                    req.onerror = () => resolve();
                } catch (e) {
                    resolve();
                }
            });
        }

        // 2. Queue delete mutation
        await enqueueMutation(storeName, 'DELETE', { id, org_id: config.orgId });
        notifyListeners();

        // 3. Attempt sync
        if (!config.isSandbox && navigator.onLine) {
            triggerSync();
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
        return new Promise((resolve, reject) => {
            const tx = db.transaction(['mutation_queue'], 'readwrite');
            const store = tx.objectStore('mutation_queue');
            const req = store.delete(queueId);
            req.onsuccess = () => resolve();
            req.onerror = (e) => reject(e);
        });
    }

    // =========================================================================
    // Supabase Remote Replication & Auth
    // =========================================================================

    async function triggerSync() {
        if (isSyncing || config.isSandbox || (typeof navigator !== 'undefined' && !navigator.onLine)) return;
        isSyncing = true;
        notifyListeners();

        try {
            const pending = await getPendingMutations();
            console.log(`[Sync] Processing ${pending.length} pending mutations to Supabase (${DB_SCHEMA} schema)...`);

            const token = currentUser?.access_token || config.supabaseAnonKey;
            const headers = {
                'Content-Type': 'application/json',
                'apikey': config.supabaseAnonKey,
                'Authorization': `Bearer ${token}`,
                'Accept-Profile': DB_SCHEMA,
                'Content-Profile': DB_SCHEMA
            };

            const client = getSupabaseClient();

            for (const item of pending) {
                try {
                    if (client && typeof client.schema === 'function') {
                        const target = client.schema(DB_SCHEMA).from(item.table);
                        if (item.action === 'UPSERT') {
                            const { error } = await target.upsert(item.payload, { onConflict: 'id' });
                            if (error) throw error;
                        } else if (item.action === 'DELETE') {
                            const { error } = await target.delete().eq('id', item.record_id);
                            if (error) throw error;
                        }
                        await markMutationSynced(item.queue_id);
                        continue;
                    }

                    // Raw REST API fallback with PostgREST schema headers
                    const endpoint = `${config.supabaseUrl}/rest/v1/${item.table}`;
                    if (item.action === 'UPSERT') {
                        const res = await fetch(`${endpoint}?on_conflict=id`, {
                            method: 'POST',
                            headers: {
                                ...headers,
                                'Prefer': 'resolution=merge-duplicates'
                            },
                            body: JSON.stringify(item.payload)
                        });
                        if (!res.ok) {
                            const errBody = await res.text();
                            throw new Error(`${res.status}: ${errBody}`);
                        }
                    } else if (item.action === 'DELETE') {
                        const res = await fetch(`${endpoint}?id=eq.${encodeURIComponent(item.record_id)}`, {
                            method: 'DELETE',
                            headers
                        });
                        if (!res.ok) {
                            const errBody = await res.text();
                            throw new Error(`${res.status}: ${errBody}`);
                        }
                    }
                    await markMutationSynced(item.queue_id);
                } catch (itemErr) {
                    console.error(`[Sync] Failed mutation #${item.queue_id}:`, itemErr);
                    item.attempts = (item.attempts || 0) + 1;
                    item.last_error = itemErr.message;
                }
            }

            // After pushing local mutations, fetch latest remote records (two-way pull)
            await pullRemoteRecords('buildings');
            await pullRemoteRecords('rooms');
            await pullRemoteRecords('staff_directory');

        } catch (syncErr) {
            console.error('[Sync] Full synchronization pass error:', syncErr);
        } finally {
            isSyncing = false;
            notifyListeners();
        }
    }

    async function pullRemoteRecords(tableName) {
        if (config.isSandbox || !config.supabaseUrl) return;
        try {
            const client = getSupabaseClient();
            if (client && typeof client.schema === 'function') {
                const { data, error } = await client
                    .schema(DB_SCHEMA)
                    .from(tableName)
                    .select('*')
                    .eq('org_id', config.orgId);
                if (error) throw error;
                if (data && data.length) {
                    await bulkPut(tableName, data);
                }
                return;
            }

            // Raw REST API fallback with PostgREST schema headers
            const url = `${config.supabaseUrl}/rest/v1/${tableName}?org_id=eq.${encodeURIComponent(config.orgId)}&select=*`;
            const token = currentUser?.access_token || config.supabaseAnonKey;
            const res = await fetch(url, {
                headers: {
                    'apikey': config.supabaseAnonKey,
                    'Authorization': `Bearer ${token}`,
                    'Accept-Profile': DB_SCHEMA,
                    'Content-Profile': DB_SCHEMA
                }
            });
            if (res.ok) {
                const records = await res.json();
                if (records && records.length) {
                    await bulkPut(tableName, records);
                }
            } else {
                const errBody = await res.text();
                console.warn(`[Sync] Pull returned ${res.status} for ${tableName}:`, errBody);
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

        const res = await fetch(`${config.supabaseUrl}/auth/v1/token?grant_type=password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': config.supabaseAnonKey
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
            expires_at: data.expires_at
        };

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
            isOnline: navigator.onLine,
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
        login,
        logout,
        subscribe,
        getStatus,
        bulkPut,
        getSupabaseClient: () => getSupabaseClient(),
        getSchema: () => DB_SCHEMA,
        pullRemoteRecords
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CampusSync;
}
