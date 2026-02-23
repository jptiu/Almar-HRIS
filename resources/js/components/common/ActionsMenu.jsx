import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal, Loader2 } from "lucide-react";

const ActionsMenu = ({ actions = [], row, menuClassName = "" }) => {
    const [open, setOpen] = useState(false);
    const [menuStyle, setMenuStyle] = useState({});
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleToggle = (e) => {
        e.stopPropagation();
        if (!open && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const openUpward = spaceBelow < 200;

            setMenuStyle({
                position: "fixed",
                right: window.innerWidth - rect.right,
                ...(openUpward
                    ? { bottom: window.innerHeight - rect.top + 4 }
                    : { top: rect.bottom + 4 }),
                zIndex: 9999,
                width: 160,
            });
        }
        setOpen((prev) => !prev);
    };

    return (
        <div className="relative inline-block">
            <button
                ref={buttonRef}
                onClick={handleToggle}
                className="p-1 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
            >
                <MoreHorizontal className="w-5 h-5 text-text-tertiary" />
            </button>

            {open &&
                createPortal(
                    <div
                        ref={menuRef}
                        style={menuStyle}
                        className={`rounded-md border border-gray-200 bg-white shadow-lg py-1 animate-fade-in ${menuClassName}`}
                    >
                        {actions.map((action, index) => {
                            const isLoading = action.loading ?? false;
                            const isDisabled = action.disabled || isLoading;
                            const isDanger = action.variant === "danger";

                            return (
                                <button
                                    key={index}
                                    disabled={isDisabled}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        action.onClick?.(row);
                                        setOpen(false);
                                    }}
                                    className={`flex items-center gap-2 w-full px-3 py-2 text-sm cursor-pointer
                                        ${isDanger ? "text-red-600 hover:bg-red-50" : "text-text-dark hover:bg-gray-50"}
                                        ${isDisabled ? "opacity-50 cursor-not-allowed!" : ""}
                                        ${action.className ?? ""}`}
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        action.icon
                                    )}
                                    {isLoading
                                        ? (action.loadingLabel ?? "Loading...")
                                        : action.label}
                                </button>
                            );
                        })}
                    </div>,
                    document.body,
                )}
        </div>
    );
};

export default ActionsMenu;
