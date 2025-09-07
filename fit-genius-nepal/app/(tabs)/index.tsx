import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";

const Home = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl">Home</Text>
      <Link href="/(auth)/login">Login</Link>
      <Link href="/cart">Cart</Link>
    </View>
  );
};

export default Home;
