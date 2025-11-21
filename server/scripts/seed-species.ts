import { db } from '../database/connection';
import { initializeDatabase } from '../database/connection';
import { initSchema } from '../database/schema';
import type { Species } from '../../shared/types';
import speciesData from '../database/ny-species-data.json';

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

// Initialize database first
initializeDatabase();
initSchema();

console.log('Starting species seed...');

let insertedCount = 0;
let skippedCount = 0;

for (const species of speciesData as Species[]) {
    try {
        const id = createSpecies(species);
        console.log(`✓ Inserted: ${species.species_name} (ID: ${id})`);
        insertedCount++;
    } catch (error) {
        console.error(`✗ Failed to insert ${species.species_name}:`, error);
        skippedCount++;
    }
}

console.log(`\nSeed complete!`);
console.log(`Inserted: ${insertedCount}`);
console.log(`Skipped: ${skippedCount}`);
console.log(`Total: ${speciesData.length}`);