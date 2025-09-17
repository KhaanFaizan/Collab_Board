import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../store/slices/authSlice';
import { fetchNotifications } from '../store/slices/notificationSlice';
import NotificationDropdown from './NotificationDropdown';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      // Fetch notifications when user logs in
      dispatch(fetchNotifications({ 
        userId: user.id, 
        params: { limit: 10 } 
      }));

      // Set up periodic refresh of notifications every 30 seconds
      const interval = setInterval(() => {
        dispatch(fetchNotifications({ 
          userId: user.id, 
          params: { limit: 10 } 
        }));
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [dispatch, isAuthenticated, user?.id]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const toggleNotifications = () => {
    if (!isNotificationOpen && user?.id) {
      // Fetch fresh notifications when opening dropdown
      dispatch(fetchNotifications({ 
        userId: user.id, 
        params: { limit: 10 } 
      }));
    }
    setIsNotificationOpen(!isNotificationOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <i className="fas fa-project-diagram"></i>
          CollabBoard
        </Link>

        {isAuthenticated ? (
          <div className="navbar-menu">
            <Link to="/dashboard" className="navbar-link">
              <i className="fas fa-tachometer-alt"></i>
              Dashboard
            </Link>
            <Link to="/projects" className="navbar-link">
              <i className="fas fa-folder"></i>
              Projects
            </Link>
            <Link to="/calendar" className="navbar-link">
              <i className="fas fa-calendar-alt"></i>
              Calendar
            </Link>
            
            <div className="navbar-user">
              <div className="notification-container">
                <button 
                  className="notification-btn"
                  onClick={toggleNotifications}
                >
                  <i className="fas fa-bell"></i>
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </button>
                <NotificationDropdown 
                  isOpen={isNotificationOpen}
                  onClose={() => setIsNotificationOpen(false)}
                />
              </div>
              <div className="user-info">
                <i className="fas fa-user"></i>
                <span>{user?.name}</span>
                <span className="user-role">({user?.role})</span>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="navbar-menu">
            <Link to="/login" className="navbar-link">
              <i className="fas fa-sign-in-alt"></i>
              Login
            </Link>
            <Link to="/register" className="navbar-link">
              <i className="fas fa-user-plus"></i>
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
