import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { router } from "expo-router";
import {
  saveAuthData,
  getToken,
  getRefreshToken,
  clearAuthData,
  saveToken,
  saveRefreshToken,
  saveUserId,
} from "../utils/secureStore";
import {
  ApiResponse,
  AuthTokens,
  User,
  RegisterRequest,
  LoginRequest,
  RefreshTokenResponse,
  ApiError,
  RegisterResponse,
  LoginResponse,
} from "../types/api";

const API_BASE_URL = "http://192.168.1.2:5000/api/v1"; // Replace with your API URL

class ApiClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: string | null) => void;
    reject: (error: any) => void;
  }> = [];

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      async (config: AxiosRequestConfig | any) => {
        const token = await getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (!this.isRefreshing) {
            this.isRefreshing = true;

            try {
              const refreshToken = await getRefreshToken();
              if (!refreshToken) {
                throw new Error("No refresh token available");
              }

              const response = await axios.post<
                ApiResponse<RefreshTokenResponse>
              >(`${API_BASE_URL}/auth/refresh`, { refreshToken });

              const { tokens } = response.data.data;

              await saveToken(tokens.accessToken);
              await saveRefreshToken(tokens.refreshToken);

              this.isRefreshing = false;
              this.processQueue(null, tokens.accessToken);

              // Retry original request
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
              }
              return this.instance(originalRequest);
            } catch (refreshError) {
              this.isRefreshing = false;
              this.processQueue(refreshError, null);
              await clearAuthData();
              router.replace("/(auth)/login");
              return Promise.reject(refreshError);
            }
          } else {
            // Add request to queue
            return new Promise<string | null>((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                if (token && originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return this.instance(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: any, token: string | null = null): void {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  // Auth methods
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await this.instance.post<ApiResponse<RegisterResponse>>(
      "/auth/register",
      data
    );

    const { userId, tokens } = response.data.data;
    await saveAuthData(tokens, userId);

    return response.data;
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await this.instance.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      data
    );

    const { userId, tokens, user } = response.data.data;
    await saveAuthData(tokens, userId, user);

    return response.data.data;
  }

  async logout(): Promise<void> {
    try {
      await this.instance.post("/auth/logout");
    } catch (error) {
      console.warn("Logout API call failed, but clearing local data anyway");
    } finally {
      await clearAuthData();
    }
  }

  async verifyEmail(code: string): Promise<void> {
    const response = await this.instance.post<ApiResponse<void>>(
      "/auth/verify-email",
      { code }
    );
    // Handle verification response if needed
  }

  // Generic HTTP methods with type safety
  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<ApiResponse<T>>(endpoint, config);
    return response.data.data;
  }

  async post<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.post<ApiResponse<T>>(
      endpoint,
      data,
      config
    );
    return response.data.data;
  }

  async put<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.put<ApiResponse<T>>(
      endpoint,
      data,
      config
    );
    return response.data.data;
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<ApiResponse<T>>(
      endpoint,
      config
    );
    return response.data.data;
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const token = await getToken();
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    const response = await this.instance.post<ApiResponse<T>>(
      endpoint,
      formData,
      config
    );
    return response.data.data;
  }
}

export const api = new ApiClient();
