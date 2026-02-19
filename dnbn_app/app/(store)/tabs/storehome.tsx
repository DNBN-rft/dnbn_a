import { apiGet } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "../styles/storehome.styles";

export default function StoreHome() {
  const insets = useSafeAreaInsets();
  const [memberNm, setMemberNm] = useState<string>("");
  const [authorities, setAuthorities] = useState<string[]>([]);
  const [todayOrderCount, setTodayOrderCount] = useState<number>(0);
  const [progressOrderCount, setProgressOrderCount] = useState<number>(0);
  const [completeOrderCount, setCompleteOrderCount] = useState<number>(0);

  // 권한 확인 함수
  const hasAuthority = (requiredAuth: string): boolean => {
    return authorities.includes(requiredAuth);
  };

  // 고객 화면 전환 함수
  const handleCustomerView = async () => {
    try {
      const response = await apiGet("/store/app/cross");

      if (response.ok) {
        const data = await response.json();
        
        // 가맹점 주소를 저장
        if (data.storeAddress) {
          if (Platform.OS === "web") {
            localStorage.setItem("storeAddress", data.storeAddress);
          } else {
            await SecureStore.setItemAsync("storeAddress", data.storeAddress);
          }
        }
        
        router.push("/(cust)/tabs/custhome");
      } else {
        console.error("API 호출 실패:", response.status);
      }
    } catch (error) {
      console.error("고객 화면 전환 중 오류:", error);
    }
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
            setAuthorities(
              Array.isArray(parsedAuthorities) ? parsedAuthorities : [],
            );
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

  // 페이지 접근 시 API 호출
  useFocusEffect(
    useCallback(() => {
      const fetchStoreHomeData = async () => {
        try {
          const response = await apiGet("/store/app/home");

          if (response.ok) {
            const data = await response.json();
            
            // API 응답 데이터를 state에 저장
            setTodayOrderCount(data.todayOrderCount || 0);
            setProgressOrderCount(data.progressOrderCount || 0);
            setCompleteOrderCount(data.completeOrderCount || 0);
          } else {
            console.error("가맹점 홈 API 호출 실패:", response.status);
          }
        } catch (error) {
          console.error("가맹점 홈 데이터 로드 실패:", error);
        }
      };

      fetchStoreHomeData();
    }, [])
  );
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

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === "ios" ? insets.bottom + 60 : 0,
        }}
      >
        <View style={styles.contentWrapper}>
          <Text style={styles.welcomeText}>환영합니다! {memberNm}님</Text>

          <Text style={styles.salesInfo}>오늘의 매출 정보</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{todayOrderCount}</Text>
              <Text style={styles.statLabel}>총 주문</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{progressOrderCount}</Text>
              <Text style={styles.statLabel}>진행 중</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{completeOrderCount}</Text>
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
                  <Ionicons
                    name="duplicate-outline"
                    size={28}
                    color="#FF9500"
                  />
                  <Text style={styles.menuText}>상품 등록</Text>
                </TouchableOpacity>
              )}

              {hasAuthority("STORE_PRODUCT") && (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() =>
                    router.navigate("/(store)/tabs/storenego?tab=request")
                  }
                >
                  <Ionicons
                    name="chatbox-ellipses-outline"
                    size={28}
                    color="#FF9500"
                  />
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
                  <Ionicons
                    name="bar-chart-outline"
                    size={28}
                    color="#FF9500"
                  />
                  <Text style={styles.menuText}>매출 통계</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleCustomerView}
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
