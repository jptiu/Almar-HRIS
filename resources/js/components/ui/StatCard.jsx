// resources/js/ui/StatCard.jsx
import { cn } from "@/utils";

const variantStyles = {
    default: "border border-gray-200",
    success: "bg-success/10 border border-success/20",
    warning: "bg-warning/10 border border-warning/20",
    info: "bg-info/10 border border-info/20",
};

const iconStyles = {
    default: "bg-neutral/20",
    success: "bg-success/20 text-success",
    warning: "bg-warning/20 text-warning",
    info: "bg-info/20 text-info",
};

export function StatCard({
    title,
    value,
    icon: Icon,
    trend,
    subtitle,
    variant = "default",
}) {
    return (
        <div
            className={cn(
                "stat-card card-elevated rounded-xl p-5",
                "transition-all duration-300 ease-out",
                "hover:-translate-y-1 hover:shadow-lg",
                variantStyles[variant],
            )}
        >
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p
                        className={cn(
                            "text-sm font-medium",
                            variant === "primary"
                                ? "text-primary-foreground/80"
                                : "text-muted-foreground",
                        )}
                        style={{ color: "#65748b" }}
                    >
                        {title}
                    </p>

                    <p
                        className={cn(
                            "text-2xl font-bold tracking-tight text-text-dark",
                            variant === "primary"
                                ? "text-primary-foreground"
                                : "text-foreground",
                        )}
                    >
                        {value}
                    </p>

                    {(trend || subtitle) && (
                        <div className="flex items-center gap-2">
                            {trend && (
                                <span
                                    className={cn(
                                        "text-xs font-medium",
                                        trend.isPositive
                                            ? "text-success"
                                            : "text-danger",
                                    )}
                                >
                                    {trend.isPositive ? "+" : ""}
                                    {trend.value}%
                                </span>
                            )}

                            {subtitle && (
                                <span
                                    className={cn(
                                        "text-xs",
                                        variant === "primary"
                                            ? "text-primary-foreground/70"
                                            : "text-muted-foreground",
                                    )}
                                    style={{ color: "#65748b" }}
                                >
                                    {subtitle}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <div
                    className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        iconStyles[variant],
                    )}
                >
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}
