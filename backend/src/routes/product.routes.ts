/**
 * Product Routes
 * Handles product-specific endpoints
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { RecommenderService } from '../services/recommender.service';
import { Product } from '../models/types';

const router = Router();

// Initialize services (will be injected)
let recommenderService: RecommenderService;

export const initializeProductRoutes = (recommender: RecommenderService) => {
  recommenderService = recommender;
};

// Validation schema for product ID
const ProductIdSchema = z.object({
  id: z.string().transform((val) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      throw new Error('Product ID must be a valid number');
    }
    return num;
  })
});

/**
 * GET /product/:id - Get specific product by ID
 */
router.get('/product/:id', async (req: Request, res: Response) => {
  try {
    // Validate product ID
    const { id } = ProductIdSchema.parse({ id: req.params['id'] });
    
    // Get product by ID
    const product = recommenderService.getProductById(id);
    
    if (!product) {
      res.status(404).json({
        error: 'Product not found',
        message: `Product with ID ${id} not found`
      });
      return;
    }

    // Convert to response format
    const response: Product = {
      id: product.id,
      product_name: product.product_name,
      collection: product.collection,
      category: product.category,
      price: product.price,
      images: product.images,
      description: product.description,
      product_url: product.product_url,
      vibes: product.vibes,
      primary_vibe: product.primary_vibe
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

    console.error('Failed to get product:', error);
    res.status(500).json({
      error: 'Failed to get product',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
