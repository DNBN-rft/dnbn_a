import { apiDelete, apiGet } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { styles } from "../styles/wishlist.styles";

const formatAddress = (fullAddress: string): string => {
  if (!fullAddress) return "";

  const parts = fullAddress.trim().split(" ");

  if (parts[0]?.includes("특별시") || parts[0]?.includes("광역시")) {
    return parts.slice(0, 2).join(" "); // 예: "서울특별시 강남구"
  }

  if (parts[0]?.includes("도")) {
    return parts.slice(0, 3).join(" "); // 예: "경기도 성남시 분당구"
  }

  return parts.slice(0, 2).join(" ");
};

interface StoreImageFile {
  originalName: string;
  fileUrl: string;
  order: number;
}

interface StoreImage {
  files: StoreImageFile[];
}

interface WishStoreResponse {
  storeCode: string;
  storeNm: string;
  bizType: string;
  storeAddress: string;
  storeImage: StoreImage;
  productCount: number;
  averageRating: number;
  reviewCount: number;
}

interface StoreItem {
  id: string;
  storeCode: string;
  storeName: string;
  businessType: string;
  address: string;
  imageUrl: string | null;
  totalProducts: number;
  rating: number;
  reviewCount: number;
  isWished: boolean;
}

export default function WishlistScreen() {
  const insets = useSafeAreaInsets();

  const unwishSet = useRef<Set<string>>(new Set());

  const [storeList, setStoreList] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiGet(`/cust/wish`);

      if (!response.ok) {
        throw new Error("위시리스트를 불러오는데 실패했습니다.");
      }

      const data: WishStoreResponse[] = await response.json();

      const transformedData: StoreItem[] = data.map((store, index) => {
        return {
          id: store.storeCode || `${index}`,
          storeCode: store.storeCode,
          storeName: store.storeNm,
          businessType: store.bizType,
          address: formatAddress(store.storeAddress),
          imageUrl: store.storeImage?.files?.[0]?.fileUrl || null,
          totalProducts: store.productCount,
          rating: store.averageRating,
          reviewCount: store.reviewCount,
          isWished: true,
        };
      });

      setStoreList(transformedData);
    } catch (err) {
      console.error("위시리스트 로딩 실패:", err);
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // 페이지를 떠날 때 찜 해제 API 호출, 돌아올 때 데이터 갱신
  useFocusEffect(
    useCallback(() => {
      // 페이지에 포커스가 올 때 데이터 다시 불러오기
      fetchWishlist();

      return () => {
        const storeCodesToRemove = Array.from(unwishSet.current);

        if (storeCodesToRemove.length === 0) {
          return;
        }

        (async () => {
          try {
            const response = await apiDelete(`/cust/wish`, {
              body: JSON.stringify({ storeCodes: storeCodesToRemove }),
            });

            if (response.ok) {
              unwishSet.current.clear(); // 성공 시 Set 초기화
            }
          } catch (error) {
            console.error("찜 해제 API 오류:", error);
          }
        })();
      };
    }, [fetchWishlist]),
  );

  // 찜 상태 토글 (UI만 즉시 업데이트, API는 페이지 벗어날 때)
  const handleWishToggle = useCallback((storeCode: string) => {
    if (!storeCode) {
      console.error("storeCode가 없습니다");
      return;
    }

    // 1. UI 즉시 업데이트
    setStoreList((prev) =>
      prev.map((store) =>
        store.storeCode === storeCode
          ? { ...store, isWished: !store.isWished }
          : store,
      ),
    );

    // 2. Set에 토글 처리 (있으면 제거, 없으면 추가)
    if (unwishSet.current.has(storeCode)) {
      // 이미 찜 해제 목록에 있으면 제거 (원상복구)
      unwishSet.current.delete(storeCode);
    } else {
      unwishSet.current.add(storeCode);
    }
  }, []);
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
          <Text style={styles.title}>관심 매장</Text>
        </View>
        <View style={styles.rightSection} />
      </View>

      <View style={styles.countContainer}>
        <Text style={styles.countText}>총 {storeList.length}개의 가맹점</Text>
      </View>

      {/* 로딩 상태 */}
      {loading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>로딩 중...</Text>
        </View>
      )}

      {/* 에러 상태 */}
      {!loading && error && (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#999" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchWishlist}>
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 빈 리스트 */}
      {!loading && !error && storeList.length === 0 && (
        <View style={styles.centerContainer}>
          <Ionicons name="heart-outline" size={48} color="#999" />
          <Text style={styles.emptyText}>관심 매장이 없습니다</Text>
        </View>
      )}

      {/* 가맹점 리스트 */}
      {!loading && !error && storeList.length > 0 && (
        <FlatList
          data={storeList}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.storeCode || item.id}
          contentContainerStyle={[
            styles.listContainer,
            { paddingBottom: Platform.OS === "ios" ? insets.bottom + 60 : 0 },
          ]}
          renderItem={({ item }) => (
            <View style={styles.storeItemContainer} key={item.storeCode}>
              <TouchableOpacity
                style={styles.storeContentContainer}
                onPress={() =>
                  router.push({
                    pathname: "/(cust)/storeInfo",
                    params: { storeCode: item.storeCode },
                  })
                }
                activeOpacity={0.7}
              >
                {item.imageUrl ? (
                  <Image
                    resizeMode="cover"
                    source={{ uri: item.imageUrl }}
                    style={styles.storeImage}
                  />
                ) : (
                  <View style={[styles.storeImage, styles.placeholderImage]}>
                    <Ionicons name="image-outline" size={40} color="#ccc" />
                  </View>
                )}

                <View style={styles.storeInfo}>
                  <View style={styles.nameAddressContainer}>
                    <Text style={styles.storeName} numberOfLines={1}>
                      {item.storeName}
                    </Text>
                    <Text style={styles.addressText} numberOfLines={1}>
                      {item.address}
                    </Text>
                  </View>

                  <Text style={styles.businessTypeText}>
                    {item.businessType}
                  </Text>

                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFB800" />
                    <Text style={styles.ratingText}>
                      {item.rating.toFixed(1)}
                    </Text>
                    <Text style={styles.reviewCountText}>
                      ({item.reviewCount})
                    </Text>
                  </View>

                  <View style={styles.productCountContainer}>
                    <Ionicons name="pricetag-outline" size={14} color="#666" />
                    <Text style={styles.productCountText}>
                      등록 상품 {item.totalProducts}개
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.heartButton}
                onPress={() => handleWishToggle(item.storeCode)}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={item.isWished ? "heart" : "heart-outline"}
                  size={24}
                  color={item.isWished ? "#FF6B6B" : "#ff6b6b"}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}
