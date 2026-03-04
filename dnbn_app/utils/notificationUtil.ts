import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Alert, Linking, Platform } from "react-native";

/**
 * 마케팅 수신 동의 시 푸시 토큰을 발급합니다.
 * - 실제 기기에서만 동작합니다 (시뮬레이터/에뮬레이터 불가).
 * - Android의 경우 알림 채널을 함께 생성합니다.
 * - 권한이 거부되면 null을 반환합니다.
 *
 * [토큰 종류]
 * - Expo Go 환경: Expo Push Token (ExponentPushToken[...]) 반환
 * - EAS 커스텀 빌드: 네이티브 FCM 토큰 반환
 */
export async function getFcmToken(): Promise<string | null> {
  if (!Device.isDevice) {
    return null;
  }

  // 알림 권한 확인 및 요청
  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    // 이미 거부된 경우 설정 앱으로 안내
    Alert.alert(
      "알림 권한 필요",
      "마케팅 알림을 받으려면 기기 설정에서 알림 권한을 허용해주세요.",
      [
        { text: "취소", style: "cancel" },
        {
          text: "설정으로 이동",
          onPress: () => Linking.openSettings(),
        },
      ]
    );
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

  // Expo Go: Expo Push Token 발급 (Expo 서버 → FCM 중계 방식)
  // EAS 빌드: 네이티브 FCM 토큰 발급
  const isExpoGo = Constants.appOwnership === "expo";

  if (isExpoGo) {
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) {
      return null;
    }
    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
    return tokenData.data;
  }

  // 프로덕션 빌드: 네이티브 FCM 토큰
  const tokenData = await Notifications.getDevicePushTokenAsync();
  return tokenData.data as string;
}

/**
 * 권한 팝업/Alert 없이 현재 권한이 granted인 경우에만 토큰 반환.
 * 설정에서 돌아왔을 때 조용히 재시도할 때 사용.
 */
export async function getFcmTokenSilently(): Promise<string | null> {
  if (!Device.isDevice) return null;

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

  const isExpoGo = Constants.appOwnership === "expo";
  if (isExpoGo) {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) return null;
    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
    return tokenData.data;
  }

  const tokenData = await Notifications.getDevicePushTokenAsync();
  return tokenData.data as string;
}
