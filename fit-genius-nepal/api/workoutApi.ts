import { handleApiError } from "@/utils/errorResponse";
import api from "./axiosClient";

const API_BASE = process.env.EXPO_PUBLIC_BASE_URL;

interface CreateWorkoutPayload {
  name: string;
  description?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  isPublic?: boolean;
}
export const createWorkout = async (payload: CreateWorkoutPayload) => {
  try {
    const { data } = await api.post(`${API_BASE}/workout`, payload);

    return data?.data;
  } catch (error) {
    handleApiError(error);
  }
};
export const getWorkouts = async () => {
  try {
    const { data } = await api.get(`${API_BASE}/workout`);
    console.log(data, "get wokrouts");
    return data?.data;
  } catch (error) {}
};
