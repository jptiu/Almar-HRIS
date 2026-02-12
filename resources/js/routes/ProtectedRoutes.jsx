// ProtectedRoutes.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores";

export function ProtectedRoutes() {
    const user = useAuthStore((state) => state.user);
    const isLoading = useAuthStore((state) => state.isLoading);

    // Wait until auth initialization is done
    if (isLoading) return null; // or full screen loader

    // Not authenticated
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // Authenticated
    return <Outlet />;
}