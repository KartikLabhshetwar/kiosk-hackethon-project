/**
 * Search Routes
 * Handles all search-related endpoints
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { RecommenderService } from '../services/recommender.service';
import { CelebrityService } from '../services/celebrity.service';
import { VibeService } from '../services/vibe.service';
import { 
  Product, 
  CelebrityStyleData 
} from '../models/types';

const router = Router();

// Validation schemas
const SearchRequestSchema = z.object({
  query: z.string().min(1, 'Query cannot be empty'),
  min_price: z.number().optional(),
  max_price: z.number().optional(),
  category: z.string().optional(),
  vibe: z.string().optional(),
  top_k: z.number().min(1).max(50).default(5)
});

const CelebrityRequestSchema = z.object({
  celebrity_name: z.string().min(1, 'Celebrity name cannot be empty'),
  min_price: z.number().optional(),
  max_price: z.number().optional(),
  top_k: z.number().min(1).max(50).default(5)
});

const VibeRequestSchema = z.object({
  vibe: z.string().min(1, 'Vibe cannot be empty'),
  min_price: z.number().optional(),
  max_price: z.number().optional(),
  category: z.string().optional(),
  top_k: z.number().min(1).max(50).default(5)
});

// Initialize services (will be injected)
let recommenderService: RecommenderService;
let celebrityService: CelebrityService;

export const initializeSearchRoutes = (
  recommender: RecommenderService,
  celebrity: CelebrityService,
  _vibe: VibeService
) => {
  recommenderService = recommender;
  celebrityService = celebrity;
};

/**
 * POST /search - General product search with filters
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    // Check if services are initialized
    if (!recommenderService) {
      res.status(503).json({
        error: 'Service not ready',
        message: 'Recommender service is not initialized yet'
      });
      return;
    }

    // Validate request body
    const validatedData = SearchRequestSchema.parse(req.body);
    
    // Perform search
    const searchResults = await recommenderService.search(
      validatedData.query,
      validatedData.min_price,
      validatedData.max_price,
      validatedData.category,
      validatedData.top_k
    );

    // Filter by vibe if specified
    let filteredResults = searchResults;
    if (validatedData.vibe) {
      filteredResults = searchResults.filter(result => 
        result.product.vibes.some(vibe => 
          vibe.toLowerCase() === validatedData.vibe!.toLowerCase()
        )
      );
    }

    // Convert to response format
    const products: Product[] = filteredResults.map((result, index) => ({
      id: result.product.id,
      product_name: result.product.product_name,
      collection: result.product.collection,
      category: result.product.category,
      price: result.product.price,
      images: result.product.images,
      description: result.product.description,
      product_url: result.product.product_url,
      vibes: result.product.vibes,
      primary_vibe: result.product.primary_vibe,
      similarity_score: result.similarity_score,
      rank: index + 1
    }));

    res.json(products);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
      return;
    }

    console.error('Search error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    res.status(500).json({
      error: 'Search failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: process.env['NODE_ENV'] === 'development' ? (error instanceof Error ? error.stack : 'No stack trace') : undefined
    });
  }
});

/**
 * POST /search/celebrity - Celebrity-inspired search
 */
router.post('/celebrity', async (req: Request, res: Response) => {
  try {
    // Check if services are initialized
    if (!recommenderService || !celebrityService) {
      res.status(503).json({
        error: 'Service not ready',
        message: 'Services are not initialized yet'
      });
      return;
    }

    // Validate request body
    const validatedData = CelebrityRequestSchema.parse(req.body);
    
    // Get celebrity style data
    const celebrityData = celebrityService.getCelebrityRecommendations(validatedData.celebrity_name);
    if (!celebrityData) {
      res.status(404).json({
        error: 'Celebrity not found',
        message: `Celebrity '${validatedData.celebrity_name}' not found`
      });
      return;
    }

    // Search for products
    const searchResults = await recommenderService.searchByCelebrity(
      validatedData.celebrity_name,
      validatedData.min_price,
      validatedData.max_price,
      validatedData.top_k
    );

    // Convert to response format
    const products: Product[] = searchResults.map((result, index) => ({
      id: result.product.id,
      product_name: result.product.product_name,
      collection: result.product.collection,
      category: result.product.category,
      price: result.product.price,
      images: result.product.images,
      description: result.product.description,
      product_url: result.product.product_url,
      vibes: result.product.vibes,
      primary_vibe: result.product.primary_vibe,
      similarity_score: result.similarity_score,
      rank: index + 1
    }));

    const response: CelebrityStyleData = {
      celebrity_name: validatedData.celebrity_name,
      style_description: celebrityData.style_description,
      vibes: celebrityData.vibes,
      occasions: celebrityData.occasions,
      keywords: celebrityData.keywords,
      price_range: celebrityData.price_range,
      preferred_categories: celebrityData.preferred_categories,
      products: products
    };

    res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
      return;
    }

    console.error('Celebrity search error:', error);
    res.status(500).json({
      error: 'Celebrity search failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /search/vibe - Vibe-based search
 */
router.post('/vibe', async (req: Request, res: Response) => {
  try {
    // Check if services are initialized
    if (!recommenderService) {
      res.status(503).json({
        error: 'Service not ready',
        message: 'Recommender service is not initialized yet'
      });
      return;
    }

    // Validate request body
    const validatedData = VibeRequestSchema.parse(req.body);
    
    // Search for products by vibe
    const searchResults = await recommenderService.searchByVibe(
      validatedData.vibe,
      validatedData.min_price,
      validatedData.max_price,
      validatedData.category,
      validatedData.top_k
    );

    // Convert to response format
    const products: Product[] = searchResults.map((result, index) => ({
      id: result.product.id,
      product_name: result.product.product_name,
      collection: result.product.collection,
      category: result.product.category,
      price: result.product.price,
      images: result.product.images,
      description: result.product.description,
      product_url: result.product.product_url,
      vibes: result.product.vibes,
      primary_vibe: result.product.primary_vibe,
      similarity_score: result.similarity_score,
      rank: index + 1
    }));

    res.json(products);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
      return;
    }

    console.error('Vibe search error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    res.status(500).json({
      error: 'Vibe search failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: process.env['NODE_ENV'] === 'development' ? (error instanceof Error ? error.stack : 'No stack trace') : undefined
    });
  }
});

/**
 * GET /search/suggestions - Search autocomplete
 */
router.get('/suggestions', async (req: Request, res: Response) => {
  try {
    const query = req.query['q'] as string;
    
    if (!query || query.length < 2) {
      res.status(400).json({
        error: 'Query too short',
        message: 'Query must be at least 2 characters long'
      });
      return;
    }

    // Get search suggestions
    const suggestions = recommenderService.getSearchSuggestions(query);
    
    res.json(suggestions);
  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({
      error: 'Failed to get suggestions',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
