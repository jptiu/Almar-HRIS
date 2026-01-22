// resources/js/components/Tooltip.jsx
import { useState } from "react";
import { cn } from "../utils/cn";

const Tooltip = ({ children, content, position = "right" }) => {
    const [isVisible, setIsVisible] = useState(false);

    if (!content) return children;

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div
                    className={cn(
                        "absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg",
                        "whitespace-nowrap pointer-events-none",
                        "transition-opacity duration-200",
                        {
                            "left-full ml-2 top-1/2 -translate-y-1/2": position === "right",
                            "right-full mr-2 top-1/2 -translate-y-1/2": position === "left",
                            "bottom-full mb-2 left-1/2 -translate-x-1/2": position === "top",
                            "top-full mt-2 left-1/2 -translate-x-1/2": position === "bottom",
                        }
                    )}
                >
                    {content}
                    {/* Tooltip arrow */}
                    <div
                        className={cn(
                            "absolute w-2 h-2 bg-gray-900 rotate-45",
                            {
                                "-left-1 top-1/2 -translate-y-1/2": position === "right",
                                "-right-1 top-1/2 -translate-y-1/2": position === "left",
                                "-bottom-1 left-1/2 -translate-x-1/2": position === "top",
                                "-top-1 left-1/2 -translate-x-1/2": position === "bottom",
                            }
                        )}
                    />
                </div>
            )}
        </div>
    );
};

export default Tooltip;