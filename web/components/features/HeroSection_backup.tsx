/**
 * Hero Section Component
 * Sección hero con cards grandes flotantes tipo "Hola" con animaciones
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, GraduationCap, BookOpen } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui';
import { ROUTES, INSTITUTION } from '@/lib/constants';
import { Stats } from './Stats';
import { publicationsService } from '@/services';
import type { Publication } from '@/types';
import { 
  heroTextAnimation, 
  staggerContainer, 
  staggerItem,
} from '@/lib/animations';

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
      <motion.div 
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 15,
          delay: 0,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="decorative-blob absolute top-20 left-10 w-72 h-72 bg-white"
        style={{ zIndex: 0 }}
      />
      <motion.div 
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 15,
          delay: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="decorative-blob absolute bottom-32 right-20 w-96 h-96 bg-[#1D3557]"
        style={{ zIndex: 0 }}
      />
      <motion.div 
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 15,
          delay: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="decorative-blob absolute top-1/2 left-1/3 w-64 h-64 bg-[#FFE5E8]"
        style={{ zIndex: 0 }}
      />

      <div className="relative container mx-auto px-4 py-20 md:py-28 z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div 
            className="text-center lg:text-left"
            initial="hidden"
            animate="visible"
            variants={staggerContainer(0.15, 0.2)}
          >
            {/* Badge */}
            <motion.div variants={staggerItem} className="inline-block mb-6">
              <span className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold shadow-lg">
                <Sparkles className="w-5 h-5" />
                {INSTITUTION.shortName} - Educación de Excelencia
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={heroTextAnimation}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              {INSTITUTION.name}
            </motion.h1>

            <motion.div variants={staggerItem}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8">
                <span className="bg-gradient-to-r from-yellow-200 via-white to-blue-200 bg-clip-text text-transparent">
                  Formando el Futuro con Excelencia
                </span>
              </h2>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={staggerItem}
              className="text-xl md:text-2xl text-white/95 mb-10 max-w-2xl lg:max-w-none font-light"
            >
              Institución educativa comprometida con la excelencia académica,
              el desarrollo integral y los valores que transforman vidas.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={staggerItem}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
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
            </motion.div>
          </motion.div>

          {/* Right Column - Cards Grandes Flotantes tipo Hola */}
          <motion.div
            className="relative h-[700px] hidden lg:block"
            initial="hidden"
            animate="visible"
            variants={staggerContainer(0.2, 0.3)}
          >
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
                    <motion.div
                      key={pub.id}
                      className="absolute"
                      style={{ 
                        top: config.top,
                        bottom: config.bottom,
                        left: config.left, 
                        right: config.right,
                        zIndex: config.zIndex,
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
                        scale: config.scale + 0.08, 
                        rotate: 0,
                        zIndex: 100,
                        transition: { duration: 0.4, type: 'spring', bounce: 0.3 }
                      }}
                    >
                      <Link href={`${ROUTES.BLOG}/${pub.slug}`}>
                        <motion.div 
                          className={`w-[550px] h-[200px] overflow-hidden cursor-pointer relative group shadow-2xl bg-gradient-to-br ${config.gradient}`}
                          style={{
                            borderRadius: '20px',
                            clipPath: 'path("M 0,40 Q 138,10 275,40 T 550,40 L 550,160 Q 413,190 275,160 T 0,160 Z")',
                          }}
                          animate={{
                            y: [0, -20, 0],
                          }}
                          transition={{
                            duration: 5 + index * 0.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
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
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: config.delay + 0.4 }}
                                className="mb-3"
                              >
                                <span className="inline-block px-4 py-1.5 bg-white rounded-full text-xs font-bold text-gray-900 shadow-lg">
                                  {pub.category?.name}
                                </span>
                              </motion.div>

                              {/* Title */}
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: config.delay + 0.6 }}
                              >
                                <h3 className="text-white font-bold text-2xl leading-tight line-clamp-2 drop-shadow-[0_6px_16px_rgba(0,0,0,1)]">
                                  {pub.title}
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
                              <div className="flex items-center gap-2 text-white/90 text-sm font-medium bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full group-hover:bg-white/20 transition-all">
                                <BookOpen className="w-4 h-4" />
                                <span className="hidden xl:inline">Leer más</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                              </div>
                            </motion.div>
                          </div>

                          {/* Shine Effect al Hover */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000" />
                          
                          {/* Border Glow */}
                          <div className="absolute inset-0 rounded-[2rem] ring-2 ring-white/0 group-hover:ring-white/30 transition-all duration-300" />
                        </motion.div>
                      </Link>
                    </motion.div>
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
                    <motion.div
                      key={index}
                      className="absolute w-[550px] h-[200px] bg-white/10 backdrop-blur-xl shadow-2xl"
                      style={{ 
                        top: config.top,
                        bottom: config.bottom,
                        left: config.left,
                        right: config.right,
                        rotate: `${config.rotation}deg`,
                        zIndex: config.zIndex,
                        borderRadius: '20px',
                        clipPath: 'path("M 0,40 Q 138,10 275,40 T 550,40 L 550,160 Q 413,190 275,160 T 0,160 Z")',
                      }}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{
                        duration: 5 + index * 0.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-24 md:mt-32"
        >
          <Stats />
        </motion.div>
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
