// resources/js/services/authService.js
import axiosInstance from "./axiosInstance";

export const loginApi = async (payload) => {
  const { data } = await axiosInstance.post("/login", payload);
  return data;
};

export const logoutApi = async () => {
  const { data } = await axiosInstance.post("/me/logout");
  return data;
};

export const switchRoleApi = async (role) => {
  const { data } = await axiosInstance.post("/me/switch-role", { role });
  return data;
};