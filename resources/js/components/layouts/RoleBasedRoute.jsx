import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores";

export default function RoleBasedRoute({ allowedRoles }) {
    const { user } = useAuthStore();

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}