import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListTodo, UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Task Management', path: '/tasks', icon: ListTodo },
    { name: 'Profile Settings', path: '/profile', icon: UserCircle },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-lg-none"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.4)', 
            backdropFilter: 'blur(3px)',
            zIndex: 1040 
          }}
          onClick={onClose}
        />
      )}

      {/* Sidebar Sidebar */}
      <aside
        className={`position-fixed start-0 top-0 h-100 border-end transition-all`}
        style={{
          width: 'var(--sidebar-width)',
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
          paddingTop: 'calc(var(--navbar-height) + 1.5rem)',
          zIndex: 1045,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          /* On Desktop: bypass translate transform and show sidebar stationary */
          '--desktop-transform': 'translateX(0)'
        }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          @media (min-width: 992px) {
            aside {
              transform: translateX(0) !important;
            }
          }
        `}} />

        <div className="d-flex flex-column h-100 px-3 pb-4 justify-content-between">
          {/* Top Links */}
          <div className="d-flex flex-column gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={onClose}
                  className="d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 text-decoration-none transition-all fw-medium fs-7"
                  style={{
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    background: isActive ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : 'transparent',
                    boxShadow: isActive ? '0 4px 10px rgba(79, 70, 229, 0.3)' : 'none'
                  }}
                >
                  <Icon size={18} />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Bottom Logout Button */}
          <div>
            <button
              onClick={() => {
                onClose();
                logout();
              }}
              className="w-100 d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 border-0 transition-all fw-medium text-danger bg-transparent"
              style={{
                borderRadius: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <LogOut size={18} />
              <span>Logout Session</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
