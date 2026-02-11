// resources/js/layouts/DashboardLayout.jsx
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useUIStore } from "@/stores";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../utils/cn";

const DashboardLayout = ({ children }) => {
    const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
    const mobileMenuOpen = useUIStore((state) => state.mobileMenuOpen);
    const closeMobileMenu = useUIStore((state) => state.closeMobileMenu);
    const theme = useUIStore((state) => state.theme);
    const toggleSidebar = useUIStore((state) => state.toggleSidebar);

    const isMobile = useMediaQuery("(max-width: 768px)");

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    const handleOverlayClick = () => {
        if (isMobile && mobileMenuOpen) {
            closeMobileMenu();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            {/* Floating sidebar toggle */}
            {!isMobile && (
                <button
                    onClick={toggleSidebar}
                    aria-label="Toggle sidebar"
                    className={cn(
                        "fixed top-31 z-50 group",
                        "w-6 h-6 rounded-full bg-white text-white border border-gray-300",
                        "flex items-center justify-center shadow-xl",
                        "hover:scale-110 transition-all duration-300 cursor-pointer",

                        !sidebarCollapsed ? "left-61" : "left-17",
                    )}
                >
                    {sidebarCollapsed ? (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                    ) : (
                        <ChevronLeft className="w-4 h-4 text-gray-500" />
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

            {/* Main content */}
            <main
                className={`transition-all duration-300 ${
                    !isMobile && !sidebarCollapsed
                        ? "ml-64"
                        : !isMobile
                          ? "ml-20"
                          : "ml-0"
                } min-h-screen`}
            >
                <Topbar />
                <div className="p-8 bg-brand-primary-light min-h-[calc(100vh-80px)] mt-10">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
