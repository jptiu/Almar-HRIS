import React from "react";

const sizeVariants = {
    xs: {
        container: "px-3 py-1.5 rounded-lg",
        label: "text-[9px] mb-0.5",
        input: "text-xs",
        icon: 14,
        iconRight: "right-3",
    },
    sm: {
        container: "px-4 py-2 rounded-xl",
        label: "text-[10px] mb-1",
        input: "text-sm",
        icon: 16,
        iconRight: "right-4",
    },
    md: {
        container: "px-6 py-3 rounded-2xl",
        label: "text-xs mb-1",
        input: "text-base",
        icon: 18,
        iconRight: "right-5",
    },
    lg: {
        container: "px-8 py-4 rounded-2xl",
        label: "text-sm mb-2",
        input: "text-lg",
        icon: 20,
        iconRight: "right-6",
    },
};

const themeVariants = {
    dark: {
        container: `
            bg-surface-card
            border border-(--color-border-default)
            hover:border-(--color-border-hover)
            hover:bg-(--color-surface-input-hover)
            focus-within:border-(--color-border-focus)
            focus-within:shadow-[0_0_0_1px_var(--color-focus-ring),0_8px_30px_var(--color-shadow-focus)]
        `,
        label: "text-text-tertiary",
        input: "text-text-primary placeholder-text-muted",
        icon: "text-text-tertiary group-focus-within:text-info",
    },
    light: {
        container: `
            bg-white
            border border-gray-300
            hover:border-gray-400
            hover:bg-gray-50
            focus-within:border-blue-500
            focus-within:shadow-[0_0_0_2px_rgba(59,130,246,0.25)]
        `,
        label: "text-gray-500",
        input: "text-gray-900 placeholder-gray-400",
        icon: "text-gray-400 group-focus-within:text-blue-500",
    },
};

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
    size = "md",
    variant = "dark", // 👈 default theme
}) {
    const sizeConfig = sizeVariants[size] || sizeVariants.md;
    const themeConfig = themeVariants[variant] || themeVariants.dark;

    return (
        <div
            className={`group relative transition-all duration-300 ease-out
            ${sizeConfig.container}
            ${themeConfig.container}`}
        >
            {label && (
                <label
                    className={`block tracking-wide ${sizeConfig.label} ${themeConfig.label}`}
                >
                    {label}
                </label>
            )}

            <input
                type={isPassword ? (showPassword ? "text" : "password") : type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full bg-transparent border-none pr-10 focus:outline-none focus:ring-0
                ${sizeConfig.input} ${themeConfig.input}`}
            />

            {isPassword && togglePassword ? (
                <button
                    type="button"
                    onClick={togglePassword}
                    className={`absolute ${sizeConfig.iconRight} top-1/2 -translate-y-1/2 transition ${themeConfig.icon}`}
                >
                    <RightIcon size={sizeConfig.icon} />
                </button>
            ) : (
                RightIcon && (
                    <div
                        className={`absolute ${sizeConfig.iconRight} top-1/2 -translate-y-1/2 pointer-events-none transition ${themeConfig.icon}`}
                    >
                        <RightIcon size={sizeConfig.icon} />
                    </div>
                )
            )}
        </div>
    );
}