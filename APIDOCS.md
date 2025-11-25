# API Documentation

Base URL: `http://localhost:3001/api`

## Health Check
```
GET /health
```
**Returns:** `{ "status": "ok", "message": "Server is running" }`

---

## Species Endpoints

### Get All Species
```
GET /api/species
```
**Returns:** `Species[]` - Array of all species objects, ordered by name.

### Get Species by ID
```
GET /api/species/:id
```
**Parameters:**
- `id` (number) - Species ID

**Returns:** `Species` object or 404 if not found.

### Search Species by Name
```
GET /api/species/search?name=trout
```
**Query Parameters:**
- `name` (string, required) - Partial name to search for

**Returns:** `Species[]` - Array of matching species.

### Get Species by Habitat
```
GET /api/species/habitat/:habitat
```
**Parameters:**
- `habitat` (string) - Habitat type (e.g., "freshwater", "saltwater")

**Returns:** `Species[]` - Array of species in that habitat.

### Get Species Count
```
GET /api/species/count
```
**Returns:** `{ "count": number }`

### Create Species
```
POST /api/species
Content-Type: application/json
```
**Request Body:** `Species` object (required: `species_name`)
```json
{
  "species_name": "Brook Trout",
  "scientific_name": "Salvelinus fontinalis",
  "description": "Native trout species",
  "min_legal_size": 7.0,
  "max_legal_size": null,
  "bag_limit": 5,
  "average_weight": 0.5,
  "record_weight": 4.5,
  "habitat_type": "freshwater",
  "water_depth_range": "3-15 feet",
  "temperature_range": "50-65°F",
  "seasonal_availability": "Year-round",
  "time_of_day": "Dawn, Dusk",
  "best_baits": "Worms, insects",
  "best_lures": "Spinners, spoons",
  "fishing_techniques": "Fly fishing, spinning",
  "difficulty_level": "Intermediate",
  "common_locations": "Mountain streams",
  "conservation_status": "Stable",
  "eating_quality": 9,
  "catch_and_release_recommended": 0
}
```
**Returns:** `{ "id": number, "message": "Species created successfully" }`

### Update Species
```
PUT /api/species/:id
Content-Type: application/json
```
**Parameters:**
- `id` (number) - Species ID

**Request Body:** Partial `Species` object with fields to update.

**Returns:** `{ "message": "Species updated successfully" }`

### Delete Species
```
DELETE /api/species/:id
```
**Parameters:**
- `id` (number) - Species ID

**Returns:** `{ "message": "Species deleted successfully" }`

---

## Location Endpoints

### Get All Locations
```
GET /api/locations
```
**Returns:** `Location[]` - Array of all locations, ordered by name.

### Get Location by ID
```
GET /api/locations/:id
```
**Parameters:**
- `id` (number) - Location ID

**Returns:** `Location` object or 404 if not found.

### Search Locations by Name
```
GET /api/locations/search?name=lake
```
**Query Parameters:**
- `name` (string, required) - Partial name to search for

**Returns:** `Location[]` - Array of matching locations.

### Get Locations within Bounds
```
GET /api/locations/bounds?minLat=40.0&maxLat=45.0&minLng=-75.0&maxLng=-70.0
```
**Query Parameters:**
- `minLat` (number, required) - Minimum latitude
- `maxLat` (number, required) - Maximum latitude
- `minLng` (number, required) - Minimum longitude
- `maxLng` (number, required) - Maximum longitude

**Returns:** `Location[]` - Array of locations within bounding box.

### Get Location Count
```
GET /api/locations/count
```
**Returns:** `{ "count": number }`

### Create Location
```
POST /api/locations
Content-Type: application/json
```
**Request Body:** `Location` object (required: `name`, `latitude`, `longitude`)
```json
{
  "name": "Pine Pond",
  "description": "Fish species: Brook Trout. Hike in - Baitfish prohibited",
  "latitude": 44.253080282,
  "longitude": -74.66454061,
  "location_type": "lake",
  "water_body_name": "Pine Pond, St. Lawrence County",
  "access_type": "Public",
  "parking_available": 0,
  "boat_ramp": 0,
  "shore_fishing": 1,
  "water_depth": "5-20 feet",
  "structure_type": "Rocky bottom",
  "bottom_type": "Gravel",
  "current_strength": "Low",
  "rating": 4.5,
  "total_reviews": 12,
  "created_by": "user123",
  "is_public": 1
}
```
**Returns:** `{ "id": number, "message": "Location created successfully" }`

### Update Location
```
PUT /api/locations/:id
Content-Type: application/json
```
**Parameters:**
- `id` (number) - Location ID

**Request Body:** Partial `Location` object with fields to update.

**Returns:** `{ "message": "Location updated successfully" }`

### Delete Location
```
DELETE /api/locations/:id
```
**Parameters:**
- `id` (number) - Location ID

**Returns:** `{ "message": "Location deleted successfully" }`

---

## Image Endpoints

### Get All Images
```
GET /api/images
```
**Returns:** `Image[]` - Array of all images, ordered by upload date (newest first).

### Get Image by ID
```
GET /api/images/:id
```
**Parameters:**
- `id` (number) - Image ID

**Returns:** `Image` object or 404 if not found.

### Get Image Count
```
GET /api/images/count
```
**Returns:** `{ "count": number }`

### Create Image
```
POST /api/images
Content-Type: application/json
```
**Request Body:** `Image` object (required: `filename`, `file_path`)
```json
{
  "filename": "trout-photo-123.jpg",
  "original_filename": "my-brook-trout.jpg",
  "file_path": "/uploads/2024/01/trout-photo-123.jpg",
  "file_size": 245678,
  "mime_type": "image/jpeg",
  "width": 1920,
  "height": 1080,
  "alt_text": "Brook trout caught in Pine Pond",
  "caption": "Beautiful 2lb brook trout"
}
```
**Returns:** `{ "id": number, "message": "Image created successfully" }`

### Update Image
```
PUT /api/images/:id
Content-Type: application/json
```
**Parameters:**
- `id` (number) - Image ID

**Request Body:** Partial `Image` object with fields to update.

**Returns:** `{ "message": "Image updated successfully" }`

### Delete Image
```
DELETE /api/images/:id
```
**Parameters:**
- `id` (number) - Image ID

**Returns:** `{ "message": "Image deleted successfully" }`

---

## Weather Endpoints

### Get Weather for Specific Location
```
GET /api/weather/location?latitude=44.253&longitude=-74.664
```
**Query Parameters:**
- `latitude` (number, required) - Location latitude
- `longitude` (number, required) - Location longitude

**Returns:** `FishingConditions` object
```json
{
  "location": {
    "name": "Pine Pond Area",
    "lat": 44.253,
    "lon": -74.664
  },
  "forecast": [
    {
      "date": "2024-01-15",
      "tides": [
        {
          "tide_time": "06:23 AM",
          "tide_height_mt": "1.2",
          "tide_type": "HIGH"
        }
      ],
      "moonPhase": "Waxing Crescent",
      "moonIllumination": 35,
      "sunrise": "07:12 AM",
      "sunset": "05:34 PM",
      "summary": {
        "maxTemp": 15.5,
        "minTemp": 2.3,
        "maxWind": 18.5,
        "precipitation": 0.2,
        "condition": "Partly cloudy"
      },
      "hourly": [
        {
          "time": "2024-01-15 06:00",
          "temp": 5.2,
          "waterTemp": 8.5,
          "windSpeed": 12.3,
          "windDir": "NW",
          "waveHeight": 0.3,
          "swellHeight": 0.2,
          "visibility": 10.0,
          "condition": "Clear",
          "precipitation": 0.0
        }
      ]
    }
  ]
}
```

### Get Weather for Locations within Radius
```
GET /api/weather/radius?latitude=44.0&longitude=-74.0&radius=50
```
**Query Parameters:**
- `latitude` (number, required) - Center point latitude
- `longitude` (number, required) - Center point longitude
- `radius` (number, required) - Search radius in miles (0-500)

**Returns:** Radius weather result
```json
{
  "center": { "latitude": 44.0, "longitude": -74.0 },
  "radius": 50,
  "totalLocations": 12,
  "successfulCount": 10,
  "failedCount": 2,
  "locations": [
    {
      "locationId": 42,
      "locationName": "Pine Pond",
      "location": { /* Full Location object */ },
      "weather": { /* Full FishingConditions object */ },
      "distance": 3.2
    }
  ],
  "errors": [
    {
      "locationId": 99,
      "locationName": "Failed Lake",
      "error": "API rate limit exceeded",
      "distance": 12.5
    }
  ]
}
```

---

## Type Definitions

### Species
```typescript
{
  species_id?: number;
  species_name: string;           // Required
  scientific_name?: string;
  description?: string;
  min_legal_size?: number;        // Inches
  max_legal_size?: number;        // Inches
  bag_limit?: number;
  average_weight?: number;        // Pounds
  record_weight?: number;         // Pounds
  habitat_type?: string;
  water_depth_range?: string;
  temperature_range?: string;
  seasonal_availability?: string;
  time_of_day?: string;
  best_baits?: string;
  best_lures?: string;
  fishing_techniques?: string;
  difficulty_level?: string;
  common_locations?: string;
  conservation_status?: string;
  eating_quality?: number;        // 0-10 scale
  catch_and_release_recommended?: number;  // 0 or 1
  created_at?: string;            // ISO timestamp
  updated_at?: string;            // ISO timestamp
}
```

### Location
```typescript
{
  location_id?: number;
  name: string;                   // Required
  description?: string;
  longitude: number;              // Required
  latitude: number;               // Required
  location_type?: string;         // e.g., "lake", "river", "stream"
  water_body_name?: string;
  access_type?: string;           // e.g., "Public", "Private"
  parking_available?: number;     // 0 or 1
  boat_ramp?: number;             // 0 or 1
  shore_fishing?: number;         // 0 or 1
  water_depth?: string;
  structure_type?: string;
  bottom_type?: string;
  current_strength?: string;
  rating?: number;                // 0-5 scale
  total_reviews?: number;
  created_by?: string;
  is_public?: number;             // 0 or 1
  created_at?: string;            // ISO timestamp
  updated_at?: string;            // ISO timestamp
}
```

### Image
```typescript
{
  image_id?: number;
  filename: string;               // Required
  original_filename?: string;
  file_path: string;              // Required
  file_size?: number;             // Bytes
  mime_type?: string;
  width?: number;                 // Pixels
  height?: number;                // Pixels
  alt_text?: string;
  caption?: string;
  uploaded_at?: string;           // ISO timestamp
}
```

---

## Error Responses

All endpoints return consistent error format:
```json
{
  "error": "Error message here"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad request (missing/invalid parameters)
- `404` - Resource not found
- `500` - Internal server error