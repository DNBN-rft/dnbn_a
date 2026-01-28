import Ionicons from "@expo/vector-icons/build/Ionicons";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
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

type AlarmType = typeof AlarmType[keyof typeof AlarmType];

// Alarm 인터페이스
interface Alarm {
  id: string;
  type: AlarmType;
  title: string;
  content: string;
  navigationLink: string;
  createdAt: Date;
  isRead?: boolean;
  category: "order" | "review" | "favorite" | "customer";
}

// Mock 알림 데이터
const mockNotifications: Alarm[] = [
  // 주문/픽업
  {
    id: "alarm_001",
    type: AlarmType.ORDER_COMPLETED,
    category: "order",
    title: "주문 완료",
    content: "편의점명: GS25 강남점\n주문번호: #202601271001",
    navigationLink: "/(cust)/orderlist",
    createdAt: new Date(2026, 0, 27, 14, 30),
    isRead: false,
  },
  {
    id: "alarm_002",
    type: AlarmType.PAYMENT_COMPLETED,
    category: "order",
    title: "결제 완료",
    content: "주문번호: #202601271001\n결제금액: 15,000원",
    navigationLink: "/(cust)/orderdetail",
    createdAt: new Date(2026, 0, 27, 14, 35),
    isRead: false,
  },
  {
    id: "alarm_003",
    type: AlarmType.PICKUP_COMPLETED,
    category: "order",
    title: "픽업 완료",
    content: "편의점명: CU 강남점\n픽업번호: #202601271002",
    navigationLink: "/(cust)/qr-used",
    createdAt: new Date(2026, 0, 27, 15, 0),
    isRead: false,
  },
  {
    id: "alarm_004",
    type: AlarmType.PAYMENT_FAILED,
    category: "order",
    title: "결제 실패",
    content: "주문번호: #202601271003\n다시 결제해주세요.",
    navigationLink: "/(cust)/paymentlist",
    createdAt: new Date(2026, 0, 26, 18, 20),
    isRead: true,
  },
  {
    id: "alarm_005",
    type: AlarmType.ORDER_CANCELLED,
    category: "order",
    title: "주문 취소 완료",
    content: "주문번호: #202601261001\n취소요청이 완료되었습니다.",
    navigationLink: "/(cust)/orderlist",
    createdAt: new Date(2026, 0, 26, 10, 15),
    isRead: true,
  },
  {
    id: "alarm_006",
    type: AlarmType.ORDER_REFUNDED,
    category: "order",
    title: "주문 환불 완료",
    content: "주문번호: #202601251001\n환불금액: 20,000원",
    navigationLink: "/(cust)/paymentlist",
    createdAt: new Date(2026, 0, 25, 16, 45),
    isRead: true,
  },  
  {
    id: "alarm_016",
    type: AlarmType.NEGO_APPROVED,
    category: "order",
    title: "네고 요청 승인",
    content: "주문번호: #202601261001\n네고 요청이 승인되었습니다.",
    navigationLink: "/(cust)/orderlist",
    createdAt: new Date(2026, 0, 26, 10, 15),
    isRead: true,
  },
  {
    id: "alarm_017",
    type: AlarmType.NEGO_REJECTED,
    category: "order",
    title: "네고 요청 거절",
    content: "주문번호: #202601261001\n네고 요청이 거절되었습니다.",
    navigationLink: "/(cust)/orderlist",
    createdAt: new Date(2026, 0, 26, 10, 15),
    isRead: true,
  },

  // 리뷰
  {
    id: "alarm_007",
    type: AlarmType.REVIEW_REQUEST,
    category: "review",
    title: "리뷰 작성 요청",
    content: "GS25 강남점의 상품에 대한 리뷰를 작성해주세요!\n구매제품: 카페라떼",
    navigationLink: "/(cust)/reviewreg",
    createdAt: new Date(2026, 0, 27, 13, 0),
    isRead: false,
  },
  {
    id: "alarm_008",
    type: AlarmType.REVIEW_STORE_ANSWER,
    category: "review",
    title: "리뷰에 대한 매장 답변",
    content: "당신의 리뷰에 GS25 강남점이 답변했습니다.\n감사합니다! 다음에도 방문해주세요.",
    navigationLink: "/(cust)/reviewdetail",
    createdAt: new Date(2026, 0, 26, 12, 30),
    isRead: true,
  },

  // 관심매장
  {
    id: "alarm_009",
    type: AlarmType.FAVORITE_STORE_DISCOUNT,
    category: "favorite",
    title: "관심매장의 할인 시작",
    content: "CU 강남역점에서 새로운 할인을 시작했습니다!\n커피 30% 할인 (~ 2026-02-05)",
    navigationLink: "/(store)/storedetail",
    createdAt: new Date(2026, 0, 27, 11, 0),
    isRead: false,
  },
  {
    id: "alarm_010",
    type: AlarmType.FAVORITE_STORE_NEGOTIATION,
    category: "favorite",
    title: "관심매장의 네고 시작",
    content: "GS25 명동점에서 네고가 시작되었습니다!\n참여 가능: 스프라이트 1,500원",
    navigationLink: "/(store)/storedetail",
    createdAt: new Date(2026, 0, 26, 15, 45),
    isRead: true,
  },

  // 고객센터
  {
    id: "alarm_011",
    type: AlarmType.REPORT_ANSWERED,
    category: "customer",
    title: "신고 답변 완료",
    content: "신고번호: #202601201001\n상품에 대한 신고에 답변이 완료되었습니다.",
    navigationLink: "/(cust)/reportdetail",
    createdAt: new Date(2026, 0, 27, 10, 0),
    isRead: false,
  },
  {
    id: "alarm_012",
    type: AlarmType.REPORT_ANSWERED_MODIFIED,
    category: "customer",
    title: "신고 답변 수정",
    content: "신고번호: #202601201002\n신고 답변이 수정되었습니다. 확인해주세요.",
    navigationLink: "/(cust)/reportdetail",
    createdAt: new Date(2026, 0, 26, 14, 20),
    isRead: true,
  },
  {
    id: "alarm_013",
    type: AlarmType.QUESTION_ANSWERED,
    category: "customer",
    title: "문의 답변 완료",
    content: "문의번호: #202601201001\n상품에 대한 문의에 답변이 완료되었습니다.",
    navigationLink: "/(cust)/questionreg",
    createdAt: new Date(2026, 0, 25, 11, 30),
    isRead: true,
  },
  {
    id: "alarm_014",
    type: AlarmType.QUESTION_ANSWERED_MODIFIED,
    category: "customer",
    title: "문의 답변 수정",
    content: "문의번호: #202601191001\n문의 답변이 수정되었습니다.",
    navigationLink: "/(cust)/questionreg",
    createdAt: new Date(2026, 0, 24, 9, 15),
    isRead: true,
  },
  {
    id: "alarm_015",
    type: AlarmType.NEW_NOTICE,
    category: "customer",
    title: "새로운 공지사항",
    content: "중요 공지\n서비스 점검 안내: 2026-02-01 23:00 ~ 2026-02-02 03:00",
    navigationLink: "/(cust)/noticedetail",
    createdAt: new Date(2026, 0, 23, 13, 45),
    isRead: true,
  },
];

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

  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
  });
}

function AlarmItemComponent({ alarm }: { alarm: Alarm }) {
  const handlePress = () => {
    router.navigate(alarm.navigationLink as any);
  };

  return (
    <TouchableOpacity
      style={[
        styles.alarmItem,
        !alarm.isRead && styles.alarmItemUnread,
      ]}
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

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<"order" | "review" | "favorite" | "customer">("order");

  const filteredNotifications = mockNotifications.filter(
    (alarm) => alarm.category === selectedTab
  );

  const tabs = [
    { id: "order", label: "주문/픽업" },
    { id: "favorite", label: "관심매장" },
    { id: "review", label: "리뷰" },
    { id: "customer", label: "고객센터" },
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
        <Text style={styles.title}>
          알림
        </Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              selectedTab === tab.id && styles.tabActive,
            ]}
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
        {filteredNotifications.length === 0 ? (
          <Text style={styles.emptyText}>알림이 없습니다 🔔</Text>
        ) : (
          <View style={styles.alarmList}>
            {filteredNotifications.map((alarm) => (
              <AlarmItemComponent key={alarm.id} alarm={alarm} />
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
