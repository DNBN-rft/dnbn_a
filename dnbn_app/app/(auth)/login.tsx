import { apiPost } from "@/utils/api";
import { setMultipleItems } from "@/utils/storageUtil";
import { useRouter } from "expo-router";
import { useState } from "react";
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

  const handleLogin = async (type: "cust" | "store") => {
    if (!loginId.trim() || !password.trim()) {
      if (Platform.OS === "web") {
        window.alert("아이디와 비밀번호를 입력해주세요.");
      } else {
        Alert.alert("알림", "아이디와 비밀번호를 입력해주세요.");
      }
      return;
    }

    try {
      // 모두 /store/app/login 사용
      const endpoint = type === "cust" ? "/cust/login" : "/store/app/login";
      const requestBody =
        type === "cust"
          ? { loginId: loginId.trim(), password: password.trim() }
          : { username: loginId.trim(), password: password.trim() };

      // 로그인 요청
      const response = await apiPost(endpoint, requestBody);

      if (response.ok) {
        const data = await response.json();

        // 원본 저장 (선택사항)
        await setMultipleItems({
          custCode: data.custCode,
          hasLocation: data.isExistLocation,
          hasActCategory: data.isSetActiveCategory,
        });

        // 모든 설정이 완료된 경우에만 메인 페이지로 이동
        if (type === "cust") {
          // cust 로그인 - 토큰 저장
          const custTokens: Record<string, any> = {
            userType: "cust", // 리프레시 시 어느 엔드포인트를 사용할지 판단
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

          await setMultipleItems(custTokens);
          router.replace("/(cust)/tabs/custhome");
        } else {
          // store 로그인 - 토큰 저장
          const storeTokens: Record<string, any> = {
            userType: "store", // 리프레시 시 어느 엔드포인트를 사용할지 판단
          };
          if (data.accessToken) storeTokens.accessToken = data.accessToken;
          if (data.refreshToken) storeTokens.refreshToken = data.refreshToken;
          if (data.accessTokenExpiresIn)
            storeTokens.accessTokenExpiresIn = data.accessTokenExpiresIn;
          if (data.refreshTokenExpiresIn)
            storeTokens.refreshTokenExpiresIn = data.refreshTokenExpiresIn;
          if (data.tokenType) storeTokens.tokenType = data.tokenType;
          if (data.memberNm) storeTokens.memberNm = data.memberNm;
          if (data.authorities)
            storeTokens.authorities = JSON.stringify(data.authorities);
          if (data.storeCode) storeTokens.storeCode = data.storeCode;
          if (data.subscriptionNm)
            storeTokens.subscriptionNm = data.subscriptionNm;
          if (data.memberId) storeTokens.memberId = data.memberId;

          await setMultipleItems(storeTokens);

          router.replace("/(store)/tabs/storehome");
        }
      } else {
        // 에러 응답 처리
        try {
          const errorResponse = await response.json();
          const errorCode = errorResponse.error || "";

          let displayMessage = "시스템 관리자에게 문의해주세요.";

          if (errorCode === "ONLY_OWNER_CAN_LOGIN") {
            displayMessage = "시스템 관리자에게 문의해주세요.";
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

  const handleSNSLogin = (provider: "kakao" | "naver") => {
    // SNS 로그인 처리 (나중에 구현)
    console.log(`${provider} 로그인`);
    // SNS 로그인은 cust로 처리
    router.replace("/(cust)/tabs/custhome");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#FFFFFF" }} />
      )}

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

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => handleLogin(userType)}
          >
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
        {insets.bottom > 0 && <View style={{ height: insets.bottom }} />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
