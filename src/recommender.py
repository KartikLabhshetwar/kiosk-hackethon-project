import json
import numpy as np
import faiss
from pathlib import Path
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Optional
import re

class JewelryRecommender:
    """Core recommendation engine with vector search + filtering"""
    
    def __init__(self, index_dir: str = "indexed_data"):
        self.index_dir = Path(index_dir)
        self.metadata = None
        self.index = None
        self.model = None
        self._load_resources()
    
    def _load_resources(self):
        """Load metadata, FAISS index, and embedding model"""
        
        # Load metadata
        metadata_path = self.index_dir / "metadata.json"
        if not metadata_path.exists():
            raise FileNotFoundError(
                f"Metadata not found at {metadata_path}. "
                "Please run preprocess.py first."
            )
        
        with open(metadata_path, "r", encoding="utf-8") as f:
            self.metadata = json.load(f)
        
        # Load FAISS index
        index_path = self.index_dir / "faiss.index"
        self.index = faiss.read_index(str(index_path))
        
        # Load embedding model
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        
        print(f"✅ Loaded {len(self.metadata)} products")
    
    def search(
        self,
        query: str,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        category: Optional[str] = None,
        top_k: int = 5
    ) -> List[Dict]:
        """
        Search for jewelry matching query and filters
        
        Args:
            query: Natural language search query
            min_price: Minimum price filter
            max_price: Maximum price filter
            category: Category filter (e.g., 'necklace', 'earrings')
            top_k: Number of results to return
        
        Returns:
            List of matching products with scores
        """
        
        if not query.strip():
            raise ValueError("Query cannot be empty")
        
        # Embed query
        query_emb = self.model.encode([query], convert_to_numpy=True)
        query_emb = query_emb / np.linalg.norm(query_emb, axis=1, keepdims=True)
        
        # Search with higher k, then filter
        search_k = min(top_k * 10, len(self.metadata))
        distances, indices = self.index.search(
            query_emb.astype("float32"),
            search_k
        )
        
        results = []
        for idx, score in zip(indices[0], distances[0]):
            if idx < 0 or idx >= len(self.metadata):
                continue
            
            item = self.metadata[idx]
            
            # Apply filters
            if min_price and item.get("price"):
                if item["price"] < min_price:
                    continue
            
            if max_price and item.get("price"):
                if item["price"] > max_price:
                    continue
            
            if category and item.get("category"):
                if category.lower() not in item["category"].lower():
                    continue
            
            results.append({
                **item,
                "similarity_score": float(score),
                "rank": len(results) + 1
            })
            
            if len(results) >= top_k:
                break
        
        return results
    
    def parse_budget(self, budget_text: str) -> tuple[Optional[float], Optional[float]]:
        """Parse budget text into min/max values"""
        
        if not budget_text:
            return None, None
        
        # Extract numbers (handles formats like "20k-30k", "under 50k", "25000")
        numbers = re.findall(r'(\d+)k?', budget_text.lower())
        
        if not numbers:
            return None, None
        
        # Convert to float (multiply by 1000 if 'k' present)
        if 'k' in budget_text.lower():
            values = [float(n) * 1000 for n in numbers]
        else:
            values = [float(n) for n in numbers]
        
        if len(values) == 1:
            # Single value: treat as max budget
            return None, values[0]
        else:
            # Range: min and max
            return min(values), max(values)
    
    def get_categories(self) -> List[str]:
        """Get unique categories from metadata"""
        categories = set()
        for item in self.metadata:
            if item.get("category"):
                categories.add(item["category"])
        return sorted(list(categories))
    
    def get_collections(self) -> List[str]:
        """Get unique collections from metadata"""
        collections = set()
        for item in self.metadata:
            if item.get("collection"):
                collections.add(item["collection"])
        return sorted(list(collections))
