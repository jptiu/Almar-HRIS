import { create } from "zustand";
import axiosInstance from "@/services/axiosInstance";

export const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (userData) => {
    if (!userData) return;

    set({
      user: {
        ...userData,
        primaryRole: userData.roles?.[0] ?? null,
      },
      isAuthenticated: true,
      isLoading: false,
    });
  },

  // ------------------------
  // INITIALIZE SESSION
  // Called ONCE on app boot
  // ------------------------
  initializeAuth: async () => {
    try {
      set({ isLoading: true });

      const response = await axiosInstance.get("/me");

      // IMPORTANT FIX HERE
      const userData = response.data.data;

      set({
        user: {
          ...userData,
          primaryRole: userData.roles?.[0] ?? null,
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  // ------------------------
  // ROLE CHECK
  // ------------------------
  hasRole: (role) => {
    const user = get().user;
    return user?.roles?.includes(role);
  },

  // ------------------------
  // LOGOUT
  // ------------------------
  logout: async () => {
    try {
      await axiosInstance.post("/logout");
    } catch (e) { }

    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));