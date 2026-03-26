import Ionicons from "@expo/vector-icons/build/Ionicons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { formatDateTime } from "../../utils/dateUtil";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { apiGet } from "../../utils/api";
import { styles } from "./search-result.styles";

interface SearchProduct {
  productCode: string;
  productImageUrl: string;
  storeNm: string;
  productNm: string;
  price: string;
  originalPrice: string;
  averageRate: number;
  reviewCount: number;
  isNego: boolean;
  isSale: boolean;
  startDateTime: string | null;
  endDateTime: string | null;
}

interface SearchResponse {
  content: any[];
  number: number;
  totalElements: number;
}

export default function SearchView() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [searchKeyword, setSearchKeyword] = useState(
    (params.keyword as string) || "",
  );
  const flatListRef = useRef<import("react-native").FlatList>(null);
  const prevKeywordRef = useRef<string>("");
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [saleCount, setSaleCount] = useState(0);
  const [negoCount, setNegoCount] = useState(0);
  const [normalCount, setNormalCount] = useState(0);
  const [sortType, setSortType] = useState("LATEST");
  const [productType, setProductType] = useState("SALE");

  const filterOptions = [
    "LATEST",
    "MOST_REVIEWED",
    "HIGHEST_RATING",
    "LOWEST_PRICE",
    "HIGHEST_PRICE",
  ];

  // 정렬 타입에 따른 표시 텍스트
  const getSortLabel = (sortType: string) => {
    const labels: Record<string, string> = {
      LATEST: "최신순",
      MOST_REVIEWED: "리뷰 많은 순",
      HIGHEST_RATING: "별점 높은 순",
      LOWEST_PRICE: "낮은 가격 순",
      HIGHEST_PRICE: "높은 가격 순",
    };
    return labels[sortType] || "최신순";
  };

  // 상품 목록 조회
  const fetchProducts = async (
    keyword: string,
    sort: string = sortType,
    pg: number = page,
    type: string = productType,
  ) => {
    if (!keyword.trim()) return;

    setLoading(true);
    try {
      const response = await apiGet(
        `/guest/search/products?keyword=${encodeURIComponent(keyword)}&productSortType=${sort}&page=${pg}&size=15&productType=${type}`,
      );

      if (!response.ok) {
        throw new Error("상품 검색 실패: " + response.status);
      }

      const data: SearchResponse = await response.json();
      const mapped: SearchProduct[] = (data.content || []).map((item: any) => ({
        productCode: item.productCode,
        productImageUrl: item.productImageUrl || "",
        storeNm: item.storeNm,
        productNm: item.productNm,
        price: item.price,
        originalPrice: item.originalPrice,
        averageRate: item.averageRate,
        reviewCount: item.reviewCount,
        isNego: item.isNego,
        isSale: item.isSale,
        startDateTime: item.startDateTime ?? null,
        endDateTime: item.endDateTime ?? null,
      }));
      const firstItem = data.content?.[0];
      setProducts(mapped);
      setTotalElements(data.totalElements ?? 0);
      setPage(data.number ?? pg);
      setSaleCount(firstItem?.saleCount ?? 0);
      setNegoCount(firstItem?.negoCount ?? 0);
      setNormalCount(firstItem?.normalCount ?? 0);
    } catch (error) {
      console.error("상품 검색 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  // 페이지가 focus될 때마다 params.keyword로 검색 실행
  useFocusEffect(
    useCallback(() => {
      const keyword = params.keyword as string;
      if (keyword && keyword !== prevKeywordRef.current) {
        prevKeywordRef.current = keyword;
        setSearchKeyword(keyword);
        setSortType("LATEST");
        setProductType("SALE");
        setPage(0);
        // params.keyword로 검색 실행 (초기값으로 명시적 전달)
        fetchProducts(keyword, "LATEST", 0, "SALE");
      }
    }, [params.keyword]),
  );

  // 검색 버튼 클릭 (search-result 페이지 내에서)
  const handleSearch = () => {
    if (!searchKeyword.trim()) return;

    // 정렬 및 페이지 초기화 후 검색
    setSortType("LATEST");
    setProductType("SALE");
    setPage(0);
    // 초기값으로 명시적 전달
    fetchProducts(searchKeyword, "LATEST", 0, "SALE");
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  //필터 선택
  const handleFilterSelect = (value: string) => {
    setSortType(value);
    setPage(0);
    // 필터 변경 시 현재 검색어로 재검색
    fetchProducts(searchKeyword, value, 0, productType);
    closeFilterModal();
  };

  const handleProductTypeSelect = (type: string) => {
    setProductType(type);
    setPage(0);
    fetchProducts(searchKeyword, sortType, 0, type);
  };

  const openFilterModal = () => {
    setIsOverlayVisible(true);
    setTimeout(() => {
      setIsFilterModalVisible(true);
    }, 20);
  };

  const closeFilterModal = () => {
    setIsFilterModalVisible(false);
    setTimeout(() => {
      setIsOverlayVisible(false);
    }, 300);
  };

  return (
    <View style={styles.searchResultView}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#fff" }} />
      )}

      <View style={styles.container}>
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
            <Text style={styles.title}>검색 결과</Text>
          </View>
          <View style={styles.rightSection} />
        </View>

        {/* 검색 영역 */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBarContainer}>
            <TextInput
              placeholder={"어떤 가게나 상품을 검색하고 싶으세요?"}
              placeholderTextColor="#999"
              style={styles.searchBar}
              value={searchKeyword}
              onChangeText={setSearchKeyword}
            />
            <Pressable style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>검색</Text>
            </Pressable>
          </View>
        </View>
        {/* 필터 헤더 */}
        <View style={styles.filterHeader}>
          <Text style={styles.resultCountText}>총 {totalElements}개 상품</Text>
          <View style={styles.filterRightSection}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={openFilterModal}
            >
              <Ionicons name="filter-outline" size={18} color="#666" />
              <Text style={styles.filterText}>{getSortLabel(sortType)}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.productResultContainer}>
          <View style={styles.productTypeTabs}>
            {[
              { key: "SALE", label: "할인", count: saleCount },
              { key: "NEGO", label: "네고", count: negoCount },
              { key: "NORMAL", label: "일반", count: normalCount },
            ].map(({ key, label, count }) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.productTypeTab,
                  productType === key && styles.productTypeTabActive,
                ]}
                onPress={() => handleProductTypeSelect(key)}
              >
                <Text
                  style={[
                    styles.productTypeTabText,
                    productType === key && styles.productTypeTabTextActive,
                  ]}
                >
                  {label} ({count})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#EF7810" />
            </View>
          ) : products.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={products}
              keyExtractor={(item) => item.productCode}
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.listContent}
              renderItem={({ item: product }) => (
                <TouchableOpacity
                  onPress={() => {
                    const now = new Date();
                    const isUpcoming = product.startDateTime && new Date(product.startDateTime) > now;
                    if (product.isSale && !isUpcoming) {
                      router.push({ pathname: "/(guest)/sale-product-detail", params: { productCode: product.productCode } });
                    } else if (product.isNego && !isUpcoming) {
                      router.push({ pathname: "/(guest)/nego-product-detail", params: { productCode: product.productCode } });
                    } else {
                      router.push({ pathname: "/(guest)/product-detail", params: { productCode: product.productCode } });
                    }
                  }}
                  style={styles.gridItem}
                >
                  <View style={styles.imageContainer}>
                    {product.productImageUrl ? (
                      <Image
                        resizeMode="cover"
                        source={{ uri: product.productImageUrl }}
                        style={styles.gridImage}
                      />
                    ) : (
                      <View
                        style={[
                          styles.gridImage,
                          {
                            backgroundColor: "#f0f0f0",
                            justifyContent: "center",
                            alignItems: "center",
                          },
                        ]}
                      >
                        <Ionicons name="image-outline" size={40} color="#ccc" />
                      </View>
                    )}
                
                  </View>
                  <View style={styles.gridInfo}>
                    <Text style={styles.gridStoreName} numberOfLines={1}>
                      {product.storeNm}
                    </Text>
                    <Text style={styles.gridProductName} numberOfLines={1}>
                      {product.productNm}
                    </Text>
                    {product.isSale &&
                      product.originalPrice &&
                      product.originalPrice !== product.price && (
                        <Text style={styles.gridOriginalPrice}>
                          {Number(product.originalPrice).toLocaleString()}원
                        </Text>
                      )}
                    <Text style={styles.gridPrice}>
                      {Number(product.price).toLocaleString()}원
                    </Text>
                    {product.startDateTime &&
                      new Date(product.startDateTime) > new Date() && (
                        <View style={styles.timeInfoContainer}>
                          <Text style={styles.timeStatusLabelUpcoming}>
                            {product.isSale ? "할인" : "네고"} 예정
                          </Text>
                          <Text style={styles.timeText}>
                            {`${formatDateTime(product.startDateTime)}${product.endDateTime ? ` ~ ${formatDateTime(product.endDateTime)}` : ""}`}
                          </Text>
                        </View>
                      )}
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={14} color="#FFB800" />
                      <Text style={styles.ratingText}>
                        {product.averageRate.toFixed(1)}
                      </Text>
                      <Text style={styles.reviewCountText}>
                        ({product.reviewCount})
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              scrollEnabled={true}
            />
          )}
        </View>
        {/* 최상단 스크롤 버튼 */}
        <TouchableOpacity
          style={[styles.scrollToTopButton, { bottom: 30 + insets.bottom }]}
          onPress={scrollToTop}
        >
          <Ionicons name="chevron-up" size={24} color="#EF7810" />
        </TouchableOpacity>

        {/* 필터 모달 */}
        {isOverlayVisible && (
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={closeFilterModal}
          />
        )}
        <Modal
          visible={isFilterModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={closeFilterModal}
        >
          <View style={styles.modalContentWrapper}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.modalContent}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>정렬 기준 선택</Text>
                <TouchableOpacity onPress={closeFilterModal}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <View style={styles.filterOptionsContainer}>
                {filterOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.filterOption,
                      sortType === option && styles.filterOptionSelected,
                    ]}
                    onPress={() => handleFilterSelect(option)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        sortType === option && styles.filterOptionTextSelected,
                      ]}
                    >
                      {getSortLabel(option)}
                    </Text>
                    {sortType === option && (
                      <Ionicons name="checkmark" size={20} color="#EF7810" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
