import { Stack } from "expo-router";
import "react-native-reanimated";

export default function PreAuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="otp"
        options={{
          headerShown: false,
          presentation: "card",
        }}
      />
    </Stack>
  );
}
