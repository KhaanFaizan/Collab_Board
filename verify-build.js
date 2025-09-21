const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying build environment...');

// Check current working directory
console.log('📁 Current working directory:', process.cwd());

// Check if client directory exists
const clientDir = path.join(process.cwd(), 'client');
console.log('📁 Client directory exists:', fs.existsSync(clientDir));

// Check if client/public directory exists
const publicDir = path.join(clientDir, 'public');
console.log('📁 Client/public directory exists:', fs.existsSync(publicDir));

// Check if client/public/index.html exists
const indexHtml = path.join(publicDir, 'index.html');
console.log('📁 Client/public/index.html exists:', fs.existsSync(indexHtml));

// List contents of client directory
if (fs.existsSync(clientDir)) {
  console.log('📁 Client directory contents:');
  fs.readdirSync(clientDir).forEach(file => {
    console.log('  -', file);
  });
}

// List contents of client/public directory
if (fs.existsSync(publicDir)) {
  console.log('📁 Client/public directory contents:');
  fs.readdirSync(publicDir).forEach(file => {
    console.log('  -', file);
  });
}

console.log('✅ Verification complete');
