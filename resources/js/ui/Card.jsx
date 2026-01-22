// resources/js/ui/Card.jsx
import { cn } from "../utils/cn";

const Card = ({ children, className = "", hover = false }) => {
    return (
        <div
            className={cn(
                "glass-container rounded-lg p-6 transition-all duration-200",
                {
                    "hover:shadow-[0_12px_40px_var(--color-shadow-elevation)] hover:scale-[1.02] cursor-pointer":
                        hover,
                },
                className
            )}
        >
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className = "" }) => {
    return <div className={cn("mb-4", className)}>{children}</div>;
};

export const CardTitle = ({ children, className = "" }) => {
    return (
        <h3
            className={cn("text-xl font-semibold text-text-primary", className)}
        >
            {children}
        </h3>
    );
};

export const CardContent = ({ children, className = "" }) => {
    return <div className={cn("", className)}>{children}</div>;
};

export default Card;
