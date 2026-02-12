import { create } from "zustand";
import axiosInstance from "@/services/axiosInstance";

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  // Set user manually (used after login)
  setUser: (data) =>
    set({
      user: {
        name: data.full_name,
        role: data.roles?.[0] ?? null,
        position: data.position,
        department: data.department,
        branch: data.branch,
        company: data.company,
      },
      isLoading: false,
      isAuthenticated: true,
    }),

  // Initialize session from backend (called on app boot)
  initializeAuth: async () => {
    try {
      const response = await axiosInstance.get("/me");
      const data = response.data;

      set({
        user: {
          name: data.full_name,
          role: data.roles?.[0] ?? null,
          position: data.position,
          department: data.department,
          branch: data.branch,
          company: data.company,
        },
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      // If 401, redirect to login page
      if (error.response?.status === 401) {
        // Clear any stale state and redirect to login
        set({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
        // Redirect to login page if not already there
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      } else {
        // Other errors - still mark as not authenticated
        set({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    }
  },

  // Logout clears user
  logout: () =>
    set({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    }),
}));
