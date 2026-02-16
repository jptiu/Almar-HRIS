import { create } from "zustand";
import axiosInstance from "@/services/axiosInstance";
import { switchRoleApi } from "@/services/authService";

export const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isSwitchingRole: false,

  setUser: (userData) => {
    if (!userData) return;

    set({
      user: {
        ...userData,
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
  // SWITCH ROLE
  // ------------------------
  switchRole: async (role) => {
    try {
      set({ isSwitchingRole: true });
      const response = await switchRoleApi(role);
      const newActiveRole = response.data?.active_role;

      set((state) => ({
        user: {
          ...state.user,
          active_role: newActiveRole,
        },
        isSwitchingRole: false,
      }));

      return newActiveRole;
    } catch (error) {
      set({ isSwitchingRole: false });
      throw error;
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
  clearUser: () => {
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  logout: async () => {
    try {
      await axiosInstance.post("/me/logout");
    } catch (e) { }

    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));