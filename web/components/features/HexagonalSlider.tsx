/**
 * HexagonalSlider Component
 * Slider de imágenes con diseño hexagonal tipo panal de abeja
 * Opción B del plan de rediseño
 */

'use client';

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

export interface SlideImage {
  url: string;
  alt: string;
  title?: string;
  description?: string;
}

export interface HexagonalSliderProps {
  images: SlideImage[];
  autoplay?: boolean;
  autoplayDelay?: number;
  className?: string;
}

export const HexagonalSlider: React.FC<HexagonalSliderProps> = ({
  images,
  autoplay = true,
  autoplayDelay = 5000,
  className,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={cn('relative w-full', className)}>
      {/* Main Hexagonal Container */}
      <div className="relative">
        {/* Hexagonal Mask usando clip-path */}
        <div 
          className="relative w-full aspect-[4/3] overflow-hidden"
          style={{
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
          }}
        >
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-rojo-500/20 via-amarillo-500/20 to-azul-500/20 z-10 pointer-events-none" />
          
          {/* Swiper Slider */}
          <Swiper
            modules={[Autoplay, Pagination, Navigation, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            spaceBetween={0}
            slidesPerView={1}
            autoplay={autoplay ? {
              delay: autoplayDelay,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            } : false}
            pagination={{
              clickable: true,
              bulletClass: 'swiper-pagination-bullet-custom',
              bulletActiveClass: 'swiper-pagination-bullet-active-custom',
            }}
            navigation={{
              prevEl: '.hex-slider-prev',
              nextEl: '.hex-slider-next',
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            className="h-full w-full"
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    className="object-cover"
                    priority={index === 0}
                  />
                  
                  {/* Overlay con info (opcional) */}
                  {(image.title || image.description) && (
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent z-20">
                      {image.title && (
                        <h3 className="text-white font-bold text-xl mb-1">
                          {image.title}
                        </h3>
                      )}
                      {image.description && (
                        <p className="text-white/90 text-sm">
                          {image.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Decorative Hexagons (honeycomb effect) */}
        <div className="absolute -top-8 -left-8 w-20 h-20 opacity-20 pointer-events-none">
          <div 
            className="w-full h-full bg-rojo-500"
            style={{
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
            }}
          />
        </div>
        <div className="absolute -bottom-8 -right-8 w-24 h-24 opacity-20 pointer-events-none">
          <div 
            className="w-full h-full bg-amarillo-500"
            style={{
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
            }}
          />
        </div>
        <div className="absolute top-1/2 -right-12 w-16 h-16 opacity-20 pointer-events-none">
          <div 
            className="w-full h-full bg-azul-500"
            style={{
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
            }}
          />
        </div>

        {/* Navigation Arrows */}
        <button
          className="hex-slider-prev absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110 group"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800 group-hover:text-azul-600 transition-colors" />
        </button>
        <button
          className="hex-slider-next absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110 group"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-gray-800 group-hover:text-azul-600 transition-colors" />
        </button>
      </div>

      {/* Custom Pagination Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {images.map((_, index) => (
          <button
            key={index}
            className={cn(
              'transition-all duration-300',
              index === activeIndex
                ? 'w-8 h-3 rounded-full bg-gradient-institucional'
                : 'w-3 h-3 rounded-full bg-gray-300 hover:bg-gray-400'
            )}
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const swiper = document.querySelector('.swiper') as any;
              if (swiper?.swiper) {
                swiper.swiper.slideTo(index);
              }
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="text-center mt-4">
        <span className="text-sm text-gray-600 font-medium">
          {activeIndex + 1} / {images.length}
        </span>
      </div>

      {/* Custom Styles for Swiper */}
      <style jsx global>{`
        .swiper-pagination-bullet-custom {
          width: 12px;
          height: 12px;
          background: #D1D5DB;
          opacity: 1;
          border-radius: 50%;
          transition: all 0.3s;
        }
        
        .swiper-pagination-bullet-active-custom {
          width: 32px;
          border-radius: 6px;
          background: linear-gradient(135deg, #DC2626, #F59E0B, #2563EB);
        }
        
        .swiper-pagination {
          bottom: -40px !important;
        }
      `}</style>
    </div>
  );
};

export default HexagonalSlider;
