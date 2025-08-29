import { useState, useEffect, useCallback } from 'react';
import { configurationService } from '../services/ConfigurationService';
import { User, UpdateProfileRequest, ChangePasswordRequest } from './../types/configuration.types';

export interface UseProfileReturn {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  updateProfile: (data: UpdateProfileRequest) => Promise<boolean>;
  changePassword: (data: ChangePasswordRequest) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
}

export function useProfile(userId?: string): UseProfileReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = configurationService.isAuthenticated();

  const refreshUser = useCallback(async () => {
    if (!userId || !isAuthenticated) {
      setIsLoading(false);
      setError('No se encontró el ID del usuario o no está autenticado');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await configurationService.getCurrentUser(userId);
      
      if (response.success && response.data) {
        setUser(response.data);
        setError(null);
      } else {
        const errorMsg = response.message || 'Error al obtener el perfil del usuario';
        setError(errorMsg);
        
        // Si hay error de autenticación, cerrar sesión
        if (errorMsg.toLowerCase().includes('unauthorized') || 
            errorMsg.toLowerCase().includes('token') ||
            errorMsg.toLowerCase().includes('forbidden')) {
          configurationService.logout();
          setUser(null);
        }
      }
    } catch (error) {
      let errorMessage = 'Error inesperado al cargar el perfil';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      setError(errorMessage);
      console.error('Error al obtener usuario:', error);
      
      // Si es error de red o autenticación, limpiar datos
      if (errorMessage.includes('fetch') || errorMessage.includes('401')) {
        configurationService.logout();
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId, isAuthenticated]);

  const updateProfile = useCallback(async (data: UpdateProfileRequest): Promise<boolean> => {
    if (!userId) {
      setError('ID de usuario no disponible');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await configurationService.updateProfile(userId, data);
      
      if (response.success && response.data) {
        setUser(response.data);
        setError(null);
        return true;
      } else {
        const errorMsg = response.message || 'Error al actualizar el perfil';
        setError(errorMsg);
        return false;
      }
    } catch (error) {
      let errorMessage = 'Error inesperado al actualizar perfil';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      console.error('Error al actualizar perfil:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const changePassword = useCallback(async (data: ChangePasswordRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await configurationService.changePassword(data);
      
      if (response.success) {
        setError(null);
        return true;
      } else {
        const errorMsg = response.message || 'Error al cambiar la contraseña';
        setError(errorMsg);
        return false;
      }
    } catch (error) {
      let errorMessage = 'Error inesperado al cambiar contraseña';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      console.error('Error al cambiar contraseña:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    if (!email || !email.includes('@')) {
      setError('Email inválido');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await configurationService.resetPassword(email);
      
      if (response.success) {
        setError(null);
        return true;
      } else {
        const errorMsg = response.message || 'Error al solicitar reset de contraseña';
        setError(errorMsg);
        return false;
      }
    } catch (error) {
      let errorMessage = 'Error inesperado al solicitar reset';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      console.error('Error al resetear contraseña:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect para cargar usuario inicial
  useEffect(() => {
    if (userId && isAuthenticated) {
      refreshUser();
    } else {
      setIsLoading(false);
      if (!isAuthenticated) {
        setError('Usuario no autenticado');
      }
    }
  }, [userId, isAuthenticated, refreshUser]);

  return {
    user,
    isLoading,
    error,
    refreshUser,
    isAuthenticated,
    updateProfile,
    changePassword,
    resetPassword
  };
}