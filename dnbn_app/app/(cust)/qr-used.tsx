import { styles } from "./qr-used.styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import * as Brightness from "expo-brightness";

export default function QrUsedScreen() {
  const insets = useSafeAreaInsets();
  const originalBrightness = useRef<number>(0);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Brightness.requestPermissionsAsync();
        if (status === "granted") {
          originalBrightness.current = await Brightness.getBrightnessAsync();
          await Brightness.setBrightnessAsync(1.0);
        }
      } catch (error) {
        console.error("Failed to set brightness:", error);
      }
    })();

    // 페이지 이탈 시 원래 밝기로 복원
    return () => {
      (async () => {
        try {
          await Brightness.setBrightnessAsync(originalBrightness.current);
        } catch (error) {
          console.error("Failed to restore brightness:", error);
        }
      })();
    };
  }, []);
  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#fff" }} />
      )}

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title} pointerEvents="none">
          QR
        </Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.qrContainer}>
        <Image source={require("@/assets/images/qr.png")}
        style={styles.qrImage}/>
        <Text style={styles.qrText}>ORD12384</Text>
      </View>

      {insets.bottom > 0 && (
        <View style={{height: insets.bottom, backgroundColor: "#000"}} />
      )}
    </View>
  );
}
