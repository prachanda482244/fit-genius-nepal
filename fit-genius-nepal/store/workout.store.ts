// store/workout.store.ts
import { create } from "zustand";
import { api } from "../utils/api";

interface Exercise {
  id: string;
  name: string;
  image: string;
  description: string;
  sets: number;
  reps: number;
  weight: number;
}

interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  createdAt: string;
}

interface WorkoutState {
  workouts: Workout[];
  currentWorkout: Workout | null;
  isLoading: boolean;
  error: string | null;
  fetchWorkouts: () => Promise<void>;
  createWorkout: (
    name: string
  ) => Promise<{ success: boolean; error?: string }>;
  addExercise: (
    workoutId: string,
    exercise: Omit<Exercise, "id">
  ) => Promise<{ success: boolean; error?: string }>;
  updateExercise: (
    workoutId: string,
    exerciseId: string,
    updates: Partial<Exercise>
  ) => Promise<{ success: boolean; error?: string }>;
  deleteWorkout: (
    workoutId: string
  ) => Promise<{ success: boolean; error?: string }>;
  setCurrentWorkout: (workout: Workout | null) => void;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  workouts: [],
  currentWorkout: null,
  isLoading: false,
  error: null,

  fetchWorkouts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/workouts");
      if (response.ok) {
        const workouts = await response.json();
        set({ workouts, isLoading: false });
      } else {
        set({ error: "Failed to fetch workouts", isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createWorkout: async (name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/workouts", { name });
      if (response.ok) {
        const newWorkout = await response.json();
        set((state) => ({
          workouts: [...state.workouts, newWorkout],
          isLoading: false,
        }));
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

  addExercise: async (workoutId, exercise) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(
        `/workouts/${workoutId}/exercises`,
        exercise
      );
      if (response.ok) {
        const updatedWorkout = await response.json();
        set((state) => ({
          workouts: state.workouts.map((w) =>
            w.id === workoutId ? updatedWorkout : w
          ),
          isLoading: false,
        }));
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

  updateExercise: async (workoutId, exerciseId, updates) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(
        `/workouts/${workoutId}/exercises/${exerciseId}`,
        updates
      );
      if (response.ok) {
        const updatedWorkout = await response.json();
        set((state) => ({
          workouts: state.workouts.map((w) =>
            w.id === workoutId ? updatedWorkout : w
          ),
          isLoading: false,
        }));
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

  deleteWorkout: async (workoutId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.delete(`/workouts/${workoutId}`);
      if (response.ok) {
        set((state) => ({
          workouts: state.workouts.filter((w) => w.id !== workoutId),
          isLoading: false,
        }));
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

  setCurrentWorkout: (workout) => {
    set({ currentWorkout: workout });
  },
}));
