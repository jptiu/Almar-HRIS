import axiosInstance from "@/services/axiosInstance";

export const getEmployeeByDept = async () => {
  const { data } = await axiosInstance.get("/dashboard/employees-by-department");

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch employee data");
  }

  return data.data;
}