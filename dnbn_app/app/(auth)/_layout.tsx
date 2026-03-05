import { Stack } from "expo-router";

export default function CustAuthScreen() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="terms-page" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="find-account" options={{ headerShown: false }} />
      {/* Store Signup Screens */}
      <Stack.Screen
        name="store-signup-agreement"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="store-signup-member-info"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="store-signup-biz-info"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="store-signup-store-info"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="store-signup-file-upload"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
