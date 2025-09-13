import { Ionicons } from "@expo/vector-icons";

export interface Exercise {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  sets: number;
  reps: number;
  weight: number;
}

export interface WorkoutSection {
  _id: string;
  name: string;
  description?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  isPublic?: boolean;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  isDefault?: boolean;
  days: {
    [day: string]: string[]; // Array of workout section IDs
  };
}

export interface CreateScheduleForm {
  name: string;
  description: string;
  selectedDays: string[];
}
