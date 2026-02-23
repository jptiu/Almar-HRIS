// resources/js/components/LoadingSpinner.jsx
import { cn } from "@/lib/utils";

export const LoadingSpinner = ({ size = "md", className = "" }) => {
    const sizes = {
        sm: "w-4 h-4 border-2",
        md: "w-8 h-8 border-3",
        lg: "w-12 h-12 border-4",
    };

    return (
        <div className="flex items-center justify-center">
            <div
                className={cn(
                    "animate-spin rounded-full border-t-brand-primary border-r-transparent border-b-brand-primary border-l-transparent",
                    sizes[size],
                    className,
                )}
            />
        </div>
    );
};

export const LoadingOverlay = ({ message = "Loading..." }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-(--color-surface-overlay) backdrop-blur-xs">
            <div className="glass-container rounded-lg p-8 flex flex-col items-center gap-4">
                <LoadingSpinner size="lg" />
                <p className="text-text-primary font-medium">{message}</p>
            </div>
        </div>
    );
};
