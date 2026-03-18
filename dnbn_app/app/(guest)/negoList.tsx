import { formatDistance } from "@/utils/distance";
import { apiGet } from "@/utils/api";
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
import { styles } from "./negolist.styles";

type SortType = "distance" | "price" | "rating" | "new";

interface files {
  fileUrl: string;
  originalName: string;
  order: number;
}

interface NegoProduct {
  productCode: string;
  images: {
    files: files[];
  };
  price: number;
  startDateTime: string;
  endDateTime: string;
  productNm: string;
  storeNm: string;
  storeCode: string;
  latitude: number;
  longitude: number;
  distanceM: number;
  reviewCount: number;
  reviewAvg: number;
}

interface NegoProductPageResponse {
  content: NegoProduct[];
  last: boolean;
  number: number;
}

interface NegoProductCardProps {
  item: NegoProduct;
  productCode?: string;
  timeLeft: number;
  distanceInMeters: number;
}

function NegoProductCard({
  item,
  productCode,
  timeLeft,
  distanceInMeters,
}: NegoProductCardProps) {
  const code = productCode || item.productCode;

  return (
    <TouchableOpacity
      style={styles.productItemContainer}
      onPress={() =>
        router.push(`/(guest)/nego-product-detail?productCode=${code}`)
      }
      activeOpacity={0.7}
    >
      {/* 시간 제한 배너 */}
      {timeLeft !== undefined && timeLeft > 0 && (
        <View style={styles.timeLimitBanner}>
          <Ionicons name="time" size={16} color="rgb(239, 120, 16)" />
          <Text style={styles.timeLimitBannerText}>
            남은 시간: {formatCountdown(timeLeft)}
          </Text>
        </View>
      )}

      {/* 이미지와 정보 */}
      <View style={styles.productContentRow}>
        {/* 이미지 */}
        <View style={styles.productImageWrapper}>
          <Image
            resizeMode="stretch"
            source={{
              uri:
                item.images?.files?.[0]?.fileUrl ||
                "https://via.placeholder.com/150",
            }}
            style={styles.productImage}
          />
        </View>

        {/* 정보 */}
        <View style={styles.productInfo}>
          {/* 가게이름과 거리 (Touchable) */}
          <View style={styles.storeNameRow}>
            <Text style={styles.storeName}>{item.storeNm}</Text>
            <Text style={styles.distanceText}>
              {formatDistance(distanceInMeters)}
            </Text>
          </View>

          {/* 상품명 */}
          <Text style={styles.productName}>{item.productNm}</Text>

          {/* 가격 정보 */}
          <Text style={styles.originalPriceText}>
            {item.price.toLocaleString()}원
          </Text>

          {/* 리뷰 평점 */}
          <View style={styles.reviewSection}>
            <Ionicons name="star" size={14} color="#FFB800" />
            <Text style={styles.ratingText}>{item.reviewAvg.toFixed(1)}</Text>
            <Text style={styles.reviewCountText}>({item.reviewCount})</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const formatCountdown = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

export default function NegoListScreen() {
  const insets = useSafeAreaInsets();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const [sortBy, setSortBy] = useState<SortType>("distance");
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: number }>({});
  const [negoProducts, setNegoProducts] = useState<NegoProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const flatListRef = useRef<import("react-native").FlatList>(null);

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const buildTimeLeftMap = (products: NegoProduct[]) => {
    const nextTimeLeft: { [key: string]: number } = {};
    const nowTime = new Date().getTime();

    products.forEach((product) => {
      const endTime = new Date(product.endDateTime).getTime();
      nextTimeLeft[product.productCode] = Math.max(
        0,
        Math.floor((endTime - nowTime) / 1000),
      );
    });

    return nextTimeLeft;
  };

  const fetchNegoProducts = async (
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
        from === "search" ? `/guest/search/nego-list` : `/guest/negoproducts`;
      const response = await apiGet(`${apiBaseUrl}?page=${pageNum}&size=10`);

      if (!response.ok) {
        throw new Error("Failed to fetch nego products");
      }

      const data: NegoProductPageResponse = await response.json();
      const content: NegoProduct[] = data?.content || [];
      const mergedProducts =
        pageNum === 0
          ? content
          : [
              ...negoProducts,
              ...content.filter(
                (newItem) =>
                  !negoProducts.some(
                    (prev) => prev.productCode === newItem.productCode,
                  ),
              ),
            ];

      setNegoProducts(mergedProducts);
      setTimeLeft(buildTimeLeftMap(mergedProducts));
      setPage(data?.number ?? pageNum);
      setHasMore(!data?.last);
    } catch (error) {
      console.error("협상 상품 목록 조회 실패:", error);
      if (pageNum === 0) {
        setNegoProducts([]);
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
    fetchNegoProducts(0);
  }, [from]);

  // 카운트다운 타이머
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const updated: { [key: string]: number } = {};
        negoProducts.forEach((product) => {
          updated[product.productCode] = Math.max(
            0,
            (prev[product.productCode] || 0) - 1,
          );
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [negoProducts]);

  const handleRefresh = () => {
    setHasMore(true);
    setPage(0);
    fetchNegoProducts(0, true);
  };

  const handleLoadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      fetchNegoProducts(page + 1);
    }
  };

  const getSortedProducts = () => {
    const sorted = [...negoProducts].map((product) => ({
      ...product,
      distance: product.distanceM / 1000, // 백엔드 distanceM(미터) → km 환산
    }));

    switch (sortBy) {
      case "distance":
        return sorted.sort((a, b) => a.distance - b.distance);
      case "price":
        return sorted.sort((a, b) => a.price - b.price);
      case "rating":
        return sorted.sort((a, b) => b.reviewAvg - a.reviewAvg);
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
          <Text style={styles.title}>네고 상품</Text>
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
          <Text style={styles.loadingText}>네고 상품을 불러오는 중...</Text>
        </View>
      ) : negoProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="pricetags-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>등록된 네고 상품이 없습니다</Text>
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
            const distanceInMeters = item.distanceM;

            return (
              <NegoProductCard
                item={item}
                productCode={item.productCode}
                timeLeft={timeLeft[item.productCode] || 0}
                distanceInMeters={distanceInMeters}
              />
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
