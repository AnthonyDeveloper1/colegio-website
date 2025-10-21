/**
 * Wave Card Component - OPTIMIZADO
 * Card con animación de olas fluidas
 */

'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
  // Memoizar animaciones para evitar recálculos
  const floatAnimation = useMemo(() => ({
    y: [0, -15, 0],
  }), []);

  const floatTransition = useMemo(() => ({
    duration: 4 + index * 0.3,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  }), [index]);

  return (
    <motion.div
      className="absolute"
      style={{ 
        top: config.top,
        bottom: config.bottom,
        left: config.left, 
        right: config.right,
        zIndex: config.zIndex,
        transform: config.translateX ? `translateX(${config.translateX})` : undefined,
        willChange: 'transform', // Optimización de rendering
      }}
      initial={{ opacity: 0, scale: 0.3, y: 150, rotate: 0 }}
      animate={{ 
        opacity: 1, 
        scale: config.scale,
        y: 0,
        rotate: config.rotation,
      }}
      transition={{ 
        duration: 1.2,
        delay: config.delay,
        type: 'spring',
        bounce: 0.5
      }}
      whileHover={{ 
        scale: config.scale + 0.05, 
        rotate: 0,
        zIndex: 100,
        transition: { duration: 0.4, type: 'spring', bounce: 0.3 }
      }}
    >
      <Link href={`${ROUTES.BLOG}/${publication.slug}`}>
        <motion.div 
          className={`w-[800px] h-[280px] cursor-pointer relative group bg-gradient-to-br ${config.gradient}`}
          style={{
            borderRadius: '30px',
            boxShadow: '0 30px 60px -15px rgba(0,0,0,0.4), 0 10px 30px -10px rgba(0,0,0,0.3)',
            willChange: 'transform', // Optimización GPU
          }}
          animate={floatAnimation}
          transition={floatTransition}
        >
          {/* Card Container con border-radius */}
          <div className="absolute inset-0 rounded-[30px] overflow-hidden">
            {/* Image Background */}
            <div className="absolute inset-0">
              <Image
                src={publication.image_url || '/placeholder.jpg'}
                alt={publication.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent group-hover:from-black/95 transition-all duration-300" />
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
              <motion.path
                d="M0,64 Q200,32 400,64 T800,64 L800,128 L0,128 Z"
                fill={`url(#wave-gradient-${index})`}
                animate={{ 
                  d: [
                    "M0,64 Q200,32 400,64 T800,64 L800,128 L0,128 Z",
                    "M0,64 Q200,96 400,64 T800,64 L800,128 L0,128 Z",
                    "M0,64 Q200,32 400,64 T800,64 L800,128 L0,128 Z",
                  ]
                }}
                transition={{
                  duration: 3 + index * 0.3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              
              {/* Wave 2 */}
              <motion.path
                d="M0,80 Q200,48 400,80 T800,80 L800,128 L0,128 Z"
                fill={`url(#wave-gradient-${index})`}
                opacity="0.6"
                animate={{ 
                  d: [
                    "M0,80 Q200,48 400,80 T800,80 L800,128 L0,128 Z",
                    "M0,80 Q200,112 400,80 T800,80 L800,128 L0,128 Z",
                    "M0,80 Q200,48 400,80 T800,80 L800,128 L0,128 Z",
                  ]
                }}
                transition={{
                  duration: 4 + index * 0.3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5,
                }}
              />
              
              {/* Wave 3 */}
              <motion.path
                d="M0,96 Q200,64 400,96 T800,96 L800,128 L0,128 Z"
                fill={`url(#wave-gradient-${index})`}
                opacity="0.4"
                animate={{ 
                  d: [
                    "M0,96 Q200,64 400,96 T800,96 L800,128 L0,128 Z",
                    "M0,96 Q200,118 400,96 T800,96 L800,128 L0,128 Z",
                    "M0,96 Q200,64 400,96 T800,96 L800,128 L0,128 Z",
                  ]
                }}
                transition={{
                  duration: 5 + index * 0.3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
              />
            </svg>

            {/* Content - Horizontal Layout */}
            <div className="relative h-full p-8 flex items-center justify-between gap-8 z-10">
              {/* Left: Title & Category */}
              <div className="flex-1">
                {/* Category Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: config.delay + 0.4 }}
                  className="mb-4"
                >
                  <span className="inline-block px-6 py-2.5 bg-white rounded-full text-sm font-bold text-gray-900 shadow-lg">
                    {publication.category?.name}
                  </span>
                </motion.div>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: config.delay + 0.6 }}
                >
                  <h3 className="text-white font-bold text-4xl leading-tight line-clamp-2 drop-shadow-[0_6px_16px_rgba(0,0,0,1)]">
                    {publication.title}
                  </h3>
                </motion.div>
              </div>

              {/* Right: Read More Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: config.delay + 0.8 }}
                className="flex-shrink-0"
              >
                <div className="flex items-center gap-3 text-white text-lg font-semibold bg-white/15 backdrop-blur-sm px-8 py-5 rounded-full group-hover:bg-white/25 group-hover:scale-110 transition-all shadow-xl">
                  <BookOpen className="w-6 h-6" />
                  <span>Leer más</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </motion.div>
            </div>

            {/* Shine Effect al Hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000" />
            
            {/* Border Glow */}
            <div className="absolute inset-0 rounded-[30px] ring-2 ring-white/0 group-hover:ring-white/30 transition-all duration-300" />
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};
