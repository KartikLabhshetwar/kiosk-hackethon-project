/**
 * Recommender Service
 * Core recommendation engine with TensorFlow.js vector search + filtering
 * Ported from Python recommender.py with TensorFlow.js implementation
 */

import * as tf from '@tensorflow/tfjs-node';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import * as fs from 'fs';
import * as path from 'path';
import { 
  ProductMetadata, 
  SearchResult
} from '../models/types';
import { CelebrityService as CelebrityServiceClass } from './celebrity.service';
import { VibeService as VibeServiceClass } from './vibe.service';

export class RecommenderService {
  private metadata: ProductMetadata[] = [];
  private embeddings: number[][] = [];
  private model: use.UniversalSentenceEncoder | null = null;
  private celebrityService: CelebrityServiceClass;
  private vibeService: VibeServiceClass;
  private isInitialized = false;

  constructor(
    private dataPath: string,
    celebrityService?: CelebrityServiceClass,
    vibeService?: VibeServiceClass
  ) {
    this.celebrityService = celebrityService || new CelebrityServiceClass();
    this.vibeService = vibeService || new VibeServiceClass();
  }

  /**
   * Initialize the recommender service
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    console.log('🔄 Initializing recommender service...');

    try {
      // Load metadata
      await this.loadMetadata();
      
      // Load embeddings (optional)
      try {
        await this.loadEmbeddings();
      } catch (error) {
        console.log('⚠️ Could not load embeddings, will use keyword-based search');
      }
      
      // Load TensorFlow.js model (optional)
      await this.loadModel();
      
      this.isInitialized = true;
      const searchType = this.model ? 'semantic search' : 'keyword-based search';
      console.log(`✅ Recommender service initialized with ${this.metadata.length} products using ${searchType}`);
    } catch (error) {
      console.error('❌ Failed to initialize recommender service:', error);
      throw error;
    }
  }

  /**
   * Load product metadata from JSON file
   */
  private async loadMetadata(): Promise<void> {
    const metadataPath = path.join(this.dataPath, 'metadata.json');
    
    if (!fs.existsSync(metadataPath)) {
      throw new Error(`Metadata file not found: ${metadataPath}`);
    }

    const data = fs.readFileSync(metadataPath, 'utf-8');
    this.metadata = JSON.parse(data);
    
    console.log(`📊 Loaded metadata for ${this.metadata.length} products`);
  }

  /**
   * Load embeddings from numpy file (converted to JSON)
   */
  private async loadEmbeddings(): Promise<void> {
    // Try to load from JSON first (converted from .npy)
    const embeddingsJsonPath = path.join(this.dataPath, 'embeddings.json');
    
    if (fs.existsSync(embeddingsJsonPath)) {
      const data = fs.readFileSync(embeddingsJsonPath, 'utf-8');
      this.embeddings = JSON.parse(data);
      console.log(`🔢 Loaded embeddings from JSON: ${this.embeddings.length} vectors`);
      return;
    }

    // Try to load from .npy file (requires conversion)
    const embeddingsNpyPath = path.join(this.dataPath, 'embeddings.npy');
    
    if (fs.existsSync(embeddingsNpyPath)) {
      console.log('⚠️ Found .npy file but JSON conversion needed. Will use TensorFlow.js for embeddings.');
      // We'll generate embeddings on-demand using TensorFlow.js
      this.embeddings = [];
      return;
    }

    console.log('⚠️ No embeddings file found, will use keyword-based search');
    this.embeddings = [];
  }

  /**
   * Load Universal Sentence Encoder model
   */
  private async loadModel(): Promise<void> {
    console.log('🤖 Loading Universal Sentence Encoder model...');
    
    try {
      // Initialize TensorFlow.js backend
      await tf.ready();
      console.log('✅ TensorFlow.js backend initialized');
      
      // Load the model
      this.model = await use.load();
      console.log('✅ Universal Sentence Encoder model loaded');
    } catch (error) {
      console.error('❌ Failed to load Universal Sentence Encoder model:', error);
      console.log('⚠️ Falling back to keyword-based search without embeddings');
      this.model = null;
    }
  }

  /**
   * Search for jewelry matching query and filters
   */
  public async search(
    query: string,
    minPrice?: number,
    maxPrice?: number,
    category?: string,
    topK: number = 5
  ): Promise<SearchResult[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!query.trim()) {
      throw new Error('Query cannot be empty');
    }

    // If model is not available, use keyword-based search
    if (!this.model) {
      return this.keywordBasedSearch(query, minPrice, maxPrice, category, topK);
    }

    // Generate query embedding
    const queryEmbedding = await this.generateEmbedding(query);
    
    // Calculate similarities
    const similarities = await this.calculateSimilarities(queryEmbedding);
    
    // Apply filters and get top results
    const results = this.applyFiltersAndRank(similarities, minPrice, maxPrice, category, topK);
    
    return results;
  }

  /**
   * Keyword-based search fallback when TensorFlow.js model is not available
   */
  private keywordBasedSearch(
    query: string,
    minPrice?: number,
    maxPrice?: number,
    category?: string,
    topK: number = 5
  ): SearchResult[] {
    const queryWords = query.toLowerCase().split(/\s+/);
    const results: SearchResult[] = [];
    let rank = 1;

    for (const product of this.metadata) {
      // Calculate keyword match score
      let score = 0;
      const searchText = `${product.product_name} ${product.description} ${product.category || ''} ${product.collection || ''}`.toLowerCase();

      // Count keyword matches
      for (const word of queryWords) {
        if (searchText.includes(word)) {
          score += 1;
        }
      }

      // Apply filters
      if (minPrice && product.price && product.price < minPrice) {
        continue;
      }

      if (maxPrice && product.price && product.price > maxPrice) {
        continue;
      }

      if (category && product.category && 
          !product.category.toLowerCase().includes(category.toLowerCase())) {
        continue;
      }

      // Only include products with some keyword matches
      if (score > 0) {
        const productWithScore: ProductMetadata = {
          ...product,
          similarity_score: score / queryWords.length, // Normalize by query length
          rank: rank++
        };
        
        results.push({
          product: productWithScore,
          similarity_score: score / queryWords.length,
          rank: rank - 1
        });

        if (results.length >= topK) {
          break;
        }
      }
    }

    // Sort by score (highest first)
    return results.sort((a, b) => b.similarity_score - a.similarity_score);
  }

  /**
   * Generate embedding for a text query
   */
  private async generateEmbedding(text: string): Promise<number[]> {
    if (!this.model) {
      throw new Error('Model not loaded');
    }

    const embedding = await this.model.embed([text]);
    const embeddingArray = await embedding.data();
    const embeddingVector = Array.from(embeddingArray);
    
    // Normalize for cosine similarity
    const norm = Math.sqrt(embeddingVector.reduce((sum, val) => sum + val * val, 0));
    return embeddingVector.map(val => val / norm);
  }

  /**
   * Calculate similarities between query and all products
   */
  private async calculateSimilarities(queryEmbedding: number[]): Promise<Array<{ index: number; similarity: number }>> {
    const similarities: Array<{ index: number; similarity: number }> = [];

    // If we have pre-computed embeddings, use them
    if (this.embeddings.length > 0) {
        for (let i = 0; i < this.embeddings.length; i++) {
          const embedding = this.embeddings[i];
          if (embedding) {
            const similarity = this.cosineSimilarity(queryEmbedding, embedding);
            similarities.push({ index: i, similarity });
          }
        }
    } else {
      // Generate embeddings on-demand
      if (!this.model) {
        throw new Error('Model not loaded');
      }

      const descriptions = this.metadata.map(item => item.description);
      const embeddings = await this.model.embed(descriptions);
      const embeddingsArray = await embeddings.data();
      
      for (let i = 0; i < this.metadata.length; i++) {
        const productEmbedding = Array.from(embeddingsArray.slice(i * 512, (i + 1) * 512));
        if (productEmbedding.length > 0) {
          const similarity = this.cosineSimilarity(queryEmbedding, productEmbedding);
          similarities.push({ index: i, similarity });
        }
      }
    }

    // Sort by similarity (highest first)
    return similarities.sort((a, b) => b.similarity - a.similarity);
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      const aVal = a[i] || 0;
      const bVal = b[i] || 0;
      dotProduct += aVal * bVal;
      normA += aVal * aVal;
      normB += bVal * bVal;
    }

    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    return magnitude === 0 ? 0 : dotProduct / magnitude;
  }

  /**
   * Apply filters and rank results
   */
  private applyFiltersAndRank(
    similarities: Array<{ index: number; similarity: number }>,
    minPrice?: number,
    maxPrice?: number,
    category?: string,
    topK: number = 5
  ): SearchResult[] {
    const results: SearchResult[] = [];
    let rank = 1;

    for (const { index, similarity } of similarities) {
      if (results.length >= topK) {
        break;
      }

      const product = this.metadata[index];
      if (!product) {
        continue;
      }

      // Apply filters
      if (minPrice && product.price && product.price < minPrice) {
        continue;
      }

      if (maxPrice && product.price && product.price > maxPrice) {
        continue;
      }

      if (category && product.category && 
          !product.category.toLowerCase().includes(category.toLowerCase())) {
        continue;
      }

      // Add to results
      const productWithScore: ProductMetadata = {
        ...product,
        similarity_score: similarity,
        rank: rank++
      };
      
      results.push({
        product: productWithScore,
        similarity_score: similarity,
        rank: rank - 1
      });
    }

    return results;
  }

  /**
   * Search for jewelry inspired by a celebrity's style
   */
  public async searchByCelebrity(
    celebrityName: string,
    minPrice?: number,
    maxPrice?: number,
    topK: number = 5
  ): Promise<SearchResult[]> {
    const celebrityData = this.celebrityService.getCelebrityRecommendations(celebrityName);
    
    if (!celebrityData) {
      return [];
    }

    // Use celebrity's preferred query
    const query = celebrityData.query || '';
    
    // Search with celebrity's price preferences
    const results = await this.search(
      query,
      minPrice || celebrityData.price_range.min,
      maxPrice || celebrityData.price_range.max,
      undefined,
      topK
    );

    // Add celebrity context to results
    return results.map(result => ({
      ...result,
      product: {
        ...result.product,
        celebrity_inspiration: {
          celebrity: celebrityName,
          style_description: celebrityData.style_description,
          vibes: celebrityData.vibes,
          occasions: celebrityData.occasions
        }
      }
    }));
  }

  /**
   * Search for jewelry by vibe
   */
  public async searchByVibe(
    vibe: string,
    minPrice?: number,
    maxPrice?: number,
    category?: string,
    topK: number = 5
  ): Promise<SearchResult[]> {
    // Search with vibe as query
    const results = await this.search(vibe, minPrice, maxPrice, category, topK * 2);
    
    // Filter by exact vibe match
    const vibeResults = results.filter(result => {
      const productVibes = result.product.vibes || [];
      return productVibes.some(v => v.toLowerCase() === vibe.toLowerCase());
    });

    return vibeResults.slice(0, topK);
  }

  /**
   * Get specific product by ID
   */
  public getProductById(productId: number): ProductMetadata | null {
    return this.metadata.find(item => item.id === productId) || null;
  }

  /**
   * Get products similar to a specific product
   */
  public async getSimilarProducts(productId: number, topK: number = 5): Promise<SearchResult[]> {
    const referenceProduct = this.getProductById(productId);
    
    if (!referenceProduct) {
      return [];
    }

    // Use the product's description as query
    const results = await this.search(referenceProduct.description, undefined, undefined, undefined, topK + 1);
    
    // Remove the reference product from results
    return results.filter(result => result.product.id !== productId).slice(0, topK);
  }

  /**
   * Get unique categories from metadata
   */
  public getCategories(): string[] {
    const categories = new Set<string>();
    
    for (const item of this.metadata) {
      if (item.category) {
        categories.add(item.category);
      }
    }
    
    return Array.from(categories).sort();
  }

  /**
   * Get unique collections from metadata
   */
  public getCollections(): string[] {
    const collections = new Set<string>();
    
    for (const item of this.metadata) {
      if (item.collection) {
        collections.add(item.collection);
      }
    }
    
    return Array.from(collections).sort();
  }

  /**
   * Get vibe distribution statistics
   */
  public getVibeStatistics(): { [vibe: string]: number } {
    return this.vibeService.getVibeStatistics(this.metadata);
  }

  /**
   * Get price range statistics
   */
  public getPriceRangeStats(): { min: number; max: number; avg: number; count: number } {
    const prices = this.metadata
      .map(item => item.price)
      .filter(price => price !== undefined && price !== null) as number[];

    if (prices.length === 0) {
      return { min: 0, max: 0, avg: 0, count: 0 };
    }

    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      avg: prices.reduce((sum, price) => sum + price, 0) / prices.length,
      count: prices.length
    };
  }

  /**
   * Get search suggestions based on query
   */
  public getSearchSuggestions(query: string): string[] {
    if (query.length < 2) {
      return [];
    }

    const suggestions = new Set<string>();
    const queryLower = query.toLowerCase();

    for (const item of this.metadata) {
      // Product name suggestions
      if (item.product_name.toLowerCase().includes(queryLower)) {
        suggestions.add(item.product_name);
      }

      // Category suggestions
      if (item.category && item.category.toLowerCase().includes(queryLower)) {
        suggestions.add(item.category);
      }

      // Collection suggestions
      if (item.collection && item.collection.toLowerCase().includes(queryLower)) {
        suggestions.add(item.collection);
      }
    }

    return Array.from(suggestions).slice(0, 10);
  }

  /**
   * Parse budget text into min/max values
   */
  public parseBudget(budgetText: string): [number | undefined, number | undefined] {
    if (!budgetText) {
      return [undefined, undefined];
    }

    // Extract numbers (handles formats like "20k-30k", "under 50k", "25000")
    const numbers = budgetText.toLowerCase().match(/(\d+)k?/g);
    
    if (!numbers) {
      return [undefined, undefined];
    }

    // Convert to numbers (multiply by 1000 if 'k' present)
    const values = numbers.map(n => {
      const num = parseInt(n.replace('k', ''));
      return n.includes('k') ? num * 1000 : num;
    });

    if (values.length === 1) {
      // Single value: treat as max budget
      return [undefined, values[0]];
    } else {
      // Range: min and max
      return [Math.min(...values), Math.max(...values)];
    }
  }

  /**
   * Get all metadata (for debugging/testing)
   */
  public getAllMetadata(): ProductMetadata[] {
    return [...this.metadata];
  }

  /**
   * Check if service is initialized
   */
  public isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Get service statistics
   */
  public getStats(): { 
    productsLoaded: number; 
    embeddingsLoaded: number; 
    modelLoaded: boolean; 
  } {
    return {
      productsLoaded: this.metadata.length,
      embeddingsLoaded: this.embeddings.length,
      modelLoaded: this.model !== null
    };
  }
}
