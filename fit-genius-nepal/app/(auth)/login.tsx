import { login } from "@/api/authApi";
import InputField from "@/components/InputField";
import { useAuthStore } from "@/store/auth.store";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import { router, useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

// types for navigation
type RootStackParamList = {
  register: undefined;
  "forgot-password": undefined;
};

type UserData = {
  email: string;
  password: string;
};

type ValidationErrors = {
  email?: string;
  password?: string;
};

export default function LoginPage() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [userData, setUserData] = useState<UserData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  // handle input changes
  const handleInputChange = (field: keyof UserData, value: string) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // validate inputs
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!userData.email.trim()) {
      errors.email = "Please enter your email address";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        errors.email = "Please enter a valid email address";
      }
    }

    if (!userData.password) {
      errors.password = "Please enter your password";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // handle login
  const handleLogin = async (): Promise<void> => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const user = await login({
        email: userData?.email,
        password: userData?.password,
      });

      if (user?._id) {
        Toast.show({
          type: "success",
          text1: "Login",
          text2: "Welcome back",
        });
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Login",
        text2: error?.message || "Invalid email or password",
        //   position: "bottom",
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
        <View className="py-12">
          <Text className="text-3xl font-bold text-center mb-2 text-gray-900">
            Welcome Back
          </Text>
          <Text className="text-gray-500 text-center mb-8">
            Login to continue
          </Text>

          {/* Form */}
          <View className="flex flex-col gap-2 mb-4">
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
              autoComplete="password"
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            className="w-full bg-blue-600 py-4 rounded-xl mb-6 items-center justify-center"
            onPress={handleLogin}
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-semibold text-base">Login</Text>
            )}
          </TouchableOpacity>

          {/* Forgot Password */}
          <Pressable
            onPress={() => navigation.navigate("forgot-password")}
            className="mb-6"
          >
            <Text className="text-blue-600 text-center font-semibold">
              Forgot your password?
            </Text>
          </Pressable>

          {/* Divider */}
          <View className="flex-row items-center w-full my-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500 text-sm">OR</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Register Link */}
          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-600">Don’t have an account? </Text>
            <Pressable onPress={() => router.push("/(auth)/register")}>
              <Text className="text-blue-600 font-semibold">Sign up</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
