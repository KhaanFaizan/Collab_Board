#!/bin/bash

echo "🚀 Starting CollabBoard Deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Deploy Backend
echo "📦 Deploying Backend..."
cd server
vercel --prod
BACKEND_URL=$(vercel ls | grep server | head -1 | awk '{print $2}')
echo "✅ Backend deployed at: https://$BACKEND_URL"

# Deploy Frontend
echo "📦 Deploying Frontend..."
cd ../client
vercel --prod
FRONTEND_URL=$(vercel ls | grep client | head -1 | awk '{print $2}')
echo "✅ Frontend deployed at: https://$FRONTEND_URL"

echo "🎉 Deployment Complete!"
echo "Frontend: https://$FRONTEND_URL"
echo "Backend: https://$BACKEND_URL"
echo ""
echo "⚠️  Don't forget to:"
echo "1. Set environment variables in Vercel dashboard"
echo "2. Update CLIENT_URL in backend with frontend URL"
echo "3. Update REACT_APP_API_URL in frontend with backend URL"
