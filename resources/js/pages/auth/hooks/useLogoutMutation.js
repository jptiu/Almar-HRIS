import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { logoutApi } from "@/services/authService";
import { useAuthStore } from "@/stores";

export function useLogoutMutation({ onSuccess } = {}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutApi,

    onSuccess: () => {
      useAuthStore.getState().clearUser();

      queryClient.clear();

      toast.success("Signed out successfully");

      onSuccess?.();

      navigate("/login", { replace: true });
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to sign out. Please try again.";
      toast.error(message);
    },
  });
}
