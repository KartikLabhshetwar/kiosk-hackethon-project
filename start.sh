#!/bin/bash

# Memory optimization for Render deployment
export TOKENIZERS_PARALLELISM=false
export OMP_NUM_THREADS=1
export MKL_NUM_THREADS=1

# Start the API
uvicorn src.api:app --host 0.0.0.0 --port $PORT --workers 1
