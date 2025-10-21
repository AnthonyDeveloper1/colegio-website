/**
 * Users Service
 * Servicio para gestión de usuarios (solo admin)
 */

import api from './api';
import type { User, CreateUserDto, UpdateUserDto } from '@/types';

export const usersService = {
  /**
   * Obtener todos los usuarios
   */
  async getAll(): Promise<User[]> {
    const { data } = await api.get('/usuarios');
    return data;
  },

  /**
   * Obtener un usuario por ID
   */
  async getById(id: number): Promise<User> {
    const { data } = await api.get(`/usuarios/${id}`);
    return data;
  },

  /**
   * Crear un nuevo usuario
   */
  async create(userData: CreateUserDto): Promise<User> {
    const { data } = await api.post('/usuarios', userData);
    return data;
  },

  /**
   * Actualizar un usuario
   */
  async update(id: number, userData: UpdateUserDto): Promise<User> {
    const { data } = await api.put(`/usuarios/${id}`, userData);
    return data;
  },

  /**
   * Eliminar un usuario
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/usuarios/${id}`);
  },
};
