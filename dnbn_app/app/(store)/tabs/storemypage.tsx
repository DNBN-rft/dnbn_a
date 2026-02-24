import { useAuth } from "@/contexts/AuthContext";
import { clearAuthData } from "@/utils/storageUtil";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "../styles/storemypage.styles";

export default function StoreMypage() {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await clearAuthData("store");
      logout();
    } catch (error) {
      // Storage 정리 실패 시도 로그인 페이지로 이동
    } finally {
      router.replace("/(auth)/login");
    }
  };

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#ffffff" }} />
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
          <Text style={styles.title}>마이페이지</Text>
        </View>
        <View style={styles.rightSection} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === "ios" ? insets.bottom + 60 : 0,
        }}
      >
        <View style={styles.contentWrapper}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>회원 정보</Text>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.navigate("/(store)/storeinfo")}
            >
              <Text style={styles.menuText}>내 가맹점</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.navigate("/(store)/storeemployee")}
            >
              <Text style={styles.menuText}>직원관리</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.navigate("/(store)/notification-setting")}
            >
              <Text style={styles.menuText}>알림설정</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>히스토리</Text>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.navigate("/(store)/discounthistory")}
            >
              <Text style={styles.menuText}>할인</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/(store)/nego-history")}
            >
              <Text style={styles.menuText}>네고</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>고객지원</Text>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.navigate("/(store)/storeNotice")}
            >
              <Text style={styles.menuText}>공지사항</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.navigate("/(store)/storeQuestion")}
            >
              <Text style={styles.menuText}>문의</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text style={[styles.menuText, styles.logoutText]}>로그아웃</Text>
              <Ionicons name="chevron-forward" size={24} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
