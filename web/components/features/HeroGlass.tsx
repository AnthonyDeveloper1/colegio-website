/**
 * Hero Glass Component - ULTRA OPTIMIZADO
 * Hero súper rápido sin Framer Motion - CSS puro con aceleración GPU
 */

'use client';

import React, { useState, useEffect } from 'react';
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

export const HeroGlass: React.FC<HeroGlassProps> = ({ publications }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
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
      handleNext();
    }, 6000);

    return () => clearInterval(timer);
  }, [publications.length, mounted, currentIndex]);

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + publications.length) % publications.length);
    setTimeout(() => setIsTransitioning(false), 400);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % publications.length);
    setTimeout(() => setIsTransitioning(false), 400);
  };

  if (!currentPub || !mounted) return null;

  return (
  <section className="relative min-h-[600px] max-h-[900px] h-[80vh] overflow-hidden bg-transparent flex items-center justify-start">
      {/* Background Image with Overlay - CSS Transition */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          key={currentIndex}
          className="relative w-full h-full flex items-center justify-center animate-[fadeIn_0.18s_ease-in-out] will-change-transform"
        >
          {currentPub.image_url && (
            <Image
              src={currentPub.image_url}
              alt={currentPub.title}
              fill
              className="object-cover rounded-3xl bg-white"
              priority
              style={{ filter: 'contrast(1.18) brightness(1.07) drop-shadow(0 2px 8px rgba(0,0,0,0.10))', backgroundColor: '#fff' }}
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-start px-0 z-10">
        <div className="w-full max-w-3xl flex items-center justify-start">
          <div 
            key={`content-${currentIndex}`}
            className="relative z-20 animate-[slideUp_0.18s_ease-out] flex items-center justify-start w-full"
          >
            <div className="relative p-3 lg:p-5 bg-black/30 rounded-2xl shadow-2xl w-full max-w-md text-left ml-4 lg:ml-8 mt-8 lg:mt-16">
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-full mb-4 animate-[fadeIn_0.15s_ease-in_0.1s_both]">
                {icon}
                <span className="text-gray-900 font-semibold">{categoryName}</span>
              </div>
              {/* Title */}
              <h1
                className="text-2xl lg:text-4xl font-bold text-white mb-2 leading-tight animate-[slideUp_0.18s_ease-out_0.08s_both]"
                style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
              >
                {currentPub.title}
              </h1>
              {/* Excerpt */}
              {currentPub.excerpt && (
                <p
                  className="text-sm lg:text-base text-white/95 mb-4 max-w-md animate-[fadeIn_0.18s_ease-in_0.12s_both]"
                  style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
                >
                  {currentPub.excerpt.length > 120
                    ? currentPub.excerpt.slice(0, 120) + '...'
                    : currentPub.excerpt}
                </p>
              )}
              {/* Meta Info */}
              <div
                className="flex flex-wrap items-center gap-4 mb-6 text-white/90 animate-[fadeIn_0.15s_ease-in_0.18s_both]"
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
              </div>
              {/* CTA Button */}
              <div className="animate-[slideUp_0.18s_ease-out_0.09s_both]">
                <Link href={ROUTES.BLOG_POST(currentPub.slug)}>
                  <button className="group relative px-8 py-4 bg-white/90 text-gray-900 font-semibold rounded-full transition-all duration-75 hover:scale-101 transform-gpu active:scale-98">
                    <span className="relative z-10 flex items-center gap-2">
                      Leer más
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-75" />
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20">
        {/* Prev Button */}
        <button
          onClick={handlePrev}
          disabled={isTransitioning}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-75 hover:scale-103 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform-gpu"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Indicators */}
        <div className="flex items-center gap-3">
          {publications.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (isTransitioning) return;
                setIsTransitioning(true);
                setCurrentIndex(index);
                setTimeout(() => setIsTransitioning(false), 400);
              }}
              disabled={isTransitioning}
              className={`transition-all duration-200 transform-gpu ${
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
          disabled={isTransitioning}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-150 hover:scale-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform-gpu"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* View All Link */}
      <div className="absolute bottom-8 right-8 z-20">
        <Link href={ROUTES.BLOG}>
          <button className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-150 hover:scale-105 shadow-lg font-medium transform-gpu active:scale-95">
            Ver todas →
          </button>
        </Link>
      </div>
    </section>
  );
};
