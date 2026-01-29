import { apiGet } from "@/utils/api";
import { calculateDistance } from "@/utils/distance";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
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

// 내 위치 하드코딩 (서울 강남역 좌표 예시)
// 나중에는 내 위치 정보를 수정할 때마다 local storage에 저장된 값을 불러오도록 변경 필요
const MY_LOCATION = {
  latitude: 37.498095,
  longitude: 127.02761,
};

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
  reviewCount: number;
  reviewAvg: number;
}

interface SaleProduct {
  id: string;
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

const formatDistance = (distanceKm: number): string => {
  if (distanceKm >= 1) {
    return `${distanceKm.toFixed(1)}km`;
  }
  return `${Math.round(distanceKm * 1000)}m`;
};

const formatCountdown = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

export default function SaleProductListScreen() {
  const insets = useSafeAreaInsets();
  const [sortBy, setSortBy] = useState<SortType>("distance");
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: number }>({});
  const [saleProducts, setSaleProducts] = useState<SaleProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchSaleProducts();
  }, []);

  const fetchSaleProducts = async () => {
    try {
      setLoading(true);
      const custCode = "CUST_001";
      const response = await apiGet(`/cust/sales?custCode=${custCode}`);

      if (!response.ok) {
        throw new Error("Failed to fetch sale products");
      }

      const data: CustSaleListResponse[] = await response.json();

      const products: SaleProduct[] = data.map((item, index) => {
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

        // 거리 계산 (미터 단위)
        const distanceInMeters = calculateDistance(
          MY_LOCATION.latitude,
          MY_LOCATION.longitude,
          item.latitude, // 위도
          item.longitude, // 경도
        );
        const distanceInKm = distanceInMeters / 1000;

        // 첫 번째 이미지 URL 가져오기 (order 기준 정렬)
        const firstImage =
          item.images?.files?.length > 0
            ? item.images.files.sort((a, b) => a.order - b.order)[0]
            : null;

        return {
          id: index.toString(),
          uri: firstImage?.fileUrl
            ? { uri: firstImage.fileUrl }
            : require("@/assets/images/logo.png"), // 기본 이미지
          productName: item.productNm,
          storeName: item.storeNm,
          discount: discount,
          price: item.discountPrice,
          originalPrice: item.originalPrice,
          distance: distanceInKm,
          rating: item.reviewAvg,
          reviewCount: item.reviewCount,
          category: "",
          timeLimitSeconds: timeLimitSeconds,
          saleType: item.saleType,
        };
      });

      setSaleProducts(products);
    } catch (error) {
      console.error("할인 상품 목록 조회 실패:", error);
      setSaleProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // 초기 timeLeft 설정 및 카운트다운
  useEffect(() => {
    if (saleProducts.length === 0) return;

    // 초기값 설정
    const initialTimeLeft: { [key: string]: number } = {};
    saleProducts.forEach((product) => {
      initialTimeLeft[product.id] = product.timeLimitSeconds;
    });
    setTimeLeft(initialTimeLeft);

    // 1초마다 업데이트
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const updated: { [key: string]: number } = {};
        saleProducts.forEach((product) => {
          updated[product.id] = Math.max(
            0,
            (prev[product.id] || product.timeLimitSeconds) - 1,
          );
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>할인 상품</Text>
        <View style={styles.placeholder} />
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
          data={getSortedProducts()}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productItemContainer}
              onPress={() => router.push("/(cust)/product-detail")}
              activeOpacity={0.7}
            >
              {/* 시간 제한 배너 */}
              {item.timeLimitSeconds &&
                timeLeft[item.id] !== undefined &&
                timeLeft[item.id] > 0 && (
                  <View style={styles.timeLimitBanner}>
                    <Ionicons name="time" size={16} color="rgb(239, 120, 16)" />
                    <Text style={styles.timeLimitBannerText}>
                      남은 시간: {formatCountdown(timeLeft[item.id])}
                    </Text>
                  </View>
                )}

              {/* 이미지와 정보 */}
              <View style={styles.productContentRow}>
                {/* 이미지 */}
                <View style={styles.productImageWrapper}>
                  <Image
                    resizeMode="stretch"
                    source={item.uri}
                    style={styles.productImage}
                  />
                  {/* 할인 배지 */}
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountBadgeText}>
                      {item.saleType === "할인률"
                        ? `${item.discount}%`
                        : "정가할인"}
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
          )}
        ></FlatList>
      )}

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
