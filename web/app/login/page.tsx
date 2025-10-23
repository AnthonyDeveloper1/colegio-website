/**
 * Login Page - Integrado con Layout Principal
 * Página de inicio de sesión con Navbar visible
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn } from 'lucide-react';
import { Input, Button, Card } from '@/components/ui';
import { useAuth } from '@/hooks';
import { loginSchema } from '@/lib/validators';
import type { LoginCredentials } from '@/types';
import { Navbar, Footer } from '@/components/layout';

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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.push('/admin');
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      await login(data);
    } catch (error: any) {
      const errorMsg = error.response?.data?.msg || error.message || '';
      const statusCode = error.response?.status;
      
      if (statusCode === 401) {
        if (errorMsg.toLowerCase().includes('credenciales')) {
          setLoginError('Correo electrónico o contraseña incorrectos');
        } else {
          setLoginError('Las credenciales son incorrectas');
        }
      } else if (statusCode === 400) {
        setLoginError('Por favor completa todos los campos');
      } else if (statusCode >= 500) {
        setLoginError('Error del servidor. Por favor, intenta más tarde');
      } else {
        setLoginError('Error al iniciar sesión. Por favor, intenta nuevamente');
      }
      
      return;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      
      {/* Contenedor como página normal del sitio */}
      <main className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex w-16 h-16 bg-gray-200 rounded-2xl items-center justify-center font-bold text-3xl text-gray-700 mb-4">
                C
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Panel de Administración
              </h1>
              <p className="text-gray-600">
                Inicia sesión para continuar
              </p>
            </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              placeholder=""
              error={errors.password?.message}
              required
              fullWidth
              {...register('password')}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={isLoading}
              rightIcon={!isLoading ? <LogIn className="w-4 h-4" /> : undefined}
              className="w-full max-w-[340px] mx-auto !rounded-[0.7rem] h-11 shadow-lg border border-[#E63946] focus:ring-2 focus:ring-[#E63946]/40"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

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
      </main>
      
      <Footer />
    </>
  );
}

