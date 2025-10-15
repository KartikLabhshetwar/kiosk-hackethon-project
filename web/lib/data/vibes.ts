// Client-side vibe classification data
export const vibeKeywords: Record<string, string[]> = {
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
    "extraordinary", "superior", "elite", "top-tier"
  ],
  "artistic": [
    "artistic", "creative", "unique", "handcrafted", "artisan", "custom",
    "designer", "original", "innovative", "expressive", "imaginative",
    "inventive", "crafted", "sculpted", "designed"
  ]
};

export const vibeWeights: Record<string, number> = {
  "royal": 1.0,
  "traditional": 1.0,
  "modern": 1.0,
  "elegant": 1.0,
  "bohemian": 1.0,
  "vintage": 1.0,
  "glamorous": 1.0,
  "minimalist": 1.0,
  "statement": 1.0,
  "festive": 1.0,
  "romantic": 1.0,
  "professional": 1.0,
  "casual": 1.0,
  "luxury": 1.0,
  "artistic": 1.0
};

export const getAllVibes = (): string[] => {
  return Object.keys(vibeKeywords);
};

export const classifyVibe = (productName: string, collection?: string): string[] => {
  const text = `${productName} ${collection || ''}`.toLowerCase();
  const vibeScores: Record<string, number> = {};
  
  // Calculate scores for each vibe
  for (const [vibe, keywords] of Object.entries(vibeKeywords)) {
    let score = 0;
    const weight = vibeWeights[vibe] || 1.0;
    
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        score += weight;
      }
    }
    
    if (score > 0) {
      vibeScores[vibe] = score;
    }
  }
  
  // Sort by score and return top vibes above threshold
  const threshold = 0.1;
  const sortedVibes = Object.entries(vibeScores)
    .filter(([_, score]) => score >= threshold)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([vibe]) => vibe);
  
  return sortedVibes.length > 0 ? sortedVibes : ["classic"];
};

export const getPrimaryVibe = (productName: string, collection?: string): string => {
  const vibes = classifyVibe(productName, collection);
  return vibes[0] || "classic";
};
