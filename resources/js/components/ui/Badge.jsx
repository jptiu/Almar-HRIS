// resources/js/ui/Badge.jsx
import { cn } from "../../utils/cn";

export const Badge = ({ children, variant = "default", className = "" }) => {
    const variants = {
        default: "bg-gray-100 text-gray-800",
        success: "bg-green-100 text-green-600",
        danger: "bg-red-100 text-red-600",
        warning: "bg-yellow-100 text-yellow-600",
        info: "bg-blue-100 text-blue-600",
        outline:
            "bg-transparent border border-(--color-border-default) text-(--color-text-secondary)",
    };

    return (
        <span
            className={cn(
                "px-3 py-1 rounded-full text-xs font-medium",
                variants[variant],
                className,
            )}
        >
            {children}
        </span>
    );
};
