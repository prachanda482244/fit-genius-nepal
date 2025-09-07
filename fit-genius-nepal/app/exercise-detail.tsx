import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

interface Exercise {
  id: number;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface WorkoutSet {
  setNumber: number;
  reps: number;
  weight: number;
  completed: boolean;
}

const ExerciseDetail = () => {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const { muscleGroup, exercise } = params;

  // Parse the exercise object
  const exerciseObj: Exercise =
    typeof exercise === "string" ? JSON.parse(exercise) : exercise;

  // State for workout tracking
  const [sets, setSets] = useState<WorkoutSet[]>([
    { setNumber: 1, reps: 10, weight: 50, completed: false },
    { setNumber: 2, reps: 10, weight: 50, completed: false },
    { setNumber: 3, reps: 8, weight: 55, completed: false },
  ]);

  const [restTime, setRestTime] = useState(90); // seconds
  const [activeSet, setActiveSet] = useState<number | null>(null);

  // Toggle set completion
  const toggleSetCompletion = (setNumber: number) => {
    setSets((prevSets) =>
      prevSets.map((set) =>
        set.setNumber === setNumber
          ? { ...set, completed: !set.completed }
          : set
      )
    );
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="bg-black flex-row items-center shadow-md">
          <Pressable
            onPress={() => navigation.goBack()}
            className="mr-4 p-2 rounded-full active:bg-gray-800"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          <Text className="text-white text-xl font-bold flex-1">
            {exerciseObj.name}
          </Text>
        </View>

        <ScrollView
          className="flex-1 px-5 py-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Workout Tracking Section */}
          <View className="bg-white rounded-lg p-5 shadow-sm mb-5 border border-gray-100">
            <Text className="text-lg font-semibold text-black mb-4">
              Workout Tracking
            </Text>

            {/* Sets and Reps */}
            <View className="mb-4">
              <Text className="text-md font-medium text-gray-800 mb-3">
                Sets & Reps
              </Text>
              {sets.map((set) => (
                <Pressable
                  key={set.setNumber}
                  onPress={() => toggleSetCompletion(set.setNumber)}
                  className={`flex-row justify-between items-center p-3 mb-2 rounded-lg border ${
                    set.completed
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <View className="flex-row items-center">
                    <View
                      className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                        set.completed ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      {set.completed && (
                        <Ionicons name="checkmark" size={16} color="white" />
                      )}
                    </View>
                    <Text className="text-gray-800">Set {set.setNumber}</Text>
                  </View>
                  <View className="flex-row">
                    <Text className="text-gray-700 mr-4">{set.reps} reps</Text>
                    <Text className="text-gray-700">{set.weight} lbs</Text>
                  </View>
                </Pressable>
              ))}
            </View>

            {/* Rest Timer */}
            <View>
              <Text className="text-md font-medium text-gray-800 mb-3">
                Rest Time
              </Text>
              <View className="flex-row items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
                <View className="flex-row items-center">
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color="#3b82f6"
                    className="mr-2"
                  />
                  <Text className="text-blue-800">{formatTime(restTime)}</Text>
                </View>
                <View className="flex-row">
                  <Pressable
                    onPress={() =>
                      setRestTime((prev) => Math.max(30, prev - 15))
                    }
                    className="bg-blue-100 p-2 rounded-lg mr-2"
                  >
                    <Ionicons name="remove" size={16} color="#3b82f6" />
                  </Pressable>
                  <Pressable
                    onPress={() => setRestTime((prev) => prev + 15)}
                    className="bg-blue-100 p-2 rounded-lg"
                  >
                    <Ionicons name="add" size={16} color="#3b82f6" />
                  </Pressable>
                </View>
              </View>
            </View>
          </View>

          {/* Exercise Stats */}
          <View className="bg-white rounded-lg p-5 shadow-sm mb-5 border border-gray-100">
            <Text className="text-lg font-semibold text-black mb-3">
              Exercise Stats
            </Text>
            <View className="flex-row justify-between mb-4">
              <View className="items-center">
                <Text className="text-2xl font-bold text-gray-800">3</Text>
                <Text className="text-gray-600 text-sm">Sets</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-gray-800">28</Text>
                <Text className="text-gray-600 text-sm">Total Reps</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-gray-800">145</Text>
                <Text className="text-gray-600 text-sm">Total Weight</Text>
              </View>
            </View>
          </View>

          {/* Exercise Details */}
          <View className="bg-white rounded-lg p-5 shadow-sm mb-5 border border-gray-100">
            <Text className="text-lg font-semibold text-black mb-3">
              Exercise Details
            </Text>
            <View className="flex-row items-center mb-2">
              <Ionicons
                name="barbell"
                size={18}
                color="#000"
                className="mr-2"
              />
              <Text className="text-gray-700">Muscle Group: {muscleGroup}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="time" size={18} color="#000" className="mr-2" />
              <Text className="text-gray-700">Type: Strength</Text>
            </View>
          </View>

          {/* Instructions */}
          <View className="bg-white rounded-lg p-5 shadow-sm mb-5 border border-gray-100">
            <Text className="text-lg font-semibold text-black mb-3">
              Instructions
            </Text>
            <View className="mb-2 flex-row">
              <Text className="text-black font-bold mr-2">1.</Text>
              <Text className="text-gray-700 flex-1">
                Lie on a flat bench with your feet firmly on the ground.
              </Text>
            </View>
            <View className="mb-2 flex-row">
              <Text className="text-black font-bold mr-2">2.</Text>
              <Text className="text-gray-700 flex-1">
                Grip the barbell with hands slightly wider than shoulder-width.
              </Text>
            </View>
            <View className="mb-2 flex-row">
              <Text className="text-black font-bold mr-2">3.</Text>
              <Text className="text-gray-700 flex-1">
                Lower the bar to your chest while keeping your elbows at a
                45-degree angle.
              </Text>
            </View>
            <View className="flex-row">
              <Text className="text-black font-bold mr-2">4.</Text>
              <Text className="text-gray-700 flex-1">
                Push the bar back to the starting position, exhaling as you
                press.
              </Text>
            </View>
          </View>

          {/* Tips */}
          <View className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <Text className="text-lg font-semibold text-black mb-3">Tips</Text>
            <View className="mb-2 flex-row">
              <Ionicons
                name="checkmark-circle"
                size={18}
                color="#000"
                className="mr-2 mt-0.5"
              />
              <Text className="text-gray-700 flex-1">
                Keep your back flat against the bench throughout the movement.
              </Text>
            </View>
            <View className="mb-2 flex-row">
              <Ionicons
                name="checkmark-circle"
                size={18}
                color="#000"
                className="mr-2 mt-0.5"
              />
              <Text className="text-gray-700 flex-1">
                Don't arch your back excessively.
              </Text>
            </View>
            <View className="flex-row">
              <Ionicons
                name="checkmark-circle"
                size={18}
                color="#000"
                className="mr-2 mt-0.5"
              />
              <Text className="text-gray-700 flex-1">
                Use a spotter when lifting heavy weights.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Start Workout Button */}
        <View className="p-5 border-t border-gray-200 bg-white">
          <Pressable
            className="bg-black py-4 rounded-lg items-center"
            onPress={() => {
              // Start workout timer functionality
              alert("Workout started! Timer will begin.");
            }}
          >
            <Text className="text-white font-semibold text-lg">
              Start Workout
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ExerciseDetail;
