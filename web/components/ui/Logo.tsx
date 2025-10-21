'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { INSTITUTION } from '@/lib/constants';

interface LogoProps {
  variant?: 'default' | 'white' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  linkToHome?: boolean;
}

const sizeMap = {
  sm: { width: 32, height: 32, text: 'text-sm' },
  md: { width: 48, height: 48, text: 'text-base' },
  lg: { width: 64, height: 64, text: 'text-lg' },
  xl: { width: 80, height: 80, text: 'text-xl' },
};

export function Logo({
  variant = 'default',
  size = 'md',
  showText = true,
  className = '',
  linkToHome = true,
}: LogoProps) {
  const dimensions = sizeMap[size];
  
  const logoSrc = 
    variant === 'white' ? '/logo-white.svg' :
    variant === 'icon' ? '/logo-icon.svg' :
    '/logo.svg';

  const logoElement = (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex-shrink-0 transition-transform hover:scale-105 duration-300">
        <Image
          src={logoSrc}
          alt={`${INSTITUTION.name} Logo`}
          width={dimensions.width}
          height={dimensions.height}
          priority
          className="object-contain"
        />
      </div>
      
      {showText && variant !== 'icon' && (
        <div className="flex flex-col leading-tight">
          <span 
            className={`font-bold ${dimensions.text} ${
              variant === 'white' ? 'text-white' : 'text-gray-900'
            }`}
          >
            {INSTITUTION.shortName}
          </span>
          <span 
            className={`text-xs ${
              variant === 'white' ? 'text-white/80' : 'text-gray-600'
            }`}
          >
            José Abelardo Quiñones
          </span>
        </div>
      )}
    </div>
  );

  if (linkToHome) {
    return (
      <Link 
        href="/" 
        className="inline-flex focus:outline-none focus:ring-2 focus:ring-azul-primary rounded-lg transition-shadow"
        aria-label={`Ir a inicio - ${INSTITUTION.name}`}
      >
        {logoElement}
      </Link>
    );
  }

  return logoElement;
}

export default Logo;
