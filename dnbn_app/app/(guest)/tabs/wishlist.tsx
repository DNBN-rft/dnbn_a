import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function GuestWishlist() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Ionicons name="lock-closed-outline" size={64} color="#EF7810" />
      <Text style={styles.message}>로그인 후 이용 가능합니다</Text>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>뒤로 가기</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.push("/(auth)/login")}
      >
        <Text style={styles.loginButtonText}>로그인 하러 가기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 24,
  },
  message: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 12,
  },
  backButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EF7810",
    alignItems: "center",
    marginTop: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: "#EF7810",
    fontWeight: "500",
  },
  loginButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#EF7810",
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});
