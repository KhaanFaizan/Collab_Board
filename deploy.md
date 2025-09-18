# CollabBoard Vercel Deployment Guide

## Prerequisites
1. Install Vercel CLI: `npm install -g vercel`
2. Login to Vercel: `vercel login`
3. Have your MongoDB Atlas connection string ready

## Step 1: Deploy Backend
```bash
cd server
vercel
```

### Backend Environment Variables (Set in Vercel Dashboard):
- `MONGO_URI` = `mongodb+srv://faizan:f%40izan412164@resumeanalyzer.piydt1w.mongodb.net/collabboard?retryWrites=true&w=majority&appName=resumeanalyzer`
- `JWT_SECRET` = `supersecretkey123`
- `CLIENT_URL` = `https://your-frontend-url.vercel.app` (update after frontend deployment)
- `CLOUDINARY_CLOUD_NAME` = `d1w8mpurc`
- `CLOUDINARY_API_KEY` = `653161386581567`
- `CLOUDINARY_API_SECRET` = `vi62cKBjY6-ICjGgIPCSwmqVuSQ`

## Step 2: Deploy Frontend
```bash
cd client
vercel
```

### Frontend Environment Variables (Set in Vercel Dashboard):
- `REACT_APP_API_URL` = `https://your-backend-url.vercel.app/api`

## Step 3: Update URLs
1. Copy the backend URL from Vercel dashboard
2. Update `CLIENT_URL` in backend environment variables
3. Update `REACT_APP_API_URL` in frontend environment variables
4. Redeploy both if needed

## Step 4: Test Deployment
1. Visit your frontend URL
2. Try to register/login
3. Test all features (projects, tasks, chat, etc.)

## Troubleshooting
- Check Vercel function logs for errors
- Ensure all environment variables are set
- Verify MongoDB Atlas connection
- Check CORS settings if getting CORS errors
