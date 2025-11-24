import { db } from '../server/database/connection';
import { initSchema } from '../server/database/schema';
import * as fs from 'fs';
import * as path from 'path';

console.log('===========================================');
console.log('Database Population Script');
console.log('===========================================\n');

// Initialize schema first
console.log('Initializing database schema...');
initSchema();
console.log('Schema initialized.\n');

// Function to populate lakes and ponds
const populateLakes = () => {
  console.log('--- LAKES AND PONDS ---');
  const dataPath = path.join(__dirname, '..', 'data', 'RecommendedLakesAndPonds.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const jsonData = JSON.parse(rawData);

  console.log(`Found ${jsonData.data.length} lakes and ponds to import`);

  let successCount = 0;
  let errorCount = 0;

  jsonData.data.forEach((row: any[], index: number) => {
    try {
      const name = row[8];
      const acres = row[9];
      const boat_launch_type = row[10];
      const boat_launch_owner = row[11];
      const amenities = row[12];
      const fish_species = row[13];
      const ice_fishing = row[14];
      const comments = row[15];
      const boat_launch_info = row[16] ? row[16][0] : null;
      const waterbody_info = row[17] ? row[17][0] : null;
      const contour_map = row[18] ? row[18][0] : null;
      const special_regs = row[19] ? row[19][0] : null;
      const county = row[20];
      const longitude = row[21];
      const latitude = row[22];

      if (!name || !longitude || !latitude) {
        errorCount++;
        return;
      }

      const location_type = 'lake';
      const parking_available = boat_launch_type && boat_launch_type.toLowerCase() !== 'none' ? 1 : 0;
      const boat_ramp = boat_launch_type &&
        (boat_launch_type.toLowerCase().includes('trailer') ||
         boat_launch_type.toLowerCase().includes('launch')) ? 1 : 0;
      const shore_fishing = comments && comments.toLowerCase().includes('shore fishing') ? 1 : 0;

      let description = '';
      if (fish_species) description += `Fish species: ${fish_species}. `;
      if (ice_fishing) description += `Ice fishing: ${ice_fishing}. `;
      if (comments) description += comments;

      let access_type = 'Public';
      if (boat_launch_owner) {
        if (boat_launch_owner.toLowerCase().includes('private')) {
          access_type = 'Private';
        }
      }

      const insertQuery = `
        INSERT INTO locations (
          name, description, longitude, latitude, location_type,
          water_body_name, access_type, parking_available, boat_ramp,
          shore_fishing, is_public
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.run(insertQuery, [
        name,
        description.trim() || null,
        parseFloat(longitude),
        parseFloat(latitude),
        location_type,
        county ? `${name}, ${county} County` : name,
        access_type,
        parking_available,
        boat_ramp,
        shore_fishing,
        access_type === 'Public' ? 1 : 0
      ]);

      successCount++;
    } catch (error) {
      console.error(`Error processing lake row ${index + 1}:`, error);
      errorCount++;
    }
  });

  console.log(`Lakes imported: ${successCount}, Errors: ${errorCount}\n`);
  return { successCount, errorCount };
};

// Function to populate rivers and streams
const populateRivers = () => {
  console.log('--- RIVERS AND STREAMS ---');
  const dataPath = path.join(__dirname, '..', 'data', 'RecommendedFishingRiversAndStreams.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const jsonData = JSON.parse(rawData);

  console.log(`Found ${jsonData.data.length} rivers and streams to import`);

  let successCount = 0;
  let errorCount = 0;

  jsonData.data.forEach((row: any[], index: number) => {
    try {
      const name = row[8];
      const fish_species = row[9];
      const comments = row[10];
      const special_regs = row[11] ? row[11][0] : null;
      const county = row[12];
      const public_access = row[13];
      const access_owner = row[14];
      const waterbody_info = row[15] ? row[15][0] : null;
      const longitude = row[16];
      const latitude = row[17];

      if (!name || !longitude || !latitude) {
        errorCount++;
        return;
      }

      const location_type = name.toLowerCase().includes('stream') ? 'stream' : 'river';
      const shore_fishing = public_access &&
        (public_access.toLowerCase().includes('shore fishing') ||
         public_access.toLowerCase().includes('public fishing rights')) ? 1 : 0;
      const parking_available = public_access &&
        public_access.toLowerCase().includes('parking') ? 1 : 0;

      let description = '';
      if (fish_species) description += `Fish species: ${fish_species}. `;
      if (public_access) description += `Access: ${public_access}. `;
      if (comments && comments !== 'None') description += comments;

      let access_type = 'Public';
      if (access_owner) {
        if (access_owner.toLowerCase().includes('private')) {
          access_type = 'Private';
        }
      }

      const insertQuery = `
        INSERT INTO locations (
          name, description, longitude, latitude, location_type,
          water_body_name, access_type, parking_available, boat_ramp,
          shore_fishing, is_public
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.run(insertQuery, [
        name,
        description.trim() || null,
        parseFloat(longitude),
        parseFloat(latitude),
        location_type,
        county ? `${name}, ${county} County` : name,
        access_type,
        parking_available,
        0,
        shore_fishing,
        access_type === 'Public' ? 1 : 0
      ]);

      successCount++;
    } catch (error) {
      console.error(`Error processing river row ${index + 1}:`, error);
      errorCount++;
    }
  });

  console.log(`Rivers imported: ${successCount}, Errors: ${errorCount}\n`);
  return { successCount, errorCount };
};

// Run both populations
try {
  const lakesResult = populateLakes();
  const riversResult = populateRivers();

  console.log('===========================================');
  console.log('FINAL SUMMARY');
  console.log('===========================================');
  console.log(`Total locations imported: ${lakesResult.successCount + riversResult.successCount}`);
  console.log(`Total errors: ${lakesResult.errorCount + riversResult.errorCount}`);
  console.log('\nDatabase population complete!');
} catch (error) {
  console.error('Fatal error:', error);
  process.exit(1);
}