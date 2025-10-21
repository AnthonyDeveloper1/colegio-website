/**
 * Categories Service
 * Servicios CRUD de categorías
 */

import api from './api';
import type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  ApiResponse,
} from '@/types';

export const categoriesService = {
  /**
   * Obtener todas las categorías
   */
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categorias');
    return response.data;
  },

  /**
   * Obtener categoría por ID
   */
  getById: async (id: number): Promise<Category> => {
    const response = await api.get<Category>(`/categorias/${id}`);
    return response.data;
  },

  /**
   * Crear nueva categoría (requiere JWT)
   */
  create: async (data: CreateCategoryDto): Promise<ApiResponse<Category>> => {
    const response = await api.post<ApiResponse<Category>>('/categorias', data);
    return response.data;
  },

  /**
   * Actualizar categoría (requiere JWT)
   */
  update: async (id: number, data: UpdateCategoryDto): Promise<ApiResponse<Category>> => {
    const response = await api.put<ApiResponse<Category>>(`/categorias/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar categoría (requiere JWT)
   */
  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/categorias/${id}`);
    return response.data;
  },
};
