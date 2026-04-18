import apiClient from './client';

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  role: 'admin' | 'project_manager' | 'site_engineer' | 'worker' | 'procurement_team';
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  full_name: string;
  password: string;
  role?: 'project_manager' | 'site_engineer' | 'worker' | 'procurement_team';
}

export const authAPI = {
  login: (data: LoginRequest) => apiClient.post<AuthResponse>('/auth/login', data),
  register: (data: RegisterRequest) => apiClient.post<User>('/auth/register', data),
  getCurrentUser: () => apiClient.get<User>('/auth/me'),
  forgotPassword: (email: string) => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (email: string, token: string, newPassword: string, confirmPassword: string) =>
    apiClient.post('/auth/reset-password', { 
      email,
      token, 
      new_password: newPassword, 
      confirm_password: confirmPassword 
    }),
};
