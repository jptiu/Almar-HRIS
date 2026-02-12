// resources/js/services/authService.js
import axiosInstance from "./axiosInstance";

export const loginApi = async (payload) => {
  const { data } = await axiosInstance.post("/login", payload);
  return data;
};