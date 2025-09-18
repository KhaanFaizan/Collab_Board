// Test admin functionality with authentication
const http = require('http');

async function testAdminWithAuth() {
  console.log('🧪 Testing Admin APIs with Authentication...\n');

  // First, let's register a user and make them admin
  console.log('1. Registering a test admin user...');
  
  const registerData = JSON.stringify({
    name: 'Test Admin',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin'
  });

  const registerOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(registerData)
    }
  };

  const registerReq = http.request(registerOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`Register Status: ${res.statusCode}`);
      if (res.statusCode === 200) {
        const response = JSON.parse(data);
        console.log('✅ User registered successfully');
        console.log('User role:', response.user.role);
        
        // Now test admin dashboard
        testAdminDashboard(response.token);
      } else {
        console.log('❌ Registration failed:', data);
      }
    });
  });

  registerReq.on('error', (error) => {
    console.error('❌ Registration request failed:', error.message);
  });

  registerReq.write(registerData);
  registerReq.end();
}

function testAdminDashboard(token) {
  console.log('\n2. Testing admin dashboard with token...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/dashboard',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Dashboard Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('✅ Admin dashboard accessible');
        const response = JSON.parse(data);
        console.log('Stats:', response.stats);
      } else {
        console.log('❌ Admin dashboard failed:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Dashboard request failed:', error.message);
  });

  req.end();
}

// Run the test
testAdminWithAuth();
