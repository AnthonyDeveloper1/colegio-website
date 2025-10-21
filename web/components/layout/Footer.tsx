/**
 * Footer Component
 * Footer elegante con gradiente institucional
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { ROUTES, INSTITUTION } from '@/lib/constants';
import { Logo } from '@/components/ui';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    navegacion: [
      { href: ROUTES.HOME, label: 'Inicio' },
      { href: ROUTES.ABOUT, label: 'Nosotros' },
      { href: ROUTES.BLOG, label: 'Publicaciones' },
      { href: ROUTES.GALLERY, label: 'Galería' },
      { href: ROUTES.CONTACT, label: 'Contacto' },
    ],
    recursos: [
      { href: '#', label: 'Admisiones' },
      { href: '#', label: 'Calendario' },
      { href: '#', label: 'Noticias' },
      { href: '#', label: 'Eventos' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:bg-[#457B9D]' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:bg-[#E63946]' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:bg-[#F4A261]' },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-[#1D3557] to-gray-900 text-gray-300 overflow-hidden">
      {/* Decorative Blob Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="decorative-blob absolute top-10 right-10 w-96 h-96 bg-[#E63946]" />
        <div className="decorative-blob absolute bottom-10 left-10 w-72 h-72 bg-[#F4A261]" />
      </div>

      {/* Main Footer */}
      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              <Logo variant="white" size="md" showText={true} linkToHome={false} />
            </div>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              {INSTITUTION.name}. Institución educativa comprometida con la excelencia académica y
              el desarrollo integral de nuestros estudiantes.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center ${social.color} transition-all duration-300`}
                    aria-label={social.label}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Column 2: Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="font-bold text-white mb-6 text-lg">Navegación</h3>
            <ul className="space-y-3">
              {footerLinks.navegacion.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#F4A261] transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-0 h-0.5 bg-[#F4A261] group-hover:w-4 transition-all duration-200 mr-0 group-hover:mr-2" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="font-bold text-white mb-6 text-lg">Recursos</h3>
            <ul className="space-y-3">
              {footerLinks.recursos.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#457B9D] transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-0 h-0.5 bg-[#457B9D] group-hover:w-4 transition-all duration-200 mr-0 group-hover:mr-2" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="font-bold text-white mb-6 text-lg">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-5 h-5 flex-shrink-0 text-[#E63946] mt-0.5" />
                <span className="text-gray-400">Av. Principal 123, Ciudad, País</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="w-5 h-5 flex-shrink-0 text-[#F4A261]" />
                <a href="tel:+123456789" className="text-gray-400 hover:text-[#F4A261] transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-5 h-5 flex-shrink-0 text-[#457B9D]" />
                <a
                  href="mailto:info@colegio.com"
                  className="text-gray-400 hover:text-[#457B9D] transition-colors"
                >
                  info@colegio.com
                </a>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>
              © {currentYear} {INSTITUTION.shortName}. Todos los derechos reservados.
            </p>
            <p className="flex items-center gap-2">
              Hecho con <Heart className="w-4 h-4 text-[#E63946] fill-current" /> para la educación
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
