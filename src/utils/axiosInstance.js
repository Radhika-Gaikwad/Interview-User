import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL || "https://34.54.116.200.nip.io/api",
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // ✅ required if you ever use cookies
});

// Attach Authorization header from localStorage token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
