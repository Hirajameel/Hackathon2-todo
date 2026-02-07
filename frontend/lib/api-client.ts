import axios, { AxiosError, AxiosInstance } from 'axios';
import { AuthResponse, AuthLoginPayload, AuthSignupPayload, Task, TaskCreatePayload, TaskUpdatePayload, APIError, User } from './types';

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from Better Auth session (will be implemented with Better Auth)
    // For now, we'll check localStorage as a fallback
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<APIError>) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear session and redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
          }
          console.error('Unauthorized: Please login again');
          break;

        case 403:
          // Forbidden - show access denied message
          console.error('Access denied:', data?.message || 'You do not have permission to access this resource');
          break;

        case 500:
          // Server error
          console.error('Server error:', data?.message || 'An unexpected server error occurred. Please try again.');
          break;

        default:
          // Other errors
          console.error('API Error:', data?.message || error.message);
      }
    } else if (error.request) {
      // Network error
      console.error('Network error: Please check your internet connection');
    } else {
      // Other errors
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// Authentication API methods
export const authAPI = {
  signup: async (payload: AuthSignupPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/signup', payload);
    return response.data;
  },

  login: async (payload: AuthLoginPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', payload);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/api/auth/logout');
  },

  getSession: async (): Promise<{ user: User }> => {
    const response = await apiClient.get('/api/auth/session');
    return response.data;
  },
};

// Task API methods (will be implemented in Phase 4)
export const taskAPI = {
  getTasks: async (): Promise<Task[]> => {
    const response = await apiClient.get<Task[]>('/api/tasks');
    return response.data;
  },

  createTask: async (payload: TaskCreatePayload): Promise<Task> => {
    const response = await apiClient.post<Task>('/api/tasks', payload);
    return response.data;
  },

  updateTask: async (id: string | number, payload: TaskUpdatePayload): Promise<Task> => {
    const response = await apiClient.put<Task>(`/api/tasks/${id}`, payload);
    return response.data;
  },

  deleteTask: async (id: string | number): Promise<void> => {
    await apiClient.delete(`/api/tasks/${id}`);
  },

  toggleTaskStatus: async (id: string | number): Promise<Task> => {
    const response = await apiClient.patch<Task>(`/api/tasks/${id}/toggle`);
    return response.data;
  },
};

export default apiClient;
