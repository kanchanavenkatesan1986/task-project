import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { CheckSquare, AlertTriangle, Clock, ListTodo, Plus, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    highPriorityTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/dashboard/stats');
      setStats(response.data);
    } catch (err) {
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const progressPercent = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100 mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-2">
      {/* Welcome Banner */}
      <div className="glass-card p-4 p-md-5 mb-4 border-0 text-white" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', boxShadow: '0 4px 15px rgba(79, 70, 229, 0.25)' }}>
        <h2 className="mb-2 fw-bold text-white">Welcome, {user?.fullName}! 👋</h2>
        <p className="text-white-50 m-0 fs-5 mb-4">Here is a quick overview of your daily task progress. Keep up the great work!</p>
        
        <div className="row align-items-center">
          <div className="col-12 col-md-8 mb-3 mb-md-0">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="fw-semibold small text-white-50">Task Completion Rate</span>
              <span className="fw-bold text-white fs-5">{progressPercent}%</span>
            </div>
            <div className="progress bg-white bg-opacity-20" style={{ height: '10px', borderRadius: '5px' }}>
              <div 
                className="progress-bar bg-white transition-all" 
                role="progressbar" 
                style={{ width: `${progressPercent}%`, borderRadius: '5px' }} 
                aria-valuenow={progressPercent} 
                aria-valuemin="0" 
                aria-valuemax="100"
              />
            </div>
          </div>
          <div className="col-12 col-md-4 text-md-end">
            <button 
              onClick={() => navigate('/tasks')} 
              className="btn btn-light text-primary fw-semibold px-4 py-2 rounded-3 d-inline-flex align-items-center gap-2 border-0"
              style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
            >
              <span>Manage Tasks</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid Stats Cards */}
      <div className="row g-4 mb-4">
        {/* Total Tasks */}
        <div className="col-12 col-sm-6 col-xl-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="glass-card grad-total p-4 d-flex align-items-center justify-content-between h-100 border-0">
            <div>
              <span className="text-white-50 fw-medium small d-block mb-1">Total Tasks</span>
              <h2 className="m-0 fw-bold text-white fs-1">{stats.totalTasks}</h2>
            </div>
            <div className="p-3 bg-white bg-opacity-10 rounded-circle text-white">
              <ListTodo size={28} />
            </div>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="col-12 col-sm-6 col-xl-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="glass-card grad-completed p-4 d-flex align-items-center justify-content-between h-100 border-0">
            <div>
              <span className="text-white-50 fw-medium small d-block mb-1">Completed Tasks</span>
              <h2 className="m-0 fw-bold text-white fs-1">{stats.completedTasks}</h2>
            </div>
            <div className="p-3 bg-white bg-opacity-10 rounded-circle text-white">
              <CheckSquare size={28} />
            </div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="col-12 col-sm-6 col-xl-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="glass-card grad-pending p-4 d-flex align-items-center justify-content-between h-100 border-0">
            <div>
              <span className="text-white-50 fw-medium small d-block mb-1">Pending Tasks</span>
              <h2 className="m-0 fw-bold text-white fs-1">{stats.pendingTasks}</h2>
            </div>
            <div className="p-3 bg-white bg-opacity-10 rounded-circle text-white">
              <Clock size={28} />
            </div>
          </div>
        </div>

        {/* High Priority Tasks */}
        <div className="col-12 col-sm-6 col-xl-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="glass-card grad-high p-4 d-flex align-items-center justify-content-between h-100 border-0">
            <div>
              <span className="text-white-50 fw-medium small d-block mb-1">High Priority</span>
              <h2 className="m-0 fw-bold text-white fs-1">{stats.highPriorityTasks}</h2>
            </div>
            <div className="p-3 bg-white bg-opacity-10 rounded-circle text-white">
              <AlertTriangle size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Overview/Help Info Panel */}
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="glass-card p-4 h-100">
            <h5 className="mb-3 fw-bold" style={{ color: 'var(--text-primary)' }}>Tips for Better Productivity 🚀</h5>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex gap-3 align-items-start">
                <div className="p-2 rounded bg-primary-subtle text-primary mt-0.5">
                  <CheckSquare size={16} />
                </div>
                <div>
                  <h6 className="mb-0.5 fw-semibold" style={{ color: 'var(--text-primary)' }}>Break Down Complex Tasks</h6>
                  <p className="text-secondary small">Deconstruct massive undertakings into smaller, digestible tasks with incremental deadlines to avoid feeling overwhelmed.</p>
                </div>
              </div>
              <div className="d-flex gap-3 align-items-start">
                <div className="p-2 rounded bg-warning-subtle text-warning mt-0.5">
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <h6 className="mb-0.5 fw-semibold" style={{ color: 'var(--text-primary)' }}>Use Priorities Wisely</h6>
                  <p className="text-secondary small">Define exact priority status levels (High, Medium, Low) to keep your focus fixed on critical tasks and avoid bottlenecks.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-12 col-lg-4">
          <div className="glass-card p-4 h-100 text-center d-flex flex-column align-items-center justify-content-center">
            <h5 className="mb-2 fw-bold" style={{ color: 'var(--text-primary)' }}>Ready to add a task?</h5>
            <p className="text-secondary small mb-4">Click below to enter task details, set priorities, and keep track of deadlines.</p>
            <button 
              onClick={() => navigate('/tasks?action=new')} 
              className="btn btn-primary d-flex align-items-center justify-content-center gap-2 fw-semibold px-4 py-2.5 rounded-3 border-0 transition-all w-100"
              style={{ 
                background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                boxShadow: '0 4px 10px rgba(79, 70, 229, 0.25)' 
              }}
            >
              <Plus size={16} />
              <span>Create Task</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
