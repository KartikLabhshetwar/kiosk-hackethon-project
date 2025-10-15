// Client-side hooks
import { useState, useEffect, useCallback } from 'react';
import { Product, Celebrity, VibeStats } from '../types/api';
import { api } from '../api/services';

// Hook for personalized recommendations
export const usePersonalizedRecommendations = () => {
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecommendations = useCallback(async (preferences: {
    occasion?: string;
    vibe?: string;
    budget?: { min: number; max: number };
    category?: string;
    celebrity?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let results: Product[] = [];
      
      if (preferences.celebrity) {
        // Search by celebrity
        const celebrityResult = api.searchByCelebrity(preferences.celebrity, {
          min_price: preferences.budget?.min,
          max_price: preferences.budget?.max,
          top_k: 10
        });
        results = celebrityResult?.products || [];
      } else if (preferences.vibe) {
        // Search by vibe
        results = api.searchByVibe(preferences.vibe, {
          min_price: preferences.budget?.min,
          max_price: preferences.budget?.max,
          category: preferences.category,
          top_k: 10
        });
      } else {
        // General search based on occasion and other preferences
        const query = preferences.occasion || preferences.category || 'jewelry';
        results = api.search(query, {
          min_price: preferences.budget?.min,
          max_price: preferences.budget?.max,
          category: preferences.category,
          vibe: preferences.vibe,
          top_k: 10
        });
      }
      
      setData(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get recommendations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, getRecommendations };
};

// Hook for categories
export const useCategories = () => {
  const [data, setData] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = api.getCategories();
        setData(categories);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  return { data, isLoading, error };
};

// Hook for vibes
export const useVibes = () => {
  const [data, setData] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVibes = async () => {
      try {
        const vibes = api.getVibes();
        setData(vibes);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load vibes');
      } finally {
        setIsLoading(false);
      }
    };

    loadVibes();
  }, []);

  return { data, isLoading, error };
};

// Hook for celebrities
export const useCelebrities = () => {
  const [data, setData] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCelebrities = async () => {
      try {
        const celebrities = api.getCelebrities();
        setData(celebrities);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load celebrities');
      } finally {
        setIsLoading(false);
      }
    };

    loadCelebrities();
  }, []);

  return { data, isLoading, error };
};

// Hook for celebrity search
export const useCelebritySearch = () => {
  const [data, setData] = useState<{ celebrity: Celebrity; products: Product[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchByCelebrity = useCallback(async (celebrityName: string, filters?: {
    min_price?: number;
    max_price?: number;
    top_k?: number;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = api.searchByCelebrity(celebrityName, filters);
      if (!result) {
        throw new Error(`Celebrity '${celebrityName}' not found`);
      }
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search by celebrity');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, searchByCelebrity };
};

// Hook for vibe search
export const useVibeSearch = () => {
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchByVibe = useCallback(async (vibe: string, filters?: {
    min_price?: number;
    max_price?: number;
    category?: string;
    top_k?: number;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = api.searchByVibe(vibe, filters);
      setData(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search by vibe');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, searchByVibe };
};

// Hook for general search
export const useSearch = () => {
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, filters?: {
    min_price?: number;
    max_price?: number;
    category?: string;
    vibe?: string;
    top_k?: number;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = api.search(query, filters);
      setData(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, search };
};

// Hook for vibe statistics
export const useVibeStatistics = () => {
  const [data, setData] = useState<VibeStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = api.getVibeStatistics();
        setData(stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load vibe statistics');
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  return { data, isLoading, error };
};

// Hook for formatted vibes (for display)
export const useFormattedVibes = () => {
  const { data: vibes, isLoading, error } = useVibes();
  
  const formattedVibes = vibes.map(vibe => ({
    value: vibe,
    label: vibe.charAt(0).toUpperCase() + vibe.slice(1),
    image: `/vibe/${vibe}.png`
  }));

  return { data: formattedVibes, isLoading, error };
};

// Hook for search suggestions
export const useSearchSuggestions = () => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = api.getSearchSuggestions(query);
      setSuggestions(results);
    } catch (err) {
      console.error('Failed to get suggestions:', err);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { suggestions, isLoading, getSuggestions };
};

// Hook for data initialization
export const useDataInitialization = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        await api.initializeData();
        setIsInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize data');
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  return { isInitialized, isLoading, error };
};

// Hook for formatted celebrities (for display)
export const useFormattedCelebrities = () => {
  const { data: celebrities, isLoading, error } = useCelebrities();
  
  const formattedCelebrities = celebrities.map((celeb, index) => ({
    id: celeb.toLowerCase().replace(' ', '_'),
    name: celeb,
    image: `/celebs/${celeb.toLowerCase().replace(' ', '')}.jpg`
  }));

  return { data: formattedCelebrities, isLoading, error };
};
