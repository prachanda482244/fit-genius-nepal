import "@/global.css";
import { Slot } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { bootstrapAuthFromStorage, useAuthStore } from "../store/auth.store";

export default function RootLayout() {
  const loading = useAuthStore((s) => s.loading);
  const accessToken = useAuthStore((s) => s.accessToken);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    (async () => {
      await bootstrapAuthFromStorage();
      setBootstrapped(true);
    })();
  }, []);

  if (!bootstrapped || loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      {/* Authenticated vs Non-authenticated routes */}
      <Slot initialRouteName={accessToken ? "(tabs)" : "(auth)"} />

      <Toast
        config={{
          // ✅ Success toast
          success: (props) => (
            <BaseToast
              {...props}
              style={{
                borderLeftColor: "#32CD32", // bright green accent
                backgroundColor: "#222", // dark background
              }}
              contentContainerStyle={{ paddingHorizontal: 15 }}
              text1Style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "#fff",
              }}
              text2Style={{
                color: "#ccc",
              }}
            />
          ),

          // ✅ Error toast
          error: (props) => (
            <ErrorToast
              {...props}
              style={{
                borderLeftColor: "#FF4500", // red accent
                backgroundColor: "#222", // dark background
              }}
              text1Style={{
                color: "#fff",
                fontWeight: "bold",
              }}
              text2Style={{
                color: "#ccc",
              }}
            />
          ),

          // ✅ Info toast
          info: (props) => (
            <BaseToast
              {...props}
              style={{
                borderLeftColor: "#FFD700", // yellow accent
                backgroundColor: "#222",
              }}
              text1Style={{ color: "#fff", fontWeight: "bold" }}
              text2Style={{ color: "#ccc" }}
            />
          ),
        }}
        position="top"
        topOffset={70}
      />
    </>
  );
}
