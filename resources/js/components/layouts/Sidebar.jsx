// resources/js/layouts/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { useAuthStore, useUIStore } from "@/stores";
import { navigationConfig } from "../../config/navigationConfig";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { cn } from "../../utils/cn";
import { User, LogOut } from "lucide-react";

const Sidebar = () => {
    const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
    const mobileMenuOpen = useUIStore((state) => state.mobileMenuOpen);
    const closeMobileMenu = useUIStore((state) => state.closeMobileMenu);

    const role = useAuthStore((state) => state.role);
    const isMobile = useMediaQuery("(max-width: 768px)");

    const navItems = navigationConfig[role] || [];

    const handleNavClick = () => {
        if (isMobile) closeMobileMenu();
    };

    const isCollapsedDesktop = sidebarCollapsed && !isMobile && !mobileMenuOpen;

    const sidebarClasses = cn(
        "fixed left-0 top-0 h-screen bg-[#0f1629] transition-all duration-300 z-40 flex flex-col",
        {
            "w-64": !sidebarCollapsed || mobileMenuOpen,
            "w-20": sidebarCollapsed && !mobileMenuOpen,
            "-translate-x-full": isMobile && !mobileMenuOpen,
            "translate-x-0": !isMobile || mobileMenuOpen,
        },
    );

    return (
        <div className={sidebarClasses}>
            {/* Logo */}
            <div className="border-b border-white/10 flex items-center justify-center bg-white p-2 sticky top-0 z-10">
                {sidebarCollapsed && !mobileMenuOpen ? (
                    <img
                        src="/images/almar-main-logo.svg"
                        alt="Almar HRIS Logo"
                        className="w-50 h-20 object-contain transition-all"
                    />
                ) : (
                    <img
                        src="/images/almar-hris-dark.svg"
                        alt="Almar HRIS Logo"
                        className="w-50 h-20 object-contain transition-all"
                    />
                )}
            </div>

            {/* Navigation */}
            <nav
                className={cn(
                    "flex-1 flex flex-col gap-1 overflow-y-auto min-h-0",
                    sidebarCollapsed ? "p-2 pt-4" : "p-4",
                )}
            >
                {navItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={handleNavClick}
                            className={({ isActive }) =>
                                cn(
                                    "group relative rounded-xl transition-all duration-200 overflow-hidden shrink-0",
                                    isCollapsedDesktop
                                        ? "flex flex-col items-center justify-center gap-1 p-3"
                                        : sidebarCollapsed
                                          ? "flex justify-center p-3"
                                          : "flex items-center gap-3 px-4 py-3",
                                    {
                                        "bg-brand-primary text-white shadow-lg":
                                            isActive,
                                        "text-gray-400 hover:bg-white/5 hover:text-white":
                                            !isActive,
                                    },
                                )
                            }
                        >
                            {/* Icon */}
                            <Icon className="w-5 h-5 shrink-0" />

                            {/* Expanded label */}
                            {(!sidebarCollapsed || mobileMenuOpen) && (
                                <span className="font-medium text-sm transition-all duration-200">
                                    {item.label}
                                </span>
                            )}

                            {/* Collapsed desktop bottom label (animated + clamped) */}
                            {isCollapsedDesktop && (
                                <span
                                    className="
                                        text-[10px] text-gray-400 text-center max-w-18
                                    "
                                >
                                    {item.label}
                                </span>
                            )}

                            {/* Badge (expanded only) */}
                            {item.badge &&
                                (!sidebarCollapsed || mobileMenuOpen) && (
                                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-semibold">
                                        {item.badge}
                                    </span>
                                )}

                            {/* Floating tooltip fallback */}
                            {isCollapsedDesktop && (
                                <div
                                    className="
                                        pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2
                                        whitespace-nowrap rounded-md bg-black px-3 py-1.5 text-xs text-white shadow-xl
                                        opacity-0 scale-95
                                        group-hover:opacity-100 group-hover:scale-100
                                        transition-all duration-150
                                    "
                                >
                                    {item.label}
                                </div>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* User Section */}
            <div
                className={cn(
                    "border-t border-white/10 bg-[#0f1629] sticky bottom-0 z-10",
                    sidebarCollapsed ? "p-2" : "p-4",
                )}
            >
                <div
                    className={cn(
                        "rounded-2xl hover:bg-white/5 transition-colors cursor-pointer",
                        sidebarCollapsed
                            ? "flex justify-center p-2"
                            : "flex items-center gap-3 p-3",
                    )}
                >
                    <div
                        className={cn(
                            "bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold shrink-0",
                            sidebarCollapsed ? "w-12 h-12" : "w-10 h-10",
                        )}
                    >
                        <User className="h-4 w-4" />
                    </div>

                    {(!sidebarCollapsed || mobileMenuOpen) && (
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">
                                {useAuthStore.getState().user?.name || "admin"}
                            </p>
                            <p className="text-gray-400 text-xs truncate">
                                Test Position
                            </p>
                        </div>
                    )}
                </div>

                <button
                    className={cn(
                        "w-full rounded-2xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors mt-2 cursor-pointer",
                        sidebarCollapsed
                            ? "flex justify-center p-3"
                            : "flex items-center gap-3 px-4 py-3",
                    )}
                >
                    <LogOut className="w-5 h-5 shrink-0" />

                    {(!sidebarCollapsed || mobileMenuOpen) && (
                        <span className="text-sm font-medium">Sign Out</span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
