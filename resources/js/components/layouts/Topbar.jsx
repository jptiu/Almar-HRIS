// resources/js/layouts/Topbar.jsx
import { useState, useTransition } from "react";
import { Menu, Bell, Search } from "lucide-react";
import { useNotificationStore, useAuthStore, useUIStore } from "@/stores";
import { NotificationPanel } from "../common";
import { useMediaQuery } from "@/hooks";

const Topbar = () => {
    const [isPending, startTransition] = useTransition();

    const toggleSidebar = useUIStore((state) => state.toggleSidebar);
    const toggleMobileMenu = useUIStore((state) => state.toggleMobileMenu);
    const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
    const notificationPanelOpen = useUIStore(
        (state) => state.notificationPanelOpen,
    );
    const toggleNotificationPanel = useUIStore(
        (state) => state.toggleNotificationPanel,
    );

    const user = useAuthStore((state) => state.user);
    const unreadCount = useNotificationStore((state) => state.unreadCount);
    const isMobile = useMediaQuery("(max-width: 768px)");

    const handleMenuToggle = () => {
        startTransition(() => {
            if (isMobile) {
                toggleMobileMenu();
            } else {
                toggleSidebar();
            }
        });
    };

    return (
        <header
            className="fixed top-0 right-0 h-16 z-30 transition-all duration-30 bg-[brand-primary-light/20] backdrop-blur-md border-b border-gray-200"
            style={{ left: isMobile ? 0 : sidebarCollapsed ? "5rem" : "16rem" }}
        >
            <div className="flex items-center justify-between h-full px-8">
                {/* Left section */}
                <div className="flex items-center gap-6">
                    {isMobile && (
                        <button
                            onClick={handleMenuToggle}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Toggle menu"
                        >
                            <Menu className="w-5 h-5 text-gray-700" />
                        </button>
                    )}
                    <h1 className="text-xl font-semibold text-gray-800">
                        Dashboard
                    </h1>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleNotificationPanel}
                        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Notifications"
                    >
                        <Bell className="w-6 h-6 text-gray-600" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    <div className="text-right">
                        <p className="text-sm text-gray-500">
                            {new Date().toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Notification Panel */}
            {notificationPanelOpen && <NotificationPanel />}
        </header>
    );
};

export default Topbar;
