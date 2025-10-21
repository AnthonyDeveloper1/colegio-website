/**
 * Auth Service
 * Servicios de autenticación y perfil de usuario
 */

import api from './api';
import type { LoginCredentials, LoginResponse, User } from '@/types';

export const authService = {
  /**
   * Login de administrador
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/administracion/login', credentials);
    return response.data;
  },

  /**
   * Obtener perfil del usuario autenticado
   */
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/administracion/mi-perfil');
    return response.data;
  },

  /**
   * Logout (limpia localStorage)
   */
  logout: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  },
};
