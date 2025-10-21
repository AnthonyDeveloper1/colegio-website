/**
 * UI Store
 * Estado global de la interfaz de usuario
 */

import { create } from 'zustand';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface Modal {
  [key: string]: boolean;
}

interface UIState {
  // State
  isLoading: boolean;
  modals: Modal;
  toasts: Toast[];
  sidebarOpen: boolean;
  
  // Loading actions
  setLoading: (loading: boolean) => void;
  
  // Modal actions
  openModal: (name: string) => void;
  closeModal: (name: string) => void;
  isModalOpen: (name: string) => boolean;
  
  // Toast actions
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  
  // Sidebar actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  // Initial state
  isLoading: false,
  modals: {},
  toasts: [],
  sidebarOpen: false,

  // Loading
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  // Modals
  openModal: (name: string) => {
    set((state) => ({
      modals: { ...state.modals, [name]: true },
    }));
  },

  closeModal: (name: string) => {
    set((state) => ({
      modals: { ...state.modals, [name]: false },
    }));
  },

  isModalOpen: (name: string) => {
    return get().modals[name] || false;
  },

  // Toasts
  showToast: (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 5000,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto-remove después del duration
    setTimeout(() => {
      get().removeToast(id);
    }, newToast.duration);
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },

  // Sidebar
  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  setSidebarOpen: (open: boolean) => {
    set({ sidebarOpen: open });
  },
}));
