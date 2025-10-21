/**
 * API Instance
 * Axios instance configurada con interceptors
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { STORAGE_KEYS } from '@/lib/constants';
import type { ApiError } from '@/types';

// Determinar la URL correcta según el entorno
// Server-side (dentro de Docker): usa API_URL interna
// Client-side (navegador): usa NEXT_PUBLIC_API_URL
const getApiUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side: usar API_URL interna si existe, sino NEXT_PUBLIC_API_URL
    return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  }
  // Client-side: siempre usar NEXT_PUBLIC_API_URL
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
};

// Crear instancia de axios
const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 segundos
});

// Request interceptor: Agregar JWT token a todas las peticiones
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Obtener token del localStorage
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
      : null;
    
    // Si existe token, agregarlo al header Authorization
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Manejo global de errores
api.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, retornarla directamente
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Manejo de errores comunes
    if (error.response) {
      const status = error.response.status;
      
      switch (status) {
        case 401:
          // No autorizado: limpiar sesión y redirect a login
          if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            const isLoginPage = currentPath.includes('/login');
            const isLoginRequest = error.config?.url?.includes('/login');
            
            // Si estamos en la página de login O es una petición de login, NO limpiar ni redirigir
            // (dejar que el componente maneje el error)
            if (isLoginPage || isLoginRequest) {
              break;
            }
            
            // Para otras rutas protegidas, limpiar sesión y redirigir
            console.warn('⚠️ Sesión expirada. Redirigiendo a login...');
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
            
            // Mostrar mensaje antes de redirigir
            alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            window.location.href = '/login';
          }
          break;
          
        case 403:
          // Prohibido: no tiene permisos
          console.error('No tienes permisos para realizar esta acción');
          break;
          
        case 404:
          // No encontrado
          console.error('Recurso no encontrado');
          break;
          
        case 500:
          // Error del servidor
          console.error('Error del servidor, intenta nuevamente');
          break;
      }
    } else if (error.request) {
      // La petición fue hecha pero no hubo respuesta
      // Backend no disponible - esto es esperado en desarrollo
      console.warn('⚠️ Backend no disponible en http://localhost:5000');
    }
    
    return Promise.reject(error);
  }
);

export default api;
