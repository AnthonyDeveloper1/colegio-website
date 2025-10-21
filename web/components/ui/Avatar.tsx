/**
 * Avatar Component
 * Muestra avatar del usuario con imagen o iniciales
 */

'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string; // Iniciales del usuario
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  fallback = '?',
  size = 'md',
  className,
  onClick,
}) => {
  const [imageError, setImageError] = React.useState(false);
  
  const showImage = src && !imageError;
  
  // Generar color de fondo basado en el fallback
  const getBackgroundColor = (text: string) => {
    const colors = [
      'bg-rojo-500',
      'bg-amarillo-500',
      'bg-azul-500',
      'bg-rojo-600',
      'bg-amarillo-600',
      'bg-azul-600',
    ];
    const index = text.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-full overflow-hidden flex-shrink-0',
        sizeClasses[size],
        !showImage && getBackgroundColor(fallback),
        onClick && 'cursor-pointer transition-transform hover:scale-105',
        className
      )}
      onClick={onClick}
    >
      {showImage ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="font-semibold text-white uppercase select-none">
          {fallback.slice(0, 2)}
        </span>
      )}
    </div>
  );
};

export default Avatar;
