import { apiGet } from "@/utils/api";
import { formatCountdown } from "@/utils/dateUtil";
import { formatDistance } from "@/utils/distance";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./saleproductlist.styles";

type SortType = "distance" | "price" | "rating" | "new";

interface FileItem {
  originalName: string;
  fileUrl: string;
  order: number;
}

interface FileMasterResponse {
  files: FileItem[];
}

type SaleType = "할인률" | "할인가";

interface CustSaleListResponse {
  productCode: string;
  images: FileMasterResponse;
  originalPrice: number;
  discountPrice: number;
  saleType: SaleType;
  saleValue: number;
  startDateTime: string;
  endDateTime: string;
  productNm: string;
  storeNm: string;
  latitude: number; // 위도 (Y)
  longitude: number; // 경도 (X)
  distanceM: number;
  reviewCount: number;
  reviewAvg: number;
}

interface CustSaleListPageResponse {
  content: CustSaleListResponse[];
  last: boolean;
  number: number;
}

interface SaleProduct {
  productCode: string;
  uri: any;
  productName: string;
  storeName: string;
  discount: number;
  price: number;
  originalPrice: number;
  distance: number;
  rating: number;
  reviewCount: number;
  category: string;
  timeLimitSeconds: number;
  saleType: SaleType;
}

export default function SaleProductListScreen() {
  const insets = useSafeAreaInsets();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const [sortBy, setSortBy] = useState<SortType>("distance");
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: number }>({});
  const [saleProducts, setSaleProducts] = useState<SaleProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const flatListRef = useRef<import("react-native").FlatList>(null);

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const fetchSaleProducts = async (
    pageNum: number,
    isRefresh: boolean = false,
  ) => {
    if (loadingMore || (pageNum > 0 && !hasMore)) return;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else if (pageNum === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const apiBaseUrl =
        from === "search" ? `/cust/search/sale-list` : `/cust/sales`;
      const response = await apiGet(`${apiBaseUrl}?page=${pageNum}&size=10`);

      if (!response.ok) {
        throw new Error("Failed to fetch sale products");
      }

      const data: CustSaleListPageResponse = await response.json();
      const content: CustSaleListResponse[] = data?.content || [];

      const products: SaleProduct[] = content.map((item) => {
        // 종료 시간까지 남은 시간 계산 (초 단위)
        const endTime = new Date(item.endDateTime).getTime();
        const now = Date.now();
        const timeLimitSeconds = Math.max(
          0,
          Math.floor((endTime - now) / 1000),
        );

        const discount =
          item.saleType === "할인률"
            ? item.saleValue
            : Math.round((item.saleValue / item.originalPrice) * 100);

        // 백엔드에서 제공된 거리(M) 그대로 저장
        const distanceM = item.distanceM;

        // 첫 번째 이미지 URL 가져오기 (order 기준 정렬)
        const firstImage =
          item.images?.files?.length > 0
            ? item.images.files.sort((a, b) => a.order - b.order)[0]
            : null;

        return {
          productCode: item.productCode,
          uri: firstImage?.fileUrl ? { uri: firstImage.fileUrl } : null,
          productName: item.productNm,
          storeName: item.storeNm,
          discount: discount,
          price: item.discountPrice,
          originalPrice: item.originalPrice,
          distance: distanceM,
          rating: item.reviewAvg,
          reviewCount: item.reviewCount,
          category: "",
          timeLimitSeconds: timeLimitSeconds,
          saleType: item.saleType,
        };
      });

      setSaleProducts((prev) => {
        const merged =
          pageNum === 0
            ? products
            : [
                ...prev,
                ...products.filter(
                  (nextItem) =>
                    !prev.some(
                      (prevItem) => prevItem.productCode === nextItem.productCode,
                    ),
                ),
              ];

        const initialTimeLeft: { [key: string]: number } = {};
        merged.forEach((product) => {
          initialTimeLeft[product.productCode] = product.timeLimitSeconds;
        });
        setTimeLeft(initialTimeLeft);

        return merged;
      });
      setPage(data?.number ?? pageNum);
      setHasMore(!data?.last);
    } catch (error) {
      console.error("할인 상품 목록 조회 실패:", error);
      if (pageNum === 0) {
        setSaleProducts([]);
        setTimeLeft({});
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setHasMore(true);
    setPage(0);
    fetchSaleProducts(0);
  }, [from]);

  const handleRefresh = () => {
    setHasMore(true);
    setPage(0);
    fetchSaleProducts(0, true);
  };

  const handleLoadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      fetchSaleProducts(page + 1);
    }
  };

  // 초기 timeLeft 설정 및 카운트다운
  useEffect(() => {
    if (saleProducts.length === 0) return;

    // 1초마다 업데이트
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const updated: { [key: string]: number } = {};
        saleProducts.forEach((product) => {
          const currentTime =
            prev[product.productCode] ?? product.timeLimitSeconds;
          // 0이 되면 카운트 중단 (0 유지)
          if (currentTime <= 0) {
            updated[product.productCode] = 0;
          } else {
            updated[product.productCode] = currentTime - 1;
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [saleProducts]);

  const getSortedProducts = () => {
    const sorted = [...saleProducts];
    switch (sortBy) {
      case "distance":
        return sorted.sort((a, b) => a.distance - b.distance);
      case "price":
        return sorted.sort((a, b) => a.price - b.price);
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "new":
        return sorted.reverse();
      default:
        return sorted;
    }
  };

  const sortOptions: { id: SortType; label: string }[] = [
    { id: "distance", label: "거리순" },
    { id: "price", label: "가격순" },
    { id: "rating", label: "평점순" },
    { id: "new", label: "신규순" },
  ];

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
          <Text style={styles.title}>할인 상품</Text>
        </View>
        <View style={styles.rightSection} />
      </View>

      {/* 정렬 옵션 */}
      <View style={styles.sortContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortContentContainer}
        >
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.sortButton,
                sortBy === option.id && styles.sortButtonActive,
              ]}
              onPress={() => setSortBy(option.id)}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  sortBy === option.id && styles.sortButtonTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B00" />
          <Text style={styles.loadingText}>할인 상품을 불러오는 중...</Text>
        </View>
      ) : saleProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="pricetags-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>등록된 할인 상품이 없습니다</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={getSortedProducts()}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.productCode}
          contentContainerStyle={{ paddingVertical: 8 }}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View style={{ paddingVertical: 16 }}>
                <ActivityIndicator size="small" color="#FF6B00" />
              </View>
            ) : null
          }
          renderItem={({ item }) => {
            const isExpired =
              timeLeft[item.productCode] !== undefined &&
              timeLeft[item.productCode] <= 0;

            return (
              <TouchableOpacity
                style={[
                  styles.productItemContainer,
                  isExpired && styles.productItemExpired,
                ]}
                onPress={() => {
                  router.push({
                    pathname: "/(cust)/sale-product-detail",
                    params: { productCode: item.productCode },
                  });
                }}
                activeOpacity={0.7}
                disabled={isExpired}
              >
                {/* 시간 제한 배너 */}
                {item.timeLimitSeconds &&
                  timeLeft[item.productCode] !== undefined && (
                  <View
                    style={[
                      styles.timeLimitBanner,
                      isExpired && styles.timeLimitBannerExpired,
                    ]}
                  >
                    <Ionicons
                      name={isExpired ? "close-circle" : "time"}
                      size={16}
                      color={isExpired ? "#999" : "rgb(239, 120, 16)"}
                    />
                    <Text
                      style={[
                        styles.timeLimitBannerText,
                        isExpired && styles.timeLimitBannerTextExpired,
                      ]}
                    >
                      {isExpired
                        ? "등록 시간 만료"
                        : `남은 시간: ${formatCountdown(timeLeft[item.productCode])}`}
                    </Text>
                  </View>
                )}

                {/* 이미지와 정보 */}
                <View style={styles.productContentRow}>
                  {/* 이미지 */}
                  <View style={styles.productImageWrapper}>
                    {item.uri ? (
                      <Image
                        resizeMode="stretch"
                        source={item.uri}
                        style={[
                          styles.productImage,
                          isExpired && styles.productImageExpired,
                        ]}
                      />
                    ) : (
                      <View
                        style={[
                          styles.productImage,
                          styles.noImageBox,
                          isExpired && styles.productImageExpired,
                        ]}
                      >
                        <Ionicons
                          name="image-outline"
                          size={50}
                          color="#ccc"
                        />
                      </View>
                    )}
                    {/* 할인 배지 */}
                    <View
                      style={[
                        styles.discountBadge,
                        isExpired && styles.discountBadgeExpired,
                      ]}
                    >
                      <Text style={styles.discountBadgeText}>
                        {item.saleType === "할인률"
                          ? `${item.discount}%`
                          : `${item.price.toLocaleString()}원`}
                      </Text>
                    </View>
                  </View>

                  {/* 정보 */}
                  <View style={styles.productInfo}>
                    <View style={styles.storeNameRow}>
                      <Text style={styles.storeName}>{item.storeName}</Text>
                      <Text style={styles.distanceText}>
                        {formatDistance(item.distance)}
                      </Text>
                    </View>

                    <Text style={styles.productName}>{item.productName}</Text>

                    <Text style={styles.originalPriceText}>
                      {item.originalPrice.toLocaleString()}원
                    </Text>

                    <View style={styles.discountPriceRow}>
                      <Text style={styles.priceText}>
                        {item.price.toLocaleString()}원
                      </Text>
                    </View>

                    <View style={styles.reviewSection}>
                      <Ionicons name="star" size={14} color="#FFB800" />
                      <Text style={styles.ratingText}>{item.rating}</Text>
                      <Text style={styles.reviewCountText}>
                        ({item.reviewCount})
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        ></FlatList>
      )}

      <TouchableOpacity
        style={[styles.scrollToTopButton, { bottom: 30 + insets.bottom }]}
        onPress={scrollToTop}
      >
        <Ionicons name="chevron-up" size={24} color="#EF7810" />
      </TouchableOpacity>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
