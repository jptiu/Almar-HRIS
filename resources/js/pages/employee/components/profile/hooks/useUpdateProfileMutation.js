import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePersonalInfoApi } from "../services/profileApi";
import { PROFILE_QUERY_KEY } from "./useFetchProfileQuery";
import toast from "react-hot-toast";
import { useAuthStore } from "@/stores";

// Hook to update personal information
// Uses React Query for mutation and cache invalidation
export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  const updateUserProfile = useAuthStore((state) => state.updateUserProfile);

  return useMutation({
    mutationFn: updatePersonalInfoApi,
    onSuccess: (data) => {
      updateUserProfile(data);

      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      toast.success("Profile updated successfully!");
      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
};
