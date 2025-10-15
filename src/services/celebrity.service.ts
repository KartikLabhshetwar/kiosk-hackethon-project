/**
 * Celebrity Inspiration Engine Service
 * Ported from Python celebrity_engine.py
 * Maps celebrity styles to jewelry vibes and collections
 */

import * as fs from 'fs';
import { CelebrityDatabase, CelebrityStyle, CelebrityStyleData } from '../models/types';

export class CelebrityService {
  private celebrityStyles: CelebrityDatabase;
  private vibeCollections: { [vibe: string]: string[] };

  constructor(dataFile?: string) {
    this.celebrityStyles = this.loadCelebrityData(dataFile);
    this.vibeCollections = this.loadVibeCollections();
  }

  /**
   * Load celebrity style database
   */
  private loadCelebrityData(dataFile?: string): CelebrityDatabase {
    if (dataFile && fs.existsSync(dataFile)) {
      try {
        const data = fs.readFileSync(dataFile, 'utf-8');
        return JSON.parse(data);
      } catch (error) {
        console.warn(`Failed to load celebrity data from ${dataFile}, using default data`);
      }
    }

    // Default celebrity database (ported from Python)
    return {
      "deepika padukone": {
        vibes: ["elegant", "royal", "traditional", "sophisticated"],
        occasions: ["wedding", "red carpet", "festive", "formal"],
        keywords: ["gold", "statement", "necklace", "jewelry", "heritage", "maharani"],
        price_range: { min: 100000, max: 1000000 },
        preferred_categories: ["necklace", "earrings", "bracelet"],
        style_description: "Royal elegance with traditional Indian influences"
      },
      "priyanka chopra": {
        vibes: ["modern", "bold", "glamorous", "contemporary"],
        occasions: ["party", "red carpet", "awards", "fashion event"],
        keywords: ["diamond", "contemporary", "earrings", "statement", "bold"],
        price_range: { min: 50000, max: 500000 },
        preferred_categories: ["earrings", "ring", "bracelet"],
        style_description: "Bold and glamorous with modern edge"
      },
      "alia bhatt": {
        vibes: ["minimalist", "young", "contemporary", "delicate"],
        occasions: ["daily wear", "casual", "brunch", "work"],
        keywords: ["delicate", "simple", "gold", "minimal", "dainty"],
        price_range: { min: 10000, max: 100000 },
        preferred_categories: ["earrings", "pendant", "ring"],
        style_description: "Minimalist and contemporary with youthful charm"
      },
      "sonam kapoor": {
        vibes: ["trendy", "experimental", "fashion-forward", "artistic"],
        occasions: ["party", "fashion event", "art gallery", "premiere"],
        keywords: ["statement", "unique", "bold", "artistic", "experimental"],
        price_range: { min: 25000, max: 300000 },
        preferred_categories: ["earrings", "necklace", "bracelet"],
        style_description: "Fashion-forward with experimental and artistic flair"
      },
      "kareena kapoor": {
        vibes: ["classic", "elegant", "timeless", "sophisticated"],
        occasions: ["wedding", "festive", "family function", "formal"],
        keywords: ["traditional", "gold", "heritage", "classic", "elegant"],
        price_range: { min: 50000, max: 400000 },
        preferred_categories: ["necklace", "earrings", "bangle"],
        style_description: "Classic elegance with timeless appeal"
      },
      "anushka sharma": {
        vibes: ["elegant", "modern", "sophisticated", "refined"],
        occasions: ["wedding", "party", "formal", "anniversary"],
        keywords: ["diamond", "contemporary", "refined", "elegant", "sophisticated"],
        price_range: { min: 75000, max: 600000 },
        preferred_categories: ["necklace", "earrings", "ring"],
        style_description: "Sophisticated elegance with modern refinement"
      },
      "katrina kaif": {
        vibes: ["glamorous", "bold", "contemporary", "striking"],
        occasions: ["party", "red carpet", "awards", "premiere"],
        keywords: ["diamond", "bold", "glamorous", "striking", "contemporary"],
        price_range: { min: 100000, max: 800000 },
        preferred_categories: ["earrings", "necklace", "bracelet"],
        style_description: "Glamorous and bold with striking contemporary appeal"
      },
      "kangana ranaut": {
        vibes: ["bohemian", "artistic", "unique", "free-spirited"],
        occasions: ["art event", "casual", "festival", "creative gathering"],
        keywords: ["bohemian", "artistic", "unique", "handcrafted", "ethnic"],
        price_range: { min: 15000, max: 200000 },
        preferred_categories: ["earrings", "pendant", "bracelet"],
        style_description: "Bohemian and artistic with unique free-spirited charm"
      }
    };
  }

  /**
   * Load vibe to collection mapping
   */
  private loadVibeCollections(): { [vibe: string]: string[] } {
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
    };
  }

  /**
   * Get jewelry preferences based on celebrity style
   */
  public searchByCelebrity(celebrityName: string): CelebrityStyle | null {
    const normalizedName = celebrityName.toLowerCase().trim();

    // Direct match
    if (this.celebrityStyles[normalizedName]) {
      return this.celebrityStyles[normalizedName];
    }

    // Fuzzy matching for partial names
    const celebrityNames = Object.keys(this.celebrityStyles);
    const matches = this.getCloseMatches(normalizedName, celebrityNames, 1, 0.6);

    if (matches.length > 0 && matches[0]) {
      return this.celebrityStyles[matches[0]] || null;
    }

    // Partial string matching
    for (const [celeb, style] of Object.entries(this.celebrityStyles)) {
      if (normalizedName.includes(celeb) || celeb.includes(normalizedName)) {
        return style;
      }
    }

    return null;
  }

  /**
   * Convert celebrity name to search query
   */
  public getQueryFromCelebrity(celebrityName: string): string {
    const style = this.searchByCelebrity(celebrityName);
    if (!style) {
      return "";
    }

    // Combine vibes and keywords for better search
    const queryParts = [...style.vibes.slice(0, 2), ...style.keywords.slice(0, 3)];
    return queryParts.join(" ");
  }

  /**
   * Get comprehensive recommendation parameters for a celebrity
   */
  public getCelebrityRecommendations(celebrityName: string): CelebrityStyleData | null {
    const style = this.searchByCelebrity(celebrityName);
    if (!style) {
      return null;
    }

    const result: CelebrityStyleData = {
      celebrity_name: celebrityName,
      vibes: style.vibes,
      occasions: style.occasions,
      keywords: style.keywords,
      price_range: style.price_range,
      preferred_categories: style.preferred_categories,
      style_description: style.style_description,
      products: [], // Will be populated by the recommender service
      query: this.getQueryFromCelebrity(celebrityName)
    };
    
    return result;
  }

  /**
   * Get all available celebrities
   */
  public listCelebrities(): string[] {
    return Object.keys(this.celebrityStyles).sort();
  }

  /**
   * Get celebrities that match a specific vibe
   */
  public getCelebritiesByVibe(vibe: string): string[] {
    const matchingCelebrities: string[] = [];
    const targetVibe = vibe.toLowerCase();

    for (const [celeb, style] of Object.entries(this.celebrityStyles)) {
      if (style.vibes.some(v => v.toLowerCase() === targetVibe)) {
        matchingCelebrities.push(celeb);
      }
    }

    return matchingCelebrities;
  }

  /**
   * Get celebrities that match a specific occasion
   */
  public getCelebritiesByOccasion(occasion: string): string[] {
    const matchingCelebrities: string[] = [];
    const targetOccasion = occasion.toLowerCase();

    for (const [celeb, style] of Object.entries(this.celebrityStyles)) {
      if (style.occasions.some(o => o.toLowerCase() === targetOccasion)) {
        matchingCelebrities.push(celeb);
      }
    }

    return matchingCelebrities;
  }

  /**
   * Get celebrities that match a price range
   */
  public getCelebritiesByPriceRange(minPrice: number, maxPrice: number): string[] {
    const matchingCelebrities: string[] = [];

    for (const [celeb, style] of Object.entries(this.celebrityStyles)) {
      const celebMin = style.price_range.min;
      const celebMax = style.price_range.max;

      // Check if price ranges overlap
      if (!(maxPrice < celebMin || minPrice > celebMax)) {
        matchingCelebrities.push(celeb);
      }
    }

    return matchingCelebrities;
  }

  /**
   * Add a new celebrity to the database
   */
  public addCelebrity(name: string, styleData: CelebrityStyle): boolean {
    try {
      this.celebrityStyles[name.toLowerCase()] = styleData;
      return true;
    } catch (error) {
      console.error('Failed to add celebrity:', error);
      return false;
    }
  }

  /**
   * Save celebrity data to JSON file
   */
  public saveCelebrityData(filePath: string): boolean {
    try {
      fs.writeFileSync(filePath, JSON.stringify(this.celebrityStyles, null, 2), 'utf-8');
      return true;
    } catch (error) {
      console.error('Failed to save celebrity data:', error);
      return false;
    }
  }

  /**
   * Get collections associated with a vibe
   */
  public getVibeCollections(vibe: string): string[] {
    return this.vibeCollections[vibe.toLowerCase()] || [];
  }

  /**
   * Get all available vibes
   */
  public getAllVibes(): string[] {
    return Object.keys(this.vibeCollections);
  }

  /**
   * Search celebrities by query with similarity scores
   */
  public searchCelebrities(query: string): Array<[string, number]> {
    const normalizedQuery = query.toLowerCase();
    const results: Array<[string, number]> = [];

    for (const [celeb, style] of Object.entries(this.celebrityStyles)) {
      let score = 0;

      // Check name similarity
      if (celeb.includes(normalizedQuery)) {
        score += 0.5;
      }

      // Check vibe similarity
      for (const vibe of style.vibes) {
        if (vibe.toLowerCase().includes(normalizedQuery)) {
          score += 0.3;
        }
      }

      // Check keyword similarity
      for (const keyword of style.keywords) {
        if (keyword.toLowerCase().includes(normalizedQuery)) {
          score += 0.2;
        }
      }

      if (score > 0) {
        results.push([celeb, score]);
      }
    }

    // Sort by score (highest first)
    return results.sort((a, b) => b[1] - a[1]);
  }

  /**
   * Simple fuzzy string matching (ported from Python's difflib.get_close_matches)
   */
  private getCloseMatches(word: string, possibilities: string[], n: number, cutoff: number): string[] {
    const matches: Array<[string, number]> = [];

    for (const possibility of possibilities) {
      const ratio = this.similarity(word, possibility);
      if (ratio >= cutoff) {
        matches.push([possibility, ratio]);
      }
    }

    // Sort by similarity score (highest first)
    matches.sort((a, b) => b[1] - a[1]);

    return matches.slice(0, n).map(match => match[0]);
  }

  /**
   * Calculate similarity between two strings (simple implementation)
   */
  private similarity(s1: string, s2: string): number {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;

    if (longer.length === 0) {
      return 1.0;
    }

    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) {
      const row = matrix[0];
      if (row) {
        row[i] = i;
      }
    }

    for (let j = 0; j <= str2.length; j++) {
      const row = matrix[j];
      if (row) {
        row[0] = j;
      }
    }

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        const row = matrix[j];
        const prevRow = matrix[j - 1];
        if (row && prevRow) {
          row[i] = Math.min(
            row[i - 1] + 1, // deletion
            prevRow[i] + 1, // insertion
            prevRow[i - 1] + indicator // substitution
          );
        }
      }
    }

    const finalRow = matrix[str2.length];
    return finalRow ? finalRow[str1.length] || 0 : 0;
  }
}
