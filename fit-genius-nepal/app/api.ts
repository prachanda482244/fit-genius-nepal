// services/api.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Use your computer's IP address (same as your Expo app)
const API_URL = "http://192.168.1.2:5000/api/v1";

console.log("API Base URL:", API_URL); // Debugging

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000, // 15 second timeout
  withCredentials: true,
});

// // Request interceptor
// api.interceptors.request.use(
//   async (config) => {
//     try {
//       const token = await AsyncStorage.getItem("accessToken");
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       console.log("API Request:", config.method?.toUpperCase(), config.url);
//       return config;
//     } catch (error) {
//       console.error("Error getting token from storage:", error);
//       return config;
//     }
//   },
//   (error) => {
//     console.error("Request interceptor error:", error);
//     return Promise.reject(error);
//   }
// );

// Response interceptor
// api.interceptors.response.use(
//   (response) => {
//     console.log("API Response:", response.status, response.config.url);
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;

//     console.log("API Error:", error.response?.status, error.config.url);

//     // Handle token refresh
//     if (
//       (error.response?.status === 401 || error.response?.status === 403) &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;

//       try {
//         const refreshToken = await AsyncStorage.getItem("refreshToken");
//         if (!refreshToken) {
//           throw new Error("No refresh token available");
//         }

//         // Call refresh endpoint
//         const response = await axios.post(`${API_URL}/auth/refresh-token`, {
//           refreshToken,
//         });

//         const newAccessToken = response.data.accessToken;
//         await AsyncStorage.setItem("accessToken", newAccessToken);

//         // Retry original request with new token
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return api(originalRequest);
//       } catch (refreshError) {
//         console.error("Refresh token failed:", refreshError);
//         await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
//         // You can redirect to login screen here if needed
//       }
//     }

//     // Network error handling
//     if (error.code === "ECONNREFUSED" || error.message === "Network Error") {
//       error.message = `Cannot connect to server. Please check:\n\n1. Backend is running on port 5000\n2. Correct IP address: ${API_URL}\n3. Same WiFi network`;
//     }

//     return Promise.reject(error);
//   }
// );

export default api;
