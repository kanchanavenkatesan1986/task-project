import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import TaskCard from '../components/TaskCard';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Filter, Plus, ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Tasks = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Tasks and Pagination State
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(6); // 6 tasks per page looks balanced in grid layouts

  // Filter & Search State
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [dueDate, setDueDate] = useState('');
  
  // Sorting State
  const [sortBy, setSortBy] = useState('dueDate');
  const [direction, setDirection] = useState('ASC');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Create Task');
  const [editingTask, setEditingTask] = useState(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPriority, setFormPriority] = useState('MEDIUM');
  const [formStatus, setFormStatus] = useState('PENDING');
  const [formDueDate, setFormDueDate] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Fetch Tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: pageSize,
        sortBy,
        direction,
      };

      if (search.trim()) params.search = search.trim();
      if (priority !== 'ALL') params.priority = priority;
      if (status !== 'ALL') params.status = status;
      if (dueDate) params.dueDate = dueDate;

      const response = await api.get('/api/tasks', { params });
      setTasks(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (err) {
      toast.error('Failed to retrieve task records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page, priority, status, dueDate, sortBy, direction]);

  // Handle Action Triggered from Dashboard
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('action') === 'new') {
      handleOpenCreateModal();
      // Clean query parameters from URL
      navigate('/tasks', { replace: true });
    }
  }, [location]);

  // Search Submit Handler
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchTasks();
  };

  // Clear all filters
  const handleResetFilters = () => {
    setSearch('');
    setPriority('ALL');
    setStatus('ALL');
    setDueDate('');
    setSortBy('dueDate');
    setDirection('ASC');
    setPage(0);
  };

  // Toggle Task Status directly
  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === 'PENDING' ? 'COMPLETED' : 'PENDING';
    try {
      await api.put(`/api/tasks/${task.id}`, {
        ...task,
        status: nextStatus,
        // Make sure date formats send correctly
        dueDate: task.dueDate
      });
      
      toast.success(`Task status changed to ${nextStatus.toLowerCase()}`);
      fetchTasks();
    } catch (err) {
      toast.error('Failed to change task status');
    }
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setModalTitle('Create New Task');
    setFormTitle('');
    setFormDescription('');
    setFormPriority('MEDIUM');
    setFormStatus('PENDING');
    
    // Set default due date to 24 hours from now
    const tomorrow = new Date();
    tomorrow.setHours(tomorrow.getHours() + 24);
    tomorrow.setMinutes(0);
    const tzOffset = tomorrow.getTimezoneOffset() * 60000; // offset in milliseconds
    const localISOTime = (new Date(tomorrow - tzOffset)).toISOString().slice(0, 16);
    setFormDueDate(localISOTime);

    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setModalTitle('Edit Task Details');
    setFormTitle(task.title);
    setFormDescription(task.description || '');
    setFormPriority(task.priority);
    setFormStatus(task.status);
    
    // Format ISO string to datetime-local yyyy-MM-ddThh:mm
    if (task.dueDate) {
      setFormDueDate(task.dueDate.substring(0, 16));
    } else {
      setFormDueDate('');
    }
    
    setShowModal(true);
  };

  // Handle Delete Task
  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/api/tasks/${id}`);
      toast.success('Task deleted successfully');
      fetchTasks();
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  // Submit Modal Form (Create / Edit)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      toast.error('Task title is required');
      return;
    }
    if (!formDueDate) {
      toast.error('Due date is required');
      return;
    }

    setFormLoading(true);
    try {
      const payload = {
        title: formTitle.trim(),
        description: formDescription.trim(),
        priority: formPriority,
        status: formStatus,
        dueDate: new Date(formDueDate).toISOString(),
      };

      if (editingTask) {
        await api.put(`/api/tasks/${editingTask.id}`, payload);
        toast.success('Task details updated successfully');
      } else {
        await api.post('/api/tasks', payload);
        toast.success('New task created successfully');
      }
      
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to submit task details';
      toast.error(errMsg);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="container-fluid py-2 animate-fade-in">
      {/* Title Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold m-0" style={{ color: 'var(--text-primary)' }}>Task Management</h2>
          <p className="text-secondary small m-0">Organize, track, and execute your daily operations</p>
        </div>
        <button 
          onClick={handleOpenCreateModal}
          className="btn btn-primary d-flex align-items-center justify-content-center gap-2 fw-semibold px-4 py-2.5 rounded-3 border-0 transition-all shadow-sm"
          style={{ 
            background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
            boxShadow: '0 4px 10px rgba(79, 70, 229, 0.2)' 
          }}
        >
          <Plus size={18} />
          <span>Add Task</span>
        </button>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="glass-card p-4 mb-4">
        <form onSubmit={handleSearchSubmit} className="row g-3 align-items-end">
          {/* Search bar */}
          <div className="col-12 col-md-4 col-xl-3">
            <label className="form-label small fw-semibold text-secondary">Search Keyword</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                <Search size={15} />
              </span>
              <input 
                type="text" 
                className="form-control border-start-0" 
                placeholder="Title or description..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ borderColor: 'var(--border-color)' }}
              />
            </div>
          </div>

          {/* Priority filter */}
          <div className="col-6 col-md-2 col-xl-2">
            <label className="form-label small fw-semibold text-secondary">Priority Status</label>
            <select 
              className="form-select"
              value={priority}
              onChange={(e) => {
                setPriority(e.target.value);
                setPage(0);
              }}
              style={{ borderColor: 'var(--border-color)' }}
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="col-6 col-md-2 col-xl-2">
            <label className="form-label small fw-semibold text-secondary">Task Status</label>
            <select 
              className="form-select"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(0);
              }}
              style={{ borderColor: 'var(--border-color)' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Due date filter */}
          <div className="col-12 col-sm-6 col-md-2 col-xl-2">
            <label className="form-label small fw-semibold text-secondary">Due Date</label>
            <input 
              type="date" 
              className="form-control"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                setPage(0);
              }}
              style={{ borderColor: 'var(--border-color)' }}
            />
          </div>

          {/* Sort By Filter */}
          <div className="col-6 col-sm-3 col-md-2 col-xl-1.5">
            <label className="form-label small fw-semibold text-secondary">Sort By</label>
            <select 
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ borderColor: 'var(--border-color)' }}
            >
              <option value="dueDate">Due Date</option>
              <option value="title">Title</option>
              <option value="createdAt">Created Date</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
            </select>
          </div>

          {/* Direction toggle */}
          <div className="col-6 col-sm-3 col-md-2 col-xl-1.5">
            <label className="form-label small fw-semibold text-secondary">Direction</label>
            <select 
              className="form-select"
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              style={{ borderColor: 'var(--border-color)' }}
            >
              <option value="ASC">Ascending</option>
              <option value="DESC">Descending</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="col-12 col-xl-1.5 d-flex gap-2">
            <button 
              type="submit" 
              className="btn btn-secondary w-100 fw-medium d-flex align-items-center justify-content-center gap-1.5 border-0"
              style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color) !important', color: 'var(--text-primary)' }}
            >
              <Filter size={15} />
              <span>Apply</span>
            </button>
            <button 
              type="button"
              onClick={handleResetFilters}
              className="btn btn-outline-secondary w-100 fw-medium d-flex align-items-center justify-content-center gap-1"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
              title="Reset Filters"
            >
              <X size={15} />
              <span>Reset</span>
            </button>
          </div>
        </form>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : tasks.length === 0 ? (
        /* Empty State */
        <div className="glass-card text-center py-5 px-4 my-3 d-flex flex-column align-items-center justify-content-center">
          <div className="p-4 bg-primary-subtle text-primary rounded-circle mb-3">
            <Sparkles size={40} />
          </div>
          <h4 className="fw-bold mb-2">No tasks found</h4>
          <p className="text-secondary small mb-4" style={{ maxWidth: '400px' }}>
            We couldn't find any tasks matching your filters. Create a new task or adjust your search inputs to get started.
          </p>
          <button 
            onClick={handleOpenCreateModal}
            className="btn btn-primary fw-semibold px-4 py-2 rounded-3 border-0 transition-all"
            style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' }}
          >
            Create Your First Task
          </button>
        </div>
      ) : (
        /* Task Cards Grid */
        <>
          <div className="row g-4 mb-4">
            {tasks.map((task) => (
              <div key={task.id} className="col-12 col-md-6 col-xl-4">
                <TaskCard 
                  task={task}
                  onToggleStatus={handleToggleStatus}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeleteTask}
                />
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="d-flex align-items-center justify-content-between border-top pt-4">
              <span className="text-secondary small">
                Showing page <strong className="text-dark-emphasis">{page + 1}</strong> of <strong className="text-dark-emphasis">{totalPages}</strong> ({totalElements} total tasks)
              </span>
              <div className="d-flex align-items-center gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => setPage(prev => Math.max(0, prev - 1))}
                  className="btn btn-outline-secondary p-2 d-flex align-items-center justify-content-center rounded-3"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(prev => prev + 1)}
                  className="btn btn-outline-secondary p-2 d-flex align-items-center justify-content-center rounded-3"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Task Modal (Create & Edit) */}
      <Modal 
        show={showModal}
        title={modalTitle}
        onClose={() => setShowModal(false)}
      >
        <form onSubmit={handleFormSubmit}>
          {/* Title */}
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Task Title *</label>
            <input 
              type="text" 
              className="form-control"
              placeholder="Enter task name..."
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              required
              maxLength={150}
              style={{ borderColor: 'var(--border-color)' }}
            />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Description</label>
            <textarea 
              className="form-control"
              rows={3}
              placeholder="Provide a brief explanation of what is required..."
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              style={{ borderColor: 'var(--border-color)' }}
            />
          </div>

          {/* Priority Status & Task Status */}
          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="form-label small fw-semibold text-secondary">Priority Level</label>
              <select 
                className="form-select"
                value={formPriority}
                onChange={(e) => setFormPriority(e.target.value)}
                style={{ borderColor: 'var(--border-color)' }}
              >
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
            <div className="col-6">
              <label className="form-label small fw-semibold text-secondary">Task Status</label>
              <select 
                className="form-select"
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value)}
                style={{ borderColor: 'var(--border-color)' }}
              >
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          {/* Due Date picker */}
          <div className="mb-4">
            <label className="form-label small fw-semibold text-secondary">Due Date & Time *</label>
            <input 
              type="datetime-local" 
              className="form-control"
              value={formDueDate}
              onChange={(e) => setFormDueDate(e.target.value)}
              required
              style={{ borderColor: 'var(--border-color)' }}
            />
          </div>

          {/* Form Actions */}
          <div className="d-flex gap-2 justify-content-end border-top pt-3">
            <button 
              type="button" 
              onClick={() => setShowModal(false)}
              className="btn btn-outline-secondary px-4 py-2 rounded-3"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary px-4 py-2 rounded-3 fw-medium d-flex align-items-center gap-1 border-0"
              disabled={formLoading}
              style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' }}
            >
              {formLoading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                <span>Save Task</span>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Tasks;
