// utils/api.ts
import { clearAuthData, getToken, saveToken } from "./secureStore";
import { router } from "expo-router";

const API_BASE_URL = "https://your-api.com"; // Replace with your API URL

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = await getToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle token expiration
    if (response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshToken = await getRefreshToken();
          if (!refreshToken) {
            throw new Error("No refresh token available");
          }

          const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshResponse.ok) {
            const { token: newToken, refreshToken: newRefreshToken } =
              await refreshResponse.json();
            await saveToken(newToken);
            await saveRefreshToken(newRefreshToken);
            isRefreshing = false;
            processQueue(null, newToken);
            return this.request(endpoint, options); // Retry original request
          } else {
            throw new Error("Token refresh failed");
          }
        } catch (error) {
          isRefreshing = false;
          processQueue(error, null);
          await clearAuthData();
          router.replace("/(auth)/login");
          throw error;
        }
      } else {
        // Add request to queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token) {
              headers.Authorization = `Bearer ${token}`;
              return fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers,
              });
            }
          })
          .catch((error) => {
            throw error;
          });
      }
    }

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response;
  },

  async get(endpoint: string) {
    return this.request(endpoint);
  },

  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async delete(endpoint: string) {
    return this.request(endpoint, {
      method: "DELETE",
    });
  },

  async upload(endpoint: string, formData: FormData) {
    const token = await getToken();
    const headers: HeadersInit = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
    });
  },
};
