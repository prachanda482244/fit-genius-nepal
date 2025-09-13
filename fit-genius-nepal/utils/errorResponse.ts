import axios from "axios";

export function handleApiError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const msg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";
    throw new Error(msg);
  } else {
    throw new Error("Unexpected error occurred");
  }
}
