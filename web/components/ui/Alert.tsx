/**
 * Alert Component
 * Alert/Notification reutilizable con variants
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  description?: string;
  onClose?: () => void;
  icon?: React.ReactNode;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = 'info',
      title,
      description,
      onClose,
      icon,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      info: {
        container: 'bg-blue-50 border-blue-200 text-blue-900',
        icon: 'text-blue-600',
        iconComponent: <Info className="w-5 h-5" />,
      },
      success: {
        container: 'bg-green-50 border-green-200 text-green-900',
        icon: 'text-green-600',
        iconComponent: <CheckCircle className="w-5 h-5" />,
      },
      warning: {
        container: 'bg-yellow-50 border-yellow-200 text-yellow-900',
        icon: 'text-yellow-600',
        iconComponent: <AlertCircle className="w-5 h-5" />,
      },
      error: {
        container: 'bg-red-50 border-red-200 text-red-900',
        icon: 'text-red-600',
        iconComponent: <XCircle className="w-5 h-5" />,
      },
    };

    const currentVariant = variants[variant];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'relative rounded-lg border p-4',
          currentVariant.container,
          className
        )}
        {...props}
      >
        <div className="flex gap-3">
          {/* Icon */}
          <div className={cn('flex-shrink-0', currentVariant.icon)}>
            {icon || currentVariant.iconComponent}
          </div>

          {/* Content */}
          <div className="flex-1">
            {title && (
              <h5 className="font-semibold mb-1">{title}</h5>
            )}
            {description && (
              <p className="text-sm opacity-90">{description}</p>
            )}
            {children && (
              <div className="mt-2">{children}</div>
            )}
          </div>

          {/* Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className={cn(
                'flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity',
                currentVariant.icon
              )}
              aria-label="Cerrar alerta"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';
