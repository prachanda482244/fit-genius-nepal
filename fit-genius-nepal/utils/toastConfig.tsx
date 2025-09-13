import { BaseToast, ErrorToast } from "react-native-toast-message";

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#32CD32",
        backgroundColor: "#222",
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
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "#FF4500",
        backgroundColor: "#222",
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
  info: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#FFD700",
        backgroundColor: "#222",
      }}
      text1Style={{ color: "#fff", fontWeight: "bold" }}
      text2Style={{ color: "#ccc" }}
    />
  ),
};
