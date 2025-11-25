# Database Population Scripts

This directory contains scripts to populate the database with fishing location data from New York State Department of Environmental Conservation.

## Data Sources

- `data/RecommendedLakesAndPonds.json` - 320 recommended fishing lakes and ponds
- `data/RecommendedFishingRiversAndStreams.json` - 546 recommended fishing rivers and streams

## Scripts

### populate-all.ts
**Main script** - Populates the database with all fishing locations (lakes, ponds, rivers, and streams).

```bash
bun run scripts/populate-all.ts
```

This script:
1. Initializes the database schema
2. Imports 320 lakes and ponds
3. Imports 546 rivers and streams
4. Provides a summary of the import

### populate-lakes.ts
Populates only lakes and ponds data.

```bash
bun run scripts/populate-lakes.ts
```

### populate-rivers.ts
Populates only rivers and streams data.

```bash
bun run scripts/populate-rivers.ts
```

### verify-data.ts
Verifies the populated data and provides statistics.

```bash
bun run scripts/verify-data.ts
```

This script shows:
- Total location count
- Breakdown by location type (lake, river, stream)
- Breakdown by access type (Public, Private)
- Sample locations from each type
- Count of locations with boat ramps
- Count of locations with shore fishing access

### analyze-data.ts
Analyzes the raw JSON data structure (used during development).

```bash
bun run scripts/analyze-data.ts
```

## Data Mapping

### Lakes and Ponds
The following fields are mapped from the JSON data to the database:

- `name` - Waterbody name
- `description` - Combination of fish species, ice fishing info, and comments
- `longitude` / `latitude` - Geographic coordinates
- `location_type` - Always "lake"
- `water_body_name` - Name + County
- `access_type` - Derived from boat launch owner (Public/Private)
- `parking_available` - Based on boat launch type
- `boat_ramp` - Based on boat launch type (trailer/launch)
- `shore_fishing` - Detected from comments
- `is_public` - 1 for public access, 0 for private

### Rivers and Streams
The following fields are mapped from the JSON data to the database:

- `name` - Waterbody name
- `description` - Combination of fish species, access type, and comments
- `longitude` / `latitude` - Geographic coordinates
- `location_type` - "river" or "stream" based on name
- `water_body_name` - Name + County
- `access_type` - Derived from access owner (Public/Private)
- `parking_available` - Detected from public access description
- `boat_ramp` - Always 0 (not applicable for rivers/streams)
- `shore_fishing` - Detected from public access type
- `is_public` - 1 for public access, 0 for private

## Import Results

After running `populate-all.ts`, you should see:
- **866 total locations** imported
- **320 lakes**
- **546 rivers and streams**
- **827 public locations**
- **39 private locations**
- **234 locations with boat ramps**
- **469 locations with shore fishing access**