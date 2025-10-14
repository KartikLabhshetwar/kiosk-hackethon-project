/**
 * Custom React Hooks for API Calls
 * Reusable hooks with loading states, error handling, and caching
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { LoadingState } from '../types/api';

// ============================================================================
// Generic API Hook
// ============================================================================

interface UseApiOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  autoFetch?: boolean;
}

export function useApi<T>(
  apiFunction: () => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const {
    initialData = null as T,
    onSuccess,
    onError,
    autoFetch = false,
  } = options;

  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading('loading');
      setError(null);
      
      const result = await apiFunction();
      
      setData(result);
      setLoading('success');
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setLoading('error');
      
      if (onError) {
        onError(err as Error);
      }
      
      throw err;
    }
  }, [apiFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setData(initialData);
    setLoading('idle');
    setError(null);
  }, [initialData]);

  useEffect(() => {
    if (autoFetch) {
      execute();
    }
  }, [autoFetch, execute]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
    isLoading: loading === 'loading',
    isSuccess: loading === 'success',
    isError: loading === 'error',
    isIdle: loading === 'idle',
  };
}

// ============================================================================
// Mutation Hook (for POST/PUT/DELETE operations)
// ============================================================================

interface UseMutationOptions<TData, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
}

export function useMutation<TData, TVariables>(
  mutationFunction: (variables: TVariables) => Promise<TData>,
  options: UseMutationOptions<TData, TVariables> = {}
) {
  const { onSuccess, onError } = options;

  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (variables: TVariables) => {
      try {
        setLoading('loading');
        setError(null);
        
        const result = await mutationFunction(variables);
        
        setData(result);
        setLoading('success');
        
        if (onSuccess) {
          onSuccess(result, variables);
        }
        
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        setLoading('error');
        
        if (onError) {
          onError(err as Error, variables);
        }
        
        throw err;
      }
    },
    [mutationFunction, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(null);
    setLoading('idle');
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    mutate,
    reset,
    isLoading: loading === 'loading',
    isSuccess: loading === 'success',
    isError: loading === 'error',
    isIdle: loading === 'idle',
  };
}

// ============================================================================
// Cached Query Hook
// ============================================================================

const queryCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface UseCachedQueryOptions<T> extends UseApiOptions<T> {
  cacheKey: string;
  cacheDuration?: number;
}

export function useCachedQuery<T>(
  apiFunction: () => Promise<T>,
  options: UseCachedQueryOptions<T>
) {
  const { cacheKey, cacheDuration = CACHE_DURATION, ...restOptions } = options;

  const apiWithCache = useCallback(async () => {
    const now = Date.now();
    const cached = queryCache.get(cacheKey);

    if (cached && now - cached.timestamp < cacheDuration) {
      return cached.data as T;
    }

    const result = await apiFunction();
    queryCache.set(cacheKey, { data: result, timestamp: now });
    
    return result;
  }, [apiFunction, cacheKey, cacheDuration]);

  return useApi(apiWithCache, restOptions);
}

// ============================================================================
// Debounced API Hook
// ============================================================================

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ============================================================================
// Infinite Scroll Hook
// ============================================================================

interface UseInfiniteScrollOptions<T> {
  fetchFunction: (page: number) => Promise<T[]>;
  initialPage?: number;
}

export function useInfiniteScroll<T>({ 
  fetchFunction, 
  initialPage = 1 
}: UseInfiniteScrollOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchMore = useCallback(async () => {
    if (!hasMore || loading === 'loading') return;

    try {
      setLoading('loading');
      setError(null);
      
      const newData = await fetchFunction(page);
      
      if (newData.length === 0) {
        setHasMore(false);
      } else {
        setData((prev) => [...prev, ...newData]);
        setPage((prev) => prev + 1);
      }
      
      setLoading('success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setLoading('error');
    }
  }, [fetchFunction, page, hasMore, loading]);

  const reset = useCallback(() => {
    setData([]);
    setPage(initialPage);
    setLoading('idle');
    setError(null);
    setHasMore(true);
  }, [initialPage]);

  return {
    data,
    loading,
    error,
    hasMore,
    fetchMore,
    reset,
    isLoading: loading === 'loading',
  };
}

