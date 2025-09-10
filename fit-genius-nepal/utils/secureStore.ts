import * as SecureStore from "expo-secure-store";
import { AuthTokens, User } from "../types/api";

const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user_data";
const USER_ID_KEY = "user_id";

// Token operations
export const saveToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const getToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const removeToken = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};

export const saveRefreshToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
};

export const getRefreshToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
};

export const removeRefreshToken = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
};

// User ID operations
export const saveUserId = async (userId: string): Promise<void> => {
  await SecureStore.setItemAsync(USER_ID_KEY, userId);
};

export const getUserId = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(USER_ID_KEY);
};

export const removeUserId = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(USER_ID_KEY);
};

// User data operations
export const saveUser = async (user: User): Promise<void> => {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
};

export const getUser = async (): Promise<User | null> => {
  const user = await SecureStore.getItemAsync(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const removeUser = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(USER_KEY);
};

// Combined operations
export const saveAuthData = async (
  tokens: AuthTokens,
  userId: string,
  user?: User
): Promise<void> => {
  await Promise.all([
    saveToken(tokens.accessToken),
    saveRefreshToken(tokens.refreshToken),
    saveUserId(userId),
    ...(user ? [saveUser(user)] : []),
  ]);
};

export const getAuthData = async (): Promise<{
  tokens: AuthTokens | null;
  userId: string | null;
  user: User | null;
}> => {
  const [accessToken, refreshToken, userId, user] = await Promise.all([
    getToken(),
    getRefreshToken(),
    getUserId(),
    getUser(),
  ]);

  return {
    tokens: accessToken && refreshToken ? { accessToken, refreshToken } : null,
    userId,
    user,
  };
};

export const clearAuthData = async (): Promise<void> => {
  await Promise.all([
    removeToken(),
    removeRefreshToken(),
    removeUserId(),
    removeUser(),
  ]);
};
