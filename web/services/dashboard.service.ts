/**
 * Dashboard Service
 * Servicio para obtener estadísticas del dashboard
 */

import api from './api';
import type { Publication } from '@/types/publication.types';
import type { ContactMessage } from '@/types/message.types';

export interface DashboardStats {
  publications: number;
  categories: number;
  gallery: number;
  messages: number;
  total_messages: number;
  users: number;
}

export interface DashboardRecent {
  publications: Publication[];
  messages: ContactMessage[];
}

class DashboardService {
  /**
   * Obtener estadísticas del dashboard
   */
  async getStats(): Promise<DashboardStats> {
    const response = await api.get<DashboardStats>('/dashboard/stats');
    return response.data;
  }

  /**
   * Obtener datos recientes (publicaciones y mensajes)
   */
  async getRecent(): Promise<DashboardRecent> {
    const response = await api.get<DashboardRecent>('/dashboard/recent');
    return response.data;
  }
}

export const dashboardService = new DashboardService();
