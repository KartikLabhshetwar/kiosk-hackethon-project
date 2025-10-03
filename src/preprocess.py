import json
import pandas as pd
import numpy as np
from pathlib import Path
from sentence_transformers import SentenceTransformer
import faiss

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
    
    # Prepare metadata
    metadata = []
    for idx, row in df.iterrows():
        # Generate Evol Jewels product URL
        product_name = str(row.get("Product Name", "")).strip()
        product_url = f"https://evoljewels.com/products/{product_name.lower().replace(' ', '-')}"
        
        metadata.append({
            "id": int(idx),
            "product_name": product_name,
            "collection": str(row.get("Collection Name", "")) if pd.notna(row.get("Collection Name")) else None,
            "category": str(row.get("Category", "")) if pd.notna(row.get("Category")) else None,
            "price": float(row["price"]) if pd.notna(row["price"]) else None,
            "images": str(row.get("Images", "")) if pd.notna(row.get("Images")) else None,
            "description": row["description"],
            "product_url": product_url,
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
    
    print(f"✅ Indexing complete!")
    print(f"   - Products indexed: {len(metadata)}")
    print(f"   - Embedding dimension: {dim}")
    print(f"   - Output directory: {OUTPUT_DIR}")
    
    return len(metadata)

if __name__ == "__main__":
    preprocess_and_index()
