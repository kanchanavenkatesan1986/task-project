import React from 'react';
import { Calendar, AlertCircle, Edit3, Trash2, CheckCircle2, Circle } from 'lucide-react';

const TaskCard = ({ task, onToggleStatus, onEdit, onDelete }) => {
  const isCompleted = task.status === 'COMPLETED';

  // Format priority tags
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'HIGH':
        return <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2.5 py-1 rounded-pill small fw-semibold">High Priority</span>;
      case 'MEDIUM':
        return <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2.5 py-1 rounded-pill small fw-semibold">Medium Priority</span>;
      case 'LOW':
        return <span className="badge bg-info-subtle text-info border border-info-subtle px-2.5 py-1 rounded-pill small fw-semibold">Low Priority</span>;
      default:
        return null;
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'HIGH': return 'task-card-high';
      case 'MEDIUM': return 'task-card-medium';
      case 'LOW': return 'task-card-low';
      default: return '';
    }
  };

  const formattedDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }) + ' ' + date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = !isCompleted && new Date(task.dueDate) < new Date();

  return (
    <div 
      className={`glass-card p-4 d-flex flex-column h-100 ${getPriorityClass(task.priority)} animate-fade-in`}
      style={{ borderLeftWidth: '6px' }}
    >
      {/* Header: Priority & Actions */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        {getPriorityBadge(task.priority)}
        <div className="d-flex align-items-center gap-1">
          <button 
            onClick={() => onEdit(task)}
            className="btn btn-link p-1.5 rounded-circle text-decoration-none d-flex align-items-center justify-content-center transition-all border-0"
            style={{ 
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-primary)',
              width: '32px',
              height: '32px'
            }}
            title="Edit Task"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--border-color)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}
          >
            <Edit3 size={15} />
          </button>
          <button 
            onClick={() => onDelete(task.id)}
            className="btn btn-link p-1.5 rounded-circle text-decoration-none d-flex align-items-center justify-content-center transition-all border-0 text-danger"
            style={{ 
              backgroundColor: 'var(--bg-primary)',
              width: '32px',
              height: '32px'
            }}
            title="Delete Task"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        <h5 
          className={`card-title mb-2 text-truncate fw-semibold ${isCompleted ? 'text-decoration-line-through text-muted' : ''}`}
          style={{ color: isCompleted ? 'var(--text-secondary)' : 'var(--text-primary)' }}
        >
          {task.title}
        </h5>
        <p 
          className={`card-text text-secondary text-sm overflow-hidden mb-3`}
          style={{ 
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            fontSize: '0.875rem',
            lineHeight: '1.5'
          }}
        >
          {task.description || <span className="text-muted italic">No description provided.</span>}
        </p>
      </div>

      {/* Footer: Date & Status */}
      <div className="border-top pt-3 mt-auto">
        <div className="d-flex align-items-center justify-content-between">
          {/* Due Date Indicator */}
          <div className="d-flex align-items-center gap-1.5 small text-secondary">
            <Calendar size={14} className={isOverdue ? 'text-danger animate-pulse' : ''} />
            <span className={isOverdue ? 'text-danger fw-medium' : ''} style={{ fontSize: '0.785rem' }}>
              {formattedDate(task.dueDate)}
              {isOverdue && ' (Overdue)'}
            </span>
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => onToggleStatus(task)}
            className={`btn btn-sm d-flex align-items-center gap-1.5 px-3 py-1 rounded-pill border-0 transition-all`}
            style={{
              fontSize: '0.785rem',
              fontWeight: '600',
              backgroundColor: isCompleted ? 'var(--status-completed-bg)' : 'var(--status-pending-bg)',
              color: isCompleted ? 'var(--status-completed-text)' : 'var(--status-pending-text)'
            }}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 size={13} />
                <span>Completed</span>
              </>
            ) : (
              <>
                <Circle size={13} />
                <span>Pending</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
