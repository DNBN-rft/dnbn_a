import Ionicons from "@expo/vector-icons/build/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
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

  const GUEST_KEY = "guest";

  // API 데이터 상태
  const [categories, setCategories] = useState<any[]>([]);
  const [discountProducts, setDiscountProducts] = useState<any[]>([]);
  const [negoProducts, setNegoProducts] = useState<any[]>([]);
  const [normalProducts, setNormalProducts] = useState<any[]>([]);

  // 데이터 로드 여부 추적
  const [hasLoadedData, setHasLoadedData] = useState(false);

  // gradient — scrollX 위치에 따라 실시간으로 opacity 계산
  const discountScrollX = useRef(new Animated.Value(0)).current;
  const discountMaxScrollX = useRef(new Animated.Value(9999)).current;
  const discountLayoutWidth = useRef(0);
  const discountLeftOpacity = useRef(
    discountScrollX.interpolate({
      inputRange: [0, 60],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
  ).current;
  const discountRightOpacity = useRef(
    Animated.subtract(discountMaxScrollX, discountScrollX).interpolate({
      inputRange: [0, 60],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
  ).current;

  const negoScrollX = useRef(new Animated.Value(0)).current;
  const negoMaxScrollX = useRef(new Animated.Value(9999)).current;
  const negoLayoutWidth = useRef(0);
  const negoLeftOpacity = useRef(
    negoScrollX.interpolate({
      inputRange: [0, 60],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
  ).current;
  const negoRightOpacity = useRef(
    Animated.subtract(negoMaxScrollX, negoScrollX).interpolate({
      inputRange: [0, 60],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
  ).current;

  const normalScrollX = useRef(new Animated.Value(0)).current;
  const normalMaxScrollX = useRef(new Animated.Value(9999)).current;
  const normalLayoutWidth = useRef(0);
  const normalLeftOpacity = useRef(
    normalScrollX.interpolate({
      inputRange: [0, 60],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
  ).current;
  const normalRightOpacity = useRef(
    Animated.subtract(normalMaxScrollX, normalScrollX).interpolate({
      inputRange: [0, 60],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
  ).current;

  // 초기 데이터 로드
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          // 최근 검색어 불러오기
          const searches = await getRecentSearches(GUEST_KEY);
          setRecentSearches(searches);

          // API 호출 (데이터가 없을 때만)
          if (!hasLoadedData) {
            await fetchSearchData();
            setHasLoadedData(true);
          }
        } catch (error) {
          console.error("데이터 로드 실패:", error);
        }
      };

      loadData();
    }, [hasLoadedData]),
  );

  // 검색 페이지 내부 렌더링 할 데이터 로드
  const fetchSearchData = async () => {
    try {
      setIsLoading(true);
      const response = await apiGet("/guest/search");

      if (!response.ok) {
        throw new Error("데이터 조회에 실패했습니다.");
      }

      const data = await response.json();

      // 카테고리: guestCategoryItems → { categoryIdx, categoryNm, categoryImgUrl }
      const categoriesData =
        data.guestCategoryItems?.map((item: any, index: number) => ({
          id: String(index + 1),
          categoryId: item.categoryIdx,
          name: item.categoryNm,
          icon: item.categoryImgUrl ? { uri: item.categoryImgUrl } : null,
        })) || [];

      // 할인 상품: guestRecommendSaleItems
      const discountData =
        data.guestRecommendSaleItems?.map((item: any) => ({
          id: item.productCode,
          uri: item.productImageUrl ? { uri: item.productImageUrl } : null,
          storeName: item.storeNm,
          name: item.productNm,
          saleType: item.saleType,
          originalPrice: item.productPrice,
          saleValue: item.discountValue,
          price: item.discountedPrice,
        })) || [];

      // 네고 상품: guestRecommendNegoItems
      const negoData =
        data.guestRecommendNegoItems?.map((item: any) => ({
          id: item.productCode,
          uri: item.productImageUrl ? { uri: item.productImageUrl } : null,
          storeName: item.storeNm,
          name: item.productNm,
        })) || [];

      // 일반 상품: guestRecommendCommonItems
      const normalData =
        data.guestRecommendCommonItems?.map((item: any) => ({
          id: item.productCode,
          uri: item.productImageUrl ? { uri: item.productImageUrl } : null,
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

    const updated = await addRecentSearch(searchKeyword.trim(), GUEST_KEY);
    setRecentSearches(updated);

    // 검색 결과 페이지로 이동
    router.push({
      pathname: "/(guest)/search-result",
      params: {
        keyword: searchKeyword.trim(),
      },
    });
  };

  // 최근 검색어 클릭
  const handleRecentSearchClick = async (keyword: string) => {
    setSearchKeyword(keyword);

    const updated = await addRecentSearch(keyword, GUEST_KEY);
    setRecentSearches(updated);

    router.push({
      pathname: "/(guest)/search-result",
      params: { keyword },
    });
  };

  const handleDeleteSearch = async (keyword: string) => {
    const updated = await removeRecentSearch(keyword, GUEST_KEY);
    setRecentSearches(updated);
  };

  const handleDeleteAllSearches = async () => {
    await clearRecentSearches(GUEST_KEY);
    setRecentSearches([]);
  };

  const getProductsWithMore = (products: any[], type: string) => {
    return products.slice(0, 5);
  };

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Platform.OS === "ios" ? insets.bottom + 60 : 0 },
      ]}
    >
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
          <Text style={styles.title}>검색</Text>
        </View>
        <View style={styles.rightSection} />
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
                placeholder={"어떤 가게나 상품을 검색하고 싶으세요?"}
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
              {recentSearches.length > 0 ? (
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
              ) : (
                <View style={styles.emptyRecentSearch}>
                  <Text style={styles.emptyRecentSearchText}>
                    최근 검색어가 없습니다.
                  </Text>
                </View>
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
                    onPress={() =>
                      router.push({
                        pathname: "/(guest)/category-search",
                        params: {
                          categoryId: item.categoryId,
                        },
                      })
                    }
                    style={styles.categoryItem}
                  >
                    <View style={styles.categoryImageBox}>
                      <Image
                        resizeMode="cover"
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
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>추천 할인 상품</Text>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/(guest)/saleProductList",
                      params: { from: "search" },
                    })
                  }
                >
                  <Text style={styles.viewAllText}>+ 상품 전체 보기</Text>
                </TouchableOpacity>
              </View>
              {discountProducts.length === 0 ? (
                <View style={styles.emptyProductContainer}>
                  <Ionicons name="cart-outline" size={40} color="#ccc" />
                  <Text style={styles.emptyText}>
                    등록된 할인 상품이 없어요
                  </Text>
                </View>
              ) : (
                <View style={styles.productListWrapper}>
                  <FlatList
                    data={getProductsWithMore(discountProducts, "discount")}
                    keyExtractor={(item) => item.id}
                    onScroll={Animated.event(
                      [
                        {
                          nativeEvent: {
                            contentOffset: { x: discountScrollX },
                          },
                        },
                      ],
                      { useNativeDriver: false },
                    )}
                    onContentSizeChange={(contentW) => {
                      discountMaxScrollX.setValue(
                        Math.max(0, contentW - discountLayoutWidth.current),
                      );
                    }}
                    onLayout={(e) => {
                      discountLayoutWidth.current = e.nativeEvent.layout.width;
                    }}
                    scrollEventThrottle={16}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() =>
                          router.push(
                            `/(guest)/sale-product-detail?productCode=${item.id}`,
                          )
                        }
                        style={styles.galleryItem}
                      >
                        {item.uri ? (
                          <Image
                            resizeMode="cover"
                            source={item.uri}
                            style={styles.galleryImage}
                          />
                        ) : (
                          <View
                            style={[styles.galleryImage, styles.noImageBox]}
                          >
                            <Ionicons
                              name="image-outline"
                              size={50}
                              color="#ccc"
                            />
                          </View>
                        )}
                        <View style={styles.galleryInfo}>
                          <Text style={styles.storeName} numberOfLines={1}>
                            {item.storeName}
                          </Text>
                          <Text style={styles.productName} numberOfLines={1}>
                            {item.name}
                          </Text>
                          <View style={styles.priceRow}>
                            <Text style={styles.originalPrice}>
                              {item.originalPrice?.toLocaleString()}원
                            </Text>
                            <Text style={styles.discountPrice}>
                              {item.saleType === "할인률"
                                ? `${item.saleValue}%`
                                : `${item.saleValue?.toLocaleString()}원`}
                            </Text>
                          </View>
                          <Text style={styles.productPrice}>
                            {item.price?.toLocaleString()}원
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.galleryContainer}
                  />
                  <Animated.View
                    style={[
                      styles.productFadeLeft,
                      { opacity: discountLeftOpacity },
                    ]}
                    pointerEvents="none"
                  >
                    <LinearGradient
                      colors={["rgba(255,255,255,0.9)", "transparent"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ flex: 1 }}
                    />
                  </Animated.View>
                  <Animated.View
                    style={[
                      styles.productFadeRight,
                      { opacity: discountRightOpacity },
                    ]}
                    pointerEvents="none"
                  >
                    <LinearGradient
                      colors={["transparent", "rgba(255,255,255,0.9)"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ flex: 1 }}
                    />
                  </Animated.View>
                </View>
              )}
            </View>

            {/* 추천 네고 상품 섹션 */}
            <View style={styles.productSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>추천 네고 상품</Text>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/(guest)/negoList",
                      params: { from: "search" },
                    })
                  }
                >
                  <Text style={styles.viewAllText}>+ 상품 전체 보기</Text>
                </TouchableOpacity>
              </View>
              {negoProducts.length === 0 ? (
                <View style={styles.emptyProductContainer}>
                  <Ionicons name="cart-outline" size={40} color="#ccc" />
                  <Text style={styles.emptyText}>
                    등록된 네고 상품이 없어요
                  </Text>
                </View>
              ) : (
                <View style={styles.productListWrapper}>
                  <FlatList
                    data={getProductsWithMore(negoProducts, "nego")}
                    keyExtractor={(item) => item.id}
                    onScroll={Animated.event(
                      [{ nativeEvent: { contentOffset: { x: negoScrollX } } }],
                      { useNativeDriver: false },
                    )}
                    onContentSizeChange={(contentW) => {
                      negoMaxScrollX.setValue(
                        Math.max(0, contentW - negoLayoutWidth.current),
                      );
                    }}
                    onLayout={(e) => {
                      negoLayoutWidth.current = e.nativeEvent.layout.width;
                    }}
                    scrollEventThrottle={16}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() =>
                          router.push(
                            `/(guest)/nego-product-detail?productCode=${item.id}`,
                          )
                        }
                        style={styles.galleryItem}
                      >
                        {item.uri ? (
                          <Image
                            resizeMode="cover"
                            source={item.uri}
                            style={styles.galleryImage}
                          />
                        ) : (
                          <View
                            style={[styles.galleryImage, styles.noImageBox]}
                          >
                            <Ionicons
                              name="image-outline"
                              size={50}
                              color="#ccc"
                            />
                          </View>
                        )}
                        <View style={styles.galleryInfo}>
                          <Text style={styles.storeName} numberOfLines={1}>
                            {item.storeName}
                          </Text>
                          <Text style={styles.productName} numberOfLines={1}>
                            {item.name}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.galleryContainer}
                  />
                  <Animated.View
                    style={[
                      styles.productFadeLeft,
                      { opacity: negoLeftOpacity },
                    ]}
                    pointerEvents="none"
                  >
                    <LinearGradient
                      colors={["rgba(255,255,255,0.9)", "transparent"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ flex: 1 }}
                    />
                  </Animated.View>
                  <Animated.View
                    style={[
                      styles.productFadeRight,
                      { opacity: negoRightOpacity },
                    ]}
                    pointerEvents="none"
                  >
                    <LinearGradient
                      colors={["transparent", "rgba(255,255,255,0.9)"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ flex: 1 }}
                    />
                  </Animated.View>
                </View>
              )}
            </View>

            {/* 추천 일반 상품 섹션 */}
            <View style={styles.productSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>추천 일반 상품</Text>
                <TouchableOpacity
                  onPress={() => router.push("/(guest)/productList")}
                >
                  <Text style={styles.viewAllText}>+ 상품 전체 보기</Text>
                </TouchableOpacity>
              </View>
              {normalProducts.length === 0 ? (
                <View style={styles.emptyProductContainer}>
                  <Ionicons name="cart-outline" size={40} color="#ccc" />
                  <Text style={styles.emptyText}>
                    등록된 일반 상품이 없어요
                  </Text>
                </View>
              ) : (
                <View style={styles.productListWrapper}>
                  <FlatList
                    data={getProductsWithMore(normalProducts, "normal")}
                    keyExtractor={(item) => item.id}
                    onScroll={Animated.event(
                      [
                        {
                          nativeEvent: { contentOffset: { x: normalScrollX } },
                        },
                      ],
                      { useNativeDriver: false },
                    )}
                    onContentSizeChange={(contentW) => {
                      normalMaxScrollX.setValue(
                        Math.max(0, contentW - normalLayoutWidth.current),
                      );
                    }}
                    onLayout={(e) => {
                      normalLayoutWidth.current = e.nativeEvent.layout.width;
                    }}
                    scrollEventThrottle={16}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() =>
                          router.push(
                            `/(guest)/product-detail?productCode=${item.id}`,
                          )
                        }
                        style={styles.galleryItem}
                      >
                        {item.uri ? (
                          <Image
                            resizeMode="cover"
                            source={item.uri}
                            style={styles.galleryImage}
                          />
                        ) : (
                          <View
                            style={[styles.galleryImage, styles.noImageBox]}
                          >
                            <Ionicons
                              name="image-outline"
                              size={50}
                              color="#ccc"
                            />
                          </View>
                        )}
                        <View style={styles.galleryInfo}>
                          <Text style={styles.storeName} numberOfLines={1}>
                            {item.storeName}
                          </Text>
                          <Text style={styles.productName} numberOfLines={1}>
                            {item.name}
                          </Text>
                          <Text style={styles.productPrice}>
                            {Number(item.price).toLocaleString()}원
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.galleryContainer}
                  />
                  <Animated.View
                    style={[
                      styles.productFadeLeft,
                      { opacity: normalLeftOpacity },
                    ]}
                    pointerEvents="none"
                  >
                    <LinearGradient
                      colors={["rgba(255,255,255,0.9)", "transparent"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ flex: 1 }}
                    />
                  </Animated.View>
                  <Animated.View
                    style={[
                      styles.productFadeRight,
                      { opacity: normalRightOpacity },
                    ]}
                    pointerEvents="none"
                  >
                    <LinearGradient
                      colors={["transparent", "rgba(255,255,255,0.9)"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ flex: 1 }}
                    />
                  </Animated.View>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
