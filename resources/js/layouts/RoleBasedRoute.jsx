// resources/js/layouts/RoleBasedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LoadingOverlay } from "../components/LoadingSpinner";

const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, role, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingOverlay message="Verifying access..." />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        return <Navigate to={`/${role}/dashboard`} replace />;
    }

    return children;
};

export default RoleBasedRoute;
