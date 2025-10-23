/**
 * Hero Section Component
 * Sección hero con cards grandes flotantes tipo "Hola" con animaciones
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { ArrowRight, Sparkles, GraduationCap, BookOpen } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui';
import { ROUTES, INSTITUTION } from '@/lib/constants';
import { Stats } from './Stats';
import { publicationsService } from '@/services';
import type { Publication } from '@/types';


export const HeroSection: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([]);

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

          {/* Right Column - Cards Grandes Flotantes tipo Hola */}
          <div className="relative h-[700px] hidden lg:block">
            {publications.length > 0 ? (
              <div className="relative w-full h-full perspective-1000">
                {publications.slice(0, 3).map((pub, index) => {
                  const configs = [
                    { 
                      top: '0%', 
                      left: '-5%', 
                      delay: 0, 
                      rotation: -8,
                      scale: 1.05,
                      gradient: 'from-[#E63946] to-[#F4A261]',
                      zIndex: 30
                    },
                    { 
                      top: '20%', 
                      right: '-8%', 
                      delay: 0.15, 
                      rotation: 6,
                      scale: 1,
                      gradient: 'from-[#457B9D] to-[#1D3557]',
                      zIndex: 20
                    },
                    { 
                      bottom: '5%', 
                      left: '8%', 
                      delay: 0.3, 
                      rotation: -4,
                      scale: 0.95,
                      gradient: 'from-[#F4A261] to-[#E76F51]',
                      zIndex: 10
                    },
                  ];
                  const config = configs[index];

                  return (
                    <div
                      key={pub.id}
                      className="absolute transition-all duration-700 hover:z-50 hover:scale-110 hover:rotate-0"
                      style={{ 
                        top: config.top,
                        bottom: config.bottom,
                        left: config.left, 
                        right: config.right,
                        zIndex: config.zIndex,
                        transform: `scale(${config.scale}) rotate(${config.rotation}deg)`
                      }}
                    >
                      <Link href={`${ROUTES.BLOG}/${pub.slug}`}>
                        <div 
                          className={`w-[550px] h-[200px] overflow-hidden cursor-pointer relative group shadow-2xl bg-gradient-to-br ${config.gradient} animate-float`}
                          style={{
                            borderRadius: '20px',
                            clipPath: 'path("M 0,40 Q 138,10 275,40 T 550,40 L 550,160 Q 413,190 275,160 T 0,160 Z")',
                          }}
                        >
                          {/* Image Background */}
                          <div className="absolute inset-0">
                            <Image
                              src={pub.image_url || '/placeholder.jpg'}
                              alt={pub.title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent group-hover:from-black/95 transition-all duration-300" />
                          </div>

                          {/* Content - Horizontal Layout */}
                          <div className="relative h-full p-6 flex items-center justify-between gap-6 z-10">
                            {/* Left: Title & Category */}
                            <div className="flex-1">
                              {/* Category Badge */}
                              <div className="mb-3 transition-all duration-500">
                                <span className="inline-block px-4 py-1.5 bg-white rounded-full text-xs font-bold text-gray-900 shadow-lg">
                                  {pub.category?.name}
                                </span>
                              </div>

                              {/* Title */}
                              <div className="transition-all duration-500">
                                <h3 className="text-white font-bold text-2xl leading-tight line-clamp-2 drop-shadow-[0_6px_16px_rgba(0,0,0,1)]">
                                  {pub.title}
                                </h3>
                              </div>
                            </div>

                            {/* Right: Read More Button */}
                            <div className="flex-shrink-0 transition-all duration-500">
                              <div className="flex items-center gap-2 text-white/90 text-sm font-medium bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full group-hover:bg-white/20 transition-all">
                                <BookOpen className="w-4 h-4" />
                                <span className="hidden xl:inline">Leer más</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                              </div>
                            </div>
                          </div>

                          {/* Shine Effect al Hover */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000" />
                          
                          {/* Border Glow */}
                          <div className="absolute inset-0 rounded-[2rem] ring-2 ring-white/0 group-hover:ring-white/30 transition-all duration-300" />
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Placeholders mientras carga
              <div className="relative w-full h-full">
                {[0, 1, 2].map((index) => {
                  const configs = [
                    { top: '0%', left: '-5%', rotation: -8, scale: 1.05, zIndex: 30 },
                    { top: '20%', right: '-8%', rotation: 6, scale: 1, zIndex: 20 },
                    { bottom: '5%', left: '8%', rotation: -4, scale: 0.95, zIndex: 10 },
                  ];
                  const config = configs[index];

                  return (
                    <div
                      key={index}
                      className="absolute w-[550px] h-[200px] bg-white/10 backdrop-blur-xl shadow-2xl animate-float"
                      style={{ 
                        top: config.top,
                        bottom: config.bottom,
                        left: config.left,
                        right: config.right,
                        transform: `rotate(${config.rotation}deg) scale(${config.scale})`,
                        zIndex: config.zIndex,
                        borderRadius: '20px',
                        clipPath: 'path("M 0,40 Q 138,10 275,40 T 550,40 L 550,160 Q 413,190 275,160 T 0,160 Z")',
                      }}
                    />
                  );
                })}
              </div>
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
