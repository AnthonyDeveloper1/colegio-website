/**
 * Publicaciones List Page
 * Página con lista de publicaciones en formato completo - OPTIMIZADA
 */

'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Filter, Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { Container } from '@/components/layout';
import { Input, Button, Badge, Spinner } from '@/components/ui';
import { publicationsService, categoriesService } from '@/services';
import { useDebounce } from '@/hooks';
import { ROUTES } from '@/lib/constants';
import type { Publication, Category } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

function BlogPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [publications, setPublications] = useState<Publication[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filters from URL
  const page = Number(searchParams.get('page')) || 1;
  const categoryId = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  
  // Local search state (debounced)
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debouncedSearch = useDebounce(localSearch, 500);

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

  useEffect(() => {
    const fetchPublications = async () => {
      setIsLoading(true);
      try {
        const response = await publicationsService.getAll({
          page,
          per_page: 5, // Menos publicaciones por página ya que son completas
          category_id: categoryId ? Number(categoryId) : undefined,
          search: debouncedSearch || undefined,
        });
        
        setPublications(response.data || []);
        setTotalPages(response.pagination?.total_pages || 1);
      } catch (error) {
        console.error('Error fetching publications:', error);
        setPublications([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublications();
  }, [page, categoryId, debouncedSearch]);

  // Update URL when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== searchQuery) {
      updateFilters({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch, searchQuery]);

  // Memoizar funciones para evitar re-renders innecesarios
  const updateFilters = useCallback((newFilters: Record<string, string | number>) => {
    const params = new URLSearchParams();
    
    // Keep existing params
    if (categoryId) params.set('category', categoryId);
    if (searchQuery) params.set('search', searchQuery);
    if (page !== 1) params.set('page', String(page));
    
    // Update with new filters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });
    
    router.push(`${ROUTES.BLOG}?${params.toString()}`);
  }, [categoryId, searchQuery, page, router]);

  const handleCategoryFilter = useCallback((catId: string) => {
    updateFilters({ category: catId, page: 1 });
  }, [updateFilters]);

  const handlePageChange = useCallback((newPage: number) => {
    updateFilters({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [updateFilters]);

  const clearFilters = useCallback(() => {
    setLocalSearch('');
    router.push(ROUTES.BLOG);
  }, [router]);

  const activeFiltersCount = useMemo(() => 
    [categoryId, searchQuery].filter(Boolean).length,
    [categoryId, searchQuery]
  );

  return (
    <div className="py-12 md:py-16 bg-gray-50 min-h-screen">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Publicaciones
          </h1>
          <p className="text-lg text-gray-600">
            Noticias, eventos y artículos de nuestra comunidad educativa.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {/* Search Input */}
          <div className="mb-6">
            <Input
              placeholder="Buscar publicaciones..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              leftIcon={<Search className="w-5 h-5" />}
              fullWidth
            />
          </div>

          {/* Category Filters */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Categorías
              </h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={!categoryId ? 'default' : 'info'}
                className="cursor-pointer"
                onClick={() => handleCategoryFilter('')}
              >
                Todas
              </Badge>
              {categories.map((cat) => (
                <Badge
                  key={cat.id}
                  variant={categoryId === String(cat.id) ? 'default' : 'info'}
                  className="cursor-pointer"
                  onClick={() => handleCategoryFilter(String(cat.id))}
                >
                  {cat.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        ) : publications.length > 0 ? (
          <>
            {/* Publications List - Full Width */}
            <div className="space-y-8 mb-12">
              {publications.map((post, index) => (
                <article 
                  key={post.id} 
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  {post.image_url && (
                    <div className="relative w-full h-96 bg-gray-200">
                      <Image
                        src={post.image_url}
                        alt={post.title}
                        fill
                        className="object-cover"
                        loading={index < 2 ? 'eager' : 'lazy'}
                        priority={index === 0}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-8">
                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                      {post.category && (
                        <Badge variant="info" className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {post.category.name}
                        </Badge>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.created_at).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                      {post.author?.name && (
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {post.author.name}
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-lg text-gray-600 mb-4">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Full Content Preview */}
                    {post.content && (
                      <div 
                        className="prose prose-lg max-w-none mb-6 text-gray-700"
                        dangerouslySetInnerHTML={{ 
                          __html: post.content.substring(0, 500) + (post.content.length > 500 ? '...' : '')
                        }}
                      />
                    )}

                    {/* Read More Button */}
                    <Link href={`${ROUTES.BLOG}/${post.slug}`}>
                      <Button 
                        variant="primary"
                        className="group"
                      >
                        Leer más
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  Anterior
                </Button>
                
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Button
                      key={pageNum}
                      variant={pageNum === page ? 'primary' : 'outline'}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">
              No se encontraron publicaciones con los filtros seleccionados.
            </p>
            {activeFiltersCount > 0 && (
              <Button variant="primary" onClick={clearFilters}>
                Ver todas las publicaciones
              </Button>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>}>
      <BlogPageContent />
    </Suspense>
  );
}
