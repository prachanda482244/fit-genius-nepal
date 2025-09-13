import { createWorkout } from "@/api/workoutApi";
import { WorkoutSection } from "@/types/workoutType";
import { showToast } from "@/utils/ShowToast";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface CreateWorkoutModalProps {
  visible: boolean;
  onClose: () => void;
  editingWorkoutId: string | null;
  workoutData: WorkoutSection[];
  setWorkoutData: React.Dispatch<React.SetStateAction<WorkoutSection[]>>;
  setEditingWorkoutId: React.Dispatch<React.SetStateAction<string | null>>;
}

const CreateWorkoutModal: React.FC<CreateWorkoutModalProps> = ({
  visible,
  onClose,
  editingWorkoutId,
  workoutData,
  setWorkoutData,
  setEditingWorkoutId,
}) => {
  const [newWorkoutName, setNewWorkoutName] = useState("");
  const [newWorkoutDescription, setNewWorkoutDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [difficulty, setDifficulty] = useState<
    "beginner" | "intermediate" | "advanced"
  >("intermediate");

  // Reset form when modal opens/closes
  useEffect(() => {
    if (visible) {
      if (editingWorkoutId) {
        // Editing existing workout
        const workout = workoutData.find((w) => w._id === editingWorkoutId);
        if (workout) {
          setNewWorkoutName(workout.name);
          setNewWorkoutDescription(workout.description || "");
          setIsPublic(workout.isPublic || false);
          setDifficulty(workout.difficulty || "intermediate");
        }
      } else {
        // Creating new workout
        setNewWorkoutName("");
        setNewWorkoutDescription("");
        setIsPublic(false);
        setDifficulty("intermediate");
      }
    }
  }, [visible, editingWorkoutId, workoutData]);

  // Function to add new workout section
  const handleAddWorkout = async () => {
    const workoutData = {
      name: newWorkoutName.trim(),
      description: newWorkoutDescription.trim(),
      isPublic,
      difficulty,
    };
    try {
      const data = await createWorkout(workoutData);
      if (data?.status === 201) {
        showToast(data?.message, "success", "Workout Create");
      }
    } catch (error: any) {
      showToast(error?.message, "error", "Failed");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white p-6 rounded-t-3xl max-h-3/4">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-xl font-bold text-gray-900">
                {editingWorkoutId ? "Edit Workout" : "Create New Workout"}
              </Text>
              <Pressable onPress={onClose} className="p-1">
                <Ionicons name="close" size={24} color="#6b7280" />
              </Pressable>
            </View>

            <Text className="text-gray-600 mb-4">
              {editingWorkoutId
                ? "Edit your workout details"
                : "Enter details for your new workout routine"}
            </Text>

            <TextInput
              placeholder="Workout name (e.g., Chest Day)"
              value={newWorkoutName}
              onChangeText={setNewWorkoutName}
              className="border border-gray-300 rounded-xl p-4 text-gray-800 mb-4"
              autoFocus={true}
            />

            <TextInput
              placeholder="Workout Description"
              value={newWorkoutDescription}
              onChangeText={setNewWorkoutDescription}
              className="border border-gray-300 rounded-xl p-4 text-gray-800 mb-4"
              multiline={true}
              numberOfLines={3}
            />

            <Text className="text-gray-700 font-medium mb-2">Difficulty</Text>
            <View className="flex-row justify-between mb-4">
              <Pressable
                onPress={() => setDifficulty("beginner")}
                className={`px-4 py-2 rounded-full ${difficulty === "beginner" ? "bg-blue-500" : "bg-gray-200"}`}
              >
                <Text
                  className={
                    difficulty === "beginner" ? "text-white" : "text-gray-700"
                  }
                >
                  Beginner
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setDifficulty("intermediate")}
                className={`px-4 py-2 rounded-full ${difficulty === "intermediate" ? "bg-blue-500" : "bg-gray-200"}`}
              >
                <Text
                  className={
                    difficulty === "intermediate"
                      ? "text-white"
                      : "text-gray-700"
                  }
                >
                  Intermediate
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setDifficulty("advanced")}
                className={`px-4 py-2 rounded-full ${difficulty === "advanced" ? "bg-blue-500" : "bg-gray-200"}`}
              >
                <Text
                  className={
                    difficulty === "advanced" ? "text-white" : "text-gray-700"
                  }
                >
                  Advanced
                </Text>
              </Pressable>
            </View>

            <View className="flex-row items-center mb-6">
              <Checkbox
                value={isPublic}
                onValueChange={setIsPublic}
                color={isPublic ? "#3b82f6" : undefined}
                className="mr-3"
              />
              <Text className="text-gray-700">Share this workout publicly</Text>
            </View>

            <View className="flex-row justify-end space-x-3">
              <Pressable
                onPress={onClose}
                className="px-5 py-3 rounded-xl bg-gray-100"
              >
                <Text className="text-gray-700 font-medium">Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleAddWorkout}
                className="px-5 py-3 rounded-xl bg-blue-500"
                disabled={!newWorkoutName.trim()}
              >
                <Text className="text-white font-medium">
                  {editingWorkoutId ? "Save Changes" : "Create Workout"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CreateWorkoutModal;
