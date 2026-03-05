import { setMultipleItems } from "@/utils/storageUtil";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

/**
 * 백엔드 소셜 로그인 리다이렉트 수신 라우트
 * dnbnapp://social-login?accessToken=...&... 으로 진입
 */
export default function SocialLoginCallback() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    accessToken?: string;
    tokenType?: string;
    refreshToken?: string;
    custCode?: string;
    isExistLocation?: string;
    isExistCategory?: string;
  }>();

  useEffect(() => {
    const handleCallback = async () => {
      const {
        accessToken,
        tokenType,
        refreshToken,
        custCode,
        isExistLocation,
        isExistCategory,
      } = params;

      if (!accessToken) {
        // accessToken 없으면 로그인 페이지로
        router.replace("/(auth)/login");
        return;
      }

      try {
        const custTokens: Record<string, any> = {
          userType: "cust",
          accessToken,
          tokenType: tokenType || "Bearer",
        };

        if (refreshToken) custTokens.refreshToken = refreshToken;
        if (custCode) custTokens.custCode = custCode;
        if (isExistLocation !== undefined)
          custTokens.hasLocation = isExistLocation === "true";
        if (isExistCategory !== undefined)
          custTokens.hasActCategory = isExistCategory === "true";

        await setMultipleItems(custTokens);

        // 주소 정보가 없으면 주소 설정 페이지로 이동
        if (isExistLocation === "false") {
          router.replace("/(cust)/address-select");
          return;
        }

        // 카테고리 정보가 없으면 카테고리 설정 페이지로 이동
        if (isExistCategory === "false") {
          router.replace("/(cust)/category");
          return;
        }

        router.replace("/(cust)/tabs/custhome");
      } catch (error) {
        console.error("소셜 로그인 콜백 처리 에러:", error);
        router.replace("/(auth)/login");
      }
    };

    handleCallback();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#EF7810" />
    </View>
  );
}
