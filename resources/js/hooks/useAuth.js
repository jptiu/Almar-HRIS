// resources/js/hooks/useAuth.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

/**
 * Custom hook for authentication
 * Provides easy access to auth state and methods
 * 
 * @returns {Object} Auth state and methods
 */
export const useAuth = () => {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const hasRole = useAuthStore((state) => state.hasRole);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return {
    user,
    role,
    isAuthenticated,
    isLoading,
    login,
    logout: handleLogout,
    hasRole,
  };
};
