/**
 * Card Component
 * Card container reutilizable con animaciones
 */

'use client';

import React from 'react';

import { cn } from '@/lib/utils';
// import { cardHoverElegant, gridItem } from '@/lib/animations';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elegant-rojo' | 'elegant-azul' | 'elegant-amarillo' | 'cloud' | 'blob' | 'hover' | 'clickable';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  animated?: boolean;
  hover?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', animated = true, hover = true, children, ...props }, ref) => {
    const variants = {
      default: 'bg-white shadow-lg border border-gray-100 rounded-3xl',
      'elegant-rojo': 'card-elegant-rojo',
      'elegant-azul': 'card-elegant-azul',
      'elegant-amarillo': 'card-elegant-amarillo',
      cloud: 'bg-white cloud-shape shadow-xl border border-gray-100',
      blob: 'bg-white blob-shape blob-shape-animated shadow-xl border border-gray-100',
      // Mantener compatibilidad con variantes antiguas
      hover: 'bg-white shadow-lg border border-gray-100 rounded-3xl',
      clickable: 'bg-white shadow-lg border border-gray-100 rounded-3xl cursor-pointer',
    };

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    if (animated) {
      // Framer Motion removed: fallback to regular div with CSS transitions
      return (
        <div
          ref={ref}
          className={cn(
            'transition-all duration-300',
            hover ? 'hover:-translate-y-3 hover:scale-[1.02] hover:shadow-2xl' : '',
            variants[variant],
            paddings[padding],
            className
          )}
          {...props}
        >
          {children}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'transition-all duration-300',
          variants[variant],
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card Header
export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

// Card Title
export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

// Card Description
export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-500', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

// Card Content
export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

// Card Footer
export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-4', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';
