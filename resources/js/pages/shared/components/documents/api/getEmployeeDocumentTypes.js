import axiosInstance from "@/services/axiosInstance";

export const getEmployeeDocumentTypes = async (employeeId, signal) => {
  if (!employeeId) {
    throw new Error("Employee ID is required");
  }

  const encodedEmployeeId = encodeURIComponent(employeeId);

  const { data } = await axiosInstance.get(
    `/employees/${encodedEmployeeId}/documents/types`,
    { signal },
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch employee document types");
  }

  return data.data;
};
