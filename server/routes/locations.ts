import { Router } from 'express';
import { db } from '../database/connection';
import type { Location } from '../../shared/types';
import {validateRadius} from "../utils";

const router = Router();

// Create a new location
function createLocation(location: Location): number {
    const stmt = db.prepare(`
        INSERT INTO locations (
            name, description, longitude, latitude,
            location_type, water_body_name, access_type,
            parking_available, boat_ramp, shore_fishing,
            water_depth, structure_type, bottom_type, current_strength,
            rating, total_reviews, created_by, is_public
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
        location.name,
        location.description || null,
        location.longitude,
        location.latitude,
        location.location_type || null,
        location.water_body_name || null,
        location.access_type || null,
        location.parking_available || 0,
        location.boat_ramp || 0,
        location.shore_fishing || 0,
        location.water_depth || null,
        location.structure_type || null,
        location.bottom_type || null,
        location.current_strength || null,
        location.rating || null,
        location.total_reviews || 0,
        location.created_by || null,
        location.is_public || 1
    );

    return result.lastInsertRowid as number;
}

// Read all locations
export function getAllLocations(): Location[] {
    const stmt = db.prepare('SELECT * FROM locations ORDER BY name');
    return stmt.all() as Location[];
}

// Read a single location by ID
function getLocationById(location_id: number): Location | null {
    const stmt = db.prepare('SELECT * FROM locations WHERE location_id = ?');
    return stmt.get(location_id) as Location | null;
}

// Read locations by name (partial match)
function getLocationsByName(name: string): Location[] {
    const stmt = db.prepare('SELECT * FROM locations WHERE name LIKE ? ORDER BY name');
    return stmt.all(`%${name}%`) as Location[];
}

// Get locations within bounding box (for map view)
function getLocationsByBounds(minLat: number, maxLat: number, minLng: number, maxLng: number): Location[] {
    const stmt = db.prepare(`
        SELECT * FROM locations
        WHERE latitude BETWEEN ? AND ?
        AND longitude BETWEEN ? AND ?
        ORDER BY name
    `);
    return stmt.all(minLat, maxLat, minLng, maxLng) as Location[];
}

// Calculate distance between two points using Haversine formula
// Returns distance in miles
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Get all locations within a radius (in miles) of a point
function getLocationsWithinRadius(latitude: number, longitude: number, radiusMiles: number): Location[] {
    const stmt = db.prepare(`
        SELECT *,
        (3959 * acos(
            cos(? * 3.141592653589793 / 180) *
            cos(latitude * 3.141592653589793 / 180) *
            cos((longitude - ?) * 3.141592653589793 / 180) +
            sin(? * 3.141592653589793 / 180) *
            sin(latitude * 3.141592653589793 / 180)
        )) AS distance
        FROM locations
        WHERE distance <= ?
        ORDER BY distance
    `);
    return stmt.all(latitude, longitude, latitude, radiusMiles) as Location[];
}

// Update a location
function updateLocation(location_id: number, updates: Partial<Location>): boolean {
    const fields = Object.keys(updates)
        .filter(key => key !== 'location_id')
        .map(key => `${key} = ?`)
        .join(', ');

    if (!fields) return false;

    const values = Object.keys(updates)
        .filter((key) => key !== 'location_id')
        .map((key) => updates[key as keyof Location] ?? null);

    const stmt = db.prepare(`
        UPDATE locations
        SET ${fields}, updated_at = CURRENT_TIMESTAMP
        WHERE location_id = ?
    `);

    const result = stmt.run(...values, location_id);
    return result.changes > 0;
}

// Delete a location
function deleteLocation(location_id: number): boolean {
    const stmt = db.prepare('DELETE FROM locations WHERE location_id = ?');
    const result = stmt.run(location_id);
    return result.changes > 0;
}

// Get location count
function getLocationCount(): number {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM locations');
    const result = stmt.get() as { count: number };
    return result.count;
}

// GET all locations
router.get('/', (req, res) => {
    try {
        const locations = getAllLocations();
        res.json(locations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch locations' });
    }
});

// GET locations within radius (for map)
router.get('/radius', (req, res) => {
    try {
        const { latitude, longitude, radius } = req.query;
        if (!latitude || !longitude || !radius) {
            return res.status(400).json({ error: 'latitude, longitude, and radius query parameters are required' });
        }

        const lat = parseFloat(latitude as string);
        const lon = parseFloat(longitude as string);
        const rad = parseFloat(radius as string);

        if (isNaN(lat) || isNaN(lon) || isNaN(rad)) {
            return res.status(400).json({message: 'Non numeric value passed as parameter'})
        }

        const flags = validateRadius(lat, lon, rad);
        if (flags.length > 0) {
            const messages = flags.join('\n');
            res.status(400).send({message: messages})
        }

        const locations = getLocationsWithinRadius(lat, lon, rad);
        res.json(locations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch locations by radius' });
    }
});

// GET location count
router.get('/count', (req, res) => {
    try {
        const count = getLocationCount();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch location count' });
    }
});

// GET search locations by name
router.get('/search', (req, res) => {
    try {
        const name = req.query.name as string;
        if (!name) {
            return res.status(400).json({ error: 'Name query parameter is required' });
        }
        const locations = getLocationsByName(name);
        res.json(locations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search locations' });
    }
});

// GET single location by ID
router.get('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const location = getLocationById(id);
        if (!location) {
            return res.status(404).json({ error: 'Location not found' });
        }
        res.json(location);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch location' });
    }
});

// POST create new location
router.post('/', (req, res) => {
    try {
        const location: Location = req.body;
        if (!location.name || location.longitude === undefined || location.latitude === undefined) {
            return res.status(400).json({ error: 'name, longitude, and latitude are required' });
        }
        const id = createLocation(location);
        res.status(201).json({ id, message: 'Location created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create location' });
    }
});

// PUT update location
router.put('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updates: Partial<Location> = req.body;
        const success = updateLocation(id, updates);
        if (!success) {
            return res.status(404).json({ error: 'Location not found or no changes made' });
        }
        res.json({ message: 'Location updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update location' });
    }
});

// DELETE location
router.delete('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const success = deleteLocation(id);
        if (!success) {
            return res.status(404).json({ error: 'Location not found' });
        }
        res.json({ message: 'Location deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete location' });
    }
});

export default router;
export { getLocationsWithinRadius, calculateDistance }
