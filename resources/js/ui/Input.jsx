// resources/js/ui/Input.jsx
import { cn } from "../utils/cn";

const Input = ({
    label,
    error,
    className = "",
    leftIcon,
    rightIcon,
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-[var(--color-text-secondary)] text-sm font-medium mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]">
                        {leftIcon}
                    </div>
                )}
                <input
                    className={cn(
                        "input-field w-full px-4 py-2 rounded-lg",
                        {
                            "border-[var(--color-border-error)]": error,
                            "pl-10": leftIcon,
                            "pr-10": rightIcon,
                        },
                        className
                    )}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]">
                        {rightIcon}
                    </div>
                )}
            </div>
            {error && (
                <p className="mt-1 text-sm text-[var(--color-danger)]">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
