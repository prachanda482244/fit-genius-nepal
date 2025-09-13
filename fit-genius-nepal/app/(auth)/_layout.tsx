// app/(auth)/_layout.tsx
import { AuthGuard } from "@/components/AuthGuard";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <AuthGuard requireAuth={false}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="verify-code" />
      </Stack>
    </AuthGuard>
  );
}
