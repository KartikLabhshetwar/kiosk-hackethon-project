#!/bin/bash

echo "🚀 Deploying Evol Jewels AI Kiosk to Render..."

# Check if git is clean
if [[ -n $(git status -s) ]]; then
    echo "⚠️  You have uncommitted changes. Committing them now..."
    git add .
    git commit -m "Deploy optimized API for Render"
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

echo "✅ Code pushed to GitHub!"
echo ""
echo "🌐 Now go to Render Dashboard:"
echo "1. Go to https://dashboard.render.com"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect your GitHub repository"
echo "4. Use these settings:"
echo "   - Build Command: pip install -r requirements.txt"
echo "   - Start Command: uvicorn src.api:app --host 0.0.0.0 --port \$PORT"
echo "   - Python Version: 3.10.12"
echo "   - Instance Type: Standard (1GB RAM) - recommended"
echo ""
echo "🎉 Your API will be available at: https://your-app-name.onrender.com"
