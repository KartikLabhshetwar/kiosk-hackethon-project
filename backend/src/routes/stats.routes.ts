/**
 * Statistics Routes
 * Handles all statistics-related endpoints
 */

import { Router, Request, Response } from 'express';
import { RecommenderService } from '../services/recommender.service';
import { VibeStats } from '../models/types';

const router = Router();

// Initialize services (will be injected)
let recommenderService: RecommenderService;

export const initializeStatsRoutes = (recommender: RecommenderService) => {
  recommenderService = recommender;
};

/**
 * GET /stats/vibes - Get vibe distribution statistics
 */
router.get('/stats/vibes', async (_req: Request, res: Response) => {
  try {
    // Get vibe statistics
    const vibeStats = recommenderService.getVibeStatistics();
    const totalProducts = recommenderService.getAllMetadata().length;
    
    // Convert to response format
    const stats: VibeStats[] = Object.entries(vibeStats)
      .map(([vibe, count]) => ({
        vibe,
        count,
        percentage: totalProducts > 0 ? Math.round((count / totalProducts) * 100 * 100) / 100 : 0
      }))
      .sort((a, b) => b.count - a.count);

    res.json(stats);
  } catch (error) {
    console.error('Failed to get vibe statistics:', error);
    res.status(500).json({
      error: 'Failed to get vibe statistics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /stats/price-range - Get price range statistics
 */
router.get('/stats/price-range', async (_req: Request, res: Response) => {
  try {
    const priceStats = recommenderService.getPriceRangeStats();
    res.json(priceStats);
  } catch (error) {
    console.error('Failed to get price statistics:', error);
    res.status(500).json({
      error: 'Failed to get price statistics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
