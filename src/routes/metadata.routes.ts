/**
 * Metadata Routes
 * Handles all metadata-related endpoints (celebrities, vibes, categories, collections)
 */

import { Router, Request, Response } from 'express';
import { RecommenderService } from '../services/recommender.service';
import { CelebrityService } from '../services/celebrity.service';
import { VibeService } from '../services/vibe.service';

const router = Router();

// Initialize services (will be injected)
let recommenderService: RecommenderService;
let celebrityService: CelebrityService;
let vibeService: VibeService;

export const initializeMetadataRoutes = (
  recommender: RecommenderService,
  celebrity: CelebrityService,
  vibe: VibeService
) => {
  recommenderService = recommender;
  celebrityService = celebrity;
  vibeService = vibe;
};

/**
 * GET /celebrities - Get list of all celebrities
 */
router.get('/celebrities', async (_req: Request, res: Response) => {
  try {
    const celebrities = celebrityService.listCelebrities();
    res.json(celebrities);
  } catch (error) {
    console.error('Failed to get celebrities:', error);
    res.status(500).json({
      error: 'Failed to get celebrities',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /vibes - Get list of all vibes
 */
router.get('/vibes', async (_req: Request, res: Response) => {
  try {
    const vibes = vibeService.getAllVibes();
    res.json(vibes);
  } catch (error) {
    console.error('Failed to get vibes:', error);
    res.status(500).json({
      error: 'Failed to get vibes',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /categories - Get list of all categories
 */
router.get('/categories', async (_req: Request, res: Response) => {
  try {
    const categories = recommenderService.getCategories();
    res.json(categories);
  } catch (error) {
    console.error('Failed to get categories:', error);
    res.status(500).json({
      error: 'Failed to get categories',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /collections - Get list of all collections
 */
router.get('/collections', async (_req: Request, res: Response) => {
  try {
    const collections = recommenderService.getCollections();
    res.json(collections);
  } catch (error) {
    console.error('Failed to get collections:', error);
    res.status(500).json({
      error: 'Failed to get collections',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
