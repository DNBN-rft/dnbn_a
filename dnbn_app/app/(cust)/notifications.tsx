import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { styles } from "./notifications.styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { router } from "expo-router";

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
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
        <Text style={styles.title} pointerEvents="none">
          알림
        </Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.emptyText}>새로운 알림이 없습니다 🔔</Text>
      </ScrollView>
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
