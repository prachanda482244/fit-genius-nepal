import Toast from "react-native-toast-message";

type ToastType = "success" | "error" | "info";

export const showToast = (
  message: string,
  type: ToastType = "success",
  title?: string
) => {
  Toast.show({
    type,
    text1: title || type.charAt(0).toUpperCase() + type.slice(1),
    text2: message,
    position: "top",
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 50,
  });
};
