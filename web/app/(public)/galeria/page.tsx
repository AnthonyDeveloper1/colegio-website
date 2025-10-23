/**
 * Gallery Page
 * Galería de publicaciones filtradas por categoría
 * Optimizado sin Framer Motion para mejor rendimiento
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Filter, Calendar, Tag, Eye, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/layout';
import { Badge, Spinner, Card } from '@/components/ui';
import { publicationsService, categoriesService } from '@/services';
import { formatDate } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import type { Publication, Category } from '@/types';

export default function GalleryPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [pubsData, catsData] = await Promise.all([
          publicationsService.getAll({ per_page: 100 }),
          categoriesService.getAll(),
        ]);
        
        const allPubs = pubsData.data;
        const filtered = selectedCategoryId
          ? allPubs.filter(pub => pub.category?.id === selectedCategoryId)
          : allPubs;
        
        setPublications(filtered);
        setCategories(catsData);
      } catch (error) {
        console.error('Error fetching gallery:', error);
        setPublications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCategoryId]);

  const categoryColors = ['elegant-rojo', 'elegant-azul', 'elegant-amarillo'];

  return (
    <div className="py-16 md:py-24 bg-gradient-to-b from-[#E8F4F8] via-white to-[#FFF5ED] min-h-screen">
      <Container>
        {/* Header con animación CSS */}
        <div className="mb-12 text-center animate-[fadeIn_0.3s_ease-in-out]">
          <div className="inline-block mb-4">
            <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E63946] to-[#457B9D] text-white rounded-full text-sm font-semibold shadow-lg">
              <Sparkles className="w-5 h-5" />
              Galería Institucional
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#E63946] via-[#F4A261] to-[#457B9D] bg-clip-text text-transparent">
              Nuestras Publicaciones
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explora nuestras publicaciones organizadas por categoría
          </p>
        </div>

        {/* Filters con formas elegantes */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100 animate-[slideUp_0.3s_ease-in-out]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#457B9D]" />
              Filtrar por Categoría
            </h3>
            {selectedCategoryId && (
              <button
                onClick={() => setSelectedCategoryId(null)}
                className="text-sm px-4 py-2 bg-gradient-to-r from-[#E63946] to-[#B82D3A] text-white rounded-full font-semibold hover:shadow-lg transition-all duration-150 hover:scale-105"
              >
                Limpiar filtro
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="hover:scale-105 transition-transform duration-150">
              <Badge
                variant={!selectedCategoryId ? 'default' : 'info'}
                className="cursor-pointer text-base px-6 py-2 rounded-full"
                onClick={() => setSelectedCategoryId(null)}
              >
                Todas las Categorías
              </Badge>
            </div>
            {categories.map((cat) => (
              <div 
                key={cat.id}
                className="hover:scale-105 transition-transform duration-150"
              >
                <Badge
                  variant={selectedCategoryId === cat.id ? 'default' : 'info'}
                  className="cursor-pointer text-base px-6 py-2 rounded-full"
                  onClick={() => setSelectedCategoryId(cat.id)}
                >
                  {cat.name}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Publications Grid - Optimizado con CSS */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        ) : publications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publications.map((pub, index) => {
              const cardVariant = categoryColors[index % 3] as 'elegant-rojo' | 'elegant-azul' | 'elegant-amarillo';
              
              return (
                <Link key={pub.id} href={ROUTES.BLOG_POST(pub.slug)} className="animate-[fadeIn_0.3s_ease-in-out]" style={{ animationDelay: `${index * 0.05}s` }}>
                  <Card variant={cardVariant} className="h-full overflow-hidden group">
                    {/* Image */}
                    {pub.image_url && (
                      <div className="relative aspect-video w-full overflow-hidden">
                        <Image
                          src={pub.image_url}
                          alt={pub.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                      {/* Category Badge */}
                      {pub.category && (
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="info" size="sm" className="rounded-full">
                            <Tag className="w-3 h-3 mr-1" />
                            {pub.category.name}
                          </Badge>
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#E63946] transition-colors duration-150">
                        {pub.title}
                      </h3>

                      {/* Excerpt */}
                      {pub.excerpt && (
                        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                          {pub.excerpt}
                        </p>
                      )}

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(pub.created_at)}</span>
                        </div>
                      </div>

                      {/* Read More */}
                      <div className="flex items-center text-[#457B9D] font-semibold group-hover:text-[#E63946] transition-all duration-150">
                        <Eye className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-150" />
                        Leer más
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 animate-[fadeIn_0.3s_ease-in-out]">
            <p className="text-gray-500 text-xl mb-6">
              No hay publicaciones disponibles
              {selectedCategoryId && ' en esta categoría'}.
            </p>
            {selectedCategoryId && (
              <button
                onClick={() => setSelectedCategoryId(null)}
                className="px-6 py-3 bg-gradient-to-r from-[#457B9D] to-[#1D3557] text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-150 hover:scale-105"
              >
                Ver todas las publicaciones
              </button>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
