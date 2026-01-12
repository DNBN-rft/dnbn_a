import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { styles } from "./orders.styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function StoreOrdersScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#ffffff" }} />
      )}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color="black" />
          <Text style={styles.title} pointerEvents="none">
            주문관리
          </Text>
          <View style={styles.placeholder} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>주문 관리</Text>
          <Text style={styles.emptyText}>새로운 주문이 없습니다 📋</Text>
        </View>
      </ScrollView>
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
