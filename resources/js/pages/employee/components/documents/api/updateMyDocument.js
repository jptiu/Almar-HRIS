import axiosInstance from "@/services/axiosInstance";

export const updateMyDocument = async ({
  document,
  description,
  document_type_id,
}) => {
  const { data } = await axiosInstance.put(`/me/documents/${document}`, {
    description: description ?? "",
    document_type_id,
  });

  if (!data.success) {
    throw new Error(data.message || "Failed to update document");
  }

  return data.data;
};
