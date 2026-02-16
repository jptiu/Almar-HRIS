// resources/js/ui/Modal.jsx
import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

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
        document.body.style.overflow = isOpen ? "hidden" : "unset";
        return () => (document.body.style.overflow = "unset");
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
            {/* Backdrop - NO BLUR */}
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            {/* Modal */}
            <div
                className={cn(
                    "relative w-full bg-white rounded-xl shadow-xl animate-in fade-in zoom-in duration-200",
                    sizes[size],
                )}
            >
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between p-6 border-b">
                        {title && (
                            <h2 className="text-2xl font-semibold">{title}</h2>
                        )}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="ml-auto p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                )}

                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

export const ModalFooter = ({ children, className = "" }) => (
    <div
        className={cn(
            "flex items-center justify-end gap-3 pt-4",
            className,
        )}
    >
        {children}
    </div>
);

export default Modal;
