export interface ApiResponse<T = any> {
  status: number;
  message: string;
  data: T;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  // Add other user properties as needed
}

export interface RegisterResponse {
  userId: string;
  tokens: AuthTokens;
}

export interface LoginResponse {
  userId: string;
  tokens: AuthTokens;
  user?: User; // Optional if user data is included in login response
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  // Add other registration fields as needed
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  tokens: AuthTokens;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  errors?: Record<string, string[]>;
}
