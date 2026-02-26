import axiosInstance from "@/services/axiosInstance";

export const getMyDocumentsByType = async (documentType, signal) => {
  const encodedDocumentType = encodeURIComponent(documentType);

  const { data } = await axiosInstance.get(
    `/me/documents/types/${encodedDocumentType}`,
    { signal },
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch files for document type");
  }

  return data.data;
};
