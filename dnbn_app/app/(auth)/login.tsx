import { apiPost } from "@/utils/api";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
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
<<<<<<< HEAD
      // 모바일은 /store/app/login, 웹은 /store/login
      const endpoint = type === "cust" ? "/cust/login/signin" : (Platform.OS === "web" ? "/store/login" : "/store/app/login");
      const requestBody = type === "cust" 
        ? { loginId: loginId.trim(), password: password.trim() }
        : { username: loginId.trim(), password: password.trim() };
      
      const response = await apiPost(endpoint, requestBody);
=======
      const response = await apiPost("/cust/login", {
        loginId: loginId.trim(),
        password: password.trim(),
      });
>>>>>>> 8beb856abbe2dd8379ffef7b72a2842e449282c9

      if (response.ok) {
        const data = await response.json();

<<<<<<< HEAD
=======
        // custCode를 저장 (웹: localStorage, 앱: SecureStore)
        if (Platform.OS === "web") {
          localStorage.setItem("custCode", data.custCode);
          localStorage.setItem("hasLocation", data.isExistLocation);
          localStorage.setItem("hasActCategory", data.isSetActiveCategory);
        } else {
          await SecureStore.setItemAsync("custCode", data.custCode);
          await SecureStore.setItemAsync(
            "hasLocation",
            String(data.isExistLocation),
          );
          await SecureStore.setItemAsync(
            "hasActCategory",
            String(data.isSetActiveCategory),
          );
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

        // 모든 설정이 완료된 경우에만 메인 페이지로 이동
>>>>>>> 8beb856abbe2dd8379ffef7b72a2842e449282c9
        if (type === "cust") {
          // cust: custCode만 저장
          if (Platform.OS === "web") {
            localStorage.setItem("custCode", data.custCode);
          } else {
            await SecureStore.setItemAsync("custCode", data.custCode);
          }
          router.replace("/(cust)/tabs/custhome");
        } else {
          // store 로그인
          if (Platform.OS === "web") {
            // 웹: 쿠키로 token 처리
            localStorage.setItem("storeCode", data.storeCode);
            localStorage.setItem("memberNm", data.memberNm);
            localStorage.setItem("memberId", data.memberId);
            localStorage.setItem("subscriptionNm", data.subscriptionNm);
            localStorage.setItem("authorities", JSON.stringify(data.authorities));
          } else {
            // 모바일: response에서 token 받아서 저장
            if (data.accessToken) {
              await SecureStore.setItemAsync("accessToken", data.accessToken);
            }
            if (data.refreshToken) {
              await SecureStore.setItemAsync("refreshToken", data.refreshToken);
            }
          }
          router.replace("/(store)/tabs/storehome");
        }
      } else {
        if (Platform.OS === "web") {
          window.alert("로그인에 실패했습니다.");
        } else {
          Alert.alert("실패", "로그인에 실패했습니다.");
        }
      }
    } catch (error) {
      console.error("로그인 오류:", error);
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
          <TouchableOpacity onPress={() => router.push("/(auth)/find-account")}>
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
        {insets.bottom > 0 && (
          <View style={{ height: insets.bottom }} />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
