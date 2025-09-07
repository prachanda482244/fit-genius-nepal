// app/register.js
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterPage() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    // Here you would typically handle registration logic
    Alert.alert("Success", "Account created successfully!");
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 bg-neutral-light px-6">
        <View className="py-10">
          <Text className="text-3xl font-bold text-center mb-2">
            Create Account
          </Text>
          <Text className="text-gray-500 text-center mb-10">
            Join Swastya Coach
          </Text>

          {/* Form */}
          <View className="flex flex-col gap-2 mb-4">
            {/* Email Input with Icon */}
            <View className="flex-row items-center bg-white p-4 rounded-xl border border-gray-300">
              <Ionicons
                name="mail-outline"
                size={20}
                color="#6b7280"
                className="mr-3"
              />
              <TextInput
                className="flex-1"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input with Icon */}
            <View className="flex-row items-center bg-white p-4 rounded-xl border border-gray-300">
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#6b7280"
                className="mr-3"
              />
              <TextInput
                className="flex-1"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          {/* Forgot Password */}
          <Pressable
            className="self-end mb-6"
            onPress={() => navigation.navigate("forgot-password")}
          >
            <Text className="text-primary font-medium">Forgot Password?</Text>
          </Pressable>

          {/* Register Button */}
          <Pressable
            className="w-full bg-primary py-4 rounded-xl mb-4 items-center"
            onPress={handleRegister}
          >
            <Text className="text-white font-body text-lg font-semibold">
              Register
            </Text>
          </Pressable>

          {/* Or Separator */}
          <View className="flex-row items-center w-full my-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500">OR</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Social Login */}
          <Text className="text-center text-gray-600 mb-4">Register with</Text>

          <View className="flex-row items-center justify-between w-11/12 mx-auto gap-4 mb-6">
            {/* Facebook Button */}
            <Pressable
              className="flex-row items-center px-4 py-2 rounded-md bg-blue-600 shadow-md flex-1 justify-center"
              onPress={() => Alert.alert("Facebook", "Register with Facebook")}
            >
              <Ionicons name="logo-facebook" size={24} color="white" />
              <Text className="text-white font-semibold text-lg ml-2">
                Facebook
              </Text>
            </Pressable>

            {/* Google Button */}
            <Pressable
              className="flex-row items-center px-4 py-2 rounded-md bg-white border border-gray-300 shadow-md flex-1 justify-center"
              onPress={() => Alert.alert("Google", "Register with Google")}
            >
              <Ionicons name="logo-google" size={24} color="#DB4437" />
              <Text className="text-gray-800 font-semibold text-lg ml-2">
                Google
              </Text>
            </Pressable>
          </View>

          {/* Already have an account? */}
          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-600">Already have an account? </Text>
            <Pressable onPress={() => navigation.navigate("login")}>
              <Text className="text-primary font-semibold">Login</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
