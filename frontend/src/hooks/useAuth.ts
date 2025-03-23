import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '../store/slices/authSlice';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login(email, password);
      dispatch(setUser(response.user));
      localStorage.setItem('token', response.token);
      return response;
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await authService.loginWithGoogle();
      dispatch(setUser(response.user));
      localStorage.setItem('token', response.token);
      return response;
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const register = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.register(email, password);
      dispatch(setUser(response.user));
      localStorage.setItem('token', response.token);
      return response;
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      dispatch(clearUser());
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const resetPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      await authService.resetPassword(email);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    login,
    loginWithGoogle,
    register,
    logout,
    resetPassword,
    isLoading,
  };
}; 