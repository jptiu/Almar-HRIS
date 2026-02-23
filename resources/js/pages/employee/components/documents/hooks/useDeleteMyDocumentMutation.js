import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMyDocument } from "../api";
import toast from "react-hot-toast";

export const useDeleteMyDocumentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId) => deleteMyDocument(documentId),
    onSuccess: () => {
      toast.success("Document deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["myDocuments"] });
    },
    onError: () => {
      toast.error("Failed to delete document.");
    },
  });
};
