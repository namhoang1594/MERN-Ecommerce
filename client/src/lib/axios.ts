// lib/axios.ts
import axios from "axios";

// Tùy chọn: lấy token từ localStorage nếu có
const getToken = (): string | null => {
    return localStorage.getItem("token"); // hoặc "adminToken", tùy hệ thống
};

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api", // nên để vào .env
    withCredentials: true, // nếu BE dùng cookie
    headers: {
        "Content-Type": "application/json",
    },
});

// Gắn token vào mỗi request nếu có
axiosInstance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Xử lý lỗi toàn cục
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Ví dụ: Tự động redirect khi 401
        if (error.response?.status === 401) {
            console.warn("Unauthorized - redirecting to login...");
            // window.location.href = "/login"; // hoặc dispatch logout
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
