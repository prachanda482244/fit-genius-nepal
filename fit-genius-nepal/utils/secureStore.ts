// src/utils/secureStore.ts
import * as SecureStore from "expo-secure-store";

const ACCESS_KEY = "ACCESS_TOKEN";
const REFRESH_KEY = "REFRESH_TOKEN";

export const secureStore = {
  async setAccessToken(token: string) {
    await SecureStore.setItemAsync(ACCESS_KEY, token, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED,
    });
  },
  async getAccessToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(ACCESS_KEY);
  },
  async deleteAccessToken() {
    await SecureStore.deleteItemAsync(ACCESS_KEY);
  },

  async setRefreshToken(token: string) {
    await SecureStore.setItemAsync(REFRESH_KEY, token, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED,
    });
  },
  async getRefreshToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(REFRESH_KEY);
  },
  async deleteRefreshToken() {
    await SecureStore.deleteItemAsync(REFRESH_KEY);
  },

  // convenience
  async clearAll() {
    await this.deleteAccessToken();
    await this.deleteRefreshToken();
  },
};
