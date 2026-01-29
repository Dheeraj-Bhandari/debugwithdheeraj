/**
 * Cache Utilities
 * 
 * Provides caching functionality for portfolio data and search results
 * using localStorage with TTL (Time To Live) support.
 * 
 * Requirements: 10.4
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

/**
 * Cache key prefixes for different data types
 */
const CACHE_KEYS = {
  PORTFOLIO_DATA: 'amazon_portfolio_data',
  SEARCH_RESULTS: 'amazon_search_results',
  SKILLS: 'amazon_skills',
  PROJECTS: 'amazon_projects',
  REVIEWS: 'amazon_reviews',
} as const;

/**
 * Default TTL values (in milliseconds)
 */
const DEFAULT_TTL = {
  PORTFOLIO_DATA: 24 * 60 * 60 * 1000, // 24 hours
  SEARCH_RESULTS: 5 * 60 * 1000, // 5 minutes
  SKILLS: 24 * 60 * 60 * 1000, // 24 hours
  PROJECTS: 24 * 60 * 60 * 1000, // 24 hours
  REVIEWS: 24 * 60 * 60 * 1000, // 24 hours
} as const;

/**
 * Checks if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Sets a value in cache with TTL
 * 
 * @param key - Cache key
 * @param data - Data to cache
 * @param ttl - Time to live in milliseconds
 */
export function setCache<T>(key: string, data: T, ttl: number): void {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage not available, skipping cache');
    return;
  }

  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    localStorage.setItem(key, JSON.stringify(entry));
  } catch (error) {
    console.error('Error setting cache:', error);
    // If localStorage is full, clear old entries
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      clearExpiredCache();
      // Try again after clearing
      try {
        const entry: CacheEntry<T> = {
          data,
          timestamp: Date.now(),
          ttl,
        };
        localStorage.setItem(key, JSON.stringify(entry));
      } catch (retryError) {
        console.error('Error setting cache after clearing:', retryError);
      }
    }
  }
}

/**
 * Gets a value from cache if not expired
 * 
 * @param key - Cache key
 * @returns Cached data or null if expired/not found
 */
export function getCache<T>(key: string): T | null {
  if (!isLocalStorageAvailable()) {
    return null;
  }

  try {
    const item = localStorage.getItem(key);
    if (!item) {
      return null;
    }

    const entry: CacheEntry<T> = JSON.parse(item);
    const now = Date.now();
    const age = now - entry.timestamp;

    // Check if expired
    if (age > entry.ttl) {
      localStorage.removeItem(key);
      return null;
    }

    return entry.data;
  } catch (error) {
    console.error('Error getting cache:', error);
    return null;
  }
}

/**
 * Removes a specific cache entry
 * 
 * @param key - Cache key to remove
 */
export function removeCache(key: string): void {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing cache:', error);
  }
}

/**
 * Clears all expired cache entries
 */
export function clearExpiredCache(): void {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    const now = Date.now();
    const keysToRemove: string[] = [];

    // Check all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith('amazon_')) {
        continue;
      }

      try {
        const item = localStorage.getItem(key);
        if (!item) continue;

        const entry: CacheEntry<any> = JSON.parse(item);
        const age = now - entry.timestamp;

        if (age > entry.ttl) {
          keysToRemove.push(key);
        }
      } catch (error) {
        // Invalid entry, mark for removal
        keysToRemove.push(key);
      }
    }

    // Remove expired entries
    keysToRemove.forEach(key => localStorage.removeItem(key));

    if (keysToRemove.length > 0) {
      console.log(`Cleared ${keysToRemove.length} expired cache entries`);
    }
  } catch (error) {
    console.error('Error clearing expired cache:', error);
  }
}

/**
 * Clears all Amazon portfolio cache
 */
export function clearAllCache(): void {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('amazon_')) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log(`Cleared ${keysToRemove.length} cache entries`);
  } catch (error) {
    console.error('Error clearing all cache:', error);
  }
}

/**
 * Portfolio Data Cache Functions
 */

export function cachePortfolioData<T>(data: T): void {
  setCache(CACHE_KEYS.PORTFOLIO_DATA, data, DEFAULT_TTL.PORTFOLIO_DATA);
}

export function getCachedPortfolioData<T>(): T | null {
  return getCache<T>(CACHE_KEYS.PORTFOLIO_DATA);
}

/**
 * Search Results Cache Functions
 */

export function cacheSearchResults<T>(query: string, results: T): void {
  const key = `${CACHE_KEYS.SEARCH_RESULTS}_${query.toLowerCase()}`;
  setCache(key, results, DEFAULT_TTL.SEARCH_RESULTS);
}

export function getCachedSearchResults<T>(query: string): T | null {
  const key = `${CACHE_KEYS.SEARCH_RESULTS}_${query.toLowerCase()}`;
  return getCache<T>(key);
}

export function clearSearchCache(): void {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_KEYS.SEARCH_RESULTS)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error clearing search cache:', error);
  }
}

/**
 * Skills Cache Functions
 */

export function cacheSkills<T>(skills: T): void {
  setCache(CACHE_KEYS.SKILLS, skills, DEFAULT_TTL.SKILLS);
}

export function getCachedSkills<T>(): T | null {
  return getCache<T>(CACHE_KEYS.SKILLS);
}

/**
 * Projects Cache Functions
 */

export function cacheProjects<T>(projects: T): void {
  setCache(CACHE_KEYS.PROJECTS, projects, DEFAULT_TTL.PROJECTS);
}

export function getCachedProjects<T>(): T | null {
  return getCache<T>(CACHE_KEYS.PROJECTS);
}

/**
 * Reviews Cache Functions
 */

export function cacheReviews<T>(reviews: T): void {
  setCache(CACHE_KEYS.REVIEWS, reviews, DEFAULT_TTL.REVIEWS);
}

export function getCachedReviews<T>(): T | null {
  return getCache<T>(CACHE_KEYS.REVIEWS);
}

/**
 * Initialize cache cleanup on page load
 * Clears expired entries to prevent localStorage from filling up
 */
if (typeof window !== 'undefined') {
  // Clear expired cache on page load
  clearExpiredCache();

  // Set up periodic cleanup (every 5 minutes)
  setInterval(clearExpiredCache, 5 * 60 * 1000);
}
