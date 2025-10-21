/**
 * Gallery List Page
 * Lista de imágenes de galería con filtros y acciones
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Image as ImageIcon,
  Filter,
  Eye,
} from 'lucide-react';
import { Card, Button, Badge, Spinner } from '@/components/ui';
import { galleryService } from '@/services';
import { formatDate } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { GALLERY_CATEGORIES } from '@/lib/constants';
import { useUIStore } from '@/stores';
import type { GalleryItem } from '@/types';

export default function GalleryListPage() {
  const { showToast, setLoading } = useUIStore();
  
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  // Fetch gallery items
  const fetchItems = async () => {
    setIsLoadingData(true);
    try {
      const data = await galleryService.getAll();
      
      // Filter by category if selected
      const filtered = selectedCategory
        ? data.filter(item => item.category === selectedCategory)
        : data;
      
      setItems(filtered);
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Error al cargar las imágenes',
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [selectedCategory]);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta imagen?')) {
      return;
    }

    setLoading(true);
    try {
      await galleryService.delete(id);
      showToast({
        type: 'success',
        message: 'Imagen eliminada correctamente',
      });
      
      setItems(items => items.filter(i => i.id !== id));
    } catch (error: any) {
      showToast({
        type: 'error',
        message: error.response?.data?.msg || 'Error al eliminar la imagen',
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
            Galería
          </h1>
          <p className="text-gray-600">
            Gestiona las imágenes de la galería
          </p>
        </div>
        <Link href={ROUTES.ADMIN.GALLERY_NEW}>
          <Button 
            variant="primary" 
            leftIcon={<Plus className="w-5 h-5" />}
          >
            Subir Imagen
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Categoría:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={!selectedCategory ? 'default' : 'info'}
            className="cursor-pointer"
            onClick={() => setSelectedCategory('')}
          >
            Todas
          </Badge>
          {GALLERY_CATEGORIES.map((cat) => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'info'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Gallery Grid */}
      {isLoadingData ? (
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" />
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <Card key={item.id} variant="hover" className="overflow-hidden p-0">
              {/* Image */}
              <div 
                className="relative aspect-square cursor-pointer group"
                onClick={() => setLightboxItem(item)}
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-sm line-clamp-1">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 truncate mb-1">
                    {item.title}
                  </h3>
                  {item.caption && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.caption}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <Badge variant="info" size="sm">
                    {item.category}
                  </Badge>
                  <span>{formatDate(item.created_at)}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link href={ROUTES.ADMIN.GALLERY_EDIT(item.id)} className="flex-1">
                    <Button variant="outline" size="sm" fullWidth>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-700 border-red-600 hover:border-red-700"
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
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              No hay imágenes
              {selectedCategory && ' en esta categoría'}
            </p>
            <Link href={ROUTES.ADMIN.GALLERY_NEW}>
              <Button variant="primary">
                Subir Primera Imagen
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Lightbox */}
      {lightboxItem && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxItem(null)}
        >
          <button
            onClick={() => setLightboxItem(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <Eye className="w-8 h-8" />
          </button>
          <div className="max-w-4xl max-h-[90vh]">
            <img
              src={lightboxItem.url}
              alt={lightboxItem.title}
              className="max-w-full max-h-[80vh] object-contain"
            />
            <div className="mt-4 text-center text-white">
              <h3 className="text-xl font-semibold">{lightboxItem.title}</h3>
              {lightboxItem.caption && (
                <p className="text-gray-300 mt-2">{lightboxItem.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
