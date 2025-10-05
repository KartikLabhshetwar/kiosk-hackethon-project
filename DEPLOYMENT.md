# 🚀 Deploy FastAPI Backend on Render

This guide will help you deploy your Evol Jewels AI Kiosk FastAPI backend on Render.

## 📋 Prerequisites

1. **GitHub Repository**: Your code should be pushed to GitHub
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Preprocessed Data**: Ensure your `indexed_data/` folder is committed to Git

## 🔧 Pre-Deployment Setup

### 1. Ensure Data is Ready
```bash
# Make sure you've run preprocessing
uv run python src/preprocess.py

# Verify indexed_data folder exists
ls -la indexed_data/
# Should show: embeddings.npy, faiss.index, metadata.json
```

### 2. Commit All Files
```bash
git add .
git commit -m "Add deployment files for Render"
git push origin main
```

## 🌐 Deploy on Render

### Step 1: Create New Web Service

1. **Login to Render**: Go to [dashboard.render.com](https://dashboard.render.com)
2. **Click "New +"** → **"Web Service"**
3. **Connect GitHub**: Authorize Render to access your repositories
4. **Select Repository**: Choose `kiosk-hackethon-project`

### Step 2: Configure Service

**Basic Settings:**
- **Name**: `evol-jewels-api` (or your preferred name)
- **Environment**: `Python 3`
- **Region**: Choose closest to your users
- **Branch**: `main`

**Build & Deploy:**
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn src.api:app --host 0.0.0.0 --port $PORT`

**Advanced Settings:**
- **Python Version**: `3.10.12` (from runtime.txt)
- **Instance Type**: `Starter` (free tier) or `Standard` (paid)

### Step 3: Environment Variables (Optional)

If you need any environment variables:
- Go to **Environment** tab
- Add any required variables (none needed for basic deployment)

### Step 4: Deploy

1. **Click "Create Web Service"**
2. **Wait for Build**: This will take 5-10 minutes
3. **Check Logs**: Monitor the build process in the logs

## 🔍 Post-Deployment Verification

### 1. Test Health Endpoint
```bash
curl https://your-app-name.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "products_loaded": 60,
  "celebrities_available": 8,
  "vibes_available": 15
}
```

### 2. Test Search Endpoint
```bash
curl -X POST "https://your-app-name.onrender.com/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "gold necklace", "top_k": 3}'
```

### 3. Test API Documentation
Visit: `https://your-app-name.onrender.com/docs`

## 🛠️ Troubleshooting

### Common Issues:

**1. Build Fails - Missing Dependencies**
```bash
# Check requirements.txt includes all dependencies
pip install -r requirements.txt
```

**2. Runtime Error - Data Not Found**
```bash
# Ensure indexed_data folder is committed
git add indexed_data/
git commit -m "Add preprocessed data"
git push origin main
```

**3. Memory Issues**
- Upgrade to paid plan (Standard tier)
- Or optimize model loading in startup

**4. Slow Startup**
- This is normal for first request (model download)
- Subsequent requests will be fast

### Debug Commands:

**Check Logs:**
- Go to Render Dashboard → Your Service → Logs

**Test Locally:**
```bash
# Test the exact command Render uses
uvicorn src.api:app --host 0.0.0.0 --port 8000
```

## 📊 Performance Optimization

### For Production:

1. **Upgrade Instance**: Use Standard tier for better performance
2. **Add Caching**: Implement Redis for frequently accessed data
3. **CDN**: Use CloudFlare for static assets
4. **Monitoring**: Add health checks and monitoring

### Memory Optimization:

```python
# In src/api.py, add memory optimization
import gc
import os

@app.on_event("startup")
async def startup_event():
    # ... existing code ...
    
    # Optimize memory
    gc.collect()
    os.environ["TOKENIZERS_PARALLELISM"] = "false"
```

## 🔒 Security Considerations

1. **CORS**: Update CORS origins for production
2. **Rate Limiting**: Add rate limiting for API endpoints
3. **Authentication**: Add API keys if needed
4. **HTTPS**: Render provides HTTPS by default

## 📈 Monitoring & Analytics

1. **Render Metrics**: Monitor CPU, memory, and response times
2. **Custom Logging**: Add structured logging
3. **Error Tracking**: Integrate Sentry for error monitoring
4. **Uptime Monitoring**: Use UptimeRobot or similar

## 🚀 Next Steps

1. **Frontend Integration**: Connect your React/Next.js frontend
2. **Database**: Add PostgreSQL for user data
3. **Caching**: Implement Redis for better performance
4. **CI/CD**: Set up automatic deployments
5. **Scaling**: Configure auto-scaling based on traffic

## 📞 Support

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **FastAPI Docs**: [fastapi.tiangolo.com](https://fastapi.tiangolo.com)
- **Project Issues**: Check GitHub issues for this project

---

**🎉 Congratulations!** Your FastAPI backend is now live on Render!
