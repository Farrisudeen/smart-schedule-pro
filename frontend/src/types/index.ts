// Shared TypeScript types across the application

export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  start_time: string;  // ISO string
  end_time: string;    // ISO string
  priority: Priority;
  status: TaskStatus;
  category?: string;
  color: string;
  created_at: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  priority?: Priority;
  category?: string;
  color?: string;
}

export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {
  status?: TaskStatus;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  conflictTaskId?: number;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: Priority;
  category?: string;
  startDate?: string;
  endDate?: string;
}
