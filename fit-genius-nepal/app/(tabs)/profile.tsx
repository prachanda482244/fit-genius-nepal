import { logout } from "@/api/authApi";
import { useAuthStore } from "@/store/auth.store";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const user = useAuthStore((u) => u.user);
  const clearAuth = useAuthStore((u) => u.clearAuth);
  const handleLogout = async () => {
    await logout();
    clearAuth();
    router.replace("/login");
  };
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header Section */}
        <View className="items-center py-8 bg-white">
          <View className="w-24 h-24 bg-blue-500 rounded-full items-center justify-center mb-4">
            <Text className="text-white text-3xl font-bold">PR</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900">{user?.name}</Text>
          <Text className="text-gray-600 mt-1">{user?.email}</Text>
        </View>

        {/* Divider */}
        <View className="h-4 bg-gray-100" />

        {/* Account Section */}
        <View className="bg-white px-5">
          <Text className="text-gray-500 font-semibold text-sm pt-5 pb-3">
            ACCOUNT
          </Text>

          <Pressable className="flex-row justify-between items-center py-4 border-b border-gray-100">
            <Text className="text-gray-900">Personal Information</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </Pressable>

          <Pressable className="flex-row justify-between items-center py-4 border-b border-gray-100">
            <Text className="text-gray-900">Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </Pressable>

          <Pressable className="flex-row justify-between items-center py-4 border-b border-gray-100">
            <Text className="text-gray-900">Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </Pressable>

          <Pressable className="flex-row justify-between items-center py-4 border-b border-gray-100">
            <Text className="text-gray-900">Privacy</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </Pressable>
        </View>

        {/* Support Section */}
        <View className="bg-white px-5 mt-6">
          <Text className="text-gray-500 font-semibold text-sm pt-5 pb-3">
            SUPPORT
          </Text>

          <Pressable className="flex-row justify-between items-center py-4 border-b border-gray-100">
            <Text className="text-gray-900">Help Center</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </Pressable>

          <Pressable className="flex-row justify-between items-center py-4 border-b border-gray-100">
            <Text className="text-gray-900">Contact Us</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </Pressable>
        </View>

        {/* Logout Button */}
        <Pressable
          onPress={handleLogout}
          className="mx-5 my-8 bg-red-500 py-4 rounded-lg items-center"
        >
          <Text className="text-white font-semibold">Logout</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
