import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
} from "react-native";
import React, { useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import api from "../api";

const VerifyCode = () => {
  const params = useLocalSearchParams();
  const { email } = params;
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputs: any = useRef([]);

  const focusNextField = (index: number) => {
    if (index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const focusPreviousField = (index, value) => {
    if (value === "" && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleChange = (text, index) => {
    // Allow only numbers
    const numericText = text.replace(/[^0-9]/g, "");

    if (numericText.length <= 1) {
      const newCode = [...code];
      newCode[index] = numericText;
      setCode(newCode);

      if (numericText !== "") {
        focusNextField(index);
      } else {
        focusPreviousField(index, numericText);
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && code[index] === "" && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join("");
    const { data } = await api.post("/auth/verify-email", {
      email,
      code: verificationCode,
    });
    console.log(data, "data");

    if (data?.status === 200) {
      Alert.alert("Success", data?.message);
      router.push("/");
    } else {
      Alert.alert("Error", "Please enter a complete 6-digit code");
    }
  };

  const handleResend = () => {
    Alert.alert(
      "Code Resent",
      "A new verification code has been sent to your email."
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-8 justify-center">
        {/* Header */}
        <View className="items-center mb-12">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Verification Code
          </Text>
          <Text className="text-lg text-gray-500 text-center">
            Check your email
          </Text>
        </View>

        {/* Description */}
        <View className="mb-10">
          <Text className="text-base text-gray-600 text-center leading-6">
            We've sent a 6-digit code to your email address.
          </Text>
        </View>

        {/* Code Inputs */}
        <View className="flex-row justify-between mb-10">
          {code.map((digit, index) => (
            <TextInput
              key={index}
              className={`w-14 h-14 border-2 text-center text-xl font-bold rounded-xl
                  ${digit !== "" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="numeric"
              maxLength={1}
              ref={(ref) => (inputs.current[index] = ref)}
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          className={`rounded-xl p-5 items-center mb-8
              ${code.join("").length === 6 ? "bg-blue-600" : "bg-blue-300"}`}
          onPress={handleVerify}
          disabled={code.join("").length !== 6}
        >
          <Text className="text-white text-lg font-semibold">Verify</Text>
        </TouchableOpacity>

        {/* Resend Code */}
        <View className="flex-row justify-center">
          <Text className="text-gray-500 text-base">
            Didn't receive the code?{" "}
          </Text>
          <TouchableOpacity onPress={handleResend}>
            <Text className="text-blue-600 text-base font-semibold">
              Resend Code
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VerifyCode;
