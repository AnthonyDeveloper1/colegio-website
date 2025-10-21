/**
 * Categories List Page
 * Lista de todas las categorías con búsqueda y acciones
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react';
import { Card, Button, Badge, Spinner, Modal, Input } from '@/components/ui';
import { categoriesService } from '@/services';
import { formatDate } from '@/lib/utils';
import { useUIStore } from '@/stores';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '@/types';

export default function CategoriesListPage() {
  const { showToast, setLoading } = useUIStore();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formErrors, setFormErrors] = useState({ name: '', description: '' });

  // Fetch categories
  const fetchCategories = async () => {
    setIsLoadingData(true);
    try {
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Error al cargar las categorías',
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
    }
    setFormErrors({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setFormErrors({ name: '', description: '' });
  };

  const validateForm = () => {
    const errors = { name: '', description: '' };
    
    if (!formData.name.trim()) {
      errors.name = 'El nombre es requerido';
    }
    
    setFormErrors(errors);
    return !errors.name;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (editingCategory) {
        await categoriesService.update(editingCategory.id, formData as UpdateCategoryDto);
        showToast({
          type: 'success',
          message: 'Categoría actualizada correctamente',
        });
      } else {
        await categoriesService.create(formData as CreateCategoryDto);
        showToast({
          type: 'success',
          message: 'Categoría creada correctamente',
        });
      }
      
      handleCloseModal();
      fetchCategories();
    } catch (error: any) {
      showToast({
        type: 'error',
        message: error.response?.data?.msg || 'Error al guardar la categoría',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría? Las publicaciones asociadas quedarán sin categoría.')) {
      return;
    }

    setLoading(true);
    try {
      await categoriesService.delete(id);
      showToast({
        type: 'success',
        message: 'Categoría eliminada correctamente',
      });
      
      fetchCategories();
    } catch (error: any) {
      showToast({
        type: 'error',
        message: error.response?.data?.msg || 'Error al eliminar la categoría',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Categorías
          </h1>
          <p className="text-gray-600">
            Gestiona las categorías de las publicaciones
          </p>
        </div>
        <Button 
          variant="primary" 
          leftIcon={<Plus className="w-5 h-5" />}
          onClick={() => handleOpenModal()}
        >
          Nueva Categoría
        </Button>
      </div>

      {/* Categories List */}
      {isLoadingData ? (
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" />
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Card key={cat.id} variant="hover">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FolderOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{cat.name}</h3>
                    {cat.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  {formatDate(cat.created_at)}
                </span>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleOpenModal(cat)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(cat.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              No hay categorías todavía
            </p>
            <Button 
              variant="primary"
              onClick={() => handleOpenModal()}
            >
              Crear Primera Categoría
            </Button>
          </div>
        </Card>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Nombre"
            placeholder="Nombre de la categoría"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
            required
            fullWidth
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Descripción de la categoría (opcional)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingCategory ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
