import { Router } from 'express';
import { db } from '../database/connection';

const router = Router();

export type MarkerCategory = 'lake' | 'river' | 'parking';

export interface Marker {
    id: string;
    lat: number;
    lng: number;
    title: string;
    description?: string;
    category: MarkerCategory;
    metadata?: Record<string, unknown>;
}

type RawRow = {
    id: number;
    lat?: number | null;
    lng?: number | null;
    title?: string | null;
    description?: string | null;
    location_type?: string | null;
    [key: string]: unknown;
};

function getMarkers(): Marker[] {
    const stmt = db.prepare(`
        SELECT location_id AS id,
               latitude AS lat,
               longitude AS lng,
               name AS title,
               description,
               location_type,
               water_body_name,
               access_type,
               parking_available,
               boat_ramp,
               shore_fishing
        FROM locations
        WHERE latitude IS NOT NULL AND longitude IS NOT NULL
    `);
    const locations = stmt.all() as RawRow[];

    // Map location_type to marker category, defaulting to 'lake'
    return locations
        .filter((row) => typeof row.lat === 'number' && typeof row.lng === 'number')
        .map((row) => {
            const category: MarkerCategory = 
                row.location_type === 'river' ? 'river' : 
                row.location_type === 'parking' ? 'parking' : 'lake';
            
            return {
                id: `location-${row.id}`,
                lat: Number(row.lat),
                lng: Number(row.lng),
                title: (row.title ?? 'Untitled location') as string,
                description: (row.description ?? undefined) as string | undefined,
                category,
                metadata: {
                    ...row
                }
            };
        });
}

// GET all markers
router.get('/', (req, res) => {
    try {
        const markers = getMarkers();
        res.json(markers);
    } catch (error) {
        console.error('Error fetching markers:', error);
        res.status(500).json({ error: 'Failed to fetch markers' });
    }
});

export default router;
