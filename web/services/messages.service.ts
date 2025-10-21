/**
 * Messages Service
 * Servicios de mensajes de contacto
 */

import api from './api';
import type {
  ContactMessage,
  CreateContactMessageDto,
  ApiResponse,
} from '@/types';

export const messagesService = {
  /**
   * Enviar mensaje de contacto (público, no requiere JWT)
   */
  send: async (data: CreateContactMessageDto): Promise<ApiResponse<ContactMessage>> => {
    const response = await api.post<ApiResponse<ContactMessage>>('/mensajes_contacto', data);
    return response.data;
  },

  /**
   * Obtener todos los mensajes (requiere JWT admin)
   */
  getAll: async (): Promise<ContactMessage[]> => {
    const response = await api.get<ContactMessage[]>('/mensajes_contacto');
    return response.data;
  },

  /**
   * Obtener mensaje por ID (requiere JWT admin)
   */
  getById: async (id: number): Promise<ContactMessage> => {
    const response = await api.get<ContactMessage>(`/mensajes_contacto/${id}`);
    return response.data;
  },

  /**
   * Eliminar mensaje (requiere JWT admin)
   */
  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/mensajes_contacto/${id}`);
    return response.data;
  },
};
