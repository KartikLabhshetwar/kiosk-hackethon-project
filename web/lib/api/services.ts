// Client-side API services (no backend calls)
import { Product, Celebrity, SearchRequest, CelebrityRequest, VibeRequest, VibeStats } from '../types/api';
import { products, loadProducts } from '../data/products';
import { celebrities, getCelebrityByName } from '../data/celebrities';
import { getAllVibes, classifyVibe, getPrimaryVibe } from '../data/vibes';
import { loadOccasionData, getOccasionById, getOccasionRecommendations } from '../data/occasions';

// Utility function to format price
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Simple text-based search (client-side)
const searchProducts = (query: string, filters: {
  min_price?: number;
  max_price?: number;
  category?: string;
  vibe?: string;
  top_k?: number;
} = {}): Product[] => {
  const queryLower = query.toLowerCase();
  const results: Product[] = [];
  
  for (const product of products) {
    // Text matching
    const matchesQuery = 
      product.product_name.toLowerCase().includes(queryLower) ||
      product.description.toLowerCase().includes(queryLower) ||
      (product.collection && product.collection.toLowerCase().includes(queryLower)) ||
      (product.category && product.category.toLowerCase().includes(queryLower));
    
    if (!matchesQuery) continue;
    
    // Apply filters
    if (filters.min_price && product.price && product.price < filters.min_price) continue;
    if (filters.max_price && product.price && product.price > filters.max_price) continue;
    if (filters.category && product.category && !product.category.toLowerCase().includes(filters.category.toLowerCase())) continue;
    if (filters.vibe && !product.vibes.some(v => v.toLowerCase().includes(filters.vibe!.toLowerCase()))) continue;
    
    results.push(product);
  }
  
  // Sort by relevance (simple scoring)
  results.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;
    
    // Exact name match gets highest score
    if (a.product_name.toLowerCase().includes(queryLower)) scoreA += 10;
    if (b.product_name.toLowerCase().includes(queryLower)) scoreB += 10;
    
    // Category match
    if (a.category && a.category.toLowerCase().includes(queryLower)) scoreA += 5;
    if (b.category && b.category.toLowerCase().includes(queryLower)) scoreB += 5;
    
    // Collection match
    if (a.collection && a.collection.toLowerCase().includes(queryLower)) scoreA += 3;
    if (b.collection && b.collection.toLowerCase().includes(queryLower)) scoreB += 3;
    
    return scoreB - scoreA;
  });
  
  return results.slice(0, filters.top_k || 5);
};

// Search by celebrity
const searchByCelebrity = (celebrityName: string, filters: {
  min_price?: number;
  max_price?: number;
  top_k?: number;
} = {}): { celebrity: Celebrity; products: Product[] } | null => {
  const celebrity = getCelebrityByName(celebrityName);
  if (!celebrity) return null;
  
  // Create search query from celebrity keywords
  const query = celebrity.keywords.join(' ');
  const priceRange = celebrity.price_range;
  
  const searchFilters = {
    min_price: filters.min_price || priceRange.min,
    max_price: filters.max_price || priceRange.max,
    top_k: filters.top_k || 5
  };
  
  const foundProducts = searchProducts(query, searchFilters);
  
  // Filter by celebrity's preferred categories and vibes
  const filteredProducts = foundProducts.filter(product => {
    // Check if product matches celebrity's preferred categories
    const categoryMatch = celebrity.preferred_categories.some(cat => 
      product.category && product.category.toLowerCase().includes(cat.toLowerCase())
    );
    
    // Check if product vibes match celebrity vibes
    const vibeMatch = celebrity.vibes.some(vibe => 
      product.vibes.some(pv => pv.toLowerCase().includes(vibe.toLowerCase()))
    );
    
    return categoryMatch || vibeMatch;
  });
  
  return {
    celebrity,
    products: filteredProducts
  };
};

// Search by vibe
const searchByVibe = (vibe: string, filters: {
  min_price?: number;
  max_price?: number;
  category?: string;
  top_k?: number;
} = {}): Product[] => {
  const results: Product[] = [];
  
  for (const product of products) {
    // Check if product has the requested vibe
    const hasVibe = product.vibes.some(v => v.toLowerCase().includes(vibe.toLowerCase()));
    if (!hasVibe) continue;
    
    // Apply filters
    if (filters.min_price && product.price && product.price < filters.min_price) continue;
    if (filters.max_price && product.price && product.price > filters.max_price) continue;
    if (filters.category && product.category && !product.category.toLowerCase().includes(filters.category.toLowerCase())) continue;
    
    results.push(product);
  }
  
  return results.slice(0, filters.top_k || 5);
};

// Search by occasion
const searchByOccasion = (occasionId: string, filters: {
  min_price?: number;
  max_price?: number;
  category?: string;
  top_k?: number;
} = {}): Product[] => {
  console.log(`🔍 Searching by occasion: ${occasionId}`, filters);
  const occasion = getOccasionById(occasionId);
  if (!occasion) {
    console.warn(`Occasion ${occasionId} not found, falling back to keyword search`);
    return searchProducts(occasionId, filters);
  }
  
  console.log(`📋 Found occasion data:`, occasion);

  const results: Product[] = [];
  
  // First, try to get recommended products for this occasion
  const recommendedProductIds = occasion.recommended_products.map(rec => rec.id);
  console.log(`🎯 Recommended product IDs:`, recommendedProductIds);
  
  const recommendedProducts = products.filter(product => 
    recommendedProductIds.includes(product.id)
  );
  console.log(`📦 Found ${recommendedProducts.length} recommended products:`, recommendedProducts.map(p => ({ id: p.id, name: p.product_name, price: p.price, category: p.category })));
  
  // Add recommended products first
  for (const product of recommendedProducts) {
    // Apply filters
    if (filters.min_price && product.price && product.price < filters.min_price) {
      console.log(`❌ Product ${product.id} filtered out: price ${product.price} < min ${filters.min_price}`);
      continue;
    }
    if (filters.max_price && product.price && product.price > filters.max_price) {
      console.log(`❌ Product ${product.id} filtered out: price ${product.price} > max ${filters.max_price}`);
      continue;
    }
    if (filters.category && product.category && !product.category.toLowerCase().includes(filters.category.toLowerCase())) {
      console.log(`❌ Product ${product.id} filtered out: category ${product.category} doesn't match ${filters.category}`);
      continue;
    }
    
    console.log(`✅ Product ${product.id} passed filters:`, { name: product.product_name, price: product.price, category: product.category });
    results.push(product);
  }
  
  // If we don't have enough results, search by occasion keywords
  if (results.length < (filters.top_k || 5)) {
    const keywordResults = searchProducts(occasion.keywords.join(' '), {
      ...filters,
      top_k: (filters.top_k || 5) - results.length
    });
    
    // Add keyword results that aren't already in recommended products
    for (const product of keywordResults) {
      if (!results.find(r => r.id === product.id)) {
        results.push(product);
      }
    }
  }
  
  // If still no results, try broader search with occasion categories and vibes
  if (results.length === 0) {
    console.log(`No results found for occasion ${occasionId}, trying broader search`);
    
    // Search by occasion categories
    for (const category of occasion.categories) {
      if (filters.category && !category.toLowerCase().includes(filters.category.toLowerCase())) {
        continue;
      }
      
      const categoryResults = products.filter(product => {
        // Check category match
        if (!product.category || !product.category.toLowerCase().includes(category.toLowerCase())) {
          return false;
        }
        
        // Apply price filters
        if (filters.min_price && product.price && product.price < filters.min_price) return false;
        if (filters.max_price && product.price && product.price > filters.max_price) return false;
        
        return true;
      });
      
      results.push(...categoryResults);
    }
    
    // If still no results, try vibe-based search
    if (results.length === 0) {
      for (const vibe of occasion.vibes) {
        const vibeResults = products.filter(product => {
          // Check vibe match
          const hasVibe = product.vibes && product.vibes.some(v => v.toLowerCase().includes(vibe.toLowerCase()));
          if (!hasVibe) return false;
          
          // Apply category filter if specified
          if (filters.category && product.category && !product.category.toLowerCase().includes(filters.category.toLowerCase())) {
            return false;
          }
          
          // Apply price filters
          if (filters.min_price && product.price && product.price < filters.min_price) return false;
          if (filters.max_price && product.price && product.price > filters.max_price) return false;
          
          return true;
        });
        
        results.push(...vibeResults);
      }
    }
  }
  
  // Remove duplicates and limit results
  const uniqueResults = results.filter((product, index, self) => 
    index === self.findIndex(p => p.id === product.id)
  );
  
  console.log(`🎉 Final results: ${uniqueResults.length} products`);
  return uniqueResults.slice(0, filters.top_k || 5);
};

// Get categories
const getCategories = (): string[] => {
  const categories = new Set<string>();
  products.forEach(product => {
    if (product.category) {
      categories.add(product.category);
    }
  });
  return Array.from(categories).sort();
};

// Get collections
const getCollections = (): string[] => {
  const collections = new Set<string>();
  products.forEach(product => {
    if (product.collection) {
      collections.add(product.collection);
    }
  });
  return Array.from(collections).sort();
};

// Get vibe statistics
const getVibeStatistics = (): VibeStats[] => {
  const vibeCounts: Record<string, number> = {};
  const totalProducts = products.length;
  
  products.forEach(product => {
    product.vibes.forEach(vibe => {
      vibeCounts[vibe] = (vibeCounts[vibe] || 0) + 1;
    });
  });
  
  return Object.entries(vibeCounts)
    .map(([vibe, count]) => ({
      vibe,
      count,
      percentage: totalProducts > 0 ? (count / totalProducts) * 100 : 0
    }))
    .sort((a, b) => b.count - a.count);
};

// Get price range statistics
const getPriceRange = () => {
  const prices = products
    .map(p => p.price)
    .filter((price): price is number => price !== undefined);
  
  if (prices.length === 0) {
    return { min: 0, max: 0, avg: 0, count: 0 };
  }
  
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    avg: prices.reduce((sum, price) => sum + price, 0) / prices.length,
    count: prices.length
  };
};

// Get search suggestions
const getSearchSuggestions = (query: string): string[] => {
  if (query.length < 2) return [];
  
  const suggestions = new Set<string>();
  const queryLower = query.toLowerCase();
  
  products.forEach(product => {
    // Product name suggestions
    if (product.product_name.toLowerCase().includes(queryLower)) {
      suggestions.add(product.product_name);
    }
    
    // Category suggestions
    if (product.category && product.category.toLowerCase().includes(queryLower)) {
      suggestions.add(product.category);
    }
    
    // Collection suggestions
    if (product.collection && product.collection.toLowerCase().includes(queryLower)) {
      suggestions.add(product.collection);
    }
  });
  
  return Array.from(suggestions).slice(0, 10);
};

// Get product by ID
const getProductById = (id: number): Product | null => {
  return products.find(p => p.id === id) || null;
};

// Initialize data
export const initializeData = async (): Promise<void> => {
  await loadProducts();
  await loadOccasionData();
  
  // Classify vibes for products that don't have them
  products.forEach(product => {
    if (!product.vibes || product.vibes.length === 0) {
      product.vibes = classifyVibe(product.product_name, product.collection);
      product.primary_vibe = getPrimaryVibe(product.product_name, product.collection);
    }
  });
};

// Export API functions
export const api = {
  search: searchProducts,
  searchByCelebrity,
  searchByVibe,
  searchByOccasion,
  getCategories,
  getCollections,
  getVibes: getAllVibes,
  getCelebrities: () => celebrities.map(c => c.celebrity_name),
  getVibeStatistics,
  getPriceRange,
  getSearchSuggestions,
  getProductById,
  initializeData
};
