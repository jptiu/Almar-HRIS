// resources/js/stores/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });
          const data = await response.json();

          set({
            user: data.user,
            role: data.user.role,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          role: null,
          isAuthenticated: false,
        });
      },

      hasRole: (roles) => {
        const { role } = get();
        return Array.isArray(roles) ? roles.includes(role) : roles === role;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
