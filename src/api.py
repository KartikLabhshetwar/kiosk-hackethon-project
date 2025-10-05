"""
Memory-optimized FastAPI backend for Evol Jewels AI Kiosk
Uses lazy loading to reduce memory usage for Render deployment
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
import json
from pathlib import Path
import gc
import os

# Global instances (loaded lazily)
recommender = None
celebrity_engine = None
vibe_classifier = None

# Initialize FastAPI app
app = FastAPI(
    title="Evol Jewels AI Kiosk API",
    description="AI-powered jewelry recommendation system with celebrity inspiration and vibe classification",
    version="1.0.0"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class SearchRequest(BaseModel):
    query: str
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    category: Optional[str] = None
    vibe: Optional[str] = None
    top_k: int = 5

class CelebrityRequest(BaseModel):
    celebrity_name: str
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    top_k: int = 5

class VibeRequest(BaseModel):
    vibe: str
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    category: Optional[str] = None
    top_k: int = 5

class ProductResponse(BaseModel):
    id: int
    product_name: str
    collection: Optional[str]
    category: Optional[str]
    price: Optional[float]
    images: Optional[str]
    description: str
    product_url: str
    vibes: List[str]
    primary_vibe: str
    similarity_score: Optional[float] = None
    rank: Optional[int] = None

class CelebrityResponse(BaseModel):
    celebrity_name: str
    style_description: str
    vibes: List[str]
    occasions: List[str]
    keywords: List[str]
    price_range: Dict[str, float]
    preferred_categories: List[str]
    products: List[ProductResponse]

class VibeStatsResponse(BaseModel):
    vibe: str
    count: int
    percentage: float

class HealthResponse(BaseModel):
    status: str
    products_loaded: int
    celebrities_available: int
    vibes_available: int

def get_recommender():
    """Lazy load recommender to save memory"""
    global recommender
    if recommender is None:
        print("🔄 Loading recommender...")
        from .recommender import JewelryRecommender
        recommender = JewelryRecommender()
        print("✅ Recommender loaded")
    return recommender

def get_celebrity_engine():
    """Lazy load celebrity engine to save memory"""
    global celebrity_engine
    if celebrity_engine is None:
        print("🔄 Loading celebrity engine...")
        from .celebrity_engine import CelebrityInspirationEngine
        celebrity_engine = CelebrityInspirationEngine()
        print("✅ Celebrity engine loaded")
    return celebrity_engine

def get_vibe_classifier():
    """Lazy load vibe classifier to save memory"""
    global vibe_classifier
    if vibe_classifier is None:
        print("🔄 Loading vibe classifier...")
        from .vibe_classifier import VibeClassifier
        vibe_classifier = VibeClassifier()
        print("✅ Vibe classifier loaded")
    return vibe_classifier

# Health check endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint - lightweight, no model loading"""
    try:
        # Check if data files exist without loading models
        index_dir = Path("indexed_data")
        metadata_path = index_dir / "metadata.json"
        
        if not metadata_path.exists():
            return HealthResponse(
                status="error",
                products_loaded=0,
                celebrities_available=0,
                vibes_available=0
            )
        
        # Load only metadata for stats (lightweight)
        with open(metadata_path, "r", encoding="utf-8") as f:
            metadata = json.load(f)
        
        return HealthResponse(
            status="healthy",
            products_loaded=len(metadata),
            celebrities_available=8,  # Hardcoded for now
            vibes_available=15  # Hardcoded for now
        )
        
    except Exception as e:
        return HealthResponse(
            status=f"error: {str(e)}",
            products_loaded=0,
            celebrities_available=0,
            vibes_available=0
        )

# Search endpoints
@app.post("/search", response_model=List[ProductResponse])
async def search_products(request: SearchRequest):
    """Search for jewelry products with filters"""
    try:
        recommender = get_recommender()
        
        results = recommender.search(
            query=request.query,
            min_price=request.min_price,
            max_price=request.max_price,
            category=request.category,
            top_k=request.top_k
        )
        
        # Filter by vibe if specified
        if request.vibe:
            results = [r for r in results if request.vibe.lower() in [v.lower() for v in r.get("vibes", [])]]
        
        # Convert to response format
        products = []
        for i, result in enumerate(results):
            products.append(ProductResponse(
                id=result["id"],
                product_name=result["product_name"],
                collection=result.get("collection"),
                category=result.get("category"),
                price=result.get("price"),
                images=result.get("images"),
                description=result["description"],
                product_url=result["product_url"],
                vibes=result.get("vibes", []),
                primary_vibe=result.get("primary_vibe", "classic"),
                similarity_score=result.get("similarity_score"),
                rank=result.get("rank", i + 1)
            ))
        
        return products
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@app.post("/search/celebrity", response_model=CelebrityResponse)
async def search_by_celebrity(request: CelebrityRequest):
    """Search for jewelry inspired by a celebrity's style"""
    try:
        recommender = get_recommender()
        celebrity_engine = get_celebrity_engine()
        
        # Get celebrity style data
        celebrity_data = celebrity_engine.get_celebrity_recommendations(request.celebrity_name)
        if not celebrity_data:
            raise HTTPException(status_code=404, detail=f"Celebrity '{request.celebrity_name}' not found")
        
        # Search for products
        query = celebrity_data["query"]
        results = recommender.search(
            query=query,
            min_price=request.min_price or celebrity_data["price_range"]["min"],
            max_price=request.max_price or celebrity_data["price_range"]["max"],
            top_k=request.top_k
        )
        
        # Convert to response format
        products = []
        for i, result in enumerate(results):
            products.append(ProductResponse(
                id=result["id"],
                product_name=result["product_name"],
                collection=result.get("collection"),
                category=result.get("category"),
                price=result.get("price"),
                images=result.get("images"),
                description=result["description"],
                product_url=result["product_url"],
                vibes=result.get("vibes", []),
                primary_vibe=result.get("primary_vibe", "classic"),
                similarity_score=result.get("similarity_score"),
                rank=result.get("rank", i + 1)
            ))
        
        return CelebrityResponse(
            celebrity_name=request.celebrity_name,
            style_description=celebrity_data["style_description"],
            vibes=celebrity_data["vibes"],
            occasions=celebrity_data["occasions"],
            keywords=celebrity_data["keywords"],
            price_range=celebrity_data["price_range"],
            preferred_categories=celebrity_data["preferred_categories"],
            products=products
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Celebrity search failed: {str(e)}")

@app.post("/search/vibe", response_model=List[ProductResponse])
async def search_by_vibe(request: VibeRequest):
    """Search for jewelry by vibe"""
    try:
        recommender = get_recommender()
        
        # Search with vibe as query
        results = recommender.search(
            query=request.vibe,
            min_price=request.min_price,
            max_price=request.max_price,
            category=request.category,
            top_k=request.top_k
        )
        
        # Filter by exact vibe match
        vibe_results = []
        for result in results:
            if request.vibe.lower() in [v.lower() for v in result.get("vibes", [])]:
                vibe_results.append(result)
        
        # Convert to response format
        products = []
        for i, result in enumerate(vibe_results):
            products.append(ProductResponse(
                id=result["id"],
                product_name=result["product_name"],
                collection=result.get("collection"),
                category=result.get("category"),
                price=result.get("price"),
                images=result.get("images"),
                description=result["description"],
                product_url=result["product_url"],
                vibes=result.get("vibes", []),
                primary_vibe=result.get("primary_vibe", "classic"),
                similarity_score=result.get("similarity_score"),
                rank=result.get("rank", i + 1)
            ))
        
        return products
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Vibe search failed: {str(e)}")

# Metadata endpoints
@app.get("/celebrities", response_model=List[str])
async def get_celebrities():
    """Get list of available celebrities"""
    try:
        celebrity_engine = get_celebrity_engine()
        return celebrity_engine.list_celebrities()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get celebrities: {str(e)}")

@app.get("/vibes", response_model=List[str])
async def get_vibes():
    """Get list of available vibes"""
    try:
        vibe_classifier = get_vibe_classifier()
        return vibe_classifier.get_all_vibes()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get vibes: {str(e)}")

@app.get("/categories", response_model=List[str])
async def get_categories():
    """Get list of available categories"""
    try:
        recommender = get_recommender()
        return recommender.get_categories()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get categories: {str(e)}")

@app.get("/collections", response_model=List[str])
async def get_collections():
    """Get list of available collections"""
    try:
        recommender = get_recommender()
        return recommender.get_collections()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get collections: {str(e)}")

# Statistics endpoints
@app.get("/stats/vibes", response_model=List[VibeStatsResponse])
async def get_vibe_statistics():
    """Get vibe distribution statistics"""
    try:
        recommender = get_recommender()
        
        # Calculate vibe statistics
        vibe_counts = {}
        total_products = len(recommender.metadata)
        
        for item in recommender.metadata:
            for vibe in item.get("vibes", []):
                vibe_counts[vibe] = vibe_counts.get(vibe, 0) + 1
        
        # Convert to response format
        stats = []
        for vibe, count in sorted(vibe_counts.items(), key=lambda x: x[1], reverse=True):
            percentage = (count / total_products) * 100 if total_products > 0 else 0
            stats.append(VibeStatsResponse(
                vibe=vibe,
                count=count,
                percentage=round(percentage, 2)
            ))
        
        return stats
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get vibe statistics: {str(e)}")

@app.get("/stats/price-range")
async def get_price_range():
    """Get price range statistics"""
    try:
        recommender = get_recommender()
        prices = [item["price"] for item in recommender.metadata if item.get("price") is not None]
        
        if not prices:
            return {"min": 0, "max": 0, "avg": 0, "count": 0}
        
        return {
            "min": min(prices),
            "max": max(prices),
            "avg": sum(prices) / len(prices),
            "count": len(prices)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get price statistics: {str(e)}")

# Utility endpoints
@app.get("/search/suggestions")
async def get_search_suggestions(q: str = Query(..., min_length=2)):
    """Get search suggestions based on query"""
    try:
        recommender = get_recommender()
        
        # Simple suggestion based on product names and categories
        suggestions = set()
        query_lower = q.lower()
        
        for item in recommender.metadata:
            # Product name suggestions
            if query_lower in item["product_name"].lower():
                suggestions.add(item["product_name"])
            
            # Category suggestions
            if item.get("category") and query_lower in item["category"].lower():
                suggestions.add(item["category"])
            
            # Collection suggestions
            if item.get("collection") and query_lower in item["collection"].lower():
                suggestions.add(item["collection"])
        
        return list(suggestions)[:10]  # Return top 10 suggestions
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get suggestions: {str(e)}")

@app.get("/product/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int):
    """Get specific product by ID"""
    try:
        recommender = get_recommender()
        
        # Find product by ID
        product = None
        for item in recommender.metadata:
            if item["id"] == product_id:
                product = item
                break
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        return ProductResponse(
            id=product["id"],
            product_name=product["product_name"],
            collection=product.get("collection"),
            category=product.get("category"),
            price=product.get("price"),
            images=product.get("images"),
            description=product["description"],
            product_url=product["product_url"],
            vibes=product.get("vibes", []),
            primary_vibe=product.get("primary_vibe", "classic")
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get product: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
