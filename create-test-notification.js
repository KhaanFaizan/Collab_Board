const axios = require('axios');

const API_URL = 'http://localhost:5000';

async function createTestNotification() {
  try {
    console.log('🧪 Creating a test notification...\n');

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

    // 2. Create a notification manually
    console.log('\n2. Creating a test notification...');
    const notificationResponse = await axios.post(`${API_URL}/api/notifications`, {
      userId: userId,
      message: 'This is a test notification!',
      type: 'system',
      priority: 'high'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Notification created:', notificationResponse.data.notification.message);

    // 3. Fetch notifications
    console.log('\n3. Fetching notifications...');
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

    console.log('\n🎉 Test notification created successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
createTestNotification();
