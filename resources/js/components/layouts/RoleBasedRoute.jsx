import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores";

export default function RoleBasedRoute({ allowedRoles }) {
    const { user, isLoading } = useAuthStore();

    if (isLoading) {
        return null; // or spinner
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}
