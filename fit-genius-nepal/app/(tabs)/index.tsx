import React from "react";
import "@/global.css";
import {
  View,
  Text,
  ImageBackground,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView>
      <ScrollView className="flex-1 bg-neutral-light">
        <View className="flex-1 justify-center items-center px-6 py-10">
          {/* Image Header */}
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1599058917215-437b7b1e53f6?auto=format&fit=crop&w=800&q=80",
            }} // replace with your gym image
            className="w-full h-64 rounded-xl overflow-hidden mb-6"
          >
            <View className="absolute bottom-4 left-4">
              <Text className="text-white text-3xl font-heading font-bold">
                Fitness Hub
              </Text>
              <Text className="text-white text-base mt-1">
                Your ultimate workout companion.
              </Text>
            </View>
          </ImageBackground>

          {/* Buttons */}
          <Pressable className="w-full bg-primary py-3 rounded-xl mb-4 items-center">
            <Text className="text-white font-body text-lg">Log In</Text>
          </Pressable>

          <Pressable className="w-full bg-neutral-light py-3 rounded-xl border border-gray-300 mb-6 items-center">
            <Text className="text-neutral-dark font-body text-lg">
              Register
            </Text>
          </Pressable>

          {/* Or Separator */}
          <View className="flex-row items-center w-full mb-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-2 text-gray-500">OR</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Google Login */}
          <Pressable className="w-full py-3 rounded-xl border border-gray-300 flex-row justify-center items-center mb-6">
            <ImageBackground
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
              }}
              className="w-5 h-5 mr-2"
            />
            <Text className="text-gray-700 font-body text-lg">
              Continue with Google
            </Text>
          </Pressable>

          {/* Terms */}
          <Text className="text-gray-400 text-xs text-center px-4">
            By continuing, you agree to our{" "}
            <Text className="underline">Terms of Service</Text> and{" "}
            <Text className="underline">Privacy Policy</Text>.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
