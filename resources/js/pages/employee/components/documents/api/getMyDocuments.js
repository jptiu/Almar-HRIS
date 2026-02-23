import axiosInstance from "@/services/axiosInstance";
export const getMyDocuments = async (
  page = 1,
  perPage = 10,
  { search, document_type_id } = {},
  signal,
) => {
  const params = { page, per_page: perPage };

  if (search) params.search = search;
  if (document_type_id) params.document_type_id = document_type_id;

  const { data } = await axiosInstance.get("/me/documents", { params, signal });

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch documents");
  }

  return data.data;
};
