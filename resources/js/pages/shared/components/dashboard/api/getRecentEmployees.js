import axiosInstance from "@/services/axiosInstance";

export const getRecentEmployees = async () => {
  const { data } = await axiosInstance.get("/dashboard/recent-hires");

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch employee data");
  }

  return data.data;
}