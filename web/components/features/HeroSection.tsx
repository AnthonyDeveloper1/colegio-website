/**
 * Hero Section Component - OPTIMIZADO
 * Sección hero con cards grandes flotantes tipo "Hola" con animaciones
 */

'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';

import { ArrowRight, Sparkles, GraduationCap, BookOpen } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui';
import { ROUTES, INSTITUTION } from '@/lib/constants';
import { Stats } from './Stats';
import { WaveCard } from './WaveCard';
import { publicationsService } from '@/services';
import type { Publication } from '@/types';


export const HeroSection: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await publicationsService.getAll({ per_page: 4 });
        setPublications(response.data);
      } catch (error) {
        console.error('Error loading publications:', error);
      }
    };
    fetchPublications();
  }, []);

  // Carrusel automático
  useEffect(() => {
    if (publications.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % publications.length);
    }, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [publications]);

  // Memoizar configuraciones de animación
  const blobAnimation = useMemo(() => ({
    animate: {
      x: [0, 30, -20, 0],
      y: [0, -30, 20, 0],
      scale: [1, 1.1, 0.9, 1],
    },
    transition: {
      duration: 15,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }), []);

  return (
    <section className="relative bg-gradient-to-br from-[#E63946] via-[#F4A261] to-[#457B9D] text-white overflow-hidden min-h-[90vh]">
      {/* Blobs Decorativos Flotantes */}
      <div className="decorative-blob absolute top-20 left-10 w-72 h-72 bg-white animate-blob1" style={{ zIndex: 0 }} />
      <div className="decorative-blob absolute bottom-32 right-20 w-96 h-96 bg-[#1D3557] animate-blob2" style={{ zIndex: 0 }} />
      <div className="decorative-blob absolute top-1/2 left-1/3 w-64 h-64 bg-[#FFE5E8] animate-blob3" style={{ zIndex: 0 }} />

      <div className="relative container mx-auto px-4 py-20 md:py-28 z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-block mb-6 transition-all duration-500">
              <span className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold shadow-lg">
                <Sparkles className="w-5 h-5" />
                {INSTITUTION.shortName} - Educación de Excelencia
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight transition-all duration-500">
              {INSTITUTION.name}
            </h1>

            <div className="transition-all duration-500">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8">
                <span className="bg-gradient-to-r from-yellow-200 via-white to-blue-200 bg-clip-text text-transparent">
                  Formando el Futuro con Excelencia
                </span>
              </h2>
            </div>

            {/* Description */}
            <p className="text-xl md:text-2xl text-white/95 mb-10 max-w-2xl lg:max-w-none font-light transition-all duration-500">
              Institución educativa comprometida con la excelencia académica,
              el desarrollo integral y los valores que transforman vidas.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transition-all duration-500">
              <Link href={ROUTES.ABOUT}>
                <Button variant="primary" size="lg" leftIcon={<GraduationCap className="w-5 h-5" />}>
                  Conócenos
                </Button>
              </Link>
              <Link href={ROUTES.CONTACT}>
                <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur-md border-white text-white hover:bg-white/20">
                  Contáctanos
                </Button>
              </Link>
            </div>
          </div>

          {/* Carrusel Hero - Solo una publicación visible a la vez */}
          <div className="relative h-[420px] hidden lg:block w-full max-w-5xl">
            {publications.length > 0 ? (
              <WaveCard
                publication={publications[currentIndex]}
                config={{
                  top: '0',
                  left: '0',
                  delay: 0,
                  rotation: 0,
                  scale: 1,
                  gradient: 'from-[#E63946] to-[#F4A261]',
                  zIndex: 10,
                  translateX: '0',
                }}
                index={currentIndex}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white/10 rounded-[30px]" />
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 md:mt-32 transition-all duration-700">
          <Stats />
        </div>
      </div>

      {/* Wave Divider Elegante */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};
