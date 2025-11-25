import { Router } from 'express';
import { db } from '../database/connection';
import type { Species } from '../../shared/types';

const router = Router();

// Create a new species
function createSpecies(species: Species): number {
    const stmt = db.prepare(`
        INSERT INTO species (
            species_name, scientific_name, description,
            min_legal_size, max_legal_size, bag_limit,
            average_weight, record_weight, habitat_type,
            water_depth_range, temperature_range, seasonal_availability,
            time_of_day, best_baits, best_lures,
            fishing_techniques, difficulty_level, common_locations,
            conservation_status, eating_quality, catch_and_release_recommended
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
        species.species_name,
        species.scientific_name || null,
        species.description || null,
        species.min_legal_size || null,
        species.max_legal_size || null,
        species.bag_limit || null,
        species.average_weight || null,
        species.record_weight || null,
        species.habitat_type || null,
        species.water_depth_range || null,
        species.temperature_range || null,
        species.seasonal_availability || null,
        species.time_of_day || null,
        species.best_baits || null,
        species.best_lures || null,
        species.fishing_techniques || null,
        species.difficulty_level || null,
        species.common_locations || null,
        species.conservation_status || null,
        species.eating_quality || null,
        species.catch_and_release_recommended || 0
    );

    return result.lastInsertRowid as number;
}

// Read all species
function getAllSpecies(): Species[] {
    const stmt = db.prepare('SELECT * FROM species ORDER BY species_name');
    return stmt.all() as Species[];
}

// Read a single species by ID
function getSpeciesById(species_id: number): Species | null {
    const stmt = db.prepare('SELECT * FROM species WHERE species_id = ?');
    return stmt.get(species_id) as Species | null;
}

// Read species by name (partial match)
function getSpeciesByName(name: string): Species[] {
    const stmt = db.prepare('SELECT * FROM species WHERE species_name LIKE ? ORDER BY species_name');
    return stmt.all(`%${name}%`) as Species[];
}

// Update a species
function updateSpecies(species_id: number, updates: Partial<Species>): boolean {
    const fields = Object.keys(updates)
        .filter(key => key !== 'species_id')
        .map(key => `${key} = ?`)
        .join(', ');

    if (!fields) return false;

    const values = Object.keys(updates)
        .filter(key => key !== 'species_id')
        .map(key => updates[key as keyof Species]);

    const stmt = db.prepare(`
        UPDATE species
        SET ${fields}, updated_at = CURRENT_TIMESTAMP
        WHERE species_id = ?
    `);

    const result = stmt.run(...values, species_id);
    return result.changes > 0;
}

// Delete a species
function deleteSpecies(species_id: number): boolean {
    const stmt = db.prepare('DELETE FROM species WHERE species_id = ?');
    const result = stmt.run(species_id);
    return result.changes > 0;
}

// Get species by habitat type
function getSpeciesByHabitat(habitat: string): Species[] {
    const stmt = db.prepare('SELECT * FROM species WHERE habitat_type = ? ORDER BY species_name');
    return stmt.all(habitat) as Species[];
}

// Get species by difficulty level
function getSpeciesByDifficulty(difficulty: string): Species[] {
    const stmt = db.prepare('SELECT * FROM species WHERE difficulty_level = ? ORDER BY species_name');
    return stmt.all(difficulty) as Species[];
}

// Get species count
function getSpeciesCount(): number {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM species');
    const result = stmt.get() as { count: number };
    return result.count;
}

// GET all species
router.get('/', (req, res) => {
    try {
        const species = getAllSpecies();
        res.json(species);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch species' });
    }
});

// GET species count
router.get('/count', (req, res) => {
    try {
        const count = getSpeciesCount();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch species count' });
    }
});

// GET species by habitat
router.get('/habitat/:habitat', (req, res) => {
    try {
        const species = getSpeciesByHabitat(req.params.habitat);
        res.json(species);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch species by habitat' });
    }
});

// GET search species by name
router.get('/search', (req, res) => {
    try {
        const name = req.query.name as string;
        if (!name) {
            return res.status(400).json({ error: 'Name query parameter is required' });
        }
        const species = getSpeciesByName(name);
        res.json(species);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search species' });
    }
});

// GET single species by ID
router.get('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const species = getSpeciesById(id);
        if (!species) {
            return res.status(404).json({ error: 'Species not found' });
        }
        res.json(species);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch species' });
    }
});

// POST create new species
router.post('/', (req, res) => {
    try {
        const species: Species = req.body;
        if (!species.species_name) {
            return res.status(400).json({ error: 'species_name is required' });
        }
        const id = createSpecies(species);
        res.status(201).json({ id, message: 'Species created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create species' });
    }
});

// PUT update species
router.put('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updates: Partial<Species> = req.body;
        const success = updateSpecies(id, updates);
        if (!success) {
            return res.status(404).json({ error: 'Species not found or no changes made' });
        }
        res.json({ message: 'Species updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update species' });
    }
});

// DELETE species
router.delete('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const success = deleteSpecies(id);
        if (!success) {
            return res.status(404).json({ error: 'Species not found' });
        }
        res.json({ message: 'Species deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete species' });
    }
});

export default router;
