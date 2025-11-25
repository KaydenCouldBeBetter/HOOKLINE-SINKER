import { db } from '../server/database/connection';

console.log('===========================================');
console.log('Database Verification');
console.log('===========================================\n');

// Count total locations
const totalCount = db.query('SELECT COUNT(*) as count FROM locations').get() as { count: number };
console.log(`Total locations: ${totalCount.count}`);

// Count by location type
const typeCount = db.query(`
  SELECT location_type, COUNT(*) as count
  FROM locations
  GROUP BY location_type
`).all() as Array<{ location_type: string; count: number }>;

console.log('\nLocations by type:');
typeCount.forEach(row => {
  console.log(`  ${row.location_type}: ${row.count}`);
});

// Count by access type
const accessCount = db.query(`
  SELECT access_type, COUNT(*) as count
  FROM locations
  GROUP BY access_type
`).all() as Array<{ access_type: string; count: number }>;

console.log('\nLocations by access type:');
accessCount.forEach(row => {
  console.log(`  ${row.access_type}: ${row.count}`);
});

// Sample locations
console.log('\n--- Sample Lake Locations ---');
const sampleLakes = db.query(`
  SELECT name, latitude, longitude, location_type, access_type, boat_ramp, shore_fishing
  FROM locations
  WHERE location_type = 'lake'
  LIMIT 5
`).all();
console.log(sampleLakes);

console.log('\n--- Sample River Locations ---');
const sampleRivers = db.query(`
  SELECT name, latitude, longitude, location_type, access_type, shore_fishing
  FROM locations
  WHERE location_type = 'river'
  LIMIT 5
`).all();
console.log(sampleRivers);

// Check for locations with boat ramps
const boatRampCount = db.query(`
  SELECT COUNT(*) as count
  FROM locations
  WHERE boat_ramp = 1
`).get() as { count: number };
console.log(`\nLocations with boat ramps: ${boatRampCount.count}`);

// Check for shore fishing locations
const shoreFishingCount = db.query(`
  SELECT COUNT(*) as count
  FROM locations
  WHERE shore_fishing = 1
`).get() as { count: number };
console.log(`Locations with shore fishing: ${shoreFishingCount.count}`);

console.log('\n===========================================');
console.log('Verification complete!');
console.log('===========================================');