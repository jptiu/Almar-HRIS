import axiosInstance from "@/services/axiosInstance";

export const getBranches = async (signal) => {
  const { data } = await axiosInstance.get("/branches", { signal });

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch branches");
  }

  return data.data;
};
