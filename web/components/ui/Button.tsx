/**
 * Button Component - OPTIMIZADO
 * Botón ultra-rápido sin Framer Motion - Respuesta instantánea < 16ms
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary: 'bg-gradient-to-br from-[#E63946] to-[#B82D3A] text-white hover:from-[#FF6B7A] hover:to-[#E63946] focus:ring-[#E63946]/50 shadow-md',
      secondary: 'bg-gradient-to-br from-[#457B9D] to-[#1D3557] text-white hover:from-[#A8DADC] hover:to-[#457B9D] focus:ring-[#457B9D]/50 shadow-md',
      accent: 'bg-gradient-to-br from-[#F4A261] to-[#E76F51] text-white hover:from-[#FFDAB9] hover:to-[#F4A261] focus:ring-[#F4A261]/50 shadow-md',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300',
      outline: 'bg-white border-2 border-[#457B9D] text-[#457B9D] hover:bg-[#E8F4F8] focus:ring-[#457B9D]/50',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-base',
      lg: 'px-7 py-3.5 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2',
          'font-semibold rounded-full transition-all duration-100',
          'focus:outline-none focus:ring-2 focus:ring-offset-1',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'active:scale-98',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Cargando...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
