/**
 * Publication Form Page (Create/Edit)
 * Formulario para crear o editar una publicación
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { Card, Button, Input, RichTextEditor } from '@/components/ui';
import { publicationsService, categoriesService } from '@/services';
import { createPublicationSchema, updatePublicationSchema } from '@/lib/validators';
import { slugify } from '@/lib/utils';
import { useUIStore } from '@/stores';
import type { CreatePublicationDto, UpdatePublicationDto, Category } from '@/types';

export default function PublicationFormPage() {
  const router = useRouter();
  const params = useParams();
  const publicationId = params?.id ? Number(params.id) : null;
  const isEditMode = publicationId !== null;

  const { showToast, setLoading } = useUIStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(isEditMode);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreatePublicationDto | UpdatePublicationDto>({
    resolver: zodResolver(isEditMode ? updatePublicationSchema : createPublicationSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      image_url: '',
      category_id: undefined,
    },
  });

  const titleValue = watch('title');

  // Auto-generate slug from title
  useEffect(() => {
    if (titleValue && !isEditMode) {
      setValue('slug', slugify(titleValue));
    }
  }, [titleValue, isEditMode, setValue]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesService.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch publication data if editing
  useEffect(() => {
    if (isEditMode && publicationId) {
      const fetchPublication = async () => {
        try {
          const pub = await publicationsService.getById(publicationId);
          setValue('title', pub.title);
          setValue('slug', pub.slug);
          setValue('content', pub.content);
          setValue('excerpt', pub.excerpt || '');
          setValue('image_url', pub.image_url || '');
          setValue('category_id', pub.category_id);
        } catch (error) {
          showToast({
            type: 'error',
            message: 'Error al cargar la publicación',
          });
          router.push('/admin/publications');
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchPublication();
    }
  }, [isEditMode, publicationId]);

  const onSubmit = async (data: CreatePublicationDto | UpdatePublicationDto) => {
    setLoading(true);
    try {
      if (isEditMode && publicationId) {
        await publicationsService.update(publicationId, data as UpdatePublicationDto);
        showToast({
          type: 'success',
          message: 'Publicación actualizada correctamente',
        });
      } else {
        await publicationsService.create(data as CreatePublicationDto);
        showToast({
          type: 'success',
          message: 'Publicación creada correctamente',
        });
      }
      router.push('/admin/publications');
    } catch (error: any) {
      showToast({
        type: 'error',
        message: error.response?.data?.msg || 'Error al guardar la publicación',
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
          onClick={() => router.push('/admin/publications')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Editar Publicación' : 'Nueva Publicación'}
          </h1>
          <p className="text-gray-600">
            {isEditMode ? 'Actualiza la información de la publicación' : 'Completa los campos para crear una nueva publicación'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <div className="space-y-6">
            {/* Title */}
            <Input
              label="Título"
              placeholder="Título de la publicación"
              error={errors.title?.message}
              required
              fullWidth
              {...register('title')}
            />

            {/* Slug */}
            <Input
              label="Slug"
              placeholder="slug-de-la-publicacion"
              helperText="URL amigable (se genera automáticamente del título)"
              error={errors.slug?.message}
              required
              fullWidth
              {...register('slug')}
            />

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría <span className="text-red-500">*</span>
              </label>
              <select
                {...register('category_id', { 
                  setValueAs: (v) => (v === '' ? undefined : Number(v)) 
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.category_id.message}
                </p>
              )}
            </div>

            {/* Image URL */}
            <Input
              label="URL de Imagen"
              placeholder="https://ejemplo.com/imagen.jpg"
              helperText="URL de la imagen destacada"
              error={errors.image_url?.message}
              fullWidth
              {...register('image_url')}
            />

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Extracto
              </label>
              <textarea
                {...register('excerpt')}
                rows={3}
                placeholder="Breve descripción de la publicación..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              {errors.excerpt && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.excerpt.message}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Resumen que aparecerá en las tarjetas de vista previa
              </p>
            </div>

            {/* Content - Rich Text Editor */}
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  label="Contenido"
                  content={field.value || ''}
                  onChange={field.onChange}
                  error={errors.content?.message}
                  required
                  placeholder="Escribe el contenido de la publicación..."
                />
              )}
            />
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/publications')}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            leftIcon={<Save className="w-5 h-5" />}
          >
            {isEditMode ? 'Actualizar' : 'Publicar'}
          </Button>
        </div>
      </form>
    </div>
  );
}
