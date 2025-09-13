import { handleApiError } from "@/utils/errorResponse";
import api from "./axiosClient";

export const createSchedule = async (schedule: {
  name: string;
  description?: string;
  days: { day: string; workouts: string[] }[];
}) => {
  try {
    const { data } = await api.post("/schedule", schedule);
    console.log(data, "schduel");
    return data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateSchedule = async (
  id: string,
  schedule: {
    name: string;
    description?: string;
    days: { day: string; workouts: string[] }[];
  }
) => {
  try {
    const { data } = await api.put(`/schedule/${id}`, schedule);
    return data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getSchedules = async () => {
  try {
    const { data } = await api.get("/schedule");
    console.log(data, "get schdule");
    return data?.data;
  } catch (error) {
    handleApiError(error);
  }
};
