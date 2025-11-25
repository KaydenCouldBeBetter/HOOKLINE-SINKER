import Database from 'better-sqlite3';
import { DATABASE_URL } from '$env/static/private';

const db = new Database(DATABASE_URL.replace('file:', ''), { fileMustExist: true });

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
    [key: string]: unknown;
};

function normaliseRow(rows: RawRow[], category: MarkerCategory): Marker[] {
    return rows
        .filter((row) => typeof row.lat === 'number' && typeof row.lng === 'number')
        .map((row) => ({
            id: `${category}-${row.id}`,
            lat: Number(row.lat),
            lng: Number(row.lng),
            title: (row.title ?? 'Untitled location') as string,
            description: (row.description ?? undefined) as string | undefined,
            category,
            metadata: {
                ...row
            }
        }));
}

export function getMarkers(): Marker[] {
    const lakes = db
        .prepare(`
            SELECT id,
                   latitude AS lat,
                   longitude AS lng,
                   waterbody_name AS title,
                   COALESCE(comments, amenities, waterbody_information, '') AS description,
                   county,
                   fish_species
            FROM lakes_ponds
        `)
        .all() as RawRow[];

    const rivers = db
        .prepare(`
            SELECT id,
                   "Latitude" AS lat,
                   "Longitude" AS lng,
                   "Waterbody Name" AS title,
                   COALESCE("Comments", "Special Regulations on Waterbody", '') AS description,
                   "Fish Species Present at Waterbody" AS fish_species,
                   "Types of Public Access" AS public_access
            FROM rivers_streams
        `)
        .all() as RawRow[];

    const parking = db
        .prepare(`
            SELECT id,
                   latitude AS lat,
                   longitude AS lng,
                   water AS title,
                   COALESCE(road || ' ' || town, '') AS description,
                   pdf_map_link,
                   special_regulations_link
            FROM parking_areas
        `)
        .all() as RawRow[];

    return [
        ...normaliseRow(lakes, 'lake'),
        ...normaliseRow(rivers, 'river'),
        ...normaliseRow(parking, 'parking')
    ];
}
