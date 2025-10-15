# Evol Jewels Backend API

Express.js backend for the Evol Jewels AI Kiosk, providing AI-powered jewelry recommendations with celebrity inspiration and vibe classification.

## Features

- **Semantic Search**: TensorFlow.js-powered vector search for natural language queries
- **Celebrity Inspiration**: Get jewelry recommendations inspired by celebrity styles
- **Vibe Classification**: Automatic classification of jewelry by style vibes
- **RESTful API**: Complete REST API matching FastAPI functionality
- **TypeScript**: Full type safety and modern JavaScript features
- **Performance**: Optimized for fast response times and low memory usage

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Pre-processed data files (from Python preprocessing)

### Installation

```bash
# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Build TypeScript
npm run build

# Start the server
npm start
```

### Development

```bash
# Start in development mode with hot reload
npm run dev

# Or use ts-node directly
npm run dev:ts
```

## API Endpoints

### Health & Info
- `GET /` - Root endpoint with API information
- `GET /health` - Health check with system status

### Search
- `POST /search` - General product search with filters
- `POST /search/celebrity` - Celebrity-inspired search
- `POST /search/vibe` - Vibe-based search
- `GET /search/suggestions?q=query` - Search autocomplete

### Metadata
- `GET /celebrities` - List all celebrities
- `GET /vibes` - List all vibes
- `GET /categories` - List all categories
- `GET /collections` - List all collections

### Statistics
- `GET /stats/vibes` - Vibe distribution statistics
- `GET /stats/price-range` - Price range statistics

### Products
- `GET /product/:id` - Get specific product by ID

## Configuration

Environment variables (see `.env.example`):

```env
# Server
NODE_ENV=development
PORT=8000
HOST=0.0.0.0

# CORS
CORS_ORIGINS=*

# Data paths
DATA_PATH=../indexed_data
MODEL_PATH=../models
```

## Data Requirements

The backend expects the following files in the data directory:

- `metadata.json` - Product metadata with embeddings
- `embeddings.json` - Pre-computed embeddings (optional, will generate on-demand)
- `embeddings.npy` - NumPy embeddings file (will be converted)

## Architecture

### Services

- **RecommenderService**: Core search engine with TensorFlow.js
- **CelebrityService**: Celebrity style mapping and recommendations
- **VibeService**: Vibe classification and keyword matching

### Routes

- **Search Routes**: Handle all search operations
- **Metadata Routes**: Provide lists of available data
- **Stats Routes**: Return statistics and analytics
- **Product Routes**: Individual product operations

## Performance

- **Response Time**: < 500ms for search queries
- **Memory Usage**: < 1GB for typical deployment
- **Concurrent Requests**: Handles multiple simultaneous searches
- **Caching**: In-memory caching for optimal performance

## Deployment

### Docker

```bash
# Build image
docker build -t evol-jewels-backend .

# Run container
docker run -p 8000:8000 -e NODE_ENV=production evol-jewels-backend
```

### Platform Deployment

#### Render
1. Connect your repository
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Add environment variables

#### Heroku
1. Create Heroku app
2. Set buildpacks: `heroku/nodejs`
3. Deploy: `git push heroku main`

#### Railway
1. Connect repository
2. Set start command: `npm start`
3. Configure environment variables

## Development

### Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── models/          # TypeScript interfaces
│   ├── routes/          # Express route handlers
│   ├── services/        # Business logic services
│   └── utils/           # Utility functions
├── dist/                # Compiled JavaScript
├── package.json
├── tsconfig.json
└── Dockerfile
```

### Adding New Features

1. **New Endpoint**: Add route handler in `src/routes/`
2. **New Service**: Create service in `src/services/`
3. **New Types**: Add interfaces in `src/models/types.ts`
4. **Configuration**: Update `src/config/config.ts`

### Testing

```bash
# Run tests (when implemented)
npm test

# Test specific endpoint
curl -X POST http://localhost:8000/search \
  -H "Content-Type: application/json" \
  -d '{"query": "elegant gold necklace", "top_k": 5}'
```

## Migration from FastAPI

This Express.js backend is a complete port of the original FastAPI backend:

- ✅ All endpoints replicated
- ✅ Same request/response formats
- ✅ Same validation rules
- ✅ Same error handling
- ✅ TensorFlow.js for semantic search
- ✅ Celebrity and vibe engines ported

## Troubleshooting

### Common Issues

1. **Model Loading Fails**
   - Check internet connection for TensorFlow.js model download
   - Verify sufficient memory (1GB+ recommended)

2. **Data Files Not Found**
   - Ensure `indexed_data/` directory exists
   - Run Python preprocessing first: `python src/preprocess.py`

3. **CORS Errors**
   - Update `CORS_ORIGINS` in environment variables
   - Check frontend URL configuration

4. **Memory Issues**
   - Reduce `maxTopK` in search configuration
   - Enable memory management in TensorFlow.js

### Logs

```bash
# View logs in development
npm run dev

# View logs in production
docker logs <container-id>
```

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Make changes and test
4. Submit pull request

## License

MIT License - see LICENSE file for details.
