import React, { useEffect, useState } from "react";
import { User, ChevronUp, ChevronDown, LogOut, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SidebarProfileFooter({
    user,
    sidebarCollapsed,
    mobileMenuOpen,
    onSwitchRole,
    onLogout,
    isSwitchingRole = false,
}) {
    const [footerCollapsed, setFooterCollapsed] = useState(true);

    useEffect(() => {
        if (sidebarCollapsed) {
            setFooterCollapsed(true);
        }
    }, [sidebarCollapsed]);

    const roles = user?.user?.roles || [];
    const position = user?.user?.position || "unknown";
    const userName = user?.user?.full_name || "User";
    const showSwitchRole = Array.isArray(roles) && roles.length > 1;

    return (
        <div
            className={cn(
                "border-t border-white/10 bg-[#0f1629] sticky bottom-0 z-10 rounded-t-2xl overflow-hidden transition-all duration-300",
                footerCollapsed ? "max-h-22" : "max-h-59",
                sidebarCollapsed ? "p-2" : "p-4",
            )}
        >
            {/* PROFILE ROW */}
            <div className="relative">
                <div
                    onClick={() => {
                        if (!sidebarCollapsed || mobileMenuOpen) {
                            setFooterCollapsed((prev) => !prev);
                        }
                    }}
                    className={cn(
                        "rounded-2xl hover:bg-white/5 transition-colors mb-4 cursor-pointer select-none",
                        footerCollapsed ? "bg-white/0" : "bg-white/5",
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
                                {userName}
                            </p>
                            <p className="text-gray-400 text-xs truncate">
                                {position}
                            </p>
                        </div>
                    )}

                    {(!sidebarCollapsed || mobileMenuOpen) &&
                        (footerCollapsed ? (
                            <ChevronUp size={18} className="text-gray-400" />
                        ) : (
                            <ChevronDown size={18} className="text-gray-400" />
                        ))}
                </div>
            </div>

            {/* SWITCH ROLE */}
            {showSwitchRole && (
                <>
                    <p className="text-text-secondary text-xs p-2">
                        Switch Role
                    </p>

                    <div
                        className={cn(
                            "w-full rounded-2xl bg-white/5 p-1 mb-2 flex",
                            sidebarCollapsed ? "justify-center" : "",
                        )}
                    >
                        {roles.map((r) => {
                            const isActive = user?.active_role === r;

                            return (
                                <button
                                    key={r}
                                    disabled={isSwitchingRole}
                                    onClick={() =>
                                        onSwitchRole && onSwitchRole(r)
                                    }
                                    className={cn(
                                        "flex-1 text-xs py-2 rounded-xl transition-all font-medium cursor-pointer flex items-center justify-center gap-1.5",
                                        isActive
                                            ? "bg-brand-primary text-white shadow"
                                            : "text-gray-400 hover:bg-white/10",
                                        isSwitchingRole &&
                                            "opacity-60 cursor-not-allowed",
                                    )}
                                >
                                    {isSwitchingRole && !isActive && (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    )}
                                    {r === "employee" ? "Personal" : "Manage"}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}

            {/* LOGOUT */}
            <div
                className={cn(
                    "transition-all duration-200",
                    footerCollapsed
                        ? "opacity-0 pointer-events-none"
                        : "opacity-100",
                )}
            >
                <button
                    onClick={onLogout}
                    className={cn(
                        "w-full rounded-2xl text-gray-400 hover:text-danger hover:bg-white/5 transition-colors mt-2 cursor-pointer",
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
}
