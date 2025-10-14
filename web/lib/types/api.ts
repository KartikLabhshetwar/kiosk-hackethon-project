/**
 * TypeScript Type Definitions
 * Type-safe API request/response structures
 */

// ============================================================================
// Product Types
// ============================================================================

export interface Product {
  id: number;
  product_name: string;
  collection: string | null;
  category: string | null;
  price: number | null;
  images: string | null;
  description: string;
  product_url: string;
  vibes: string[];
  primary_vibe: string;
  similarity_score?: number;
  rank?: number;
}

// ============================================================================
// Celebrity Types
// ============================================================================

export interface CelebrityStyleData {
  celebrity_name: string;
  style_description: string;
  vibes: string[];
  occasions: string[];
  keywords: string[];
  price_range: {
    min: number;
    max: number;
  };
  preferred_categories: string[];
  products: Product[];
}

// ============================================================================
// Statistics Types
// ============================================================================

export interface VibeStats {
  vibe: string;
  count: number;
  percentage: number;
}

export interface PriceRangeStats {
  min: number;
  max: number;
  avg: number;
  count: number;
}

export interface HealthStatus {
  status: string;
  products_loaded: number;
  celebrities_available: number;
  vibes_available: number;
}

// ============================================================================
// Request Types
// ============================================================================

export interface SearchRequest {
  query: string;
  min_price?: number;
  max_price?: number;
  category?: string;
  vibe?: string;
  top_k?: number;
}

export interface CelebrityRequest {
  celebrity_name: string;
  min_price?: number;
  max_price?: number;
  top_k?: number;
}

export interface VibeRequest {
  vibe: string;
  min_price?: number;
  max_price?: number;
  category?: string;
  top_k?: number;
}

// ============================================================================
// User Preferences (Frontend State)
// ============================================================================

export interface UserPreferences {
  occasion?: string;
  budget?: {
    min: number;
    max: number;
  };
  vibe?: string;
  category?: string;
  celebrity?: string;
}

// ============================================================================
// API Response Wrapper Types
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  error?: string;
  loading: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// ============================================================================
// Utility Types
// ============================================================================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
  has_prev: boolean;
}

