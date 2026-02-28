import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const widths = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    full: "max-w-full",
};

const Drawer = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    size = "md",
    showCloseButton = true,
    className,
}) => {
    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    // Lock body scroll when open
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "unset";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop — covers entire viewport */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Drawer panel */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className={cn(
                    "absolute inset-y-0 right-0 flex flex-col w-full bg-white shadow-xl animate-in slide-in-from-right duration-300",
                    widths[size] ?? widths.md,
                    className,
                )}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
                    <div className="min-w-0">
                        {title && (
                            <h2 className="text-lg font-semibold text-slate-900 truncate sm:text-xl">
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p className="mt-0.5 text-sm text-slate-500 line-clamp-2">
                                {description}
                            </p>
                        )}
                    </div>

                    {showCloseButton && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                            <span className="sr-only">Close</span>
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export const DrawerFooter = ({ children, className }) => (
    <div
        className={cn(
            "flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4 sm:px-6",
            className,
        )}
    >
        {children}
    </div>
);

export default Drawer;
