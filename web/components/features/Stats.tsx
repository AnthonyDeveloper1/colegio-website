/**
 * Stats Component
 * Muestra estadísticas institucionales con animaciones
 */

'use client';

import React from 'react';

import { Users, Award, BookOpen, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Stat {
  value: string;
  label: string;
  icon: React.ReactNode;
  color: 'rojo' | 'amarillo' | 'azul';
}

export interface StatsProps {
  className?: string;
}

const defaultStats: Stat[] = [
  {
    value: '1200+',
    label: 'Estudiantes',
    icon: <Users className="w-8 h-8" />,
    color: 'rojo',
  },
  {
    value: '35+',
    label: 'Años de Excelencia',
    icon: <Award className="w-8 h-8" />,
    color: 'amarillo',
  },
  {
    value: '50+',
    label: 'Docentes',
    icon: <BookOpen className="w-8 h-8" />,
    color: 'azul',
  },
  {
    value: '95%',
    label: 'Tasa de Éxito',
    icon: <TrendingUp className="w-8 h-8" />,
    color: 'rojo',
  },
];

const colorClasses = {
  rojo: {
    bg: 'bg-[#E63946]',
    text: 'text-[#E63946]',
    iconBg: 'bg-[#E63946]/10',
  },
  amarillo: {
    bg: 'bg-[#F4A261]',
    text: 'text-[#F4A261]',
    iconBg: 'bg-[#F4A261]/10',
  },
  azul: {
    bg: 'bg-[#457B9D]',
    text: 'text-[#457B9D]',
    iconBg: 'bg-[#457B9D]/10',
  },
};

export const Stats: React.FC<StatsProps> = ({ className }) => {
  return (
    <div className={cn('grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6', className)}>
      {defaultStats.map((stat, index) => {
        const colors = colorClasses[stat.color];
        
        return (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105"
          >
            {/* Icon */}
            <div className={cn('inline-flex p-3 rounded-xl mb-4', colors.iconBg)}>
              <div className={colors.text}>
                {stat.icon}
              </div>
            </div>

            {/* Value */}
            <div className={cn('text-3xl md:text-4xl font-bold mb-2', colors.text)}>
              {stat.value}
            </div>

            {/* Label */}
            <div className="text-sm md:text-base text-gray-800 font-semibold">
              {stat.label}
            </div>

            {/* Decorative Bar */}
            <div className={cn('h-1 w-12 mt-3 rounded-full', colors.bg)} />
          </div>
        );
      })}
    </div>
  );
};

export default Stats;
