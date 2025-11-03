/**
 * Wave Card Component - OPTIMIZADO
 * Card con animación de olas fluidas
 */

'use client';

import React from 'react';
import Link from 'next/link';
// Animación CSS ultra ligera, sin Framer Motion
import { ArrowRight, BookOpen } from 'lucide-react';
import Image from 'next/image';
import type { Publication } from '@/types';
import { ROUTES } from '@/lib/constants';

interface WaveCardProps {
  publication: Publication;
  config: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    delay: number;
    rotation: number;
    scale: number;
    gradient: string;
    zIndex: number;
    translateX?: string;
  };
  index: number;
}

export const WaveCard: React.FC<WaveCardProps> = ({ publication, config, index }) => {


  return (
    <div
      className="absolute wavecard-float"
      style={{ 
        top: config.top,
        bottom: config.bottom,
        left: config.left, 
        right: config.right,
        zIndex: config.zIndex,
        transform: config.translateX ? `translateX(${config.translateX})` : undefined,
        willChange: 'transform',
        animationDelay: `${config.delay || 0}s`,
      }}
    >
      <Link href={`${ROUTES.BLOG}/${publication.slug}`}>
        <div 
          className={`w-[800px] h-[280px] cursor-pointer relative group bg-gradient-to-br ${config.gradient} wavecard-inner`}
          style={{
            borderRadius: '30px',
            boxShadow: '0 30px 60px -15px rgba(0,0,0,0.4), 0 10px 30px -10px rgba(0,0,0,0.3)',
            willChange: 'transform',
          }}
        >
          {/* Card Container con border-radius */}
          <div className="absolute inset-0 rounded-[30px] overflow-hidden">
            {/* Imagen de fondo sin overlays ni gradientes */}
            <div className="absolute inset-0">
              <Image
                src={publication.image_url || '/placeholder.jpg'}
                alt={publication.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                style={{ filter: 'brightness(1.08) contrast(1.08)' }}
              />
            </div>

            {/* Waves Animation SVG Overlay - Positioned at bottom */}
            <svg 
              className="absolute bottom-0 left-0 w-full h-32 pointer-events-none"
              style={{ zIndex: 50 }}
              viewBox="0 0 800 128" 
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id={`wave-gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
                </linearGradient>
              </defs>
              
              {/* Wave 1 */}
              <path
                className="wavecard-wave"
                d="M0,64 Q200,32 400,64 T800,64 L800,128 L0,128 Z"
                fill={`url(#wave-gradient-${index})`}
              />
              
              {/* Wave 2 y 3 optimizadas: solo una wave estática para máximo rendimiento */}
              <path
                d="M0,80 Q200,48 400,80 T800,80 L800,128 L0,128 Z"
                fill={`url(#wave-gradient-${index})`}
                opacity="0.6"
              />
              <path
                d="M0,96 Q200,64 400,96 T800,96 L800,128 L0,128 Z"
                fill={`url(#wave-gradient-${index})`}
                opacity="0.4"
              />
            </svg>

            {/* Contenido alineado a la izquierda sobre la imagen */}
            <div className="relative h-full flex items-center z-10">
              <div className="ml-12 my-8 px-8 py-6 bg-black/60 rounded-2xl shadow-2xl max-w-xl border-l-8 border-yellow-400">
                {/* Categoría */}
                <div className="mb-2">
                  <span className="inline-block px-5 py-2 bg-white/90 rounded-full text-sm font-bold text-gray-900 shadow">
                    {publication.category?.name}
                  </span>
                </div>
                {/* Título */}
                <h3 className="text-white font-bold text-4xl leading-tight mb-2 drop-shadow-lg">
                  {publication.title}
                </h3>
                {/* Botón Leer más */}
                <Link href={`${ROUTES.BLOG}/${publication.slug}`}>
                  <div className="mt-4 inline-flex items-center gap-3 text-white text-lg font-semibold bg-yellow-500/90 hover:bg-yellow-400/90 px-7 py-3 rounded-full shadow-xl transition-all">
                    <BookOpen className="w-6 h-6" />
                    <span>Leer más</span>
                    <ArrowRight className="w-6 h-6" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Shine Effect al Hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000" />
            
            {/* Border Glow */}
            <div className="absolute inset-0 rounded-[30px] ring-2 ring-white/0 group-hover:ring-white/30 transition-all duration-300" />
          </div>
  </div>
      </Link>
  </div>
  );
};
