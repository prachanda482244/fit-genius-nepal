// app/register.tsx
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { NavigationProp } from "@react-navigation/native";
import InputField from "../components/InputField";
import Toast from "react-native-toast-message";
import { api } from "@/utils/api";

// Define types
type RootStackParamList = {
  login: undefined;
  "forgot-password": undefined;
  "verify-code": { email: string };
};

type UserData = {
  name: string;
  email: string;
  password: string;
  profileImage: string | null;
};

type ImageInfo = {
  uri: string;
  width: number;
  height: number;
  type?: string;
};

type ValidationErrors = {
  name?: string;
  email?: string;
  password?: string;
};

export default function RegisterPage() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    password: "",
    profileImage: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const handleInputChange = (field: keyof UserData, value: string) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[field as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const pickImage = async (): Promise<void> => {
    try {
      // Request permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Sorry, we need camera roll permissions to upload an image."
        );
        return;
      }

      // Launch image picker with corrected MediaType
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const image: ImageInfo = result.assets[0];
        setUserData((prev) => ({
          ...prev,
          profileImage: image.uri,
        }));
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const takePhoto = async (): Promise<void> => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Sorry, we need camera permissions to take a photo."
        );
        return;
      }

      // Launch camera with corrected MediaType
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const image: ImageInfo = result.assets[0];
        setUserData((prev) => ({
          ...prev,
          profileImage: image.uri,
        }));
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };

  const showImageOptions = (): void => {
    Alert.alert("Profile Photo", "Choose an option", [
      {
        text: "Take Photo",
        onPress: takePhoto,
      },
      {
        text: "Choose from Gallery",
        onPress: pickImage,
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!userData.name.trim()) {
      errors.name = "Please enter your full name";
    }

    if (!userData.email.trim()) {
      errors.email = "Please enter your email address";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        errors.email = "Please enter a valid email address";
      }
    }

    if (!userData.password) {
      errors.password = "Please enter a password";
    } else if (userData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (): Promise<void> => {
    console.log("Registration data:", userData);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      const data = await api.register({ ...userData });
      console.log(data, "register");

      // Success caseif
      if (data.tokens) {
        Toast.show({
          type: "success",
          text1: "Registration",
          text2: "Registration complete",
        });

        navigation.navigate("verify-code", { email: userData.email });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Registration",
        text2: "Failed to register",
        position: "bottom",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="py-8">
          <Text className="text-3xl font-bold text-center mb-2 text-gray-900">
            Create Account
          </Text>
          <Text className="text-gray-500 text-center mb-8">
            Join Swastya Coach
          </Text>

          {/* Profile Image Upload */}
          {/* <View className="items-center mb-6">
            <TouchableOpacity
              onPress={showImageOptions}
              className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center border-2 border-dashed border-gray-300"
            >
              {userData.profileImage ? (
                <Image
                  source={{ uri: userData.profileImage }}
                  className="w-full h-full rounded-full"
                />
              ) : (
                <Ionicons name="camera" size={32} color="#6b7280" />
              )}
            </TouchableOpacity>
            <Text className="text-gray-600 text-sm mt-2">
              Add Profile Photo
            </Text>
          </View> */}

          {/* Form */}
          <View className="flex flex-col gap-2 mb-4">
            {/* Name Input */}
            <InputField
              icon={
                <Ionicons name="person-outline" size={20} color="#6b7280" />
              }
              placeholder="Full Name"
              value={userData.name}
              onChangeText={(value) => handleInputChange("name", value)}
              autoCapitalize="words"
              error={validationErrors.name}
              autoComplete="name"
            />

            {/* Email Input */}
            <InputField
              icon={<Ionicons name="mail-outline" size={20} color="#6b7280" />}
              placeholder="Email"
              value={userData.email}
              onChangeText={(value) => handleInputChange("email", value)}
              keyboardType="email-address"
              autoCapitalize="none"
              error={validationErrors.email}
              autoComplete="email"
            />

            {/* Password Input */}
            <InputField
              icon={
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#6b7280"
                />
              }
              placeholder="Password"
              value={userData.password}
              onChangeText={(value) => handleInputChange("password", value)}
              secureTextEntry={true}
              error={validationErrors.password}
              autoComplete="new-password"
            />
          </View>

          {/* Register Button */}
          <TouchableOpacity
            className="w-full bg-blue-600 py-4 rounded-xl mb-6 items-center justify-center"
            onPress={handleRegister}
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-semibold text-base">
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center w-full my-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500 text-sm">OR</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Social Login */}
          <Text className="text-center text-gray-600 mb-4">Register with</Text>

          <View className="flex-row justify-center gap-4 mb-8">
            {/* Google Button */}
            <TouchableOpacity
              className="flex-row items-center px-6 py-3 rounded-xl bg-white border border-gray-300"
              onPress={() => console.log("Register with Google")}
            >
              <Ionicons name="logo-google" size={20} color="#DB4437" />
              <Text className="text-gray-700 font-medium ml-2">Google</Text>
            </TouchableOpacity>

            {/* Facebook Button */}
            <TouchableOpacity
              className="flex-row items-center px-6 py-3 rounded-xl bg-blue-600"
              onPress={() => console.log("Register with Facebook")}
            >
              <Ionicons name="logo-facebook" size={20} color="white" />
              <Text className="text-white font-medium ml-2">Facebook</Text>
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-600">Already have an account? </Text>
            <Pressable onPress={() => navigation.navigate("login")}>
              <Text className="text-blue-600 font-semibold">Sign In</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
