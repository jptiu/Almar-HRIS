import axiosInstance from "@/services/axiosInstance";

export const getMyDocumentTypes = async (signal) => {
  const { data } = await axiosInstance.get("/me/documents/types", { signal });

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch document types");
  }

  return data.data;
};
