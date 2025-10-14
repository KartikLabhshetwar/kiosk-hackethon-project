import json
import numpy as np
import faiss
from pathlib import Path
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Optional
import re
from src.celebrity_engine import CelebrityInspirationEngine
from src.vibe_classifier import VibeClassifier

class JewelryRecommender:
    """Core recommendation engine with vector search + filtering"""
    
    def __init__(self, index_dir: str = "indexed_data"):
        self.index_dir = Path(index_dir)
        self.metadata = None
        self.index = None
        self.model = None
        self.celebrity_engine = None
        self.vibe_classifier = None
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
        
        # Initialize additional engines
        self.celebrity_engine = CelebrityInspirationEngine()
        self.vibe_classifier = VibeClassifier()
        
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
    
    def search_by_celebrity(self, celebrity_name: str, top_k: int = 5) -> List[Dict]:
        """
        Search for jewelry inspired by a celebrity's style
        
        Args:
            celebrity_name: Name of the celebrity
            top_k: Number of results to return
            
        Returns:
            List of matching products with celebrity context
        """
        if not self.celebrity_engine:
            raise ValueError("Celebrity engine not available")
        
        # Get celebrity style data
        celebrity_data = self.celebrity_engine.get_celebrity_recommendations(celebrity_name)
        if not celebrity_data:
            return []
        
        # Use celebrity's preferred query
        query = celebrity_data["query"]
        
        # Search with celebrity's price preferences
        results = self.search(
            query=query,
            min_price=celebrity_data["price_range"]["min"],
            max_price=celebrity_data["price_range"]["max"],
            top_k=top_k
        )
        
        # Add celebrity context to results
        for result in results:
            result["celebrity_inspiration"] = {
                "celebrity": celebrity_name,
                "style_description": celebrity_data["style_description"],
                "vibes": celebrity_data["vibes"],
                "occasions": celebrity_data["occasions"]
            }
        
        return results
    
    def search_by_vibe(self, vibe: str, top_k: int = 5) -> List[Dict]:
        """
        Search for jewelry by vibe
        
        Args:
            vibe: The vibe to search for
            top_k: Number of results to return
            
        Returns:
            List of products matching the vibe
        """
        # Search with vibe as query
        results = self.search(query=vibe, top_k=top_k * 2)  # Get more to filter
        
        # Filter by exact vibe match
        vibe_results = []
        for result in results:
            if vibe.lower() in [v.lower() for v in result.get("vibes", [])]:
                vibe_results.append(result)
                if len(vibe_results) >= top_k:
                    break
        
        return vibe_results
    
    def get_products_by_vibe(self, vibe: str) -> List[Dict]:
        """
        Get all products that match a specific vibe
        
        Args:
            vibe: The vibe to search for
            
        Returns:
            List of all products matching the vibe
        """
        matching_products = []
        for item in self.metadata:
            if vibe.lower() in [v.lower() for v in item.get("vibes", [])]:
                matching_products.append(item)
        
        return matching_products
    
    def get_vibe_statistics(self) -> Dict[str, int]:
        """
        Get statistics about vibe distribution
        
        Returns:
            Dictionary with vibe counts
        """
        vibe_counts = {}
        for item in self.metadata:
            for vibe in item.get("vibes", []):
                vibe_counts[vibe] = vibe_counts.get(vibe, 0) + 1
        
        return dict(sorted(vibe_counts.items(), key=lambda x: x[1], reverse=True))
    
    def get_celebrities_by_vibe(self, vibe: str) -> List[str]:
        """
        Get celebrities that match a specific vibe
        
        Args:
            vibe: The vibe to search for
            
        Returns:
            List of celebrity names matching the vibe
        """
        if not self.celebrity_engine:
            return []
        
        return self.celebrity_engine.get_celebrities_by_vibe(vibe)
    
    def get_celebrities_by_occasion(self, occasion: str) -> List[str]:
        """
        Get celebrities that match a specific occasion
        
        Args:
            occasion: The occasion to search for
            
        Returns:
            List of celebrity names matching the occasion
        """
        if not self.celebrity_engine:
            return []
        
        return self.celebrity_engine.get_celebrities_by_occasion(occasion)
    
    def get_celebrities_by_price_range(self, min_price: float, max_price: float) -> List[str]:
        """
        Get celebrities that match a price range
        
        Args:
            min_price: Minimum price
            max_price: Maximum price
            
        Returns:
            List of celebrity names matching the price range
        """
        if not self.celebrity_engine:
            return []
        
        return self.celebrity_engine.get_celebrities_by_price_range(min_price, max_price)
    
    def get_all_vibes(self) -> List[str]:
        """Get all available vibes"""
        if not self.vibe_classifier:
            return []
        
        return self.vibe_classifier.get_all_vibes()
    
    def classify_product_vibe(self, product_name: str, collection_name: str = "", 
                             description: str = "") -> List[tuple]:
        """
        Classify a product's vibe
        
        Args:
            product_name: Name of the product
            collection_name: Collection name (optional)
            description: Product description (optional)
            
        Returns:
            List of tuples (vibe, confidence_score)
        """
        if not self.vibe_classifier:
            return []
        
        return self.vibe_classifier.classify_vibe(product_name, collection_name, description)
    
    def get_similar_products(self, product_id: int, top_k: int = 5) -> List[Dict]:
        """
        Get products similar to a specific product
        
        Args:
            product_id: ID of the reference product
            top_k: Number of similar products to return
            
        Returns:
            List of similar products
        """
        # Find the reference product
        reference_product = None
        for item in self.metadata:
            if item["id"] == product_id:
                reference_product = item
                break
        
        if not reference_product:
            return []
        
        # Use the product's description as query
        query = reference_product["description"]
        
        # Search for similar products
        results = self.search(query=query, top_k=top_k + 1)  # +1 to exclude the reference
        
        # Remove the reference product from results
        similar_products = [r for r in results if r["id"] != product_id]
        
        return similar_products[:top_k]
    
    def get_recommendations_for_occasion(self, occasion: str, top_k: int = 5) -> List[Dict]:
        """
        Get jewelry recommendations for a specific occasion
        
        Args:
            occasion: The occasion (e.g., 'wedding', 'party', 'daily wear')
            top_k: Number of recommendations to return
            
        Returns:
            List of recommended products
        """
        # Search with occasion as query
        results = self.search(query=occasion, top_k=top_k)
        
        # Add occasion context
        for result in results:
            result["occasion_recommendation"] = {
                "occasion": occasion,
                "reason": f"Perfect for {occasion} events"
            }
        
        return results
