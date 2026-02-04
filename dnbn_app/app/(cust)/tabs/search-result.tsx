import Ionicons from "@expo/vector-icons/build/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
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
import { styles } from "../styles/search-result.styles";

export default function SearchView() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [searchKeyword, setSearchKeyword] = useState(
    (params.keyword as string) || ""
  );
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("최신순");

  const filterOptions = [
    { id: "1", label: "최신순" },
    { id: "2", label: "리뷰 많은 순" },
    { id: "3", label: "별점 높은 순" },
    { id: "4", label: "낮은 가격 순" },
    { id: "5", label: "높은 가격 순" },
  ];

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

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    closeFilterModal();
    // 여기서 필터링 로직 추가 가능
  };

  const products = [
    {
      id: "1",
      uri: require("@/assets/images/logo.png"),
      storeName: "맛집1",
      name: "상품1",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명1",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "2",
      uri: require("@/assets/images/logo.png"),
      storeName: "맛집2",
      name: "상품2",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명2",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "3",
      uri: require("@/assets/images/logo.png"),
      storeName: "맛집3",
      name: "상품3",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명3",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "4",
      uri: require("@/assets/images/logo.png"),
      storeName: "맛집4",
      name: "상품4",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명1",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "5",
      uri: require("@/assets/images/logo.png"),
      storeName: "맛집5",
      name: "상품5",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명2",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "6",
      uri: require("@/assets/images/logo.png"),
      storeName: "맛집6",
      name: "상품6",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명3",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "7",
      uri: require("@/assets/images/logo.png"),
      name: "상품1",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명1",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "8",
      uri: require("@/assets/images/logo.png"),
      name: "상품2",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명2",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "9",
      uri: require("@/assets/images/logo.png"),
      name: "상품3",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명3",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "10",
      uri: require("@/assets/images/logo.png"),
      name: "상품1",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명1",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "11",
      uri: require("@/assets/images/logo.png"),
      name: "상품2",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명2",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "12",
      uri: require("@/assets/images/logo.png"),
      name: "상품3",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명3",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "13",
      uri: require("@/assets/images/logo.png"),
      name: "상품1",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명1",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "14",
      uri: require("@/assets/images/logo.png"),
      name: "상품2",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명2",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "15",
      uri: require("@/assets/images/logo.png"),
      name: "상품3",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명3",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "16",
      uri: require("@/assets/images/logo.png"),
      name: "상품1",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명1",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "17",
      uri: require("@/assets/images/logo.png"),
      name: "상품2",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명2",
      averageRate: 3.4,
      reviewCount: 1280,
    },
    {
      id: "18",
      uri: require("@/assets/images/logo.png"),
      name: "상품3",
      discountRate: 20,
      price: "8000",
      originalPrice: "10000",
      description: "상품설명3",
      averageRate: 3.4,
      reviewCount: 1280,
    },
  ];

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
          <Text style={styles.title}>검색 결과</Text>
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
            />
            <Pressable style={styles.searchButton}>
              <Text style={styles.searchButtonText}>검색</Text>
            </Pressable>
          </View>
        </View>
        {/* 필터 헤더 */}
        <View style={styles.filterHeader}>
          <Text style={styles.resultCountText}>
            총 {products.length}개 상품
          </Text>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={openFilterModal}
          >
            <Ionicons name="filter-outline" size={18} color="#666" />
            <Text style={styles.filterText}>{selectedFilter}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.productResultContainer}>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            renderItem={({ item: product }) => (
              <TouchableOpacity
                onPress={() => router.push("/(cust)/product-detail")}
                style={styles.gridItem}
              >
                <Image
                  resizeMode="contain"
                  source={product.uri}
                  style={styles.gridImage}
                />
                <View style={styles.gridInfo}>
                  <Text style={styles.gridStoreName} numberOfLines={1}>
                    {product.storeName}
                  </Text>
                  <Text style={styles.gridProductName} numberOfLines={1}>
                    {product.name}
                  </Text>
                  <Text style={styles.gridPrice}>{product.price}원</Text>
                </View>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
          />
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
                    key={option.id}
                    style={[
                      styles.filterOption,
                      selectedFilter === option.label &&
                        styles.filterOptionSelected,
                    ]}
                    onPress={() => handleFilterSelect(option.label)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedFilter === option.label &&
                          styles.filterOptionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {selectedFilter === option.label && (
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
