import { Ionicons } from "@expo/vector-icons";
import * as Brightness from "expo-brightness";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./qr-used.styles";

export default function QrUsedScreen() {
  const insets = useSafeAreaInsets();
  const searchParams = useLocalSearchParams();
  const qrImageUrl = searchParams.qrImageUrl as string;
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
        <View style={styles.leftSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.centerSection}>
          <Text style={styles.title}>QR코드</Text>
        </View>
        <View style={styles.rightSection} />
      </View>

      <View style={styles.qrContainer}>
        {qrImageUrl ? (
          <Image
            source={qrImageUrl}
            style={styles.qrImage}
            contentFit="contain"
          />
        ) : (
          <Text style={styles.qrText}>QR 코드를 불러올 수 없습니다.</Text>
        )}
      </View>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
