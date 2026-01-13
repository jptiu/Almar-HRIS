import React from "react";
import { Plus, Edit, Trash } from "lucide-react";

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {'primary'|'secondary'|'success'|'danger'|'ghost'} props.variant - Button style variant
 * @param {'sm'|'md'|'lg'} props.size - Button size
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.loading - Loading state
 * @param {Function} props.onClick - Click handler
 * @param {string} props.className - Additional classes
 * @param {string} props.type - Button type (button, submit, reset)
 */
export default function Button({
    children,
    variant = "primary",
    size = "md",
    disabled = false,
    loading = false,
    onClick,
    className = "",
    type = "button",
    ...rest
}) {
    // Base styles (same for all buttons)
    const baseClasses =
        "relative overflow-hidden font-medium rounded-2xl transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 cursor-pointer flex items-center justify-center";

    // Size variants
    const sizeClasses = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
    };

    // ✅ VARIANT STYLES - USING COLOR SYSTEM
    const variantClasses = {
        // Primary - Uses brand colors from color system
        primary:
            "bg-brand-primary hover:bg-brand-primary-hover text-text-primary shadow-[0_4px_12px_var(--color-shadow-primary)] hover:shadow-[0_12px_40px_var(--color-shadow-primary)] focus:ring-brand-primary",

        // Secondary - Transparent with border
        secondary:
            "bg-transparent border-2 border-glass-border hover:border-glass-border-hover text-text-primary hover:bg-brand-primary/10 focus:ring-brand-primary",

        // Success - Green for positive actions
        success:
            "bg-success hover:bg-success-hover text-white shadow-lg hover:shadow-xl focus:ring-success",

        // Danger - Red for destructive actions
        danger: "bg-danger hover:bg-danger-hover text-white shadow-lg hover:shadow-xl focus:ring-danger",

        // Ghost - Subtle, no background
        ghost: "bg-transparent text-text-primary hover:bg-brand-primary/10 focus:ring-brand-primary",
    };

    // Combine all classes
    const buttonClasses = `
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
    `
        .trim()
        .replace(/\s+/g, " ");

    return (
        <button
            type={type}
            className={buttonClasses}
            onClick={onClick}
            disabled={disabled || loading}
            {...rest}
        >
            {/* Loading Spinner */}
            {loading && (
                <span className="absolute inset-0 flex items-center justify-center">
                    <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                </span>
            )}

            {/* Button Content */}
            <span className={loading ? "opacity-0" : ""}>{children}</span>

            {/* Glossy overlay effect (for primary buttons) */}
            {variant === "primary" && (
                <>
                    <span className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)]"></span>
                    <span className="pointer-events-none absolute bottom-0 right-0 h-full w-1/2 bg-linear-to-tr from-white/0 via-white/10 to-white/40 blur-2xl opacity-70"></span>
                </>
            )}
        </button>
    );
}

/* ============================================
 * USAGE EXAMPLES
 * ============================================ */

/**
 * Example 1: Login Form
 */
export function LoginFormExample() {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login
    };

    return (
        <form onSubmit={handleSubmit}>
            <Button type="submit" variant="primary" size="lg">
                Log In
            </Button>
        </form>
    );
}

/**
 * Example 2: Action Buttons
 */
export function ActionButtonsExample() {
    return (
        <div className="flex gap-3">
            <Button variant="primary">Save Changes</Button>

            <Button variant="secondary">Cancel</Button>

            <Button variant="success">Approve</Button>

            <Button variant="danger">Delete</Button>
        </div>
    );
}

/**
 * Example 3: Different Sizes
 */
export function SizeVariantsExample() {
    return (
        <div className="flex items-center gap-3">
            <Button variant="primary" size="sm">
                Small
            </Button>

            <Button variant="primary" size="md">
                Medium
            </Button>

            <Button variant="primary" size="lg">
                Large
            </Button>
        </div>
    );
}

/**
 * Example 4: Loading State
 */
export function LoadingButtonExample() {
    const [isLoading, setIsLoading] = React.useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsLoading(false);
    };

    return (
        <Button variant="primary" loading={isLoading} onClick={handleClick}>
            {isLoading ? "Saving..." : "Save"}
        </Button>
    );
}

/**
 * Example 5: Disabled State
 */
export function DisabledButtonExample() {
    return (
        <div className="flex gap-3">
            <Button variant="primary" disabled>
                Disabled Primary
            </Button>

            <Button variant="success" disabled>
                Disabled Success
            </Button>
        </div>
    );
}

/**
 * Example 6: Ghost Buttons (Subtle)
 */
export function GhostButtonExample() {
    return (
        <div className="flex gap-3">
            <Button variant="ghost">View Details</Button>

            <Button variant="ghost">Learn More</Button>
        </div>
    );
}

/**
 * Example 7: Button Group
 */
export function ButtonGroupExample() {
    return (
        <div className="inline-flex rounded-2xl overflow-hidden border border-glass-border">
            <Button
                variant="ghost"
                size="sm"
                className="rounded-none border-r border-glass-border"
            >
                Left
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className="rounded-none border-r border-glass-border"
            >
                Center
            </Button>
            <Button variant="ghost" size="sm" className="rounded-none">
                Right
            </Button>
        </div>
    );
}

/**
 * Example 8: Icon Buttons
 */
export function IconButtonExample() {

    return (
        <div className="flex gap-3">
            <Button variant="primary" size="md">
                <Plus className="inline mr-2" size={18} />
                Add New
            </Button>

            <Button variant="secondary" size="sm">
                <Edit className="inline mr-2" size={16} />
                Edit
            </Button>

            <Button variant="danger" size="sm">
                <Trash className="inline mr-2" size={16} />
                Delete
            </Button>
        </div>
    );
}