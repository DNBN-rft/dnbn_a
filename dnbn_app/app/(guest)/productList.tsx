import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { apiGet } from "../../utils/api";
import { styles } from "./productlist.styles";

type FilterType = "distance" | "price" | "rating" | null;

// API 응답 타입 정의
interface ProductImage {
  originalName: string;
  fileUrl: string;
  order: number;
}

interface Product {
  storeNm: string;
  productCode: string;
  productNm: string;
  price: number;
  rate: number;
  reviewCnt: number;
  productImg: ProductImage | null;
}

interface ProductPageResponse {
  content: Product[];
  last: boolean;
  number: number;
}

export default function ProductListScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const flatListRef = useRef<FlatList<Product>>(null);

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const fetchProductList = async (
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

      const response = await apiGet(`/guest/regular?page=${pageNum}&size=20`);

      if (response.ok) {
        const data: ProductPageResponse = await response.json();
        const content = data?.content || [];

        setProductList((prev) =>
          pageNum === 0
            ? content
            : [
                ...prev,
                ...content.filter(
                  (nextItem) =>
                    !prev.some(
                      (prevItem) =>
                        prevItem.productCode === nextItem.productCode,
                    ),
                ),
              ],
        );

        setPage(data?.number ?? pageNum);
        setHasMore(!data?.last);
      } else {
        console.error("API 요청 실패:", response.status, response.statusText);
        if (pageNum === 0) {
          setProductList([]);
        }
      }
    } catch (error) {
      console.error("일반상품 목록 불러오기 실패:", error);
      if (pageNum === 0) {
        setProductList([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchProductList(0);
  }, []);

  const handleRefresh = () => {
    setHasMore(true);
    setPage(0);
    fetchProductList(0, true);
  };

  const handleLoadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      fetchProductList(page + 1);
    }
  };

  const sortedProducts = [...productList];
  if (activeFilter === "price") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (activeFilter === "rating") {
    sortedProducts.sort((a, b) => b.rate - a.rate);
  }

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
          <Text style={styles.title}>일반 상품</Text>
        </View>
        <View style={styles.rightSection} />
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === "distance" && styles.filterButtonActive,
          ]}
          onPress={() => setActiveFilter("distance")}
        >
          <Text
            style={[
              styles.filterButtonText,
              activeFilter === "distance" && styles.filterButtonTextActive,
            ]}
          >
            거리순
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === "price" && styles.filterButtonActive,
          ]}
          onPress={() => setActiveFilter("price")}
        >
          <Text
            style={[
              styles.filterButtonText,
              activeFilter === "price" && styles.filterButtonTextActive,
            ]}
          >
            가격순
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === "rating" && styles.filterButtonActive,
          ]}
          onPress={() => setActiveFilter("rating")}
        >
          <Text
            style={[
              styles.filterButtonText,
              activeFilter === "rating" && styles.filterButtonTextActive,
            ]}
          >
            평점순
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => setActiveFilter(null)}
        >
          <Ionicons name="refresh-outline" size={18} color="#666" />
          <Text style={styles.resetButtonText}>초기화</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#EF7810" />
          <Text style={styles.loadingText}>일반 상품을 불러오는 중...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={sortedProducts}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.productCode}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.listFooterLoading}>
                <ActivityIndicator size="small" color="#EF7810" />
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <View style={styles.listItemWrapper}>
              <TouchableOpacity
                style={styles.productItemContainer}
                onPress={() =>
                  router.push({
                    pathname: "/(guest)/product-detail",
                    params: { productCode: item.productCode },
                  })
                }
              >
                {item.productImg?.fileUrl ? (
                  <Image
                    resizeMode="stretch"
                    source={{ uri: item.productImg.fileUrl }}
                    style={styles.productImage}
                  />
                ) : (
                  <View style={[styles.productImage, styles.noImageBox]}>
                    <Ionicons name="image-outline" size={40} color="#ccc" />
                  </View>
                )}
                <View style={styles.productInfo}>
                  <Text
                    style={styles.storeName}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.storeNm}
                  </Text>
                  <Text
                    style={styles.productName}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.productNm}
                  </Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>
                      {item.price.toLocaleString()}원
                    </Text>
                  </View>
                  <Text style={styles.reviewText}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    {item.rate.toFixed(1)}({item.reviewCnt})
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
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
