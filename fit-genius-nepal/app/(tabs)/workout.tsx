import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";

interface Exercise {
  id: number;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  sets: number;
  reps: number;
  weight: number;
}

interface WorkoutSection {
  name: string;
  exercises: Exercise[];
}

interface WorkoutData {
  [key: string]: WorkoutSection;
}

interface WorkoutHistory {
  date: string;
  workouts: WorkoutData;
}

const Workout = () => {
  const navigation = useNavigation();
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("");
  const [newExerciseName, setNewExerciseName] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempSelectedDate, setTempSelectedDate] = useState(new Date());
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState("");

  // Format date to YYYY-MM-DD string
  const formatDateToString = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDateString = () => {
    return formatDateToString(new Date());
  };

  // Generate dates for the current week (Sunday to Saturday)
  const generateWeekDates = () => {
    const dates = [];
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Calculate the date of the most recent Sunday
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - currentDay);

    // Generate dates from Sunday to Saturday
    for (let i = 0; i < 7; i++) {
      const date = new Date(sunday);
      date.setDate(sunday.getDate() + i);
      dates.push(formatDateToString(date));
    }

    return dates;
  };

  const weekDates = generateWeekDates();

  // Format date for display
  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    }
  };

  // Check if date is in the future
  const isFutureDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    // Compare dates without time component
    return date.setHours(0, 0, 0, 0) > today.setHours(0, 0, 0, 0);
  };

  // Function to add new workout section
  const handleAddWorkout = () => {
    if (newWorkoutName.trim()) {
      // Create a new workout section
      const newWorkoutSection: WorkoutSection = {
        name: newWorkoutName.trim(),
        exercises: [],
      };

      // Update workout history for the selected date
      setWorkoutHistory((prev) => {
        const updatedHistory = [...prev];
        const dateIndex = updatedHistory.findIndex(
          (item) => item.date === selectedDate
        );

        if (dateIndex >= 0) {
          // Update existing date entry
          updatedHistory[dateIndex] = {
            ...updatedHistory[dateIndex],
            workouts: {
              ...updatedHistory[dateIndex].workouts,
              [newWorkoutName.toLowerCase().replace(/\s+/g, "-")]:
                newWorkoutSection,
            },
          };
        } else {
          // Create new date entry
          updatedHistory.push({
            date: selectedDate,
            workouts: {
              [newWorkoutName.toLowerCase().replace(/\s+/g, "-")]:
                newWorkoutSection,
            },
          });
        }

        return updatedHistory;
      });

      setNewWorkoutName("");
      setShowAddWorkout(false);
    }
  };
  // Dummy workout data for demonstration
  const getDummyWorkoutData = (dateStr: string): WorkoutData => {
    const date = new Date(dateStr);
    const day = date.getDay();

    // Different workouts for different days
    if (day === 0) {
      // Sunday - Rest day or light workout
      return {
        cardio: {
          name: "Cardio",
          exercises: [
            {
              id: 1,
              name: "Running",
              icon: "walk",
              sets: 1,
              reps: 0,
              weight: 0,
            },
          ],
        },
      };
    } else if (day === 1 || day === 4) {
      // Monday & Thursday - Chest & Triceps
      return {
        chest: {
          name: "Chest",
          exercises: [
            {
              id: 1,
              name: "Bench Press",
              icon: "barbell",
              sets: 4,
              reps: 8,
              weight: 185,
            },
            {
              id: 2,
              name: "Incline Dumbbell Press",
              icon: "fitness",
              sets: 3,
              reps: 10,
              weight: 65,
            },
          ],
        },
        triceps: {
          name: "Triceps",
          exercises: [
            {
              id: 1,
              name: "Tricep Pushdown",
              icon: "swap-horizontal",
              sets: 3,
              reps: 12,
              weight: 70,
            },
          ],
        },
      };
    } else if (day === 2 || day === 5) {
      // Tuesday & Friday - Back & Biceps
      return {
        back: {
          name: "Back",
          exercises: [
            {
              id: 1,
              name: "Deadlifts",
              icon: "barbell",
              sets: 4,
              reps: 6,
              weight: 275,
            },
            {
              id: 2,
              name: "Pull-ups",
              icon: "body",
              sets: 3,
              reps: 8,
              weight: 0,
            },
          ],
        },
        biceps: {
          name: "Biceps",
          exercises: [
            {
              id: 1,
              name: "Bicep Curls",
              icon: "fitness",
              sets: 3,
              reps: 12,
              weight: 30,
            },
          ],
        },
      };
    } else if (day === 3 || day === 6) {
      // Wednesday & Saturday - Legs & Shoulders
      return {
        legs: {
          name: "Legs",
          exercises: [
            {
              id: 1,
              name: "Squats",
              icon: "barbell",
              sets: 4,
              reps: 8,
              weight: 225,
            },
            {
              id: 2,
              name: "Leg Press",
              icon: "fitness",
              sets: 3,
              reps: 12,
              weight: 360,
            },
          ],
        },
        shoulders: {
          name: "Shoulders",
          exercises: [
            {
              id: 1,
              name: "Overhead Press",
              icon: "barbell",
              sets: 4,
              reps: 8,
              weight: 95,
            },
          ],
        },
      };
    }

    return {};
  };

  // Load workout data for selected date
  useEffect(() => {
    if (!selectedDate) {
      // Set to today by default
      setSelectedDate(getTodayDateString());
      return;
    }

    const loadWorkoutData = async () => {
      if (isFutureDate(selectedDate)) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      // Simulate API call
      setTimeout(() => {
        // Check if we already have data for this date
        const existingData = workoutHistory.find(
          (item) => item.date === selectedDate
        );

        if (!existingData) {
          // Get dummy data for this date
          const workoutData = getDummyWorkoutData(selectedDate);

          setWorkoutHistory((prev) => [
            ...prev,
            { date: selectedDate, workouts: workoutData },
          ]);
        }

        setIsLoading(false);
      }, 500);
    };

    loadWorkoutData();
  }, [selectedDate]);

  // Get workouts for selected date
  const getWorkoutsForDate = () => {
    return (
      workoutHistory.find((item) => item.date === selectedDate)?.workouts || {}
    );
  };

  const currentWorkouts = getWorkoutsForDate();

  // Function to toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Function to handle exercise press
  const handleExercisePress = (muscleGroup: string, exercise: Exercise) => {
    navigation.navigate("exercise-detail", {
      muscleGroup,
      exercise: JSON.stringify(exercise),
    });
  };

  // Function to add exercise to a specific workout section
  const addExerciseToWorkout = () => {
    if (newExerciseName.trim() && selectedMuscleGroup) {
      const newExercise: Exercise = {
        id: Date.now(), // Use timestamp as unique ID
        name: newExerciseName.trim(),
        icon: "barbell",
        sets: 3,
        reps: 10,
        weight: 50,
      };

      setWorkoutHistory((prev) => {
        const updatedHistory = [...prev];
        const dateIndex = updatedHistory.findIndex(
          (item) => item.date === selectedDate
        );

        if (dateIndex >= 0) {
          // Update existing workout section
          updatedHistory[dateIndex] = {
            ...updatedHistory[dateIndex],
            workouts: {
              ...updatedHistory[dateIndex].workouts,
              [selectedMuscleGroup.toLowerCase()]: {
                ...updatedHistory[dateIndex].workouts[
                  selectedMuscleGroup.toLowerCase()
                ],
                exercises: [
                  ...updatedHistory[dateIndex].workouts[
                    selectedMuscleGroup.toLowerCase()
                  ].exercises,
                  newExercise,
                ],
              },
            },
          };
        } else {
          // Create new date entry with the exercise
          updatedHistory.push({
            date: selectedDate,
            workouts: {
              [selectedMuscleGroup.toLowerCase()]: {
                name: selectedMuscleGroup,
                exercises: [newExercise],
              },
            },
          });
        }

        return updatedHistory;
      });

      setNewExerciseName("");
      setShowAddExerciseModal(false);
      setSelectedMuscleGroup("");
    }
  };

  // Open add exercise modal for a specific muscle group
  const openAddExerciseModal = (muscleGroup: string) => {
    setSelectedMuscleGroup(muscleGroup);
    setShowAddExerciseModal(true);
  };

  // Handle date selection from calendar
  const handleDateSelect = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setTempSelectedDate(date);
      setSelectedDate(formatDateToString(date));
    }
  };

  // Open calendar date picker
  const openCalendarPicker = () => {
    setTempSelectedDate(new Date(selectedDate));
    setShowDatePicker(true);
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white px-5 pt-5 pb-4 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900 text-center">
            Workout History
          </Text>
          <Text className="text-gray-600 text-center mt-1">
            Track your weekly workouts
          </Text>
        </View>

        {/* Date Selection Header */}
        <View className="bg-white px-4 py-3 border-b border-gray-200 flex-row justify-between items-center">
          <Pressable
            onPress={openCalendarPicker}
            className="flex-row items-center"
          >
            <Ionicons name="calendar-outline" size={24} color="#3b82f6" />
            <Text className="text-blue-500 ml-2 font-semibold">
              {new Date(selectedDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          </Pressable>

          <View className="flex-row">
            <Pressable
              onPress={() => {
                const date = new Date(selectedDate);
                date.setDate(date.getDate() - 1);
                setSelectedDate(formatDateToString(date));
              }}
              className="p-2"
            >
              <Ionicons name="chevron-back" size={20} color="#374151" />
            </Pressable>

            <Pressable
              onPress={() => {
                const date = new Date(selectedDate);
                if (!isFutureDate(formatDateToString(date))) {
                  date.setDate(date.getDate() + 1);
                  setSelectedDate(formatDateToString(date));
                }
              }}
              className="p-2"
              disabled={isFutureDate(selectedDate)}
            >
              <Ionicons
                name="chevron-forward"
                size={20}
                color={isFutureDate(selectedDate) ? "#9ca3af" : "#374151"}
              />
            </Pressable>
          </View>
        </View>

        {/* Calendar Week Selector */}
        <View className="bg-white px-2 py-3 border-b border-gray-200">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {weekDates.map((date) => {
              const isFuture = isFutureDate(date);
              const isSelected = selectedDate === date;
              const dateObj = new Date(date);

              return (
                <Pressable
                  key={date}
                  onPress={() => !isFuture && setSelectedDate(date)}
                  className={`w-14 h-16 justify-center items-center mx-1 rounded-lg ${
                    isSelected
                      ? "bg-blue-500"
                      : isFuture
                        ? "bg-gray-100 opacity-60"
                        : "bg-gray-100"
                  }`}
                  disabled={isFuture}
                >
                  <Text
                    className={
                      isSelected
                        ? "text-white font-semibold text-xs"
                        : isFuture
                          ? "text-gray-400 text-xs"
                          : "text-gray-700 text-xs"
                    }
                  >
                    {formatDateDisplay(date)}
                  </Text>
                  <Text
                    className={
                      isSelected
                        ? "text-white text-lg font-bold"
                        : isFuture
                          ? "text-gray-400 text-lg"
                          : "text-gray-900 text-lg font-medium"
                    }
                  >
                    {dateObj.getDate()}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
        {/* Add Workout Button - Put this after the calendar week selector */}
        <Pressable
          onPress={() => setShowAddWorkout(!showAddWorkout)}
          className="flex-row items-center justify-center bg-blue-500 mx-4 my-4 p-4 rounded-lg shadow-sm"
        >
          <Ionicons name="add-circle" size={22} color="white" />
          <Text className="text-white font-semibold ml-2">Add New Workout</Text>
        </Pressable>

        {/* Add Workout Form */}
        {showAddWorkout && (
          <View className="bg-white p-4 mx-4 rounded-lg shadow-sm border border-gray-200 mb-5">
            <Text className="text-gray-800 font-medium mb-3">
              Create New Workout
            </Text>
            <View className="flex-row">
              <TextInput
                placeholder="Workout name (e.g., Chest Day)"
                value={newWorkoutName}
                onChangeText={setNewWorkoutName}
                className="flex-1 border border-gray-300 rounded-l-lg p-3 text-gray-800"
              />
              <Pressable
                onPress={handleAddWorkout}
                className="bg-blue-500 justify-center items-center px-4 rounded-r-lg"
              >
                <Text className="text-white font-semibold">Add</Text>
              </Pressable>
            </View>
          </View>
        )}

        {isFutureDate(selectedDate) ? (
          <View className="flex-1 justify-center items-center px-5">
            <Ionicons name="calendar-outline" size={48} color="#d1d5db" />
            <Text className="text-gray-500 text-lg font-medium mt-3 text-center">
              Future Date Selected
            </Text>
            <Text className="text-gray-400 text-center mt-1">
              Select a past or current date to view workouts
            </Text>
          </View>
        ) : isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-gray-600 mt-3">Loading workout data...</Text>
          </View>
        ) : Object.keys(currentWorkouts).length === 0 ? (
          <View className="flex-1 justify-center items-center px-5">
            <Ionicons name="barbell" size={48} color="#d1d5db" />
            <Text className="text-gray-500 text-lg font-medium mt-3 text-center">
              No workouts recorded for{" "}
              {new Date(selectedDate).toLocaleDateString()}
            </Text>
            <Text className="text-gray-400 text-center mt-1">
              Add exercises to start tracking your progress
            </Text>
          </View>
        ) : (
          <ScrollView
            className="flex-1 px-4 py-4"
            showsVerticalScrollIndicator={false}
          >
            {/* Workout Sections */}
            <Text className="text-gray-700 font-semibold mb-3 ml-1">
              Workouts for {new Date(selectedDate).toLocaleDateString()}
            </Text>

            {Object.entries(currentWorkouts).map(([key, section]) => (
              <View
                key={key}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 mb-4"
              >
                {/* Section Header */}
                <Pressable
                  onPress={() => toggleSection(key)}
                  className="flex-row justify-between items-center p-4"
                  android_ripple={{ color: "#f3f4f6" }}
                >
                  <View className="flex-row items-center">
                    <View className="bg-gray-100 p-2 rounded-full mr-3">
                      <Ionicons name="barbell" size={18} color="#374151" />
                    </View>
                    <Text className="text-gray-900 font-medium">
                      {section.name}
                    </Text>
                  </View>
                  <Ionicons
                    name={expandedSections[key] ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#6b7280"
                  />
                </Pressable>

                {/* Exercises List (shown when expanded) */}
                {expandedSections[key] && (
                  <View className="border-t border-gray-100">
                    {section.exercises.map((exercise) => (
                      <Pressable
                        key={exercise.id}
                        onPress={() =>
                          handleExercisePress(section.name, exercise)
                        }
                        className="flex-row items-center p-3 border-b border-gray-100 last:border-b-0"
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
                        <Ionicons
                          name="chevron-forward"
                          size={16}
                          color="#9ca3af"
                        />
                      </Pressable>
                    ))}

                    {/* Add Exercise Button */}
                    <Pressable
                      onPress={() => openAddExerciseModal(section.name)}
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

        {/* Add Exercise Modal */}
        <Modal
          visible={showAddExerciseModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowAddExerciseModal(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-5 rounded-lg w-80">
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                Add Exercise to {selectedMuscleGroup}
              </Text>

              <TextInput
                placeholder="Exercise name"
                value={newExerciseName}
                onChangeText={setNewExerciseName}
                className="border border-gray-300 rounded-lg p-3 mb-4 text-gray-800"
              />

              <View className="flex-row justify-between">
                <Pressable
                  onPress={() => setShowAddExerciseModal(false)}
                  className="bg-gray-200 px-5 py-3 rounded-lg"
                >
                  <Text className="text-gray-700">Cancel</Text>
                </Pressable>

                <Pressable
                  onPress={addExerciseToWorkout}
                  className="bg-blue-500 px-5 py-3 rounded-lg"
                >
                  <Text className="text-white font-semibold">Add Exercise</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* Date Picker Modal */}
        {showDatePicker && (
          <DateTimePicker
            value={tempSelectedDate}
            mode="date"
            display="spinner"
            onChange={handleDateSelect}
            maximumDate={new Date()}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Workout;
