import { Text, TextInput, View } from "react-native";

// Custom Input Field Component
interface InputFieldProps {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  error?: string;
  autoComplete?: string | any;
}

const InputField: React.FC<InputFieldProps> = ({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  error,
  autoComplete,
}) => {
  return (
    <View className="mb-4">
      <View
        className={`flex-row items-center bg-gray-50 p-4 rounded-xl border ${
          error ? "border-red-500" : "border-gray-200"
        }`}
      >
        {icon}
        <TextInput
          className="flex-1 text-gray-900 ml-3"
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
        />
      </View>
      {error && <Text className="text-red-500 text-sm mt-1 ml-1">{error}</Text>}
    </View>
  );
};

export default InputField;
