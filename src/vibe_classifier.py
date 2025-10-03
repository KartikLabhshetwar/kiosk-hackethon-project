import re
from typing import List, Dict, Tuple, Optional
from collections import Counter
import json
from pathlib import Path

class VibeClassifier:
    """
    Auto-classify jewelry items by 'vibe' based on name/collection
    This addresses the "categorized by vibe" requirement from the problem statement
    """
    
    def __init__(self, config_file: Optional[str] = None):
        """
        Initialize the vibe classifier
        
        Args:
            config_file: Optional path to custom vibe configuration JSON file
        """
        self.config_file = config_file
        self.vibe_keywords = self._load_vibe_keywords()
        self.vibe_weights = self._load_vibe_weights()
        self.confidence_threshold = 0.1
        
    def _load_vibe_keywords(self) -> Dict[str, List[str]]:
        """Load vibe keyword mappings"""
        if self.config_file and Path(self.config_file).exists():
            with open(self.config_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        
        # Default comprehensive vibe keyword database
        return {
            "royal": [
                "royal", "heritage", "maharani", "queen", "regal", "majestic",
                "palace", "crown", "throne", "empress", "king", "princess",
                "noble", "aristocratic", "imperial", "sovereign", "dynasty"
            ],
            "traditional": [
                "traditional", "ethnic", "cultural", "classic", "temple",
                "heritage", "ancient", "vintage", "classical", "conventional",
                "customary", "time-honored", "folk", "indigenous", "native"
            ],
            "modern": [
                "modern", "contemporary", "sleek", "minimalist", "simple",
                "clean", "fresh", "new", "current", "trendy", "fashionable",
                "updated", "progressive", "innovative", "cutting-edge"
            ],
            "elegant": [
                "elegant", "sophisticated", "graceful", "refined", "luxury",
                "classy", "polished", "cultured", "tasteful", "chic",
                "stylish", "distinguished", "noble", "premium", "exclusive"
            ],
            "bohemian": [
                "boho", "bohemian", "casual", "free", "artistic", "creative",
                "eclectic", "unconventional", "free-spirited", "hippie",
                "natural", "organic", "handcrafted", "artisan", "rustic"
            ],
            "vintage": [
                "vintage", "antique", "retro", "old", "heritage", "classic",
                "nostalgic", "timeless", "aged", "period", "era", "historical",
                "collectible", "rare", "authentic", "original"
            ],
            "glamorous": [
                "glamorous", "sparkle", "glitter", "dazzle", "shine", "brilliant",
                "luxurious", "opulent", "extravagant", "lavish", "sumptuous",
                "dramatic", "striking", "eye-catching", "show-stopping"
            ],
            "minimalist": [
                "minimal", "simple", "delicate", "subtle", "clean", "basic",
                "essential", "pure", "unadorned", "understated", "restrained",
                "modest", "humble", "quiet", "gentle"
            ],
            "statement": [
                "statement", "bold", "chunky", "oversized", "dramatic", "large",
                "big", "massive", "substantial", "prominent", "conspicuous",
                "eye-catching", "attention-grabbing", "showy", "flashy"
            ],
            "festive": [
                "festive", "celebration", "bridal", "wedding", "party", "ceremony",
                "occasion", "special", "joyful", "merry", "cheerful", "bright",
                "colorful", "vibrant", "lively", "energetic"
            ],
            "romantic": [
                "romantic", "love", "heart", "sweet", "tender", "affectionate",
                "passionate", "intimate", "sentimental", "dreamy", "soft",
                "gentle", "caring", "devoted", "loving"
            ],
            "professional": [
                "professional", "business", "corporate", "formal", "office",
                "work", "career", "executive", "sophisticated", "polished",
                "refined", "appropriate", "suitable", "proper", "decent"
            ],
            "casual": [
                "casual", "everyday", "daily", "informal", "relaxed", "comfortable",
                "easy", "simple", "practical", "functional", "versatile",
                "wearable", "convenient", "effortless", "natural"
            ],
            "luxury": [
                "luxury", "premium", "exclusive", "high-end", "expensive", "costly",
                "valuable", "precious", "rare", "unique", "exceptional",
                "superior", "elite", "top-tier", "first-class"
            ],
            "artistic": [
                "artistic", "creative", "unique", "original", "custom", "handmade",
                "crafted", "designed", "sculpted", "molded", "shaped",
                "innovative", "imaginative", "inventive", "expressive"
            ]
        }
    
    def _load_vibe_weights(self) -> Dict[str, float]:
        """Load weights for different vibes (higher = more important)"""
        return {
            "royal": 1.0,
            "traditional": 1.0,
            "modern": 0.9,
            "elegant": 1.1,
            "bohemian": 0.8,
            "vintage": 0.9,
            "glamorous": 1.0,
            "minimalist": 0.8,
            "statement": 1.2,
            "festive": 1.0,
            "romantic": 0.9,
            "professional": 0.7,
            "casual": 0.6,
            "luxury": 1.1,
            "artistic": 0.9
        }
    
    def classify_vibe(self, product_name: str, collection_name: str = "", 
                     description: str = "") -> List[Tuple[str, float]]:
        """
        Classify product into one or more vibes with confidence scores
        
        Args:
            product_name: Name of the product
            collection_name: Collection name (optional)
            description: Product description (optional)
            
        Returns:
            List of tuples (vibe, confidence_score) sorted by confidence
        """
        # Combine all text for analysis
        text = f"{product_name} {collection_name} {description}".lower()
        
        # Clean and tokenize text
        text = re.sub(r'[^\w\s]', ' ', text)
        words = text.split()
        
        vibe_scores = {}
        
        for vibe, keywords in self.vibe_keywords.items():
            score = 0
            total_matches = 0
            
            for keyword in keywords:
                keyword_lower = keyword.lower()
                
                # Exact word match (higher weight)
                if keyword_lower in words:
                    score += 2.0
                    total_matches += 1
                
                # Partial match (lower weight)
                elif any(keyword_lower in word for word in words):
                    score += 1.0
                    total_matches += 1
                
                # Substring match (even lower weight)
                elif keyword_lower in text:
                    score += 0.5
                    total_matches += 1
            
            # Apply vibe weight
            if total_matches > 0:
                score *= self.vibe_weights.get(vibe, 1.0)
                # Normalize by number of keywords for this vibe
                score = score / len(keywords)
                vibe_scores[vibe] = score
        
        # Filter by confidence threshold and sort
        filtered_scores = [
            (vibe, score) for vibe, score in vibe_scores.items() 
            if score >= self.confidence_threshold
        ]
        
        # Sort by confidence score (highest first)
        filtered_scores.sort(key=lambda x: x[1], reverse=True)
        
        # Return top 3 vibes or all if less than 3
        return filtered_scores[:3] if len(filtered_scores) >= 3 else filtered_scores
    
    def get_primary_vibe(self, product_name: str, collection_name: str = "", 
                        description: str = "") -> Optional[str]:
        """
        Get the primary (most confident) vibe for a product
        
        Args:
            product_name: Name of the product
            collection_name: Collection name (optional)
            description: Product description (optional)
            
        Returns:
            Primary vibe name or None if no confident match
        """
        vibes = self.classify_vibe(product_name, collection_name, description)
        return vibes[0][0] if vibes else None
    
    def get_all_vibes(self) -> List[str]:
        """Get list of all possible vibes"""
        return list(self.vibe_keywords.keys())
    
    def get_vibe_keywords(self, vibe: str) -> List[str]:
        """
        Get keywords for a specific vibe
        
        Args:
            vibe: The vibe name
            
        Returns:
            List of keywords for the vibe
        """
        return self.vibe_keywords.get(vibe.lower(), [])
    
    def add_vibe_keywords(self, vibe: str, keywords: List[str]) -> bool:
        """
        Add keywords for a vibe
        
        Args:
            vibe: The vibe name
            keywords: List of keywords to add
            
        Returns:
            True if added successfully, False otherwise
        """
        try:
            if vibe.lower() not in self.vibe_keywords:
                self.vibe_keywords[vibe.lower()] = []
            
            # Add new keywords (avoid duplicates)
            existing = set(self.vibe_keywords[vibe.lower()])
            new_keywords = [kw for kw in keywords if kw.lower() not in existing]
            self.vibe_keywords[vibe.lower()].extend(new_keywords)
            
            return True
        except Exception:
            return False
    
    def classify_batch(self, products: List[Dict]) -> List[Dict]:
        """
        Classify multiple products at once
        
        Args:
            products: List of product dictionaries with 'product_name', 'collection', 'description'
            
        Returns:
            List of products with added 'vibes' field
        """
        results = []
        
        for product in products:
            product_copy = product.copy()
            
            # Classify vibes
            vibes = self.classify_vibe(
                product.get('product_name', ''),
                product.get('collection', ''),
                product.get('description', '')
            )
            
            # Add vibe information
            product_copy['vibes'] = [vibe for vibe, score in vibes]
            product_copy['primary_vibe'] = vibes[0][0] if vibes else None
            product_copy['vibe_scores'] = {vibe: score for vibe, score in vibes}
            
            results.append(product_copy)
        
        return results
    
    def get_vibe_statistics(self, products: List[Dict]) -> Dict[str, int]:
        """
        Get statistics about vibe distribution in a product set
        
        Args:
            products: List of products with vibe information
            
        Returns:
            Dictionary with vibe counts
        """
        vibe_counts = Counter()
        
        for product in products:
            if 'vibes' in product:
                for vibe in product['vibes']:
                    vibe_counts[vibe] += 1
        
        return dict(vibe_counts)
    
    def find_products_by_vibe(self, products: List[Dict], target_vibe: str) -> List[Dict]:
        """
        Find products that match a specific vibe
        
        Args:
            products: List of products with vibe information
            target_vibe: The vibe to search for
            
        Returns:
            List of products matching the vibe
        """
        matching_products = []
        target_vibe = target_vibe.lower()
        
        for product in products:
            if 'vibes' in product:
                if any(vibe.lower() == target_vibe for vibe in product['vibes']):
                    matching_products.append(product)
        
        return matching_products
    
    def get_vibe_similarity(self, vibe1: str, vibe2: str) -> float:
        """
        Calculate similarity between two vibes based on shared keywords
        
        Args:
            vibe1: First vibe
            vibe2: Second vibe
            
        Returns:
            Similarity score between 0 and 1
        """
        keywords1 = set(self.get_vibe_keywords(vibe1))
        keywords2 = set(self.get_vibe_keywords(vibe2))
        
        if not keywords1 or not keywords2:
            return 0.0
        
        intersection = len(keywords1.intersection(keywords2))
        union = len(keywords1.union(keywords2))
        
        return intersection / union if union > 0 else 0.0
    
    def save_config(self, file_path: str) -> bool:
        """
        Save vibe configuration to JSON file
        
        Args:
            file_path: Path to save the configuration
            
        Returns:
            True if saved successfully, False otherwise
        """
        try:
            config = {
                "vibe_keywords": self.vibe_keywords,
                "vibe_weights": self.vibe_weights,
                "confidence_threshold": self.confidence_threshold
            }
            
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(config, f, ensure_ascii=False, indent=2)
            
            return True
        except Exception:
            return False
    
    def load_config(self, file_path: str) -> bool:
        """
        Load vibe configuration from JSON file
        
        Args:
            file_path: Path to load the configuration from
            
        Returns:
            True if loaded successfully, False otherwise
        """
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                config = json.load(f)
            
            self.vibe_keywords = config.get("vibe_keywords", self.vibe_keywords)
            self.vibe_weights = config.get("vibe_weights", self.vibe_weights)
            self.confidence_threshold = config.get("confidence_threshold", self.confidence_threshold)
            
            return True
        except Exception:
            return False
