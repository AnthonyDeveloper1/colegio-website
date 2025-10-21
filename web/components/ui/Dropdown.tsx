/**
 * Dropdown Component
 * Menú dropdown reutilizable para navegación y acciones
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DropdownItem {
  label?: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  divider?: boolean;
  danger?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'right',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleItemClick = (item: DropdownItem) => {
    if (item.onClick) {
      item.onClick();
    }
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {trigger}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop para mobile */}
          <div 
            className="fixed inset-0 z-40 md:hidden bg-black/20"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div
            className={cn(
              'absolute z-50 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black/5',
              'animate-in fade-in slide-in-from-top-2 duration-200',
              align === 'right' ? 'right-0' : 'left-0'
            )}
          >
            <div className="py-1">
              {items.map((item, index) => {
                if (item.divider) {
                  return (
                    <div
                      key={`divider-${index}`}
                      className="my-1 h-px bg-gray-200"
                    />
                  );
                }

                const content = (
                  <div className="flex items-center gap-3 px-4 py-2">
                    {item.icon && (
                      <span className={cn(
                        'flex-shrink-0',
                        item.danger ? 'text-red-500' : 'text-gray-500'
                      )}>
                        {item.icon}
                      </span>
                    )}
                    <span className={cn(
                      'text-sm font-medium',
                      item.danger ? 'text-red-600' : 'text-gray-700'
                    )}>
                      {item.label}
                    </span>
                  </div>
                );

                if (item.href) {
                  return (
                    <Link
                      key={index}
                      href={item.href}
                      className={cn(
                        'block transition-colors',
                        item.danger
                          ? 'hover:bg-red-50'
                          : 'hover:bg-gray-50'
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {content}
                    </Link>
                  );
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleItemClick(item)}
                    className={cn(
                      'w-full text-left transition-colors',
                      item.danger
                        ? 'hover:bg-red-50'
                        : 'hover:bg-gray-50'
                    )}
                  >
                    {content}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dropdown;
