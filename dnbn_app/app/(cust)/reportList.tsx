import { apiGet } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./reportList.styles";

interface ReportItem {
  reportIdx: number;
  reportType: string;
  title: string;
  reportStatus: string;
  reportRegDateTime: string;
}

export default function ReportListScreen() {
  const insets = useSafeAreaInsets();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchReports(0, true);
  }, []);

  const fetchReports = async (pageNum: number, isInitial: boolean = false) => {
    try {
      if (isInitial) {
        setLoading(true);
        setPage(0);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }

      const response = await apiGet(`/cust/report?page=${pageNum}&size=10`);

      if (!response.ok) {
        throw new Error("신고 목록을 불러오는데 실패했습니다.");
      }

      const data = await response.json();

      // 페이지 응답 구조에 따라 조정 필요 (content, last 등)
      const newReports = data.content || data;
      const isLast =
        data.last !== undefined ? data.last : newReports.length < 10;

      if (isInitial) {
        setReports(newReports);
      } else {
        setReports((prev) => [...prev, ...newReports]);
      }

      setHasMore(!isLast);
      setPage(pageNum);
    } catch (err) {
      console.error("신고 목록 불러오기 실패:", err);
      if (isInitial) {
        setError("신고 목록을 불러오는데 실패했습니다.");
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreReports = () => {
    if (!loadingMore && hasMore) {
      fetchReports(page + 1, false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
          <Text style={styles.title}>신고 목록</Text>
        </View>
        <View style={styles.rightSection} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B00" />
          <Text style={styles.loadingText}>신고 목록을 불러오는 중...</Text>
        </View>
      ) : error ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>{error}</Text>
        </View>
      ) : reports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>등록된 신고 정보가 없습니다.</Text>
        </View>
      ) : (
        <View style={styles.reportContainer}>
          <FlatList
            data={reports}
            keyExtractor={(item) => item.reportIdx.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            onEndReached={loadMoreReports}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loadingMore ? (
                <View style={styles.footerLoader}>
                  <ActivityIndicator size="small" color="#FF6B00" />
                </View>
              ) : null
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.cardContainer}
                onPress={() =>
                  router.push(
                    `/(cust)/reportDetail?reportIdx=${item.reportIdx}`,
                  )
                }
                activeOpacity={0.7}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.typeRow}>
                    <View style={styles.typeTag}>
                      <Text style={styles.typeText}>{item.reportType}</Text>
                    </View>
                    <Text style={styles.idxText}>#{item.reportIdx}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      item.reportStatus === "처리완료" &&
                        styles.statusBadgeCompleted,
                      item.reportStatus === "처리대기" &&
                        styles.statusBadgePending,
                      item.reportStatus === "반려" &&
                        styles.statusBadgeRejected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        item.reportStatus === "처리완료" &&
                          styles.statusTextCompleted,
                        item.reportStatus === "처리대기" &&
                          styles.statusTextPending,
                        item.reportStatus === "반려" &&
                          styles.statusTextRejected,
                      ]}
                    >
                      {item.reportStatus}
                    </Text>
                  </View>
                </View>

                <Text style={styles.reportTitle}>{item.title}</Text>
                <Text style={styles.reportDate}>
                  {new Date(item.reportRegDateTime).toLocaleDateString()}
                </Text>

                {expandedId === item.reportIdx && (
                  <View style={styles.reportAnswerContainer}>
                    <Text style={styles.reportAnswerLabel}>답변</Text>
                    <Text style={styles.reportAnswer}>
                      아직 답변이 없습니다.
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
