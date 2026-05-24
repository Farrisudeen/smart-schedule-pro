import React from 'react';
import { TaskFilters, TaskStatus, Priority } from '../types';

interface Props {
  filters: TaskFilters;
  onFilterChange: (filters: TaskFilters) => void;
}

const FilterBar: React.FC<Props> = ({ filters, onFilterChange }) => {
  const update = (key: keyof TaskFilters, value: string) => {
    onFilterChange({ ...filters, [key]: value || undefined });
  };

  const selectStyle: React.CSSProperties = {
    padding: '7px 10px', border: '1px solid #E5E7EB', borderRadius: '7px',
    fontSize: '13px', background: '#fff', cursor: 'pointer',
  };

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
      <select style={selectStyle} value={filters.status || ''} onChange={e => update('status', e.target.value)}>
        <option value="">All Status</option>
        <option value="pending">⏳ Pending</option>
        <option value="in_progress">🔄 In Progress</option>
        <option value="completed">✅ Completed</option>
        <option value="cancelled">❌ Cancelled</option>
      </select>

      <select style={selectStyle} value={filters.priority || ''} onChange={e => update('priority', e.target.value)}>
        <option value="">All Priority</option>
        <option value="low">🟢 Low</option>
        <option value="medium">🟡 Medium</option>
        <option value="high">🔴 High</option>
      </select>

      <input
        style={{ ...selectStyle, width: '140px' }}
        placeholder="Category..."
        value={filters.category || ''}
        onChange={e => update('category', e.target.value)}
      />

      <input type="date" style={selectStyle} value={filters.startDate || ''} onChange={e => update('startDate', e.target.value)} title="From date" />
      <input type="date" style={selectStyle} value={filters.endDate || ''} onChange={e => update('endDate', e.target.value)} title="To date" />

      {hasFilters && (
        <button onClick={() => onFilterChange({})}
          style={{ padding: '7px 12px', background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: '7px', cursor: 'pointer', fontSize: '13px' }}>
          Clear Filters ✕
        </button>
      )}
    </div>
  );
};

export default FilterBar;
