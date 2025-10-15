/**
 * Vibe Classifier Service
 * Ported from Python vibe_classifier.py
 * Auto-classify jewelry items by 'vibe' based on name/collection
 */

import * as fs from 'fs';
import { VibeKeywords, VibeWeights, VibeClassification, ProductMetadata } from '../models/types';

export class VibeService {
  private vibeKeywords: VibeKeywords;
  private vibeWeights: VibeWeights;
  private confidenceThreshold: number;

  constructor(configFile?: string) {
    this.vibeKeywords = this.loadVibeKeywords(configFile);
    this.vibeWeights = this.loadVibeWeights();
    this.confidenceThreshold = 0.1;
  }

  /**
   * Load vibe keyword mappings
   */
  private loadVibeKeywords(configFile?: string): VibeKeywords {
    if (configFile && fs.existsSync(configFile)) {
      try {
        const data = fs.readFileSync(configFile, 'utf-8');
        const config = JSON.parse(data);
        return config.vibe_keywords || this.getDefaultVibeKeywords();
      } catch (error) {
        console.warn(`Failed to load vibe config from ${configFile}, using default keywords`);
      }
    }

    return this.getDefaultVibeKeywords();
  }

  /**
   * Get default comprehensive vibe keyword database (ported from Python)
   */
  private getDefaultVibeKeywords(): VibeKeywords {
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
    };
  }

  /**
   * Load weights for different vibes (higher = more important)
   */
  private loadVibeWeights(): VibeWeights {
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
    };
  }

  /**
   * Classify product into one or more vibes with confidence scores
   */
  public classifyVibe(
    productName: string,
    collectionName: string = "",
    description: string = ""
  ): VibeClassification[] {
    // Combine all text for analysis
    const text = `${productName} ${collectionName} ${description}`.toLowerCase();

    // Clean and tokenize text
    const cleanText = text.replace(/[^\w\s]/g, ' ');
    const words = cleanText.split(/\s+/).filter(word => word.length > 0);

    const vibeScores: { [vibe: string]: number } = {};

    for (const [vibe, keywords] of Object.entries(this.vibeKeywords)) {
      if (!keywords) continue;
      let score = 0;
      let totalMatches = 0;

      for (const keyword of keywords) {
        const keywordLower = keyword.toLowerCase();

        // Exact word match (higher weight)
        if (words.includes(keywordLower)) {
          score += 2.0;
          totalMatches++;
        }
        // Partial match (lower weight)
        else if (words.some(word => word.includes(keywordLower))) {
          score += 1.0;
          totalMatches++;
        }
        // Substring match (even lower weight)
        else if (text.includes(keywordLower)) {
          score += 0.5;
          totalMatches++;
        }
      }

      // Apply vibe weight
      if (totalMatches > 0) {
        score *= this.vibeWeights[vibe] || 1.0;
        // Normalize by number of keywords for this vibe
        score = score / keywords.length;
        vibeScores[vibe] = score;
      }
    }

    // Filter by confidence threshold and sort
    const filteredScores = Object.entries(vibeScores)
      .filter(([_, score]) => score >= this.confidenceThreshold)
      .map(([vibe, score]) => ({ vibe, confidence: score }));

    // Sort by confidence score (highest first)
    filteredScores.sort((a, b) => b.confidence - a.confidence);

    // Return top 3 vibes or all if less than 3
    return filteredScores.slice(0, 3);
  }

  /**
   * Get the primary (most confident) vibe for a product
   */
  public getPrimaryVibe(
    productName: string,
    collectionName: string = "",
    description: string = ""
  ): string | null {
    const vibes = this.classifyVibe(productName, collectionName, description);
    return vibes.length > 0 && vibes[0] ? vibes[0].vibe : null;
  }

  /**
   * Get list of all possible vibes
   */
  public getAllVibes(): string[] {
    return Object.keys(this.vibeKeywords);
  }

  /**
   * Get keywords for a specific vibe
   */
  public getVibeKeywords(vibe: string): string[] {
    return this.vibeKeywords[vibe.toLowerCase()] || [];
  }

  /**
   * Add keywords for a vibe
   */
  public addVibeKeywords(vibe: string, keywords: string[]): boolean {
    try {
      const vibeKey = vibe.toLowerCase();
      if (!this.vibeKeywords[vibeKey]) {
        this.vibeKeywords[vibeKey] = [];
      }

      // Add new keywords (avoid duplicates)
      const existing = new Set(this.vibeKeywords[vibeKey].map(k => k.toLowerCase()));
      const newKeywords = keywords.filter(kw => !existing.has(kw.toLowerCase()));
      this.vibeKeywords[vibeKey].push(...newKeywords);

      return true;
    } catch (error) {
      console.error('Failed to add vibe keywords:', error);
      return false;
    }
  }

  /**
   * Classify multiple products at once
   */
  public classifyBatch(products: ProductMetadata[]): ProductMetadata[] {
    return products.map(product => {
      const productCopy = { ...product };

      // Classify vibes
      const vibes = this.classifyVibe(
        product.product_name,
        product.collection || '',
        product.description
      );

      // Add vibe information
      productCopy.vibes = vibes.map(v => v.vibe);
      productCopy.primary_vibe = vibes.length > 0 && vibes[0] ? vibes[0].vibe : 'classic';
      productCopy.vibe_scores = vibes.reduce((acc, v) => {
        acc[v.vibe] = v.confidence;
        return acc;
      }, {} as { [vibe: string]: number });

      return productCopy;
    });
  }

  /**
   * Get statistics about vibe distribution in a product set
   */
  public getVibeStatistics(products: ProductMetadata[]): { [vibe: string]: number } {
    const vibeCounts: { [vibe: string]: number } = {};

    for (const product of products) {
      if (product.vibes) {
        for (const vibe of product.vibes) {
          vibeCounts[vibe] = (vibeCounts[vibe] || 0) + 1;
        }
      }
    }

    return vibeCounts;
  }

  /**
   * Find products that match a specific vibe
   */
  public findProductsByVibe(products: ProductMetadata[], targetVibe: string): ProductMetadata[] {
    const targetVibeLower = targetVibe.toLowerCase();
    return products.filter(product => {
      if (!product.vibes) return false;
      return product.vibes.some(vibe => vibe.toLowerCase() === targetVibeLower);
    });
  }

  /**
   * Calculate similarity between two vibes based on shared keywords
   */
  public getVibeSimilarity(vibe1: string, vibe2: string): number {
    const keywords1 = new Set(this.getVibeKeywords(vibe1));
    const keywords2 = new Set(this.getVibeKeywords(vibe2));

    if (keywords1.size === 0 || keywords2.size === 0) {
      return 0.0;
    }

    const intersection = new Set([...keywords1].filter(k => keywords2.has(k)));
    const union = new Set([...keywords1, ...keywords2]);

    return intersection.size / union.size;
  }

  /**
   * Save vibe configuration to JSON file
   */
  public saveConfig(filePath: string): boolean {
    try {
      const config = {
        vibe_keywords: this.vibeKeywords,
        vibe_weights: this.vibeWeights,
        confidence_threshold: this.confidenceThreshold
      };

      fs.writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf-8');
      return true;
    } catch (error) {
      console.error('Failed to save vibe config:', error);
      return false;
    }
  }

  /**
   * Load vibe configuration from JSON file
   */
  public loadConfig(filePath: string): boolean {
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      const config = JSON.parse(data);

      this.vibeKeywords = config.vibe_keywords || this.vibeKeywords;
      this.vibeWeights = config.vibe_weights || this.vibeWeights;
      this.confidenceThreshold = config.confidence_threshold || this.confidenceThreshold;

      return true;
    } catch (error) {
      console.error('Failed to load vibe config:', error);
      return false;
    }
  }

  /**
   * Get confidence threshold
   */
  public getConfidenceThreshold(): number {
    return this.confidenceThreshold;
  }

  /**
   * Set confidence threshold
   */
  public setConfidenceThreshold(threshold: number): void {
    this.confidenceThreshold = Math.max(0, Math.min(1, threshold));
  }

  /**
   * Get all vibe weights
   */
  public getVibeWeights(): VibeWeights {
    return { ...this.vibeWeights };
  }

  /**
   * Set weight for a specific vibe
   */
  public setVibeWeight(vibe: string, weight: number): boolean {
    try {
      this.vibeWeights[vibe.toLowerCase()] = Math.max(0, weight);
      return true;
    } catch (error) {
      console.error('Failed to set vibe weight:', error);
      return false;
    }
  }
}
