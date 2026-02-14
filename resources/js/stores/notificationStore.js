// resources/js/stores/notificationStore.js
import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          id: Date.now(),
          read: false,
          timestamp: new Date().toISOString(),
          ...notification,
        },
        ...state.notifications,
      ],
      unreadCount: state.unreadCount + 1,
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notif) => ({ ...notif, read: true })),
      unreadCount: 0,
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((notif) => notif.id !== id),
      unreadCount: state.notifications.find((n) => n.id === id)?.read
        ? state.unreadCount
        : Math.max(0, state.unreadCount - 1),
    })),

  clearAll: () =>
    set({
      notifications: [],
      unreadCount: 0,
    }),
}));
