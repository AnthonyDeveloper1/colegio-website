/**
 * ScrollReveal Component
 * Wrapper que anima children cuando entran en viewport
 */

'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { fadeIn, scaleIn, slideIn, viewportConfig } from '@/lib/animations';

export interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: 'fade' | 'scale' | 'slide';
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fade',
  direction = 'up',
  delay = 0,
  duration = 0.5,
  distance = 20,
  className,
  once = true,
}) => {
  // Seleccionar variante basada en el tipo de animación
  const getVariants = (): Variants => {
    switch (animation) {
      case 'scale':
        return scaleIn(delay, duration);
      case 'slide':
        const slideDirection = direction === 'up' ? 'bottom' : 
                               direction === 'down' ? 'top' :
                               direction;
        return slideIn(slideDirection as 'left' | 'right' | 'top' | 'bottom', distance, delay, duration);
      case 'fade':
      default:
        return fadeIn(direction, distance, delay, duration);
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ ...viewportConfig, once }}
      variants={getVariants()}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
