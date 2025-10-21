/**
 * Gallery Form Page (Create/Edit)
 * Formulario para subir o editar imagen de galería
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Upload, Image as ImageIcon } from 'lucide-react';
import { Card, Button, Input, Textarea } from '@/components/ui';
import { galleryService } from '@/services';
import { createGalleryItemSchema, updateGalleryItemSchema } from '@/lib/validators';
import { GALLERY_CATEGORIES } from '@/lib/constants';
import { useUIStore } from '@/stores';
import type { CreateGalleryItemDto, UpdateGalleryItemDto } from '@/types';

export default function GalleryFormPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params?.id ? Number(params.id) : null;
  const isEditMode = itemId !== null;

  const { showToast, setLoading } = useUIStore();
  const [isLoadingData, setIsLoadingData] = useState(isEditMode);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateGalleryItemDto | UpdateGalleryItemDto>({
    resolver: zodResolver(isEditMode ? updateGalleryItemSchema : createGalleryItemSchema),
    defaultValues: {
      title: '',
      url: '',
      caption: '',
      category: 'Otro',
    },
  });

  const urlValue = watch('url');

  // Update preview when URL changes
  useEffect(() => {
    if (urlValue) {
      setPreviewUrl(urlValue);
    }
  }, [urlValue]);

  // Fetch item data if editing
  useEffect(() => {
    if (isEditMode && itemId) {
      const fetchItem = async () => {
        try {
          const item = await galleryService.getById(itemId);
          setValue('title', item.title);
          setValue('url', item.url);
          setValue('caption', item.caption || '');
          setValue('category', item.category || 'Otro');
          setPreviewUrl(item.url);
        } catch (error) {
          showToast({
            type: 'error',
            message: 'Error al cargar la imagen',
          });
          router.push('/admin/gallery');
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchItem();
    }
  }, [isEditMode, itemId]);

  const onSubmit = async (data: CreateGalleryItemDto | UpdateGalleryItemDto) => {
    setLoading(true);
    try {
      if (isEditMode && itemId) {
        await galleryService.update(itemId, data as UpdateGalleryItemDto);
        showToast({
          type: 'success',
          message: 'Imagen actualizada correctamente',
        });
      } else {
        await galleryService.create(data as CreateGalleryItemDto);
        showToast({
          type: 'success',
          message: 'Imagen subida correctamente',
        });
      }
      router.push('/admin/gallery');
    } catch (error: any) {
      showToast({
        type: 'error',
        message: error.response?.data?.msg || 'Error al guardar la imagen',
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/gallery')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Editar Imagen' : 'Subir Imagen'}
          </h1>
          <p className="text-gray-600">
            {isEditMode ? 'Actualiza la información de la imagen' : 'Completa los campos para subir una nueva imagen'}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <Input
              label="Título"
              placeholder="Título de la imagen"
              error={errors.title?.message}
              required
              fullWidth
              {...register('title')}
            />

            {/* URL */}
            <Input
              label="URL de la Imagen"
              placeholder="https://res.cloudinary.com/..."
              helperText="URL de Cloudinary o imagen externa"
              error={errors.url?.message}
              required
              fullWidth
              {...register('url')}
            />

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría <span className="text-red-500">*</span>
              </label>
              <select
                {...register('category')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {GALLERY_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Caption */}
            <Textarea
              label="Descripción"
              placeholder="Descripción de la imagen (opcional)"
              rows={3}
              error={errors.caption?.message}
              fullWidth
              {...register('caption')}
            />

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/gallery')}
                fullWidth
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                leftIcon={<Save className="w-5 h-5" />}
                fullWidth
              >
                {isEditMode ? 'Actualizar' : 'Guardar'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Preview */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Vista Previa
          </h3>
          {previewUrl ? (
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => setPreviewUrl('')}
                />
              </div>
              <div className="text-sm text-gray-600">
                <p className="font-medium">URL: {previewUrl}</p>
              </div>
            </div>
          ) : (
            <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Ingresa una URL para ver la vista previa</p>
              </div>
            </div>
          )}

          {/* Upload Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">
              📸 Cómo subir imágenes a Cloudinary
            </h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Ve a tu dashboard de Cloudinary</li>
              <li>Sube la imagen usando Media Library</li>
              <li>Copia la URL de la imagen</li>
              <li>Pégala en el campo "URL de la Imagen"</li>
            </ol>
          </div>
        </Card>
      </div>
    </div>
  );
}
