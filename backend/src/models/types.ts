/**
 * TypeScript interfaces for Evol Jewels API
 * Matches FastAPI Pydantic models exactly
 */

// ============================================================================
// Request Types
// ============================================================================

export interface SearchRequest {
  query: string;
  min_price?: number;
  max_price?: number;
  category?: string;
  vibe?: string;
  top_k: number;
}

export interface CelebrityRequest {
  celebrity_name: string;
  min_price?: number;
  max_price?: number;
  top_k: number;
}

export interface VibeRequest {
  vibe: string;
  min_price?: number;
  max_price?: number;
  category?: string;
  top_k: number;
}

// ============================================================================
// Response Types
// ============================================================================

export interface Product {
  id: number;
  product_name: string;
  collection?: string | undefined;
  category?: string | undefined;
  price?: number | undefined;
  images?: string | undefined;
  description: string;
  product_url: string;
  vibes: string[];
  primary_vibe: string;
  similarity_score?: number | undefined;
  rank?: number | undefined;
}

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
  query?: string;
}

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

export interface RootInfo {
  message: string;
  version: string;
  status: string;
  docs: string;
  health: string;
}

// ============================================================================
// Internal Service Types
// ============================================================================

export interface CelebrityStyle {
  vibes: string[];
  occasions: string[];
  keywords: string[];
  price_range: {
    min: number;
    max: number;
  };
  preferred_categories: string[];
  style_description: string;
}

export interface CelebrityDatabase {
  [key: string]: CelebrityStyle;
}

export interface VibeKeywords {
  [vibe: string]: string[];
}

export interface VibeWeights {
  [vibe: string]: number;
}

export interface VibeClassification {
  vibe: string;
  confidence: number;
}

export interface ProductMetadata {
  id: number;
  product_name: string;
  collection?: string | undefined;
  category?: string | undefined;
  price?: number | undefined;
  images?: string | undefined;
  description: string;
  product_url: string;
  vibes: string[];
  primary_vibe: string;
  vibe_scores: { [vibe: string]: number };
  similarity_score?: number | undefined;
  rank?: number | undefined;
  celebrity_inspiration?: {
    celebrity: string;
    style_description: string;
    vibes: string[];
    occasions: string[];
  } | undefined;
}

export interface SearchResult {
  product: ProductMetadata;
  similarity_score: number;
  rank: number;
}

export interface EmbeddingData {
  embeddings: number[][];
  metadata: ProductMetadata[];
}

// ============================================================================
// Configuration Types
// ============================================================================

export interface ServerConfig {
  port: number;
  host: string;
  nodeEnv: string;
  corsOrigins: string[];
  dataPath: string;
  modelPath: string;
}

export interface SearchConfig {
  defaultTopK: number;
  maxTopK: number;
  similarityThreshold: number;
  enableCaching: boolean;
}

// ============================================================================
// Error Types
// ============================================================================

export interface ApiError {
  status: number;
  message: string;
  details?: string;
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// ============================================================================
// Utility Types
// ============================================================================

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RouteHandler {
  method: HttpMethod;
  path: string;
  handler: (req: any, res: any) => Promise<void>;
}

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    total?: number;
    page?: number;
    limit?: number;
    processingTime?: number;
  };
}
