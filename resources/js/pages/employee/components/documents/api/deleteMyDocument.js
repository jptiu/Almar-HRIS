import axiosInstance from "@/services/axiosInstance";

export const deleteMyDocument = async (documentId) => {
  const { data } = await axiosInstance.delete(`/me/documents/${documentId}`);

  if (!data.success) {
    throw new Error(data.message || "Failed to delete document");
  }

  return data.data;
};
