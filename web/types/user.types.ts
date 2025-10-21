/**
 * User Types
 * Tipos relacionados con usuarios y autenticación
 */

export interface User {
  id: number;
  email: string;
  name?: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'superadmin';
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name?: string;
  role: 'admin';
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  name?: string;
  role?: 'admin';
}
