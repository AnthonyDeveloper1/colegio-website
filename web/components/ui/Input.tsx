/**
 * Input Component
 * Input reutilizable con label, error, variants y animaciones
 */

'use client';

import React, { useId, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { shake } from '@/lib/animations';

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
          <motion.label
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium transition-colors duration-200',
              isFocused ? 'text-azul-600' : 'text-gray-700',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {label}
            {required && (
              <motion.span 
                className="text-red-500 ml-1"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                *
              </motion.span>
            )}
          </motion.label>
        )}

        <motion.div 
          className="relative"
          variants={shake}
          animate={error ? 'shake' : 'initial'}
        >
          <motion.div
            animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {leftIcon && (
              <motion.div 
                className={cn(
                  'absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200',
                  isFocused ? 'text-azul-600' : 'text-gray-400'
                )}
                animate={isFocused ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {leftIcon}
              </motion.div>
            )}

            <input
              ref={ref}
              id={inputId}
              type={type}
              className={cn(
                'w-full px-4 py-2 rounded-lg border transition-all duration-200',
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
              <motion.div 
                className={cn(
                  'absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200',
                  isFocused ? 'text-azul-600' : 'text-gray-400'
                )}
                animate={isFocused ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {rightIcon}
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.p 
              className="text-sm text-red-600 flex items-center gap-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <motion.svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </motion.svg>
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {helperText && !error && (
          <motion.p 
            className="text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {helperText}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
