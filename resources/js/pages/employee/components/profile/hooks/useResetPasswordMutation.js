import { useMutation } from "@tanstack/react-query";
import { resetPasswordApi } from "../services/profileApi";

// Hook to reset password
// Uses React Query for mutation handling
export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: resetPasswordApi,
  });
};
