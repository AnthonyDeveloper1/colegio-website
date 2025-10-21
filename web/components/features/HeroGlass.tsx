/**
 * Hero Glass Component
 * Hero con tarjeta flotante glassmorphism y slider de publicaciones
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Calendar, User, BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import type { Publication } from '@/types';

interface HeroGlassProps {
  publications: Publication[];
}

const categoryIcons: Record<string, React.ReactNode> = {
  'Eventos': <BookOpen className="w-6 h-6" />,
  'Noticias': <Calendar className="w-6 h-6" />,
  'Académico': <BookOpen className="w-6 h-6" />,
  'Deportes': <BookOpen className="w-6 h-6" />,
};

const categoryColors: Record<string, string> = {
  'Eventos': 'from-[#F4A261] to-[#E76F51]',
  'Noticias': 'from-[#E63946] to-[#B82D3A]',
  'Académico': 'from-[#457B9D] to-[#1D3557]',
  'Deportes': 'from-[#2A9D8F] to-[#264653]',
};

// Posiciones fijas para evitar hydration error
const particlePositions = [
  { left: 10, top: 15 }, { left: 85, top: 25 }, { left: 30, top: 40 },
  { left: 70, top: 55 }, { left: 20, top: 70 }, { left: 90, top: 80 },
  { left: 45, top: 20 }, { left: 60, top: 35 }, { left: 15, top: 50 },
  { left: 80, top: 65 }, { left: 35, top: 75 }, { left: 95, top: 15 },
  { left: 25, top: 30 }, { left: 55, top: 45 }, { left: 75, top: 60 },
  { left: 40, top: 85 }, { left: 65, top: 10 }, { left: 5, top: 90 },
  { left: 50, top: 25 }, { left: 85, top: 45 }
];

export const HeroGlass: React.FC<HeroGlassProps> = ({ publications }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentPub = publications[currentIndex];
  const categoryName = currentPub?.category?.name || 'General';
  const gradient = categoryColors[categoryName] || 'from-[#457B9D] to-[#1D3557]';
  const icon = categoryIcons[categoryName] || <BookOpen className="w-6 h-6" />;

  useEffect(() => {
    if (!mounted) return;
    
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % publications.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [publications.length, mounted]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + publications.length) % publications.length);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % publications.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
  };

  if (!currentPub || !mounted) return null;

  return (
    <section className="relative h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Image with Overlay */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.4 },
            scale: { duration: 0.4 },
          }}
          className="absolute inset-0"
        >
          {currentPub.image_url && (
            <>
              <Image
                src={currentPub.image_url}
                alt={currentPub.title}
                fill
                className="object-cover"
                priority
              />
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-60`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40" />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particlePositions.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center px-4 lg:px-8 z-10">
        <div className="w-full max-w-6xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="relative z-20"
            >
              {/* Glass Card */}
              <div className="relative backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl p-8 lg:p-12 shadow-2xl">
                {/* Gradient Border Glow */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-3xl opacity-30 blur-xl -z-10`} />
                
                {/* Card Content */}
                <div className="relative z-30">
                  {/* Category Badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className={`inline-flex items-center gap-2 bg-gradient-to-r ${gradient} px-4 py-2 rounded-full mb-6 shadow-lg`}
                  >
                    {icon}
                    <span className="text-white font-semibold">{categoryName}</span>
                  </motion.div>

                  {/* Title */}
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight"
                    style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                  >
                    {currentPub.title}
                  </motion.h1>

                  {/* Excerpt */}
                  {currentPub.excerpt && (
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-lg lg:text-xl text-white/95 mb-6 max-w-3xl"
                      style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
                    >
                      {currentPub.excerpt}
                    </motion.p>
                  )}

                  {/* Meta Info */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap items-center gap-6 mb-8 text-white/90"
                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span suppressHydrationWarning>
                        {new Date(currentPub.created_at).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    {currentPub.author?.name && (
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        <span>{currentPub.author.name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      <span>23</span>
                    </div>
                  </motion.div>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Link href={ROUTES.BLOG_POST(currentPub.slug)}>
                      <button className={`group relative px-8 py-4 bg-gradient-to-r ${gradient} text-white font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
                        <span className="relative z-10 flex items-center gap-2">
                          Leer más
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20">
        {/* Prev Button */}
        <button
          onClick={handlePrev}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110 shadow-lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Indicators */}
        <div className="flex items-center gap-3">
          {publications.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 h-3 bg-white rounded-full'
                  : 'w-3 h-3 bg-white/40 rounded-full hover:bg-white/60'
              }`}
            />
          ))}
          <span className="text-white/80 ml-2 text-sm font-medium">
            {currentIndex + 1} / {publications.length}
          </span>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110 shadow-lg"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* View All Link */}
      <div className="absolute bottom-8 right-8 z-20">
        <Link href={ROUTES.BLOG}>
          <button className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all hover:scale-105 shadow-lg font-medium">
            Ver todas →
          </button>
        </Link>
      </div>
    </section>
  );
};
