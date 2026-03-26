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

type ProductTabType = "normal" | "sale" | "nego";

const PRODUCT_TYPE_MAP: Record<ProductTabType, string> = {
  normal: "NORMAL",
  sale: "SALE",
  nego: "NEGO",
};

const PRODUCT_TAB_LABELS: Record<ProductTabType, string> = {
  normal: "일반",
  sale: "할인",
  nego: "네고",
};

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

  const [productsByTab, setProductsByTab] = useState<
    Record<ProductTabType, Product[]>
  >({
    normal: [],
    sale: [],
    nego: [],
  });
  const [productPageByTab, setProductPageByTab] = useState<
    Record<ProductTabType, number>
  >({
    normal: 0,
    sale: 0,
    nego: 0,
  });
  const [hasMoreByTab, setHasMoreByTab] = useState<
    Record<ProductTabType, boolean>
  >({
    normal: false,
    sale: false,
    nego: false,
  });
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadedTabs, setLoadedTabs] = useState<Set<ProductTabType>>(
    new Set<ProductTabType>(["normal"]),
  );

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewPage, setReviewPage] = useState(0);
  const [hasMoreReviews, setHasMoreReviews] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const [activeProductTab, setActiveProductTab] =
    useState<ProductTabType>("normal");
  const [productTotals, setProductTotals] = useState<
    Record<ProductTabType, number>
  >({
    normal: 0,
    sale: 0,
    nego: 0,
  });

  const fetchStoreInfo = useCallback(async () => {
    if (!storeCode) {
      setError("매장 정보를 찾을 수 없습니다.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiGet(
        `/cust/storeinfo?storeCode=${storeCode}&productType=NORMAL`,
      );
      if (!response.ok) throw new Error("매장 정보를 불러오는데 실패했습니다.");

      const data: StoreInfoResponse = await response.json();
      setStoreInfo(data);
      setIsWishStore(data.isWishStore);
      setProductsByTab((prev) => ({
        ...prev,
        normal: Array.isArray(data.products) ? data.products : [],
      }));
      setHasMoreByTab((prev) => ({
        ...prev,
        normal: data.hasMoreProducts || false,
      }));
      setProductPageByTab((prev) => ({ ...prev, normal: 0 }));
      setProductTotals({
        normal: data.totalProductCount ?? 0,
        sale: data.totalSaleProductCount ?? 0,
        nego: data.totalNegoProductCount ?? 0,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.",
      );
    } finally {
      setLoading(false);
    }
  }, [storeCode]);

  const fetchMoreProducts = useCallback(async () => {
    if (!storeCode || loadingProducts || !hasMoreByTab[activeProductTab])
      return;

    try {
      setLoadingProducts(true);
      const nextPage = productPageByTab[activeProductTab] + 1;
      const response = await apiGet(
        `/cust/storeinfo/products?storeCode=${storeCode}&productType=${PRODUCT_TYPE_MAP[activeProductTab]}&page=${nextPage}`,
      );
      if (!response.ok) throw new Error("상품 목록을 불러오는데 실패했습니다.");

      const data: ProductsPageResponse = await response.json();
      const newProducts = Array.isArray(data.content) ? data.content : [];
      setProductsByTab((prev) => ({
        ...prev,
        [activeProductTab]: [...prev[activeProductTab], ...newProducts],
      }));
      setHasMoreByTab((prev) => ({ ...prev, [activeProductTab]: !data.last }));
      setProductPageByTab((prev) => ({
        ...prev,
        [activeProductTab]: nextPage,
      }));
    } finally {
      setLoadingProducts(false);
    }
  }, [
    storeCode,
    productPageByTab,
    hasMoreByTab,
    loadingProducts,
    activeProductTab,
  ]);

  const fetchReviews = useCallback(async () => {
    if (!storeCode || loadingReviews) return;

    try {
      setLoadingReviews(true);
      const response = await apiGet(
        `/cust/storeinfo/reviews?storeCode=${storeCode}&page=0`,
      );
      if (!response.ok) throw new Error("리뷰 목록을 불러오는데 실패했습니다.");

      const data: ReviewsPageResponse = await response.json();
      console.log(
        "[storeInfo] reviews:",
        JSON.stringify(data.content, null, 2),
      );
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

  const handleProductTabChange = useCallback(
    async (tab: ProductTabType) => {
      if (tab === activeProductTab) return;
      setActiveProductTab(tab);
      productListRef.current?.scrollToOffset({ offset: 0, animated: false });

      if (loadedTabs.has(tab)) return;
      if (!storeCode) return;
      try {
        setLoadingProducts(true);
        const response = await apiGet(
          `/cust/storeinfo/products?storeCode=${storeCode}&productType=${PRODUCT_TYPE_MAP[tab]}&page=0`,
        );
        if (!response.ok)
          throw new Error("상품 목록을 불러오는데 실패했습니다.");
        const data: ProductsPageResponse = await response.json();
        setProductsByTab((prev) => ({
          ...prev,
          [tab]: Array.isArray(data.content) ? data.content : [],
        }));
        setHasMoreByTab((prev) => ({ ...prev, [tab]: !data.last }));
        setProductPageByTab((prev) => ({ ...prev, [tab]: 0 }));
        setLoadedTabs((prev) => new Set([...prev, tab]));
      } catch (err) {
        console.error("상품 목록 로드 실패:", err);
      } finally {
        setLoadingProducts(false);
      }
    },
    [activeProductTab, storeCode, loadedTabs],
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
          <Text style={styles.title}>가맹점 정보</Text>
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
              data={productsByTab[activeProductTab]}
              numColumns={2}
              keyExtractor={(item) => item.productCode}
              columnWrapperStyle={styles.productGridContainer}
              contentContainerStyle={styles.storeProductContainer}
              onEndReached={fetchMoreProducts}
              onEndReachedThreshold={0.5}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <View>
                  <StoreHeader
                    storeInfo={storeInfo}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    onWishClick={handleWishClick}
                    isWishStore={isWishStore}
                    storeCode={String(storeCode)}
                  />
                  <View style={styles.productSubTabContainer}>
                    {(["normal", "sale", "nego"] as ProductTabType[]).map(
                      (tab) => (
                        <TouchableOpacity
                          key={tab}
                          style={[
                            styles.productSubTab,
                            activeProductTab === tab &&
                              styles.productSubTabActive,
                          ]}
                          onPress={() => handleProductTabChange(tab)}
                        >
                          <Text
                            style={[
                              styles.productSubTabText,
                              activeProductTab === tab &&
                                styles.productSubTabTextActive,
                            ]}
                          >
                            {PRODUCT_TAB_LABELS[tab]}({productTotals[tab]})
                          </Text>
                        </TouchableOpacity>
                      ),
                    )}
                  </View>
                </View>
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
