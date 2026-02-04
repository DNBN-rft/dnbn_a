import { apiGet } from "@/utils/api";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./notifications.styles";

// AlarmType (API에서 한글로 내려옴)
const AlarmType = {
  PRODUCT: "주문/픽업",
  REVIEW: "리뷰",
  STORE: "관심매장",
  CS: "고객센터",
} as const;

type AlarmType = (typeof AlarmType)[keyof typeof AlarmType];

// Alarm 인터페이스
interface Alarm {
  custAlarmIdx: number;
  type: AlarmType;
  title: string;
  content: string;
  navigationLink: string;
  createdAt: Date;
  isRead?: boolean;
}

// API Response 인터페이스
interface CustAlarmListResponse {
  title: string;
  content: string;
  sendDateTime: string;
  readDateTime: string | null;
  custAlarmType: AlarmType;
  alarmLink: string;
  custAlarmIdx: number;
}

interface PagedAlarmResponse {
  content: CustAlarmListResponse[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

function formatTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "방금";
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;

  return date.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
  });
}

function AlarmItemComponent({ alarm }: { alarm: Alarm }) {
  const handlePress = () => {
    // alarmLink가 상품 코드라면 상품 상세 페이지로 이동
    // 예: "PRD_001" -> product-detail 페이지
    if (alarm.navigationLink.startsWith("PRD_")) {
      router.push({
        pathname: "/(cust)/product-detail",
        params: {
          productCode: alarm.navigationLink,
        },
      });
    } else {
      // 기타 경로는 그대로 사용
      router.navigate(alarm.navigationLink as any);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.alarmItem, !alarm.isRead && styles.alarmItemUnread]}
      onPress={handlePress}
    >
      <View style={styles.alarmItemContent}>
        <View style={styles.alarmItemLeft}>
          <Text style={styles.alarmTitle}>{alarm.title}</Text>
          <Text style={styles.alarmText}>{alarm.content}</Text>
          <Text style={styles.alarmTime}>{formatTime(alarm.createdAt)}</Text>
        </View>
        {!alarm.isRead && <View style={styles.alarmUnreadBadge} />}
      </View>
    </TouchableOpacity>
  );
}

// API Response를 Alarm 객체로 변환하는 함수
function mapResponseToAlarm(response: CustAlarmListResponse): Alarm {
  return {
    custAlarmIdx: response.custAlarmIdx,
    type: response.custAlarmType,
    title: response.title,
    content: response.content,
    navigationLink: response.alarmLink,
    createdAt: new Date(response.sendDateTime),
    isRead: response.readDateTime !== null,
  };
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<AlarmType>(AlarmType.PRODUCT);
  const [notifications, setNotifications] = useState<Alarm[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // 탭 변경 시 리셋
    setNotifications([]);
    setCurrentPage(0);
    setHasMore(true);
    fetchAlarms(0, true);
  }, [selectedTab]);

  const fetchAlarms = async (page: number = 0, isRefresh: boolean = false) => {
    if (!hasMore && !isRefresh) return;
    
    try {
      if (isRefresh) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const custCode =
        Platform.OS === "web"
          ? localStorage.getItem("custCode")
          : await SecureStore.getItemAsync("custCode");

      if (!custCode) {
        console.error("custCode가 없습니다.");
        setLoading(false);
        setLoadingMore(false);
        return;
      }

      const response = await apiGet(
        `/cust/alarm/list?custCode=${custCode}&page=${page}&size=20`
      );

      if (response.ok) {
        const data: PagedAlarmResponse = await response.json();
        const newAlarms = data.content.map(mapResponseToAlarm);
        
        if (isRefresh) {
          setNotifications(newAlarms);
        } else {
          setNotifications(prev => [...prev, ...newAlarms]);
        }
        
        setCurrentPage(page);
        setHasMore(!data.last);
      } else {
        console.error("알림 목록 조회 실패:", response.status);
      }
    } catch (error) {
      console.error("알림 목록 조회 중 오류:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchAlarms(currentPage + 1, false);
    }
  };

  const filteredNotifications = notifications.filter(
    (alarm) => alarm.type === selectedTab,
  );

  const tabs = [
    { id: AlarmType.PRODUCT, label: "주문/픽업" },
    { id: AlarmType.STORE, label: "관심매장" },
    { id: AlarmType.REVIEW, label: "리뷰" },
    { id: AlarmType.CS, label: "고객센터" },
  ] as const;

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
        <Text style={styles.title}>알림</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, selectedTab === tab.id && styles.tabActive]}
            onPress={() => setSelectedTab(tab.id)}
          >
            <Text
              style={[
                styles.tabLabel,
                selectedTab === tab.id && styles.tabLabelActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#EF7810" />
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item.custAlarmIdx.toString()}
          renderItem={({ item }) => <AlarmItemComponent alarm={item} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>알림이 없습니다</Text>
            </View>
          }
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoading}>
                <ActivityIndicator size="small" color="#EF7810" />
              </View>
            ) : null
          }
        />
      )}
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
