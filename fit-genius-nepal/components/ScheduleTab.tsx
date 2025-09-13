import CreateScheduleModal from "@/components/modal/CreateScheduleModal";
import { daysOfWeek, predefinedPlans } from "@/data/predinedWorkout";
import { WorkoutPlan, WorkoutSection } from "@/types/workoutType";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

interface ScheduleTabProps {
  workoutData: WorkoutSection[];
  workoutPlans: WorkoutPlan[];
  setWorkoutPlans: React.Dispatch<React.SetStateAction<WorkoutPlan[]>>;
  selectedPlan: string | null;
  setSelectedPlan: React.Dispatch<React.SetStateAction<string | null>>;
}

const ScheduleTab: React.FC<ScheduleTabProps> = ({
  workoutData,
  workoutPlans,
  setWorkoutPlans,
  selectedPlan,
  setSelectedPlan,
}) => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showCreateScheduleModal, setShowCreateScheduleModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<WorkoutPlan | null>(
    null
  );

  // Combine predefined and custom plans
  const allPlans = [
    ...predefinedPlans,
    ...workoutPlans.filter((p) => !p.isDefault),
  ];

  // Function to apply a workout plan
  const applyWorkoutPlan = (planId: string) => {
    const plan = allPlans.find((p) => p.id === planId);
    if (plan) {
      // Check if this plan is already added
      const existingPlanIndex = workoutPlans.findIndex((p) => p.id === planId);

      if (existingPlanIndex === -1) {
        setWorkoutPlans((prev) => [...prev, { ...plan }]);
      }

      setSelectedPlan(planId);
      setSelectedDay(null);
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
      .map((workoutId) => workoutData.find((w) => w._id === workoutId))
      .filter(Boolean) as WorkoutSection[];
  };

  // Function to handle creating a new schedule
  const handleCreateSchedule = (schedule: WorkoutPlan) => {
    if (editingSchedule) {
      // Update existing schedule
      setWorkoutPlans((prev) =>
        prev.map((p) => (p.id === editingSchedule.id ? schedule : p))
      );
      setEditingSchedule(null);
    } else {
      // Add new schedule
      setWorkoutPlans((prev) => [...prev, schedule]);
    }
    setSelectedPlan(schedule.id);
  };

  // Function to delete a custom schedule
  const deleteCustomSchedule = (planId: string) => {
    Alert.alert(
      "Delete Schedule",
      "Are you sure you want to delete this schedule?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setWorkoutPlans((prev) => prev.filter((p) => p.id !== planId));
            if (selectedPlan === planId) {
              setSelectedPlan(null);
              setSelectedDay(null);
            }
          },
        },
      ]
    );
  };

  // Function to edit a custom schedule
  const editCustomSchedule = (plan: WorkoutPlan) => {
    setEditingSchedule(plan);
    setShowCreateScheduleModal(true);
  };

  return (
    <>
      <ScrollView className="flex-1 px-4 py-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-gray-700 font-semibold">
            Schedule Your Workouts
          </Text>
          <Pressable
            onPress={() => {
              setEditingSchedule(null);
              setShowCreateScheduleModal(true);
            }}
            className="flex-row items-center bg-blue-500 px-3 py-2 rounded-lg"
          >
            <Ionicons name="add" size={16} color="white" />
            <Text className="text-white font-medium ml-1">New Schedule</Text>
          </Pressable>
        </View>

        {/* Predefined Plans */}
        <Text className="text-gray-600 font-medium mt-3 mb-2">
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
              <Text className="font-semibold text-gray-900">{plan.name}</Text>
              <Text className="text-gray-500 text-xs mt-1">
                {plan.description}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Custom Plans */}
        {workoutPlans.filter((p) => !p.isDefault).length > 0 && (
          <>
            <Text className="text-gray-600 font-medium mt-5 mb-2">
              Your Schedules
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-4"
            >
              {workoutPlans
                .filter((p) => !p.isDefault)
                .map((plan) => (
                  <View key={plan.id} className="mr-3" style={{ width: 150 }}>
                    <Pressable
                      onPress={() => applyWorkoutPlan(plan.id)}
                      className={`bg-white p-4 rounded-lg shadow-sm ${selectedPlan === plan.id ? "border-2 border-blue-500" : "border border-gray-200"}`}
                    >
                      <Text className="font-semibold text-gray-900">
                        {plan.name}
                      </Text>
                      <Text className="text-gray-500 text-xs mt-1">
                        {plan.description}
                      </Text>
                    </Pressable>
                    <View className="flex-row justify-center mt-2">
                      <Pressable
                        onPress={() => editCustomSchedule(plan)}
                        className="p-1 mx-1"
                      >
                        <Ionicons
                          name="create-outline"
                          size={16}
                          color="#3b82f6"
                        />
                      </Pressable>
                      <Pressable
                        onPress={() => deleteCustomSchedule(plan.id)}
                        className="p-1 mx-1"
                      >
                        <Ionicons
                          name="trash-outline"
                          size={16}
                          color="#ef4444"
                        />
                      </Pressable>
                    </View>
                  </View>
                ))}
            </ScrollView>
          </>
        )}

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
              {daysOfWeek.map((day) => {
                const plan = workoutPlans.find((p) => p.id === selectedPlan);
                const hasWorkouts =
                  plan && plan.days[day] && plan.days[day].length > 0;

                return (
                  <Pressable
                    key={day}
                    onPress={() => setSelectedDay(day)}
                    className={`px-4 py-2 rounded-full mr-2 flex-row items-center ${selectedDay === day ? "bg-blue-500" : hasWorkouts ? "bg-green-100" : "bg-gray-200"}`}
                  >
                    {hasWorkouts && (
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color={selectedDay === day ? "white" : "#10b981"}
                        style={{ marginRight: 4 }}
                      />
                    )}
                    <Text
                      className={
                        selectedDay === day
                          ? "text-white"
                          : hasWorkouts
                            ? "text-green-800"
                            : "text-gray-700"
                      }
                    >
                      {day.substring(0, 3)}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </>
        )}

        {/* Workouts for Selected Day */}
        {selectedDay && (
          <>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-gray-600 font-medium">
                Workouts for {selectedDay}
              </Text>
              <Text className="text-blue-500 text-sm">
                {getWorkoutsForDay(selectedDay).length} scheduled
              </Text>
            </View>

            {getWorkoutsForDay(selectedDay).length > 0 ? (
              getWorkoutsForDay(selectedDay).map((workout) => (
                <View
                  key={workout._id}
                  className="bg-white p-4 rounded-lg shadow-sm mb-3 border border-gray-200"
                >
                  <Text className="font-medium text-gray-900">
                    {workout.name}
                  </Text>
                  {workout.description && (
                    <Text className="text-gray-500 text-sm mt-1">
                      {workout.description}
                    </Text>
                  )}
                  <View className="flex-row mt-2">
                    {workout.difficulty && (
                      <View className="bg-blue-100 px-2 py-1 rounded-full mr-2">
                        <Text className="text-blue-800 text-xs">
                          {workout.difficulty}
                        </Text>
                      </View>
                    )}
                    {workout.isPublic && (
                      <View className="bg-green-100 px-2 py-1 rounded-full">
                        <Text className="text-green-800 text-xs">Public</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))
            ) : (
              <View className="bg-gray-100 p-4 rounded-lg mb-4">
                <Text className="text-gray-500 text-center">
                  No workouts scheduled for this day
                </Text>
                <Text className="text-gray-400 text-center text-sm mt-1">
                  Add workouts from the list below
                </Text>
              </View>
            )}

            {/* Add Workout to Day */}
            <Text className="text-gray-600 font-medium mt-5 mb-2">
              Available Workouts
            </Text>
            {workoutData.map((workout) => (
              <Pressable
                key={workout._id}
                onPress={() => addWorkoutToDay(selectedDay, workout._id)}
                className={`flex-row items-center justify-between p-3 rounded-lg mb-2 ${getWorkoutsForDay(selectedDay).some((w) => w._id === workout._id) ? "bg-blue-100" : "bg-gray-100"}`}
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name={
                      getWorkoutsForDay(selectedDay).some(
                        (w) => w._id === workout._id
                      )
                        ? "checkmark-circle"
                        : "add-circle"
                    }
                    size={20}
                    color={
                      getWorkoutsForDay(selectedDay).some(
                        (w) => w._id === workout._id
                      )
                        ? "#3b82f6"
                        : "#6b7280"
                    }
                  />
                  <Text className="ml-2 text-gray-800">{workout.name}</Text>
                </View>
                {workout.difficulty && (
                  <View className="bg-gray-200 px-2 py-1 rounded-full">
                    <Text className="text-gray-700 text-xs">
                      {workout.difficulty}
                    </Text>
                  </View>
                )}
              </Pressable>
            ))}
          </>
        )}
      </ScrollView>

      {/* Create Schedule Modal */}
      <CreateScheduleModal
        visible={showCreateScheduleModal}
        onClose={() => {
          setShowCreateScheduleModal(false);
          setEditingSchedule(null);
        }}
        onCreateSchedule={handleCreateSchedule}
        editingSchedule={editingSchedule}
      />
    </>
  );
};

export default ScheduleTab;
