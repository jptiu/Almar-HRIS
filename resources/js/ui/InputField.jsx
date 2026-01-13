import React from "react";

export default function InputField({
    label,
    type = "text",
    placeholder = "",
    value,
    onChange,
    rightIcon: RightIcon = null,
    isPassword = false,
    showPassword,
    togglePassword,
}) {
    return (
        <div className="group relative bg-surface-card border border-(--color-border-default) rounded-2xl px-8 py-3 transition-all duration-300 ease-out hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-input-hover)] focus-within:border-[var(--color-border-focus)] focus-within:shadow-[0_0_0_1px_var(--color-focus-ring),0_8px_30px_var(--color-shadow-focus)]">
            <label className="block text-xs text-text-tertiary tracking-wide mb-1">
                {label}
            </label>

            <input
                type={isPassword ? (showPassword ? "text" : "password") : type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-transparent border-none pr-10 text-text-primary placeholder-text-muted focus:outline-none focus:ring-0"
            />

            {isPassword && togglePassword ? (
                <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition group-focus-within:text-info"
                >
                    {showPassword ? (
                        <RightIcon size={18} />
                    ) : (
                        <RightIcon size={18} />
                    )}
                </button>
            ) : (
                RightIcon && (
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none group-focus-within:text-info transition">
                        <RightIcon size={18} />
                    </div>
                )
            )}
        </div>
    );
}
