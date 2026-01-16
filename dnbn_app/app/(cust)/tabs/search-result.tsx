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

  const stores = [
    {
      id: "1",
      uri: require("@/assets/images/logo.png"),
      name: "오늘의김밥",
      category: "분식",
      description:
        "신선한 재료로 매일 아침 준비하는 수제 김밥 맛있는 김밥입니다 진짜 어쩌구저쩌구 2줄을 위함",
      averageRate: 4.6,
      reviewCount: 1324,
    },
    {
      id: "2",
      uri: require("@/assets/images/logo.png"),
      name: "마포숯불갈비",
      category: "한식",
      description: "참숯에 구워 깊은 풍미를 살린 돼지갈비 전문점",
      averageRate: 4.3,
      reviewCount: 987,
    },
    {
      id: "3",
      uri: require("@/assets/images/logo.png"),
      name: "바다한접시",
      category: "해산물",
      description: "당일 공수한 신선한 해산물 요리",
      averageRate: 4.1,
      reviewCount: 542,
    },
    {
      id: "4",
      uri: require("@/assets/images/logo.png"),
      name: "과일상회 청과",
      category: "과일",
      description: "제철 과일을 합리적인 가격으로 판매합니다",
      averageRate: 4.7,
      reviewCount: 2140,
    },
    {
      id: "5",
      uri: require("@/assets/images/logo.png"),
      name: "달콤한하루",
      category: "디저트",
      description: "수제 케이크와 마카롱이 인기인 디저트 카페",
      averageRate: 4.8,
      reviewCount: 1763,
    },
    {
      id: "6",
      uri: require("@/assets/images/logo.png"),
      name: "오렌지마켓",
      category: "과일",
      description: "산지 직송 과일 전문 매장",
      averageRate: 4.2,
      reviewCount: 689,
    },
    {
      id: "7",
      uri: require("@/assets/images/logo.png"),
      name: "무드웨어",
      category: "옷가게",
      description: "데일리룩부터 오피스룩까지 트렌디한 의류",
      averageRate: 4.4,
      reviewCount: 953,
    },
    {
      id: "8",
      uri: require("@/assets/images/logo.png"),
      name: "스트릿핏",
      category: "옷가게",
      description: "캐주얼 스트릿 패션 전문 스토어",
      averageRate: 4.0,
      reviewCount: 418,
    },
    {
      id: "9",
      uri: require("@/assets/images/logo.png"),
      name: "클래식룸",
      category: "옷가게",
      description: "미니멀하고 깔끔한 남녀 공용 의류",
      averageRate: 4.5,
      reviewCount: 1120,
    },
    {
      id: "10",
      uri: require("@/assets/images/logo.png"),
      name: "동네파스타",
      category: "양식",
      description: "가성비 좋은 파스타와 스테이크 맛집",
      averageRate: 4.3,
      reviewCount: 764,
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
