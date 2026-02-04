import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { apiPost } from "../../utils/api";
import { styles } from "./withdraw.styles";

const WITHDRAW_REASONS = [
  { id: "1", label: "서비스 만족도 낮음" },
  { id: "2", label: "이용할 이유가 없음" },
  { id: "3", label: "더 나은 서비스 찾음" },
  { id: "4", label: "개인정보 보안 우려" },
  { id: "5", label: "기타" },
];

export default function WithdrawScreen() {
  const insets = useSafeAreaInsets();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [reasonDetail, setReasonDetail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitReason = () => {
    if (!selectedReason) {
      if (Platform.OS === "web") {
        window.alert("탈퇴 이유를 선택해주세요.");
      } else {
        Alert.alert("필수 입력", "탈퇴 이유를 선택해주세요.");
      }
      return;
    }
    if (selectedReason === "5" && !reasonDetail.trim()) {
      if (Platform.OS === "web") {
        window.alert("상세 이유를 입력해주세요.");
      } else {
        Alert.alert("필수 입력", "상세 이유를 입력해주세요.");
      }
      return;
    }

    // 최종 확인 Alert
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "정말 탈퇴하시겠어요?\n탈퇴 후 계정은 복구할 수 없습니다.",
      );
      if (confirmed) {
        handleWithdraw();
      }
    } else {
      Alert.alert(
        "회원 탈퇴",
        "정말 탈퇴하시겠어요?\n탈퇴 후 계정은 복구할 수 없습니다.",
        [
          {
            text: "취소",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "탈퇴",
            onPress: handleWithdraw,
            style: "destructive",
          },
        ],
      );
    }
  };

  const handleWithdraw = async () => {
    try {
      setIsLoading(true);

      // custCode 가져오기
      let custCode = null;
      if (Platform.OS === "web") {
        custCode = localStorage.getItem("custCode");
      } else {
        custCode = await SecureStore.getItemAsync("custCode");
      }

      if (!custCode) {
        if (Platform.OS === "web") {
          window.alert("로그인 정보를 찾을 수 없습니다.");
        } else {
          Alert.alert("오류", "로그인 정보를 찾을 수 없습니다.");
        }
        setIsLoading(false);
        return;
      }

      // 탈퇴 이유 가져오기
      const reason =
        WITHDRAW_REASONS.find((r) => r.id === selectedReason)?.label || "";

      // 기타 선택 시 상세 이유 포함
      const finalReason =
        selectedReason === "5" && reasonDetail.trim() ? reasonDetail : reason;

      // API 호출
      const response = await apiPost("/cust/withdraw", {
        custCode,
        reason: finalReason,
      });

      if (!response.ok) {
        throw new Error("회원 탈퇴에 실패했습니다.");
      }

      const message = await response.text();

      // 로그아웃 처리 - 저장된 정보 삭제
      if (Platform.OS === "web") {
        localStorage.removeItem("custCode");
      } else {
        await SecureStore.deleteItemAsync("custCode");
      }

      setIsLoading(false);

      if (Platform.OS === "web") {
        window.alert(message || "탈퇴가 완료되었습니다.");
        router.replace("/(auth)/login");
      } else {
        Alert.alert("안내", message || "탈퇴가 완료되었습니다.", [
          {
            text: "확인",
            onPress: () => router.replace("/(auth)/login"),
          },
        ]);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("회원 탈퇴 오류:", error);
      if (Platform.OS === "web") {
        window.alert(
          error instanceof Error
            ? error.message
            : "탈퇴 처리 중 오류가 발생했습니다.",
        );
      } else {
        Alert.alert(
          "오류",
          error instanceof Error
            ? error.message
            : "탈퇴 처리 중 오류가 발생했습니다.",
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#fff" }} />
      )}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>회원 탈퇴</Text>

        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 탈퇴 이유 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>탈퇴 이유</Text>

          <Text style={styles.description}>
            서비스를 이용하지 않는 이유가 무엇인가요? 더 나은 서비스를 제공하기
            위해 의견을 듣고 싶습니다.
          </Text>

          <View style={styles.reasonContainer}>
            {WITHDRAW_REASONS.map((reason) => (
              <TouchableOpacity
                key={reason.id}
                style={styles.reasonOption}
                onPress={() => setSelectedReason(reason.id)}
              >
                <View
                  style={[
                    styles.radioButton,
                    selectedReason === reason.id && styles.radioButtonSelected,
                  ]}
                >
                  {selectedReason === reason.id && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>

                <Text
                  style={[
                    styles.reasonLabel,
                    selectedReason === reason.id && styles.reasonLabelSelected,
                  ]}
                >
                  {reason.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 기타 선택시 상세 이유 입력 */}
          {selectedReason === "5" && (
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>상세 이유</Text>

              <TextInput
                style={styles.detailInput}
                placeholder="탈퇴 이유를 입력해주세요"
                placeholderTextColor="#ccc"
                value={reasonDetail}
                onChangeText={setReasonDetail}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          )}
        </View>

        {/* 주의사항 */}
        <View style={styles.warningSection}>
          <Text style={styles.warningTitle}>⚠️ 주의사항</Text>

          <Text style={styles.warningText}>
            • 탈퇴 요청일로부터 일주일 이내에 철회 가능하며, 이후에는 복구가
            불가능합니다.
          </Text>

          <Text style={styles.warningText}>
            • 개인정보는 관련 법령에 따라 일정기간 보관 후 삭제됩니다.
          </Text>
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={[styles.submitButton, isLoading && { opacity: 0.5 }]}
          onPress={handleSubmitReason}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>탈퇴</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>취소</Text>
        </TouchableOpacity>
      </View>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
