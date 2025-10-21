/**
 * Auth Store
 * Estado global de autenticación con Zustand
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';

interface AuthState {
  // State
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      token: null,
      user: null,
      isAuthenticated: false,

      // Login: guardar token y usuario
      login: (token: string, user: User) => {
        set({
          token,
          user,
          isAuthenticated: true,
        });
        
        // También guardar en localStorage para el interceptor de axios
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        }
      },

      // Logout: limpiar todo
      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
        
        // Limpiar localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
        }
      },

      // Actualizar usuario
      setUser: (user: User) => {
        set({ user });
        
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        }
      },

      // Verificar si está autenticado
      checkAuth: () => {
        const state = get();
        return state.isAuthenticated && !!state.token;
      },
    }),
    {
      name: 'auth-storage', // nombre en localStorage
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
