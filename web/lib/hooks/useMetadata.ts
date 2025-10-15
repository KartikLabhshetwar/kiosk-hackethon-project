/**
 * Metadata hooks
 * Hooks for fetching celebrities, vibes, categories, etc.
 */

'use client';

import { useCallback } from 'react';
import { useCachedQuery } from './useApi';
import {
  getCelebrities,
  getVibes,
  getCategories,
  getCollections,
  getVibeStatistics,
  getPriceRangeStats,
  getHealthStatus,
  getAllMetadata,
} from '../api/services';
import {
  VibeStats,
  PriceRangeStats,
  HealthStatus,
} from '../types/api';

// ============================================================================
// Metadata Hooks
// ============================================================================

/**
 * Hook for fetching celebrities list
 */
export function useCelebrities() {
  return useCachedQuery<string[]>(getCelebrities, {
    cacheKey: 'celebrities',
    autoFetch: true,
    initialData: [],
  });
}

/**
 * Hook for fetching vibes list
 */
export function useVibes() {
  return useCachedQuery<string[]>(getVibes, {
    cacheKey: 'vibes',
    autoFetch: true,
    initialData: [],
  });
}

/**
 * Hook for fetching categories list
 */
export function useCategories() {
  return useCachedQuery<string[]>(getCategories, {
    cacheKey: 'categories',
    autoFetch: true,
    initialData: [],
  });
}

/**
 * Hook for fetching collections list
 */
export function useCollections() {
  return useCachedQuery<string[]>(getCollections, {
    cacheKey: 'collections',
    autoFetch: true,
    initialData: [],
  });
}

/**
 * Hook for fetching all metadata at once
 */
export function useAllMetadata() {
  return useCachedQuery(getAllMetadata, {
    cacheKey: 'all-metadata',
    autoFetch: true,
    initialData: {
      celebrities: [],
      vibes: [],
      categories: [],
      collections: [],
    },
  });
}

// ============================================================================
// Statistics Hooks
// ============================================================================

/**
 * Hook for fetching vibe statistics
 */
export function useVibeStatistics() {
  return useCachedQuery<VibeStats[]>(getVibeStatistics, {
    cacheKey: 'vibe-stats',
    autoFetch: true,
    initialData: [],
  });
}

/**
 * Hook for fetching price range statistics
 */
export function usePriceRangeStats() {
  return useCachedQuery<PriceRangeStats>(getPriceRangeStats, {
    cacheKey: 'price-range-stats',
    autoFetch: true,
    initialData: {
      min: 0,
      max: 0,
      avg: 0,
      count: 0,
    },
  });
}

/**
 * Hook for checking API health
 */
export function useHealthStatus() {
  const fetchHealth = useCallback(getHealthStatus, []);

  return useCachedQuery<HealthStatus>(fetchHealth, {
    cacheKey: 'health-status',
    autoFetch: true,
    cacheDuration: 60000, // 1 minute cache
    initialData: {
      status: 'unknown',
      products_loaded: 0,
      celebrities_available: 0,
      vibes_available: 0,
    },
  });
}

// ============================================================================
// Helper Hooks
// ============================================================================

/**
 * Hook for formatted celebrity names
 */
export function useFormattedCelebrities() {
  const { data: celebrities, ...rest } = useCelebrities();

  const formatted = celebrities.map((name) => ({
    id: name,
    name: name
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
  }));

  return {
    data: formatted,
    ...rest,
  };
}

/**
 * Hook for formatted vibes with display names
 */
export function useFormattedVibes() {
  const { data: vibes, ...rest } = useVibes();

  const vibeLabels: Record<string, string> = {
    royal: 'Royal',
    traditional: 'Traditional',
    modern: 'Modern',
    elegant: 'Elegant',
    bohemian: 'Bohemian',
    vintage: 'Vintage',
    glamorous: 'Glamorous',
    minimalist: 'Minimalist',
    statement: 'Statement',
    festive: 'Festive',
    romantic: 'Romantic',
    professional: 'Professional',
    casual: 'Casual',
    luxury: 'Luxury',
    artistic: 'Artistic',
  };

  const formatted = vibes.map((vibe) => ({
    id: vibe,
    name: vibeLabels[vibe] || vibe.charAt(0).toUpperCase() + vibe.slice(1),
  }));

  return {
    data: formatted,
    ...rest,
  };
}

