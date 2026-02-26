import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateMyDocument } from "../api";

export const useUpdateMyDocumentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => updateMyDocument(payload),
    onSuccess: () => {
      toast.success("Document updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["myDocuments"] });
      queryClient.invalidateQueries({ queryKey: ["myDocumentTypes"] });
      queryClient.invalidateQueries({ queryKey: ["myDocumentTypeFiles"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update document.");
    },
  });
};
