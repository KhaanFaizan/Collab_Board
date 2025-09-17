import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading..." />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
