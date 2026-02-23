import React from "react";
import { cn } from "@/lib/utils";

export const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0)?.toUpperCase() || "";
    const last = lastName?.charAt(0)?.toUpperCase() || "";
    return `${first}${last}`;
};

// Profile Avatar Component
// Displays initials in a rounded circle
export const ProfileAvatar = ({
    firstName,
    lastName,
    className,
    size = "md",
}) => {
    const initials = getInitials(firstName, lastName);

    const sizeClasses = {
        sm: "w-12 h-12 text-sm",
        md: "w-16 h-16 text-lg",
        lg: "w-20 h-20 text-xl",
        xl: "w-24 h-24 text-2xl",
    };

    return (
        <div
            className={cn(
                "rounded-full bg-brand-primary text-white font-semibold",
                "flex items-center justify-center",
                "shadow-md",
                sizeClasses[size],
                className,
            )}
            aria-label={`Profile avatar for ${firstName} ${lastName}`}
        >
            {initials}
        </div>
    );
};
