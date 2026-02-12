import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import LoadingSpinner from "./LoadingSpinner";

const AppLoader = ({ children }) => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const isLoading = useAuthStore((state) => state.isLoading);
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

  // Show loading spinner only during initial auth check
  if (isLoading && !hasInitialized) {
    return <LoadingSpinner />;
  }

  return children;
};

export default AppLoader;
