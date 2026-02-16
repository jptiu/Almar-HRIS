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

// Handle 401 globally — use clearUser() (state-only) instead of logout()
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearUser();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;