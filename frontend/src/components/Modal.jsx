import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ show, title, onClose, children }) => {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  if (!show) return null;

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.4)', 
        backdropFilter: 'blur(4px)',
        zIndex: 1050,
        transition: 'opacity 0.3s ease'
      }}
      onClick={onClose}
    >
      <div 
        className="glass-card w-100 border p-0 shadow-lg animate-fade-in"
        style={{ 
          maxWidth: '500px', 
          backgroundColor: 'var(--bg-secondary)', 
          borderColor: 'var(--border-color)',
          transform: 'translateY(0)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Header */}
        <div 
          className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <h5 className="m-0 fw-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h5>
          <button 
            onClick={onClose}
            className="btn btn-link p-1.5 rounded-circle text-decoration-none border-0 d-flex align-items-center justify-content-center"
            style={{ 
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-primary)',
              width: '32px',
              height: '32px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--border-color)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-4 py-3" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
