import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./storehome.styles";

export default function StoreHome() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#ffffff" }} />
      )}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>가맹점 홈</Text>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push("/(cust)/tabs/custhome")}
        >
          <Ionicons name="storefront-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentWrapper}>
          <Text style={styles.welcomeText}>환영합니다! 가맹점님</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>오늘 주문</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>진행 중</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>완료</Text>
            </View>
          </View>

          <View style={styles.quickMenu}>
            <Text style={styles.sectionTitle}>빠른 서비스</Text>
            <View style={styles.menuGrid}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push("/(store)/tabs/storeproducts")}
              >
                <Ionicons name="duplicate-outline" size={28} color="#FF9500" />
                <Text style={styles.menuText}>상품 등록</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push("/(store)/tabs/storeproducts")}
              >
                <Ionicons name="chatbox-ellipses-outline" size={28} color="#FF9500" />
                <Text style={styles.menuText}>네고 요청</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push("/(store)/review-manage")}
              >
                <Ionicons name="pencil-outline" size={28} color="#FF9500" />
                <Text style={styles.menuText}>리뷰 관리</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push("/(cust)/tabs/custhome")}
              >
                <Ionicons name="bar-chart-outline" size={28} color="#FF9500" />
                <Text style={styles.menuText}>매출 통계</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push("/(cust)/tabs/custhome")}
              >
                <Ionicons name="storefront-outline" size={28} color="#FF9500" />
                <Text style={styles.menuText}>고객 화면</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}