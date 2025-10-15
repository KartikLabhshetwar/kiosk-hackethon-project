// Client-side product data
import { Product } from '../types/api';

// This will be populated from the backend data
export const products: Product[] = [];
let isLoaded = false;
let loadPromise: Promise<Product[]> | null = null;

// Load products from the public JSON file
export const loadProducts = async (): Promise<Product[]> => {
  if (isLoaded) {
    return products;
  }
  
  if (loadPromise) {
    return loadPromise;
  }
  
  loadPromise = (async () => {
    try {
      const response = await fetch('/products.json');
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      const data = await response.json();
      products.length = 0;
      products.push(...data);
      isLoaded = true;
      console.log(`✅ Loaded ${products.length} products`);
      return products;
    } catch (error) {
      console.error('Failed to load products:', error);
      isLoaded = false;
      loadPromise = null;
      return [];
    }
  })();
  
  return loadPromise;
};

// Reset loading state (for testing)
export const resetProducts = () => {
  isLoaded = false;
  loadPromise = null;
  products.length = 0;
};
