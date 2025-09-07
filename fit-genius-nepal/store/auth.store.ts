// store/auth.store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../utils/api";
import {
  saveToken,
  saveRefreshToken,
  saveUser,
  clearAuthData,
  getToken,
  getUser,
} from "../utils/secureStore";
import { router } from "expo-router";

interface AuthState {
  user: any | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ success: boolean; error?: string }>;
  googleLogin: (
    accessToken: string
  ) => Promise<{ success: boolean; error?: string }>;
  verifyCode: (code: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await api.post("/auth/login", { email, password });

          if (response.ok) {
            const data = await response.json();

            // Save tokens to secure storage
            await saveToken(data.token);
            await saveRefreshToken(data.refreshToken);
            await saveUser(data.user);

            // Update state
            set({
              user: data.user,
              token: data.token,
              isAuthenticated: true,
              isLoading: false,
            });

            // Redirect to home
            router.replace("/(tabs)/home");

            return { success: true };
          } else {
            const error = await response.text();
            set({ isLoading: false });
            return { success: false, error };
          }
        } catch (error: any) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
      },

      register: async (email, password, name) => {
        set({ isLoading: true });
        try {
          const response = await api.post("/auth/register", {
            email,
            password,
            name,
          });

          if (response.ok) {
            // After registration, user needs to verify code
            set({ isLoading: false });
            router.replace("/(auth)/verify-code");
            return { success: true };
          } else {
            const error = await response.text();
            set({ isLoading: false });
            return { success: false, error };
          }
        } catch (error: any) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
      },

      googleLogin: async (accessToken) => {
        set({ isLoading: true });
        try {
          const response = await api.post("/auth/google", { accessToken });

          if (response.ok) {
            const data = await response.json();

            // Save tokens to secure storage
            await saveToken(data.token);
            await saveRefreshToken(data.refreshToken);
            await saveUser(data.user);

            // Update state
            set({
              user: data.user,
              token: data.token,
              isAuthenticated: true,
              isLoading: false,
            });

            // Redirect to home
            router.replace("/(tabs)/home");

            return { success: true };
          } else {
            const error = await response.text();
            set({ isLoading: false });
            return { success: false, error };
          }
        } catch (error: any) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
      },

      verifyCode: async (code) => {
        set({ isLoading: true });
        try {
          const response = await api.post("/auth/verify", { code });

          if (response.ok) {
            const data = await response.json();

            // Save tokens to secure storage
            await saveToken(data.token);
            await saveRefreshToken(data.refreshToken);
            await saveUser(data.user);

            // Update state
            set({
              user: data.user,
              token: data.token,
              isAuthenticated: true,
              isLoading: false,
            });

            // Redirect to home
            router.replace("/(tabs)/home");

            return { success: true };
          } else {
            const error = await response.text();
            set({ isLoading: false });
            return { success: false, error };
          }
        } catch (error: any) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
      },

      logout: async () => {
        // Clear secure storage
        await clearAuthData();

        // Reset state
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });

        // Redirect to login
        router.replace("/(auth)/login");
      },

      checkAuth: async () => {
        const token = await getToken();
        if (token) {
          try {
            // Verify token with backend
            const response = await api.get("/auth/verify");
            if (response.ok) {
              const user = await getUser();
              set({ user, token, isAuthenticated: true });
              return true;
            }
          } catch (error) {
            // Token is invalid, logout
            await get().logout();
            return false;
          }
        }
        return false;
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
