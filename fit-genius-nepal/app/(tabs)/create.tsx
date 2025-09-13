import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Components
import ScheduleTab from "@/components/ScheduleTab";
import WorkoutCreationTab from "@/components/WorkoutCreation";

import AddExerciseModal from "@/components/modal/AddExerciseModal";

// Types

// Predefined plans
import { getWorkouts } from "@/api/workoutApi";
import CreateWorkoutModal from "@/components/modal/CreateWorkoutModal";
import { predefinedPlans } from "@/data/predinedWorkout";
import { WorkoutPlan, WorkoutSection } from "@/types/workoutType";

const CreateWorkout = () => {
  const [activeTab, setActiveTab] = useState<"create" | "schedule">("create");
  const [workoutData, setWorkoutData] = useState<WorkoutSection[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [showAddWorkoutModal, setShowAddWorkoutModal] = useState(false);
  const [selectedWorkoutSection, setSelectedWorkoutSection] = useState<
    string | null
  >(null);
  const [editingWorkoutId, setEditingWorkoutId] = useState<string | null>(null);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(
    null
  );

  const getWorkoutsData = async () => {
    const data = await getWorkouts();
    setWorkoutData(data);
  };
  // Load sample data
  useEffect(() => {
    getWorkoutsData();
    const loadSampleData = async () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        // Add a sample custom schedule
        setWorkoutPlans([
          {
            id: "my-custom-plan",
            name: "My Custom Plan",
            description: "My personalized workout schedule",
            days: {
              Monday: ["chest"],
              Tuesday: ["back"],
              Wednesday: [],
              Thursday: ["chest"],
              Friday: ["back"],
              Saturday: [],
              Sunday: [],
            },
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
          <WorkoutCreationTab
            isLoading={isLoading}
            workoutData={workoutData}
            setWorkoutData={setWorkoutData}
            setShowAddWorkoutModal={setShowAddWorkoutModal}
            setEditingWorkoutId={setEditingWorkoutId}
            setShowAddExerciseModal={setShowAddExerciseModal}
            setSelectedWorkoutSection={setSelectedWorkoutSection}
            setEditingExerciseId={setEditingExerciseId}
          />
        ) : (
          <ScheduleTab
            predefinedPlans={predefinedPlans}
            workoutData={workoutData}
            workoutPlans={workoutPlans}
            setWorkoutPlans={setWorkoutPlans}
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
          />
        )}

        {/* Modals */}
        <CreateWorkoutModal
          visible={showAddWorkoutModal}
          onClose={() => setShowAddWorkoutModal(false)}
          editingWorkoutId={editingWorkoutId}
          workoutData={workoutData}
          setWorkoutData={setWorkoutData}
          setEditingWorkoutId={setEditingWorkoutId}
        />

        <AddExerciseModal
          visible={showAddExerciseModal}
          onClose={() => setShowAddExerciseModal(false)}
          selectedWorkoutSection={selectedWorkoutSection}
          workoutData={workoutData}
          setWorkoutData={setWorkoutData}
          editingExerciseId={editingExerciseId}
          setEditingExerciseId={setEditingExerciseId}
          setSelectedWorkoutSection={setSelectedWorkoutSection}
        />
      </View>
    </SafeAreaView>
  );
};

export default CreateWorkout;
