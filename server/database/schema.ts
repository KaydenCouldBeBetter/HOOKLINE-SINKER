import {db} from './connection'

const initSchema = () => {
    db.run(`
    CREATE TABLE IF NOT EXISTS species (
        species_id INTEGER PRIMARY KEY AUTOINCREMENT,
        -- Essential Information
        species_name TEXT NOT NULL,
        scientific_name TEXT,
        description TEXT,
        -- Size & Regulations
        min_legal_size REAL,
        max_legal_size REAL,
        bag_limit INTEGER,
        average_weight REAL,
        record_weight REAL,
        -- Habitat & Behavior
        habitat_type TEXT,
        water_depth_range TEXT,
        temperature_range TEXT,
        seasonal_availability TEXT,
        time_of_day TEXT,
        -- Fishing Details
        best_baits TEXT,
        best_lures TEXT,
        fishing_techniques TEXT,
        difficulty_level TEXT,
        -- Location & Conservation
        common_locations TEXT,
        conservation_status TEXT,
        eating_quality INTEGER,
        catch_and_release_recommended INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    `)

    db.run(`
    CREATE TABLE IF NOT EXISTS images (
        image_id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL UNIQUE,
        original_filename TEXT,
        file_path TEXT NOT NULL,
        file_size INTEGER,
        mime_type TEXT,
        width INTEGER,
        height INTEGER,
        alt_text TEXT,
        caption TEXT,
        uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    `)

    db.run(`
    CREATE TABLE IF NOT EXISTS species_images (
        species_image_id INTEGER PRIMARY KEY AUTOINCREMENT,
        species_id INTEGER NOT NULL,
        image_id INTEGER NOT NULL,
        is_primary INTEGER DEFAULT 0,
        display_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (species_id) REFERENCES species(species_id) ON DELETE CASCADE,
        FOREIGN KEY (image_id) REFERENCES images(image_id) ON DELETE CASCADE,
        UNIQUE(species_id, image_id)
    )
    `)

    db.run(`
    CREATE TABLE IF NOT EXISTS locations (
        location_id INTEGER PRIMARY KEY AUTOINCREMENT,
        -- Basic Information
        name TEXT NOT NULL,
        description TEXT,
        -- Mapbox Pin Data
        longitude REAL NOT NULL,
        latitude REAL NOT NULL,
        -- Additional Location Details
        location_type TEXT,
        water_body_name TEXT,
        access_type TEXT,
        parking_available INTEGER DEFAULT 0,
        boat_ramp INTEGER DEFAULT 0,
        shore_fishing INTEGER DEFAULT 0,
        -- Conditions & Features
        water_depth TEXT,
        structure_type TEXT,
        bottom_type TEXT,
        current_strength TEXT,
        -- User Data
        rating REAL,
        total_reviews INTEGER DEFAULT 0,
        created_by TEXT,
        is_public INTEGER DEFAULT 1,
        -- Timestamps
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    `)

    db.run(`
    CREATE TABLE IF NOT EXISTS location_images (
        location_image_id INTEGER PRIMARY KEY AUTOINCREMENT,
        location_id INTEGER NOT NULL,
        image_id INTEGER NOT NULL,
        is_primary INTEGER DEFAULT 0,
        display_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE CASCADE,
        FOREIGN KEY (image_id) REFERENCES images(image_id) ON DELETE CASCADE,
        UNIQUE(location_id, image_id)
    )
    `)

    db.run(`
    CREATE TABLE IF NOT EXISTS location_species (
        location_species_id INTEGER PRIMARY KEY AUTOINCREMENT,
        location_id INTEGER NOT NULL,
        species_id INTEGER NOT NULL,
        abundance TEXT,
        best_season TEXT,
        notes TEXT,
        last_reported DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE CASCADE,
        FOREIGN KEY (species_id) REFERENCES species(species_id) ON DELETE CASCADE,
        UNIQUE(location_id, species_id)
    )
    `)

    db.run(`CREATE INDEX IF NOT EXISTS idx_species_images_species ON species_images(species_id)`)
    db.run(`CREATE INDEX IF NOT EXISTS idx_species_images_image ON species_images(image_id)`)
    db.run(`CREATE INDEX IF NOT EXISTS idx_images_filename ON images(filename)`)
    db.run(`CREATE INDEX IF NOT EXISTS idx_locations_coords ON locations(latitude, longitude)`)
    db.run(`CREATE INDEX IF NOT EXISTS idx_location_images_location ON location_images(location_id)`)
    db.run(`CREATE INDEX IF NOT EXISTS idx_location_images_image ON location_images(image_id)`)
    db.run(`CREATE INDEX IF NOT EXISTS idx_location_species_location ON location_species(location_id)`)
    db.run(`CREATE INDEX IF NOT EXISTS idx_location_species_species ON location_species(species_id)`)
}

export { initSchema }
