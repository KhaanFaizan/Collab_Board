import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  return (
    <div className={`loading-spinner ${size}`}>
      <div className="spinner">
        <i className="fas fa-spinner fa-spin"></i>
      </div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
