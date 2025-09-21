#!/bin/bash

echo "🚀 Starting CollabBoard Build Process..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install and build client
echo "📦 Installing client dependencies..."
cd client
npm install

echo "🔨 Building React application..."
npm run build

# Check if build was successful
if [ -d "build" ]; then
    echo "✅ React build successful!"
    echo "📁 Build directory contents:"
    ls -la build/
else
    echo "❌ React build failed!"
    exit 1
fi

# Go back to root
cd ..

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

echo "🎉 Build process completed successfully!"
echo "📁 Project structure:"
echo "├── client/build/ (React build files)"
echo "└── server/ (Express server)"
