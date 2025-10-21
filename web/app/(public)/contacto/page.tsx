/**
 * Contact Page
 * Página de contacto con formulario, información y mapa
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Container } from '@/components/layout';
import { Card, Input, Textarea, Button } from '@/components/ui';
import { messagesService } from '@/services';
import { contactMessageSchema } from '@/lib/validators';
import { useUIStore } from '@/stores';
import type { CreateContactMessageDto } from '@/types';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useUIStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateContactMessageDto>({
    resolver: zodResolver(contactMessageSchema),
  });

  const onSubmit = async (data: CreateContactMessageDto) => {
    setIsSubmitting(true);
    try {
      await messagesService.send(data);
      showToast({
        type: 'success',
        message: 'Mensaje enviado correctamente. Te contactaremos pronto.',
      });
      reset();
    } catch (error: any) {
      showToast({
        type: 'error',
        message: error.response?.data?.msg || 'Error al enviar el mensaje. Intenta de nuevo.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 md:py-16 bg-gray-50">
      <Container>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contáctanos
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ¿Tienes alguna pregunta o deseas más información? Estamos aquí para ayudarte.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-4">
            {/* Dirección */}
            <Card>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Dirección</h3>
                  <p className="text-gray-600 text-sm">
                    Av. Educación 123<br />
                    Ciudad, Estado CP 12345
                  </p>
                </div>
              </div>
            </Card>

            {/* Teléfono */}
            <Card>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Teléfono</h3>
                  <p className="text-gray-600 text-sm">
                    +52 (123) 456-7890<br />
                    +52 (123) 456-7891
                  </p>
                </div>
              </div>
            </Card>

            {/* Email */}
            <Card>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600 text-sm">
                    info@colegio.edu<br />
                    admisiones@colegio.edu
                  </p>
                </div>
              </div>
            </Card>

            {/* Horarios */}
            <Card>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Horarios</h3>
                  <p className="text-gray-600 text-sm">
                    Lunes a Viernes: 7:00 AM - 3:00 PM<br />
                    Sábado: 8:00 AM - 12:00 PM<br />
                    Domingo: Cerrado
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Envíanos un mensaje
              </h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Nombre */}
                <Input
                  label="Nombre completo"
                  placeholder="Tu nombre"
                  error={errors.name?.message}
                  required
                  fullWidth
                  {...register('name')}
                />

                {/* Email */}
                <Input
                  label="Correo electrónico"
                  type="email"
                  placeholder="tu@email.com"
                  error={errors.email?.message}
                  required
                  fullWidth
                  {...register('email')}
                />

                {/* Teléfono */}
                <Input
                  label="Teléfono"
                  type="tel"
                  placeholder="+52 123 456 7890"
                  error={errors.phone?.message}
                  helperText="Opcional"
                  fullWidth
                  {...register('phone')}
                />

                {/* Asunto */}
                <Input
                  label="Asunto"
                  placeholder="¿En qué podemos ayudarte?"
                  error={errors.subject?.message}
                  required
                  fullWidth
                  {...register('subject')}
                />

                {/* Mensaje */}
                <Textarea
                  label="Mensaje"
                  placeholder="Escribe tu mensaje aquí..."
                  rows={6}
                  maxLength={1000}
                  showCount
                  error={errors.message?.message}
                  required
                  fullWidth
                  {...register('message')}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isSubmitting}
                  rightIcon={!isSubmitting && <Send className="w-5 h-5" />}
                  fullWidth
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                </Button>
              </form>
            </Card>
          </div>
        </div>

        {/* Map Placeholder */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ubicación
          </h2>
          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
            {/* Placeholder for Google Maps iframe */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.2896307095896!2d-99.16558228508432!3d19.432607886887!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1f92f69c1f2b7%3A0x7e7f8b3c7f8b3c7e!2sCiudad%20de%20M%C3%A9xico%2C%20CDMX!5e0!3m2!1ses!2smx!4v1234567890123!5m2!1ses!2smx"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </Card>
      </Container>
    </div>
  );
}
