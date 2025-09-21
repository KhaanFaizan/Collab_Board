@echo off
echo 🚀 Starting CollabBoard Build Process...

echo 📦 Installing root dependencies...
npm install

echo 📦 Installing client dependencies...
cd client
npm install

echo 🔨 Building React application...
npm run build

if exist "build" (
    echo ✅ React build successful!
    echo 📁 Build directory contents:
    dir build
) else (
    echo ❌ React build failed!
    exit /b 1
)

cd ..

echo 📦 Installing server dependencies...
cd server
npm install
cd ..

echo 🎉 Build process completed successfully!
echo 📁 Project structure:
echo ├── client/build/ (React build files)
echo └── server/ (Express server)
