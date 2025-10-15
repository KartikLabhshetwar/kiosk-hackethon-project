// API Types for client-side operations
export interface Product {
  id: number;
  product_name: string;
  collection?: string;
  category?: string;
  price?: number;
  images?: string;
  description: string;
  product_url: string;
  vibes: string[];
  primary_vibe: string;
  similarity_score?: number;
  rank?: number;
}

export interface Celebrity {
  celebrity_name: string;
  style_description: string;
  vibes: string[];
  occasions: string[];
  keywords: string[];
  price_range: { min: number; max: number };
  preferred_categories: string[];
  products?: Product[];
}

export interface VibeStats {
  vibe: string;
  count: number;
  percentage: number;
}

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

export interface Preferences {
  occasion?: string;
  vibe?: string;
  budget?: { min: number; max: number };
  category?: string;
  celebrity?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
