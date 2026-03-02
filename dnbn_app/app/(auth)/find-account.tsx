import { apiPost } from "@/utils/api";
import {
  formatPhoneNumber,
  validateEmail,
  validateName,
  validatePhone,
  validateUserId,
} from "@/utils/find-accountUtil";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./find-account.styles";

export default function FindAccountScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<"id" | "password">("id");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [userId, setUserId] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const { userType } = useLocalSearchParams();

  // 에러 메시지 state
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [userIdError, setUserIdError] = useState("");

  // 아이디 찾기 API 호출
  const handleFindId = async () => {
    // 검증
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);

    setNameError(nameErr);
    setEmailError(emailErr);

    if (nameErr || emailErr) {
      return;
    }

    // 아이디 찾기 API 호출
    try {
      const endPoint =
        userType === "cust" ? "/cust/search-id" : "/store/search-id";

      const response = await apiPost(endPoint, {
        name: name,
        email: email,
      });

      if (response.ok) {
        setModalMessage("아이디");
        setModalVisible(true);
      } else {
        if (Platform.OS === "web") {
          window.alert("정보를 찾을 수 없습니다.");
        } else {
          Alert.alert("실패", "정보를 찾을 수 없습니다.");
        }
      }
    } catch (error) {
      console.error("아이디 찾기 오류:", error);
      if (Platform.OS === "web") {
        window.alert("오류가 발생했습니다.");
      } else {
        Alert.alert("오류", "오류가 발생했습니다.");
      }
    }
  };

  const handleFindPassword = async () => {
    // 검증
    const userIdErr = validateUserId(userId);
    const emailErr = validateEmail(email);
    const phoneErr = validatePhone(phone);

    setUserIdError(userIdErr);
    setEmailError(emailErr);
    setPhoneError(phoneErr);

    if (userIdErr || emailErr || phoneErr) {
      return;
    }

    // 비밀번호 재설정 API 호출
    try {
      const endPoint =
        userType === "cust" ? "/cust/reset-password" : "/store/reset-password";

      const response = await apiPost(endPoint, {
        loginId: userId,
        email: email,
        phoneNumber: phone.replace(/[^0-9]/g, ""), // 하이픈 제거
      });

      if (response.ok) {
        setModalMessage("임시 비밀번호");
        setModalVisible(true);
      } else {
        if (Platform.OS === "web") {
          window.alert("비밀번호 찾기에 실패했습니다.");
        } else {
          Alert.alert("실패", "비밀번호 찾기에 실패했습니다.");
        }
      }
    } catch (error) {
      console.error("비밀번호 찾기 오류:", error);
      if (Platform.OS === "web") {
        window.alert("비밀번호 찾기 중 오류가 발생했습니다.");
      } else {
        Alert.alert("오류", "비밀번호 찾기 중 오류가 발생했습니다.");
      }
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#FFFFFF" }} />
      )}

      <View style={styles.header}>
        <View style={styles.leftSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.centerSection}>
          <Text style={styles.title}>내 정보 찾기</Text>
        </View>
        <View style={styles.rightSection} />
      </View>

      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
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
            <Text style={styles.label}>이름</Text>
            <TextInput
              style={styles.input}
              placeholder="이름을 입력하세요"
              placeholderTextColor="#999"
              value={name}
              onChangeText={(text) => {
                const trimmedText = text.replace(/\s/g, "");
                setName(trimmedText);
                setNameError("");
              }}
              keyboardType="default"
            />
            {nameError ? (
              <Text style={styles.errorText}>{nameError}</Text>
            ) : null}

            <Text style={styles.label}>이메일</Text>
            <TextInput
              style={styles.input}
              placeholder="이메일을 입력하세요"
              placeholderTextColor="#999"
              value={email}
              onChangeText={(text) => {
                const trimmedText = text.replace(/\s/g, "");
                setEmail(trimmedText);
                setEmailError("");
              }}
              keyboardType="email-address"
            />
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}

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
              onChangeText={(text) => {
                const trimmedText = text.replace(/\s/g, "");
                setUserId(trimmedText);
                setUserIdError("");
              }}
            />
            {userIdError ? (
              <Text style={styles.errorText}>{userIdError}</Text>
            ) : null}

            <Text style={styles.label}>이메일</Text>
            <TextInput
              style={styles.input}
              placeholder="이메일을 입력하세요"
              placeholderTextColor="#999"
              value={email}
              onChangeText={(text) => {
                const trimmedText = text.replace(/\s/g, "");
                setEmail(trimmedText);
                setEmailError("");
              }}
              keyboardType="email-address"
            />
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}

            <Text style={styles.label}>휴대폰 번호</Text>
            <TextInput
              style={styles.input}
              placeholder="010-1234-5678"
              placeholderTextColor="#999"
              value={phone}
              onChangeText={(text) => {
                const formatted = formatPhoneNumber(text);
                setPhone(formatted);
                setPhoneError("");
              }}
              keyboardType="phone-pad"
              maxLength={13}
            />
            {phoneError ? (
              <Text style={styles.errorText}>{phoneError}</Text>
            ) : null}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleFindPassword}
            >
              <Text style={styles.submitButtonText}>임시 비밀번호 발급</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <AccountNoticeModal
        visible={modalVisible}
        message={modalMessage}
        onClose={handleModalClose}
      />

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}

interface AccountNoticeModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

function AccountNoticeModal({
  visible,
  message,
  onClose,
}: AccountNoticeModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text
            style={styles.modalMessage}
          >{`${message}를 이메일로 발송 했습니다.\n이메일을 확인 해주세요.`}</Text>
          <Pressable style={styles.modalButton} onPress={onClose}>
            <Text style={styles.modalButtonText}>확인</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
