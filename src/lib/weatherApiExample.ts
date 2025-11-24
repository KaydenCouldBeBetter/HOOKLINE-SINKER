/**
 * Weather API Example
 *
 * This file demonstrates how to use axios to fetch weather data from our API.
 * You can run this example by importing and calling testWeatherApi() from anywhere in your frontend code.
 */

import axios from 'axios';
import type { FishingConditions } from '../../shared/types';

// Configuration
const API_BASE_URL = 'http://localhost:3001/api/weather'; // Update this to match your server URL

/**
 * Fetches fishing conditions for a given location
 *
 * @param latitude - Latitude of the location
 * @param longitude - Longitude of the location
 * @returns Promise with fishing conditions data
 */
export async function getWeatherConditions(
  latitude: number,
  longitude: number
): Promise<FishingConditions> {
  try {
    const response = await axios.get<FishingConditions>(`${API_BASE_URL}/location`, {
      params: {
        latitude,
        longitude
      }
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Weather API error:', {
        status: error.response?.status,
        message: error.response?.data?.error || error.message,
        url: error.config?.url
      });
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}

/**
 * Example function that demonstrates how to use the weather API
t * This fetches weather for New York City and logs the raw JSON
 */
export async function testWeatherApi() {
  console.log('Testing Weather API...');

  try {
    // Example: Get weather for New York City coastal area
    const latitude = 40.7128;
    const longitude = -74.0060;

    console.log(`Fetching weather for coordinates: ${latitude}, ${longitude}`);

    const conditions = await getWeatherConditions(latitude, longitude);

    console.log('Weather API Response:');
    console.log(JSON.stringify(conditions, null, 2));

    return conditions;
  } catch (error) {
    console.log('Test failed');
    throw error;
  }
}

// Example of how to use in a Svelte component:
/*
<script lang="ts">
  import { onMount } from 'svelte';
  import { testWeatherApi } from '$lib/weatherApiExample';

  onMount(async () => {
    await testWeatherApi();
  });
</script>
*/