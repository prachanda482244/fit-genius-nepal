import { createSchedule, updateSchedule } from "@/api/schedule";
import CreateScheduleModal from "@/components/modal/CreateScheduleModal";
import { WorkoutPlan, WorkoutSection } from "@/types/workoutType";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";

interface ScheduleTabProps {
  workoutData: WorkoutSection[];
  workoutPlans: WorkoutPlan[];
  setWorkoutPlans: React.Dispatch<React.SetStateAction<WorkoutPlan[]>>;
  selectedPlan: string | null;
  setSelectedPlan: React.Dispatch<React.SetStateAction<string | null>>;
}

const daysOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

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

  // -------- Apply Plan --------
  const applyWorkoutPlan = (planId: string) => {
    setSelectedPlan(planId);
    setSelectedDay(null);
  };

  // -------- Optimistic Add/Remove Workout --------
  const addWorkoutToDay = (day: string, workoutId: string) => {
    if (!selectedPlan) return;

    setWorkoutPlans((prev) =>
      prev.map((plan) => {
        if (plan._id !== selectedPlan) return plan;

        const updatedDays = plan.days.map((d) => {
          if (d.day !== day) return d;

          const updatedWorkouts = d.workouts.includes(workoutId)
            ? d.workouts.filter((id) => id !== workoutId)
            : [...d.workouts, workoutId];

          return { ...d, workouts: updatedWorkouts };
        });

        return { ...plan, days: updatedDays };
      })
    );
  };

  // -------- Get Workouts for Selected Day --------
  const getWorkoutsForDay = (day: string) => {
    if (!selectedPlan) return [];
    const plan = workoutPlans.find((p) => p._id === selectedPlan);
    if (!plan) return [];

    const dayObj = plan.days.find((d) => d.day === day);
    return (dayObj?.workouts || [])
      .map((id) => workoutData.find((w) => w._id === id))
      .filter(Boolean) as WorkoutSection[];
  };

  // -------- Create / Update Schedule --------
  const handleCreateSchedule = async (schedule: WorkoutPlan) => {
    try {
      // Convert days object to array format expected by backend
      const daysArray = Object.entries(schedule.days).map(
        ([day, workouts]) => ({
          day,
          workouts,
        })
      );

      const payload: any = {
        name: schedule.name,
        description: schedule.description,
        days: daysArray,
      };
      let response: any;
      if (editingSchedule) {
        response = await updateSchedule(editingSchedule._id, payload);
        setWorkoutPlans((prev) =>
          prev.map((p) => (p._id === editingSchedule._id ? response.data : p))
        );
        Toast.show({
          type: "success",
          text1: "Schedule updated!",
          text2: "dd",
        });
      } else {
        response = await createSchedule(payload);
        setWorkoutPlans((prev) => [...prev, response.data]);
        Toast.show({ type: "success", text1: "Schedule created!" });
      }

      setSelectedPlan(response.data._id);
      setEditingSchedule(null);
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Failed to save schedule",
        text2: error?.message || "Please try again",
      });
    }
  };
  // -------- Delete Schedule --------
  const deleteCustomSchedule = (planId: string) => {
    Alert.alert("Delete Schedule", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setWorkoutPlans((prev) => prev.filter((p) => p._id !== planId));
          if (selectedPlan === planId) {
            setSelectedPlan(null);
            setSelectedDay(null);
          }
        },
      },
    ]);
  };

  // -------- Edit Schedule --------
  const editCustomSchedule = (plan: WorkoutPlan) => {
    setEditingSchedule(plan);
    setShowCreateScheduleModal(true);
  };
  const saveWorkoutsForDay = async () => {
    if (!selectedPlan) return;

    const plan = workoutPlans.find((p) => p._id === selectedPlan);
    if (!plan) return;

    // Convert days object to array format expected by backend
    const daysArray = plan.days.map((d) => ({
      day: d.day,
      workouts: d.workouts,
    }));

    const payload = {
      name: plan.name,
      description: plan.description,
      days: daysArray,
    };

    try {
      const response = await updateSchedule(plan._id, payload);
      setWorkoutPlans((prev) =>
        prev.map((p) => (p._id === plan._id ? response.data : p))
      );
      Toast.show({ type: "success", text1: "Workouts saved!" });
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Failed to save workouts",
        text2: error?.response?.data?.message || "Please try again",
      });
    }
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

        {/* Plans */}
        {workoutPlans.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
          >
            {workoutPlans.map((plan) => (
              <View key={plan._id} className="mr-3" style={{ width: 150 }}>
                <Pressable
                  onPress={() => applyWorkoutPlan(plan._id)}
                  className={`bg-white p-4 rounded-lg shadow-sm ${
                    selectedPlan === plan._id
                      ? "border-2 border-blue-500"
                      : "border border-gray-200"
                  }`}
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
                    <Ionicons name="create-outline" size={16} color="#3b82f6" />
                  </Pressable>
                  <Pressable
                    onPress={() => deleteCustomSchedule(plan._id)}
                    className="p-1 mx-1"
                  >
                    <Ionicons name="trash-outline" size={16} color="#ef4444" />
                  </Pressable>
                </View>
              </View>
            ))}
          </ScrollView>
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
                const plan: any = workoutPlans.find(
                  (p) => p._id === selectedPlan
                );
                const hasWorkouts =
                  plan?.days.find((d: any) => d.day === day)?.workouts.length >
                  0;

                return (
                  <Pressable
                    key={day}
                    onPress={() => setSelectedDay(day)}
                    className={`px-4 py-2 rounded-full mr-2 flex-row items-center ${
                      selectedDay === day
                        ? "bg-blue-500"
                        : hasWorkouts
                          ? "bg-green-100"
                          : "bg-gray-200"
                    }`}
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
                </View>
              ))
            ) : (
              <View className="bg-gray-100 p-4 rounded-lg mb-4">
                <Text className="text-gray-500 text-center">
                  No workouts scheduled for this day
                </Text>
              </View>
            )}
            {selectedDay && (
              <Pressable
                onPress={saveWorkoutsForDay}
                className="bg-blue-500 py-2 px-4 rounded-lg mt-4 mb-6 items-center"
              >
                <Text className="text-white font-medium">Save Workouts</Text>
              </Pressable>
            )}

            {/* Add Workout to Day */}
            {/* Add Workout to Day */}
            <Text className="text-gray-600 font-medium mt-5 mb-2">
              Available Workouts
            </Text>
            {workoutData.map((workout) => {
              const isAdded = getWorkoutsForDay(selectedDay).some(
                (w) => w._id === workout._id
              );
              return (
                <Pressable
                  key={workout._id}
                  onPress={() => addWorkoutToDay(selectedDay!, workout._id)}
                  className={`flex-row items-center justify-between p-3 rounded-lg mb-2 ${isAdded ? "bg-blue-100" : "bg-gray-100"}`}
                >
                  <View className="flex-row items-center">
                    <Ionicons
                      name={isAdded ? "checkmark-circle" : "add-circle"}
                      size={20}
                      color={isAdded ? "#3b82f6" : "#6b7280"}
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
              );
            })}
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
