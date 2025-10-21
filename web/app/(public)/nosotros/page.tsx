/**
 * About Us Page
 * Página sobre nosotros (Misión, Visión, Valores, Historia)
 */

import React from 'react';
import { Target, Eye, Heart, BookOpen, Users, Award, Calendar, TrendingUp } from 'lucide-react';
import { Container } from '@/components/layout';
import { Card } from '@/components/ui';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre Nosotros - Colegio',
  description: 'Conoce nuestra misión, visión, valores e historia. Institución educativa comprometida con la excelencia.',
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-blue-600 to-purple-600 py-20 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Sobre Nosotros
            </h1>
            <p className="text-xl text-blue-100">
              Una institución con más de 35 años formando líderes del mañana con valores sólidos y educación de calidad.
            </p>
          </div>
        </Container>
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Misión */}
            <Card variant="hover" className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Nuestra Misión
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Formar estudiantes integrales con excelencia académica, valores sólidos y 
                competencias para el siglo XXI, promoviendo el pensamiento crítico, la creatividad 
                y el compromiso social en un ambiente de respeto y diversidad.
              </p>
            </Card>

            {/* Visión */}
            <Card variant="hover" className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <Eye className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Nuestra Visión
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Ser reconocidos como una institución líder en educación de calidad, innovadora 
                en metodologías pedagógicas, comprometida con la formación de ciudadanos 
                responsables, éticos y competentes que contribuyan al desarrollo de la sociedad.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      {/* Valores */}
      <section className="py-16 md:py-24 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestros Valores
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Los principios que guían nuestro quehacer educativo y forman el carácter de nuestros estudiantes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Excelencia */}
            <Card variant="hover" className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Excelencia
              </h3>
              <p className="text-gray-600 text-sm">
                Compromiso con la calidad en todos los aspectos del proceso educativo.
              </p>
            </Card>

            {/* Respeto */}
            <Card variant="hover" className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Respeto
              </h3>
              <p className="text-gray-600 text-sm">
                Valoración de la dignidad humana y la diversidad en nuestra comunidad.
              </p>
            </Card>

            {/* Responsabilidad */}
            <Card variant="hover" className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Responsabilidad
              </h3>
              <p className="text-gray-600 text-sm">
                Cumplimiento de deberes y compromiso con el aprendizaje continuo.
              </p>
            </Card>

            {/* Solidaridad */}
            <Card variant="hover" className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Solidaridad
              </h3>
              <p className="text-gray-600 text-sm">
                Empatía y apoyo mutuo para construir una comunidad unida.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      {/* Historia */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestra Historia
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Más de tres décadas de compromiso con la educación de calidad.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            {/* Timeline Item 1 */}
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="w-0.5 h-full bg-blue-200 mt-2"></div>
              </div>
              <div className="pb-8">
                <div className="text-blue-600 font-semibold mb-2">1990</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Fundación</h3>
                <p className="text-gray-600">
                  Iniciamos nuestro camino con 50 estudiantes y un equipo de 5 profesores 
                  comprometidos con una visión: ofrecer educación de excelencia accesible para todos.
                </p>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="w-0.5 h-full bg-purple-200 mt-2"></div>
              </div>
              <div className="pb-8">
                <div className="text-purple-600 font-semibold mb-2">2000</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Expansión</h3>
                <p className="text-gray-600">
                  Ampliamos nuestras instalaciones y programas educativos, alcanzando los 200 estudiantes 
                  y obteniendo reconocimientos por excelencia académica a nivel regional.
                </p>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <div className="w-0.5 h-full bg-green-200 mt-2"></div>
              </div>
              <div className="pb-8">
                <div className="text-green-600 font-semibold mb-2">2015</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Modernización</h3>
                <p className="text-gray-600">
                  Implementamos tecnología de vanguardia en todas las aulas, laboratorios especializados 
                  y programas innovadores de enseñanza-aprendizaje adaptados al siglo XXI.
                </p>
              </div>
            </div>

            {/* Timeline Item 4 */}
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div>
                <div className="text-yellow-600 font-semibold mb-2">Hoy</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Comunidad Consolidada</h3>
                <p className="text-gray-600">
                  Orgullosos de contar con más de 500 estudiantes, 50 profesores especializados 
                  y miles de egresados exitosos que han transformado sus comunidades.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
