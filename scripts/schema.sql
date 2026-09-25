-- ==============================================================================
-- CampusOS Studio (Admin CMS) - Supabase Database Schema
-- Multi-Tenant Campus Spatial & Directory Management System
-- Org Default: 'usted-ksi' (Akenten Appiah-Menka University of Skills Training
--                         and Entrepreneurial Development - Kumasi)
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Helper: Automatic updated_at timestamp function
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 2. BUILDINGS TABLE
-- Holds campus facilities, academic blocks, halls of residence, and admin centers
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS buildings (
    id TEXT PRIMARY KEY,                                -- e.g. 'library', 'rob', 'esa', 'cbt'
    org_id TEXT NOT NULL DEFAULT 'usted-ksi',           -- Multi-campus tenant isolation
    code TEXT,                                          -- Short code e.g. 'ROB', 'ESA', 'FBR'
    name TEXT NOT NULL,                                 -- Full display name
    short_name TEXT,                                    -- Short display name
    type TEXT NOT NULL DEFAULT 'academic',              -- 'academic', 'administration', 'hostel', 'facility', 'service'
    lat DOUBLE PRECISION NOT NULL,                      -- Latitude
    lng DOUBLE PRECISION NOT NULL,                      -- Longitude
    entrance JSONB DEFAULT '[]'::jsonb,                 -- GeoJSON/Array coordinate [lng, lat] of doorway
    description TEXT,                                   -- Detailed description
    hours TEXT,                                         -- Operational hours e.g. '7:00 AM – 10:00 PM'
    services JSONB DEFAULT '[]'::jsonb,                 -- Array of services provided
    metadata JSONB DEFAULT '{}'::jsonb,                 -- Floor plans, polygon bounds, images
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for buildings updated_at
DROP TRIGGER IF EXISTS trg_buildings_updated_at ON buildings;
CREATE TRIGGER trg_buildings_updated_at
    BEFORE UPDATE ON buildings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for buildings
CREATE INDEX IF NOT EXISTS idx_buildings_org ON buildings(org_id);
CREATE INDEX IF NOT EXISTS idx_buildings_code ON buildings(code);
CREATE INDEX IF NOT EXISTS idx_buildings_type ON buildings(type);
CREATE INDEX IF NOT EXISTS idx_buildings_coords ON buildings(lat, lng);

-- ------------------------------------------------------------------------------
-- 3. ROOMS TABLE
-- Holds rooms, lecture theatres, labs, workshops, and offices inside buildings
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY,                                -- e.g. 'rob-018', 'esa-17', 'library-101'
    org_id TEXT NOT NULL DEFAULT 'usted-ksi',           -- Multi-campus tenant isolation
    building_id TEXT NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    room_number TEXT NOT NULL,                          -- e.g. '018', 'Room 17', 'Lab 2'
    floor INTEGER NOT NULL DEFAULT 0,                   -- Floor index: 0 = Ground, 1 = 1st, 2 = 2nd, -1 = Basement
    description TEXT,                                   -- Purpose e.g. 'Lecturer Office', 'Computer Lab'
    keywords TEXT[] DEFAULT '{}'::TEXT[],               -- Search synonym keywords
    coordinates JSONB DEFAULT NULL,                     -- Optional indoor node or geo coordinates
    metadata JSONB DEFAULT '{}'::jsonb,                 -- Capacity, AC status, equipment
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for rooms updated_at
DROP TRIGGER IF EXISTS trg_rooms_updated_at ON rooms;
CREATE TRIGGER trg_rooms_updated_at
    BEFORE UPDATE ON rooms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for rooms
CREATE INDEX IF NOT EXISTS idx_rooms_org ON rooms(org_id);
CREATE INDEX IF NOT EXISTS idx_rooms_building ON rooms(building_id);
CREATE INDEX IF NOT EXISTS idx_rooms_number ON rooms(room_number);
CREATE INDEX IF NOT EXISTS idx_rooms_floor ON rooms(floor);
CREATE INDEX IF NOT EXISTS idx_rooms_keywords ON rooms USING GIN(keywords);

-- ------------------------------------------------------------------------------
-- 4. STAFF DIRECTORY TABLE
-- Faculty, lecturers, administrators, and head of departments with room allocation
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS staff_directory (
    id TEXT PRIMARY KEY,                                -- e.g. 'dr-kotor-asare', 'prof-stella-appiah'
    org_id TEXT NOT NULL DEFAULT 'usted-ksi',           -- Multi-campus tenant isolation
    name TEXT NOT NULL,                                 -- Full name
    title TEXT,                                         -- 'Dr.', 'Prof.', 'Mr.', 'Ms.', 'Arc.'
    position TEXT,                                      -- 'Senior Lecturer', 'Head of Department', 'Dean'
    department TEXT,                                    -- Academic or administrative department
    faculty TEXT,                                       -- Faculty or school
    building_id TEXT REFERENCES buildings(id) ON DELETE SET NULL,
    room_id TEXT REFERENCES rooms(id) ON DELETE SET NULL,
    floor INTEGER,                                      -- Direct floor shortcut (0, 1, 2)
    email TEXT,                                         -- Official email
    phone TEXT,                                         -- Contact phone
    location_status TEXT NOT NULL DEFAULT 'exact',      -- 'exact', 'approximate', 'building_only', 'unresolved'
    metadata JSONB DEFAULT '{}'::jsonb,                 -- Office hours, research interests, bio
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for staff_directory updated_at
DROP TRIGGER IF EXISTS trg_staff_updated_at ON staff_directory;
CREATE TRIGGER trg_staff_updated_at
    BEFORE UPDATE ON staff_directory
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for staff_directory
CREATE INDEX IF NOT EXISTS idx_staff_org ON staff_directory(org_id);
CREATE INDEX IF NOT EXISTS idx_staff_building ON staff_directory(building_id);
CREATE INDEX IF NOT EXISTS idx_staff_room ON staff_directory(room_id);
CREATE INDEX IF NOT EXISTS idx_staff_department ON staff_directory(department);
CREATE INDEX IF NOT EXISTS idx_staff_email ON staff_directory(email);
CREATE INDEX IF NOT EXISTS idx_staff_name ON staff_directory(name);

-- ------------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- Public can read (for client map & search). Authenticated users and Anon
-- (Studio CMS administrators) can modify.
-- ------------------------------------------------------------------------------
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_directory ENABLE ROW LEVEL SECURITY;

-- Grants for schema and table access
GRANT USAGE ON SCHEMA usted_nav TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA usted_nav TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA usted_nav TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA usted_nav GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA usted_nav GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- Buildings Policies
DROP POLICY IF EXISTS "Public read access for buildings" ON buildings;
CREATE POLICY "Public read access for buildings"
    ON buildings FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated write access for buildings" ON buildings;
CREATE POLICY "Authenticated write access for buildings"
    ON buildings FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Anon write access for buildings" ON buildings;
CREATE POLICY "Anon write access for buildings"
    ON buildings FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Rooms Policies
DROP POLICY IF EXISTS "Public read access for rooms" ON rooms;
CREATE POLICY "Public read access for rooms"
    ON rooms FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated write access for rooms" ON rooms;
CREATE POLICY "Authenticated write access for rooms"
    ON rooms FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Anon write access for rooms" ON rooms;
CREATE POLICY "Anon write access for rooms"
    ON rooms FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Staff Directory Policies
DROP POLICY IF EXISTS "Public read access for staff_directory" ON staff_directory;
CREATE POLICY "Public read access for staff_directory"
    ON staff_directory FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated write access for staff_directory" ON staff_directory;
CREATE POLICY "Authenticated write access for staff_directory"
    ON staff_directory FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Anon write access for staff_directory" ON staff_directory;
CREATE POLICY "Anon write access for staff_directory"
    ON staff_directory FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- ==============================================================================
-- End of Schema Definition
-- ==============================================================================
