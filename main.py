import uvicorn
import os
from src.api import app

def main():
    """Run the FastAPI application"""
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

if __name__ == "__main__":
    main()
