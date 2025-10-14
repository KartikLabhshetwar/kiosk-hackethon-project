/**
 * Hooks Index
 * Central export point for all hooks
 */

// Base hooks
export { useApi, useMutation, useCachedQuery, useDebounce, useInfiniteScroll } from './useApi';

// Product hooks
export {
  useProductSearch,
  useCelebritySearch,
  useVibeSearch,
  useProduct,
  useSearchSuggestions,
  usePersonalizedRecommendations,
  useSimilarProducts,
} from './useProducts';

// Metadata hooks
export {
  useCelebrities,
  useVibes,
  useCategories,
  useCollections,
  useAllMetadata,
  useVibeStatistics,
  usePriceRangeStats,
  useHealthStatus,
  useFormattedCelebrities,
  useFormattedVibes,
} from './useMetadata';

