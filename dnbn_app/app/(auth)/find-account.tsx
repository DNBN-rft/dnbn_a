import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./find-account.styles";

export default function FindAccountScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<"id" | "password">("id");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [userId, setUserId] = useState("");

  const handleFindId = () => {
    // 아이디 찾기 로직
    console.log("아이디 찾기:", { email, phone });
  };

  const handleFindPassword = () => {
    // 비밀번호 찾기 로직
    console.log("비밀번호 찾기:", { userId, email, phone });
  };

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#FFFFFF" }} />
      )}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>내 정보 찾기</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, tab === "id" && styles.tabActive]}
            onPress={() => setTab("id")}
          >
            <Text
              style={[styles.tabText, tab === "id" && styles.tabTextActive]}
            >
              아이디 찾기
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === "password" && styles.tabActive]}
            onPress={() => setTab("password")}
          >
            <Text
              style={[
                styles.tabText,
                tab === "password" && styles.tabTextActive,
              ]}
            >
              비밀번호 찾기
            </Text>
          </TouchableOpacity>
        </View>

        {tab === "id" ? (
          <View style={styles.formContainer}>
            <Text style={styles.label}>이메일</Text>
            <TextInput
              style={styles.input}
              placeholder="이메일을 입력하세요"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <Text style={styles.label}>휴대폰 번호</Text>
            <TextInput
              style={styles.input}
              placeholder="휴대폰 번호를 입력하세요"
              placeholderTextColor="#999"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleFindId}
            >
              <Text style={styles.submitButtonText}>아이디 찾기</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <Text style={styles.label}>아이디</Text>
            <TextInput
              style={styles.input}
              placeholder="아이디를 입력하세요"
              placeholderTextColor="#999"
              value={userId}
              onChangeText={setUserId}
            />

            <Text style={styles.label}>이메일</Text>
            <TextInput
              style={styles.input}
              placeholder="이메일을 입력하세요"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <Text style={styles.label}>휴대폰 번호</Text>
            <TextInput
              style={styles.input}
              placeholder="휴대폰 번호를 입력하세요"
              placeholderTextColor="#999"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleFindPassword}
            >
              <Text style={styles.submitButtonText}>비밀번호 찾기</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#FFFFFF" }} />
      )}
    </View>
  );
}
