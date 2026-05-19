import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, User, Menu, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  return (
    <nav 
      className="navbar navbar-expand-lg fixed-top border-bottom"
      style={{ 
        height: 'var(--navbar-height)', 
        backgroundColor: 'var(--bg-secondary)', 
        borderColor: 'var(--border-color)',
        zIndex: 1030 
      }}
    >
      <div className="container-fluid px-4">
        {/* Left Side: Brand & Toggle */}
        <div className="d-flex align-items-center">
          {user && (
            <button 
              className="btn btn-link text-decoration-none p-0 me-3 d-lg-none" 
              onClick={onToggleSidebar}
              style={{ color: 'var(--text-primary)' }}
            >
              <Menu size={24} />
            </button>
          )}
          <Link to="/" className="navbar-brand d-flex align-items-center fw-bold fs-4 gap-2 text-decoration-none m-0" style={{ color: 'var(--text-primary)' }}>
            <div className="p-1.5 rounded-3 d-flex align-items-center justify-content-center text-white" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)' }}>
              <CheckSquare size={20} />
            </div>
            <span className="d-none d-sm-inline">TaskFlow</span>
          </Link>
        </div>

        {/* Right Side: Theme Toggle & User Actions */}
        <div className="d-flex align-items-center gap-3">
          {/* Theme Toggle Button */}
          <button 
            className="btn btn-link p-2 rounded-circle text-decoration-none d-flex align-items-center justify-content-center"
            onClick={toggleTheme}
            style={{ 
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-primary)',
              width: '40px',
              height: '40px',
              border: '1px solid var(--border-color)'
            }}
          >
            {darkMode ? <Sun size={18} className="text-warning" /> : <Moon size={18} />}
          </button>

          {/* User Details & Dropdown */}
          {user && (
            <div className="dropdown">
              <button 
                className="btn d-flex align-items-center gap-2 px-3 py-1.5 rounded-pill border transition-all"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ 
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center text-white font-weight-bold"
                  style={{ 
                    width: '28px', 
                    height: '28px', 
                    fontSize: '13px',
                    backgroundColor: 'var(--accent-primary)' 
                  }}
                >
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="d-none d-md-inline fw-medium fs-7">{user.fullName}</span>
              </button>
              <ul 
                className="dropdown-menu dropdown-menu-end shadow border-0 p-2 mt-2" 
                aria-labelledby="userDropdown"
                style={{ width: '200px', borderRadius: '12px' }}
              >
                <li className="px-3 py-2 border-bottom mb-1">
                  <div className="fw-semibold text-truncate" style={{ color: 'var(--text-primary)' }}>{user.fullName}</div>
                  <div className="text-muted small text-truncate">{user.email}</div>
                </li>
                <li>
                  <Link to="/profile" className="dropdown-item d-flex align-items-center gap-2 rounded-2 py-2">
                    <User size={16} />
                    <span>My Profile</span>
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={logout} 
                    className="dropdown-item d-flex align-items-center gap-2 rounded-2 py-2 text-danger mt-1"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
