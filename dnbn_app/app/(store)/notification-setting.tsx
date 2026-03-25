import { apiGet, apiPost } from "@/utils/api";
import { permitCheck } from "@/utils/notificationUtil";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Linking,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./notification-setting.styles";

export default function NotificationSetting() {
  const insets = useSafeAreaInsets();
  const [pushEnabled, setPushEnabled] = useState(false);
  const [alarmEnabled, setAlarmEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await apiGet("/store/app/alarm");
      if (response.ok) {
        const data = await response.json();
        setPushEnabled(data.pushSet);
        setAlarmEnabled(data.alarmSet);
      }
    } catch (error) {
      console.error("알림 설정 조회 오류:", error);
    }
  };

  const saveSettings = async () => {
    setIsSubmitting(true);
    let fcmToken: string | null = null;
    if (pushEnabled) {
      fcmToken = await permitCheck();
      if (!fcmToken) {
        Alert.alert(
          "알림 권한 필요",
          "마케팅 알림을 받으려면 기기 설정에서 알림 권한을 허용해주세요.",
          [
            { text: "설정으로 이동", onPress: () => Linking.openSettings() },
            { text: "취소", style: "cancel" },
          ],
        );
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const response = await apiPost("/store/app/alarm", {
        alarmSet: alarmEnabled,
        marketAgreed: pushEnabled,
        fcmToken,
      });
      if (response.ok) {
        Alert.alert("완료", "알림 설정이 저장되었습니다.", [
          { text: "확인", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("오류", "알림 설정 저장에 실패했습니다.");
      }
    } catch (error) {
      Alert.alert("오류", "알림 설정 저장에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
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
          <Text style={styles.title}>알림 설정</Text>
        </View>
        <View style={styles.rightSection} />
      </View>

      <View style={styles.notificationContainer}>
        <View style={styles.notificationContent}>
          <Text>푸시 알림 (마케팅 수신)</Text>
          <CumtomToggle isOn={pushEnabled} onToggle={setPushEnabled} />
        </View>
        <View style={styles.notificationContent}>
          <Text>알림 설정</Text>
          <CumtomToggle isOn={alarmEnabled} onToggle={setAlarmEnabled} />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && { opacity: 0.5 }]}
        onPress={saveSettings}
        disabled={isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? "저장 중..." : "저장"}
        </Text>
      </TouchableOpacity>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}

function CumtomToggle({
  isOn,
  onToggle,
}: {
  isOn: boolean;
  onToggle: (value: boolean) => void;
}) {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isOn ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isOn]);

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22], // 토글 움직임 범위
  });

  return (
    <Pressable
      style={[styles.toggle, isOn && styles.toggleOn]}
      onPress={() => onToggle(!isOn)}
    >
      <Animated.View style={[styles.circle, { transform: [{ translateX }] }]} />
    </Pressable>
  );
}
