import { apiGet, apiPut } from "@/utils/api";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./notifications.styles";

// AlarmType
const AlarmType = {
  ORDER_COMPLETED: "ORDER_COMPLETED",
  PAYMENT_COMPLETED: "PAYMENT_COMPLETED",
  NEGO_APPROVED: "NEGO_APPROVED",
  NEGO_REJECTED: "NEGO_REJECTED",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  PICKUP_COMPLETED: "PICKUP_COMPLETED",
  ORDER_CANCELLED: "ORDER_CANCELLED",
  ORDER_REFUNDED: "ORDER_REFUNDED",
  REVIEW_REQUEST: "REVIEW_REQUEST",
  REVIEW_STORE_ANSWER: "REVIEW_STORE_ANSWER",
  FAVORITE_STORE_DISCOUNT: "FAVORITE_STORE_DISCOUNT",
  FAVORITE_STORE_NEGOTIATION: "FAVORITE_STORE_NEGOTIATION",
  REPORT_ANSWERED: "REPORT_ANSWERED",
  REPORT_ANSWERED_MODIFIED: "REPORT_ANSWERED_MODIFIED",
  QUESTION_ANSWERED: "QUESTION_ANSWERED",
  QUESTION_ANSWERED_MODIFIED: "QUESTION_ANSWERED_MODIFIED",
  NEW_NOTICE: "NEW_NOTICE",
} as const;

type AlarmType = (typeof AlarmType)[keyof typeof AlarmType];

// Alarm 인터페이스
interface Alarm {
  alarmIdx: number;
  alarmType: string;
  sendDateTime: string;
  readDateTime: string | null;
  alarmLink: string;
  content: string;
}

function formatTime(date: string): string {
  const now = new Date();
  const createdDate = new Date(date);
  const diffMs = now.getTime() - createdDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "방금";
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;

  return createdDate.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
  });
}

// 알람 타입을 카테고리로 변환
const getCategoryFromAlarmType = (alarmType: string): string => {
  if (!alarmType) return "기타";

  // 백엔드에서 한글로 오는 경우
  if (alarmType === "주문" || alarmType === "할인") return "product";
  if (alarmType === "네고" || alarmType === "네고 요청") return "nego";
  if (alarmType === "리뷰" || alarmType === "리뷰 요청") return "review";
  if (
    alarmType === "상품신고" ||
    alarmType === "리뷰신고" ||
    alarmType === "가맹신고" ||
    alarmType === "문의"
  )
    return "customer";
  if (alarmType === "상품 제재" || alarmType === "리뷰 숨김") return "etc";

  return "etc";
};

function AlarmItemComponent({
  alarm,
  onRead,
}: {
  alarm: Alarm;
  onRead: (alarmIdx: number) => void;
}) {
  const isRead = alarm.readDateTime !== null;

  const handlePress = async () => {
    if (!isRead) {
      await onRead(alarm.alarmIdx);
    }
    router.navigate(alarm.alarmLink as any);
  };

  return (
    <TouchableOpacity
      style={[styles.alarmItem, !isRead && styles.alarmItemUnread]}
      onPress={handlePress}
    >
      <View style={styles.alarmItemContent}>
        <View style={styles.alarmItemLeft}>
          <Text style={styles.alarmTitle}>{alarm.alarmType}</Text>
          <Text style={styles.alarmText}>{alarm.content}</Text>
          <Text style={styles.alarmTime}>{formatTime(alarm.sendDateTime)}</Text>
        </View>
        {!isRead && <View style={styles.alarmUnreadBadge} />}
      </View>
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<
    "all" | "product" | "nego" | "review" | "customer" | "etc"
  >("all");

  // 알림 목록 조회
  useEffect(() => {
    const loadAlarms = async () => {
      try {
        setIsLoading(true);
        let memberId: string | null = null;

        if (Platform.OS === "web") {
          memberId = localStorage.getItem("memberId");
        } else {
          memberId = await SecureStore.getItemAsync("memberId");
        }

        if (!memberId) {
          console.error("memberId를 찾을 수 없습니다");
          return;
        }

        const response = await apiGet(
          `/store/app/alarm/list?memberId=${memberId}`,
        );
        if (response.ok) {
          const data = await response.json();
          setAlarms(Array.isArray(data) ? data : []);
        } else {
          console.error("알림 로드 실패:", response.status);
        }
      } catch (error) {
        console.error("알림 로드 오류:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAlarms();
  }, []);

  // 알림 읽음 처리
  const handleReadAlarm = async (alarmIdx: number) => {
    try {
      const response = await apiPut(
        `/store/app/alarm/read?storeAlarmIdx=${alarmIdx}`,
        null,
      );
      if (response.ok) {
        // 로컬 상태 업데이트
        setAlarms((prevAlarms) =>
          prevAlarms.map((alarm) =>
            alarm.alarmIdx === alarmIdx
              ? { ...alarm, readDateTime: new Date().toISOString() }
              : alarm,
          ),
        );
      }
    } catch (error) {
      console.error("알림 읽음 처리 실패:", error);
    }
  };

  // 탭에 따른 필터링
  const filteredAlarms =
    selectedTab === "all"
      ? alarms
      : alarms.filter(
          (alarm) => getCategoryFromAlarmType(alarm.alarmType) === selectedTab,
        );

  const tabs = [
    { id: "all", label: "전체" },
    { id: "product", label: "상품" },
    { id: "nego", label: "네고" },
    { id: "review", label: "리뷰" },
    { id: "customer", label: "고객센터" },
    { id: "etc", label: "기타" },
  ] as const;

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
          <Text style={styles.title}>알림</Text>
        </View>
        <View style={styles.rightSection} />
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

      <ScrollView style={styles.content}>
        {isLoading ? (
          <Text style={styles.emptyText}>로딩 중...</Text>
        ) : filteredAlarms.length === 0 ? (
          <Text style={styles.emptyText}>알림이 없습니다 🔔</Text>
        ) : (
          <View style={styles.alarmList}>
            {filteredAlarms.map((alarm) => (
              <AlarmItemComponent
                key={alarm.alarmIdx}
                alarm={alarm}
                onRead={handleReadAlarm}
              />
            ))}
          </View>
        )}
      </ScrollView>
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
