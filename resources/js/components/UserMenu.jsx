// resources/js/components/UserMenu.jsx
import { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { cn } from "../utils/cn";

const UserMenu = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const { logout } = useAuth();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={menuRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-2 hover:bg-(--color-brand-primary-100) rounded-lg transition-colors"
            >
                <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center">
                    <span className="text-text-primary font-medium text-sm">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                </div>
                <span className="hidden md:block text-text-primary text-sm font-medium">
                    {user?.name || "User"}
                </span>
                <ChevronDown
                    className={cn(
                        "w-4 h-4 text-text-tertiary transition-transform",
                        isOpen && "rotate-180",
                    )}
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 glass-container rounded-lg shadow-[0_12px_40px_var(--color-shadow-elevation)] py-2 z-50">
                    <div className="px-4 py-3 border-b border-(--color-border-default)">
                        <p className="text-text-primary font-medium">
                            {user?.name}
                        </p>
                        <p className="text-text-tertiary text-sm">
                            {user?.email}
                        </p>
                        <p className="text-text-muted text-xs mt-1 capitalize">
                            {user?.role}
                        </p>
                    </div>

                    <div className="py-2">
                        <Link
                            to="/profile"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-text-secondary hover:bg-(--color-brand-primary-100) hover:text-text-primary transition-colors"
                        >
                            <User className="w-4 h-4" />
                            <span>My Profile</span>
                        </Link>

                        <Link
                            to="/settings"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-text-secondary hover:bg-(--color-brand-primary-100) hover:text-text-primary transition-colors"
                        >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                        </Link>
                    </div>

                    <div className="border-t border-(--color-border-default) pt-2">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                logout();
                            }}
                            className="flex items-center gap-3 px-4 py-2 w-full text-danger) hover:bg-(--color-brand-primary-100) transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
