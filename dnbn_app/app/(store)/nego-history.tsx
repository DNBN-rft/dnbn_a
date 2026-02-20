import { apiGet } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./nego-history.styles";

// 네고 로그 API 응답 타입 정의
interface ImageFile {
  originalName: string;
  fileUrl: string;
  order: number;
}

interface NegoLogImages {
  files: ImageFile[];
}

interface NegoLogItem {
  negoLogIdx: number;
  categoryNm: string;
  images: NegoLogImages;
  startDateTime: string;
  endDateTime: string;
  productNm: string;
  productCode: string;
  productPrice: number;
  negoLogStatus: string;
}

interface PageableSort {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
}

interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: PageableSort;
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

interface NegoLogResponse {
  content: NegoLogItem[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: PageableSort;
  numberOfElements: number;
  empty: boolean;
}

// 네고 요청 로그 API 응답 타입 정의
interface NegoRequestLogItem {
  images: NegoLogImages;
  categoryNm: string;
  productCode: string;
  productNm: string;
  originalPrice: number;
  requestPrice: number;
  custCode: string;
  custNm: string;
  custTelNo: string;
  requestDateTime: string;
  requestStatus: string;
  storeCode: string;
}

interface NegoRequestLogResponse {
  content: NegoRequestLogItem[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: PageableSort;
  numberOfElements: number;
  empty: boolean;
}

export default function NegoHistory() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<"product" | "request">("product");

  // 네고 로그 리스트 상태 (상품 탭)
  const [productList, setProductList] = useState<NegoLogItem[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 네고 요청 로그 리스트 상태 (요청 탭)
  const [requestList, setRequestList] = useState<NegoRequestLogItem[]>([]);
  const [requestPage, setRequestPage] = useState(0);
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestHasMore, setRequestHasMore] = useState(true);
  const [requestRefreshing, setRequestRefreshing] = useState(false);

  // 네고 로그 API 호출
  const fetchNegoLogList = async (
    pageNum: number,
    isRefresh: boolean = false,
  ) => {
    if (loading || (!hasMore && !isRefresh)) return;

    try {
      setLoading(true);
      const response = await apiGet(
        `/store/app/nego-log/list?page=${pageNum}&size=10`,
      );

      if (response.ok) {
        const data: NegoLogResponse = await response.json();

        if (isRefresh) {
          setProductList(data.content);
        } else {
          setProductList((prev) => [...prev, ...data.content]);
        }

        setHasMore(!data.last);
        setPage(pageNum);
      } else {
        console.error("네고 로그 리스트 조회 실패:", response.status);
      }
    } catch (error) {
      console.error("네고 로그 리스트 API 호출 에러:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 무한 스크롤 - 더 불러오기 (상품 탭)
  const loadMore = () => {
    if (!loading && hasMore) {
      fetchNegoLogList(page + 1);
    }
  };

  // 새로고침 (상품 탭)
  const handleRefresh = () => {
    setRefreshing(true);
    setHasMore(true);
    fetchNegoLogList(0, true);
  };

  // 네고 요청 로그 API 호출
  const fetchNegoRequestLogList = async (
    pageNum: number,
    isRefresh: boolean = false,
  ) => {
    if (requestLoading || (!requestHasMore && !isRefresh)) return;

    try {
      setRequestLoading(true);
      const response = await apiGet(
        `/store/app/nego-req-log/list?page=${pageNum}&size=10`,
      );

      if (response.ok) {
        const data: NegoRequestLogResponse = await response.json();

        if (isRefresh) {
          setRequestList(data.content);
        } else {
          setRequestList((prev) => [...prev, ...data.content]);
        }

        setRequestHasMore(!data.last);
        setRequestPage(pageNum);
      } else {
        console.error("네고 요청 로그 리스트 조회 실패:", response.status);
      }
    } catch (error) {
      console.error("네고 요청 로그 리스트 API 호출 에러:", error);
    } finally {
      setRequestLoading(false);
      setRequestRefreshing(false);
    }
  };

  // 무한 스크롤 - 더 불러오기 (요청 탭)
  const loadMoreRequest = () => {
    if (!requestLoading && requestHasMore) {
      fetchNegoRequestLogList(requestPage + 1);
    }
  };

  // 새로고침 (요청 탭)
  const handleRequestRefresh = () => {
    setRequestRefreshing(true);
    setRequestHasMore(true);
    fetchNegoRequestLogList(0, true);
  };

  // 날짜 포맷 변환 함수 (ISO -> YYYY.MM.DD)
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  // 요청 상태 텍스트 변환
  const getRequestStatusText = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "완료";
      case "CANCELED":
        return "취소";
      default:
        return status;
    }
  };

  // 초기 데이터 로드
  useFocusEffect(
    useCallback(() => {
      if (activeTab === "product" && productList.length === 0) {
        fetchNegoLogList(0, true);
      } else if (activeTab === "request" && requestList.length === 0) {
        fetchNegoRequestLogList(0, true);
      }
    }, [activeTab]),
  );

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#ffffff" }} />
      )}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>네고 이력</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={
            activeTab === "product" ? styles.tabButtonActive : styles.tabButton
          }
          onPress={() => {
            setActiveTab("product");
            if (productList.length === 0) {
              fetchNegoLogList(0, true);
            }
          }}
        >
          <Text
            style={
              activeTab === "product"
                ? styles.tabButtonTextActive
                : styles.tabButtonText
            }
          >
            상품
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={
            activeTab === "request" ? styles.tabButtonActive : styles.tabButton
          }
          onPress={() => {
            setActiveTab("request");
            if (requestList.length === 0) {
              fetchNegoRequestLogList(0, true);
            }
          }}
        >
          <Text
            style={
              activeTab === "request"
                ? styles.tabButtonTextActive
                : styles.tabButtonText
            }
          >
            요청
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "product" ? (
        <FlatList
          data={productList}
          keyExtractor={(item, index) => `${item.productCode}-${index}`}
          showsVerticalScrollIndicator={false}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading && !refreshing ? (
              <View style={{ padding: 20, alignItems: "center" }}>
                <ActivityIndicator size="small" color="#000" />
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <View style={styles.productContainer}>
                <View style={styles.productImageContainer}>
                  {item.images?.files && item.images.files.length > 0 ? (
                    <Image
                      style={styles.productImage}
                      source={{ uri: item.images.files[0].fileUrl }}
                    />
                  ) : (
                    <Image
                      style={styles.productImage}
                      source={require("@/assets/images/image1.jpg")}
                    />
                  )}
                </View>

                <View style={styles.productInfoContainer}>
                  <View>
                    <Text style={styles.categoryText}>{item.categoryNm}</Text>

                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.productNameText}
                    >
                      {item.productNm}
                    </Text>
                  </View>

                  <View>
                    <Text style={styles.priceText}>
                      {item.productPrice.toLocaleString()}원
                    </Text>

                    <Text
                      style={[
                        styles.statusText,
                        item.negoLogStatus === "COMPLETED"
                          ? styles.statusComplete
                          : styles.statusDelete,
                      ]}
                    >
                      {item.negoLogStatus === "COMPLETED"
                        ? "완료"
                        : item.negoLogStatus}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.detailButton}
                  onPress={() => {
                    router.navigate({
                      pathname: "/(store)/nego-history-detail",
                      params: { negoLogIdx: item.negoLogIdx },
                    });
                  }}
                >
                  <Text style={styles.detailButtonText}>상세</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <FlatList
          data={requestList}
          keyExtractor={(item, index) => `${item.productCode}-${index}`}
          showsVerticalScrollIndicator={false}
          onRefresh={handleRequestRefresh}
          refreshing={requestRefreshing}
          onEndReached={loadMoreRequest}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            requestLoading && !requestRefreshing ? (
              <View style={{ padding: 20, alignItems: "center" }}>
                <ActivityIndicator size="small" color="#000" />
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <View style={styles.requestCard}>
              <View style={styles.requestHeaderContainer}>
                <Text
                  style={[
                    styles.requestResultText,
                    item.requestStatus === "COMPLETED"
                      ? styles.requestResultApprove
                      : styles.requestResultCancel,
                  ]}
                >
                  {getRequestStatusText(item.requestStatus)}
                </Text>
                <Text style={styles.processDateText}>
                  처리일: {formatDate(item.requestDateTime)}
                </Text>
              </View>

              <View style={styles.requestContainer}>
                <View style={styles.requestImageContainer}>
                  {item.images?.files && item.images.files.length > 0 ? (
                    <Image
                      style={styles.requestImage}
                      source={{ uri: item.images.files[0].fileUrl }}
                    />
                  ) : (
                    <Image
                      style={styles.requestImage}
                      source={require("@/assets/images/image1.jpg")}
                    />
                  )}
                </View>

                <View style={styles.requestInfoContainer}>
                  <View>
                    <Text style={styles.categoryText}>{item.categoryNm}</Text>

                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.productNameText}
                    >
                      {item.productNm}
                    </Text>
                  </View>

                  <View style={styles.priceContainer}>
                    <Text style={styles.originalPriceText}>
                      {item.originalPrice.toLocaleString()}원
                    </Text>
                    <Text style={styles.negoPriceText}>
                      {item.requestPrice.toLocaleString()}원
                    </Text>
                  </View>

                  <View style={styles.requestorContainer}>
                    <Text style={styles.requestorText}>{item.custNm}</Text>
                    <Text style={styles.requestorPhoneText}>
                      {item.custTelNo}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      )}

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
