import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { switchRoleApi } from "@/services/authService";
import { useAuthStore } from "@/stores";

export function useSwitchRoleMutation({ onSuccess } = {}) {
  return useMutation({
    mutationFn: switchRoleApi,

    onSuccess: (data) => {
      const newActiveRole = data.data?.active_role;

      useAuthStore.getState().setUser({
        ...useAuthStore.getState().user,
        active_role: newActiveRole,
      });

      toast.success(`Switched to ${newActiveRole} role`);

      onSuccess?.(newActiveRole);
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to switch role. Please try again.";
      toast.error(message);
    },
  });
}
