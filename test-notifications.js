const axios = require('axios');

const API_URL = 'http://localhost:5000';

async function testNotifications() {
  try {
    console.log('🧪 Testing Notification System...\n');

    // 1. Register a test user
    console.log('1. Registering test user...');
    const registerResponse = await axios.post(`${API_URL}/api/auth/register`, {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'member'
    });
    console.log('✅ User registered:', registerResponse.data.user.email);

    const token = registerResponse.data.token;
    const userId = registerResponse.data.user._id;

    // 2. Create a project
    console.log('\n2. Creating a project...');
    const projectResponse = await axios.post(`${API_URL}/api/projects`, {
      title: 'Test Project',
      description: 'A test project for notifications',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Project created:', projectResponse.data.project.title);

    const projectId = projectResponse.data.project._id;

    // 3. Create a task
    console.log('\n3. Creating a task...');
    const taskResponse = await axios.post(`${API_URL}/api/tasks`, {
      title: 'Test Task',
      description: 'A test task for notifications',
      assignedTo: userId,
      projectId: projectId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Task created:', taskResponse.data.task.title);

    // 4. Check notifications
    console.log('\n4. Checking notifications...');
    const notificationsResponse = await axios.get(`${API_URL}/api/notifications/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('📬 Notifications found:', notificationsResponse.data.notifications.length);
    console.log('📊 Unread count:', notificationsResponse.data.unreadCount);
    
    if (notificationsResponse.data.notifications.length > 0) {
      console.log('\n📋 Notification details:');
      notificationsResponse.data.notifications.forEach((notification, index) => {
        console.log(`   ${index + 1}. ${notification.message}`);
        console.log(`      Type: ${notification.type}, Priority: ${notification.priority}`);
        console.log(`      Read: ${notification.isRead ? 'Yes' : 'No'}`);
        console.log(`      Created: ${new Date(notification.createdAt).toLocaleString()}\n`);
      });
    }

    // 5. Mark a notification as read
    if (notificationsResponse.data.notifications.length > 0) {
      console.log('5. Marking first notification as read...');
      const firstNotification = notificationsResponse.data.notifications[0];
      await axios.put(`${API_URL}/api/notifications/${firstNotification._id}`, {
        isRead: true
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Notification marked as read');
    }

    console.log('\n🎉 Notification system test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testNotifications();
