// 웹 환경에서는 푸시 알림 미지원 - expo-notifications import 하지 않음
export async function getFcmToken(): Promise<string | null> {
  return null;
}

export async function getFcmTokenSilently(): Promise<string | null> {
  return null;
}
