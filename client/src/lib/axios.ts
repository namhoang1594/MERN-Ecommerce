import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// ✅ Tạo instance
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // để gửi cookie (refreshToken)
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;
