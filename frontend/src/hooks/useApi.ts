import axios, { AxiosError } from 'axios';
import { AuthResponse, Task, CreateTaskPayload, UpdateTaskPayload, TaskFilters } from '../types';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({ baseURL: API_BASE });

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password });
    return data;
  },
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    return data;
  },
};

// Tasks API
export const tasksApi = {
  getAll: async (filters?: TaskFilters): Promise<{ tasks: Task[]; count: number }> => {
    const { data } = await api.get('/tasks', { params: filters });
    return data;
  },
  getById: async (id: number): Promise<Task> => {
    const { data } = await api.get<Task>(`/tasks/${id}`);
    return data;
  },
  create: async (payload: CreateTaskPayload): Promise<Task> => {
    const { data } = await api.post<Task>('/tasks', payload);
    return data;
  },
  update: async (id: number, payload: UpdateTaskPayload): Promise<Task> => {
    const { data } = await api.put<Task>(`/tasks/${id}`, payload);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};
