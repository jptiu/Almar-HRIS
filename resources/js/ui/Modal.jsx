// resources/js/ui/Modal.jsx
import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../utils/cn";
import { Button } from "../ui/Button";

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = "md",
    showCloseButton = true,
}) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizes = {
        sm: "max-w-md",
        md: "max-w-2xl",
        lg: "max-w-4xl",
        xl: "max-w-6xl",
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[var(--color-surface-overlay)] backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={cn(
                    "relative w-full glass-container rounded-lg shadow-[0_20px_60px_var(--color-shadow-elevation)] animate-in fade-in zoom-in duration-200",
                    sizes[size]
                )}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between p-6 border-b border-[var(--color-border-default)]">
                        {title && (
                            <h2 className="text-2xl font-semibold text-text-primary">
                                {title}
                            </h2>
                        )}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="ml-auto p-2 hover:bg-(--color-brand-primary-100) rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-text-primary" />
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

export const ModalFooter = ({ children, className = "" }) => {
    return (
        <div
            className={cn(
                "flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-border-default)]",
                className
            )}
        >
            {children}
        </div>
    );
};

export default Modal;
