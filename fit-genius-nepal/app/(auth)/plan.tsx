import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const Plan = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <View className="px-5 pt-5 pb-4">
          <Text className="text-2xl font-bold text-gray-900 text-center">
            Payment
          </Text>
          <Text className="text-lg text-gray-600 text-center mt-1">
            Choose your plan
          </Text>
        </View>

        {/* Free Plan Card */}
        <View className="px-5 mt-4">
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <View className="flex-row justify-between items-start mb-4">
              <View>
                <Text className="text-xl font-bold text-gray-900">Free</Text>
                <Text className="text-gray-600 mt-1">$0 /month</Text>
              </View>
              <View className="bg-blue-100 px-3 py-1 rounded-full">
                <Text className="text-blue-800 text-sm font-medium">
                  Current Plan
                </Text>
              </View>
            </View>

            <View className="mt-4">
              <View className="flex-row items-center mb-3">
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text className="text-gray-700 ml-2">Basic features</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text className="text-gray-700 ml-2">Limited access</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Premium Plan Card */}
        <View className="px-5 mt-6">
          <View className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-500 relative overflow-hidden">
            {/* Popular Badge */}
            <View className="absolute top-0 right-0 bg-blue-500 px-3 py-1 rounded-bl-lg">
              <Text className="text-white text-xs font-semibold">
                NEXT POPULAR
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-xl font-bold text-gray-900">Premium</Text>
              <Text className="text-gray-600 mt-1">$9.99 /month</Text>
            </View>

            <TouchableOpacity className="bg-blue-600 py-3 rounded-xl items-center mb-5">
              <Text className="text-white font-semibold">
                Upgrade to Premium
              </Text>
            </TouchableOpacity>

            <View className="mt-2">
              <View className="flex-row items-center mb-3">
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text className="text-gray-700 ml-2">Advanced features</Text>
              </View>
              <View className="flex-row items-center mb-3">
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text className="text-gray-700 ml-2">No ads</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text className="text-gray-700 ml-2">Exclusive content</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Additional Info */}
        <View className="px-5 mt-6 mb-8">
          <Text className="text-gray-500 text-center text-sm">
            Your subscription will automatically renew unless canceled at least
            24 hours before the end of the current period.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Plan;
