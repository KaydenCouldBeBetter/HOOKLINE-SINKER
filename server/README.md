# Hookline Sinker - Backend API

Simple Express.js backend server for the fishing spots application.

## Getting Started

### Run the server

```bash
bun run server/index.js
```

The server will start on `http://localhost:3001` (or the PORT specified in your .env file).

## API Endpoints

### Health Check
- **GET** `/health`
- Returns server status

### Fishing Spots

#### Get all fishing spots
- **GET** `/api/fishing-spots`
- Query parameters (optional):
  - `lat` - Latitude for location-based search
  - `lng` - Longitude for location-based search
  - `radius` - Search radius in km (not yet implemented)

**Example response:**
```json
{
  "success": true,
  "spots": [
    {
      "id": 1,
      "name": "Central Park Lake",
      "coordinates": { "lat": 40.7829, "lng": -73.9654 },
      "description": "Popular urban fishing spot",
      "fish_types": ["Bass", "Catfish", "Carp"],
      "rating": 4.2
    }
  ],
  "total": 3
}
```

#### Get single fishing spot
- **GET** `/api/fishing-spots/:id`
- Returns a single fishing spot by ID

#### Create new fishing spot
- **POST** `/api/fishing-spots`
- Request body:
```json
{
  "name": "My Fishing Spot",
  "coordinates": { "lat": 40.7829, "lng": -73.9654 },
  "description": "A great spot for fishing",
  "fish_types": ["Bass", "Trout"],
  "rating": 4.5
}
```

## Environment Variables

Create a `.env` file in the project root (optional):

```
PORT=3001
```

## TODO / Next Steps

- [ ] Connect to a database (MongoDB, PostgreSQL, etc.)
- [ ] Implement location-based search with radius filtering
- [ ] Add authentication for creating/editing spots
- [ ] Add image upload for fishing spots
- [ ] Implement rating system
- [ ] Add search and filtering capabilities
- [ ] Error handling and validation improvements