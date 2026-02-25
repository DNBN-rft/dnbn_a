import { apiGet, apiPost } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./nego-accepted.styles";

// 승인된 네고 아이템 타입
interface ApprovedNegoItem {
  orderCode: string;
  responseDateTime: string;
  productImg: ProductImage | null;
  storeNm: string;
  productNm: string;
  originalPrice: number;
  requestPrice: number;
}

interface ProductImage {
  originalName: string;
  fileUrl: string;
  order: number;
}

export default function NegoAcceptedScreen() {
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [approvedList, setApprovedList] = useState<ApprovedNegoItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 승인된 네고 결제 목록 조회
  const fetchPaymentNego = async (
    pageNum: number,
    isRefresh: boolean = false,
  ) => {
    if (loading || (!hasMore && !isRefresh)) return;

    try {
      setLoading(true);
      setError(false);

      const response = await apiGet(
        `/cust/nego/payment?page=${pageNum}&size=10`,
      );

      if (response.ok) {
        const data = await response.json();

        if (isRefresh) {
          setApprovedList(data?.content || []);
        } else {
          setApprovedList((prev) => [...prev, ...(data?.content || [])]);
        }

        setHasMore(!data?.last);
        setPage(pageNum);
      } else {
        setError(true);
        console.error("승인된 네고 목록 조회 실패:", response.status);
      }
    } catch (error) {
      setError(true);
      console.error("승인된 네고 목록 조회 중 오류:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 새로고침
  const handleRefresh = () => {
    setRefreshing(true);
    setHasMore(true);
    fetchPaymentNego(0, true);
  };

  // 무한 스크롤 - 더 불러오기
  const loadMore = () => {
    if (!loading && hasMore) {
      fetchPaymentNego(page + 1);
    }
  };

  // 화면 포커스 시 데이터 로드
  useFocusEffect(
    useCallback(() => {
      if (approvedList.length === 0) {
        fetchPaymentNego(0, true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  // 결제 처리
  const handlePayment = (item: ApprovedNegoItem) => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        `${item.productNm}을(를) ${item.requestPrice.toLocaleString()}원에 결제하시겠습니까?`,
      );
      if (confirmed) {
        processPayment(item, true);
      } else {
        processPayment(item, false);
      }
    } else {
      Alert.alert(
        "결제 확인",
        `${item.productNm}을(를) ${item.requestPrice.toLocaleString()}원에 결제하시겠습니까?`,
        [
          {
            text: "결제",
            onPress: () => processPayment(item, true),
          },
          {
            text: "취소",
            style: "cancel",
            onPress: () => processPayment(item, false),
          },
        ],
      );
    }
  };

  // 결제 처리 로직
  const processPayment = async (item: ApprovedNegoItem, status: boolean) => {
    try {
      // 결제 확인 API 호출
      const response = await apiPost("/cust/payment/confirm", {
        orderCode: item.orderCode,
        status: status,
      });

      if (response.ok) {
        const isSuccess = await response.json();

        if (isSuccess) {
          // 결제 성공
          router.push("/payment-complete");
        } else {
          // 결제 실패
          router.push("/payment-fail");
        }
      } else {
        console.error("결제 확인 API 호출 실패:", response.status);
        router.push("/payment-fail");
      }
    } catch (error) {
      console.error("결제 처리 중 오류:", error);
      router.push("/payment-fail");
    }
  };

  // 최상단으로 스크롤
  const scrollToTop = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const renderItem = ({ item }: { item: ApprovedNegoItem }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemDateTime}>
          승인일: {new Date(item.responseDateTime).toLocaleDateString()}{" "}
          {new Date(item.responseDateTime).toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
      <View style={styles.itemContent}>
        <View style={styles.itemImageContainer}>
          {item.productImg ? (
            <Image
              source={{ uri: item.productImg.fileUrl }}
              style={styles.itemImage}
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="image-outline" size={32} color="#CCCCCC" />
          )}
        </View>
        <View style={styles.itemDetails}>
          <View>
            <Text style={styles.storeName}>{item.storeNm}</Text>
            <Text style={styles.productName} numberOfLines={2}>
              {item.productNm}
            </Text>
          </View>
          <View>
            <Text style={styles.originalPrice}>
              {item.originalPrice.toLocaleString()}원
            </Text>
            <Text style={styles.requestPrice}>
              {item.requestPrice.toLocaleString()}원
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.itemFooter}>
        <TouchableOpacity
          style={styles.paymentButton}
          onPress={() => handlePayment(item)}
        >
          <Text style={styles.paymentButtonText}>결제하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#FFFFFF" }} />
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
          <Text style={styles.title}>결제</Text>
        </View>
        <View style={styles.rightSection} />
      </View>

      {/* 콘텐츠 */}
      {loading && approvedList.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#EF7810" />
        </View>
      ) : error ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#999" />
          <Text style={styles.emptyText}>데이터를 불러올 수 없습니다</Text>
          <TouchableOpacity
            style={{ marginTop: 20 }}
            onPress={() => handleRefresh()}
          >
            <Text style={{ color: "#EF7810", fontWeight: "600" }}>
              다시 시도
            </Text>
          </TouchableOpacity>
        </View>
      ) : approvedList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-circle-outline" size={60} color="#999" />
          <Text style={styles.emptyText}>승인된 네고 요청이 없습니다</Text>
        </View>
      ) : (
        <>
          <FlatList
            ref={listRef}
            data={approvedList}
            keyExtractor={(item) => `approved-${item.orderCode}`}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            onRefresh={handleRefresh}
            refreshing={refreshing}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loading && !refreshing ? (
                <View style={{ padding: 20, alignItems: "center" }}>
                  <ActivityIndicator size="small" color="#EF7810" />
                </View>
              ) : null
            }
          />

          <TouchableOpacity
            style={[styles.scrollToTopButton, { bottom: 30 + insets.bottom }]}
            onPress={scrollToTop}
          >
            <Ionicons name="chevron-up" size={24} color="#ef7810" />
          </TouchableOpacity>
        </>
      )}

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
