import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./login.styles";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [userType, setUserType] = useState<"cust" | "store">("cust");
  const insets = useSafeAreaInsets();

  const handleLogin = (type: "cust" | "store") => {
    // AuthContext에 로그인 상태 저장
    login(type);

    if (type === "cust") {
      router.replace("/(cust)/tabs/custhome");
    } else {
      router.replace("/(store)/tabs/storehome");
    }
  };

  const handleSNSLogin = (provider: "kakao" | "naver") => {
    // SNS 로그인 처리 (나중에 구현)
    console.log(`${provider} 로그인`);
    // SNS 로그인은 cust로 처리
    login("cust");
    router.replace("/(cust)/tabs/custhome");
  };

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#FFFFFF" }} />
      )}

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
          />
          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            placeholderTextColor="#999"
            secureTextEntry
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
            <Text style={styles.linkText}>아이디/비밀번호 찾기</Text>
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
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
