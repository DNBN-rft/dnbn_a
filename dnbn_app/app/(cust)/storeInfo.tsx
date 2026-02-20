import { apiGet, apiPost } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProductCard } from "./components/ProductCard";
import { ReviewCard } from "./components/ReviewCard";
import { StoreHeader } from "./components/StoreHeader";
import { styles } from "./storeInfo.styles";
import type {
  Product,
  ProductsPageResponse,
  Review,
  ReviewsPageResponse,
  StoreInfoResponse,
} from "./types/storeInfo.types";

export default function StoreInfo() {
  const [activeTab, setActiveTab] = useState<"product" | "review">("product");
  const insets = useSafeAreaInsets();
  const { storeCode } = useLocalSearchParams();

  const productListRef = useRef<FlatList>(null);
  const reviewListRef = useRef<FlatList>(null);

  const [storeInfo, setStoreInfo] = useState<StoreInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWishStore, setIsWishStore] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [productPage, setProductPage] = useState(0);
  const [hasMoreProducts, setHasMoreProducts] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewPage, setReviewPage] = useState(0);
  const [hasMoreReviews, setHasMoreReviews] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const fetchStoreInfo = useCallback(async () => {
    if (!storeCode) {
      setError("매장 정보를 찾을 수 없습니다.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiGet(`/cust/storeinfo?storeCode=${storeCode}`);
      if (!response.ok) throw new Error("매장 정보를 불러오는데 실패했습니다.");

      const data: StoreInfoResponse = await response.json();
      setStoreInfo(data);
      setIsWishStore(data.isWishStore);
      setProducts(Array.isArray(data.products) ? data.products : []);
      setHasMoreProducts(data.hasMoreProducts || false);
      setProductPage(0);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.",
      );
    } finally {
      setLoading(false);
    }
  }, [storeCode]);

  const fetchMoreProducts = useCallback(async () => {
    if (!storeCode || loadingProducts || !hasMoreProducts) return;

    try {
      setLoadingProducts(true);
      const nextPage = productPage + 1;
      const response = await apiGet(
        `/cust/storeinfo/products?storeCode=${storeCode}&page=${nextPage}`,
      );
      if (!response.ok) throw new Error("상품 목록을 불러오는데 실패했습니다.");

      const data: ProductsPageResponse = await response.json();
      const newProducts = Array.isArray(data.content) ? data.content : [];
      setProducts((prev) => [...prev, ...newProducts]);
      setHasMoreProducts(!data.last);
      setProductPage(nextPage);
    } finally {
      setLoadingProducts(false);
    }
  }, [storeCode, productPage, hasMoreProducts, loadingProducts]);

  const fetchReviews = useCallback(async () => {
    if (!storeCode || loadingReviews) return;

    try {
      setLoadingReviews(true);
      const response = await apiGet(
        `/cust/storeinfo/reviews?storeCode=${storeCode}&page=0`,
      );
      if (!response.ok) throw new Error("리뷰 목록을 불러오는데 실패했습니다.");

      const data: ReviewsPageResponse = await response.json();
      setReviews(Array.isArray(data.content) ? data.content : []);
      setHasMoreReviews(!data.last);
      setReviewPage(0);
    } finally {
      setLoadingReviews(false);
    }
  }, [storeCode, loadingReviews]);

  const fetchMoreReviews = useCallback(async () => {
    if (!storeCode || loadingReviews || !hasMoreReviews) return;

    try {
      setLoadingReviews(true);
      const nextPage = reviewPage + 1;
      const response = await apiGet(
        `/cust/storeinfo/reviews?storeCode=${storeCode}&page=${nextPage}`,
      );
      if (!response.ok) throw new Error("리뷰 목록을 불러오는데 실패했습니다.");

      const data: ReviewsPageResponse = await response.json();
      setReviews((prev) => [
        ...prev,
        ...(Array.isArray(data.content) ? data.content : []),
      ]);
      setHasMoreReviews(!data.last);
      setReviewPage(nextPage);
    } finally {
      setLoadingReviews(false);
    }
  }, [storeCode, reviewPage, hasMoreReviews, loadingReviews]);

  const handleTabChange = useCallback(
    (tab: "product" | "review") => {
      setActiveTab(tab);
      if (tab === "review" && reviews.length === 0) {
        fetchReviews();
      }
    },
    [reviews.length, fetchReviews],
  );

  const handleWishClick = async () => {
    const newWishState = !isWishStore;
    setIsWishStore(newWishState);

    if (!storeCode) return;

    try {
      await apiPost(`/cust/wish`, {
        storeCodes: [storeCode],
      });
    } catch (err) {
      console.error("치하기 API 실패:", err);
      // API 실패 시 상태 되돌리기
      setIsWishStore(!newWishState);
    }
  };

  const scrollToTop = () => {
    const ref = activeTab === "product" ? productListRef : reviewListRef;
    ref.current?.scrollToOffset({ offset: 0, animated: true });
  };

  useEffect(() => {
    fetchStoreInfo();
  }, [fetchStoreInfo]);

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
          <Text style={styles.title}>
            {loading ? "로딩중..." : storeInfo?.storeNm || "가맹점 정보"}
          </Text>
        </View>
        <View style={styles.rightSection} />
      </View>

      {loading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>로딩 중...</Text>
        </View>
      )}

      {!loading && error && (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#999" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchStoreInfo}>
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && storeInfo && (
        <>
          {activeTab === "product" && (
            <FlatList
              ref={productListRef}
              data={products}
              numColumns={2}
              keyExtractor={(item) => item.productCode}
              columnWrapperStyle={styles.productGridContainer}
              contentContainerStyle={styles.storeProductContainer}
              onEndReached={fetchMoreProducts}
              onEndReachedThreshold={0.5}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <StoreHeader
                  storeInfo={storeInfo}
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                  onWishClick={handleWishClick}
                  isWishStore={isWishStore}
                  storeCode={String(storeCode)}
                />
              }
              ListFooterComponent={
                loadingProducts ? (
                  <View style={styles.loadingFooter}>
                    <ActivityIndicator size="small" color="#FF6B6B" />
                  </View>
                ) : null
              }
              renderItem={({ item }) => (
                <ProductCard item={item} productCode={item.productCode} />
              )}
            />
          )}

          {activeTab === "review" && (
            <FlatList
              ref={reviewListRef}
              data={reviews}
              keyExtractor={(item, index) =>
                `${item.reviewProductCode}-${index}`
              }
              contentContainerStyle={styles.storeReviewContainer}
              onEndReached={fetchMoreReviews}
              onEndReachedThreshold={0.5}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <StoreHeader
                  storeInfo={storeInfo}
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                  onWishClick={handleWishClick}
                  isWishStore={isWishStore}
                  storeCode={String(storeCode)}
                />
              }
              ListEmptyComponent={
                !loadingReviews ? (
                  <View style={styles.centerContainer}>
                    <Ionicons name="chatbox-outline" size={48} color="#999" />
                    <Text style={styles.emptyText}>작성된 리뷰가 없습니다</Text>
                  </View>
                ) : null
              }
              ListFooterComponent={
                loadingReviews ? (
                  <View style={styles.loadingFooter}>
                    <ActivityIndicator size="small" color="#FF6B6B" />
                  </View>
                ) : null
              }
              renderItem={({ item }) => (
                <ReviewCard item={item} productCode={item.reviewProductCode} />
              )}
            />
          )}

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
