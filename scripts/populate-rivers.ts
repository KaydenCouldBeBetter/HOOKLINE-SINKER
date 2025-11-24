import { db } from '../server/database/connection';
import * as fs from 'fs';
import * as path from 'path';

interface RiverData {
  name: string;
  fish_species: string;
  comments: string | null;
  special_regs: string | null;
  county: string;
  public_access: string | null;
  access_owner: string | null;
  waterbody_info: string | null;
  longitude: string;
  latitude: string;
}

const populateRivers = () => {
  console.log('Starting rivers and streams population...');

  // Read the JSON file
  const dataPath = path.join(__dirname, '..', 'data', 'RecommendedFishingRiversAndStreams.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const jsonData = JSON.parse(rawData);

  console.log(`Found ${jsonData.data.length} rivers and streams to import`);

  let successCount = 0;
  let errorCount = 0;

  // Process each river/stream entry
  jsonData.data.forEach((row: any[], index: number) => {
    try {
      // Map the array indices to our data structure based on the column positions
      const name = row[8]; // Waterbody Name
      const fish_species = row[9]; // Fish Species Present
      const comments = row[10]; // Comments
      const special_regs = row[11] ? row[11][0] : null; // Special Regulations (array)
      const county = row[12]; // County
      const public_access = row[13]; // Types of Public Access
      const access_owner = row[14]; // Public Fishing Access Owner
      const waterbody_info = row[15] ? row[15][0] : null; // Waterbody Information (array)
      const longitude = row[16]; // Longitude
      const latitude = row[17]; // Latitude

      // Skip if missing critical data
      if (!name || !longitude || !latitude) {
        console.log(`Skipping row ${index + 1}: missing name or coordinates`);
        errorCount++;
        return;
      }

      // Determine location type
      const location_type = name.toLowerCase().includes('stream') ? 'stream' : 'river';

      // Determine access features
      const shore_fishing = public_access &&
        (public_access.toLowerCase().includes('shore fishing') ||
         public_access.toLowerCase().includes('public fishing rights')) ? 1 : 0;

      const parking_available = public_access &&
        public_access.toLowerCase().includes('parking') ? 1 : 0;

      // Build description
      let description = '';
      if (fish_species) {
        description += `Fish species: ${fish_species}. `;
      }
      if (public_access) {
        description += `Access: ${public_access}. `;
      }
      if (comments && comments !== 'None') {
        description += comments;
      }

      // Access type
      let access_type = 'Public';
      if (access_owner) {
        if (access_owner.toLowerCase().includes('private')) {
          access_type = 'Private';
        } else if (access_owner.toLowerCase().includes('dec') ||
                   access_owner.toLowerCase().includes('state') ||
                   access_owner.toLowerCase().includes('public')) {
          access_type = 'Public';
        }
      }

      // Insert location into database
      const insertQuery = `
        INSERT INTO locations (
          name,
          description,
          longitude,
          latitude,
          location_type,
          water_body_name,
          access_type,
          parking_available,
          boat_ramp,
          shore_fishing,
          is_public
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
        0, // boat_ramp - typically not applicable for rivers/streams
        shore_fishing,
        access_type === 'Public' ? 1 : 0
      ]);

      successCount++;

      if (successCount % 50 === 0) {
        console.log(`Processed ${successCount} locations...`);
      }
    } catch (error) {
      console.error(`Error processing row ${index + 1}:`, error);
      errorCount++;
    }
  });

  console.log('\n=== Import Complete ===');
  console.log(`Successfully imported: ${successCount} locations`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Total processed: ${successCount + errorCount}`);
};

// Run the population
try {
  populateRivers();
} catch (error) {
  console.error('Fatal error:', error);
  process.exit(1);
}