/**
 * 404 Not Found Page
 * Página personalizada de error 404
 */

import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Container } from '@/components/layout';
import { Button } from '@/components/ui';
import { ROUTES, INSTITUTION } from '@/lib/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Página no encontrada - 404 | ${INSTITUTION.shortName}`,
  description: 'La página que buscas no existe o ha sido movida.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <Container size="md">
        <div className="text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <h1 className="text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              404
            </h1>
          </div>

          {/* Message */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Página no encontrada
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Lo sentimos, la página que estás buscando no existe o ha sido movida a otra ubicación.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href={ROUTES.HOME}>
              <Button
                variant="primary"
                size="lg"
                leftIcon={<Home className="w-5 h-5" />}
              >
                Ir al Inicio
              </Button>
            </Link>
            
            <Link href={ROUTES.BLOG}>
              <Button
                variant="outline"
                size="lg"
                leftIcon={<Search className="w-5 h-5" />}
              >
                Ver Publicaciones
              </Button>
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="border-t border-gray-200 pt-8">
            <p className="text-sm text-gray-600 mb-4">Enlaces útiles:</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href={ROUTES.HOME} className="text-blue-600 hover:text-blue-700 hover:underline">
                Inicio
              </Link>
              <Link href={ROUTES.ABOUT} className="text-blue-600 hover:text-blue-700 hover:underline">
                Sobre Nosotros
              </Link>
              <Link href={ROUTES.BLOG} className="text-blue-600 hover:text-blue-700 hover:underline">
                Publicaciones
              </Link>
              <Link href={ROUTES.GALLERY} className="text-blue-600 hover:text-blue-700 hover:underline">
                Galería
              </Link>
              <Link href={ROUTES.CONTACT} className="text-blue-600 hover:text-blue-700 hover:underline">
                Contacto
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
