// resources/js/layouts/DashboardLayout.jsx
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useUIStore } from "@/stores";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import LogoutConfirmModal from "./LogoutConfirmModal";
import { useLogoutMutation } from "../hooks/useLogoutMutation";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../utils/cn";

const DashboardLayout = () => {
    const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
    const mobileMenuOpen = useUIStore((state) => state.mobileMenuOpen);
    const closeMobileMenu = useUIStore((state) => state.closeMobileMenu);
    const theme = useUIStore((state) => state.theme);
    const toggleSidebar = useUIStore((state) => state.toggleSidebar);

    const isMobile = useMediaQuery("(max-width: 768px)");

    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const logoutMutation = useLogoutMutation({
        onSuccess: () => setShowLogoutModal(false),
    });

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    const handleOverlayClick = () => {
        if (isMobile && mobileMenuOpen) closeMobileMenu();
    };

    return (
        <div className="h-screen flex overflow-hidden bg-[#e6ebf3]">
            {/* Sidebar */}
            <Sidebar onLogout={() => setShowLogoutModal(true)} />

            {/* Floating sidebar toggle */}
            {!isMobile && (
                <button
                    onClick={toggleSidebar}
                    aria-label="Toggle sidebar"
                    className={cn(
                        "fixed top-31 z-50 group",
                        "w-6 h-6 rounded-full bg-brand-primary border border-gray-300",
                        "flex items-center justify-center shadow-xl",
                        "hover:scale-110 transition-all duration-300 cursor-pointer",
                        !sidebarCollapsed ? "left-61" : "left-17",
                    )}
                >
                    {sidebarCollapsed ? (
                        <ChevronRight className="w-4 h-4 text-white" />
                    ) : (
                        <ChevronLeft className="w-4 h-4 text-white" />
                    )}
                </button>
            )}

            {/* Mobile overlay */}
            {isMobile && mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30"
                    onClick={handleOverlayClick}
                />
            )}

            {/* Main area */}
            <main
                className={cn(
                    "flex flex-col flex-1 overflow-hidden transition-all duration-300",
                    !isMobile && !sidebarCollapsed
                        ? "ml-64"
                        : !isMobile
                          ? "ml-20"
                          : "ml-0",
                )}
            >
                {/* Topbar fixed height */}
                <Topbar />

                {/* Scrollable page content */}
                <div className="flex-1 overflow-y-auto p-8 mt-10">
                    <Outlet />
                </div>
            </main>

            <LogoutConfirmModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={() => logoutMutation.mutate()}
                isLoading={logoutMutation.isPending}
            />
        </div>
    );
};

export default DashboardLayout;