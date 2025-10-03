import json
from typing import List, Dict, Optional, Tuple
from pathlib import Path
import re
from difflib import get_close_matches

class CelebrityInspirationEngine:
    """
    Maps celebrity styles to jewelry vibes and collections
    This addresses the "Celebrity Inspiration Engine" requirement from the problem statement
    """
    
    def __init__(self, data_file: Optional[str] = None):
        """
        Initialize the celebrity inspiration engine
        
        Args:
            data_file: Optional path to custom celebrity data JSON file
        """
        self.data_file = data_file
        self.celebrity_styles = self._load_celebrity_data()
        self.vibe_collections = self._load_vibe_collections()
        
    def _load_celebrity_data(self) -> Dict:
        """Load celebrity style database"""
        if self.data_file and Path(self.data_file).exists():
            with open(self.data_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        
        # Default celebrity database
        return {
            "deepika padukone": {
                "vibes": ["elegant", "royal", "traditional", "sophisticated"],
                "occasions": ["wedding", "red carpet", "festive", "formal"],
                "keywords": ["gold", "statement", "necklace", "jewelry", "heritage", "maharani"],
                "price_range": {"min": 100000, "max": 1000000},
                "preferred_categories": ["necklace", "earrings", "bracelet"],
                "style_description": "Royal elegance with traditional Indian influences"
            },
            "priyanka chopra": {
                "vibes": ["modern", "bold", "glamorous", "contemporary"],
                "occasions": ["party", "red carpet", "awards", "fashion event"],
                "keywords": ["diamond", "contemporary", "earrings", "statement", "bold"],
                "price_range": {"min": 50000, "max": 500000},
                "preferred_categories": ["earrings", "ring", "bracelet"],
                "style_description": "Bold and glamorous with modern edge"
            },
            "alia bhatt": {
                "vibes": ["minimalist", "young", "contemporary", "delicate"],
                "occasions": ["daily wear", "casual", "brunch", "work"],
                "keywords": ["delicate", "simple", "gold", "minimal", "dainty"],
                "price_range": {"min": 10000, "max": 100000},
                "preferred_categories": ["earrings", "pendant", "ring"],
                "style_description": "Minimalist and contemporary with youthful charm"
            },
            "sonam kapoor": {
                "vibes": ["trendy", "experimental", "fashion-forward", "artistic"],
                "occasions": ["party", "fashion event", "art gallery", "premiere"],
                "keywords": ["statement", "unique", "bold", "artistic", "experimental"],
                "price_range": {"min": 25000, "max": 300000},
                "preferred_categories": ["earrings", "necklace", "bracelet"],
                "style_description": "Fashion-forward with experimental and artistic flair"
            },
            "kareena kapoor": {
                "vibes": ["classic", "elegant", "timeless", "sophisticated"],
                "occasions": ["wedding", "festive", "family function", "formal"],
                "keywords": ["traditional", "gold", "heritage", "classic", "elegant"],
                "price_range": {"min": 50000, "max": 400000},
                "preferred_categories": ["necklace", "earrings", "bangle"],
                "style_description": "Classic elegance with timeless appeal"
            },
            "anushka sharma": {
                "vibes": ["elegant", "modern", "sophisticated", "refined"],
                "occasions": ["wedding", "party", "formal", "anniversary"],
                "keywords": ["diamond", "contemporary", "refined", "elegant", "sophisticated"],
                "price_range": {"min": 75000, "max": 600000},
                "preferred_categories": ["necklace", "earrings", "ring"],
                "style_description": "Sophisticated elegance with modern refinement"
            },
            "katrina kaif": {
                "vibes": ["glamorous", "bold", "contemporary", "striking"],
                "occasions": ["party", "red carpet", "awards", "premiere"],
                "keywords": ["diamond", "bold", "glamorous", "striking", "contemporary"],
                "price_range": {"min": 100000, "max": 800000},
                "preferred_categories": ["earrings", "necklace", "bracelet"],
                "style_description": "Glamorous and bold with striking contemporary appeal"
            },
            "kangana ranaut": {
                "vibes": ["bohemian", "artistic", "unique", "free-spirited"],
                "occasions": ["art event", "casual", "festival", "creative gathering"],
                "keywords": ["bohemian", "artistic", "unique", "handcrafted", "ethnic"],
                "price_range": {"min": 15000, "max": 200000},
                "preferred_categories": ["earrings", "pendant", "bracelet"],
                "style_description": "Bohemian and artistic with unique free-spirited charm"
            }
        }
    
    def _load_vibe_collections(self) -> Dict:
        """Load vibe to collection mapping"""
        return {
            "royal": ["Heritage Collection", "Royal Collection", "Traditional", "Maharani"],
            "minimalist": ["Contemporary", "Modern", "Sleek", "Minimal"],
            "bohemian": ["Boho", "Casual", "Free Spirit", "Artistic"],
            "elegant": ["Elegant", "Sophisticated", "Classic", "Refined"],
            "traditional": ["Traditional", "Heritage", "Cultural", "Classic"],
            "modern": ["Modern", "Contemporary", "Trendy", "Sleek"],
            "glamorous": ["Glamorous", "Luxury", "Diamond", "Sparkle"],
            "vintage": ["Vintage", "Antique", "Retro", "Heritage"],
            "statement": ["Statement", "Bold", "Dramatic", "Oversized"],
            "festive": ["Festive", "Celebration", "Bridal", "Wedding"]
        }
    
    def search_by_celebrity(self, celebrity_name: str) -> Optional[Dict]:
        """
        Get jewelry preferences based on celebrity style
        
        Args:
            celebrity_name: Name of the celebrity
            
        Returns:
            Dictionary with celebrity style data or None if not found
        """
        celebrity_name = celebrity_name.lower().strip()
        
        # Direct match
        if celebrity_name in self.celebrity_styles:
            return self.celebrity_styles[celebrity_name]
        
        # Fuzzy matching for partial names
        celebrity_names = list(self.celebrity_styles.keys())
        matches = get_close_matches(celebrity_name, celebrity_names, n=1, cutoff=0.6)
        
        if matches:
            return self.celebrity_styles[matches[0]]
        
        # Partial string matching
        for celeb, style in self.celebrity_styles.items():
            if celebrity_name in celeb or celeb in celebrity_name:
                return style
        
        return None
    
    def get_query_from_celebrity(self, celebrity_name: str) -> str:
        """
        Convert celebrity name to search query
        
        Args:
            celebrity_name: Name of the celebrity
            
        Returns:
            Search query string optimized for the recommender
        """
        style = self.search_by_celebrity(celebrity_name)
        if not style:
            return ""
        
        # Combine vibes and keywords for better search
        query_parts = style["vibes"][:2] + style["keywords"][:3]
        return " ".join(query_parts)
    
    def get_celebrity_recommendations(self, celebrity_name: str) -> Dict:
        """
        Get comprehensive recommendation parameters for a celebrity
        
        Args:
            celebrity_name: Name of the celebrity
            
        Returns:
            Dictionary with recommendation parameters
        """
        style = self.search_by_celebrity(celebrity_name)
        if not style:
            return {}
        
        return {
            "query": self.get_query_from_celebrity(celebrity_name),
            "vibes": style["vibes"],
            "occasions": style["occasions"],
            "keywords": style["keywords"],
            "price_range": style["price_range"],
            "preferred_categories": style["preferred_categories"],
            "style_description": style["style_description"]
        }
    
    def list_celebrities(self) -> List[str]:
        """Get all available celebrities"""
        return sorted(list(self.celebrity_styles.keys()))
    
    def get_celebrities_by_vibe(self, vibe: str) -> List[str]:
        """
        Get celebrities that match a specific vibe
        
        Args:
            vibe: The vibe to search for
            
        Returns:
            List of celebrity names matching the vibe
        """
        matching_celebrities = []
        for celeb, style in self.celebrity_styles.items():
            if vibe.lower() in [v.lower() for v in style["vibes"]]:
                matching_celebrities.append(celeb)
        
        return matching_celebrities
    
    def get_celebrities_by_occasion(self, occasion: str) -> List[str]:
        """
        Get celebrities that match a specific occasion
        
        Args:
            occasion: The occasion to search for
            
        Returns:
            List of celebrity names matching the occasion
        """
        matching_celebrities = []
        for celeb, style in self.celebrity_styles.items():
            if occasion.lower() in [o.lower() for o in style["occasions"]]:
                matching_celebrities.append(celeb)
        
        return matching_celebrities
    
    def get_celebrities_by_price_range(self, min_price: float, max_price: float) -> List[str]:
        """
        Get celebrities that match a price range
        
        Args:
            min_price: Minimum price
            max_price: Maximum price
            
        Returns:
            List of celebrity names matching the price range
        """
        matching_celebrities = []
        for celeb, style in self.celebrity_styles.items():
            celeb_min = style["price_range"]["min"]
            celeb_max = style["price_range"]["max"]
            
            # Check if price ranges overlap
            if not (max_price < celeb_min or min_price > celeb_max):
                matching_celebrities.append(celeb)
        
        return matching_celebrities
    
    def add_celebrity(self, name: str, style_data: Dict) -> bool:
        """
        Add a new celebrity to the database
        
        Args:
            name: Celebrity name
            style_data: Dictionary with style information
            
        Returns:
            True if added successfully, False otherwise
        """
        try:
            self.celebrity_styles[name.lower()] = style_data
            return True
        except Exception:
            return False
    
    def save_celebrity_data(self, file_path: str) -> bool:
        """
        Save celebrity data to JSON file
        
        Args:
            file_path: Path to save the data
            
        Returns:
            True if saved successfully, False otherwise
        """
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(self.celebrity_styles, f, ensure_ascii=False, indent=2)
            return True
        except Exception:
            return False
    
    def get_vibe_collections(self, vibe: str) -> List[str]:
        """
        Get collections associated with a vibe
        
        Args:
            vibe: The vibe to search for
            
        Returns:
            List of collection names
        """
        return self.vibe_collections.get(vibe.lower(), [])
    
    def get_all_vibes(self) -> List[str]:
        """Get all available vibes"""
        return list(self.vibe_collections.keys())
    
    def search_celebrities(self, query: str) -> List[Tuple[str, float]]:
        """
        Search celebrities by query with similarity scores
        
        Args:
            query: Search query
            
        Returns:
            List of tuples (celebrity_name, similarity_score)
        """
        query = query.lower()
        results = []
        
        for celeb, style in self.celebrity_styles.items():
            score = 0
            
            # Check name similarity
            if query in celeb:
                score += 0.5
            
            # Check vibe similarity
            for vibe in style["vibes"]:
                if query in vibe.lower():
                    score += 0.3
            
            # Check keyword similarity
            for keyword in style["keywords"]:
                if query in keyword.lower():
                    score += 0.2
            
            if score > 0:
                results.append((celeb, score))
        
        # Sort by score (highest first)
        results.sort(key=lambda x: x[1], reverse=True)
        return results
