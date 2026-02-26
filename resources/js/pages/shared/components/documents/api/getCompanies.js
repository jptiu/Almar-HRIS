import axiosInstance from "@/services/axiosInstance";

export const getCompanies = async (signal) => {
  const { data } = await axiosInstance.get("/companies", { signal });

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch companies");
  }

  return data.data;
};
