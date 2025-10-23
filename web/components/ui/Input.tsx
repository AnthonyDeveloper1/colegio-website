
// Input Component - Optimizado sin Framer Motion
// Animaciones solo CSS, ultra ligeras
'use client';
import React, { useId, useState } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      id,
      type = 'text',
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium transition-colors duration-100',
              isFocused ? 'text-azul-600 scale-[1.01]' : 'text-gray-700',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {label}
            {required && (
              <span className="text-red-500 ml-1 animate-pulse">*</span>
            )}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-100',
                isFocused ? 'text-azul-600 scale-105' : 'text-gray-400'
              )}
            >
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              'w-full px-4 py-2 rounded-lg border transition-all duration-100',
              'focus:outline-none focus:ring-2 focus:ring-offset-1',
              'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-azul-500 focus:ring-azul-500',
              className
            )}
            disabled={disabled}
            required={required}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          {rightIcon && (
            <span
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-100',
                isFocused ? 'text-azul-600 scale-105' : 'text-gray-400'
              )}
            >
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1 animate-fadein">
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500 animate-fadein">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';