/**
 * Hero Section Component - OPTIMIZADO
 * Sección hero con cards grandes flotantes tipo "Hola" con animaciones
 */

'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, GraduationCap, BookOpen } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui';
import { ROUTES, INSTITUTION } from '@/lib/constants';
import { Stats } from './Stats';
import { WaveCard } from './WaveCard';
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

          {/* Right Column - Cards Gigantes con Animación de Olas */}
          <motion.div
            className="relative h-[700px] hidden lg:block"
            initial="hidden"
            animate="visible"
            variants={staggerContainer(0.2, 0.3)}
          >
            {publications.length > 0 ? (
              <div className="relative w-full h-full">
                {publications.slice(0, 3).map((pub, index) => {
                  const configs = [
                    { 
                      top: '8%', 
                      left: '-15%',
                      delay: 0, 
                      rotation: -5,
                      scale: 1.05,
                      gradient: 'from-[#E63946] to-[#F4A261]',
                      zIndex: 30,
                      translateX: '-50%'
                    },
                    { 
                      top: '35%', 
                      left: '-15%',
                      delay: 0.2, 
                      rotation: 3,
                      scale: 1,
                      gradient: 'from-[#457B9D] to-[#1D3557]',
                      zIndex: 20,
                      translateX: '-50%'
                    },
                    { 
                      bottom: '10%', 
                      left: '15%',
                      delay: 0.4, 
                      rotation: -2,
                      scale: 0.98,
                      gradient: 'from-[#F4A261] to-[#E76F51]',
                      zIndex: 10,
                      translateX: '-50%'
                    },
                  ];
                  const config = configs[index];

                  return (
                    <WaveCard
                      key={pub.id}
                      publication={pub}
                      config={config}
                      index={index}
                    />
                  );
                })}
              </div>
            ) : (
              // Placeholders mientras carga
              <div className="relative w-full h-full">
                {[0, 1, 2].map((index) => {
                  const configs = [
                    { top: '8%', left: '15%', rotation: -5, scale: 1.05, zIndex: 30, translateX: '-50%' },
                    { top: '35%', left: '15%', rotation: 3, scale: 1, zIndex: 20, translateX: '-50%' },
                    { bottom: '10%', left: '15%', rotation: -2, scale: 0.98, zIndex: 10, translateX: '-50%' },
                  ];
                  const config = configs[index];

                  return (
                    <motion.div
                      key={index}
                      className="absolute w-[800px] h-[280px] bg-white/10 backdrop-blur-xl shadow-2xl rounded-[30px]"
                      style={{ 
                        top: config.top,
                        bottom: config.bottom,
                        left: config.left,
                        rotate: `${config.rotation}deg`,
                        zIndex: config.zIndex,
                        transform: config.translateX ? `translateX(${config.translateX})` : undefined,
                      }}
                      animate={{
                        y: [0, -15, 0],
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{
                        duration: 4 + index * 0.3,
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
