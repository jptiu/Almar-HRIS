import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { loginApi } from "@/services/authService";
import { useAuthStore } from "@/stores";

export function useLoginMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: loginApi,

    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.message || "Login failed");
        return;
      }

      const user = response.data;
      setUser(user);

      queryClient.invalidateQueries({ queryKey: ["me"] });

      toast.success("Login successful");
      redirectByRole(user.active_role, navigate);
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message || "Something went wrong";
      toast.error(message);
    },
  });
}

function redirectByRole(role, navigate) {
  switch (role) {
    case "admin":
      navigate("/admin/dashboard", { replace: true });
      break;
    case "manager":
      navigate("/hr/dashboard", { replace: true });
      break;
    default:
      navigate("/employee/dashboard", { replace: true });
  }
}