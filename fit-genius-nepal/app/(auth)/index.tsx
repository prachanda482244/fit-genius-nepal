import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import React from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginPage() {
  const navigate = useNavigation();
  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 bg-neutral-light">
        <View className="flex-1 justify-center items-center px-6 py-10">
          {/* Image Header */}
          <ImageBackground
            source={{
              uri: "https://media.istockphoto.com/id/1201921593/photo/3d-render-gym-fitness-center.jpg?s=1024x1024&w=is&k=20&c=dP2edv4oWGoKB1Oo2GDwA9vJAVuloJwLknPldJb4aR0=",
            }} // replace with your gym image
            className="w-full h-[560px] rounded-xl overflow-hidden mb-6"
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
          <Pressable
            className="w-full bg-primary py-3 rounded-full mb-4 items-center"
            onPress={() => router.push("/login")}
          >
            <Text className="text-white font-body text-lg">Log In</Text>
          </Pressable>

          <Pressable
            className="w-full bg-neutral-light py-3 rounded-full border border-gray-300 mb-6 items-center"
            onPress={() => router.push("/register")}
          >
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
          <Pressable className="w-full gap-2 py-3 rounded-full border border-gray-300 flex-row justify-center items-center mb-6">
            <Ionicons name="logo-google" size={24} color="#DB4437" />

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
