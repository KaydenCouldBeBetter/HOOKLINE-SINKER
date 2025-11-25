// Shared types for fishing conditions and locations

export interface FishingConditions {
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  forecast: Array<{
    date: string;
    temperature: number;
    conditions: string;
    windSpeed: number;
    windDirection: number;
    precipitation: number;
    humidity: number;
    pressure: number;
    visibility: number;
    uvIndex: number;
  }>;
  waterTemperature?: number;
  tideInfo?: {
    high: string;
    low: string;
    current: string;
  };
  fishActivity: number;
  weatherComfort: number;
  waterConditions: number;
  overallScore: number;
}

export interface Location {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description?: string;
  category: 'lake' | 'river' | 'parking' | 'other';
  metadata?: Record<string, unknown>;
}

export interface LocationRecommendation {
  id: string;
  score: number;
  breakdown: {
    weatherComfort: number;
    fishActivity: number;
    waterConditions: number;
  };
  recommended: boolean;
  reasons: string[];
  location: {
    latitude: number;
    longitude: number;
    name: string;
  };
  distance?: number;
}
