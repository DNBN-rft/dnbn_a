import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./storeproducts.styles";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { router } from "expo-router";

export default function StoreProducts() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#ffffff" }} />
      )}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title} pointerEvents="none">
          상품 관리
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentWrapper}>
          <Text>등록된 상품</Text>
          <Text style={styles.subtitle}>상품을 관리하세요</Text>
        </View>
      </ScrollView>
      
      <TouchableOpacity
        onPress={() => router.navigate("/(store)/tabs/storehome")}>
        <View style={styles.addProductButton}>
          {/* productAdd 페이지 만들어서 연결 필요 */}
          <Ionicons name="add" size={24} color="#ef7810" />
        </View>
      </TouchableOpacity>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
