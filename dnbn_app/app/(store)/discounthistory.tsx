import { apiGet } from "@/utils/api";
import { getStorageItem } from "@/utils/storageUtil";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./discounthistory.styles";

// API 응답 타입 정의
interface SaleHistoryApiResponse {
  content: SaleHistoryContent[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface SaleHistoryContent {
  productCode: string;
  startDateTime: string;
  endDateTime: string;
  productNm: string;
  originalPrice: number;
  saleType: string; // "할인률" 또는 "할인액"
  saleValue: number;
  saleLogStatus: string; // "할인 완료", "할인 취소"
  discountedPrice: number;
}

// 화면 표시용 타입
interface DiscountHistoryItem {
  id: string;
  uri: any;
  category: string;
  productName: string;
  originalPrice: number;
  discountRate?: number;
  discountAmount?: number;
  discountedPrice: number;
  finalPrice: number;
  status: string;
  startTime: string;
  endTime: string;
}

export default function DiscountHistoryPage() {
  const insets = useSafeAreaInsets();
  const [discountHistory, setDiscountHistory] = useState<DiscountHistoryItem[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);

  const formatDateTime = (dateTimeStr: string): string => {
    const date = new Date(dateTimeStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  // API 응답 데이터를 화면 표시용 데이터로 변환
  const transformApiData = useCallback((content: SaleHistoryContent[]): DiscountHistoryItem[] => {
    return content.map((item) => ({
      id: item.productCode,
      uri: require("@/assets/images/image1.jpg"), // 기본 이미지
      category: "", // API에서 제공하지 않으므로 빈 값
      productName: item.productNm,
      originalPrice: item.originalPrice,
      discountRate: item.saleType === "할인률" ? item.saleValue : undefined,
      discountAmount: item.saleType === "할인액" ? item.saleValue : undefined,
      discountedPrice: item.originalPrice - item.discountedPrice,
      finalPrice: item.discountedPrice,
      status: item.saleLogStatus === "할인 완료" ? "완료" : "취소",
      startTime: formatDateTime(item.startDateTime),
      endTime: formatDateTime(item.endDateTime),
    }));
  }, []);

  const fetchDiscountHistory = useCallback(async (page: number = 0) => {
    try {
      // 초기 로딩(page 0)과 추가 로딩 구분
      if (page === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      // Storage에서 storeCode 가져오기 - 웹과 앱 모두 동일한 방식으로 처리
      const storeCode = await getStorageItem("storeCode");

      if (!storeCode) {
        setError("매장 정보를 찾을 수 없습니다.");
        setLoading(false);
        setLoadingMore(false);
        return;
      }

      // API 호출 URL에 페이지 파라미터 추가
      const url = `/store/app/sale-history/${storeCode}?page=${page}&size=10`;

      // 웹과 앱 분기 처리
      if (Platform.OS === "web") {
        // 웹 환경에서의 API 호출
        console.log(`웹 환경에서 할인 내역 조회 (페이지 ${page}):`, storeCode);
        const response = await apiGet(url);

        if (response.ok) {
          const apiData: SaleHistoryApiResponse = await response.json();
          console.log("할인 내역 API 응답:", apiData);
          
          const transformedData = transformApiData(apiData.content);
          
          // 첫 페이지면 교체, 아니면 추가
          if (page === 0) {
            setDiscountHistory(transformedData);
          } else {
            setDiscountHistory(prev => [...prev, ...transformedData]);
          }
          
          setTotalElements(apiData.totalElements);
          setCurrentPage(apiData.currentPage);
          setHasNext(apiData.hasNext);
          
          console.log("변환된 할인 내역 데이터:", transformedData);
        } else {
          setError("할인 내역을 불러오는데 실패했습니다.");
        }
      } else {
        // 앱 환경에서의 API 호출
        console.log(`앱 환경에서 할인 내역 조회 (페이지 ${page}):`, storeCode);
        const response = await apiGet(url);

        if (response.ok) {
          const apiData: SaleHistoryApiResponse = await response.json();
          console.log("할인 내역 API 응답:", apiData);
          
          const transformedData = transformApiData(apiData.content);
          
          // 첫 페이지면 교체, 아니면 추가
          if (page === 0) {
            setDiscountHistory(transformedData);
          } else {
            setDiscountHistory(prev => [...prev, ...transformedData]);
          }
          
          setTotalElements(apiData.totalElements);
          setCurrentPage(apiData.currentPage);
          setHasNext(apiData.hasNext);
          
          console.log("변환된 할인 내역 데이터:", transformedData);
        } else {
          setError("할인 내역을 불러오는데 실패했습니다.");
        }
      }
    } catch (err) {
      console.error("할인 내역 조회 오류:", err);
      setError("할인 내역을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [transformApiData]);

  // 다음 페이지 로드
  const loadMore = useCallback(() => {
    if (hasNext && !loadingMore && !loading) {
      console.log(`다음 페이지 로드: ${currentPage + 1}`);
      fetchDiscountHistory(currentPage + 1);
    }
  }, [hasNext, loadingMore, loading, currentPage, fetchDiscountHistory]);

  useEffect(() => {
    fetchDiscountHistory(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <Text style={styles.title}>할인 내역</Text>
        <View style={styles.placeholder} />
      </View>

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#FF6B00" />
          <Text style={{ marginTop: 10, color: "#666" }}>
            {Platform.OS === "web" ? "웹에서 로딩 중..." : "앱에서 로딩 중..."}
          </Text>
        </View>
      ) : error ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Text style={{ color: "#FF0000", marginBottom: 10 }}>{error}</Text>
          <TouchableOpacity
            onPress={() => fetchDiscountHistory(0)}
            style={{ backgroundColor: "#FF6B00", padding: 10, borderRadius: 5 }}
          >
            <Text style={{ color: "#fff" }}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {totalElements > 0 && (
            <View style={{ padding: 15, backgroundColor: '#f5f5f5' }}>
              <Text style={{ fontSize: 14, color: '#666' }}>
                전체 {totalElements}개의 할인 내역
              </Text>
            </View>
          )}
          <FlatList
            data={discountHistory}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            showsVerticalScrollIndicator={false}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={() => (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
                <Text style={{ color: '#999', fontSize: 16 }}>할인 내역이 없습니다</Text>
              </View>
            )}
            ListFooterComponent={() => (
              loadingMore ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <ActivityIndicator size="small" color="#FF6B00" />
                  <Text style={{ marginTop: 8, color: '#666', fontSize: 12 }}>더 불러오는 중...</Text>
                </View>
              ) : null
            )}
            renderItem={({ item }) => (
              <View style={styles.discountProduct}>
                <View style={styles.productContainer}>
                  <View style={styles.productImageContainer}>
                    <Image style={styles.productImage} source={item.uri} />
                  </View>

                  <View style={styles.productInfoContainer}>
                    <View>
                      {item.category && (
                        <Text style={styles.categoryText}>{item.category}</Text>
                      )}
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={styles.productNameText}
                      >
                        {item.productName}
                      </Text>
                    </View>

                    <View style={styles.priceContainer}>
                      <Text style={styles.originalPriceText}>
                        {item.originalPrice.toLocaleString()}원
                      </Text>

                      <View style={styles.discountAndFinalRow}>
                        <Text style={styles.discountRateText}>
                          {item.discountRate
                            ? `${item.discountRate}%`
                            : `${item.discountAmount?.toLocaleString()}원`}
                        </Text>
                        <Text style={styles.divider}>|</Text>
                        <Text style={styles.finalPriceText}>
                          {item.finalPrice.toLocaleString()}원
                        </Text>
                      </View>

                      <Text
                        style={[
                          styles.statusText,
                          item.status === "완료"
                            ? styles.statusComplete
                            : styles.statusCanceled,
                        ]}
                      >
                        {item.status}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.detailButtonContainer}>
                  <TouchableOpacity
                    style={styles.detailButton}
                    onPress={() =>
                      router.push({
                        pathname: "/(store)/discountdetail",
                        params: { id: item.id },
                      })
                    }
                  >
                    <Text style={styles.detailButtonText}>상세</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </>
      )}

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
