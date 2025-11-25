// Simple in-memory cache for API responses
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class SimpleCache {
  private cache = new Map<string, CacheEntry<any>>();

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    // Default TTL: 5 minutes
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if cache entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache info for debugging
  getInfo(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const cache = new SimpleCache();

// Cache keys
export const CACHE_KEYS = {
  WEATHER: 'weather_data',
  SPECIES: 'species_data',
  FISHING_SPOTS: 'fishing_spots_data'
} as const;

// Cache TTL values (in milliseconds)
export const CACHE_TTL = {
  WEATHER: 10 * 60 * 1000, // 10 minutes - weather changes frequently
  SPECIES: 24 * 60 * 60 * 1000, // 24 hours - species data is static
  FISHING_SPOTS: 30 * 60 * 1000 // 30 minutes - fishing spots may change
} as const;
