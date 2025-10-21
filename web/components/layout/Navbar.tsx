/**
 * Navbar Component
 * Barra de navegación principal del sitio público
 * Features: Responsive, sticky, scroll effects, login button, user dropdown
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, User, LayoutDashboard, LogOut, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES, INSTITUTION } from '@/lib/constants';
import { Button, Logo, Avatar, Dropdown, type DropdownItem } from '@/components/ui';
import { useScrollPosition } from '@/hooks';
import { useAuth } from '@/hooks';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { isScrolled } = useScrollPosition(20);
  const { user, logout } = useAuth();

  // Cerrar menú al cambiar de ruta
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  // Logout handler
  const handleLogout = () => {
    logout();
    router.push(ROUTES.HOME);
  };

  const navLinks = [
    { href: ROUTES.HOME, label: 'Inicio' },
    { href: ROUTES.ABOUT, label: 'Nosotros' },
    { href: ROUTES.BLOG, label: 'Publicaciones' },
    { href: ROUTES.GALLERY, label: 'Galería' },
    { href: ROUTES.CONTACT, label: 'Contacto' },
  ];

  // User dropdown items
  const userDropdownItems: DropdownItem[] = [
    {
      label: 'Panel de Control',
      href: ROUTES.ADMIN.DASHBOARD,
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      label: 'Mi Perfil',
      href: ROUTES.ADMIN.USERS,
      icon: <User className="w-4 h-4" />,
    },
    { divider: true },
    {
      label: 'Cerrar Sesión',
      onClick: handleLogout,
      icon: <LogOut className="w-4 h-4" />,
      danger: true,
    },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-3'
          : 'bg-white/90 backdrop-blur-sm py-5'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo 
            size={isScrolled ? 'sm' : 'md'} 
            showText={true}
            linkToHome={true}
          />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-azul-primary font-medium transition-colors relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-institucional transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Auth Section (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Dropdown
                trigger={
                  <div className="flex items-center gap-2 cursor-pointer group">
                    <Avatar
                      src={user.avatar || null}
                      fallback={user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      size="md"
                    />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-azul-primary transition-colors">
                      {user.name || 'Usuario'}
                    </span>
                  </div>
                }
                items={userDropdownItems}
                align="right"
              />
            ) : (
              <Link href={ROUTES.LOGIN}>
                <Button 
                  variant="primary" 
                  size="md"
                  className="!text-white"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-azul-primary transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Mobile Menu */}
            <div className="fixed inset-x-0 top-[72px] bg-white shadow-2xl z-50 md:hidden animate-in slide-in-from-top-5 duration-300">
              <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col gap-3">
                  {/* Nav Links */}
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-gray-700 hover:text-azul-primary font-medium transition-colors px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center"
                      onClick={handleLinkClick}
                    >
                      {link.label}
                    </Link>
                  ))}
                  
                  <div className="h-px bg-gray-200 my-2" />
                  
                  {/* Auth Section */}
                  {user ? (
                    <>
                      {/* User Info */}
                      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                        <Avatar
                          src={user.avatar || null}
                          fallback={user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                          size="md"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {user.name || 'Usuario'}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      
                      {/* User Actions */}
                      <Link
                        href={ROUTES.ADMIN.DASHBOARD}
                        className="text-gray-700 hover:text-azul-primary font-medium transition-colors px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center gap-3"
                        onClick={handleLinkClick}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Panel de Control
                      </Link>
                      
                      <Link
                        href={ROUTES.ADMIN.USERS}
                        className="text-gray-700 hover:text-azul-primary font-medium transition-colors px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center gap-3"
                        onClick={handleLinkClick}
                      >
                        <User className="w-4 h-4" />
                        Mi Perfil
                      </Link>
                      
                      <button
                        onClick={() => {
                          handleLogout();
                          handleLinkClick();
                        }}
                        className="text-red-600 hover:text-red-700 font-medium transition-colors px-4 py-3 rounded-lg hover:bg-red-50 flex items-center gap-3 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                      </button>
                    </>
                  ) : (
                    <Link href={ROUTES.LOGIN} onClick={handleLinkClick}>
                      <Button 
                        variant="primary" 
                        size="md" 
                        fullWidth
                        className="!text-white"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Iniciar Sesión
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};
