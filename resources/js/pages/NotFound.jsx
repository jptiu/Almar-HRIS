// resources/js/pages/NotFound.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FileQuestion, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";

const NotFound = () => {
    const navigate = useNavigate();
    const { isAuthenticated, role } = useAuth();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        // Countdown timer
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleRedirect();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleRedirect = () => {
        if (isAuthenticated && role) {
            navigate(`/${role}/dashboard`, { replace: true });
        } else {
            navigate("/", { replace: true });
        }
    };

    const getRedirectPath = () => {
        if (isAuthenticated && role) {
            return `${role} dashboard`;
        }
        return "home page";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[var(--color-brand-primary-dark)] via-[var(--color-brand-primary-dark)] to-[var(--color-brand-primary)] flex items-center justify-center p-6">
            <div className="glass-container rounded-lg p-8 max-w-md w-full text-center">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--color-warning)]/20 mb-6">
                    <FileQuestion className="w-10 h-10 text-[var(--color-warning)]" />
                </div>

                {/* Title */}
                <h1 className="text-6xl font-bold text-text-primary mb-4">
                    404
                </h1>
                <h2 className="text-2xl font-semibold text-text-primary mb-2">
                    Page Not Found
                </h2>

                {/* Message */}
                <p className="text-[var(--color-text-secondary)] mb-6">
                    Sorry, the page you're looking for doesn't exist or has been
                    moved.
                </p>

                {/* Countdown */}
                <div className="bg-[var(--color-surface-card)] rounded-lg p-4 mb-6">
                    <p className="text-[var(--color-text-tertiary)] text-sm mb-2">
                        Redirecting to {getRedirectPath()} in
                    </p>
                    <p className="text-3xl font-bold text-[var(--color-brand-primary)]">
                        {countdown}
                    </p>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <Button
                        variant="primary"
                        className="w-full"
                        onClick={handleRedirect}
                    >
                        Go Now
                        <ArrowRight className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
