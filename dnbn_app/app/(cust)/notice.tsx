import { apiGet } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./notice.styles";

interface Notice {
  noticeIdx: number;
  title: string;
  regDateTime: string;
  isPinned: boolean;
}

export default function NoticeScreen() {
  const insets = useSafeAreaInsets();
  const [noticeList, setNoticeList] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiGet("/cust/notice");

      if (response.ok) {
        const data = await response.json();
        // isPinned인 항목을 먼저, 그 다음 최근순으로 정렬
        const sorted = data.sort((a: Notice, b: Notice) => {
          if (a.isPinned === b.isPinned) {
            return (
              new Date(b.regDateTime).getTime() -
              new Date(a.regDateTime).getTime()
            );
          }
          return a.isPinned ? -1 : 1;
        });
        setNoticeList(sorted);
      } else {
        setError("공지사항을 불러올 수 없습니다");
      }
    } catch (err) {
      setError("공지사항 로드 중 오류가 발생했습니다");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR");
  };

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#FFFFFF" }} />
      )}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>공지사항</Text>
        <View style={styles.placeholder} />
      </View>

      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#FF5722" />
        </View>
      ) : error ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#999" />
          <Text style={styles.emptyText}>서버 오류가 발생했습니다</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchNotices}>
            <Ionicons name="refresh" size={20} color="#EF7810" />
            <Text style={styles.refreshButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      ) : noticeList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-outline" size={60} color="#999" />
          <Text style={styles.emptyText}>공지사항이 존재하지 않습니다</Text>
        </View>
      ) : (
        <FlatList
          data={noticeList}
          keyExtractor={(item) => item.noticeIdx.toString()}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 20 }}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.noticeItemContainer,
                item.isPinned && styles.pinnedNoticeContainer,
                { opacity: pressed ? 0.7 : 1 },
              ]}
              onPress={() =>
                router.push({
                  pathname: "/(cust)/noticeDetail",
                  params: { noticeIdx: item.noticeIdx },
                })
              }
            >
              <View style={styles.noticeItemDetailContainer}>
                {item.isPinned && (
                  <View style={styles.pinnedBadge}>
                    <Ionicons
                      name="pin"
                      size={11}
                      color="#FFFFFF"
                      style={styles.pinnedIcon}
                    />
                    <Text style={styles.pinnedBadgeText}>고정</Text>
                  </View>
                )}
                <Text style={styles.noticeItemTitleText}>{item.title}</Text>
                <Text style={styles.noticeItemDateText}>
                  {formatDate(item.regDateTime)}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={item.isPinned ? "#EF7810" : "#C7C7CC"}
                style={styles.chevronIcon}
              />
            </Pressable>
          )}
        />
      )}
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
