/**
 * New Publication Page
 * Formulario completo para crear nueva publicación
 * Features: Auto-save, Preview, Validaciones, Upload, SEO preview
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye, Upload, X, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { Card, Button, Input, Badge } from '@/components/ui';
import { publicationsService, categoriesService, uploadService } from '@/services';
import { useUIStore } from '@/stores';
import type { Category } from '@/types';
import { ROUTES } from '@/lib/constants';

export default function NewPublicationPage() {
  const router = useRouter();
  const { showToast, setLoading } = useUIStore();

  // Form data
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('Publicado');

  // Categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Preview & UI state
  const [imagePreview, setImagePreview] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Stats
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !slug) {
      const generatedSlug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
    }
  }, [title, slug]);

  // Calculate word count and reading time
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
    setReadingTime(Math.ceil(words / 200)); // 200 words per minute
  }, [content]);

  // Update image preview
  useEffect(() => {
    if (imageUrl) {
      setImagePreview(imageUrl);
    }
  }, [imageUrl]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesService.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        showToast({
          type: 'error',
          message: 'Error al cargar las categorías',
        });
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [showToast]);

  // Validation
  const validateField = useCallback((field: string, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'title':
        if (!value.trim()) {
          newErrors.title = 'El título es requerido';
        } else if (value.length < 10) {
          newErrors.title = 'El título debe tener al menos 10 caracteres';
        } else if (value.length > 200) {
          newErrors.title = 'El título no debe exceder 200 caracteres';
        } else {
          delete newErrors.title;
        }
        break;

      case 'slug':
        if (value && !/^[a-z0-9-]+$/.test(value)) {
          newErrors.slug = 'El slug solo puede contener letras minúsculas, números y guiones';
        } else {
          delete newErrors.slug;
        }
        break;

      case 'content':
        if (!value.trim()) {
          newErrors.content = 'El contenido es requerido';
        } else if (value.length < 50) {
          newErrors.content = 'El contenido debe tener al menos 50 caracteres';
        } else {
          delete newErrors.content;
        }
        break;

      case 'excerpt':
        if (value && value.length > 500) {
          newErrors.excerpt = 'El extracto no debe exceder 500 caracteres';
        } else {
          delete newErrors.excerpt;
        }
        break;

      case 'categoryId':
        if (!value) {
          newErrors.categoryId = 'Debes seleccionar una categoría';
        } else {
          delete newErrors.categoryId;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [errors]);

  // Handle blur (touched)
  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    
    switch (field) {
      case 'title':
        validateField('title', title);
        break;
      case 'slug':
        validateField('slug', slug);
        break;
      case 'content':
        validateField('content', content);
        break;
      case 'excerpt':
        validateField('excerpt', excerpt);
        break;
      case 'categoryId':
        validateField('categoryId', categoryId);
        break;
    }
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo (imágenes y videos)
    const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp', 'image/tiff'];
    const validVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm', 'video/x-flv'];
    const validTypes = [...validImageTypes, ...validVideoTypes];
    
    if (!validTypes.includes(file.type)) {
      showToast({
        type: 'error',
        message: 'Tipo de archivo no válido. Formatos permitidos: PNG, JPG, GIF, WEBP, SVG, BMP, TIFF, MP4, MOV, AVI, MKV, WEBM',
      });
      return;
    }

    // Validar tamaño (máximo 10MB para imágenes, 50MB para videos)
    const isVideo = validVideoTypes.includes(file.type);
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024; // 50MB videos, 10MB imágenes
    
    if (file.size > maxSize) {
      const maxSizeMB = isVideo ? '50MB' : '10MB';
      showToast({
        type: 'error',
        message: `El archivo es muy grande. Tamaño máximo: ${maxSizeMB}`,
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simular progreso
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const result = await uploadService.uploadImage(file, 'publicaciones');
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Usar la URL segura de Cloudinary
      setImageUrl(result.secure_url);
      setImagePreview(result.secure_url);

      showToast({
        type: 'success',
        message: 'Imagen subida exitosamente',
      });
    } catch (error: any) {
      showToast({
        type: 'error',
        message: error.response?.data?.msg || 'Error al subir la imagen',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle submit
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Marcar todos los campos como touched
    setTouched({
      title: true,
      slug: true,
      content: true,
      excerpt: true,
      categoryId: true,
    });

    // Validar todos los campos
    const titleValid = validateField('title', title);
    const slugValid = validateField('slug', slug);
    const contentValid = validateField('content', content);
    const excerptValid = validateField('excerpt', excerpt);
    const categoryValid = validateField('categoryId', categoryId);

    if (!titleValid || !slugValid || !contentValid || !excerptValid || !categoryValid) {
      showToast({
        type: 'error',
        message: 'Por favor corrige los errores del formulario',
      });
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      const publicationData = {
        title: title.trim(),
        slug: slug.trim() || title.toLowerCase().replace(/\s+/g, '-'),
        content: content.trim(),
        excerpt: excerpt.trim() || undefined,
        image_url: imageUrl.trim() || undefined,
        category_id: Number(categoryId),
      };

      console.log('Creando publicación:', publicationData);

      await publicationsService.create(publicationData);

      showToast({
        type: 'success',
        message: '¡Publicación creada exitosamente!',
      });

      // Redirigir a la lista de publicaciones
      setTimeout(() => {
        router.push(ROUTES.ADMIN.PUBLICATIONS);
      }, 500);

    } catch (error: any) {
      console.error('Error al crear publicación:', error);
      
      let errorMessage = 'Error al crear la publicación';
      
      // Manejar error 401 (no autorizado)
      if (error.response?.status === 401) {
        errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
        // El interceptor ya redirigirá a login
      } 
      // Manejar error de red
      else if (error.message === 'Network Error' || !error.response) {
        errorMessage = 'Error de conexión. Verifica que el servidor esté corriendo.';
      }
      // Otros errores
      else if (error.response?.data?.msg) {
        errorMessage = error.response.data.msg;
      }
      
      if (error.response?.data?.msg) {
        errorMessage = error.response.data.msg;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showToast({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  // Preview Modal Component
  const PreviewModal = () => {
    if (!showPreview) return null;

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Vista Previa</h2>
            <button
              onClick={() => setShowPreview(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <Badge>{categories.find(c => c.id === Number(categoryId))?.name || 'Sin categoría'}</Badge>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">{title || 'Título de la publicación'}</h1>
              <p className="text-gray-600 mt-2">{excerpt || 'Sin extracto'}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
                <span>{wordCount} palabras</span>
                <span>•</span>
                <span>{readingTime} min de lectura</span>
              </div>
            </div>

            {/* Featured Image */}
            {imagePreview && (
              <div className="mb-6">
                <img
                  src={imagePreview}
                  alt={title}
                  className="w-full h-auto rounded-lg object-cover max-h-96"
                />
              </div>
            )}

            {/* Content */}
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700">
                {content || 'Sin contenido'}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowPreview(false)}
            >
              Cerrar
            </Button>
            <Button
              variant="primary"
              leftIcon={<Save className="w-5 h-5" />}
              onClick={() => {
                setShowPreview(false);
                handleSubmit();
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publicando...' : 'Publicar'}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <PreviewModal />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              leftIcon={<ArrowLeft className="w-5 h-5" />}
              onClick={() => router.back()}
            >
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Nueva Publicación</h1>
              <p className="text-gray-600 mt-1">Crea una nueva publicación para el sitio</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              leftIcon={<Eye className="w-5 h-5" />}
              onClick={() => setShowPreview(true)}
              disabled={!title || !content}
            >
              Vista Previa
            </Button>
            <Button
              variant="primary"
              leftIcon={<Save className="w-5 h-5" />}
              onClick={(e: any) => handleSubmit(e)}
              disabled={isSubmitting || Object.keys(errors).length > 0}
            >
              {isSubmitting ? 'Publicando...' : 'Publicar'}
            </Button>
          </div>
        </div>

        {/* Validation Summary */}
        {Object.keys(errors).length > 0 && Object.keys(touched).length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-900">Hay errores en el formulario</h3>
                <ul className="mt-2 space-y-1">
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field} className="text-sm text-red-700">• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}

        <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <Card>
                <div className="space-y-4">
                  <div>
                    <Input
                      label="Título *"
                      placeholder="Ej: Nueva modalidad de matrícula 2024"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (touched.title) validateField('title', e.target.value);
                      }}
                      onBlur={() => handleBlur('title')}
                      required
                      error={touched.title && errors.title ? errors.title : undefined}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{title.length}/200 caracteres</span>
                      {title.length >= 10 && title.length <= 200 && (
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Longitud óptima
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <Input
                      label="Slug (URL)"
                      placeholder="nueva-modalidad-matricula-2024"
                      value={slug}
                      onChange={(e) => {
                        setSlug(e.target.value);
                        if (touched.slug) validateField('slug', e.target.value);
                      }}
                      onBlur={() => handleBlur('slug')}
                      helperText="Se genera automáticamente del título. Puedes editarlo."
                      error={touched.slug && errors.slug ? errors.slug : undefined}
                    />
                  </div>
                </div>
              </Card>

              {/* Excerpt */}
              <Card>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Extracto/Resumen
                  </label>
                  <textarea
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                      touched.excerpt && errors.excerpt ? 'border-red-300' : 'border-gray-300'
                    }`}
                    rows={3}
                    placeholder="Breve descripción que aparecerá en la lista de publicaciones..."
                    value={excerpt}
                    onChange={(e) => {
                      setExcerpt(e.target.value);
                      if (touched.excerpt) validateField('excerpt', e.target.value);
                    }}
                    onBlur={() => handleBlur('excerpt')}
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      {excerpt.length}/500 caracteres
                    </p>
                    {touched.excerpt && errors.excerpt && (
                      <p className="text-sm text-red-600">{errors.excerpt}</p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Content */}
              <Card>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      Contenido *
                    </label>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {wordCount} palabras
                      </span>
                      <span>{readingTime} min lectura</span>
                    </div>
                  </div>
                  <textarea
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm ${
                      touched.content && errors.content ? 'border-red-300' : 'border-gray-300'
                    }`}
                    rows={20}
                    placeholder="Escribe el contenido de la publicación aquí... 

Puedes usar Markdown:

# Título 1
## Título 2
**Negrita**
*Cursiva*
- Lista
1. Lista numerada
[Link](url)
"
                    value={content}
                    onChange={(e) => {
                      setContent(e.target.value);
                      if (touched.content) validateField('content', e.target.value);
                    }}
                    onBlur={() => handleBlur('content')}
                    required
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      Soporta Markdown para formato
                    </p>
                    {touched.content && errors.content && (
                      <p className="text-sm text-red-600">{errors.content}</p>
                    )}
                  </div>
                </div>
              </Card>
            </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Estado</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="Publicado"
                      checked={status === 'Publicado'}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Publicado</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="Borrador"
                      checked={status === 'Borrador'}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Borrador</span>
                  </label>
                </div>
              </div>
            </Card>

            {/* Category */}
            <Card>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Categoría *</h3>
                {isLoadingCategories ? (
                  <p className="text-sm text-gray-500">Cargando categorías...</p>
                ) : categories.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No hay categorías disponibles.{' '}
                    <button
                      type="button"
                      onClick={() => router.push(ROUTES.ADMIN.CATEGORIES)}
                      className="text-blue-600 hover:underline"
                    >
                      Crear una
                    </button>
                  </p>
                ) : (
                  <>
                    <select
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        touched.categoryId && errors.categoryId ? 'border-red-300' : 'border-gray-300'
                      }`}
                      value={categoryId}
                      onChange={(e) => {
                        setCategoryId(e.target.value);
                        if (touched.categoryId) validateField('categoryId', e.target.value);
                      }}
                      onBlur={() => handleBlur('categoryId')}
                      required
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {touched.categoryId && errors.categoryId && (
                      <p className="text-sm text-red-600 mt-1">{errors.categoryId}</p>
                    )}
                  </>
                )}
              </div>
            </Card>

            {/* Featured Image */}
            <Card>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Imagen Destacada</h3>
                
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                      onError={() => {
                        setImagePreview('');
                        showToast({
                          type: 'error',
                          message: 'Error al cargar la imagen',
                        });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('');
                        setImagePreview('');
                      }}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="space-y-3">
                  {/* Upload desde PC */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      id="file-upload"
                      accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml,image/bmp,image/tiff,video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/webm"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer"
                    >
                      <Upload className={`w-8 h-8 mx-auto mb-2 ${isUploading ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`} />
                      <p className="text-sm font-medium text-gray-700">
                        {isUploading ? 'Subiendo...' : 'Subir imagen desde tu PC'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Click para seleccionar (PNG, JPG, GIF, WEBP - Máx 5MB)
                      </p>
                      {isUploading && (
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{uploadProgress}%</p>
                        </div>
                      )}
                    </label>
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-white text-gray-500">o</span>
                    </div>
                  </div>

                  {/* URL externa */}
                  <Input
                    placeholder="URL de imagen externa"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImagePreview(e.target.value);
                    }}
                    helperText="O pega una URL de imagen externa"
                    disabled={isUploading}
                  />
                </div>
              </div>
            </Card>

            {/* SEO Info */}
            <Card>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Vista Previa SEO</h3>
                <div className="p-3 bg-gray-50 rounded-lg space-y-1">
                  <p className="text-sm font-medium text-blue-600 truncate">
                    {title || 'Título de la publicación'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {window.location.origin}/blog/{slug || 'url-de-la-publicacion'}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {excerpt || 'Extracto de la publicación aparecerá aquí...'}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
    </>
  );
}
