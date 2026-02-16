// resources/js/layouts/Sidebar.jsx
import { useEffect, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore, useUIStore } from "@/stores";
import { useSwitchRoleMutation } from "../hooks";
import { navigationConfig } from "@/config/navigationConfig";
import { useMediaQuery } from "@/hooks";
import { cn } from "../../utils/cn";
import SidebarProfileFooter from "./SidebarProfileFooter";

const Sidebar = ({ onLogout }) => {
    const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
    const mobileMenuOpen = useUIStore((state) => state.mobileMenuOpen);
    const closeMobileMenu = useUIStore((state) => state.closeMobileMenu);

    const role = useAuthStore((state) => state.user?.active_role) || "employee";
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width: 768px)");

    const navItems = navigationConfig[role] || [];

    useEffect(() => {
        if (!isMobile && mobileMenuOpen) {
            closeMobileMenu();
        }
    }, [isMobile, mobileMenuOpen, closeMobileMenu]);

    const handleNavClick = () => {
        if (isMobile) closeMobileMenu();
    };

    const getRoleDashboardPath = (roleName) => {
        const roleRouteMap = {
            admin: "/admin/dashboard",
            manager: "/hr/dashboard",
            employee: "/employee/dashboard",
        };
        return roleRouteMap[roleName] || "/employee/dashboard";
    };

    const switchRoleMutation = useSwitchRoleMutation({
        onSuccess: (activeRole) => {
            navigate(getRoleDashboardPath(activeRole));
        },
    });

    const handleSwitchRole = useCallback(
        (newRole) => {
            if (newRole === role) return;
            switchRoleMutation.mutate(newRole);
        },
        [role, switchRoleMutation],
    );

    const isCollapsedDesktop = sidebarCollapsed && !isMobile && !mobileMenuOpen;

    const sidebarClasses = cn(
        "fixed left-0 top-0 h-screen bg-[#eff2f7] transition-all duration-300 z-40 flex flex-col",
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
            <div className="border-b border-white/10 flex items-center justify-center bg-[#eff2f7] p-2 sticky top-0 z-10">
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
                                    "group relative rounded-xl transition-all duration-200 overflow-hidden shrink-0 text-extr",
                                    isCollapsedDesktop
                                        ? "flex flex-col items-center justify-center gap-1 p-3"
                                        : sidebarCollapsed
                                          ? "flex justify-center p-3"
                                          : "flex items-center gap-3 px-4 py-3",
                                    {
                                        "bg-brand-primary text-white shadow-lg":
                                            isActive,
                                        "text-text-dark hover:bg-white":
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
            <SidebarProfileFooter
                user={user}
                sidebarCollapsed={sidebarCollapsed}
                mobileMenuOpen={mobileMenuOpen}
                onSwitchRole={handleSwitchRole}
                isSwitchingRole={switchRoleMutation.isPending}
                onLogout={onLogout}
            />
        </div>
    );
};

export default Sidebar;
