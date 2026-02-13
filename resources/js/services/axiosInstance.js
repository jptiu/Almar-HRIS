// services/axiosInstance.js
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

// Grab CSRF token from meta tag
const token = document
  .querySelector('meta[name="csrf-token"]')
  ?.getAttribute("content");

const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true, // sends laravel-session cookie
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    ...(token && { "X-CSRF-TOKEN": token }),
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