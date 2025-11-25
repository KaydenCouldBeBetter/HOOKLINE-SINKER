import { Router } from "express";
import {LocationWeatherResult, FishingConditions, LocationRecommendation, ScoreBreakdown} from "../../shared/types";
import locations from "./locations";
import { fetchWeatherForRadius } from "./weather";
import {validateRadius} from "../utils";



// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get today's forecast (first day in the 3-day forecast)
 */
const getTodayForecast = (weather: FishingConditions) => {
    return weather.forecast[0];
};

/**
 * Get average conditions for daytime hours (6am-6pm)
 */
const getAverageDaytimeConditions = (hourlyData: any[]) => {
    const daytimeHours = hourlyData.filter(hour => {
        const hourNum = parseInt(hour.time.split(' ')[1].split(':')[0]);
        return hourNum >= 6 && hourNum < 18;
    });

    if (daytimeHours.length === 0) return null;

    const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
    const avg = (arr: number[]) => sum(arr) / arr.length;

    return {
        avgTemp: avg(daytimeHours.map(h => h.temp)),
        avgWaterTemp: avg(daytimeHours.map(h => h.waterTemp)),
        avgWindSpeed: avg(daytimeHours.map(h => h.windSpeed)),
        avgWaveHeight: avg(daytimeHours.map(h => h.waveHeight)),
        avgSwellHeight: avg(daytimeHours.map(h => h.swellHeight)),
        avgVisibility: avg(daytimeHours.map(h => h.visibility)),
        avgPrecipitation: avg(daytimeHours.map(h => h.precipitation)),
    };
};

/**
 * Check if there are tide changes during prime fishing hours (dawn/dusk)
 */
const hasGoodTideChanges = (tides: any[], sunrise: string, sunset: string): boolean => {
    if (tides.length === 0) return false;

    // Prime times: 2 hours before/after sunrise and sunset
    const sunriseHour = parseInt(sunrise.split(':')[0]);
    const sunsetHour = parseInt(sunset.split(':')[0]);

    const primeStart1 = sunriseHour - 2;
    const primeEnd1 = sunriseHour + 2;
    const primeStart2 = sunsetHour - 2;
    const primeEnd2 = sunsetHour + 2;

    return tides.some(tide => {
        const tideHour = parseInt(tide.tide_time.split(':')[0]);
        return (tideHour >= primeStart1 && tideHour <= primeEnd1) ||
               (tideHour >= primeStart2 && tideHour <= primeEnd2);
    });
};

// =============================================================================
// SCORING FUNCTIONS (0-100 scale)
// =============================================================================

/**
 * Score weather comfort based on temperature, wind, and precipitation
 * Optimal conditions = high score
 */
const scoreWeatherComfort = (weather: FishingConditions): number => {
    const today = getTodayForecast(weather);
    const daytimeAvg = getAverageDaytimeConditions(today.hourly);

    if (!daytimeAvg) return 50; // Neutral score if no data

    let score = 0;

    // Temperature score (0-40 points) - Optimal: 15-25°C
    const temp = daytimeAvg.avgTemp;
    if (temp >= 15 && temp <= 25) {
        score += 40; // Perfect temperature
    } else if (temp >= 10 && temp < 15) {
        score += 30; // Cool but acceptable
    } else if (temp > 25 && temp <= 30) {
        score += 30; // Warm but acceptable
    } else if (temp >= 5 && temp < 10) {
        score += 15; // Cold
    } else if (temp > 30 && temp <= 35) {
        score += 15; // Hot
    } else {
        score += 5; // Extreme temperatures
    }

    // Wind score (0-35 points) - Lower is better
    const wind = daytimeAvg.avgWindSpeed;
    if (wind <= 10) {
        score += 35; // Calm
    } else if (wind <= 20) {
        score += 25; // Breezy
    } else if (wind <= 30) {
        score += 10; // Windy
    } else {
        score += 0; // Very windy
    }

    // Precipitation score (0-25 points) - Lower is better
    const precip = daytimeAvg.avgPrecipitation;
    if (precip === 0) {
        score += 25; // No rain
    } else if (precip <= 2) {
        score += 15; // Light drizzle
    } else if (precip <= 5) {
        score += 5; // Moderate rain
    } else {
        score += 0; // Heavy rain
    }

    return Math.min(100, score);
};

/**
 * Score fish activity based on moon phase, tides, and water temperature
 */
const scoreFishActivity = (weather: FishingConditions): number => {
    const today = getTodayForecast(weather);
    const daytimeAvg = getAverageDaytimeConditions(today.hourly);

    if (!daytimeAvg) return 50; // Neutral score if no data

    let score = 0;

    // Moon phase score (0-25 points)
    // New moon and full moon are best (higher illumination variance = more feeding activity)
    const moonIllum = today.moonIllumination;
    if (moonIllum <= 10 || moonIllum >= 90) {
        score += 25; // New or full moon
    } else if ((moonIllum >= 40 && moonIllum <= 60)) {
        score += 15; // Half moon
    } else {
        score += 20; // Other phases
    }

    // Tide changes score (0-40 points)
    // Tide changes during prime times = active fish
    if (hasGoodTideChanges(today.tides, today.sunrise, today.sunset)) {
        score += 40; // Tides during prime time
    } else if (today.tides.length >= 2) {
        score += 25; // Multiple tide changes, but not prime time
    } else {
        score += 15; // Few or no tide changes
    }

    // Water temperature score (0-35 points) - Optimal: 15-22°C for most species
    const waterTemp = daytimeAvg.avgWaterTemp;
    if (waterTemp >= 15 && waterTemp <= 22) {
        score += 35; // Optimal
    } else if (waterTemp >= 10 && waterTemp < 15) {
        score += 25; // Cool but active
    } else if (waterTemp > 22 && waterTemp <= 26) {
        score += 25; // Warm but active
    } else if (waterTemp >= 5 && waterTemp < 10) {
        score += 10; // Cold, less active
    } else if (waterTemp > 26 && waterTemp <= 30) {
        score += 10; // Hot, less active
    } else {
        score += 5; // Extreme temps, very inactive
    }

    return Math.min(100, score);
};

/**
 * Score water conditions based on wave height, swell, and visibility
 * Calmer, clearer water = higher score
 */
const scoreWaterConditions = (weather: FishingConditions): number => {
    const today = getTodayForecast(weather);
    const daytimeAvg = getAverageDaytimeConditions(today.hourly);

    if (!daytimeAvg) return 50; // Neutral score if no data

    let score = 0;

    // Wave height score (0-40 points) - Lower is better for safety
    const waveHeight = daytimeAvg.avgWaveHeight;
    if (waveHeight <= 0.5) {
        score += 40;
    } else if (waveHeight <= 1.0) {
        score += 30;
    } else if (waveHeight <= 1.5) {
        score += 20;
    } else if (waveHeight <= 2.0) {
        score += 10;
    } else {
        score += 5;
    }

    // Swell height score (0-35 points) - Lower is better
    const swellHeight = daytimeAvg.avgSwellHeight;
    if (swellHeight <= 0.5) {
        score += 35;
    } else if (swellHeight <= 1.0) {
        score += 25;
    } else if (swellHeight <= 2.0) {
        score += 15;
    } else {
        score += 5;
    }

    // Visibility score (0-25 points) - Higher is better
    const visibility = daytimeAvg.avgVisibility;
    if (visibility >= 10) {
        score += 25;
    } else if (visibility >= 7) {
        score += 20;
    } else if (visibility >= 4) {
        score += 12;
    } else {
        score += 5;
    }

    return Math.min(100, score);
};

/**
 * Calculate overall fishing score by combining all three categories
 */
const calculateOverallScore = (weather: FishingConditions): { score: number; breakdown: ScoreBreakdown } => {
    const weatherComfort = scoreWeatherComfort(weather);
    const fishActivity = scoreFishActivity(weather);
    const waterConditions = scoreWaterConditions(weather);

    // Equal weighting: 33.33% each
    const overallScore = (weatherComfort + fishActivity + waterConditions) / 3;

    return {
        score: Math.round(overallScore * 10) / 10, // Round to tenth place
        breakdown: {
            weatherComfort: Math.round(weatherComfort * 10) / 10,
            fishActivity: Math.round(fishActivity * 10) / 10,
            waterConditions: Math.round(waterConditions * 10) / 10,
        }
    };
};

const sortByOverallAverageTemp = (
    locs: LocationWeatherResult[],
    order: 'desc' | 'asc' = 'desc'
): LocationWeatherResult[] => {
    // HELPER CALLBACK
    const calculateOverallAverage = (location: LocationWeatherResult): number => {
        let allTemps: number[] = [];
        for (const day of location.weather.forecast) {
            allTemps.push(day.summary.maxTemp);
            allTemps.push(day.summary.minTemp);
        }
        if (allTemps.length === 0) return 0;
        const sum = allTemps.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        return sum / allTemps.length;
    };

    // Keep track of which object is which
    const averageMap = new Map<LocationWeatherResult, number>();
    for (const loc of locs) {
        averageMap.set(loc, calculateOverallAverage(loc));
    }


    return [...locs].sort((a, b) => {
        const avgA = averageMap.get(a) || 0;
        const avgB = averageMap.get(b) || 0;
        const comparison = avgB - avgA;

        if (order === 'asc') {
            return -comparison;
        }

        return comparison;
    });
};

const router = Router();

/**
 * GET /api/recommended?latitude=&longitude=&radius=
 *
 * Returns recommended fishing spots within a radius, sorted by overall fishing score
 * considering weather comfort, fish activity, and water conditions for today.
 */
router.get("/", async (req, res) => {
    try {
        const { latitude, longitude, radius } = req.query;

        if (!latitude || !longitude || !radius) {
            return res.status(400).json({
                error: "Missing required parameters: latitude, longitude, and radius are required"
            });
        }

        const lat = parseFloat(latitude as string);
        const lon = parseFloat(longitude as string);
        const rad = parseFloat(radius as string);

        if (isNaN(lat) || isNaN(lon) || isNaN(rad)) {
            return res.status(400).json({
                error: "Invalid parameters: latitude, longitude, and radius must be valid numbers"
            });
        }

        const flags = validateRadius(lat, lon, rad);
        if (flags.length > 0) {
            const messages = flags.join('\n');
            res.status(400).send({message: messages})
        }

        const weatherResults = await fetchWeatherForRadius(lat, lon, rad);

        // Calculate scores for all successful weather results
        const recommendations: LocationRecommendation[] = weatherResults.successful.map(result => {
            const scoreData = calculateOverallScore(result.weather);
            return {
                ...result,
                score: scoreData.score,
                breakdown: scoreData.breakdown
            };
        });

        recommendations.sort((a, b) => b.score - a.score);

        return res.json({
            recommendations,
            failed: weatherResults.failed,
            totalLocations: recommendations.length + weatherResults.failed.length,
            successfulScores: recommendations.length,
            failedWeatherFetches: weatherResults.failed.length
        });

    } catch (error) {
        console.error("Error generating recommendations:", error);
        return res.status(500).json({
            error: "Internal server error while generating recommendations"
        });
    }
});

export default router;
export {sortByOverallAverageTemp}
