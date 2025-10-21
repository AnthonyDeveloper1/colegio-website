/**
 * Publications Service
 * Servicios CRUD de publicaciones
 */

import api from './api';
import type {
  Publication,
  CreatePublicationDto,
  UpdatePublicationDto,
  PublicationFilters,
  PaginatedResponse,
  ApiResponse,
} from '@/types';

export const publicationsService = {
  /**
   * Obtener todas las publicaciones (paginado)
   */
  getAll: async (filters?: PublicationFilters): Promise<PaginatedResponse<Publication>> => {
    const response = await api.get<any>('/publicaciones', {
      params: filters,
    });
    
    // El backend retorna { items, total, page, per_page }
    // Transformar a { data, pagination }
    return {
      data: response.data.items || [],
      pagination: {
        page: response.data.page || 1,
        per_page: response.data.per_page || 10,
        total: response.data.total || 0,
        total_pages: Math.ceil((response.data.total || 0) / (response.data.per_page || 10)),
      },
    };
  },

  /**
   * Obtener publicación por ID
   */
  getById: async (id: number): Promise<Publication> => {
    const response = await api.get<Publication>(`/publicaciones/${id}`);
    return response.data;
  },

  /**
   * Obtener publicación por slug
   */
  getBySlug: async (slug: string): Promise<Publication> => {
    // Primero obtener todas y filtrar por slug (tu API no tiene endpoint por slug)
    const response = await publicationsService.getAll({ per_page: 100 });
    const post = response.data.find(p => p.slug === slug);
    if (!post) throw new Error('Publicación no encontrada');
    return post;
  },

  /**
   * Crear nueva publicación (requiere JWT)
   */
  create: async (data: CreatePublicationDto): Promise<ApiResponse<Publication>> => {
    const response = await api.post<ApiResponse<Publication>>('/publicaciones', data);
    return response.data;
  },

  /**
   * Actualizar publicación (requiere JWT)
   */
  update: async (id: number, data: UpdatePublicationDto): Promise<ApiResponse<Publication>> => {
    const response = await api.put<ApiResponse<Publication>>(`/publicaciones/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar publicación (requiere JWT)
   */
  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/publicaciones/${id}`);
    return response.data;
  },
};
