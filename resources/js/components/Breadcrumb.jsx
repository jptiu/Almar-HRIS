// resources/js/components/Breadcrumb.jsx
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import useUIStore from "../stores/uiStore";

const Breadcrumb = () => {
    const breadcrumbs = useUIStore((state) => state.breadcrumbs);

    if (!breadcrumbs || breadcrumbs.length === 0) return null;

    return (
        <nav className="flex items-center space-x-2 text-sm mb-6">
            <Link
                to="/"
                className="flex items-center text-text-tertiary hover:text-text-primary transition-colors"
            >
                <Home className="w-4 h-4" />
            </Link>

            {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <ChevronRight className="w-4 h-4 text-text-muted" />
                    {crumb.path ? (
                        <Link
                            to={crumb.path}
                            className="text-text-tertiary hover:text-text-primary transition-colors"
                        >
                            {crumb.label}
                        </Link>
                    ) : (
                        <span className="text-text-primary font-medium">
                            {crumb.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    );
};

export default Breadcrumb;
