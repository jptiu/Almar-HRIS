import axiosInstance from "@/services/axiosInstance";

export const downloadMyDocument = async (documentId) => {
  const response = await axiosInstance.get(
    `/me/documents/${documentId}/download`,
    { responseType: "blob" },
  );

  return response;
};
