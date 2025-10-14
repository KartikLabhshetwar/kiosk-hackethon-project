/**
 * API Services
 * Reusable API service functions for all endpoints
 * Now using client-side search instead of backend API
 */

import { apiRequest } from './client';
import { API_ENDPOINTS } from './config';
import {
  Product,
  CelebrityStyleData,
  VibeStats,
  PriceRangeStats,
  HealthStatus,
  SearchRequest,
  CelebrityRequest,
  VibeRequest,
} from '../types/api';
// ClientSearch no longer needed - using backend API

// ============================================================================
// Health & System Services
// ============================================================================

/**
 * Check API health status
 */
export const getHealthStatus = async (): Promise<HealthStatus> => {
  return apiRequest<HealthStatus>({
    method: 'GET',
    url: API_ENDPOINTS.health,
  });
};

/**
 * Get root API information
 */
export const getRootInfo = async (): Promise<any> => {
  return apiRequest<any>({
    method: 'GET',
    url: API_ENDPOINTS.root,
  });
};

// ============================================================================
// Search Services
// ============================================================================

/**
 * Search for jewelry products
 */
export const searchProducts = async (params: SearchRequest): Promise<Product[]> => {
  // Use backend API
  return apiRequest<Product[]>({
    method: 'POST',
    url: API_ENDPOINTS.search,
    data: params,
  });
};

/**
 * Search by celebrity style
 */
export const searchByCelebrity = async (params: CelebrityRequest): Promise<CelebrityStyleData> => {
  // Use backend API
  return apiRequest<CelebrityStyleData>({
    method: 'POST',
    url: API_ENDPOINTS.searchCelebrity,
    data: params,
  });
};

/**
 * Search by vibe
 */
export const searchByVibe = async (params: VibeRequest): Promise<Product[]> => {
  // Use backend API
  return apiRequest<Product[]>({
    method: 'POST',
    url: API_ENDPOINTS.searchVibe,
    data: params,
  });
};

/**
 * Get search suggestions
 */
export const getSearchSuggestions = async (query: string): Promise<string[]> => {
  return apiRequest<string[]>({
    method: 'GET',
    url: API_ENDPOINTS.searchSuggestions,
    params: { q: query },
  });
};

// ============================================================================
// Metadata Services
// ============================================================================

/**
 * Get list of all celebrities
 */
export const getCelebrities = async (): Promise<string[]> => {
  // Use backend API
  return apiRequest<string[]>({
    method: 'GET',
    url: API_ENDPOINTS.celebrities,
  });
};

/**
 * Get list of all vibes
 */
export const getVibes = async (): Promise<string[]> => {
  // Use backend API
  return apiRequest<string[]>({
    method: 'GET',
    url: API_ENDPOINTS.vibes,
  });
};

/**
 * Get list of all categories
 */
export const getCategories = async (): Promise<string[]> => {
  // Use backend API
  return apiRequest<string[]>({
    method: 'GET',
    url: API_ENDPOINTS.categories,
  });
};

/**
 * Get list of all collections
 */
export const getCollections = async (): Promise<string[]> => {
  return apiRequest<string[]>({
    method: 'GET',
    url: API_ENDPOINTS.collections,
  });
};

// ============================================================================
// Statistics Services
// ============================================================================

/**
 * Get vibe distribution statistics
 */
export const getVibeStatistics = async (): Promise<VibeStats[]> => {
  return apiRequest<VibeStats[]>({
    method: 'GET',
    url: API_ENDPOINTS.statsVibes,
  });
};

/**
 * Get price range statistics
 */
export const getPriceRangeStats = async (): Promise<PriceRangeStats> => {
  return apiRequest<PriceRangeStats>({
    method: 'GET',
    url: API_ENDPOINTS.statsPriceRange,
  });
};

// ============================================================================
// Product Services
// ============================================================================

/**
 * Get specific product by ID
 */
export const getProductById = async (id: number): Promise<Product> => {
  // Use backend API
  return apiRequest<Product>({
    method: 'GET',
    url: API_ENDPOINTS.product(id),
  });
};

// ============================================================================
// Batch Operations
// ============================================================================

/**
 * Get multiple products by IDs
 */
export const getProductsByIds = async (ids: number[]): Promise<Product[]> => {
  const promises = ids.map((id) => getProductById(id));
  return Promise.all(promises);
};

/**
 * Get all metadata in one call (for initialization)
 */
export const getAllMetadata = async () => {
  const [celebrities, vibes, categories, collections] = await Promise.all([
    getCelebrities(),
    getVibes(),
    getCategories(),
    getCollections(),
  ]);

  return {
    celebrities,
    vibes,
    categories,
    collections,
  };
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format celebrity name for display
 */
export const formatCelebrityName = (name: string): string => {
  return name
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format price for display
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Parse budget string to min/max values
 */
export const parseBudgetString = (budget: string): { min: number; max: number } => {
  const budgetMap: Record<string, { min: number; max: number }> = {
    '50k-1L': { min: 50000, max: 100000 },
    '1L-2L': { min: 100000, max: 200000 },
    '2L-5L': { min: 200000, max: 500000 },
    '5L-10L': { min: 500000, max: 1000000 },
    '10L+': { min: 1000000, max: 10000000 },
  };

  return budgetMap[budget] || { min: 0, max: 10000000 };
};

