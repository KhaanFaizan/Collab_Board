// Simple test to check admin APIs without axios
const http = require('http');

function testAdminAPI() {
  console.log('🧪 Testing Admin APIs...\n');

  // Test admin dashboard
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/dashboard',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response:', data);
      if (res.statusCode === 401) {
        console.log('✅ API is working but requires authentication (expected)');
      } else if (res.statusCode === 200) {
        console.log('✅ API is working and accessible');
      } else {
        console.log('❌ API returned unexpected status');
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request failed:', error.message);
  });

  req.end();
}

// Run the test
testAdminAPI();
