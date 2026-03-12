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
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { apiDelete } from "../../utils/api";
import { styles } from "./withdraw.styles";

export default function StoreWithdrawScreen() {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitReason = () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("정말 탈퇴하시겠어요?");
      if (confirmed) {
        handleWithdraw();
      }
    } else {
      Alert.alert("회원 탈퇴", "정말 탈퇴하시겠어요?", [
        { text: "탈퇴", onPress: handleWithdraw, style: "destructive" },
        { text: "취소", style: "cancel" },
      ]);
    }
  };

  const handleWithdraw = async () => {
    try {
      setIsLoading(true);

      let storeCode = null;
      if (Platform.OS === "web") {
        storeCode = localStorage.getItem("storeCode");
      } else {
        storeCode = await SecureStore.getItemAsync("storeCode");
      }

      if (!storeCode) {
        if (Platform.OS === "web") {
          window.alert("로그인 정보를 찾을 수 없습니다.");
        } else {
          Alert.alert("오류", "로그인 정보를 찾을 수 없습니다.");
        }
        setIsLoading(false);
        return;
      }

      const response = await apiDelete(`/store/app/withdraw/${storeCode}`);

      if (!response.ok) {
        throw new Error("회원 탈퇴에 실패했습니다.");
      }

      const message = await response.text();

      if (Platform.OS === "web") {
        localStorage.removeItem("storeCode");
        localStorage.removeItem("memberId");
      } else {
        await SecureStore.deleteItemAsync("storeCode");
        await SecureStore.deleteItemAsync("memberId");
      }

      setIsLoading(false);

      if (Platform.OS === "web") {
        window.alert(
          message || "탈퇴가 완료되었습니다. 7일 이내에 복구 가능합니다.",
        );
        router.replace("/(auth)/login");
      } else {
        Alert.alert(
          "안내",
          message || "탈퇴가 완료되었습니다. 7일 이내에 복구 가능합니다.",
          [{ text: "확인", onPress: () => router.replace("/(auth)/login") }],
        );
      }
    } catch (error) {
      setIsLoading(false);
      console.error("회원 탈퇴 오류:", error);
      if (Platform.OS === "web") {
        window.alert("탈퇴 처리 중 오류가 발생했습니다.");
      } else {
        Alert.alert("오류", "탈퇴 처리 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#fff" }} />
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
          <Text style={styles.title}>회원 탈퇴</Text>
        </View>
        <View style={styles.rightSection} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.warningSection}>
          <View style={styles.warningTitleContainer}>
            <Ionicons
              name="alert-circle-outline"
              size={20}
              color="#ff6b6b"
              style={styles.warningIcon}
            />
            <Text style={styles.warningTitle}>주의사항</Text>
          </View>
          <Text style={styles.warningText}>
            • 탈퇴 요청일로부터 일주일 이내에 철회 가능하며, 이후에는 복구가
            불가능합니다.
          </Text>
          <Text style={styles.warningText}>
            • 개인정보는 관련 법령에 따라 일정기간 보관 후 삭제됩니다.
          </Text>
        </View>
      </ScrollView>

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
