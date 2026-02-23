import axiosInstance from "@/services/axiosInstance";

export const storeMyDocument = async ({ description, document_type_id, file }) => {
  const formData = new FormData();
  formData.append("description", description ?? "");
  formData.append("document_type_id", document_type_id);
  formData.append("file", file);

  const { data } = await axiosInstance.post("/me/documents", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (!data.success) {
    throw new Error(data.message || "Failed to upload document");
  }

  return data.data;
};
