import json
import pandas as pd
import numpy as np
from pathlib import Path
from sentence_transformers import SentenceTransformer
import faiss
from vibe_classifier import VibeClassifier
import re

def generate_evol_jewels_url(product_name: str, collection_name: str = "") -> str:
    """
    Generate a proper Evol Jewels URL based on product name and collection
    This creates URLs that match the actual Evol Jewels website structure
    """
    # Clean product name for URL
    clean_name = re.sub(r'[^\w\s-]', '', product_name.lower())
    clean_name = re.sub(r'\s+', '-', clean_name.strip())
    
    # Base URL structure from Evol Jewels
    base_url = "https://evoljewels.com/products"
    
    # Create URL path
    if collection_name and collection_name != "":
        # Include collection in URL if available
        clean_collection = re.sub(r'[^\w\s-]', '', collection_name.lower())
        clean_collection = re.sub(r'\s+', '-', clean_collection.strip())
        url_path = f"{clean_collection}/{clean_name}"
    else:
        url_path = clean_name
    
    return f"{base_url}/{url_path}"

def extract_existing_urls(df: pd.DataFrame) -> dict:
    """
    Extract any existing URLs from the dataset
    Returns a mapping of product names to URLs if found
    """
    url_mapping = {}
    
    for col in df.columns:
        for idx, val in df[col].items():
            if pd.notna(val) and isinstance(val, str):
                # Check for various URL patterns
                if any(pattern in val.lower() for pattern in ['http', 'evoljewels', '.com', 'www']):
                    product_name = str(df.iloc[idx]['Product Name'])
                    url_mapping[product_name] = val
    
    return url_mapping

def preprocess_and_index():
    """
    Preprocessing pipeline:
    1. Load Excel dataset
    2. Create rich descriptions
    3. Generate embeddings
    4. Build FAISS index
    """
    
    DATA_PATH = Path("data/Evol Jewels Hackathon Database .xlsx")
    OUTPUT_DIR = Path("indexed_data")
    OUTPUT_DIR.mkdir(exist_ok=True)
    
    print("📂 Loading dataset...")
    df = pd.read_excel(DATA_PATH, sheet_name=0)
    
    # Clean and prepare data
    df = df.dropna(subset=["Product Name"])
    df["price"] = pd.to_numeric(df["Price"], errors="coerce")
    
    # Create rich descriptions for embeddings
    def create_description(row):
        parts = []
        for col in ["Product Name", "Collection Name", "Category"]:
            val = row.get(col)
            if pd.notna(val) and str(val).strip():
                parts.append(str(val).strip())
        return " | ".join(parts) if parts else "jewelry item"
    
    df["description"] = df.apply(create_description, axis=1)
    df = df.reset_index(drop=True)
    
    # Initialize vibe classifier
    print("🎨 Initializing vibe classifier...")
    vibe_classifier = VibeClassifier()
    
    # Extract any existing URLs from the dataset
    print("🔍 Checking for existing product URLs...")
    existing_urls = extract_existing_urls(df)
    if existing_urls:
        print(f"✅ Found {len(existing_urls)} existing URLs in dataset")
    else:
        print("ℹ️ No existing URLs found, will generate based on Evol Jewels structure")
    
    # Prepare metadata with vibe classification
    metadata = []
    for idx, row in df.iterrows():
        product_name = str(row.get("Product Name", "")).strip()
        collection_name = str(row.get("Collection Name", "")) if pd.notna(row.get("Collection Name")) else ""
        
        # Classify vibes
        vibes = vibe_classifier.classify_vibe(
            product_name=product_name,
            collection_name=collection_name,
            description=row["description"]
        )
        
        # Use existing URL if available, otherwise generate one
        if product_name in existing_urls:
            product_url = existing_urls[product_name]
        else:
            product_url = generate_evol_jewels_url(product_name, collection_name)
        
        metadata.append({
            "id": int(idx),
            "product_name": product_name,
            "collection": collection_name if collection_name else None,
            "category": str(row.get("Category", "")) if pd.notna(row.get("Category")) else None,
            "price": float(row["price"]) if pd.notna(row["price"]) else None,
            "images": str(row.get("Images", "")) if pd.notna(row.get("Images")) else None,
            "description": row["description"],
            "product_url": product_url,
            "vibes": [vibe for vibe, score in vibes],
            "primary_vibe": vibes[0][0] if vibes else "classic",
            "vibe_scores": {vibe: float(score) for vibe, score in vibes}
        })
    
    # Save metadata
    with open(OUTPUT_DIR / "metadata.json", "w", encoding="utf-8") as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Saved metadata for {len(metadata)} products")
    
    # Generate embeddings
    print("🤖 Loading embedding model (all-MiniLM-L6-v2)...")
    model = SentenceTransformer("all-MiniLM-L6-v2")
    
    texts = [item["description"] for item in metadata]
    print(f"🔄 Generating embeddings for {len(texts)} items...")
    embeddings = model.encode(
        texts,
        show_progress_bar=True,
        convert_to_numpy=True,
        batch_size=32
    )
    
    # Normalize for cosine similarity
    norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
    norms[norms == 0] = 1e-9
    embeddings = embeddings / norms
    
    # Build FAISS index
    print("🔧 Building FAISS index...")
    dim = embeddings.shape[1]
    index = faiss.IndexFlatIP(dim)  # Inner product on normalized = cosine
    index.add(embeddings.astype("float32"))
    
    # Save index and embeddings
    faiss.write_index(index, str(OUTPUT_DIR / "faiss.index"))
    np.save(OUTPUT_DIR / "embeddings.npy", embeddings)
    
    # Generate vibe statistics
    vibe_stats = {}
    for item in metadata:
        for vibe in item.get("vibes", []):
            vibe_stats[vibe] = vibe_stats.get(vibe, 0) + 1
    
    print(f"✅ Indexing complete!")
    print(f"   - Products indexed: {len(metadata)}")
    print(f"   - Embedding dimension: {dim}")
    print(f"   - Output directory: {OUTPUT_DIR}")
    print(f"   - Vibe distribution: {dict(sorted(vibe_stats.items(), key=lambda x: x[1], reverse=True)[:5])}")
    
    return len(metadata)

if __name__ == "__main__":
    preprocess_and_index()
