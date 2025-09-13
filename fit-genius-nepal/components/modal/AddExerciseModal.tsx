import { createExercise } from "@/api/workoutApi";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import Checkbox from "expo-checkbox";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { EquipmentType, WorkoutSection } from "../../types/workoutType";

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

const equipmentOptions = [
  "barbell",
  "dumbbell",
  "machine",
  "bodyweight",
  "kettlebell",
  "bands",
  "other",
];

const AddExerciseModal: React.FC<AddExerciseModalProps> = ({
  visible,
  onClose,
  selectedWorkoutSection,
  workoutData,
  setWorkoutData,
  editingExerciseId,
}) => {
  const [newExerciseName, setNewExerciseName] = useState("");
  const [description, setDescription] = useState("");
  const [equipment, setEquipment] = useState<EquipmentType | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [imageOption, setImageOption] = useState<"url" | "upload" | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFromDevice, setImageFromDevice] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      if (editingExerciseId && selectedWorkoutSection) {
        const workout = workoutData.find(
          (w) => w._id === selectedWorkoutSection
        );
        if (workout) {
          const exercise = workout.exercises.find(
            (e) => e._id === editingExerciseId
          );
          if (exercise) {
            setNewExerciseName(exercise.name);
            setDescription(exercise.description || "");
            setEquipment(exercise.equipment || null);
            setIsPublic(exercise.isPublic || false);
            setImageUrl(exercise.imageUrl || "");
            setImageFromDevice(exercise.imageUrl || null);
            setImageOption(exercise.imageUrl ? "url" : null);
          }
        }
      } else {
        resetForm();
      }
    }
  }, [visible, editingExerciseId, selectedWorkoutSection, workoutData]);

  const resetForm = () => {
    setNewExerciseName("");
    setDescription("");
    setEquipment(null);
    setIsPublic(false);
    setImageUrl("");
    setImageFromDevice(null);
    setImageOption(null);
  };

  const pickImageFromDevice = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "We need camera roll permissions to upload an image."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setImageFromDevice(uri);
        setImageUrl("");
        setImageOption("upload");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "We need camera permissions to take a photo."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setImageFromDevice(uri);
        setImageUrl("");
        setImageOption("upload");
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };

  const showImageOptions = () => {
    Alert.alert("Exercise Image", "Choose an option", [
      { text: "Take Photo", onPress: takePhoto },
      { text: "Choose from Gallery", onPress: pickImageFromDevice },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleCreateExercise = async () => {
    if (!newExerciseName.trim()) return;

    const exerciseData = {
      workoutId: workoutData.find((w) => w._id === selectedWorkoutSection)?._id,
      name: newExerciseName.trim(),
      description,
      equipment: equipment,
      isPublic,
      workoutImage:
        imageOption === "url"
          ? imageUrl
          : imageOption === "upload"
            ? imageFromDevice
            : null,
    };
    setWorkoutData((prev: any) =>
      prev.map((workout: any) =>
        workout._id === selectedWorkoutSection
          ? {
              ...workout,
              exercises: [...workout.exercises, exerciseData],
            }
          : workout
      )
    );
    try {
      const data = await createExercise(exerciseData as any);
      console.log(data, "exercise rspondata");
      if (data?.status === 201) {
        Toast.show({
          type: "success",
          text1: "Exercise",
          text2: data?.message,
        });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Exercise",
        text2: error?.message,
      });
    }

    onClose();
  };

  const workoutName =
    workoutData.find((w) => w._id === selectedWorkoutSection)?.name ||
    "this workout";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white flex flex-col gap-3 p-4 rounded-t-3xl max-h-2/3">
            <View className="flex-row justify-between items-center">
              <Text className="text-xl font-bold text-gray-900">
                {editingExerciseId
                  ? "Edit Exercise"
                  : `Add Exercise to ${workoutName}`}
              </Text>
              <Pressable onPress={onClose} className="p-1">
                <Ionicons name="close" size={24} color="#6b7280" />
              </Pressable>
            </View>

            <TextInput
              placeholder="Enter exercise name"
              value={newExerciseName}
              onChangeText={setNewExerciseName}
              className="border border-gray-300 rounded-xl p-4 text-gray-800 "
              autoFocus
            />

            <TextInput
              placeholder="Enter description (optional)"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={2}
              className="border border-gray-300 rounded-xl p-4 text-gray-800"
              textAlignVertical="top"
            />

            <View className="border border-gray-300 rounded-xl overflow-hidden mb-5">
              <Picker
                className="p-4"
                selectedValue={equipment}
                onValueChange={setEquipment}
                dropdownIconColor="#6b7280"
              >
                <Picker.Item label="Select equipment type" value={null} />
                {equipmentOptions.map((eq) => (
                  <Picker.Item
                    key={eq}
                    label={eq.charAt(0).toUpperCase() + eq.slice(1)}
                    value={eq}
                  />
                ))}
              </Picker>
            </View>

            <Text className="text-sm font-medium text-gray-700  ">
              Exercise Image (Optional)
            </Text>

            {/* Image Selection Options */}
            <View className="flex-row   space-x-3">
              <Pressable
                onPress={() => {
                  setImageOption(imageOption === "url" ? null : "url");
                  setImageFromDevice(null);
                }}
                className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border ${
                  imageOption === "url"
                    ? "bg-blue-50 border-blue-500"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <Ionicons
                  name="link"
                  size={20}
                  color={imageOption === "url" ? "#3b82f6" : "#6b7280"}
                />
                <Text
                  className={`ml-2 font-medium ${imageOption === "url" ? "text-blue-500" : "text-gray-700"}`}
                >
                  URL
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setImageOption("upload");
                  showImageOptions();
                }}
                className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border ${
                  imageOption === "upload"
                    ? "bg-blue-50 border-blue-500"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <Ionicons
                  name="camera"
                  size={20}
                  color={imageOption === "upload" ? "#3b82f6" : "#6b7280"}
                />
                <Text
                  className={`ml-2 font-medium ${imageOption === "upload" ? "text-blue-500" : "text-gray-700"}`}
                >
                  Upload
                </Text>
              </Pressable>
            </View>

            {/* URL Input */}
            {imageOption === "url" && (
              <View className="mb-5">
                <TextInput
                  placeholder="Paste image URL here"
                  value={imageUrl}
                  onChangeText={setImageUrl}
                  className="border border-gray-300 rounded-xl p-4 text-gray-800"
                />
              </View>
            )}

            {/* Uploaded Image Preview */}
            {imageOption === "upload" && imageFromDevice && (
              <View className="mb-5">
                <Image
                  source={{ uri: imageFromDevice }}
                  className="w-full h-40 rounded-xl"
                  resizeMode="cover"
                />
                <Pressable
                  onPress={() => {
                    setImageFromDevice(null);
                    setImageOption(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 rounded-full p-1"
                >
                  <Ionicons name="close" size={16} color="white" />
                </Pressable>
              </View>
            )}

            <View className="flex-row items-center mb-6 mt-2">
              <Checkbox
                value={isPublic}
                onValueChange={setIsPublic}
                color={isPublic ? "#3b82f6" : undefined}
                className="mr-3 w-5 h-5"
              />
              <Text className="text-gray-700">
                Share this exercise publicly
              </Text>
            </View>

            <View className="flex-row justify-end space-x-3">
              <Pressable
                onPress={onClose}
                className="px-5 py-3 rounded-xl bg-gray-100"
              >
                <Text className="text-gray-700 font-medium">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleCreateExercise}
                className="px-5 py-3 rounded-xl bg-blue-500"
                disabled={!newExerciseName.trim()}
              >
                <Text className="text-white font-medium">
                  {editingExerciseId ? "Save Changes" : "Create Exercise"}
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
