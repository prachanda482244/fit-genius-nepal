import { useAuthStore } from "@/store/auth.store";
import { Redirect } from "expo-router";
import { ReactNode } from "react";
import { ActivityIndicator, View } from "react-native";

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  fallback?: ReactNode;
}

export const AuthGuard = ({
  children,
  requireAuth = true,
  fallback = (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  ),
}: AuthGuardProps) => {
  const { accessToken, loading } = useAuthStore();

  // Show loading while Zustand is hydrating or auth is loading
  if (loading) {
    return <>{fallback}</>;
  }

  // Redirect based on authentication requirements
  if (requireAuth && !accessToken) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!requireAuth && accessToken) {
    return <Redirect href="/(tabs)" />;
  }

  return <>{children}</>;
};
