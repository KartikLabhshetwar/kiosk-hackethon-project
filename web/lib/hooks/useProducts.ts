/**
 * Product-specific hooks
 * Custom hooks for product-related API operations
 */

'use client';

import { useCallback } from 'react';
import { useApi, useMutation, useCachedQuery } from './useApi';
import {
  searchProducts,
  searchByCelebrity,
  searchByVibe,
  getProductById,
  getSearchSuggestions,
} from '../api/services';
import {
  Product,
  SearchRequest,
  CelebrityRequest,
  VibeRequest,
  CelebrityStyleData,
} from '../types/api';

// ============================================================================
// Product Search Hooks
// ============================================================================

/**
 * Hook for searching products
 */
export function useProductSearch() {
  return useMutation<Product[], SearchRequest>(searchProducts, {
    onSuccess: (data) => {
      console.log(`Found ${data.length} products`);
    },
    onError: (error) => {
      console.error('Product search failed:', error);
    },
  });
}

/**
 * Hook for celebrity-based search
 */
export function useCelebritySearch() {
  return useMutation<CelebrityStyleData, CelebrityRequest>(searchByCelebrity, {
    onSuccess: (data) => {
      console.log(`Celebrity search: ${data.celebrity_name}, ${data.products.length} products`);
    },
    onError: (error) => {
      console.error('Celebrity search failed:', error);
    },
  });
}

/**
 * Hook for vibe-based search
 */
export function useVibeSearch() {
  return useMutation<Product[], VibeRequest>(searchByVibe, {
    onSuccess: (data) => {
      console.log(`Vibe search: ${data.length} products`);
    },
    onError: (error) => {
      console.error('Vibe search failed:', error);
    },
  });
}

/**
 * Hook for getting product by ID
 */
export function useProduct(productId: number) {
  const fetchProduct = useCallback(() => {
    return getProductById(productId);
  }, [productId]);

  return useCachedQuery<Product>(fetchProduct, {
    cacheKey: `product-${productId}`,
    autoFetch: !!productId,
  });
}

/**
 * Hook for search suggestions (with debouncing)
 */
export function useSearchSuggestions(query: string, enabled: boolean = true) {
  const fetchSuggestions = useCallback(() => {
    if (!query || query.length < 2) {
      return Promise.resolve([]);
    }
    return getSearchSuggestions(query);
  }, [query]);

  return useApi<string[]>(fetchSuggestions, {
    initialData: [],
    autoFetch: enabled && query.length >= 2,
  });
}

// ============================================================================
// Personalized Recommendation Hook
// ============================================================================

interface RecommendationParams {
  occasion?: string;
  budget?: { min: number; max: number };
  vibe?: string;
  category?: string;
  celebrity?: string;
}

/**
 * Hook for getting personalized recommendations based on user preferences
 */
export function usePersonalizedRecommendations() {
  const searchMutation = useProductSearch();

  const getRecommendations = useCallback(
    async (params: RecommendationParams) => {
      // Build search query from preferences
      const queryParts: string[] = [];

      if (params.occasion) queryParts.push(params.occasion);
      if (params.vibe) queryParts.push(params.vibe);
      if (params.category) queryParts.push(params.category);

      const query = queryParts.length > 0 ? queryParts.join(' ') : 'jewelry';

      const searchRequest: SearchRequest = {
        query,
        min_price: params.budget?.min,
        max_price: params.budget?.max,
        category: params.category,
        vibe: params.vibe,
        top_k: 6,
      };

      return searchMutation.mutate(searchRequest);
    },
    [searchMutation]
  );

  return {
    ...searchMutation,
    getRecommendations,
  };
}

// ============================================================================
// Similar Products Hook
// ============================================================================

/**
 * Hook for getting similar products based on a reference product
 */
export function useSimilarProducts(referenceProduct: Product | null) {
  const searchMutation = useProductSearch();

  const getSimilarProducts = useCallback(async () => {
    if (!referenceProduct) return [];

    // Use product description and category for similarity search
    const query = `${referenceProduct.description} ${referenceProduct.category || ''}`;
    
    const searchRequest: SearchRequest = {
      query,
      category: referenceProduct.category || undefined,
      top_k: 5,
    };

    return searchMutation.mutate(searchRequest);
  }, [referenceProduct, searchMutation]);

  return {
    ...searchMutation,
    getSimilarProducts,
  };
}

