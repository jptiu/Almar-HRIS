import axiosInstance from "@/services/axiosInstance";

export const getDocumentTypes = async () => {
  const { data } = await axiosInstance.get("/document-types");

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch document types");
  }

  return data.data;
};
