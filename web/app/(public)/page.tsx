/**
 * Home Page
 * Página principal del sitio (landing)
 */

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HeroGlass, BlogCard } from '@/components/features';
import { Container } from '@/components/layout';
import { Button } from '@/components/ui';
import { ROUTES } from '@/lib/constants';
import { getImageUrl } from '@/lib/utils';
import { publicationsService, galleryService } from '@/services';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Colegio - Educación de Excelencia',
  description: 'Institución educativa comprometida con la excelencia académica y el desarrollo integral de nuestros estudiantes.',
};

async function getLatestPosts() {
  try {
    const response = await publicationsService.getAll({ page: 1, per_page: 3 });
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

async function getFeaturedGallery() {
  try {
    const items = await galleryService.getAll();
    return items.slice(0, 6);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return [];
  }
}

export default async function HomePage() {
  const latestPosts = await getLatestPosts();
  const galleryItems = await getFeaturedGallery();

  return (
    <div>
      {/* Hero Section with Glass Effect */}
      {latestPosts.length > 0 && <HeroGlass publications={latestPosts} />}

      {/* Latest News Section */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Últimas Publicaciones
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Mantente informado sobre las últimas actividades, eventos y logros de nuestra comunidad educativa.
            </p>
          </div>

          {/* Posts Grid */}
          {latestPosts && latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {latestPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay publicaciones disponibles</p>
            </div>
          )}

          {/* View All Button */}
          <div className="text-center">
            <Link href={ROUTES.BLOG}>
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Ver Todas las Publicaciones
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Gallery Preview Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <Container>
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestra Galería
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubre las instalaciones, eventos y momentos especiales de nuestra comunidad.
            </p>
          </div>

          {/* Gallery Grid */}
          {galleryItems && galleryItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
              {galleryItems.map((item, index) => (
                <div
                  key={item.id}
                  className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                >
                  <img
                    src={getImageUrl(item.url)}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-semibold">{item.title}</h3>
                      {item.caption && (
                        <p className="text-white/80 text-sm">{item.caption}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay imágenes disponibles</p>
            </div>
          )}

          {/* View All Button */}
          <div className="text-center">
            <Link href={ROUTES.GALLERY}>
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Ver Galería Completa
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿Listo para formar parte de nuestra comunidad?
            </h2>
            <p className="text-lg text-blue-100 mb-8">
              Contáctanos hoy y descubre cómo podemos ayudarte en el camino educativo de tu familia.
            </p>
            <Link href={ROUTES.CONTACT}>
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Contáctanos Ahora
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
