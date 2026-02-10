// Core entities
export interface Task {
  id: string | number;
  title: string;
  description: string | null;
  completed: boolean;
  userId: string | number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string | number;
  email: string;
}

// API payloads
export interface TaskCreatePayload {
  title: string;
  description?: string;
}

export interface TaskUpdatePayload {
  title?: string;
  description?: string | null;
  completed?: boolean;
}

export interface AuthLoginPayload {
  email: string;
  password: string;
}

export interface AuthSignupPayload {
  email: string;
  password: string;
}

// API responses
export interface AuthResponse {
  user: User;
  token?: string;
}

export interface APIError {
  message: string;
  statusCode: number;
  errors?: Record<string, string>;
}
