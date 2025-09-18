const axios = require('axios');

const API_URL = 'http://localhost:5000';

async function testAdminAPIs() {
  try {
    console.log('🧪 Testing Admin APIs...\n');

    // 1. Test admin dashboard
    console.log('1. Testing admin dashboard...');
    try {
      const dashboardResponse = await axios.get(`${API_URL}/api/admin/dashboard`);
      console.log('✅ Dashboard API working:', dashboardResponse.data.success);
    } catch (error) {
      console.log('❌ Dashboard API error:', error.response?.data || error.message);
    }

    // 2. Test admin users
    console.log('\n2. Testing admin users...');
    try {
      const usersResponse = await axios.get(`${API_URL}/api/admin/users`);
      console.log('✅ Users API working:', usersResponse.data.success);
    } catch (error) {
      console.log('❌ Users API error:', error.response?.data || error.message);
    }

    // 3. Test admin projects
    console.log('\n3. Testing admin projects...');
    try {
      const projectsResponse = await axios.get(`${API_URL}/api/admin/projects`);
      console.log('✅ Projects API working:', projectsResponse.data.success);
    } catch (error) {
      console.log('❌ Projects API error:', error.response?.data || error.message);
    }

    // 4. Test admin tasks
    console.log('\n4. Testing admin tasks...');
    try {
      const tasksResponse = await axios.get(`${API_URL}/api/admin/tasks`);
      console.log('✅ Tasks API working:', tasksResponse.data.success);
    } catch (error) {
      console.log('❌ Tasks API error:', error.response?.data || error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAdminAPIs();
