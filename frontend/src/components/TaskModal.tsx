import React, { useState } from 'react';
import { Task, CreateTaskPayload, UpdateTaskPayload, Priority } from '../types';
import { AxiosError } from 'axios';

interface Props {
  task: Task | null;
  onSubmit: (payload: CreateTaskPayload | UpdateTaskPayload) => Promise<void>;
  onClose: () => void;
}

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

const toLocalInput = (isoStr: string): string => {
  const d = new Date(isoStr);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

const TaskModal: React.FC<Props> = ({ task, onSubmit, onClose }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [startTime, setStartTime] = useState(task ? toLocalInput(task.start_time) : '');
  const [endTime, setEndTime] = useState(task ? toLocalInput(task.end_time) : '');
  const [priority, setPriority] = useState<Priority>(task?.priority || 'medium');
  const [category, setCategory] = useState(task?.category || '');
  const [color, setColor] = useState(task?.color || '#4F46E5');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim() || !startTime || !endTime) {
      setError('Title, start time, and end time are required.');
      return;
    }
    if (new Date(startTime) >= new Date(endTime)) {
      setError('Start time must be before end time.');
      return;
    }
    setIsLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
        priority,
        category: category.trim() || undefined,
        color,
      });
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setError(axiosErr.response?.data?.message || 'Failed to save task.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', border: '1px solid #D1D5DB',
    borderRadius: '7px', fontSize: '14px', boxSizing: 'border-box',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div style={{ background: '#fff', borderRadius: '12px', padding: '28px', width: '440px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', color: '#111827' }}>{task ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6B7280' }}>✕</button>
        </div>

        {error && <div style={{ background: '#FEF2F2', color: '#B91C1C', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151', display: 'block', marginBottom: '5px' }}>Title *</label>
            <input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="Task title" required />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151', display: 'block', marginBottom: '5px' }}>Description</label>
            <textarea style={{ ...inputStyle, minHeight: '72px', resize: 'vertical' }} value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional description" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151', display: 'block', marginBottom: '5px' }}>Start Time *</label>
              <input style={inputStyle} type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151', display: 'block', marginBottom: '5px' }}>End Time *</label>
              <input style={inputStyle} type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151', display: 'block', marginBottom: '5px' }}>Priority</label>
              <select style={inputStyle} value={priority} onChange={e => setPriority(e.target.value as Priority)}>
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151', display: 'block', marginBottom: '5px' }}>Category</label>
              <input style={inputStyle} value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Work, Study" />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151', display: 'block', marginBottom: '8px' }}>Color</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {COLORS.map(c => (
                <div key={c} onClick={() => setColor(c)}
                  style={{ width: '26px', height: '26px', borderRadius: '50%', background: c, cursor: 'pointer', border: color === c ? '3px solid #111' : '2px solid transparent' }} />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={onClose}
              style={{ flex: 1, padding: '10px', background: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
              Cancel
            </button>
            <button type="submit" disabled={isLoading}
              style={{ flex: 1, padding: '10px', background: '#4F46E5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', opacity: isLoading ? 0.7 : 1 }}>
              {isLoading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
