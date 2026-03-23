import { initializeKakaoSDK } from "@react-native-kakao/core";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import "react-native-reanimated";

import { AuthProvider } from "@/contexts/AuthContext";
import { StoreSignupProvider } from "@/contexts/StoreSignupContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { setLogoutCallback } from "@/utils/api";
import { requestNotificationPermission } from "@/utils/notificationUtil";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

function RootLayoutContent() {
  const colorScheme = useColorScheme();

  // 카카오 SDK 초기화
  useEffect(() => {
    if (Platform.OS !== "web") {
      initializeKakaoSDK("bbbf21a6976b000c1889068c4e6564f7");
    }
  }, []);

  // 앱 시작 시 로그아웃 콜백 설정
  useEffect(() => {
    setLogoutCallback(() => {
      router.replace("/(guest)/tabs/guesthome");
    });
  }, []);

  // 앱 최초 실행 시 알림 권한 1회 요청 + Android 채널 설정
  useEffect(() => {
    (async () => {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
      const requested = await AsyncStorage.getItem(
        "notification_permission_requested",
      );
      if (!requested) {
        await requestNotificationPermission();
        await AsyncStorage.setItem("notification_permission_requested", "true");
      }
    })();
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="kakaolink" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(cust)"
          options={{
            headerShown: false,
            // cust, store 접근 가능하도록 나중에 처리 필요
          }}
        />
        <Stack.Screen
          name="(store)"
          options={{
            headerShown: false,
            // store만 접근 가능하도록 나중에 처리 필요
          }}
        />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StoreSignupProvider>
        <RootLayoutContent />
      </StoreSignupProvider>
    </AuthProvider>
  );
}
