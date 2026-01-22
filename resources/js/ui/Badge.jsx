// resources/js/ui/Badge.jsx
import { cn } from "../utils/cn";

const Badge = ({ children, variant = "default", className = "" }) => {
    const variants = {
        default: "bg-[var(--color-brand-primary-200)] text-text-primary",
        success: "bg-[var(--color-success)] text-text-primary",
        danger: "bg-[var(--color-danger)] text-text-primary",
        warning: "bg-[var(--color-warning)] text-text-primary",
        info: "bg-[var(--color-info)] text-text-primary",
        outline:
            "bg-transparent border border-[var(--color-border-default)] text-[var(--color-text-secondary)]",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    );
};

export default Badge;
