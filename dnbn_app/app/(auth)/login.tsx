import { apiPost, getSocialLoginUrl } from "@/utils/api";
import { clearAuthData, setMultipleItems } from "@/utils/storageUtil";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./login.styles";

export default function LoginScreen() {
  const router = useRouter();
  const [userType, setUserType] = useState<"cust" | "store">("cust");
  const insets = useSafeAreaInsets();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  // 소셜 로그인 성공 처리
  const handleSocialLoginSuccess = useCallback(
    async (params: any) => {
      try {
        const {
          provider,
          socialId,
          email,
          nickname,
          accessToken,
          tokenType,
          refreshToken,
          custCode,
          isExistLocation,
          isSetActiveCategory,
        } = params;

        console.log("소셜 로그인 성공:", {
          provider,
          socialId,
          email,
          nickname,
        });

        // 토큰 저장
        const custTokens: Record<string, any> = {
          userType: "cust",
          accessToken: accessToken,
          tokenType: tokenType || "Bearer",
        };

        if (refreshToken) custTokens.refreshToken = refreshToken;
        if (custCode) custTokens.custCode = custCode;
        if (isExistLocation !== undefined)
          custTokens.hasLocation = isExistLocation === "true";
        if (isSetActiveCategory !== undefined)
          custTokens.hasActCategory = isSetActiveCategory === "true";

        await setMultipleItems(custTokens);

        // 주소 정보가 없으면 주소 설정 페이지로 이동
        if (isExistLocation === "false") {
          router.replace("/(cust)/address-select");
          return;
        }

        // 카테고리 정보가 없으면 카테고리 설정 페이지로 이동
        if (isSetActiveCategory === "false") {
          router.replace("/(cust)/category");
          return;
        }

        // 메인 페이지로 이동
        router.replace("/(cust)/tabs/custhome");
      } catch (error) {
        console.error("소셜 로그인 처리 에러:", error);
        if (Platform.OS === "web") {
          window.alert("로그인 처리 중 오류가 발생했습니다.");
        } else {
          Alert.alert("오류", "로그인 처리 중 오류가 발생했습니다.");
        }
      }
    },
    [router],
  );

  // 로그인 페이지 접근 시 인증 정보 정리 및 딥링크 리스너 등록
  useEffect(() => {
    const initAuth = async () => {
      try {
        await clearAuthData(); // 모든 인증 정보 삭제
      } catch (error) {
        // Storage 정리 실패 시 무시 (로그인은 계속 진행)
      }
    };

    initAuth();

    // 딥링크 리스너 등록 (소셜 로그인 결과 받기)
    const subscription = Linking.addEventListener("url", ({ url }) => {
      console.log("Deep Link received:", url);

      // URL 파싱: dnbnapp://social-login?provider=kakao&socialId=...&accessToken=...
      const { queryParams } = Linking.parse(url);

      if (queryParams && queryParams.accessToken) {
        // 소셜 로그인 성공 처리
        handleSocialLoginSuccess(queryParams);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [handleSocialLoginSuccess]);

  const handleLogin = async () => {
    if (!loginId || !password) {
      if (Platform.OS === "web") {
        window.alert("아이디와 비밀번호를 입력해주세요.");
      } else {
        Alert.alert("알림", "아이디와 비밀번호를 입력해주세요.");
      }
      return;
    }

    try {
      // 모두 /store/app/login 사용
      const endpoint = userType === "cust" ? "/cust/login" : "/store/app/login";
      const requestBody = { loginId: loginId, password: password };

      // 로그인 요청
      const response = await apiPost(endpoint, requestBody);

      if (response.ok) {
        const data = await response.json();

        // cust 사용자만 custCode, hasLocation, hasActCategory 저장
        if (userType === "cust") {
          await setMultipleItems({
            custCode: data.custCode,
            hasLocation: data.isExistLocation,
            hasActCategory: data.isSetActiveCategory,
          });
        }

        // 모든 설정이 완료된 경우에만 메인 페이지로 이동
        if (userType === "cust") {
          // cust 로그인 - 토큰 저장
          const custTokens: Record<string, any> = {
            userType: userType, // 리프레시 시 어느 엔드포인트를 사용할지 판단
          };
          if (data) {
            custTokens.custCode = data.custCode;
            custTokens.accessToken = data.accessToken;
            custTokens.refreshToken = data.refreshToken;
            custTokens.accessTokenExpiresIn = data.accessTokenExpiresIn;
            custTokens.refreshTokenExpiresIn = data.refreshTokenExpiresIn;
            custTokens.tokenType = data.tokenType;
          } else {
            return;
          }

          await setMultipleItems(custTokens);

          // 주소 정보가 없으면 주소 설정 페이지로 이동
          if (data.isExistLocation === false) {
            router.replace("/(cust)/address-select");
            return;
          }

          // 카테고리 정보가 없으면 카테고리 설정 페이지로 이동
          if (data.isSetActiveCategory === false) {
            router.replace("/(cust)/category");
            return;
          }

          router.replace("/(cust)/tabs/custhome");
        } else {
          // store 로그인 - 토큰 저장
          const storeTokens: Record<string, any> = {
            userType: userType, // 리프레시 시 어느 엔드포인트를 사용할지 판단
          };
          if (data) {
            storeTokens.accessToken = data.accessToken;
            storeTokens.refreshToken = data.refreshToken;
            storeTokens.accessTokenExpiresIn = data.accessTokenExpiresIn;
            storeTokens.refreshTokenExpiresIn = data.refreshTokenExpiresIn;
            storeTokens.tokenType = data.tokenType;
            storeTokens.memberNm = data.memberNm;
            storeTokens.authorities = JSON.stringify(data.authorities);
            storeTokens.storeCode = data.storeCode;
            storeTokens.subscriptionNm = data.subscriptionNm;
            storeTokens.memberId = data.memberId;
          } else {
            return;
          }

          await setMultipleItems(storeTokens);

          router.replace("/(store)/tabs/storehome");
        }
      } else {
        // 에러 응답 처리
        try {
          const errorResponse = await response.json();
          const errorCode = errorResponse.error || "";

          let displayMessage = "";

          if (errorCode === "ONLY_OWNER_CAN_LOGIN") {
            displayMessage = "시스템 관리자에게 문의해주세요.";
          } else {
            displayMessage =
              "로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.";
          }

          if (Platform.OS === "web") {
            window.alert(displayMessage);
          } else {
            Alert.alert("로그인 실패", displayMessage);
          }
        } catch {
          // JSON 파싱 실패 시
          if (Platform.OS === "web") {
            window.alert("로그인에 실패했습니다.");
          } else {
            Alert.alert("실패", "로그인에 실패했습니다.");
          }
        }
      }
    } catch (error) {
      if (Platform.OS === "web") {
        window.alert("로그인 중 오류가 발생했습니다.");
      } else {
        Alert.alert("오류", "로그인 중 오류가 발생했습니다.");
      }
    }
  };

  const handleSNSLogin = async (provider: "kakao" | "naver") => {
    try {
      // Step 1: 백엔드에서 로그인 URL 받기
      const loginUrl = await getSocialLoginUrl(provider);
      console.log(`${provider} 로그인 URL:`, loginUrl);

      // Step 2: 브라우저 오픈
      await WebBrowser.openBrowserAsync(loginUrl);

      // Step 3: 딥링크 결과는 useEffect의 Linking.addEventListener에서 처리
    } catch (error) {
      console.error(`${provider} 로그인 에러:`, error);
      if (Platform.OS === "web") {
        window.alert("소셜 로그인 중 오류가 발생했습니다.");
      } else {
        Alert.alert("오류", "소셜 로그인 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#FFF" }} />
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -insets.bottom}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentContainer}>
            <Image
              style={styles.logo}
              source={require("@/assets/images/logo.png")}
            />

            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  userType === "cust" && styles.typeButtonActive,
                ]}
                onPress={() => setUserType("cust")}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    userType === "cust" && styles.typeButtonTextActive,
                  ]}
                >
                  일반
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  userType === "store" && styles.typeButtonActive,
                ]}
                onPress={() => setUserType("store")}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    userType === "store" && styles.typeButtonTextActive,
                  ]}
                >
                  사업자
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="아이디"
                placeholderTextColor="#999"
                value={loginId}
                onChangeText={setLoginId}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="비밀번호"
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>로그인</Text>
            </TouchableOpacity>

            <View style={styles.linkContainer}>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/(auth)/find-account",
                    params: { userType },
                  })
                }
              >
                <Text style={styles.linkText}>아이디 · 비밀번호 찾기</Text>
              </TouchableOpacity>
              {userType === "cust" && (
                <>
                  <View style={styles.separator} />
                  <TouchableOpacity
                    onPress={() => router.push("/(auth)/terms-page")}
                  >
                    <Text style={styles.linkText}>회원가입</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            {userType === "cust" && (
              <View style={styles.snsContainer}>
                <TouchableOpacity
                  style={[styles.snsButton, styles.kakaoButton]}
                  onPress={() => handleSNSLogin("kakao")}
                >
                  <Text style={styles.kakaoButtonText}>카카오톡 로그인</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.snsButton, styles.naverButton]}
                  onPress={() => handleSNSLogin("naver")}
                >
                  <Text style={styles.naverButtonText}>네이버 로그인</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
