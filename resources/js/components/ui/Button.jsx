import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "../../utils/cn";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1629] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
    {
        variants: {
            variant: {
                default:
                    "bg-brand-primary text-white hover:bg-brand-primary-hover shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
                white: "bg-white text-text-dark hover:bg-gray-100 shadow-md hover:shadow-lg",
                destructive:
                    "bg-danger text-white hover:bg-danger-hover shadow-md hover:shadow-lg",
                outline:
                    "border-2 border-white/10 bg-transparent hover:bg-gray-500/10 text-black hover:text-black",
                secondary:
                    "bg-surface-input text-text-secondary hover:bg-surface-input-hover hover:text-white",
                ghost: "hover:bg-white/5 text-text-secondary hover:text-white",
                link: "text-brand-primary-hover underline-offset-4 hover:underline",
                success:
                    "bg-success text-white hover:bg-success-hover shadow-md hover:shadow-lg",
                warning:
                    "bg-warning text-white hover:bg-warning-hover shadow-md hover:shadow-lg",
                info: "bg-info text-white hover:bg-info-hover shadow-md hover:shadow-lg",
                soft: "bg-brand-primary-100 text-brand-primary-hover hover:bg-brand-primary-200",
                "soft-destructive":
                    "bg-danger/10 text-danger hover:bg-danger/20",
                "soft-success":
                    "bg-success/10 text-success hover:bg-success/20",
                "soft-warning":
                    "bg-warning/10 text-warning hover:bg-warning/20",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-lg px-3 text-xs",
                lg: "h-12 rounded-xl px-8 text-base",
                xl: "h-14 rounded-2xl px-10 text-lg",
                icon: "h-10 w-10",
                "icon-sm": "h-8 w-8 rounded-lg",
                "icon-lg": "h-12 w-12 rounded-xl",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

const Button = React.forwardRef(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    },
);

Button.displayName = "Button";

export { Button, buttonVariants };
