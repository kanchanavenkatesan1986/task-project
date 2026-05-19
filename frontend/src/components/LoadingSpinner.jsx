import React from 'react';

const LoadingSpinner = () => {
  return (
    <div 
      className="d-flex flex-column justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 bg-opacity-75 z-3"
      style={{ backgroundColor: 'var(--bg-primary)', backdropFilter: 'blur(5px)' }}
    >
      <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-secondary fw-medium">Loading details...</p>
    </div>
  );
};

export default LoadingSpinner;
