import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { styles } from "../styles/storehome.styles";

export default function StoreHome() {
  const insets = useSafeAreaInsets();
  const [memberNm, setMemberNm] = useState<string>("");
  const [authorities, setAuthorities] = useState<string[]>([]);

  // 권한 확인 함수
  const hasAuthority = (requiredAuth: string): boolean => {
    return authorities.includes(requiredAuth);
  };

  useEffect(() => {
    const loadStoreInfo = async () => {
      try {
        let name: string | null = null;
        let authoritiesStr: string | null = null;

        if (Platform.OS === "web") {
          name = localStorage.getItem("memberNm");
          authoritiesStr = localStorage.getItem("authorities");
        } else {
          name = await SecureStore.getItemAsync("memberNm");
          authoritiesStr = await SecureStore.getItemAsync("authorities");
        }

        if (name) {
          setMemberNm(name);
        }

        if (authoritiesStr) {
          try {
            const parsedAuthorities = JSON.parse(authoritiesStr);
            setAuthorities(Array.isArray(parsedAuthorities) ? parsedAuthorities : []);
          } catch (e) {
            console.error("권한 파싱 실패:", e);
          }
        }
      } catch (error) {
        console.error("스토어 정보 로드 실패:", error);
      }
    };

    loadStoreInfo();
  }, []);
  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#ffffff" }} />
      )}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>가맹점 홈</Text>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push("/(store)/notifications")}
        >
          <Ionicons name="notifications-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? insets.bottom + 60 : 0 }}
      >
        <View style={styles.contentWrapper}>
          <Text style={styles.welcomeText}>환영합니다! {memberNm}님</Text>

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
              {hasAuthority("STORE_PRODUCT") && (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => router.push("/(store)/addproduct")}
                >
                  <Ionicons name="duplicate-outline" size={28} color="#FF9500" />
                  <Text style={styles.menuText}>상품 등록</Text>
                </TouchableOpacity>
              )}

              {hasAuthority("STORE_PRODUCT") && (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => router.navigate("/(store)/tabs/storenego?tab=request")}
                >
                  <Ionicons name="chatbox-ellipses-outline" size={28} color="#FF9500" />
                  <Text style={styles.menuText}>네고 요청</Text>
                </TouchableOpacity>
              )}

              {hasAuthority("STORE_REVIEW") && (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => router.push("/(store)/review-manage")}
                >
                  <Ionicons name="pencil-outline" size={28} color="#FF9500" />
                  <Text style={styles.menuText}>리뷰 관리</Text>
                </TouchableOpacity>
              )}

              {hasAuthority("STORE_ORDER") && (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => router.push("/(store)/storestatistic")}
                >
                  <Ionicons name="bar-chart-outline" size={28} color="#FF9500" />
                  <Text style={styles.menuText}>매출 통계</Text>
                </TouchableOpacity>
              )}

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