/**
 * ScrollReveal Component
 * Wrapper que anima children cuando entran en viewport
 */

'use client';

import React from 'react';


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

export const ScrollReveal: React.FC<Pick<ScrollRevealProps, 'children' | 'className'>> = ({ children, className }) => {
  return (
    <div className={`scrollreveal-fadein ${className || ''}`}>
      {children}
    </div>
  );
};

export default ScrollReveal;
