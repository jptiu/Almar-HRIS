import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { storeMyDocument } from "../api";

const INVALID_FILE_TYPE_MESSAGE =
  "The file must be a PDF, JPG, PNG, or Word document.";

const getErrorMessage = (error) => {
  const responseMessage = error?.response?.data?.message;
  const fileErrors = error?.response?.data?.errors?.file;
  const firstFileError = Array.isArray(fileErrors) ? fileErrors[0] : "";

  const hasInvalidTypeError =
    typeof firstFileError === "string" &&
    (firstFileError.toLowerCase().includes("must be a file of type") ||
      firstFileError.toLowerCase().includes("word document"));

  if (hasInvalidTypeError) {
    return INVALID_FILE_TYPE_MESSAGE;
  }

  return (
    responseMessage ||
    firstFileError ||
    error?.message ||
    "Failed to upload document."
  );
};

export const useStoreMyDocumentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => storeMyDocument(payload),
    onSuccess: () => {
      toast.success("Document uploaded successfully.");
      queryClient.invalidateQueries({ queryKey: ["myDocuments"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
