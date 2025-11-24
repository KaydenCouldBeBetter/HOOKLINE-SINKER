# Weather API Documentation

## Overview
The Weather API provides marine and fishing conditions including weather, tides, moon phases, and water conditions.

## Setup

### 1. Install Dependencies
```bash
bun install
```

Axios is already installed and ready to use.

### 2. Environment Variables
Make sure your `.env` file has the weather API token:
```
WEATHERAPI_ACCESS_TOKEN=your_api_key_here
```

### 3. Start the Server
```bash
bun run server
```
The server runs on `http://localhost:3001`

## API Endpoint

### GET `/api/weather/location`

Fetches 3-day marine forecast for a specific location.

**Query Parameters:**
- `latitude` (required): Latitude coordinate (number)
- `longitude` (required): Longitude coordinate (number)

**Example Request:**
```
GET http://localhost:3001/api/weather/location?latitude=40.7128&longitude=-74.0060
```

**Response Type:** `FishingConditions`

## Using in Your Frontend Code

### Option 1: Use the Example Helper Functions

Import the pre-built functions from `src/lib/weatherApiExample.ts`:

```typescript
import { getWeatherConditions } from '$lib/weatherApiExample';

async function fetchWeather() {
  try {
    const conditions = await getWeatherConditions(40.7128, -74.0060);
    console.log('Weather data:', conditions);
  } catch (error) {
    console.error('Failed to fetch weather:', error);
  }
}
```

### Option 2: Use Axios Directly

```typescript
import axios from 'axios';
import type { FishingConditions } from '../../shared/types';

const response = await axios.get<FishingConditions>(
  'http://localhost:3001/api/weather/location',
  {
    params: {
      latitude: 40.7128,
      longitude: -74.0060
    }
  }
);

const weatherData = response.data;
```

### Option 3: Use in a Svelte Component

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { getWeatherConditions } from '$lib/weatherApiExample';
  import type { FishingConditions } from '../../shared/types';

  let weatherData: FishingConditions | null = null;
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      weatherData = await getWeatherConditions(40.7128, -74.0060);
    } catch (err) {
      error = 'Failed to load weather data';
      console.error(err);
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}
  <p>Loading weather data...</p>
{:else if error}
  <p class="error">{error}</p>
{:else if weatherData}
  <div>
    <h2>{weatherData.location.name}</h2>
    {#each weatherData.forecast as day}
      <div>
        <h3>{day.date}</h3>
        <p>Temperature: {day.summary.minTemp}°C - {day.summary.maxTemp}°C</p>
        <p>Condition: {day.summary.condition}</p>
        <p>Wind: {day.summary.maxWind} km/h</p>
      </div>
    {/each}
  </div>
{/if}
```

## Testing the API

### Dev Page
Visit `http://localhost:5173/dev` (or your dev server URL) to access the API test suite. This page lets you test all API endpoints including the weather API. Check the browser console for raw JSON responses.

### Manual Test
You can also use curl from the command line:
```bash
curl "http://localhost:3001/api/weather/location?latitude=40.7128&longitude=-74.0060"
```

## Response Data Structure

```typescript
interface FishingConditions {
  location: {
    name: string;
    lat: number;
    lon: number;
  };
  forecast: Array<{
    date: string;
    tides: Array<{
      tide_time: string;
      tide_height_mt: string;
      tide_type: "HIGH" | "LOW";
    }>;
    moonPhase: string;
    moonIllumination: number;
    sunrise: string;
    sunset: string;
    summary: {
      maxTemp: number;
      minTemp: number;
      maxWind: number;
      precipitation: number;
      condition: string;
    };
    hourly: Array<{
      time: string;
      temp: number;
      waterTemp: number;
      windSpeed: number;
      windDir: string;
      waveHeight: number;
      swellHeight: number;
      visibility: number;
      condition: string;
      precipitation: number;
    }>;
  }>;
}
```

## Error Handling

The API returns standard HTTP error codes:
- `400`: Missing or invalid latitude/longitude
- `404`: Location not found or weather service error
- `500`: Server error

Example error handling:
```typescript
try {
  const conditions = await getWeatherConditions(lat, lon);
  // Success
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 400) {
      console.error('Invalid coordinates');
    } else if (error.response?.status === 404) {
      console.error('Location not found');
    }
  }
}
```

## Tips for Your Team

1. **Coordinates**: Use coastal coordinates for best results (the API is optimized for marine conditions)
2. **Data Freshness**: The API provides 3-day forecasts updated regularly
3. **Console Logging**: The example helper functions include detailed console logging for debugging
4. **Type Safety**: Import `FishingConditions` type from `shared/types` for full TypeScript support
5. **Reusability**: The `getWeatherConditions()` function handles all axios setup and error handling

## Files to Reference

- `src/lib/weatherApiExample.ts` - Ready-to-use helper functions and test code
- `server/routes/weather.ts` - Backend API implementation
- `shared/types.ts` - TypeScript type definitions
- `src/routes/dev/+page.svelte` - API test suite page

## Questions?

Check the implementation in `src/lib/weatherApiExample.ts` for a complete working example with detailed comments.