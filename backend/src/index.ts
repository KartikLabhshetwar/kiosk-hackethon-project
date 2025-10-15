/**
 * Express.js Server for Evol Jewels AI Kiosk Backend
 * Main entry point for the API server
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';

// Import configuration
import config from './config/config';

// Import services
import { RecommenderService } from './services/recommender.service';
import { CelebrityService } from './services/celebrity.service';
import { VibeService } from './services/vibe.service';

// Import routes
import searchRoutes, { initializeSearchRoutes } from './routes/search.routes';
import metadataRoutes, { initializeMetadataRoutes } from './routes/metadata.routes';
import statsRoutes, { initializeStatsRoutes } from './routes/stats.routes';
import productRoutes, { initializeProductRoutes } from './routes/product.routes';

// Import types
import { HealthStatus, RootInfo } from './models/types';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// ============================================================================
// Middleware Configuration
// ============================================================================

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: config.server.corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Request-Time'],
}));

// Compression middleware
if (config.performance.enableCompression) {
  app.use(compression());
}

// Body parsing middleware
app.use(express.json({ limit: config.performance.maxRequestSize }));
app.use(express.urlencoded({ extended: true, limit: config.performance.maxRequestSize }));

// Request logging middleware (development only)
if (config.logging.enableRequestLogging) {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    });
    next();
  });
}

// ============================================================================
// Service Initialization
// ============================================================================

let recommenderService: RecommenderService;
let celebrityService: CelebrityService;
let vibeService: VibeService;

const initializeServices = async (): Promise<void> => {
  try {
    console.log('🚀 Initializing services...');
    
    // Initialize services with data file paths
    celebrityService = new CelebrityService(config.files.celebrityData);
    vibeService = new VibeService(config.files.vibeConfig);
    recommenderService = new RecommenderService(
      config.files.metadata.replace('/metadata.json', ''),
      celebrityService,
      vibeService
    );

    // Initialize recommender service (loads data and models)
    await recommenderService.initialize();

    // Initialize route handlers with services
    initializeSearchRoutes(recommenderService, celebrityService, vibeService);
    initializeMetadataRoutes(recommenderService, celebrityService, vibeService);
    initializeStatsRoutes(recommenderService);
    initializeProductRoutes(recommenderService);

    console.log('✅ All services initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize services:', error);
    process.exit(1);
  }
};

// ============================================================================
// Health Check Endpoints
// ============================================================================

/**
 * GET / - Root endpoint
 */
app.get('/', (_req, res) => {
  const rootInfo: RootInfo = {
    message: 'Evol Jewels AI Kiosk API',
    version: '1.0.0',
    status: 'running',
    docs: '/docs',
    health: '/health'
  };
  
  res.json(rootInfo);
});

/**
 * GET /health - Health check endpoint
 */
app.get('/health', (_req, res) => {
  try {
    const stats = recommenderService ? recommenderService.getStats() : null;
    
    const healthStatus: HealthStatus = {
      status: stats ? 'healthy' : 'initializing',
      products_loaded: stats?.productsLoaded || 0,
      celebrities_available: celebrityService ? celebrityService.listCelebrities().length : 0,
      vibes_available: vibeService ? vibeService.getAllVibes().length : 0
    };

    res.json(healthStatus);
  } catch (error) {
    const healthStatus: HealthStatus = {
      status: `error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      products_loaded: 0,
      celebrities_available: 0,
      vibes_available: 0
    };

    res.status(500).json(healthStatus);
  }
});

// ============================================================================
// API Routes
// ============================================================================

// Mount route handlers
app.use('/search', searchRoutes);
app.use('/', metadataRoutes); // Celebrities, vibes, categories, collections
app.use('/stats', statsRoutes);
app.use('/product', productRoutes);

// ============================================================================
// Error Handling Middleware
// ============================================================================

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /',
      'GET /health',
      'POST /search',
      'POST /search/celebrity',
      'POST /search/vibe',
      'GET /search/suggestions',
      'GET /celebrities',
      'GET /vibes',
      'GET /categories',
      'GET /collections',
      'GET /stats/vibes',
      'GET /stats/price-range',
      'GET /product/:id'
    ]
  });
});

// Global error handler
app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: config.logging.enableErrorStack ? error.message : 'Something went wrong',
    ...(config.logging.enableErrorStack && { stack: error.stack })
  });
});

// ============================================================================
// Server Startup
// ============================================================================

const startServer = async (): Promise<void> => {
  try {
    // Validate configuration
    config.validate();

    // Initialize services
    await initializeServices();

    // Start server
    const server = app.listen(config.server.port, config.server.host, () => {
      console.log(`🚀 Evol Jewels AI Kiosk API Server running on ${config.server.host}:${config.server.port}`);
      console.log(`📊 Environment: ${config.server.nodeEnv}`);
      console.log(`🔗 Health check: http://${config.server.host}:${config.server.port}/health`);
      console.log(`📚 API docs: http://${config.server.host}:${config.server.port}/docs`);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
      
      server.close((err) => {
        if (err) {
          console.error('❌ Error during server shutdown:', err);
          process.exit(1);
        }
        
        console.log('✅ Server closed successfully');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('❌ Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
if (require.main === module) {
  startServer();
}

export default app;
