# 🚀 Vercel Deployment Guide for CollabBoard

## Prerequisites
- GitHub account
- Vercel account (free)
- MongoDB Atlas account (for database)
- Your project pushed to GitHub

## Step-by-Step Deployment

### Phase 1: Backend Deployment (Separate)

#### Option A: Deploy Backend to Vercel (Recommended)
1. **Create a new Vercel project for backend:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - **Important:** Set Root Directory to `server`
   - Framework: Node.js

2. **Configure Environment Variables:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/collabboard
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   CLIENT_URL=https://your-frontend-url.vercel.app
   NODE_ENV=production
   ```

3. **Deploy Backend:**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy the backend URL (e.g., `https://collabboard-backend.vercel.app`)

#### Option B: Deploy Backend to Railway/Render
1. **Railway:**
   - Go to [railway.app](https://railway.app)
   - Connect GitHub and select your repo
   - Set Root Directory to `server`
   - Add environment variables
   - Deploy

2. **Render:**
   - Go to [render.com](https://render.com)
   - Create new Web Service
   - Connect GitHub and select your repo
   - Set Root Directory to `server`
   - Add environment variables
   - Deploy

### Phase 2: Frontend Deployment

1. **Update API URL in your code:**
   - Replace `http://localhost:5000` with your backend URL
   - Update axios base URL in your API calls

2. **Deploy Frontend to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - **Important:** Set Root Directory to `client`
   - Framework: Create React App

3. **Configure Environment Variables:**
   ```
   REACT_APP_API_URL=https://your-backend-url.vercel.app
   ```

4. **Deploy Frontend:**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy the frontend URL (e.g., `https://collabboard.vercel.app`)

### Phase 3: Update Backend CORS

1. **Update your backend CORS settings:**
   - Go to your backend deployment
   - Update `CLIENT_URL` environment variable
   - Set it to your frontend URL
   - Redeploy backend

### Phase 4: Test Your Deployment

1. **Test Frontend:**
   - Visit your frontend URL
   - Try to register a new account
   - Test login functionality

2. **Test Backend:**
   - Check if API endpoints are working
   - Test database connectivity

## Important Notes

- **Database:** Use MongoDB Atlas (free tier available)
- **Environment Variables:** Keep them secure and don't commit to GitHub
- **CORS:** Make sure backend allows your frontend domain
- **HTTPS:** Vercel provides free SSL certificates

## Troubleshooting

### Common Issues:
1. **CORS Error:** Update backend CORS settings
2. **API Not Found:** Check if backend URL is correct
3. **Database Connection:** Verify MongoDB Atlas connection string
4. **Build Errors:** Check if all dependencies are installed

### Debug Steps:
1. Check Vercel function logs
2. Verify environment variables
3. Test API endpoints directly
4. Check browser console for errors

## Success Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database connected
- [ ] User registration works
- [ ] User login works
- [ ] All features functional
- [ ] No console errors
- [ ] Mobile responsive

## URLs After Deployment

- **Frontend:** `https://your-project-name.vercel.app`
- **Backend:** `https://your-backend-project.vercel.app`
- **Database:** MongoDB Atlas (cloud)

## Next Steps

1. Set up custom domain (optional)
2. Configure analytics
3. Set up monitoring
4. Configure CI/CD for automatic deployments
