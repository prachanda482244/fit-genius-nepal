import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
const Home = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Toast />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-5">
          <Text className="text-3xl font-bold text-gray-900">Home</Text>
        </View>
        {/* Today's Workout Card */}
        <View className="px-5 mt-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Today's Workout
          </Text>
          <View className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <Text className="text-xl font-bold text-gray-900 mb-1">
              Full Body Strength
            </Text>
            <Text className="text-gray-600 mb-4">
              Build strength and endurance with this full-body workout.
            </Text>

            <View className="flex-row items-center mb-5">
              <View className="flex-row items-center mr-4">
                <Ionicons name="time-outline" size={16} color="#4B5563" />
                <Text className="text-gray-600 ml-1">45 min</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="barbell-outline" size={16} color="#4B5563" />
                <Text className="text-gray-600 ml-1">Full Body</Text>
              </View>
            </View>

            <TouchableOpacity
              className="bg-blue-600 py-4 rounded-xl items-center"
              onPress={() =>
                Alert.alert(
                  "Starting Workout",
                  "Full Body Strength workout begins now!"
                )
              }
            >
              <Text className="text-white font-semibold text-base">
                Start Workout
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Your Progress Section */}
        <View className="px-5 mt-8">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Your Progress
          </Text>
          <View className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-base font-semibold text-gray-900">
                Weekly Workouts
              </Text>
              <View className="flex-row items-center bg-green-100 px-2 py-1 rounded-full">
                <Ionicons name="trending-up" size={14} color="#059669" />
                <Text className="text-green-800 text-xs font-medium ml-1">
                  +20% vs last week
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-3xl font-bold text-gray-900">4</Text>
              <Text className="text-gray-500 text-sm">New</Text>
            </View>

            {/* Weekday Progress */}
            <View className="flex-row justify-between mt-4">
              {["Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"].map(
                (day, index) => (
                  <View key={index} className="items-center">
                    <Text className="text-gray-500 text-xs mb-1">{day}</Text>
                    <View
                      className={`w-8 h-8 rounded-full ${index < 4 ? "bg-blue-500" : "bg-gray-200"} flex items-center justify-center`}
                    >
                      {index < 4 && (
                        <Ionicons name="checkmark" size={16} color="white" />
                      )}
                    </View>
                  </View>
                )
              )}
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-5 mt-8">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Quick Actions
          </Text>
          <View className="flex-row justify-between">
            <TouchableOpacity
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 w-[48%] items-center"
              onPress={() => Alert.alert("Add Workout", "Create a new workout")}
            >
              <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-3">
                <Ionicons name="add" size={24} color="#3B82F6" />
              </View>
              <Text className="text-gray-900 font-medium">Add Workout</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 w-[48%] items-center"
              onPress={() =>
                Alert.alert("Browse Exercises", "Explore exercise library")
              }
            >
              <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-3">
                <Ionicons name="search" size={24} color="#3B82F6" />
              </View>
              <Text className="text-gray-900 font-medium">
                Browse Exercises
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Inspiration Quote */}
        <View className="px-5 mt-8 mb-10">
          <View className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
            <Text className="text-gray-800 text-center italic mb-1">
              "The only bad workout is the one that didn't happen."
            </Text>
            <Text className="text-gray-600 text-center">- Unknown</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
