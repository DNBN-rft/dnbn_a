import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/**
 * 앱 최초 실행 시 알림 권한만 요청합니다 (토큰 발급 X).
 * _layout.tsx에서 AsyncStorage로 1회만 호출합니다.
 */
export async function requestNotificationPermission(): Promise<void> {
  if (Platform.OS === "web" || !Device.isDevice) return;
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    await Notifications.requestPermissionsAsync();
  }
}

/**
 * 현재 권한이 granted인 경우에만 토큰을 발급합니다.
 * - 권한이 없으면 Alert 없이 null 반환 (권한 요청은 앱 최초 실행 시 이미 완료).
 */
export async function permitCheck(): Promise<string | null> {
  const { status } = await Notifications.getPermissionsAsync();
  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });

  if (Platform.OS === "web" || !Device.isDevice || status !== "granted" || !projectId) return null;

  return tokenData.data;
}
