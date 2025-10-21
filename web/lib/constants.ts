/**
 * Constants
 * I.E. José Abelardo Quiñones Gonzales
 * Constantes globales del proyecto
 */

// Institution Info
export const INSTITUTION = {
  name: 'I.E. José Abelardo Quiñones Gonzales',
  shortName: 'I.E. JAQG',
  location: 'https://maps.app.goo.gl/UZocuDndhmgqrmQ39',
  email: 'contacto@iejaqg.edu.pe', // Actualizar con email real
  phone: '+51 999 999 999', // Actualizar con teléfono real
  colors: {
    rojo: {
      primary: '#DC2626',
      light: '#FCA5A5',
      dark: '#991B1B',
    },
    amarillo: {
      primary: '#F59E0B',
      light: '#FDE68A',
      dark: '#B45309',
    },
    azul: {
      primary: '#2563EB',
      light: '#BFDBFE',
      dark: '#1E40AF',
    },
  },
} as const;

// API - Usar la URL correcta según el entorno
// Server-side: process.env.API_URL || NEXT_PUBLIC_API_URL
// Client-side: NEXT_PUBLIC_API_URL
export const API_URL = (typeof window === 'undefined' 
  ? (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL)
  : process.env.NEXT_PUBLIC_API_URL
) || 'http://localhost:5000/api';

// Cloudinary
export const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';

// Pagination
export const DEFAULT_PAGE_SIZE = 12;
export const ADMIN_PAGE_SIZE = 20;

// Routes
export const ROUTES = {
  // Public
  HOME: '/',
  ABOUT: '/nosotros',
  BLOG: '/blog',
  BLOG_POST: (slug: string) => `/blog/${slug}`,
  GALLERY: '/galeria',
  CONTACT: '/contacto',
  LOGIN: '/login',
  
  // Admin
  ADMIN: {
    DASHBOARD: '/admin',
    LOGIN: '/login',
    USERS: '/admin/users',
    PUBLICATIONS: '/admin/publications',
    PUBLICATIONS_NEW: '/admin/publications/new',
    PUBLICATIONS_EDIT: (id: number) => `/admin/publications/${id}`,
    GALLERY: '/admin/gallery',
    GALLERY_NEW: '/admin/gallery/new',
    GALLERY_EDIT: (id: number) => `/admin/gallery/${id}`,
    MESSAGES: '/admin/messages',
    CATEGORIES: '/admin/categories',
    PROFILE: '/admin/profile',
  },
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
} as const;

// Toast Messages
export const TOAST_MESSAGES = {
  // Success
  LOGIN_SUCCESS: '¡Bienvenido!',
  LOGOUT_SUCCESS: 'Sesión cerrada correctamente',
  CREATE_SUCCESS: 'Creado exitosamente',
  UPDATE_SUCCESS: 'Actualizado exitosamente',
  DELETE_SUCCESS: 'Eliminado exitosamente',
  MESSAGE_SENT: '¡Mensaje enviado! Te contactaremos pronto',
  
  // Errors
  LOGIN_ERROR: 'Credenciales inválidas',
  GENERIC_ERROR: 'Ocurrió un error, intenta nuevamente',
  NETWORK_ERROR: 'Error de conexión, verifica tu internet',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción',
} as const;

// Gallery Categories
export const GALLERY_CATEGORIES = [
  'Instalaciones',
  'Eventos',
  'Deportes',
  'Académico',
  'Cultural',
  'Otro',
] as const;

// Date Formats
export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';
