import { apiGet } from "@/utils/api";
import { calculateDistance, formatDistance } from "@/utils/distance";
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
  reviewCount: number;
  reviewAvg: number;
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
        router.push(`/(cust)/nego-product-detail?productCode=${code}`)
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
  const [sortBy, setSortBy] = useState<SortType>("distance");
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: number }>({});
  const [negoProducts, setNegoProducts] = useState<NegoProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation] = useState({ latitude: 37.7749, longitude: 122.4194 }); // 기본값

  // 초기 timeLeft 설정 및 카운트다운
  useEffect(() => {
    const fetchNegoProducts = async () => {
      try {
        setLoading(true);
        const response = await apiGet(`/cust/negoproducts`);
        const data = await response.json();

        setNegoProducts(data);

        // 초기값 설정
        const initialTimeLeft: { [key: string]: number } = {};
        data.forEach((product: NegoProduct) => {
          const endTime = new Date(product.endDateTime).getTime();
          const nowTime = new Date().getTime();
          const remainingSeconds = Math.max(
            0,
            Math.floor((endTime - nowTime) / 1000),
          );
          initialTimeLeft[product.productCode] = remainingSeconds;
        });
        setTimeLeft(initialTimeLeft);
      } catch (error) {
        console.error("협상 상품 목록 조회 실패:", error);
        setNegoProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNegoProducts();
  }, []);

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

  const getSortedProducts = () => {
    const sorted = [...negoProducts].map((product) => ({
      ...product,
      distance:
        calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          product.latitude,
          product.longitude,
        ) / 1000, // 미터를 km로 변환
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
          data={getSortedProducts()}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.productCode}
          contentContainerStyle={{ paddingVertical: 8 }}
          renderItem={({ item }) => {
            const distanceInMeters =
              item.distance !== undefined
                ? item.distance * 1000 // km를 미터로 변환
                : calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    item.latitude,
                    item.longitude,
                  );

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

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
