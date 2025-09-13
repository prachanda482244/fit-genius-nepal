import { Ionicons } from "@expo/vector-icons";

export enum EquipmentType {
  Barbell = "barbell",
  Dumbbell = "dumbbell",
  Machine = "machine",
  Bodyweight = "bodyweight",
  Kettlebell = "kettlebell",
  Bands = "bands",
  Other = "other",
}

export interface Exercise {
  _id: string;
  name: string;
  icon?: keyof typeof Ionicons.glyphMap;
  description?: string;
  isPublic?: boolean;
  equipment?: EquipmentType;
  imageUrl?: string | null;
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
  _id: string;
  name: string;
  description: string;
  isDefault?: boolean;
  days: {
    day: string;
    workouts: string[];
  }[];
}

export interface CreateScheduleForm {
  name: string;
  description: string;
  selectedDays: string[];
}
