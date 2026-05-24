import React from 'react';
import { Task, TaskStatus } from '../types';
import { format } from 'date-fns';

interface Props {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: TaskStatus) => void;
}

const priorityColors: Record<string, string> = { low: '#10B981', medium: '#F59E0B', high: '#EF4444' };
const statusLabels: Record<string, string> = { pending: '⏳ Pending', in_progress: '🔄 In Progress', completed: '✅ Completed', cancelled: '❌ Cancelled' };

const TaskCard: React.FC<Props> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const start = format(new Date(task.start_time), 'MMM d, h:mm a');
  const end = format(new Date(task.end_time), 'h:mm a');
  const isCompleted = task.status === 'completed';

  return (
    <div style={{
      background: '#fff',
      borderRadius: '10px',
      padding: '16px 20px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      borderLeft: `4px solid ${task.color}`,
      opacity: isCompleted ? 0.75 : 1,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '12px',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', color: '#111827', textDecoration: isCompleted ? 'line-through' : 'none' }}>
            {task.title}
          </h3>
          <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '12px', background: `${priorityColors[task.priority]}20`, color: priorityColors[task.priority], fontWeight: 'bold' }}>
            {task.priority.toUpperCase()}
          </span>
          {task.category && (
            <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '12px', background: '#EEF2FF', color: '#4F46E5' }}>
              {task.category}
            </span>
          )}
        </div>
        {task.description && (
          <p style={{ margin: '4px 0', fontSize: '13px', color: '#6B7280' }}>{task.description}</p>
        )}
        <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '6px' }}>
          🕐 {start} → {end}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
        <select
          value={task.status}
          onChange={e => onStatusChange(e.target.value as TaskStatus)}
          style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #E5E7EB', cursor: 'pointer', background: '#F9FAFB' }}
        >
          <option value="pending">⏳ Pending</option>
          <option value="in_progress">🔄 In Progress</option>
          <option value="completed">✅ Completed</option>
          <option value="cancelled">❌ Cancelled</option>
        </select>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={onEdit}
            style={{ padding: '4px 10px', fontSize: '12px', background: '#EEF2FF', color: '#4F46E5', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Edit
          </button>
          <button onClick={onDelete}
            style={{ padding: '4px 10px', fontSize: '12px', background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
