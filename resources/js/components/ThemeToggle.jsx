// resources/js/components/ThemeToggle.jsx
import { Sun, Moon } from "lucide-react";
import useUIStore from "../stores/uiStore";

const ThemeToggle = () => {
    const theme = useUIStore((state) => state.theme);
    const toggleTheme = useUIStore((state) => state.toggleTheme);

    return (
        <button
            onClick={toggleTheme}
            className="p-2 hover:bg-(--color-brand-primary-100) rounded-lg transition-colors"
            aria-label="Toggle theme"
        >
            {theme === "dark" ? (
                <Sun className="w-5 h-5 text-text-primary" />
            ) : (
                <Moon className="w-5 h-5 text-text-primary" />
            )}
        </button>
    );
};

export default ThemeToggle;
