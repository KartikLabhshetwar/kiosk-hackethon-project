// Client-side occasion data
export interface OccasionData {
  id: string;
  name: string;
  image: string;
  description: string;
  keywords: string[];
  categories: string[];
  vibes: string[];
  price_range: {
    min: number;
    max: number;
  };
  collections: string[];
  recommended_products: {
    id: number;
    reason: string;
  }[];
}

export interface OccasionMapping {
  occasions: Record<string, OccasionData>;
  metadata: {
    version: string;
    last_updated: string;
    total_occasions: number;
    total_recommendations: number;
  };
}

// This will be populated from the public JSON file
export const occasionData: OccasionMapping = {
  occasions: {},
  metadata: {
    version: "1.0",
    last_updated: "2024-01-01",
    total_occasions: 0,
    total_recommendations: 0
  }
};

let isLoaded = false;
let loadPromise: Promise<OccasionMapping> | null = null;

// Load occasion data from the public JSON file
export const loadOccasionData = async (): Promise<OccasionMapping> => {
  if (isLoaded) {
    return occasionData;
  }
  
  if (loadPromise) {
    return loadPromise;
  }
  
  loadPromise = (async () => {
    try {
      const response = await fetch('/occasion-data.json');
      if (!response.ok) {
        throw new Error(`Failed to fetch occasion data: ${response.status}`);
      }
      const data = await response.json();
      Object.assign(occasionData, data);
      isLoaded = true;
      console.log(`✅ Loaded occasion data for ${Object.keys(occasionData.occasions).length} occasions`);
      return occasionData;
    } catch (error) {
      console.error('Failed to load occasion data:', error);
      isLoaded = false;
      loadPromise = null;
      return occasionData;
    }
  })();
  
  return loadPromise;
};

// Get occasion data by ID
export const getOccasionById = (id: string): OccasionData | null => {
  return occasionData.occasions[id] || null;
};

// Get all occasions
export const getAllOccasions = (): OccasionData[] => {
  return Object.values(occasionData.occasions);
};

// Get recommended products for an occasion
export const getOccasionRecommendations = (occasionId: string): { id: number; reason: string }[] => {
  const occasion = getOccasionById(occasionId);
  return occasion?.recommended_products || [];
};

// Reset loading state (for testing)
export const resetOccasionData = () => {
  isLoaded = false;
  loadPromise = null;
  occasionData.occasions = {};
  occasionData.metadata = {
    version: "1.0",
    last_updated: "2024-01-01",
    total_occasions: 0,
    total_recommendations: 0
  };
};
