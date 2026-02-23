import axiosInstance from "@/services/axiosInstance";

export const getBirthdays = async () => {
    const { data } = await axiosInstance.get("/dashboard/birthdays");

    if (!data.success) {
        throw new Error(data.message || "Failed to fetch birthdays");
    }

    return data.data;
};