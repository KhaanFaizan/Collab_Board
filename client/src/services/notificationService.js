import api from './api';

const createNotification = async (notificationData) => {
  const response = await api.post('/notifications', notificationData);
  return response.data;
};

const getUserNotifications = async (userId, params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const response = await api.get(`/notifications/${userId}?${queryParams}`);
  return response.data;
};

const markNotificationAsRead = async (notificationId, isRead = true) => {
  const response = await api.put(`/notifications/${notificationId}`, { isRead });
  return response.data;
};

const markAllAsRead = async (userId) => {
  const response = await api.put(`/notifications/mark-all-read/${userId}`);
  return response.data;
};

const deleteNotification = async (notificationId) => {
  const response = await api.delete(`/notifications/${notificationId}`);
  return response.data;
};

const notificationService = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
};

export default notificationService;
