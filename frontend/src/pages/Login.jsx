import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Mail, Lock, LogIn, CheckSquare } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      toast.success('Login successful! Welcome back.');
      navigate('/');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Invalid email or password';
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
          maxWidth: '440px',
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)'
        }}
      >
        {/* Brand Header */}
        <div className="text-center mb-4">
          <div className="d-inline-flex p-2.5 rounded-3 text-white mb-3" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)' }}>
            <CheckSquare size={32} />
          </div>
          <h2 className="mb-1 fw-bold" style={{ color: 'var(--text-primary)' }}>Welcome Back</h2>
          <p className="text-secondary small">Please enter your credentials to login</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
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
          <div className="mb-4">
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
                <LogIn size={18} />
                <span>Login Session</span>
              </>
            )}
          </button>

          {/* Footer Navigation */}
          <p className="text-center text-secondary small m-0">
            Don't have an account?{' '}
            <Link to="/register" className="fw-semibold text-decoration-none" style={{ color: 'var(--accent-primary)' }}>
              Register Here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
