// resources/js/stores/uiStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const useUIStore = create(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      theme: 'dark',
      notificationPanelOpen: false,
      mobileMenuOpen: false,
      breadcrumbs: [],
      greeting: getGreeting(),

      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
      })),

      toggleNotificationPanel: () => set((state) => ({
        notificationPanelOpen: !state.notificationPanelOpen
      })),

      toggleMobileMenu: () => set((state) => ({
        mobileMenuOpen: !state.mobileMenuOpen
      })),

      closeMobileMenu: () => set({ mobileMenuOpen: false }),

      setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),

      updateGreeting: () => set({ greeting: getGreeting() }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    }
  )
);

export default useUIStore;
