/**
 * Client-Side Search Engine
 * Simple but effective search without complex embedding APIs
 */

import { Product } from '../types/api';

// Celebrity data matching backend
const CELEBRITY_DATA = {
  "deepika_padukone": {
    vibes: ["elegant", "royal", "traditional", "sophisticated"],
    occasions: ["wedding", "red carpet", "festive", "formal"],
    keywords: ["gold", "statement", "necklace", "jewelry", "heritage", "maharani"],
    price_range: { min: 100000, max: 1000000 },
    preferred_categories: ["necklace", "earrings", "bracelet"],
    style_description: "Royal elegance with traditional Indian influences"
  },
  "priyanka_chopra": {
    vibes: ["modern", "bold", "glamorous", "contemporary"],
    occasions: ["party", "red carpet", "awards", "fashion event"],
    keywords: ["diamond", "contemporary", "earrings", "statement", "bold"],
    price_range: { min: 50000, max: 500000 },
    preferred_categories: ["earrings", "ring", "bracelet"],
    style_description: "Bold and glamorous with modern edge"
  },
  "alia_bhatt": {
    vibes: ["minimalist", "young", "contemporary", "delicate"],
    occasions: ["daily wear", "casual", "brunch", "work"],
    keywords: ["delicate", "simple", "gold", "minimal", "dainty"],
    price_range: { min: 10000, max: 100000 },
    preferred_categories: ["earrings", "pendant", "ring"],
    style_description: "Minimalist and contemporary with youthful charm"
  },
  "sonam_kapoor": {
    vibes: ["trendy", "experimental", "fashion-forward", "artistic"],
    occasions: ["party", "fashion event", "art gallery", "premiere"],
    keywords: ["statement", "unique", "bold", "artistic", "experimental"],
    price_range: { min: 25000, max: 300000 },
    preferred_categories: ["earrings", "necklace", "bracelet"],
    style_description: "Fashion-forward with experimental and artistic flair"
  },
  "kareena_kapoor": {
    vibes: ["classic", "elegant", "timeless", "sophisticated"],
    occasions: ["wedding", "festive", "family function", "formal"],
    keywords: ["traditional", "gold", "heritage", "classic", "elegant"],
    price_range: { min: 50000, max: 400000 },
    preferred_categories: ["necklace", "earrings", "bangle"],
    style_description: "Classic elegance with timeless appeal"
  },
  "anushka_sharma": {
    vibes: ["elegant", "modern", "sophisticated", "refined"],
    occasions: ["wedding", "party", "formal", "anniversary"],
    keywords: ["diamond", "contemporary", "refined", "elegant", "sophisticated"],
    price_range: { min: 75000, max: 600000 },
    preferred_categories: ["necklace", "earrings", "ring"],
    style_description: "Sophisticated elegance with modern refinement"
  },
  "katrina_kaif": {
    vibes: ["glamorous", "bold", "contemporary", "striking"],
    occasions: ["party", "red carpet", "awards", "premiere"],
    keywords: ["diamond", "bold", "glamorous", "striking", "contemporary"],
    price_range: { min: 100000, max: 800000 },
    preferred_categories: ["earrings", "necklace", "bracelet"],
    style_description: "Glamorous and bold with striking contemporary appeal"
  },
  "kangana_ranaut": {
    vibes: ["bohemian", "artistic", "unique", "free-spirited"],
    occasions: ["art event", "casual", "festival", "creative gathering"],
    keywords: ["bohemian", "artistic", "unique", "handcrafted", "ethnic"],
    price_range: { min: 15000, max: 200000 },
    preferred_categories: ["earrings", "pendant", "bracelet"],
    style_description: "Bohemian and artistic with unique free-spirited charm"
  }
};

// Vibe keywords for matching
const VIBE_KEYWORDS: Record<string, string[]> = {
  royal: ["royal", "regal", "majestic", "crown", "heritage", "traditional"],
  traditional: ["traditional", "heritage", "ethnic", "cultural", "classic"],
  modern: ["modern", "contemporary", "sleek", "minimalist", "trendy"],
  elegant: ["elegant", "sophisticated", "refined", "graceful", "delicate"],
  bohemian: ["bohemian", "boho", "artistic", "free", "unique"],
  vintage: ["vintage", "antique", "retro", "old", "classic"],
  glamorous: ["glamorous", "sparkle", "dazzling", "luxurious", "shiny"],
  minimalist: ["minimal", "simple", "clean", "sleek", "understated"],
  statement: ["statement", "bold", "dramatic", "oversized", "striking"],
  festive: ["festive", "celebration", "party", "bright", "colorful"],
  romantic: ["romantic", "delicate", "feminine", "soft", "lovely"],
  professional: ["professional", "work", "office", "formal", "business"],
  casual: ["casual", "everyday", "simple", "comfortable", "daily"],
  luxury: ["luxury", "premium", "exclusive", "high-end", "expensive"],
  artistic: ["artistic", "creative", "unique", "handcrafted", "special"]
};

/**
 * Calculate similarity score between query and product
 */
function calculateSimilarity(query: string, product: Product): number {
  const queryLower = query.toLowerCase();
  const searchText = `${product.product_name} ${product.collection || ''} ${product.category || ''} ${product.description}`.toLowerCase();
  
  let score = 0;
  const queryWords = queryLower.split(' ').filter(w => w.length > 2);
  
  // Exact match in product name (highest weight)
  if (product.product_name.toLowerCase().includes(queryLower)) {
    score += 10;
  }
  
  // Word matches
  queryWords.forEach(word => {
    if (searchText.includes(word)) {
      score += 2;
    }
    // Category match
    if (product.category?.toLowerCase().includes(word)) {
      score += 3;
    }
    // Collection match
    if (product.collection?.toLowerCase().includes(word)) {
      score += 2;
    }
  });
  
  return score;
}

/**
 * Search products by query
 */
export async function searchProducts(params: {
  query: string;
  min_price?: number;
  max_price?: number;
  category?: string;
  vibe?: string;
  top_k?: number;
}): Promise<Product[]> {
  // Load products
  const response = await fetch('/products.json');
  const products: Product[] = await response.json();
  
  let filteredProducts = [...products];
  
  // Apply filters
  if (params.min_price) {
    filteredProducts = filteredProducts.filter(p => (p.price || 0) >= params.min_price!);
  }
  if (params.max_price) {
    filteredProducts = filteredProducts.filter(p => (p.price || 0) <= params.max_price!);
  }
  if (params.category) {
    filteredProducts = filteredProducts.filter(p => 
      p.category?.toLowerCase().includes(params.category!.toLowerCase())
    );
  }
  
  // Calculate similarity scores
  const scored = filteredProducts.map(product => ({
    ...product,
    similarity_score: calculateSimilarity(params.query, product) / 10,
  }));
  
  // Sort by score
  scored.sort((a, b) => b.similarity_score - a.similarity_score);
  
  // Add rank
  const ranked = scored.slice(0, params.top_k || 10).map((product, index) => ({
    ...product,
    rank: index + 1,
  }));
  
  return ranked;
}

/**
 * Search by celebrity
 */
export async function searchByCelebrity(params: {
  celebrity_name: string;
  min_price?: number;
  max_price?: number;
  top_k?: number;
}) {
  const celebData = CELEBRITY_DATA[params.celebrity_name as keyof typeof CELEBRITY_DATA];
  
  if (!celebData) {
    throw new Error(`Celebrity '${params.celebrity_name}' not found`);
  }
  
  // Build query from celebrity keywords
  const query = celebData.keywords.slice(0, 3).join(' ');
  
  const products = await searchProducts({
    query,
    min_price: params.min_price || celebData.price_range.min,
    max_price: params.max_price || celebData.price_range.max,
    top_k: params.top_k || 6,
  });
  
  return {
    celebrity_name: params.celebrity_name,
    style_description: celebData.style_description,
    vibes: celebData.vibes,
    occasions: celebData.occasions,
    keywords: celebData.keywords,
    price_range: celebData.price_range,
    preferred_categories: celebData.preferred_categories,
    products,
  };
}

/**
 * Search by vibe
 */
export async function searchByVibe(params: {
  vibe: string;
  min_price?: number;
  max_price?: number;
  category?: string;
  top_k?: number;
}): Promise<Product[]> {
  const vibeKeywords = VIBE_KEYWORDS[params.vibe.toLowerCase()] || [params.vibe];
  const query = vibeKeywords.join(' ');
  
  return searchProducts({
    query,
    min_price: params.min_price,
    max_price: params.max_price,
    category: params.category,
    top_k: params.top_k || 10,
  });
}

/**
 * Get all celebrities
 */
export function getCelebrities(): string[] {
  return Object.keys(CELEBRITY_DATA);
}

/**
 * Get all vibes
 */
export function getVibes(): string[] {
  return Object.keys(VIBE_KEYWORDS);
}

/**
 * Get categories from products
 */
export async function getCategories(): Promise<string[]> {
  const response = await fetch('/products.json');
  const products: Product[] = await response.json();
  
  const categories = new Set<string>();
  products.forEach(p => {
    if (p.category) categories.add(p.category);
  });
  
  return Array.from(categories).sort();
}

/**
 * Get product by ID
 */
export async function getProductById(id: number): Promise<Product | null> {
  const response = await fetch('/products.json');
  const products: Product[] = await response.json();
  
  return products.find(p => p.id === id) || null;
}

