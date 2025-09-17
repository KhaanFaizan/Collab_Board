import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotifications, markAsRead, markAllAsRead, deleteNotification } from '../store/slices/notificationSlice';
import './NotificationDropdown.css';

const NotificationDropdown = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { notifications, unreadCount, isLoading } = useSelector((state) => state.notifications);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (isOpen && user?.id) {
      dispatch(fetchNotifications({ 
        userId: user.id, 
        params: { limit: 10 } 
      }));
    }
  }, [dispatch, user?.id, isOpen]);

  const handleMarkAsRead = async (notificationId) => {
    dispatch(markAsRead({ notificationId, isRead: true }));
  };

  const handleMarkAllAsRead = async () => {
    if (user?.id) {
      dispatch(markAllAsRead(user.id));
    }
  };

  const handleDelete = async (notificationId) => {
    dispatch(deleteNotification(notificationId));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#ff4444';
      case 'high': return '#ff8800';
      case 'medium': return '#4CAF50';
      case 'low': return '#9e9e9e';
      default: return '#4CAF50';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'project': return 'fas fa-project-diagram';
      case 'task': return 'fas fa-tasks';
      case 'message': return 'fas fa-comment';
      case 'file': return 'fas fa-file';
      default: return 'fas fa-bell';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'unread') return !notification.isRead;
    return true;
  });

  if (!isOpen) return null;

  return (
    <div className="notification-dropdown">
      <div className="notification-header">
        <h3>Notifications</h3>
        <div className="notification-actions">
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllAsRead}
              className="mark-all-btn"
            >
              Mark all read
            </button>
          )}
          <button onClick={onClose} className="close-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div className="notification-tabs">
        <button 
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All ({notifications.length})
        </button>
        <button 
          className={`tab ${activeTab === 'unread' ? 'active' : ''}`}
          onClick={() => setActiveTab('unread')}
        >
          Unread ({unreadCount})
        </button>
      </div>

      <div className="notification-content">
        {isLoading ? (
          <div className="loading">
            <i className="fas fa-spinner fa-spin"></i>
            <span>Loading notifications...</span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-bell-slash"></i>
            <p>No notifications found</p>
          </div>
        ) : (
          <div className="notification-list">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification._id} 
                className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
              >
                <div className="notification-icon">
                  <i 
                    className={getTypeIcon(notification.type)}
                    style={{ color: getPriorityColor(notification.priority) }}
                  ></i>
                </div>
                
                <div className="notification-content">
                  <p className="notification-message">{notification.message}</p>
                  <div className="notification-meta">
                    <span className="notification-time">
                      {formatTimeAgo(notification.createdAt)}
                    </span>
                    <span 
                      className="notification-priority"
                      style={{ backgroundColor: getPriorityColor(notification.priority) }}
                    >
                      {notification.priority}
                    </span>
                  </div>
                </div>

                <div className="notification-actions">
                  {!notification.isRead && (
                    <button 
                      className="mark-read-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification._id);
                      }}
                      title="Mark as read"
                    >
                      <i className="fas fa-check"></i>
                    </button>
                  )}
                  <button 
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notification._id);
                    }}
                    title="Delete"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {notifications.length > 10 && (
        <div className="notification-footer">
          <button className="view-all-btn">
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
