// Client-side celebrity data
import { Celebrity } from '../types/api';

export const celebrities: Celebrity[] = [
  {
    celebrity_name: "deepika padukone",
    style_description: "Royal elegance with traditional Indian influences",
    vibes: ["elegant", "royal", "traditional", "sophisticated"],
    occasions: ["wedding", "red carpet", "festive", "formal"],
    keywords: ["gold", "statement", "necklace", "jewelry", "heritage", "maharani"],
    price_range: { min: 100000, max: 1000000 },
    preferred_categories: ["necklace", "earrings", "bracelet"]
  },
  {
    celebrity_name: "priyanka chopra",
    style_description: "Bold and glamorous with modern edge",
    vibes: ["modern", "bold", "glamorous", "contemporary"],
    occasions: ["party", "red carpet", "awards", "fashion event"],
    keywords: ["diamond", "contemporary", "earrings", "statement", "bold"],
    price_range: { min: 50000, max: 500000 },
    preferred_categories: ["earrings", "ring", "bracelet"]
  },
  {
    celebrity_name: "alia bhatt",
    style_description: "Minimalist and contemporary with youthful charm",
    vibes: ["minimalist", "young", "contemporary", "delicate"],
    occasions: ["daily wear", "casual", "brunch", "work"],
    keywords: ["delicate", "simple", "gold", "minimal", "dainty"],
    price_range: { min: 10000, max: 100000 },
    preferred_categories: ["earrings", "pendant", "ring"]
  },
  {
    celebrity_name: "sonam kapoor",
    style_description: "Fashion-forward with experimental and artistic flair",
    vibes: ["trendy", "experimental", "fashion-forward", "artistic"],
    occasions: ["party", "fashion event", "art gallery", "premiere"],
    keywords: ["statement", "unique", "bold", "artistic", "experimental"],
    price_range: { min: 25000, max: 300000 },
    preferred_categories: ["earrings", "necklace", "bracelet"]
  },
  {
    celebrity_name: "kareena kapoor",
    style_description: "Classic elegance with timeless appeal",
    vibes: ["classic", "elegant", "timeless", "sophisticated"],
    occasions: ["wedding", "festive", "family function", "formal"],
    keywords: ["traditional", "gold", "heritage", "classic", "elegant"],
    price_range: { min: 50000, max: 400000 },
    preferred_categories: ["necklace", "earrings", "bangle"]
  },
  {
    celebrity_name: "anushka sharma",
    style_description: "Sophisticated elegance with modern refinement",
    vibes: ["elegant", "modern", "sophisticated", "refined"],
    occasions: ["wedding", "party", "formal", "anniversary"],
    keywords: ["diamond", "contemporary", "refined", "elegant", "sophisticated"],
    price_range: { min: 75000, max: 600000 },
    preferred_categories: ["necklace", "earrings", "ring"]
  },
  {
    celebrity_name: "katrina kaif",
    style_description: "Glamorous and bold with striking contemporary appeal",
    vibes: ["glamorous", "bold", "contemporary", "striking"],
    occasions: ["party", "red carpet", "awards", "premiere"],
    keywords: ["diamond", "bold", "glamorous", "striking", "contemporary"],
    price_range: { min: 100000, max: 800000 },
    preferred_categories: ["earrings", "necklace", "bracelet"]
  },
  {
    celebrity_name: "kangana ranaut",
    style_description: "Bohemian and artistic with unique free-spirited charm",
    vibes: ["bohemian", "artistic", "unique", "free-spirited"],
    occasions: ["art event", "casual", "festival", "creative gathering"],
    keywords: ["bohemian", "artistic", "unique", "handcrafted", "ethnic"],
    price_range: { min: 15000, max: 200000 },
    preferred_categories: ["earrings", "pendant", "bracelet"]
  }
];

export const getCelebrityByName = (name: string): Celebrity | undefined => {
  return celebrities.find(celeb => 
    celeb.celebrity_name.toLowerCase().includes(name.toLowerCase())
  );
};

export const getCelebritiesByVibe = (vibe: string): Celebrity[] => {
  return celebrities.filter(celeb => 
    celeb.vibes.some(v => v.toLowerCase().includes(vibe.toLowerCase()))
  );
};

export const getCelebritiesByOccasion = (occasion: string): Celebrity[] => {
  return celebrities.filter(celeb => 
    celeb.occasions.some(o => o.toLowerCase().includes(occasion.toLowerCase()))
  );
};
