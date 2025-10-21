/**
 * Login Page
 * Página de inicio de sesión para administradores
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn, ArrowLeft } from 'lucide-react';
import { Input, Button, Card } from '@/components/ui';
import { useAuth } from '@/hooks';
import { loginSchema } from '@/lib/validators';
import { ROUTES } from '@/lib/constants';
import type { LoginCredentials } from '@/types';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  // Solo redirigir si ya está autenticado al cargar la página
  useEffect(() => {
    // Pequeño delay para evitar redirección prematura
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.push('/admin');
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []); // Solo ejecutar una vez al montar

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      await login(data);
      // Si llega aquí, el login fue exitoso y el hook redirigirá
    } catch (error: any) {
      // Mensajes de error específicos basados en la respuesta del servidor
      const errorMsg = error.response?.data?.msg || error.message || '';
      const statusCode = error.response?.status;
      
      console.log('Login error:', { errorMsg, statusCode, error });
      
      // Error 401 = credenciales incorrectas
      if (statusCode === 401) {
        if (errorMsg.toLowerCase().includes('credenciales')) {
          setLoginError('Correo electrónico o contraseña incorrectos');
        } else {
          setLoginError('Las credenciales son incorrectas');
        }
      } 
      // Error 400 = validación
      else if (statusCode === 400) {
        setLoginError('Por favor completa todos los campos');
      }
      // Error de red o servidor
      else if (statusCode >= 500) {
        setLoginError('Error del servidor. Por favor, intenta más tarde');
      }
      // Error genérico
      else {
        setLoginError('Error al iniciar sesión. Por favor, intenta nuevamente');
      }
      
      // NO redirigir, quedarse en la página de login
      return;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-6">
          <Link href={ROUTES.HOME}>
            <Button 
              variant="outline" 
              size="sm"
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl items-center justify-center font-bold text-3xl text-white mb-4">
            C
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600">
            Inicia sesión para continuar
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Error Alert */}
          {loginError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">Error de autenticación</h3>
                <p className="text-sm text-red-700 mt-1">{loginError}</p>
              </div>
            </div>
          )}

          <Input
            label="Correo electrónico"
            type="email"
            placeholder="admin@colegio.edu"
            error={errors.email?.message}
            required
            fullWidth
            {...register('email')}
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            required
            fullWidth
            {...register('password')}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isLoading}
            rightIcon={!isLoading && <LogIn className="w-5 h-5" />}
            fullWidth
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        {/* Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            ¿Olvidaste tu contraseña?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Contacta al administrador
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}
