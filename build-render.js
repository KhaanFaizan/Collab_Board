const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Render-specific build process...');

// Get current working directory
const cwd = process.cwd();
console.log('📁 Current working directory:', cwd);

// Check if we're in the right directory
if (!fs.existsSync('client') || !fs.existsSync('server')) {
  console.error('❌ Error: client or server directory not found');
  console.log('📁 Available directories:', fs.readdirSync(cwd));
  process.exit(1);
}

// Check client structure
const clientDir = path.join(cwd, 'client');
const publicDir = path.join(clientDir, 'public');
const indexHtml = path.join(publicDir, 'index.html');

console.log('📁 Client directory:', clientDir);
console.log('📁 Public directory exists:', fs.existsSync(publicDir));
console.log('📁 Index.html exists:', fs.existsSync(indexHtml));

if (!fs.existsSync(indexHtml)) {
  console.error('❌ Error: index.html not found in client/public/');
  console.log('📁 Client directory contents:', fs.readdirSync(clientDir));
  if (fs.existsSync(publicDir)) {
    console.log('📁 Public directory contents:', fs.readdirSync(publicDir));
  }
  process.exit(1);
}

try {
  // Install client dependencies
  console.log('📦 Installing client dependencies...');
  execSync('npm install', { cwd: clientDir, stdio: 'inherit' });

  // Build client
  console.log('🔨 Building React application...');
  execSync('npm run build', { cwd: clientDir, stdio: 'inherit' });

  // Verify build
  const buildDir = path.join(clientDir, 'build');
  if (fs.existsSync(buildDir)) {
    console.log('✅ React build successful!');
    console.log('📁 Build directory contents:', fs.readdirSync(buildDir));
  } else {
    console.error('❌ Build directory not found after build');
    process.exit(1);
  }

  // Install server dependencies
  console.log('📦 Installing server dependencies...');
  const serverDir = path.join(cwd, 'server');
  execSync('npm install', { cwd: serverDir, stdio: 'inherit' });

  console.log('🎉 Build process completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
