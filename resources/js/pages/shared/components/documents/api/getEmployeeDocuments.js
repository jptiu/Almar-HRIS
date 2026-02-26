import axiosInstance from "@/services/axiosInstance";

export const getEmployeeDocuments = async (
  page = 1,
  perPage = 10,
  { search, company_id, branch_id } = {},
  signal,
) => {
  const params = { page, per_page: perPage };

  if (search) params.search = search;
  if (company_id) params.company_id = company_id;
  if (branch_id) params.branch_id = branch_id;

  const { data } = await axiosInstance.get("/employees/documents", {
    params,
    signal,
  });

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch employee documents");
  }

  return data.data;
};
