import { handleApiError } from "@/utils/errorResponse";
import axios from "axios";
import { useAuthStore } from "../store/auth.store";
import api from "./axiosClient";

const API_BASE = process.env.EXPO_PUBLIC_BASE_URL; // change if needed

// Helper: normalize error messages

export async function login(payload: { email: string; password: string }) {
  try {
    const { data } = await axios.post(`${API_BASE}/auth/login`, payload);
    const { user } = data?.data;
    const { accessToken, refreshToken } = data?.data?.tokens;
    console.log({ user, accessToken, refreshToken });
    useAuthStore.getState().setAuth(user, accessToken, refreshToken);
    return user;
  } catch (error) {
    handleApiError(error);
  }
}
export async function register(payload: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const { data } = await axios.post(`${API_BASE}/auth/register`, payload);
    const { user, accessToken, refreshToken } = data?.data;
    await useAuthStore.getState().setAuth(user, accessToken, refreshToken);
    return user;
  } catch (error) {
    handleApiError(error);
  }
}

export async function logout() {
  try {
    await api.post("/auth/logout"); // optional, may fail
  } catch (error) {
    console.log("⚠️ Logout API failed (ignored):", error);
  } finally {
    await useAuthStore.getState().clearAuth();
  }
}

export async function getMe() {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function verifyCode(payload: { email: string; code: string }) {
  try {
    const { data } = await axios.post(`${API_BASE}/auth/verify-email`, payload);
    console.log("📩 verifyCode response", data);
    return data;
  } catch (error) {
    handleApiError(error);
  }
}
