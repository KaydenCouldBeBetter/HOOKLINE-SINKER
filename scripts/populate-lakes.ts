import { db } from '../server/database/connection';
import * as fs from 'fs';
import * as path from 'path';

interface LakeData {
  name: string;
  acres: string;
  boat_launch_type: string;
  boat_launch_owner: string;
  amenities: string | null;
  fish_species: string;
  ice_fishing: string | null;
  comments: string | null;
  boat_launch_info: string | null;
  waterbody_info: string | null;
  contour_map: string | null;
  special_regs: string | null;
  county: string;
  longitude: string;
  latitude: string;
}

const populateLakes = () => {
  console.log('Starting lakes and ponds population...');

  // Read the JSON file
  const dataPath = path.join(__dirname, '..', 'data', 'RecommendedLakesAndPonds.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const jsonData = JSON.parse(rawData);

  console.log(`Found ${jsonData.data.length} lakes and ponds to import`);

  let successCount = 0;
  let errorCount = 0;

  // Process each lake/pond entry
  jsonData.data.forEach((row: any[], index: number) => {
    try {
      // Map the array indices to our data structure based on the column positions
      const name = row[8]; // Waterbody Name
      const acres = row[9]; // Acres_Mile
      const boat_launch_type = row[10]; // Boat Launch Type
      const boat_launch_owner = row[11]; // Boat Launch Owner
      const amenities = row[12]; // Amenities
      const fish_species = row[13]; // Fish Species
      const ice_fishing = row[14]; // Ice Fishing
      const comments = row[15]; // Comments
      const boat_launch_info = row[16] ? row[16][0] : null; // Boat Launch Information (array)
      const waterbody_info = row[17] ? row[17][0] : null; // Waterbody Information (array)
      const contour_map = row[18] ? row[18][0] : null; // Contour Map (array)
      const special_regs = row[19] ? row[19][0] : null; // Special Regulations (array)
      const county = row[20]; // County
      const longitude = row[21]; // Longitude
      const latitude = row[22]; // Latitude

      // Skip if missing critical data
      if (!name || !longitude || !latitude) {
        console.log(`Skipping row ${index + 1}: missing name or coordinates`);
        errorCount++;
        return;
      }

      // Determine location type
      const location_type = 'lake'; // Could be 'lake' or 'pond' based on name

      // Determine access features
      const parking_available = boat_launch_type && boat_launch_type.toLowerCase() !== 'none' ? 1 : 0;
      const boat_ramp = boat_launch_type &&
        (boat_launch_type.toLowerCase().includes('trailer') ||
         boat_launch_type.toLowerCase().includes('launch')) ? 1 : 0;
      const shore_fishing = comments && comments.toLowerCase().includes('shore fishing') ? 1 : 0;

      // Build description
      let description = '';
      if (fish_species) {
        description += `Fish species: ${fish_species}. `;
      }
      if (ice_fishing) {
        description += `Ice fishing: ${ice_fishing}. `;
      }
      if (comments) {
        description += comments;
      }

      // Access type
      let access_type = 'Public';
      if (boat_launch_owner) {
        if (boat_launch_owner.toLowerCase().includes('private')) {
          access_type = 'Private';
        } else if (boat_launch_owner.toLowerCase().includes('dec') ||
                   boat_launch_owner.toLowerCase().includes('state')) {
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
        boat_ramp,
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
  populateLakes();
} catch (error) {
  console.error('Fatal error:', error);
  process.exit(1);
}