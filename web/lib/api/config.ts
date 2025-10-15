/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://kiosk-hackethon-project.onrender.com',
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000', 10),
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * API Endpoints
 * All API endpoints in one place for easy maintenance
 */
export const API_ENDPOINTS = {
  // Health & System
  root: '/',
  health: '/health',
  
  // Search endpoints
  search: '/search',
  searchCelebrity: '/search/celebrity',
  searchVibe: '/search/vibe',
  searchSuggestions: '/search/suggestions',
  
  // Metadata endpoints
  celebrities: '/celebrities',
  vibes: '/vibes',
  categories: '/categories',
  collections: '/collections',
  
  // Statistics endpoints
  statsVibes: '/stats/vibes',
  statsPriceRange: '/stats/price-range',
  
  // Product endpoints
  product: (id: number) => `/product/${id}`,
};

/**
 * API Error Messages
 */
export const API_ERROR_MESSAGES = {
  network: 'Network error. Please check your internet connection.',
  timeout: 'Request timeout. Please try again.',
  server: 'Server error. Please try again later.',
  notFound: 'Resource not found.',
  unauthorized: 'Unauthorized access.',
  unknown: 'An unexpected error occurred.',
};

