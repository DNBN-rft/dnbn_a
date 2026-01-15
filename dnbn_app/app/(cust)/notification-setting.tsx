import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./notification-setting.styles";

export default function NotificationSetting() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#FFFFFF" }} />
      )}
      
      <View style={styles.header}>
          <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/tabs/mypage')}
          >
          <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>
          알림 설정
          </Text>
          <View style={styles.placeholder} />
      </View>

      <View style={styles.notificationContainer}>
        <View style={styles.notificationContent}>
          <Text>앱 푸시 설정</Text>
          <CumtomToggle/>
        </View>
        <View style={styles.notificationContent}>
          <Text>알림 설정</Text>
          <CumtomToggle/>
        </View>
      </View>

      {insets.bottom > 0 && (
                <View style={{ height: insets.bottom, backgroundColor: '#000' }} />
            )}
    </View>
  )
}

function CumtomToggle() {
  const [isOn, setIsOn] = useState(false);
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
      onPress={() => setIsOn(prev =>!prev)}
    >
      <Animated.View
        style={[
          styles.circle,
          { transform: [{ translateX }] }
        ]}
      />
    </Pressable>
  );
}