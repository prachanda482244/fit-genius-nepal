import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

interface Exercise {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  sets: number;
  reps: number;
  weight: number;
}

interface WorkoutSection {
  id: string;
  name: string;
  exercises: Exercise[];
}

interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  days: {
    [day: string]: string[]; // Array of workout section IDs
  };
}

const CreateWorkout = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<"create" | "schedule">("create");
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [workoutData, setWorkoutData] = useState<WorkoutSection[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [showAddWorkoutModal, setShowAddWorkoutModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedWorkoutSection, setSelectedWorkoutSection] = useState<
    string | null
  >(null);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [newWorkoutName, setNewWorkoutName] = useState("");
  const [editingWorkoutId, setEditingWorkoutId] = useState<string | null>(null);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(
    null
  );

  // Predefined workout plans
  const predefinedPlans: WorkoutPlan[] = [
    {
      id: "bro-split",
      name: "Bro Split",
      description: "Chest, Back, Shoulders, Arms, Legs",
      days: {
        Monday: ["chest"],
        Tuesday: ["back"],
        Wednesday: ["shoulders"],
        Thursday: ["arms"],
        Friday: ["legs"],
        Saturday: [],
        Sunday: [],
      },
    },
    {
      id: "push-pull-legs",
      name: "Push/Pull/Legs",
      description: "Push, Pull, Legs split",
      days: {
        Monday: ["chest", "shoulders", "triceps"],
        Tuesday: ["back", "biceps"],
        Wednesday: ["legs"],
        Thursday: ["chest", "shoulders", "triceps"],
        Friday: ["back", "biceps"],
        Saturday: ["legs"],
        Sunday: [],
      },
    },
    {
      id: "full-body",
      name: "Full Body",
      description: "Full body workouts",
      days: {
        Monday: ["chest", "back", "legs", "shoulders", "arms"],
        Tuesday: [],
        Wednesday: ["chest", "back", "legs", "shoulders", "arms"],
        Thursday: [],
        Friday: ["chest", "back", "legs", "shoulders", "arms"],
        Saturday: [],
        Sunday: [],
      },
    },
    {
      id: "upper-lower",
      name: "Upper/Lower",
      description: "Upper and lower body split",
      days: {
        Monday: ["chest", "back", "shoulders", "arms"],
        Tuesday: ["legs"],
        Wednesday: [],
        Thursday: ["chest", "back", "shoulders", "arms"],
        Friday: ["legs"],
        Saturday: [],
        Sunday: [],
      },
    },
  ];

  // Days of the week
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Function to add new workout section
  const handleAddWorkout = () => {
    if (newWorkoutName.trim()) {
      if (editingWorkoutId) {
        // Edit existing workout
        setWorkoutData((prev) =>
          prev.map((workout) =>
            workout.id === editingWorkoutId
              ? { ...workout, name: newWorkoutName.trim() }
              : workout
          )
        );
        setEditingWorkoutId(null);
      } else {
        // Create a new workout section
        const newWorkoutSection: WorkoutSection = {
          id: Date.now().toString(),
          name: newWorkoutName.trim(),
          exercises: [],
        };

        setWorkoutData((prev) => [...prev, newWorkoutSection]);
      }

      setNewWorkoutName("");
      setShowAddWorkoutModal(false);
    }
  };

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
          onPress: () => {
            setWorkoutData((prev) =>
              prev.filter((workout) => workout.id !== id)
            );

            // Also remove from all workout plans
            setWorkoutPlans((prev) =>
              prev.map((plan) => ({
                ...plan,
                days: Object.fromEntries(
                  Object.entries(plan.days).map(([day, workouts]) => [
                    day,
                    workouts.filter((workoutId) => workoutId !== id),
                  ])
                ),
              }))
            );
          },
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
          onPress: () => {
            setWorkoutData((prev) =>
              prev.map((workout) =>
                workout.id === workoutId
                  ? {
                      ...workout,
                      exercises: workout.exercises.filter(
                        (ex) => ex.id !== exerciseId
                      ),
                    }
                  : workout
              )
            );
          },
        },
      ]
    );
  };

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
      setShowAddExerciseModal(false);
      setSelectedWorkoutSection(null);
    }
  };

  // Function to edit a workout
  const editWorkout = (workout: WorkoutSection) => {
    setNewWorkoutName(workout.name);
    setEditingWorkoutId(workout.id);
    setShowAddWorkoutModal(true);
  };

  // Function to edit an exercise
  const editExercise = (workoutId: string, exercise: Exercise) => {
    setNewExerciseName(exercise.name);
    setEditingExerciseId(exercise.id);
    setSelectedWorkoutSection(workoutId);
    setShowAddExerciseModal(true);
  };

  // Function to handle exercise press
  const handleExercisePress = (muscleGroup: string, exercise: Exercise) => {
    navigation.navigate("exercise-detail", {
      muscleGroup,
      exercise: JSON.stringify(exercise),
    });
  };

  // Function to toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Function to apply a workout plan
  const applyWorkoutPlan = (planId: string) => {
    const plan = predefinedPlans.find((p) => p.id === planId);
    if (plan) {
      setWorkoutPlans((prev) => [...prev, { ...plan }]);
      setSelectedPlan(planId);
    }
  };

  // Function to add workout to day
  const addWorkoutToDay = (day: string, workoutId: string) => {
    if (!selectedPlan) return;

    setWorkoutPlans((prev) =>
      prev.map((plan) =>
        plan.id === selectedPlan
          ? {
              ...plan,
              days: {
                ...plan.days,
                [day]: plan.days[day].includes(workoutId)
                  ? plan.days[day].filter((id) => id !== workoutId)
                  : [...plan.days[day], workoutId],
              },
            }
          : plan
      )
    );
  };

  // Function to get workouts for a specific day
  const getWorkoutsForDay = (day: string) => {
    if (!selectedPlan) return [];

    const plan = workoutPlans.find((p) => p.id === selectedPlan);
    if (!plan) return [];

    return plan.days[day]
      .map((workoutId) => workoutData.find((w) => w.id === workoutId))
      .filter(Boolean) as WorkoutSection[];
  };

  // Load sample data
  useEffect(() => {
    const loadSampleData = async () => {
      setIsLoading(true);

      // Simulate API call
      setTimeout(() => {
        setWorkoutData([
          {
            id: "chest",
            name: "Chest",
            exercises: [
              {
                id: "1",
                name: "Bench Press",
                icon: "barbell",
                sets: 4,
                reps: 8,
                weight: 185,
              },
              {
                id: "2",
                name: "Incline Dumbbell Press",
                icon: "fitness",
                sets: 3,
                reps: 10,
                weight: 65,
              },
            ],
          },
          {
            id: "back",
            name: "Back",
            exercises: [
              {
                id: "3",
                name: "Deadlifts",
                icon: "barbell",
                sets: 4,
                reps: 6,
                weight: 275,
              },
              {
                id: "4",
                name: "Pull-ups",
                icon: "body",
                sets: 3,
                reps: 8,
                weight: 0,
              },
            ],
          },
        ]);

        setIsLoading(false);
      }, 1000);
    };

    loadSampleData();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white px-5 pt-5 pb-4 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900 text-center">
            Workout Planner
          </Text>
          <Text className="text-gray-600 text-center mt-1">
            Create and schedule your workouts
          </Text>
        </View>

        {/* Tabs */}
        <View className="flex-row bg-white border-b border-gray-200">
          <Pressable
            onPress={() => setActiveTab("create")}
            className={`flex-1 py-3 items-center ${activeTab === "create" ? "border-b-2 border-blue-500" : ""}`}
          >
            <Text
              className={`font-medium ${activeTab === "create" ? "text-blue-500" : "text-gray-600"}`}
            >
              Create Workouts
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("schedule")}
            className={`flex-1 py-3 items-center ${activeTab === "schedule" ? "border-b-2 border-blue-500" : ""}`}
          >
            <Text
              className={`font-medium ${activeTab === "schedule" ? "text-blue-500" : "text-gray-600"}`}
            >
              Schedule
            </Text>
          </Pressable>
        </View>

        {activeTab === "create" ? (
          <>
            {/* Add Workout Button */}
            <Pressable
              onPress={() => {
                setEditingWorkoutId(null);
                setNewWorkoutName("");
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
                <Text className="text-gray-600 mt-3">
                  Loading workout data...
                </Text>
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
                    key={section.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 mb-4"
                  >
                    {/* Section Header */}
                    <View className="flex-row justify-between items-center p-4">
                      <Pressable
                        onPress={() => toggleSection(section.id)}
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
                          <Ionicons
                            name="create-outline"
                            size={18}
                            color="#3b82f6"
                          />
                        </Pressable>
                        <Pressable
                          onPress={() => deleteWorkoutSection(section.id)}
                          className="p-2 ml-2"
                        >
                          <Ionicons
                            name="trash-outline"
                            size={18}
                            color="#ef4444"
                          />
                        </Pressable>
                        <Pressable
                          onPress={() => toggleSection(section.id)}
                          className="p-2 ml-2"
                        >
                          <Ionicons
                            name={
                              expandedSections[section.id]
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
                    {expandedSections[section.id] && (
                      <View className="border-t border-gray-100">
                        {section.exercises.map((exercise) => (
                          <Pressable
                            key={exercise.id}
                            onPress={() =>
                              handleExercisePress(section.name, exercise)
                            }
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
                                onPress={() =>
                                  editExercise(section.id, exercise)
                                }
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
                                  deleteExercise(section.id, exercise.id)
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
                            setNewExerciseName("");
                            setSelectedWorkoutSection(section.id);
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
        ) : (
          <ScrollView className="flex-1 px-4 py-4">
            <Text className="text-gray-700 font-semibold mb-3 ml-1">
              Schedule Your Workouts
            </Text>

            {/* Predefined Plans */}
            <Text className="text-gray-600 font-medium mt-5 mb-2">
              Popular Plans
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-4"
            >
              {predefinedPlans.map((plan) => (
                <Pressable
                  key={plan.id}
                  onPress={() => applyWorkoutPlan(plan.id)}
                  className={`bg-white p-4 rounded-lg shadow-sm mr-3 ${selectedPlan === plan.id ? "border-2 border-blue-500" : "border border-gray-200"}`}
                  style={{ width: 150 }}
                >
                  <Text className="font-semibold text-gray-900">
                    {plan.name}
                  </Text>
                  <Text className="text-gray-500 text-xs mt-1">
                    {plan.description}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Day Selector */}
            {selectedPlan && (
              <>
                <Text className="text-gray-600 font-medium mt-5 mb-2">
                  Select Day
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mb-4"
                >
                  {daysOfWeek.map((day) => (
                    <Pressable
                      key={day}
                      onPress={() => setSelectedDay(day)}
                      className={`px-4 py-2 rounded-full mr-2 ${selectedDay === day ? "bg-blue-500" : "bg-gray-200"}`}
                    >
                      <Text
                        className={
                          selectedDay === day ? "text-white" : "text-gray-700"
                        }
                      >
                        {day.substring(0, 3)}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </>
            )}

            {/* Workouts for Selected Day */}
            {selectedDay && (
              <>
                <Text className="text-gray-600 font-medium mt-5 mb-2">
                  Workouts for {selectedDay}
                </Text>

                {getWorkoutsForDay(selectedDay).length > 0 ? (
                  getWorkoutsForDay(selectedDay).map((workout) => (
                    <View
                      key={workout.id}
                      className="bg-white p-3 rounded-lg shadow-sm mb-2 border border-gray-200"
                    >
                      <Text className="font-medium text-gray-900">
                        {workout.name}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text className="text-gray-500 text-center py-4">
                    No workouts scheduled for this day
                  </Text>
                )}

                {/* Add Workout to Day */}
                <Text className="text-gray-600 font-medium mt-5 mb-2">
                  Add Workout to {selectedDay}
                </Text>
                {workoutData.map((workout) => (
                  <Pressable
                    key={workout.id}
                    onPress={() => addWorkoutToDay(selectedDay, workout.id)}
                    className={`flex-row items-center p-3 rounded-lg mb-2 ${getWorkoutsForDay(selectedDay).some((w) => w.id === workout.id) ? "bg-blue-100" : "bg-gray-100"}`}
                  >
                    <Ionicons
                      name={
                        getWorkoutsForDay(selectedDay).some(
                          (w) => w.id === workout.id
                        )
                          ? "checkmark-circle"
                          : "add-circle"
                      }
                      size={20}
                      color={
                        getWorkoutsForDay(selectedDay).some(
                          (w) => w.id === workout.id
                        )
                          ? "#3b82f6"
                          : "#6b7280"
                      }
                    />
                    <Text className="ml-2 text-gray-800">{workout.name}</Text>
                  </Pressable>
                ))}
              </>
            )}
          </ScrollView>
        )}

        {/* Add Workout Modal */}
        <Modal
          visible={showAddWorkoutModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowAddWorkoutModal(false)}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1 justify-center items-center bg-black/50 p-5">
              <View className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl">
                <View className="flex-row justify-between items-center mb-5">
                  <Text className="text-xl font-bold text-gray-900">
                    {editingWorkoutId ? "Edit Workout" : "Create New Workout"}
                  </Text>
                  <Pressable
                    onPress={() => setShowAddWorkoutModal(false)}
                    className="p-1"
                  >
                    <Ionicons name="close" size={24} color="#6b7280" />
                  </Pressable>
                </View>

                <Text className="text-gray-600 mb-4">
                  {editingWorkoutId
                    ? "Edit your workout name"
                    : "Enter a name for your new workout routine"}
                </Text>

                <TextInput
                  placeholder="Workout name (e.g., Chest Day)"
                  value={newWorkoutName}
                  onChangeText={setNewWorkoutName}
                  className="border border-gray-300 rounded-xl p-4 text-gray-800 mb-5"
                  autoFocus={true}
                />

                <View className="flex-row justify-end space-x-3">
                  <Pressable
                    onPress={() => setShowAddWorkoutModal(false)}
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

        {/* Add Exercise Modal */}
        <Modal
          visible={showAddExerciseModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowAddExerciseModal(false)}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1 justify-center items-center bg-black/50 p-5">
              <View className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl">
                <View className="flex-row justify-between items-center mb-5">
                  <Text className="text-xl font-bold text-gray-900">
                    {editingExerciseId ? "Edit Exercise" : "Add Exercise"}
                  </Text>
                  <Pressable
                    onPress={() => setShowAddExerciseModal(false)}
                    className="p-1"
                  >
                    <Ionicons name="close" size={24} color="#6b7280" />
                  </Pressable>
                </View>

                <Text className="text-gray-600 mb-4">
                  {editingExerciseId
                    ? "Edit your exercise name"
                    : `Enter the name of the exercise you want to add to ${workoutData.find((w) => w.id === selectedWorkoutSection)?.name || "this workout"}`}
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
                    onPress={() => setShowAddExerciseModal(false)}
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
      </View>
    </SafeAreaView>
  );
};

export default CreateWorkout;
