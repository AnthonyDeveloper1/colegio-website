/**
 * useAuth Hook
 * Hook personalizado para autenticación
 */

'use client';

import { useAuthStore } from '@/stores';
import { authService } from '@/services';
import { useRouter } from 'next/navigation';
import { ROUTES, TOAST_MESSAGES } from '@/lib/constants';
import { useUIStore } from '@/stores';
import type { LoginCredentials } from '@/types';

export function useAuth() {
  const router = useRouter();
  const { token, user, isAuthenticated, login: loginStore, logout: logoutStore } = useAuthStore();
  const { showToast, setLoading } = useUIStore();

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      loginStore(response.access_token, response.user);
      
      showToast({
        type: 'success',
        message: TOAST_MESSAGES.LOGIN_SUCCESS,
      });
      
      router.push(ROUTES.ADMIN.DASHBOARD);
    } catch (error: any) {
      showToast({
        type: 'error',
        message: error.response?.data?.msg || TOAST_MESSAGES.LOGIN_ERROR,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutStore();
    authService.logout();
    
    showToast({
      type: 'success',
      message: TOAST_MESSAGES.LOGOUT_SUCCESS,
    });
    
    router.push(ROUTES.LOGIN);
  };

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
  };
}
