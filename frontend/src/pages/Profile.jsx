import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { User, Lock, Mail, Save, KeyRound } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();

  // Profile Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password Form State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Load User Data
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error('Full name is required');
      return;
    }

    setProfileLoading(true);
    try {
      await api.put('/api/profile', { fullName: fullName.trim(), email });
      updateProfile(fullName.trim());
      toast.success('Profile details updated successfully');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update profile';
      toast.error(errMsg);
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle Password Update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('All password fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Confirm password does not match new password');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    setPasswordLoading(true);
    try {
      await api.put('/api/profile/password', {
        oldPassword,
        newPassword,
        confirmPassword
      });
      toast.success('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to change password';
      toast.error(errMsg);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="container-fluid py-2 animate-fade-in">
      {/* Title Header */}
      <div className="mb-4">
        <h2 className="fw-bold m-0" style={{ color: 'var(--text-primary)' }}>Profile Settings</h2>
        <p className="text-secondary small m-0">Manage your account information and password configuration</p>
      </div>

      <div className="row g-4">
        {/* Profile Card */}
        <div className="col-12 col-lg-6">
          <div className="glass-card p-4 h-100">
            <div className="d-flex align-items-center gap-3 mb-4 pb-2 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
              <div className="p-2.5 rounded-3 text-white" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)' }}>
                <User size={20} />
              </div>
              <h5 className="m-0 fw-semibold" style={{ color: 'var(--text-primary)' }}>Personal Information</h5>
            </div>

            <form onSubmit={handleProfileSubmit}>
              {/* Full Name */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                    <User size={16} />
                  </span>
                  <input 
                    type="text" 
                    className="form-control border-start-0" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    style={{ borderColor: 'var(--border-color)' }}
                  />
                </div>
              </div>

              {/* Email (Read-Only) */}
              <div className="mb-4">
                <label className="form-label small fw-semibold text-secondary">Email Address (Read-only)</label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-end-0 bg-light" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)', opacity: 0.65 }}>
                    <Mail size={16} />
                  </span>
                  <input 
                    type="email" 
                    className="form-control border-start-0 bg-light" 
                    value={email}
                    disabled
                    style={{ borderColor: 'var(--border-color)', opacity: 0.65 }}
                  />
                </div>
              </div>

              {/* Save Button */}
              <button 
                type="submit" 
                className="btn btn-primary d-flex align-items-center gap-2 fw-semibold px-4 py-2.5 rounded-3 border-0 transition-all shadow-sm"
                disabled={profileLoading}
                style={{ 
                  background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)'
                }}
              >
                {profileLoading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Password Card */}
        <div className="col-12 col-lg-6">
          <div className="glass-card p-4 h-100">
            <div className="d-flex align-items-center gap-3 mb-4 pb-2 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
              <div className="p-2.5 rounded-3 text-white" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                <Lock size={20} />
              </div>
              <h5 className="m-0 fw-semibold" style={{ color: 'var(--text-primary)' }}>Change Password</h5>
            </div>

            <form onSubmit={handlePasswordSubmit}>
              {/* Old Password */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Current Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                    <KeyRound size={16} />
                  </span>
                  <input 
                    type="password" 
                    className="form-control border-start-0" 
                    placeholder="••••••••"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    style={{ borderColor: 'var(--border-color)' }}
                  />
                </div>
              </div>

              {/* New Password */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">New Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                    <Lock size={16} />
                  </span>
                  <input 
                    type="password" 
                    className="form-control border-start-0" 
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    style={{ borderColor: 'var(--border-color)' }}
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <label className="form-label small fw-semibold text-secondary">Confirm New Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                    <Lock size={16} />
                  </span>
                  <input 
                    type="password" 
                    className="form-control border-start-0" 
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={{ borderColor: 'var(--border-color)' }}
                  />
                </div>
              </div>

              {/* Save Password Button */}
              <button 
                type="submit" 
                className="btn btn-warning d-flex align-items-center gap-2 fw-semibold px-4 py-2.5 rounded-3 border-0 transition-all text-white shadow-sm"
                disabled={passwordLoading}
                style={{ 
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                }}
              >
                {passwordLoading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
