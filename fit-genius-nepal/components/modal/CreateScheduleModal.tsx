import { daysOfWeek } from "@/data/predinedWorkout";
import { CreateScheduleForm, WorkoutPlan } from "@/types/workoutType";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface CreateScheduleModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateSchedule: (schedule: WorkoutPlan) => void;
  editingSchedule?: WorkoutPlan | null;
}

const CreateScheduleModal: React.FC<CreateScheduleModalProps> = ({
  visible,
  onClose,
  onCreateSchedule,
  editingSchedule,
}) => {
  const [formData, setFormData] = useState<CreateScheduleForm>({
    name: "",
    description: "",
    selectedDays: [],
  });

  // Initialize form when modal opens
  React.useEffect(() => {
    if (visible) {
      if (editingSchedule) {
        setFormData({
          name: editingSchedule.name,
          description: editingSchedule.description,
          selectedDays: Object.entries(editingSchedule.days)
            .filter(([_, workouts]) => workouts.length > 0)
            .map(([day]) => day),
        });
      } else {
        setFormData({
          name: "",
          description: "",
          selectedDays: [],
        });
      }
    }
  }, [visible, editingSchedule]);

  const toggleDaySelection = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter((d) => d !== day)
        : [...prev.selectedDays, day],
    }));
  };

  const handleCreateSchedule = () => {
    if (formData.name.trim() && formData.description.trim()) {
      // Create days object with selected days
      const days: { [key: string]: string[] } = {};
      daysOfWeek.forEach((day) => {
        days[day] = formData.selectedDays.includes(day) ? [] : [];
      });

      const newSchedule: WorkoutPlan = {
        id: editingSchedule?.id || Date.now().toString(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        days,
      };

      onCreateSchedule(newSchedule);
      onClose();
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
          <View className="bg-white p-6 rounded-t-3xl max-h-4/5">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-xl font-bold text-gray-900">
                {editingSchedule ? "Edit Schedule" : "Create New Schedule"}
              </Text>
              <Pressable onPress={onClose} className="p-1">
                <Ionicons name="close" size={24} color="#6b7280" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-gray-600 mb-4">
                {editingSchedule
                  ? "Edit your schedule details"
                  : "Create a custom workout schedule"}
              </Text>

              <TextInput
                placeholder="Schedule Name"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, name: text }))
                }
                className="border border-gray-300 rounded-xl p-4 text-gray-800 mb-4"
                autoFocus={true}
              />

              <TextInput
                placeholder="Schedule Description"
                value={formData.description}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, description: text }))
                }
                className="border border-gray-300 rounded-xl p-4 text-gray-800 mb-6"
                multiline={true}
                numberOfLines={3}
              />

              <Text className="text-gray-700 font-medium mb-3">
                Select Workout Days
              </Text>
              <View className="flex-row flex-wrap mb-6">
                {daysOfWeek.map((day) => (
                  <Pressable
                    key={day}
                    onPress={() => toggleDaySelection(day)}
                    className={`px-4 py-2 rounded-full m-1 ${formData.selectedDays.includes(day) ? "bg-blue-500" : "bg-gray-200"}`}
                  >
                    <Text
                      className={
                        formData.selectedDays.includes(day)
                          ? "text-white"
                          : "text-gray-700"
                      }
                    >
                      {day.substring(0, 3)}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <View className="flex-row justify-end space-x-3 mb-4">
                <Pressable
                  onPress={onClose}
                  className="px-5 py-3 rounded-xl bg-gray-100"
                >
                  <Text className="text-gray-700 font-medium">Cancel</Text>
                </Pressable>

                <Pressable
                  onPress={handleCreateSchedule}
                  className="px-5 py-3 rounded-xl bg-blue-500"
                  disabled={
                    !formData.name.trim() || !formData.description.trim()
                  }
                >
                  <Text className="text-white font-medium">
                    {editingSchedule ? "Save Changes" : "Create Schedule"}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CreateScheduleModal;
