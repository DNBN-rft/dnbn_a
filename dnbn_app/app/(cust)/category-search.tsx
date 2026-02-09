import Ionicons from "@expo/vector-icons/build/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
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
import { styles } from "./category-search.style";

interface SearchProduct {
  productCode: string;
  productImageUrl: string;
  storeName: string;
  productName: string;
  price: string;
  averageRate: number;
  reviewCount: number;
  isNego: boolean;
  isSale: boolean;
}

interface SearchResponse {
  content: SearchProduct[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export default function SearchView() {
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
  const [sortType, setSortType] = useState("LATEST");

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
    searchTerm: string = "",
    currentPage: number = 0,
    sortValue: string = "LATEST",
  ) => {
    if (!categoryId || isNaN(categoryId)) {
      console.error("유효하지 않은 categoryId:", params.categoryId);
      return;
    }
    setLoading(true);
    try {
      const response = await apiGet(
        `/cust/search/categories/${categoryId}/products?searchKeyword=${encodeURIComponent(searchTerm)}&productSortType=${sortValue}&page=${currentPage}&size=15`,
      );

      if (response.ok) {
        const data: SearchResponse = await response.json();
        setProducts(data.content);
        setTotalElements(data.totalElements);
        setPage(data.currentPage);
      } else {
        console.error("상품 검색 실패:", response.status);
      }
    } catch (error) {
      console.error("상품 검색 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    fetchProducts("", 0, sortType);
  }, []);

  // 검색어가 params로 전달되었을 때 검색 실행
  useEffect(() => {
    const keyword = params.keyword as string;
    if (keyword && categoryId && !isNaN(categoryId)) {
      setSearchKeyword(keyword);
      // 새로운 검색 시 정렬 초기화
      setSortType("LATEST");
      fetchProducts(keyword, 0, "LATEST");
    }
  }, [params.keyword, params.categoryId]);

  // 검색 버튼 클릭
  const handleSearch = () => {
    // 검색 시 정렬 초기화
    setSortType("LATEST");
    fetchProducts(searchKeyword, 0, "LATEST");
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
    fetchProducts(searchKeyword, 0, value);
  };

  return (
    <View style={styles.searchResultView}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#fff" }} />
      )}

      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>카테고리 검색 결과</Text>
          <View style={styles.placeholder} />
        </View>
        {/* 검색 영역 */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBarContainer}>
            <TextInput
              placeholder={"어떤 가게나 메뉴를 검색하고 싶으세요?"}
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
          <TouchableOpacity
            style={styles.filterButton}
            onPress={openFilterModal}
          >
            <Ionicons name="filter-outline" size={18} color="#666" />
            <Text style={styles.filterText}>{getSortLabel(sortType)}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.productResultContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#EF7810" />
            </View>
          ) : (
            <FlatList
              data={products}
              keyExtractor={(item) => item.productCode}
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.listContent}
              renderItem={({ item: product }) => (
                <TouchableOpacity
                  onPress={() => router.push("/(cust)/product-detail")}
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
                    {(product.isNego || product.isSale) && (
                      <View style={styles.badgeContainer}>
                        {product.isNego && (
                          <View style={[styles.badge, styles.negoBadge]}>
                            <Text style={styles.badgeText}>네고</Text>
                          </View>
                        )}
                        {product.isSale && (
                          <View style={[styles.badge, styles.saleBadge]}>
                            <Text style={styles.badgeText}>할인</Text>
                          </View>
                        )}
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
                    <Text style={styles.gridPrice}>
                      {Number(product.price).toLocaleString()}원
                    </Text>
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
      </View>
    </View>
  );
}
