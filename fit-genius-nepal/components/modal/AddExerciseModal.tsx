import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Keyboard,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Exercise, WorkoutSection } from "../../types/workoutType";

interface AddExerciseModalProps {
  visible: boolean;
  onClose: () => void;
  selectedWorkoutSection: string | null;
  workoutData: WorkoutSection[];
  setWorkoutData: React.Dispatch<React.SetStateAction<WorkoutSection[]>>;
  editingExerciseId: string | null;
  setEditingExerciseId: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedWorkoutSection: React.Dispatch<
    React.SetStateAction<string | null>
  >;
}

const AddExerciseModal: React.FC<AddExerciseModalProps> = ({
  visible,
  onClose,
  selectedWorkoutSection,
  workoutData,
  setWorkoutData,
  editingExerciseId,
  setEditingExerciseId,
  setSelectedWorkoutSection,
}) => {
  const [newExerciseName, setNewExerciseName] = useState("");

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (visible) {
      if (editingExerciseId && selectedWorkoutSection) {
        // Editing existing exercise
        const workout = workoutData.find(
          (w) => w.id === selectedWorkoutSection
        );
        if (workout) {
          const exercise = workout.exercises.find(
            (e) => e.id === editingExerciseId
          );
          if (exercise) {
            setNewExerciseName(exercise.name);
          }
        }
      } else {
        // Creating new exercise
        setNewExerciseName("");
      }
    }
  }, [visible, editingExerciseId, selectedWorkoutSection, workoutData]);

  // Function to add exercise to a specific workout section
  const addExerciseToWorkout = () => {
    if (newExerciseName.trim() && selectedWorkoutSection) {
      if (editingExerciseId) {
        // Edit existing exercise
        setWorkoutData((prev) =>
          prev.map((workout) =>
            workout.id === selectedWorkoutSection
              ? {
                  ...workout,
                  exercises: workout.exercises.map((ex) =>
                    ex.id === editingExerciseId
                      ? { ...ex, name: newExerciseName.trim() }
                      : ex
                  ),
                }
              : workout
          )
        );
        setEditingExerciseId(null);
      } else {
        // Create a new exercise
        const newExercise: Exercise = {
          id: Date.now().toString(),
          name: newExerciseName.trim(),
          icon: "barbell",
          sets: 3,
          reps: 10,
          weight: 50,
        };

        setWorkoutData((prev) =>
          prev.map((workout) =>
            workout.id === selectedWorkoutSection
              ? { ...workout, exercises: [...workout.exercises, newExercise] }
              : workout
          )
        );
      }

      setNewExerciseName("");
      onClose();
      setSelectedWorkoutSection(null);
    }
  };

  const workoutName =
    workoutData.find((w) => w.id === selectedWorkoutSection)?.name ||
    "this workout";

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white p-6 rounded-t-3xl max-h-2/3">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-xl font-bold text-gray-900">
                {editingExerciseId ? "Edit Exercise" : "Add Exercise"}
              </Text>
              <Pressable onPress={onClose} className="p-1">
                <Ionicons name="close" size={24} color="#6b7280" />
              </Pressable>
            </View>

            <Text className="text-gray-600 mb-4">
              {editingExerciseId
                ? "Edit your exercise name"
                : `Enter the name of the exercise you want to add to ${workoutName}`}
            </Text>

            <TextInput
              placeholder="Exercise name"
              value={newExerciseName}
              onChangeText={setNewExerciseName}
              className="border border-gray-300 rounded-xl p-4 text-gray-800 mb-5"
              autoFocus={true}
            />

            <View className="flex-row justify-end space-x-3">
              <Pressable
                onPress={onClose}
                className="px-5 py-3 rounded-xl bg-gray-100"
              >
                <Text className="text-gray-700 font-medium">Cancel</Text>
              </Pressable>

              <Pressable
                onPress={addExerciseToWorkout}
                className="px-5 py-3 rounded-xl bg-blue-500"
                disabled={!newExerciseName.trim()}
              >
                <Text className="text-white font-medium">
                  {editingExerciseId ? "Save Changes" : "Add Exercise"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddExerciseModal;
