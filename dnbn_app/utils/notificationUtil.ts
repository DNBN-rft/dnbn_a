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
 * 현재 권한이 granted인 경우에만 FCM 토큰을 발급합니다.
 * - 권한이 없으면 Alert 없이 null 반환 (권한 요청은 앱 최초 실행 시 이미 완료).
 * - 마케팅 동의 시에만 호출합니다.
 */
export async function getFcmToken(): Promise<string | null> {
  if (Platform.OS === "web" || !Device.isDevice) {
    return null;
  }

  const { status } = await Notifications.getPermissionsAsync();

  if (status !== "granted") {
    return null;
  }

  // Android 알림 채널 설정
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  if (!projectId) {
    return null;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
  return tokenData.data;
}

/**
 * 권한 팝업/Alert 없이 현재 권한이 granted인 경우에만 토큰 반환.
 * 설정에서 돌아왔을 때 조용히 재시도할 때 사용.
 */
export async function getFcmTokenSilently(): Promise<string | null> {
  if (Platform.OS === "web" || !Device.isDevice) return null;

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") return null;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  if (!projectId) return null;

  const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
  return tokenData.data;
}
