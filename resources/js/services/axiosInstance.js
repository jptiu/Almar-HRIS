// services/axiosInstance.js
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true, // <-- sends laravel-session cookie
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: handle 401 globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
