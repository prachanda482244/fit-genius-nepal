import axios from "axios";
import { useAuthStore } from "../store/auth.store";
import { secureStore } from "../utils/secureStore";

const API_BASE = process.env.EXPO_PUBLIC_BASE_URL;

const api = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
  // withCredentials: true, // Important for browser cookie persistence
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with improved token refresh logic
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Handle token refresh
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const refreshToken = await secureStore.getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(`${API_BASE}/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        const currentUser = useAuthStore.getState().user;

        await useAuthStore
          .getState()
          .setAuth(currentUser, accessToken, newRefreshToken);

        onRefreshed(accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        await useAuthStore.getState().clearAuth();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    } else {
      // Wait for the ongoing refresh to complete
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }
  }
);

export default api;
