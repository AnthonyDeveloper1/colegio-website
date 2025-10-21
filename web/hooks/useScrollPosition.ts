/**
 * useScrollPosition Hook
 * Hook para detectar la posición de scroll y aplicar efectos
 */

'use client';

import { useState, useEffect } from 'react';

interface ScrollPosition {
  scrollY: number;
  isScrolled: boolean;
  isScrollingDown: boolean;
}

export function useScrollPosition(threshold: number = 50): ScrollPosition {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    scrollY: 0,
    isScrolled: false,
    isScrollingDown: false,
  });

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollPosition = () => {
      const scrollY = window.scrollY;
      const isScrollingDown = scrollY > lastScrollY;
      
      setScrollPosition({
        scrollY,
        isScrolled: scrollY > threshold,
        isScrollingDown,
      });

      lastScrollY = scrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollPosition);
        ticking = true;
      }
    };

    // Set initial state
    updateScrollPosition();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  return scrollPosition;
}
