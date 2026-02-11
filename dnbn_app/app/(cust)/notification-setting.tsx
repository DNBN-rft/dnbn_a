import { apiGet, apiPost } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./notification-setting.styles";

export default function NotificationSetting() {
  const insets = useSafeAreaInsets();
  const [appPushEnabled, setAppPushEnabled] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  // 페이지 로드 시 알림 설정 정보 가져오기
  useEffect(() => {
    fetchNotificationSettings();
  }, []);

  const fetchNotificationSettings = async () => {
    try {
      const response = await apiGet(`/cust/alarm`);

      if (response.ok) {
        const data = await response.json();
        setAppPushEnabled(data.pushSet);
        setNotificationEnabled(data.alarmSet);
      }
    } catch (error) {
      console.error("알림 설정 정보를 가져오는 중 오류:", error);
    }
  };

  const saveNotificationSettings = async () => {
    try {
      const custCode = "CUST_001";

      const response = await apiPost("/cust/alarm", {
        pushSet: appPushEnabled,
        alarmSet: notificationEnabled,
        custCode: custCode,
      });

      if (response.ok) {
        const message = await response.text();

        if (Platform.OS === "web") {
          window.alert(message);
          router.back();
        } else {
          Alert.alert("완료", message, [
            {
              text: "확인",
              onPress: () => router.back(),
            },
          ]);
        }
      } else {
        if (Platform.OS === "web") {
          window.alert("알림 설정 저장에 실패했습니다.");
        } else {
          Alert.alert("오류", "알림 설정 저장에 실패했습니다.");
        }
      }
    } catch (error) {
      if (Platform.OS === "web") {
        window.alert("알림 설정 저장에 실패했습니다.");
      } else {
        Alert.alert("오류", "알림 설정 저장에 실패했습니다.");
      }
    }
  };

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#FFFFFF" }} />
      )}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/tabs/mypage")}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>알림 설정</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.notificationContainer}>
        <View style={styles.notificationContent}>
          <Text>앱 푸시 설정</Text>
          <CumtomToggle isOn={appPushEnabled} onToggle={setAppPushEnabled} />
        </View>
        <View style={styles.notificationContent}>
          <Text>알림 설정</Text>
          <CumtomToggle
            isOn={notificationEnabled}
            onToggle={setNotificationEnabled}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={saveNotificationSettings}
      >
        <Text style={styles.submitButtonText}>저장</Text>
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
