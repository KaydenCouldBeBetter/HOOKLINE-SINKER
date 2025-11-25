import {
    Location,
    Result,
    ok,
    err,
    FishingConditions,
    TideInfo,
    LocationWeatherResult,
    LocationWeatherError
} from "../../shared/types";
import {Router} from "express";
import {db} from "../database/connection";
import {calculateDistance, getLocationsWithinRadius} from "./locations";
import {validateRadius} from "../utils";

const WEATHER_API_KEY = process.env.WEATHERAPI_ACCESS_TOKEN || '';
const BASE_URL = "http://api.weatherapi.com/v1"

// raw API response
interface RawWeatherResponse {
    location: {
        name: string;
        lat: number;
        lon: number;
    };
    forecast: {
        forecastday: Array<{
            date: string;
            day: {
                maxtemp_c: number;
                mintemp_c: number;
                maxwind_kph: number;
                totalprecip_mm: number;
                condition: { text: string };
                tides: Array<{ tide: TideInfo[] }>;
            };
            astro: {
                sunrise: string;
                sunset: string;
                moon_phase: string;
                moon_illumination: number;
            };
            hour: Array<{
                time: string;
                temp_c: number;
                water_temp_c: number;
                wind_kph: number;
                wind_dir: string;
                sig_ht_mt: number;
                swell_ht_mt: number;
                vis_km: number;
                condition: { text: string };
                precip_mm: number;
            }>;
        }>;
    };
}

// Helper that maps the raw API response to a more usable custom type
const mapToFishingConditions = (raw: RawWeatherResponse): FishingConditions => {
    return {
        location: {
            name: raw.location.name,
            lat: raw.location.lat,
            lon: raw.location.lon,
        },
        forecast: raw.forecast.forecastday.map(day => ({
            date: day.date,
            tides: day.day.tides[0]?.tide || [],
            moonPhase: day.astro.moon_phase,
            moonIllumination: day.astro.moon_illumination,
            sunrise: day.astro.sunrise,
            sunset: day.astro.sunset,
            summary: {
                maxTemp: day.day.maxtemp_c,
                minTemp: day.day.mintemp_c,
                maxWind: day.day.maxwind_kph,
                precipitation: day.day.totalprecip_mm,
                condition: day.day.condition.text,
            },
            hourly: day.hour.map(hour => ({
                time: hour.time,
                temp: hour.temp_c,
                waterTemp: hour.water_temp_c,
                windSpeed: hour.wind_kph,
                windDir: hour.wind_dir,
                waveHeight: hour.sig_ht_mt,
                swellHeight: hour.swell_ht_mt,
                visibility: hour.vis_km,
                condition: hour.condition.text,
                precipitation: hour.precip_mm,
            })),
        })),
    };
};

export const fetchLocationWeather = async (latitude: number, longitude: number): Promise<Result<FishingConditions, Error>> => {
    let params = new URLSearchParams();
    params.append('key', WEATHER_API_KEY);
    params.append('q', `${latitude},${longitude}`);
    params.append('tides', 'yes');
    params.append('days', '3');

    const url = `${BASE_URL}/marine.json?${params.toString()}`;

    const res = await fetch(url);
    if (!res.ok) {
        return err(new Error(res.statusText));
    }

    const raw: RawWeatherResponse = await res.json();
    const filtered = mapToFishingConditions(raw);

    return ok(filtered);
}


// Fetch weather for multiple locations within a radius
async function fetchWeatherForRadius(
    latitude: number,
    longitude: number,
    radiusMiles: number
): Promise<{ successful: LocationWeatherResult[]; failed: LocationWeatherError[] }> {
    const locations = getLocationsWithinRadius(latitude, longitude, radiusMiles);

    if (locations.length === 0) {
        return { successful: [], failed: [] };
    }

    const successful: LocationWeatherResult[] = [];
    const failed: LocationWeatherError[] = [];

    // Fetch weather for all locations in parallel
    const weatherPromises = locations.map(async (location) => {
        const distance = calculateDistance(latitude, longitude, location.latitude, location.longitude);

        const weatherResult = await fetchLocationWeather(location.latitude, location.longitude);

        if (weatherResult.ok) {
            successful.push({
                locationId: location.location_id!,
                locationName: location.name,
                location,
                weather: weatherResult.value,
                distance
            });
        } else {
            failed.push({
                locationId: location.location_id!,
                locationName: location.name,
                error: weatherResult.error.message,
                distance
            });
            console.error(`Failed to fetch weather for location ${location.name} (ID: ${location.location_id}):`, weatherResult.error.message);
        }
    });

    await Promise.all(weatherPromises);

    // Sort both arrays by distance
    successful.sort((a, b) => a.distance - b.distance);
    failed.sort((a, b) => a.distance - b.distance);

    return { successful, failed };
}

const router = Router();

router.get('/location', async (req, res) => {
    if (!req.query.longitude || !req.query.latitude) {
        return res.status(400).send({error: 'Missing query parameter: latitude or longitude'});
    }

    // @ts-ignore
    const latitude = parseFloat(req.query.latitude);
    // @ts-ignore
    const longitude = parseFloat(req.query.longitude);

    if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).send({ error: 'Latitude/Longitude could not be parsed' })
    }

    const result = await fetchLocationWeather(latitude, longitude);

    if (!result.ok) {
        return res.status(404).send({error: 'Error fetching location weather conditions'});
    }

    res.status(200).send(result.value);
});

router.get('/radius', async (req, res) => {
    if (!req.query.longitude || !req.query.latitude || !req.query.radius) {
        return res.status(400).send({error: 'Missing query parameter: latitude, longitude, or radius'});
    }

    const lat = parseFloat(req.query.latitude as string);
    const lon = parseFloat(req.query.longitude as string);
    const rad = parseFloat(req.query.radius as string);

    if (isNaN(lat) || isNaN(lon) || isNaN(rad)) {
        return res.status(400).send({ error: 'Latitude, longitude, or radius could not be parsed' })
    }

    const flags = validateRadius(lat, lon, rad);
    if (flags.length > 0) {
        const messages = flags.join('\n');
        res.status(400).send({message: messages})
    }

    const { successful, failed } = await fetchWeatherForRadius(lat, lon, rad);

    res.status(200).send({
        center: { latitude: lat, longitude: lon },
        radius: rad,
        totalLocations: successful.length + failed.length,
        successfulCount: successful.length,
        failedCount: failed.length,
        locations: successful,
        errors: failed
    });
});

export default router;
export {fetchWeatherForRadius};
