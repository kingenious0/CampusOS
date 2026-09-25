#!/usr/bin/env node
/**
 * CampusOS Studio - Supabase Seeding Script
 * 
 * Normalizes campus buildings, rooms, and staff directory data from:
 *   - data/buildings.json
 *   - data/people.json
 * 
 * Inserts or upserts into Supabase PostgreSQL tables:
 *   - buildings
 *   - rooms
 *   - staff_directory
 * 
 * Usage:
 *   SUPABASE_URL="https://xxx.supabase.co" SUPABASE_SERVICE_ROLE_KEY="eyJ..." node scripts/seed_supabase.js
 * 
 * If environment variables are omitted, it writes out:
 *   - scripts/seed_data.sql (Ready to paste directly into Supabase SQL Editor)
 *   - admin/seed_data.json (Used by the Admin UI for offline local sandbox mode)
 */

const fs = require('fs');
const path = require('path');

const ORG_ID = process.env.CAMPUS_ORG_ID || 'usted-ksi';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

// 1. Helper: Normalize Floor strings to integer
function normalizeFloor(floorStr) {
    if (floorStr === null || floorStr === undefined || floorStr === '') return 0;
    if (typeof floorStr === 'number') return floorStr;
    const s = String(floorStr).trim().toLowerCase();
    if (s.includes('basement') || s === '-1') return -1;
    if (s.includes('ground') || s === 'gf' || s === '0' || s === 'g') return 0;
    if (s.includes('1st') || s.includes('first') || s === '1' || s === 'ff') return 1;
    if (s.includes('2nd') || s.includes('second') || s === '2' || s === 'sf') return 2;
    if (s.includes('3rd') || s.includes('third') || s === '3' || s === 'tf') return 3;
    if (s.includes('4th') || s.includes('fourth') || s === '4') return 4;
    return 0;
}

// 2. Helper: Clean room string
function cleanRoomNumber(roomStr) {
    if (!roomStr) return '';
    let r = String(roomStr).trim();
    // remove leading "Room " or "room "
    r = r.replace(/^room\s+/i, '');
    return r.trim();
}

// 3. Helper: Slugify string for IDs
function slugify(text) {
    return String(text || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// 4. Load raw datasets
const buildingsPath = path.join(__dirname, '..', 'data', 'buildings.json');
const peoplePath = path.join(__dirname, '..', 'data', 'people.json');

const rawBuildings = JSON.parse(fs.readFileSync(buildingsPath, 'utf8'));
const rawPeople = JSON.parse(fs.readFileSync(peoplePath, 'utf8'));

console.log(`[Seed] Loaded ${rawBuildings.length} raw buildings and ${rawPeople.length} staff records.`);

// 5. Build Building ID and Code Mappings
// Maps building codes (e.g. 'CBT', 'ROB', 'FBR') to standardized building IDs
const codeToBuildingId = {
    'cbt': '35',
    'cbt building': '35',
    'rob': '25',
    'rob block': '25',
    'fbr': '13',
    'fte': '13',
    'faculty of technical education': '13',
    'main administration block': '26',
    'admin': '26',
    'adb': '28',
    'fasme': '28',
    'fasme block': '28',
    'esa': '21',
    'esa block': '21',
    'nfb': '22',
    'nlb': '23',
    'odsa': '30',
    'dean\'s office (odsa)': '30',
    'tl block': '12',
    't.l. block': '12',
    'library': '1',
    'usted library': '1'
};

const buildings = rawBuildings.map(b => {
    const id = String(b.id);
    let code = b.shortName || '';
    if (b.name === 'ROB Block') code = 'ROB';
    else if (b.name === 'Executive Students Association (ESA) Lecture Block') code = 'ESA';
    else if (b.name === 'Faculty of Technical Education') code = 'FTE';
    else if (b.name === 'CBT Building') code = 'CBT';
    else if (b.name === 'FASME Block') code = 'FASME';
    else if (b.name === 'Main Administration Block') code = 'ADMIN';

    return {
        id,
        org_id: ORG_ID,
        code: code.toUpperCase(),
        name: b.name,
        short_name: b.shortName || b.name,
        type: b.type || 'academic',
        lat: Number(b.lat),
        lng: Number(b.lng),
        entrance: Array.isArray(b.entrance) && b.entrance.length >= 2 ? b.entrance : null,
        description: b.description || '',
        hours: b.hours || '',
        services: b.services || [],
        metadata: {
            source_id: b.id
        }
    };
});

// Also map by building name
buildings.forEach(b => {
    codeToBuildingId[b.name.toLowerCase()] = b.id;
    if (b.short_name) codeToBuildingId[b.short_name.toLowerCase()] = b.id;
    if (b.code) codeToBuildingId[b.code.toLowerCase()] = b.id;
});

// 6. Build Rooms Array
const rooms = [];
const roomIndexMap = new Map(); // key: `${building_id}:${cleanedRoomNumber.toLowerCase()}` -> room_id

rawBuildings.forEach(b => {
    const bId = String(b.id);
    if (!Array.isArray(b.rooms)) return;

    b.rooms.forEach((r, idx) => {
        const rawNum = r.number || r.room || `room-${idx + 1}`;
        const roomNum = cleanRoomNumber(rawNum);
        const roomId = `${bId}-${slugify(roomNum) || idx + 1}`;

        const roomObj = {
            id: roomId,
            org_id: ORG_ID,
            building_id: bId,
            room_number: roomNum || rawNum,
            floor: normalizeFloor(r.floor),
            description: r.description || '',
            keywords: Array.isArray(r.keywords) ? r.keywords : [],
            coordinates: r.coordinates || null,
            metadata: {
                staff: r.staff || []
            }
        };

        rooms.push(roomObj);
        roomIndexMap.set(`${bId}:${roomNum.toLowerCase()}`, roomId);
    });
});

// 7. Process Staff and link to Rooms
const staffDirectory = [];

rawPeople.forEach((p, idx) => {
    const pId = p.id || `staff-${idx + 1}`;
    const loc = p.location || {};
    const bRef = (loc.building || '').trim().toLowerCase();
    const matchedBuildingId = codeToBuildingId[bRef] || null;

    let matchedRoomId = null;
    let floorNum = normalizeFloor(loc.floor);

    if (loc.room && matchedBuildingId) {
        const cleanedNum = cleanRoomNumber(loc.room);
        const key = `${matchedBuildingId}:${cleanedNum.toLowerCase()}`;

        if (roomIndexMap.has(key)) {
            matchedRoomId = roomIndexMap.get(key);
        } else {
            // Room doesn't exist yet in rooms table -> dynamically create it!
            const newRoomId = `${matchedBuildingId}-${slugify(cleanedNum)}`;
            const newRoom = {
                id: newRoomId,
                org_id: ORG_ID,
                building_id: matchedBuildingId,
                room_number: cleanedNum,
                floor: floorNum,
                description: `${p.name} Office (${p.department || ''})`,
                keywords: [
                    `${cleanedNum}`,
                    `${p.name.toUpperCase()}`
                ],
                coordinates: null,
                metadata: {
                    auto_created_from_staff: p.name
                }
            };
            rooms.push(newRoom);
            roomIndexMap.set(key, newRoomId);
            matchedRoomId = newRoomId;
        }
    }

    staffDirectory.push({
        id: pId,
        org_id: ORG_ID,
        name: p.name,
        title: p.title || '',
        position: p.position || '',
        department: p.department || '',
        faculty: p.faculty || '',
        building_id: matchedBuildingId,
        room_id: matchedRoomId,
        floor: floorNum,
        email: p.contact?.email || '',
        phone: p.contact?.phone || '',
        location_status: loc.status || 'exact',
        metadata: {
            source: 'people.json'
        }
    });
});

console.log(`[Seed] Processed:`);
console.log(`  - ${buildings.length} Buildings`);
console.log(`  - ${rooms.length} Rooms (including dynamically resolved staff offices)`);
console.log(`  - ${staffDirectory.length} Staff Directory records`);

// 8. Generate Static JSON for Admin Local Sandbox Mode
const adminDir = path.join(__dirname, '..', 'admin');
if (!fs.existsSync(adminDir)) {
    fs.mkdirSync(adminDir, { recursive: true });
}

const seedData = {
    org_id: ORG_ID,
    generated_at: new Date().toISOString(),
    buildings,
    rooms,
    staff: staffDirectory
};

fs.writeFileSync(path.join(adminDir, 'seed_data.json'), JSON.stringify(seedData, null, 2), 'utf8');
fs.writeFileSync(path.join(adminDir, 'seed_data.js'), `window.CAMPUS_SEED_DATA = ${JSON.stringify(seedData, null, 2)};\n`, 'utf8');
console.log(`[Seed] Successfully saved admin/seed_data.json and admin/seed_data.js for Local Sandbox mode.`);

// 9. Generate SQL Insert/Upsert statements
function formatPostgresTextArray(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
        return 'ARRAY[]::TEXT[]';
    }
    const escaped = arr.map(item => {
        const str = String(item !== null && item !== undefined ? item : '');
        return `'${str.replace(/'/g, "''")}'`;
    });
    return `ARRAY[${escaped.join(', ')}]::TEXT[]`;
}

function escapeSql(val) {
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'number') return val;
    if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
    if (typeof val === 'object') {
        return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
    }
    return `'${String(val).replace(/'/g, "''")}'`;
}

let sqlContent = `SET search_path TO usted_nav, public;

-- ==============================================================================
-- CampusOS Studio - Automated Data Seed Script
-- Generated at: ${new Date().toISOString()}
-- Org: ${ORG_ID}
-- ==============================================================================

-- 1. Insert Buildings
`;

buildings.forEach(b => {
    sqlContent += `INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES (${escapeSql(b.id)}, ${escapeSql(b.org_id)}, ${escapeSql(b.code)}, ${escapeSql(b.name)}, ${escapeSql(b.short_name)}, ${escapeSql(b.type)}, ${b.lat}, ${b.lng}, ${escapeSql(b.entrance)}, ${escapeSql(b.description)}, ${escapeSql(b.hours)}, ${escapeSql(b.services)}, ${escapeSql(b.metadata)})
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
`;
});

sqlContent += `\n-- 2. Insert Rooms\n`;
rooms.forEach(r => {
    sqlContent += `INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES (${escapeSql(r.id)}, ${escapeSql(r.org_id)}, ${escapeSql(r.building_id)}, ${escapeSql(r.room_number)}, ${r.floor}, ${escapeSql(r.description)}, ${formatPostgresTextArray(r.keywords)}, ${escapeSql(r.coordinates)}, ${escapeSql(r.metadata)})
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
`;
});

sqlContent += `\n-- 3. Insert Staff Directory\n`;
staffDirectory.forEach(s => {
    sqlContent += `INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES (${escapeSql(s.id)}, ${escapeSql(s.org_id)}, ${escapeSql(s.name)}, ${escapeSql(s.title)}, ${escapeSql(s.position)}, ${escapeSql(s.department)}, ${escapeSql(s.faculty)}, ${escapeSql(s.building_id)}, ${escapeSql(s.room_id)}, ${escapeSql(s.floor)}, ${escapeSql(s.email)}, ${escapeSql(s.phone)}, ${escapeSql(s.location_status)}, ${escapeSql(s.metadata)})
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
`;
});

const sqlFilePath = path.join(__dirname, 'seed_data.sql');
fs.writeFileSync(sqlFilePath, sqlContent, 'utf8');
console.log(`[Seed] Successfully generated scripts/seed_data.sql for direct copy-paste into Supabase.`);

// 10. Direct REST API Seeding if credentials provided
if (SUPABASE_URL && SUPABASE_KEY) {
    console.log(`[Seed] Supabase URL detected (${SUPABASE_URL}). Initiating direct REST API upserts...`);

    async function pushBatch(table, items, batchSize = 100) {
        for (let i = 0; i < items.length; i += batchSize) {
            const chunk = items.slice(i, i + batchSize);
            const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Prefer': 'resolution=merge-duplicates',
                    'Accept-Profile': 'usted_nav',
                    'Content-Profile': 'usted_nav'
                },
                body: JSON.stringify(chunk)
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`Failed to seed ${table} batch ${i / batchSize}: ${res.status} ${errText}`);
            }
        }
        console.log(`  ✓ Synced ${items.length} records into table '${table}'`);
    }

    (async () => {
        try {
            await pushBatch('buildings', buildings);
            await pushBatch('rooms', rooms);
            await pushBatch('staff_directory', staffDirectory);
            console.log(`[Seed] Direct Supabase seeding completed successfully!`);
        } catch (err) {
            console.error(`[Seed Error] Direct API seeding failed:`, err.message);
        }
    })();
} else {
    console.log(`\n=================================================================`);
    console.log(`To push directly to live Supabase, run:`);
    console.log(`SUPABASE_URL="https://your-project.supabase.co" SUPABASE_SERVICE_ROLE_KEY="eyJ..." node scripts/seed_supabase.js`);
    console.log(`\nOr simply copy & paste the contents of scripts/seed_data.sql into your Supabase SQL Editor.`);
    console.log(`=================================================================\n`);
}
