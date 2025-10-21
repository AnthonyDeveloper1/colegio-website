/**
 * Public Layout
 * Layout para todas las páginas públicas (con Navbar y Footer)
 */

import React from 'react';
import { Navbar, Footer } from '@/components/layout';
import PageTransition from '@/components/layout/PageTransition';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Main content con padding top para el navbar fijo */}
      <main className="flex-1 pt-20">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      
      <Footer />
    </div>
  );
}
