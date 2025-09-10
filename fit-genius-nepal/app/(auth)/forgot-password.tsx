import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const ForgotPassword = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center px-6"
      >
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-3 text-center">
            Forgot Password?
          </Text>
          <Text className="text-base text-gray-600 text-center leading-6">
            No worries, we'll send you reset instructions.
          </Text>
        </View>

        <View className="w-full">
          <Text className="text-base font-medium text-gray-700 mb-2">
            Enter your email
          </Text>
          <TextInput
            className="bg-white border border-gray-300 rounded-lg p-4 mb-6 text-base"
            placeholder="Email address"
            placeholderTextColor="#A0AEC0"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity
            onPress={() => router.push("/verify-code")}
            className="bg-blue-600 rounded-lg p-4 items-center"
          >
            <Text className="text-white text-base font-semibold">
              Reset Password
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
