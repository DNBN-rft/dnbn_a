import Ionicons from "@expo/vector-icons/build/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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
  storeName: string;
  productName: string;
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
  pageNumber: number;
  totalElements: number;
  saleCount: number;
  negoCount: number;
  normalCount: number;
}

export default function GuestCategorySearchView() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const categoryId = Number(params.categoryId);

  const [searchKeyword, setSearchKeyword] = useState(
    (params.keyword as string) || "",
  );
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
  const flatListRef = useRef<FlatList<SearchProduct>>(null);

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const filterOptions = [
    "LATEST",
    "MOST_REVIEWED",
    "HIGHEST_RATING",
    "LOWEST_PRICE",
    "HIGHEST_PRICE",
  ];

  const getSortLabel = (type: string) => {
    const labels: Record<string, string> = {
      LATEST: "최신순",
      MOST_REVIEWED: "리뷰 많은 순",
      HIGHEST_RATING: "별점 높은 순",
      LOWEST_PRICE: "낮은 가격 순",
      HIGHEST_PRICE: "높은 가격 순",
    };
    return labels[type] || "최신순";
  };

  // GET /guest/search/{categoryIdx}?keyword=&productSortType=&page=&size=&productType=
  const fetchProducts = async (
    searchTerm: string = "",
    currentPage: number = 0,
    sortValue: string = "LATEST",
    typeValue: string = productType,
  ) => {
    if (!categoryId || isNaN(categoryId)) {
      console.error("유효하지 않은 categoryId:", params.categoryId);
      return;
    }
    setLoading(true);
    try {
      const response = await apiGet(
        `/guest/search/${categoryId}?keyword=${encodeURIComponent(searchTerm)}&productSortType=${sortValue}&page=${currentPage}&size=15&productType=${typeValue}`,
      );

      if (response.ok) {
        const data: SearchResponse = await response.json();
        const mapped: SearchProduct[] = (data.content || []).map(
          (item: any) => ({
            productCode: item.productCode,
            productImageUrl: item.productImageUrl || "",
            storeName: item.storeNm,
            productName: item.productNm,
            price: item.price,
            originalPrice: item.originalPrice,
            averageRate: item.averageRate,
            reviewCount: item.reviewCount,
            isNego: item.isNego,
            isSale: item.isSale,
            startDateTime: item.startDateTime ?? null,
            endDateTime: item.endDateTime ?? null,
          }),
        );
        setProducts(mapped);
        setTotalElements(data.totalElements ?? 0);
        setPage(data.pageNumber ?? currentPage);
        setSaleCount(data.saleCount ?? 0);
        setNegoCount(data.negoCount ?? 0);
        setNormalCount(data.normalCount ?? 0);
      } else {
        console.error("상품 검색 실패:", response.status);
      }
    } catch (error) {
      console.error("상품 검색 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts("", 0, "LATEST", "SALE");
  }, []);

  useEffect(() => {
    const keyword = params.keyword as string;
    if (keyword && categoryId && !isNaN(categoryId)) {
      setSearchKeyword(keyword);
      setSortType("LATEST");
      setProductType("SALE");
      fetchProducts(keyword, 0, "LATEST", "SALE");
    }
  }, [params.keyword, params.categoryId]);

  const handleSearch = () => {
    setSortType("LATEST");
    setProductType("SALE");
    fetchProducts(searchKeyword, 0, "LATEST", "SALE");
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

  const handleFilterSelect = (value: string) => {
    setSortType(value);
    closeFilterModal();
    fetchProducts(searchKeyword, 0, value, productType);
  };

  const handleProductTypeSelect = (type: string) => {
    setProductType(type);
    setPage(0);
    fetchProducts(searchKeyword, 0, sortType, type);
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
              onSubmitEditing={handleSearch}
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
                      {product.storeName}
                    </Text>
                    <Text style={styles.gridProductName} numberOfLines={1}>
                      {product.productName}
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

        <TouchableOpacity
          style={styles.scrollToTopButton}
          onPress={scrollToTop}
        >
          <Ionicons name="chevron-up" size={24} color="#EF7810" />
        </TouchableOpacity>
      </View>
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
