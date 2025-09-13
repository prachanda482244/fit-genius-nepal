import { create } from "zustand";
import { User } from "../types";
import { secureStore } from "../utils/secureStore";
import { storage } from "../utils/storage";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  setAuth: (
    user: User | null,
    accessToken: string,
    refreshToken: string
  ) => Promise<void>;
  clearAuth: () => Promise<void>;
  setLoading: (v: boolean) => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: true,
  setAuth: async (user, accessToken, refreshToken) => {
    // update in-memory
    set({ user, accessToken, refreshToken });
    try {
      if (refreshToken) await secureStore.setRefreshToken(refreshToken);
      if (accessToken) await secureStore.setAccessToken(accessToken);
      if (user) await storage.setItem("user", JSON.stringify(user));
    } catch (err) {
      console.warn("Failed to persist auth", err);
    }
  },
  clearAuth: async () => {
    set({ user: null, accessToken: null, refreshToken: null });
    try {
      await secureStore.clearAll();
      await storage.removeItem("user");
    } catch (err) {
      console.warn("Failed to clear secure storage", err);
    }
  },
  setLoading: (v) => set({ loading: v }),
}));

// helper bootstrap function
export async function bootstrapAuthFromStorage() {
  const authStore = useAuthStore.getState();
  try {
    const access = await secureStore.getAccessToken();
    const refresh = await secureStore.getRefreshToken();
    const userJson = await storage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;

    if (access || refresh) {
      // set what's available immediately; we may refresh later in axios if needed
      await authStore.setAuth(user, access ?? "", refresh ?? "");
    } else {
      // no tokens
      // ensure store is clean
      await authStore.clearAuth();
    }
  } catch (err) {
    console.warn("bootstrapAuth error", err);
    await authStore.clearAuth();
  } finally {
    authStore.setLoading(false);
  }
}
