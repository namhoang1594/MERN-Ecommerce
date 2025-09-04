import axiosInstance from "./axios";
import { store } from "../store/store";
import { clearAuthState, logoutUser, refreshToken, setAccessToken } from "@/store/auth-slice";

// ✅ Setup interceptors sau khi store đã sẵn sàng
let isInterceptorsSetup = false;

export const setupAxiosInterceptors = () => {
    if (isInterceptorsSetup) return;

    // Request interceptor
    axiosInstance.interceptors.request.use(
        (config) => {
            const token = store.getState().auth.accessToken;
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response interceptor
    let isRefreshing = false;
    let failedQueue: {
        resolve: (value?: unknown) => void;
        reject: (error: unknown) => void;
    }[] = [];

    const processQueue = (error: unknown, token: string | null = null) => {
        failedQueue.forEach((prom) => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(token);
            }
        });
        failedQueue = [];
    };

    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            originalRequest.headers["Authorization"] = `Bearer ${token}`;
                            return axiosInstance(originalRequest);
                        })
                        .catch((err) => Promise.reject(err));
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const res = await store.dispatch(refreshToken()).unwrap();
                    store.dispatch(setAccessToken(res.accessToken));

                    processQueue(null, res.accessToken);
                    isRefreshing = false;

                    originalRequest.headers["Authorization"] = `Bearer ${res.accessToken}`;
                    return axiosInstance(originalRequest);
                } catch (err) {
                    processQueue(err, null);
                    isRefreshing = false;

                    // store.dispatch(logoutUser());
                    store.dispatch(clearAuthState());
                    window.location.href = '/auth/login';
                    return Promise.reject(err);
                }
            }

            return Promise.reject(error);
        }
    );

    isInterceptorsSetup = true;
};