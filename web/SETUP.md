# Setup Guide - Evol Jewels AI Kiosk

This guide will help you set up and run the complete frontend-backend integration.

## Prerequisites

- Node.js 18+ installed
- Python 3.10+ installed
- Git installed

## Quick Start

### 1. Clone and Setup Backend

```bash
# Navigate to project root
cd /path/to/kiosk-hackethon-project

# Install Python dependencies (if using uv)
uv sync

# OR if using pip
pip install -r requirements.txt

# Run preprocessing (one-time setup)
uv run python src/preprocess.py
# OR
python src/preprocess.py

# Start FastAPI backend
uv run python main.py
# OR
uvicorn src.api:app --reload
```

Backend will run on: **http://localhost:8000**

Test it: http://localhost:8000/docs

### 2. Setup Frontend

```bash
# Navigate to web directory
cd web

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local if needed (default values should work)
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Start Next.js development server
npm run dev
```

Frontend will run on: **http://localhost:3000**

### 3. Verify Connection

Open http://localhost:3000 in your browser. The app should:
- Load without errors
- Fetch data from the backend
- Display products and recommendations

## Project Structure

```
kiosk-hackethon-project/
├── src/                          # Backend Python code
│   ├── api.py                   # FastAPI main file
│   ├── recommender.py           # Recommendation engine
│   ├── celebrity_engine.py      # Celebrity matching
│   └── vibe_classifier.py       # Vibe classification
│
├── indexed_data/                 # Preprocessed data
│   ├── embeddings.npy
│   ├── faiss.index
│   └── metadata.json
│
└── web/                          # Frontend Next.js app
    ├── lib/                      # Core libraries
    │   ├── api/                 # API client & services
    │   ├── hooks/               # Custom React hooks
    │   ├── context/             # State management
    │   └── types/               # TypeScript types
    │
    ├── components/              # Reusable components
    ├── app/                     # Next.js pages
    └── public/                  # Static assets
```

## Key Features

### 1. API Integration
- ✅ Axios client with interceptors
- ✅ Type-safe API calls
- ✅ Comprehensive error handling
- ✅ Request/response logging
- ✅ Automatic retries

### 2. State Management
- ✅ User preferences context
- ✅ Shopping cart context
- ✅ Persistent cart (localStorage)

### 3. Custom Hooks
- ✅ `useProductSearch` - Search products
- ✅ `useCelebritySearch` - Celebrity-based search
- ✅ `useVibeSearch` - Vibe-based search
- ✅ `useCelebrities` - Fetch celebrities
- ✅ `useVibes` - Fetch vibes
- ✅ `useCategories` - Fetch categories
- ✅ `usePersonalizedRecommendations` - Get recommendations

### 4. UI Components
- ✅ `LoadingSpinner` - Loading states
- ✅ `ErrorMessage` - Error display
- ✅ `ProductCard` - Product display

## API Endpoints Available

### Search
- `POST /search` - Search products with filters
- `POST /search/celebrity` - Celebrity-inspired search
- `POST /search/vibe` - Vibe-based search
- `GET /search/suggestions` - Search suggestions

### Metadata
- `GET /celebrities` - List all celebrities
- `GET /vibes` - List all vibes
- `GET /categories` - List all categories
- `GET /collections` - List all collections

### Statistics
- `GET /stats/vibes` - Vibe distribution
- `GET /stats/price-range` - Price statistics

### Health
- `GET /health` - API health check

## Development Workflow

### Frontend Development

```bash
cd web

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Backend Development

```bash
# Start with auto-reload
uvicorn src.api:app --reload --log-level debug

# Access API docs
# http://localhost:8000/docs
```

## Configuration

### Frontend Environment Variables

Edit `web/.env.local`:

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Request timeout (ms)
NEXT_PUBLIC_API_TIMEOUT=30000
```

### Backend Configuration

Edit `src/api.py` for CORS settings:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Testing the Integration

### 1. Test Health Endpoint

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "products_loaded": 200,
  "celebrities_available": 8,
  "vibes_available": 15
}
```

### 2. Test Product Search

```bash
curl -X POST http://localhost:8000/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "gold necklace",
    "min_price": 50000,
    "max_price": 200000,
    "top_k": 5
  }'
```

### 3. Test Celebrity Search

```bash
curl -X POST http://localhost:8000/search/celebrity \
  -H "Content-Type: application/json" \
  -d '{
    "celebrity_name": "deepika_padukone",
    "top_k": 5
  }'
```

### 4. Test Frontend Connection

1. Open http://localhost:3000
2. Navigate through the flow:
   - Select occasion
   - Select budget
   - Select vibe
   - View recommendations
3. Check browser console for API calls
4. Check network tab for request/response

## Troubleshooting

### Problem: Frontend can't connect to backend

**Solution:**
1. Check backend is running: `curl http://localhost:8000/health`
2. Check CORS settings in `src/api.py`
3. Check `.env.local` has correct API URL
4. Check browser console for errors

### Problem: No products showing

**Solution:**
1. Run preprocessing: `python src/preprocess.py`
2. Check `indexed_data/` directory exists
3. Check backend logs for errors
4. Verify `/health` endpoint shows products loaded

### Problem: CORS errors

**Solution:**
Update CORS settings in `src/api.py`:
```python
allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"]
```

### Problem: TypeScript errors

**Solution:**
```bash
cd web
npm install
npx tsc --noEmit  # Check for type errors
```

## Production Deployment

### Frontend (Vercel)

```bash
cd web
vercel --prod
```

Environment variables in Vercel:
- `NEXT_PUBLIC_API_URL` = Your production API URL

### Backend (Render/Railway)

1. Deploy FastAPI app
2. Update CORS to allow frontend domain
3. Set environment variables
4. Update frontend `.env.local` with production API URL

## Performance Tips

1. **Caching**: Metadata is cached for 5 minutes automatically
2. **Debouncing**: Search uses 500ms debounce
3. **Lazy Loading**: Components load data only when needed
4. **Batch Requests**: Use `getAllMetadata()` for multiple endpoints

## Development Best Practices

### 1. Always Use Types
```typescript
// ✅ Good
const { data } = useApi<Product[]>(getProducts);

// ❌ Bad
const { data } = useApi(getProducts);
```

### 2. Handle Loading/Error States
```typescript
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} />;
return <YourComponent data={data} />;
```

### 3. Use Context for Global State
```typescript
const { preferences, setOccasion } = usePreferences();
```

### 4. Leverage Custom Hooks
```typescript
// ✅ Good
const { data, mutate } = useProductSearch();

// ❌ Bad
const [data, setData] = useState();
useEffect(() => { fetch(...) }, []);
```

## Additional Resources

- **API Documentation**: See `web/API_INTEGRATION.md`
- **Architecture**: See `ARCHITECTURE_V2.md`
- **Backend API**: http://localhost:8000/docs (when running)
- **Frontend**: http://localhost:3000 (when running)

## Support

If you encounter issues:

1. Check console logs (browser & terminal)
2. Review error messages
3. Check API documentation
4. Verify all services are running
5. Check network tab in browser DevTools

## Next Steps

After setup:

1. Explore the codebase
2. Try different API endpoints in `/docs`
3. Modify pages to add new features
4. Add new API endpoints as needed
5. Customize UI components

## Quick Reference

### Start Backend
```bash
cd /path/to/kiosk-hackethon-project
uvicorn src.api:app --reload
```

### Start Frontend
```bash
cd web
npm run dev
```

### View API Docs
http://localhost:8000/docs

### View App
http://localhost:3000

### Check Health
http://localhost:8000/health

