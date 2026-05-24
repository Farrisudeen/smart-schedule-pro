import React, { useState, useEffect, useCallback } from 'react';
import { Task, CreateTaskPayload, UpdateTaskPayload, TaskFilters, TaskStatus } from '../types';
import { tasksApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import FilterBar from '../components/FilterBar';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({});

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { tasks } = await tasksApi.getAll(filters);
      setTasks(tasks);
    } catch {
      setError('Failed to load tasks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleCreate = async (payload: CreateTaskPayload): Promise<void> => {
    await tasksApi.create(payload);
    setShowModal(false);
    fetchTasks();
  };

  const handleUpdate = async (id: number, payload: UpdateTaskPayload): Promise<void> => {
    await tasksApi.update(id, payload);
    setEditingTask(null);
    fetchTasks();
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm('Delete this task?')) return;
    await tasksApi.delete(id);
    fetchTasks();
  };

  const handleStatusChange = async (task: Task, status: TaskStatus): Promise<void> => {
    await tasksApi.update(task.id, { status });
    fetchTasks();
  };

  // Stats
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    high: tasks.filter(t => t.priority === 'high').length,
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#4F46E5', color: '#fff', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '22px' }}>📅 Smart Schedule Manager Pro</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '14px' }}>Hello, {user?.name}</span>
          <button onClick={logout} style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total Tasks', value: stats.total, color: '#4F46E5' },
            { label: 'Pending', value: stats.pending, color: '#F59E0B' },
            { label: 'Completed', value: stats.completed, color: '#10B981' },
            { label: 'High Priority', value: stats.high, color: '#EF4444' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderLeft: `4px solid ${s.color}` }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: '#6B7280' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', color: '#111827' }}>My Tasks</h2>
          <button
            onClick={() => setShowModal(true)}
            style={{ padding: '8px 18px', background: '#4F46E5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
          >
            + New Task
          </button>
        </div>

        {/* Filters */}
        <FilterBar filters={filters} onFilterChange={setFilters} />

        {/* Error */}
        {error && <div style={{ background: '#FEF2F2', color: '#B91C1C', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>{error}</div>}

        {/* Task List */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#9CA3AF', background: '#fff', borderRadius: '10px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📋</div>
            <p>No tasks found. Create your first task!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => setEditingTask(task)}
                onDelete={() => handleDelete(task.id)}
                onStatusChange={(status) => handleStatusChange(task, status)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {(showModal || editingTask) && (
        <TaskModal
          task={editingTask}
          onSubmit={(payload) => editingTask ? handleUpdate(editingTask.id, payload) : handleCreate(payload as CreateTaskPayload)}
          onClose={() => { setShowModal(false); setEditingTask(null); }}
        />
      )}
    </div>
  );
};

export default DashboardPage;
