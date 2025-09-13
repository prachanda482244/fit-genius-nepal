import { WorkoutSection } from "@/types/workoutType";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

interface WorkoutCreationTabProps {
  isLoading: boolean;
  workoutData: WorkoutSection[];
  setWorkoutData: React.Dispatch<React.SetStateAction<WorkoutSection[]>>;
  setShowAddWorkoutModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingWorkoutId: React.Dispatch<React.SetStateAction<string | null>>;
  setShowAddExerciseModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedWorkoutSection: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  setEditingExerciseId: React.Dispatch<React.SetStateAction<string | null>>;
}

const WorkoutCreationTab: React.FC<WorkoutCreationTabProps> = ({
  isLoading,
  workoutData,
  setWorkoutData,
  setShowAddWorkoutModal,
  setEditingWorkoutId,
  setShowAddExerciseModal,
  setSelectedWorkoutSection,
  setEditingExerciseId,
}) => {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  // Function to delete a workout section
  const deleteWorkoutSection = (id: string) => {
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this workout? All exercises will be removed.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {},
        },
      ]
    );
  };

  // Function to delete an exercise
  const deleteExercise = (workoutId: string, exerciseId: string) => {
    Alert.alert(
      "Delete Exercise",
      "Are you sure you want to delete this exercise?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {},
        },
      ]
    );
  };

  // Function to edit a workout
  const editWorkout = (workout: WorkoutSection) => {
    setEditingWorkoutId(workout._id);
    setShowAddWorkoutModal(true);
  };

  // Function to edit an exercise
  const editExercise = (workoutId: string, exerciseId: string) => {
    setEditingExerciseId(exerciseId);
    setSelectedWorkoutSection(workoutId);
    setShowAddExerciseModal(true);
  };

  // Function to toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <>
      {/* Add Workout Button */}
      <Pressable
        onPress={() => {
          setEditingWorkoutId(null);
          setShowAddWorkoutModal(true);
        }}
        className="flex-row items-center justify-center bg-blue-500 mx-4 my-4 p-4 rounded-lg shadow-sm"
      >
        <Ionicons name="add-circle" size={22} color="white" />
        <Text className="text-white font-semibold ml-2">
          Create New Workout
        </Text>
      </Pressable>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="text-gray-600 mt-3">Loading workout data...</Text>
        </View>
      ) : workoutData.length === 0 ? (
        <View className="flex-1 justify-center items-center px-5">
          <Ionicons name="barbell" size={48} color="#d1d5db" />
          <Text className="text-gray-500 text-lg font-medium mt-3 text-center">
            No workouts created yet
          </Text>
          <Text className="text-gray-400 text-center mt-1">
            Create your first workout to get started
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-4 py-4"
          showsVerticalScrollIndicator={false}
        >
          {/* Workout Sections */}
          <Text className="text-gray-700 font-semibold mb-3 ml-1">
            Your Workouts
          </Text>

          {workoutData.map((section) => (
            <View
              key={section._id}
              className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 mb-4"
            >
              {/* Section Header */}
              <View className="flex-row justify-between items-center p-4">
                <Pressable
                  onPress={() => toggleSection(section._id)}
                  className="flex-row items-center flex-1"
                  android_ripple={{ color: "#f3f4f6" }}
                >
                  <View className="bg-gray-100 p-2 rounded-full mr-3">
                    <Ionicons name="barbell" size={18} color="#374151" />
                  </View>
                  <Text className="text-gray-900 font-medium">
                    {section.name}
                  </Text>
                </Pressable>

                <View className="flex-row">
                  <Pressable
                    onPress={() => editWorkout(section)}
                    className="p-2 ml-2"
                  >
                    <Ionicons name="create-outline" size={18} color="#3b82f6" />
                  </Pressable>
                  <Pressable
                    onPress={() => deleteWorkoutSection(section._id)}
                    className="p-2 ml-2"
                  >
                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                  </Pressable>
                  <Pressable
                    onPress={() => toggleSection(section._id)}
                    className="p-2 ml-2"
                  >
                    <Ionicons
                      name={
                        expandedSections[section._id]
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      size={20}
                      color="#6b7280"
                    />
                  </Pressable>
                </View>
              </View>

              {/* Exercises List (shown when expanded) */}
              {expandedSections[section._id] && (
                <View className="border-t border-gray-100">
                  {section.exercises.map((exercise) => (
                    <Pressable
                      key={exercise.id}
                      className="flex-row items-center p-3 border-b border-gray-100"
                      android_ripple={{ color: "#f3f4f6" }}
                    >
                      <View className="bg-gray-50 p-2 rounded-full mr-3">
                        <Ionicons
                          name={exercise.icon}
                          size={16}
                          color="#374151"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-gray-800 text-sm font-medium">
                          {exercise.name}
                        </Text>
                        <Text className="text-gray-500 text-xs">
                          {exercise.sets} sets × {exercise.reps} reps (
                          {exercise.weight} lbs)
                        </Text>
                      </View>
                      <View className="flex-row">
                        <Pressable
                          onPress={() => editExercise(section._id, exercise.id)}
                          className="p-2"
                        >
                          <Ionicons
                            name="create-outline"
                            size={16}
                            color="#3b82f6"
                          />
                        </Pressable>
                        <Pressable
                          onPress={() =>
                            deleteExercise(section._id, exercise.id)
                          }
                          className="p-2"
                        >
                          <Ionicons
                            name="trash-outline"
                            size={16}
                            color="#ef4444"
                          />
                        </Pressable>
                      </View>
                    </Pressable>
                  ))}

                  {/* Add Exercise Button */}
                  <Pressable
                    onPress={() => {
                      setEditingExerciseId(null);
                      setSelectedWorkoutSection(section._id);
                      setShowAddExerciseModal(true);
                    }}
                    className="flex-row items-center p-3"
                    android_ripple={{ color: "#f3f4f6" }}
                  >
                    <View className="bg-blue-50 p-2 rounded-full mr-3">
                      <Ionicons name="add" size={16} color="#3b82f6" />
                    </View>
                    <Text className="text-blue-500 text-sm">
                      Add exercise to {section.name}
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          ))}

          {/* Empty space at the bottom */}
          <View className="h-4" />
        </ScrollView>
      )}
    </>
  );
};

export default WorkoutCreationTab;
