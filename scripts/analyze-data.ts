const fs = require('fs');

// Read lakes data
const lakesData = JSON.parse(fs.readFileSync('data/RecommendedLakesAndPonds.json', 'utf8'));
const riversData = JSON.parse(fs.readFileSync('data/RecommendedFishingRiversAndStreams.json', 'utf8'));

// Get column names (excluding hidden metadata columns)
const lakesColumns = lakesData.meta.view.columns
  .filter((c: any) => !c.flags || !c.flags.includes('hidden'))
  .map((c: any) => ({ name: c.name, fieldName: c.fieldName, position: c.position }));

const riversColumns = riversData.meta.view.columns
  .filter((c: any) => !c.flags || !c.flags.includes('hidden'))
  .map((c: any) => ({ name: c.name, fieldName: c.fieldName, position: c.position }));

console.log('LAKES COLUMNS:');
console.log(JSON.stringify(lakesColumns, null, 2));
console.log('\nRIVERS COLUMNS:');
console.log(JSON.stringify(riversColumns, null, 2));
console.log('\nSAMPLE LAKE ROW:');
console.log(JSON.stringify(lakesData.data[0], null, 2));
console.log('\nSAMPLE RIVER ROW:');
console.log(JSON.stringify(riversData.data[0], null, 2));
console.log('\nTotal lakes:', lakesData.data.length);
console.log('Total rivers:', riversData.data.length);