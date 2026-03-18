import Ionicons from "@expo/vector-icons/build/Ionicons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
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
import { styles } from "./search-result.styles";

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
  const [searchKeyword, setSearchKeyword] = useState(
    (params.keyword as string) || "",
  );
  const flatListRef = useRef<import("react-native").FlatList>(null);
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
    _keyword: string,
    _sort: string = sortType,
    _pg: number = page,
  ) => {
    setLoading(false);
    setProducts([]);
  };

  // 페이지가 focus될 때마다 params.keyword로 검색 실행
  useFocusEffect(
    useCallback(() => {
      const keyword = params.keyword as string;
      if (keyword) {
        setSearchKeyword(keyword);
        setSortType("LATEST");
        setPage(0);
        // params.keyword로 검색 실행 (초기값으로 명시적 전달)
        fetchProducts(keyword, "LATEST", 0);
      }
    }, [params.keyword]),
  );

  // 검색 버튼 클릭 (search-result 페이지 내에서)
  const handleSearch = () => {
    if (!searchKeyword.trim()) return;

    // 정렬 및 페이지 초기화 후 검색
    setSortType("LATEST");
    setPage(0);
    // 초기값으로 명시적 전달
    fetchProducts(searchKeyword, "LATEST", 0);
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  //필터 선택
  const handleFilterSelect = (value: string) => {
    setSortType(value);
    setPage(0);
    // 필터 변경 시 현재 검색어로 재검색
    fetchProducts(searchKeyword, value, 0);
    closeFilterModal();
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
                  onPress={() =>
                    router.push({
                      pathname: "/(cust)/product-detail",
                      params: { productCode: product.productCode },
                    })
                  }
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
