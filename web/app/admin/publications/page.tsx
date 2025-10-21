/**
 * Publications List Page
 * Lista de todas las publicaciones con búsqueda, filtros y acciones
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
} from 'lucide-react';
import { Card, Button, Input, Badge, Spinner } from '@/components/ui';
import { publicationsService, categoriesService } from '@/services';
import { useDebounce } from '@/hooks';
import { formatDate, truncate } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { useUIStore } from '@/stores';
import type { Publication, Category } from '@/types';

export default function PublicationsListPage() {
  const router = useRouter();
  const { showToast, setLoading } = useUIStore();
  
  const [publications, setPublications] = useState<Publication[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [publicationToDelete, setPublicationToDelete] = useState<Publication | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch categories on mount
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

  // Fetch publications
  useEffect(() => {
    const fetchPublications = async () => {
      setIsLoadingData(true);
      try {
        const response = await publicationsService.getAll({
          page,
          per_page: 10,
          category_id: selectedCategory ? Number(selectedCategory) : undefined,
          search: debouncedSearch || undefined,
        });
        
        setPublications(response.data);
        setTotalPages(response.pagination.total_pages);
      } catch (error) {
        console.error('Error fetching publications:', error);
        showToast({
          type: 'error',
          message: 'Error al cargar las publicaciones',
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchPublications();
  }, [page, selectedCategory, debouncedSearch]);

  const openDeleteModal = (publication: Publication) => {
    setPublicationToDelete(publication);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setPublicationToDelete(null);
  };

  const confirmDelete = async () => {
    if (!publicationToDelete) return;

    setLoading(true);
    try {
      await publicationsService.delete(publicationToDelete.id);
      showToast({
        type: 'success',
        message: 'Publicación eliminada correctamente',
      });
      
      // Refresh list
      setPublications(pubs => pubs.filter(p => p.id !== publicationToDelete.id));
      closeDeleteModal();
    } catch (error: any) {
      showToast({
        type: 'error',
        message: error.response?.data?.msg || 'Error al eliminar la publicación',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const publication = publications.find(p => p.id === id);
    if (publication) {
      openDeleteModal(publication);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Publicaciones
          </h1>
          <p className="text-gray-600">
            Gestiona las publicaciones del blog
          </p>
        </div>
        <Link href={ROUTES.ADMIN.PUBLICATIONS_NEW}>
          <Button 
            variant="primary" 
            leftIcon={<Plus className="w-5 h-5" />}
          >
            Nueva Publicación
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            placeholder="Buscar publicaciones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-5 h-5" />}
            fullWidth
          />
          
          <div>
            <div className="flex items-center gap-2 mb-2">
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
              {categories.map((cat) => (
                <Badge
                  key={cat.id}
                  variant={selectedCategory === String(cat.id) ? 'default' : 'info'}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(String(cat.id))}
                >
                  {cat.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Publications List */}
      {isLoadingData ? (
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" />
        </div>
      ) : publications.length > 0 ? (
        <>
          <div className="space-y-4">
            {publications.map((pub) => (
              <Card key={pub.id} variant="hover">
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  {pub.image_url ? (
                    <img
                      src={pub.image_url}
                      alt={pub.title}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Eye className="w-8 h-8 text-gray-400" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {pub.title}
                        </h3>
                        {pub.excerpt && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {pub.excerpt}
                          </p>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Link href={ROUTES.BLOG_POST(pub.slug)} target="_blank">
                          <Button variant="ghost" size="sm" title="Ver publicación">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={ROUTES.ADMIN.PUBLICATIONS_EDIT(pub.id)}>
                          <Button variant="ghost" size="sm" title="Editar">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(pub.id)}
                          title="Eliminar"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{formatDate(pub.created_at)}</span>
                      {pub.category && (
                        <>
                          <span>•</span>
                          <Badge variant="info" size="sm">
                            {pub.category.name}
                          </Badge>
                        </>
                      )}
                      {pub.author && (
                        <>
                          <span>•</span>
                          <span>{pub.author.email}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage(p => p - 1)}
                disabled={page === 1}
              >
                Anterior
              </Button>
              
              <span className="text-sm text-gray-600">
                Página {page} de {totalPages}
              </span>
              
              <Button
                variant="outline"
                onClick={() => setPage(p => p + 1)}
                disabled={page === totalPages}
              >
                Siguiente
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              No se encontraron publicaciones
            </p>
            <Link href={ROUTES.ADMIN.PUBLICATIONS_NEW}>
              <Button variant="primary">
                Crear Primera Publicación
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && publicationToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Eliminar Publicación
                </h3>
                <p className="text-sm text-gray-600">
                  ¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="font-medium text-gray-900 mb-1">{publicationToDelete.title}</p>
              <p className="text-sm text-gray-600">
                {publicationToDelete.excerpt ? truncate(publicationToDelete.excerpt, 100) : 'Sin extracto'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={closeDeleteModal}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
