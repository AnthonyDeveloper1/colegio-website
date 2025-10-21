/**
 * Gallery Service
 * Servicios CRUD de galería
 */

import api from './api';
import type {
  GalleryItem,
  CreateGalleryItemDto,
  UpdateGalleryItemDto,
  GalleryFilters,
  ApiResponse,
} from '@/types';

export const galleryService = {
  /**
   * Obtener todos los items de galería
   */
  getAll: async (filters?: GalleryFilters): Promise<GalleryItem[]> => {
    const response = await api.get<GalleryItem[]>('/galeria', {
      params: filters,
    });
    return response.data;
  },

  /**
   * Obtener item de galería por ID
   */
  getById: async (id: number): Promise<GalleryItem> => {
    const response = await api.get<GalleryItem>(`/galeria/${id}`);
    return response.data;
  },

  /**
   * Crear nuevo item en galería (requiere JWT)
   */
  create: async (data: CreateGalleryItemDto): Promise<ApiResponse<GalleryItem>> => {
    const response = await api.post<ApiResponse<GalleryItem>>('/galeria', data);
    return response.data;
  },

  /**
   * Actualizar item de galería (requiere JWT)
   */
  update: async (id: number, data: UpdateGalleryItemDto): Promise<ApiResponse<GalleryItem>> => {
    const response = await api.put<ApiResponse<GalleryItem>>(`/galeria/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar item de galería (requiere JWT)
   */
  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/galeria/${id}`);
    return response.data;
  },
};
