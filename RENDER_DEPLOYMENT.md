# Render Deployment Guide

## Quick Deployment

1. **Connect your GitHub repository to Render**
2. **Create a new Web Service**
3. **Use these settings:**
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Root Directory**: `.` (leave empty)
   - **Environment**: Node

## Environment Variables

Add these environment variables in Render dashboard:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=production
```

## Build Process

The build process:
1. Installs all dependencies (root, client, server)
2. Builds the React frontend
3. Prepares the Express server to serve static files

## Troubleshooting

If you get "Could not find a required file" error:
- Make sure the root directory is set to `.` (not `client` or `server`)
- Check that all files are committed to your repository
- Verify the build command is `npm run build`

## Project Structure

```
├── client/          # React frontend
│   ├── public/      # Static files
│   ├── src/         # React source code
│   └── build/       # Built React files (created during build)
├── server/          # Express backend
│   ├── models/      # Database models
│   ├── routes/      # API routes
│   └── index.js     # Server entry point
└── package.json     # Root package.json with build scripts
```

## How It Works

1. **Build Phase**: React app is built and placed in `client/build/`
2. **Runtime**: Express server serves the built React files as static content
3. **API Routes**: All `/api/*` routes are handled by Express
4. **Frontend Routes**: All other routes are handled by React Router
