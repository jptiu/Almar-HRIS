import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores";

const roleDashboardMap = {
    admin: "/admin/dashboard",
    manager: "/hr/dashboard",
    employee: "/employee/dashboard",
};

export default function RoleBasedRoute({ allowedRoles }) {
    const { user, isLoading } = useAuthStore();

    if (isLoading) {
        return null; // or spinner
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    const activeRole = user.active_role;

    // If the user's active role is not in the allowed roles, redirect to their correct dashboard
    if (!allowedRoles.includes(activeRole)) {
        const redirectPath =
            roleDashboardMap[activeRole] || "/employee/dashboard";
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
}
