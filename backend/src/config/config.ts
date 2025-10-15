/**
 * Configuration for Evol Jewels Express Backend
 */

import { ServerConfig, SearchConfig } from '../models/types';
import * as path from 'path';

// ============================================================================
// Environment Variables
// ============================================================================

const NODE_ENV = process.env['NODE_ENV'] || 'development';
const PORT = parseInt(process.env['PORT'] || '8000', 10);
const HOST = process.env['HOST'] || '0.0.0.0';

// CORS origins - allow all in development, specific origins in production
const CORS_ORIGINS = NODE_ENV === 'production' 
  ? (process.env['CORS_ORIGINS'] || 'http://localhost:3000,https://kiosk-hackethon-project.vercel.app').split(',')
  : ['*'];

// Data paths - relative to project root
const DATA_PATH = process.env['DATA_PATH'] || path.join(process.cwd(), '..', 'indexed_data');
const MODEL_PATH = process.env['MODEL_PATH'] || path.join(process.cwd(), '..', 'models');

// Fallback: if data doesn't exist in parent directory, try current directory
const fs = require('fs');
const actualDataPath = fs.existsSync(DATA_PATH) ? DATA_PATH : path.join(process.cwd(), 'indexed_data');
const actualModelPath = fs.existsSync(MODEL_PATH) ? MODEL_PATH : path.join(process.cwd(), 'models');

// Validate data path exists
console.log('Data path:', DATA_PATH);
console.log('Model path:', MODEL_PATH);

// ============================================================================
// Server Configuration
// ============================================================================

export const serverConfig: ServerConfig = {
  port: PORT,
  host: HOST,
  nodeEnv: NODE_ENV,
  corsOrigins: CORS_ORIGINS,
  dataPath: actualDataPath,
  modelPath: actualModelPath,
};

// ============================================================================
// Search Configuration
// ============================================================================

export const searchConfig: SearchConfig = {
  defaultTopK: 5,
  maxTopK: 50,
  similarityThreshold: 0.1,
  enableCaching: NODE_ENV === 'production',
};

// ============================================================================
// TensorFlow.js Configuration
// ============================================================================

export const tfConfig = {
  // Use CPU backend for better compatibility
  backend: 'cpu' as const,
  // Enable memory management
  enableMemoryManagement: true,
  // Model loading timeout (ms)
  modelLoadTimeout: 30000,
  // Universal Sentence Encoder model URL
  useModelUrl: 'https://tfhub.dev/tensorflow/tfjs-model/universal-sentence-encoder/1/default/1',
};

// ============================================================================
// File Paths
// ============================================================================

export const filePaths = {
  metadata: path.join(actualDataPath, 'metadata.json'),
  embeddings: path.join(actualDataPath, 'embeddings.npy'),
  faissIndex: path.join(actualDataPath, 'faiss.index'),
  celebrityData: path.join(actualDataPath, 'celebrity_styles.json'),
  vibeConfig: path.join(actualDataPath, 'vibe_config.json'),
};

// ============================================================================
// Logging Configuration
// ============================================================================

export const logConfig = {
  level: NODE_ENV === 'production' ? 'info' : 'debug',
  format: NODE_ENV === 'production' ? 'json' : 'pretty',
  enableRequestLogging: NODE_ENV !== 'production',
  enableErrorStack: NODE_ENV !== 'production',
};

// ============================================================================
// Performance Configuration
// ============================================================================

export const performanceConfig = {
  // Request timeout (ms)
  requestTimeout: 10000,
  // Max request size (bytes)
  maxRequestSize: '10mb',
  // Enable compression
  enableCompression: true,
  // Cache control
  cacheControl: {
    static: 'public, max-age=3600',
    api: 'no-cache',
  },
};

// ============================================================================
// Validation
// ============================================================================

export const validateConfig = (): void => {
  const errors: string[] = [];

  // Validate port
  if (PORT < 1 || PORT > 65535) {
    errors.push('PORT must be between 1 and 65535');
  }

  // Validate data path exists
  try {
    require('fs').accessSync(actualDataPath);
  } catch {
    errors.push(`Data path does not exist: ${actualDataPath}`);
  }

  // Validate required files
  const requiredFiles = [filePaths.metadata];
  for (const file of requiredFiles) {
    try {
      require('fs').accessSync(file);
    } catch {
      errors.push(`Required file not found: ${file}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }
};

// ============================================================================
// Export Default Configuration
// ============================================================================

export default {
  server: serverConfig,
  search: searchConfig,
  tensorflow: tfConfig,
  files: filePaths,
  logging: logConfig,
  performance: performanceConfig,
  validate: validateConfig,
};
