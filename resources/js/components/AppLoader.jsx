import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const AppLoader = ({ children }) => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const location = useLocation();
  const navigate = useNavigate();

  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      await initializeAuth();
      if (mounted) {
        setHasInitialized(true);
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, [initializeAuth]);

  // ✅ Redirect logic AFTER auth initialized
  useEffect(() => {
    if (!hasInitialized) return;
    if (!isAuthenticated) return;

    // Only redirect if user is at base domain "/"
    if (location.pathname === "/") {
      const role = user?.primaryRole;

      if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (role === "manager") {
        navigate("/hr/dashboard", { replace: true });
      } else if (role === "employee") {
        navigate("/employee/dashboard", { replace: true });
      }
    }
  }, [hasInitialized, isAuthenticated, user, location.pathname, navigate]);

  if (isLoading && !hasInitialized) {
    return <LoadingSpinner />;
  }

  return children;
};

export default AppLoader;