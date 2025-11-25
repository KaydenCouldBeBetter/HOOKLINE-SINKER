// Database Types

export interface Species {
    species_id?: number;
    species_name: string;
    scientific_name?: string;
    description?: string;
    min_legal_size?: number;
    max_legal_size?: number;
    bag_limit?: number;
    average_weight?: number;
    record_weight?: number;
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
    eating_quality?: number;
    catch_and_release_recommended?: number;
    created_at?: string;
    updated_at?: string;
}

export interface Image {
    image_id?: number;
    filename: string;
    original_filename?: string;
    file_path: string;
    file_size?: number;
    mime_type?: string;
    width?: number;
    height?: number;
    alt_text?: string;
    caption?: string;
    uploaded_at?: string;
}

export interface Location {
    location_id?: number;
    name: string;
    description?: string;
    longitude: number;
    latitude: number;
    location_type?: string;
    water_body_name?: string;
    access_type?: string;
    parking_available?: number;
    boat_ramp?: number;
    shore_fishing?: number;
    water_depth?: string;
    structure_type?: string;
    bottom_type?: string;
    current_strength?: string;
    rating?: number;
    total_reviews?: number;
    created_by?: string;
    is_public?: number;
    created_at?: string;
    updated_at?: string;
}

export interface SpeciesImage {
    species_image_id?: number;
    species_id: number;
    image_id: number;
    is_primary?: number;
    display_order?: number;
    created_at?: string;
}

export interface LocationImage {
    location_image_id?: number;
    location_id: number;
    image_id: number;
    is_primary?: number;
    display_order?: number;
    created_at?: string;
}

export interface LocationSpecies {
    location_species_id?: number;
    location_id: number;
    species_id: number;
    abundance?: string;
    best_season?: string;
    notes?: string;
    last_reported?: string;
    created_at?: string;
}

// Weather/Fishing Types

export interface TideInfo {
    tide_time: string;
    tide_height_mt: string;
    tide_type: "HIGH" | "LOW";
}

export interface FishingConditions {
    location: {
        name: string;
        lat: number;
        lon: number;
    };
    forecast: Array<{
        date: string;
        tides: TideInfo[];
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

// Response type for radius query
export interface LocationWeatherResult {
    locationId: number;
    locationName: string;
    location: Location;
    weather: FishingConditions;
    distance: number;
}

export interface LocationWeatherError {
    locationId: number;
    locationName: string;
    error: string;
    distance: number;
}

// Recommendation Types
export interface ScoreBreakdown {
    weatherComfort: number;
    fishActivity: number;
    waterConditions: number;
}

export interface LocationRecommendation extends LocationWeatherResult {
    score: number;
    breakdown: ScoreBreakdown;
}

export type Success<T> = {
    ok: true
    value: any
}

export type Failure<E> = {
    ok: false
    error: any
}

export type Result<T, E> = Success<T> | Failure<E>;
export const ok = <T>(value: T): Success<T> => ({ ok: true, value });
export const err = <E>(error: E): Failure<E> => ({ ok: false, error });
