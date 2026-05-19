import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Mail, Lock, User, UserPlus, CheckSquare } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await register(fullName.trim(), email.trim(), password, confirmPassword);
      toast.success('Registration successful! Welcome to TaskFlow.');
      navigate('/');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Email is already registered';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="d-flex justify-content-center align-items-center w-100" 
      style={{ 
        minHeight: '100vh', 
        backgroundColor: 'var(--bg-primary)',
        padding: '2rem 1rem' 
      }}
    >
      <div 
        className="glass-card p-4 p-sm-5 w-100 animate-fade-in" 
        style={{ 
          maxWidth: '460px',
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)'
        }}
      >
        {/* Brand Header */}
        <div className="text-center mb-4">
          <div className="d-inline-flex p-2.5 rounded-3 text-white mb-3" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)' }}>
            <CheckSquare size={32} />
          </div>
          <h2 className="mb-1 fw-bold" style={{ color: 'var(--text-primary)' }}>Join TaskFlow</h2>
          <p className="text-secondary small">Organize and manage your tasks effectively</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Full Name Input */}
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Full Name</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                <User size={16} />
              </span>
              <input 
                type="text" 
                className="form-control border-start-0" 
                placeholder="John Doe" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{ borderColor: 'var(--border-color)' }}
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                <Mail size={16} />
              </span>
              <input 
                type="email" 
                className="form-control border-start-0" 
                placeholder="email@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ borderColor: 'var(--border-color)' }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                <Lock size={16} />
              </span>
              <input 
                type="password" 
                className="form-control border-start-0" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ borderColor: 'var(--border-color)' }}
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="mb-4">
            <label className="form-label small fw-semibold text-secondary">Confirm Password</label>
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

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-primary w-100 py-2.5 rounded-3 fw-medium d-flex align-items-center justify-content-center gap-2 border-0 mb-4 transition-all"
            disabled={loading}
            style={{ 
              background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)' 
            }}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Create New Account</span>
              </>
            )}
          </button>

          {/* Footer Navigation */}
          <p className="text-center text-secondary small m-0">
            Already have an account?{' '}
            <Link to="/login" className="fw-semibold text-decoration-none" style={{ color: 'var(--accent-primary)' }}>
              Login Here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
