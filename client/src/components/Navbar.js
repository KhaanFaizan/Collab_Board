import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../store/slices/authSlice';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
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
