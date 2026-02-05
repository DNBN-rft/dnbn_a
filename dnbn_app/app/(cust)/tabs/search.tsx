import Ionicons from "@expo/vector-icons/build/Ionicons";
import { router, useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { apiGet } from "../../../utils/api";
import {
  addRecentSearch,
  clearRecentSearches,
  getRecentSearches,
  removeRecentSearch,
} from "../../../utils/recentSearchStorage";
import { styles } from "../styles/search.styles";

export default function SearchView() {
  const insets = useSafeAreaInsets();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // API 데이터 상태
  const [categories, setCategories] = useState<any[]>([]);
  const [discountProducts, setDiscountProducts] = useState<any[]>([]);
  const [negoProducts, setNegoProducts] = useState<any[]>([]);
  const [normalProducts, setNormalProducts] = useState<any[]>([]);

  // custCode 가져오기 및 초기 데이터 로드
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          // custCode 가져오기
          let custCode = null;
          if (Platform.OS === "web") {
            custCode = localStorage.getItem("custCode");
          } else {
            custCode = await SecureStore.getItemAsync("custCode");
          }

          // 최근 검색어 불러오기
          if (custCode) {
            const searches = await getRecentSearches(custCode);
            setRecentSearches(searches);
          }

          // API 호출
          await fetchSearchData();
        } catch (error) {
          console.error("데이터 로드 실패:", error);
        }
      };

      loadData();
    }, []),
  );

  // 검색 데이터 가져오기
  const fetchSearchData = async () => {
    try {
      setIsLoading(true);
      const response = await apiGet("/cust/search");

      if (!response.ok) {
        throw new Error("데이터 조회에 실패했습니다.");
      }

      const data = await response.json();

      // 카테고리 데이터 변환
      const categoriesData =
        data.categories?.map((item: any, index: number) => ({
          id: String(index + 1),
          name: item.categoryTitle,
          icon: { uri: item.categoryImageUrl },
        })) || [];

      // 할인 상품 데이터 변환
      const discountData =
        data.recommendSales?.map((item: any) => ({
          id: item.productCode,
          uri: item.productImageUrl
            ? { uri: item.productImageUrl }
            : require("@/assets/images/logo.png"),
          storeName: item.storeNm,
          name: item.productNm,
          originalPrice: item.productPrice,
          discountValue: item.discountValue,
          price: item.discountedPrice,
        })) || [];

      // 네고 상품 데이터 변환
      const negoData =
        data.recommendNegos?.map((item: any) => ({
          id: item.productCode,
          uri: item.productImageUrl
            ? { uri: item.productImageUrl }
            : require("@/assets/images/logo.png"),
          storeName: item.storeNm,
          name: item.productNm,
          price: "협상가능",
        })) || [];

      // 일반 상품 데이터 변환
      const normalData =
        data.recommendCommons?.map((item: any) => ({
          id: item.productCode,
          uri: item.productImageUrl
            ? { uri: item.productImageUrl }
            : require("@/assets/images/logo.png"),
          storeName: item.storeNm,
          name: item.productNm,
          price: item.productPrice,
        })) || [];

      setCategories(categoriesData);
      setDiscountProducts(discountData);
      setNegoProducts(negoData);
      setNormalProducts(normalData);
    } catch (error) {
      console.error("검색 데이터 조회 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 검색 실행
  const handleSearch = async () => {
    if (!searchKeyword.trim()) return;

    // 최근 검색어에 추가
    if (custCode) {
      const updated = await addRecentSearch(searchKeyword.trim(), custCode);
      setRecentSearches(updated);
    }

    // 검색 결과 페이지로 이동
    router.push({
      pathname: "/tabs/search-result",
      params: {
        keyword: searchKeyword.trim(),
        timestamp: Date.now().toString(),
      },
    });
  };

  // 최근 검색어 클릭
  const handleRecentSearchClick = async (keyword: string) => {
    setSearchKeyword(keyword);

    // 최근 검색어 순서 업데이트
    if (custCode) {
      const updated = await addRecentSearch(keyword, custCode);
      setRecentSearches(updated);
    }

    router.push({
      pathname: "/tabs/search-result",
      params: { keyword, timestamp: Date.now().toString() },
    });
  };

  const handleDeleteSearch = async (keyword: string) => {
    if (!custCode) return;
    const updated = await removeRecentSearch(keyword, custCode);
    setRecentSearches(updated);
  };

  const handleDeleteAllSearches = async () => {
    if (!custCode) return;
    await clearRecentSearches(custCode);
    setRecentSearches([]);
  };

  const getProductsWithMore = (products: any[], type: string) => {
    const maxItems = 5;
    const displayProducts = products.slice(0, maxItems);
    return [...displayProducts, { id: `more-${type}`, isMore: true, type }];
  };

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#fff" }} />
      )}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>검색</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={{ padding: 40, alignItems: "center" }}>
            <ActivityIndicator size="large" color="#EF7810" />
          </View>
        ) : (
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
              <Pressable onPress={handleSearch} style={styles.searchButton}>
                <Text style={styles.searchButtonText}>검색</Text>
              </Pressable>
            </View>

            <View style={styles.recentSearchContainer}>
              <View style={styles.recentSearchHeader}>
                <Text style={styles.recentSearchKeywordText}>최근 검색어</Text>

                <TouchableOpacity onPress={handleDeleteAllSearches}>
                  <Text style={styles.deleteAllText}>전체삭제</Text>
                </TouchableOpacity>
              </View>
              {recentSearches.length > 0 && (
                <FlatList
                  data={recentSearches}
                  keyExtractor={(item, index) => `recent-${index}`}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.recentSearchKeyword}
                      onPress={() => handleRecentSearchClick(item)}
                    >
                      <Text style={styles.recentKeywordText}>{item}</Text>

                      <Pressable
                        style={styles.deleteButton}
                        onPress={() => handleDeleteSearch(item)}
                      >
                        <Ionicons name="close" size={16} color="black" />
                      </Pressable>
                    </TouchableOpacity>
                  )}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                />
              )}
            </View>

            {/* 카테고리 섹션 */}
            <View style={styles.categorySection}>
              <Text style={styles.sectionTitle}>카테고리</Text>
              <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => router.push("/(cust)/category")}
                    style={styles.categoryItem}
                  >
                    <View style={styles.categoryImageBox}>
                      <Image
                        resizeMode="contain"
                        source={
                          typeof item.icon === "string"
                            ? { uri: item.icon }
                            : item.icon
                        }
                        style={styles.categoryImage}
                      />
                    </View>
                    <Text style={styles.categoryName}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryContainer}
              />
            </View>

            {/* 추천 할인 상품 섹션 */}
            <View style={styles.productSection}>
              <Text style={styles.sectionTitle}>추천 할인 상품</Text>
              <FlatList
                data={getProductsWithMore(discountProducts, "discount")}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  if (item.isMore) {
                    return (
                      <TouchableOpacity
                        onPress={() => router.push("/(cust)/saleProductList")}
                        style={styles.moreButton}
                      >
                        <Ionicons
                          name="ellipsis-horizontal"
                          size={22}
                          color="#999"
                        />
                      </TouchableOpacity>
                    );
                  }
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        router.push(
                          `/(cust)/sale-product-detail?productCode=${item.id}`,
                        )
                      }
                      style={styles.galleryItem}
                    >
                      <Image
                        resizeMode="contain"
                        source={
                          typeof item.uri === "string"
                            ? { uri: item.uri }
                            : item.uri
                        }
                        style={styles.galleryImage}
                      />
                      <View style={styles.galleryInfo}>
                        <Text style={styles.storeName} numberOfLines={1}>
                          {item.storeName}
                        </Text>
                        <Text style={styles.productName} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <View style={styles.priceRow}>
                          <Text style={styles.originalPrice}>
                            {item.originalPrice}
                          </Text>
                          <Text style={styles.discountPrice}>
                            {item.discountValue}
                          </Text>
                        </View>
                        <Text style={styles.productPrice}>{item.price}원</Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.galleryContainer}
              />
            </View>

            {/* 추천 네고 상품 섹션 */}
            <View style={styles.productSection}>
              <Text style={styles.sectionTitle}>추천 네고 상품</Text>
              <FlatList
                data={getProductsWithMore(negoProducts, "nego")}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  if (item.isMore) {
                    return (
                      <TouchableOpacity
                        onPress={() => router.push("/(cust)/negoList")}
                        style={styles.moreButton}
                      >
                        <Ionicons
                          name="ellipsis-horizontal"
                          size={22}
                          color="#999"
                        />
                      </TouchableOpacity>
                    );
                  }
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        router.push(
                          `/(cust)/nego-product-detail?productCode=${item.id}`,
                        )
                      }
                      style={styles.galleryItem}
                    >
                      <Image
                        resizeMode="contain"
                        source={
                          typeof item.uri === "string"
                            ? { uri: item.uri }
                            : item.uri
                        }
                        style={styles.galleryImage}
                      />
                      <View style={styles.galleryInfo}>
                        <Text style={styles.storeName} numberOfLines={1}>
                          {item.storeName}
                        </Text>
                        <Text style={styles.productName} numberOfLines={1}>
                          {item.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.galleryContainer}
              />
            </View>

            {/* 추천 일반 상품 섹션 */}
            <View style={styles.productSection}>
              <Text style={styles.sectionTitle}>추천 일반 상품</Text>
              <FlatList
                data={getProductsWithMore(normalProducts, "normal")}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  if (item.isMore) {
                    return (
                      <TouchableOpacity
                        onPress={() => router.push("/(cust)/productList")}
                        style={styles.moreButton}
                      >
                        <Ionicons
                          name="ellipsis-horizontal"
                          size={22}
                          color="#999"
                        />
                      </TouchableOpacity>
                    );
                  }
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        router.push(
                          `/(cust)/product-detail?productCode=${item.id}`,
                        )
                      }
                      style={styles.galleryItem}
                    >
                      <Image
                        resizeMode="contain"
                        source={
                          typeof item.uri === "string"
                            ? { uri: item.uri }
                            : item.uri
                        }
                        style={styles.galleryImage}
                      />
                      <View style={styles.galleryInfo}>
                        <Text style={styles.storeName} numberOfLines={1}>
                          {item.storeName}
                        </Text>
                        <Text style={styles.productName} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text style={styles.productPrice}>{item.price}원</Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.galleryContainer}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
