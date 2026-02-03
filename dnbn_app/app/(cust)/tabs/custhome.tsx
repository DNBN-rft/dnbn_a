import { apiGet } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "../styles/custhome.styles";

const screenWidth = Dimensions.get("window").width;

export default function CustHomeScreen() {
  const bannerRef = useRef<FlatList>(null);
  const currentIndex = useRef(0);
  const insets = useSafeAreaInsets();

  const [negoProducts, setNegoProducts] = useState<any[]>([]);
  const [isLoadingNego, setIsLoadingNego] = useState(true);
  const [saleProducts, setSaleProducts] = useState<any[]>([]);
  const [isLoadingSale, setIsLoadingSale] = useState(true);
  const [regularProducts, setRegularProducts] = useState<any[]>([]);
  const [isLoadingRegular, setIsLoadingRegular] = useState(true);

  const originalBanners = [
    { id: "1", uri: require("@/assets/images/normalproduct/bread.jpg") },
    { id: "2", uri: require("@/assets/images/favicon.png") },
    { id: "3", uri: require("@/assets/images/react-logo.png") },
    { id: "4", uri: require("@/assets/images/logo.png") },
  ];

  const banners = [
    ...originalBanners,
    { ...originalBanners[0], id: "1-clone" },
  ];

  // API 호출하여 네고 상품 데이터 가져오기
  useEffect(() => {
    const fetchNegoProducts = async () => {
      try {
        setIsLoadingNego(true);
        const custCode = "CUST001";
        const response = await apiGet(`/cust/nego/home?custCode=${custCode}`);
        const data = await response.json();
        if (response.ok && Array.isArray(data)) {
          setNegoProducts(data);
        } else {
          console.error("네고 상품 로드 실패:", data);
        }
      } catch (error) {
        console.error("네고 상품 API 호출 실패:", error);
      } finally {
        setIsLoadingNego(false);
      }
    };

    fetchNegoProducts();
  }, []);

  // API 호출하여 할인 상품 데이터 가져오기 (top 5)
  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        setIsLoadingSale(true);
        const custCode = "CUST001";
        const response = await apiGet(`/cust/sales/home?custCode=${custCode}`);
        const data = await response.json();
        if (response.ok && Array.isArray(data)) {
          setSaleProducts(data);
        } else {
          console.error("할인 상품 로드 실패:", data);
        }
      } catch (error) {
        console.error("할인 상품 API 호출 실패:", error);
      } finally {
        setIsLoadingSale(false);
      }
    };

    fetchSaleProducts();
  }, []);

  // API 호출하여 일반 상품 데이터 가져오기 (top 5)
  useEffect(() => {
    const fetchRegularProducts = async () => {
      try {
        setIsLoadingRegular(true);
        const custCode = "CUST001";
        const response = await apiGet(
          `/cust/regular/home?custCode=${custCode}`,
        );
        const data = await response.json();
        if (response.ok && Array.isArray(data)) {
          setRegularProducts(data);
        } else {
          console.error("일반 상품 로드 실패:", data);
        }
      } catch (error) {
        console.error("일반 상품 API 호출 실패:", error);
      } finally {
        setIsLoadingRegular(false);
      }
    };

    fetchRegularProducts();
  }, []);

  const transformedNegoProducts = negoProducts.map((item) => ({
    id: item.productCode,
    uri: item.images?.files?.[0]?.fileUrl
      ? { uri: item.images.files[0].fileUrl }
      : { uri: "https://via.placeholder.com/150" },
    productName: item.productNm,
    storeName: item.storeNm,
    price: item.price,
  }));

  const transformedSaleProducts = saleProducts.map((item) => {
    const discountPercent =
      item.saleType === "PERCENTAGE"
        ? item.saleValue
        : Math.round(
            ((item.originalPrice - item.discountPrice) / item.originalPrice) *
              100,
          );

    return {
      id: item.productCode,
      uri: item.images?.files?.[0]?.fileUrl
        ? { uri: item.images.files[0].fileUrl }
        : { uri: "https://via.placeholder.com/150" },
      productName: item.productNm,
      storeName: item.storeNm,
      discount: discountPercent,
      price: item.discountPrice,
    };
  });

  const transformedRegularProducts = regularProducts.map((item) => ({
    id: item.productCode,
    uri: item.productImg?.fileUrl
      ? { uri: item.productImg.fileUrl }
      : { uri: "https://via.placeholder.com/150" },
    productName: item.productNm,
    storeName: item.storeNm,
    price: item.price,
  }));

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      if (index !== null && index !== undefined) {
        currentIndex.current = index;
      }
    }
  }, []);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = currentIndex.current + 1;

      if (nextIndex >= banners.length) {
        bannerRef.current?.scrollToIndex({
          index: 0,
          animated: false,
        });
        currentIndex.current = 0;

        setTimeout(() => {
          bannerRef.current?.scrollToIndex({
            index: 1,
            animated: true,
          });
        }, 50);
      } else {
        bannerRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }
    }, 3000); // 3초마다 자동 스크롤

    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#fff" }} />
      )}

      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Ionicons name="location" size={24} color="#EF7810" />
          <TouchableOpacity
            style={styles.addr}
            onPress={() => router.push("/(cust)/address")}
          >
            <Text style={styles.addrText}>행궁동</Text>
            <Ionicons name="chevron-down" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push("/(cust)/notifications")}
          >
            <Ionicons name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push("/(cust)/cart")}
          >
            <Ionicons name="cart-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 스크롤 가능한 콘텐츠 */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.bannerContainer}>
          <FlatList
            ref={bannerRef}
            data={banners}
            keyExtractor={(item) => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}
            snapToAlignment="center"
            decelerationRate="fast"
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig.current}
            getItemLayout={(data, index) => ({
              length: screenWidth,
              offset: screenWidth * index,
              index,
            })}
            renderItem={({ item }) => (
              <View style={styles.bannerSlide}>
                <Image
                  source={item.uri}
                  style={styles.bannerImage}
                  resizeMode="stretch"
                />
              </View>
            )}
          />
        </View>

        <View style={styles.contentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="pricetag-outline" size={15} color="#EF7810" />
              할인상품
            </Text>
            <TouchableOpacity
              style={styles.sectionMore}
              onPress={() => router.push("/(cust)/saleProductList")}
            >
              <Text style={styles.sectionMoreText}>+</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={transformedSaleProducts}
            keyExtractor={(item) => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.productCard}
                onPress={() =>
                  router.push(
                    `/(cust)/sale-product-detail?productCode=${item.id}`,
                  )
                }
              >
                <Image source={item.uri} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {item.productName}
                  </Text>
                  <Text style={styles.storeName} numberOfLines={1}>
                    {item.storeName}
                  </Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.discount}>{item.discount}%</Text>
                    <Text style={styles.price}>
                      {item.price.toLocaleString()}원
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={styles.contentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>네고왕</Text>
            <TouchableOpacity
              style={styles.sectionMore}
              onPress={() => router.push("/(cust)/negoList")}
            >
              <Text style={styles.sectionMoreText}>+</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={transformedNegoProducts}
            keyExtractor={(item) => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.productCard}
                onPress={() =>
                  router.push(
                    `/(cust)/nego-product-detail?productCode=${item.id}`,
                  )
                }
              >
                <Image
                  source={
                    typeof item.uri === "string" ? { uri: item.uri } : item.uri
                  }
                  style={styles.productImage}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {item.productName}
                  </Text>
                  <Text style={styles.storeName} numberOfLines={1}>
                    {item.storeName}
                  </Text>
                  <Text style={styles.price}>
                    {item.price.toLocaleString()}원
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={styles.contentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>일반 상품</Text>
            <TouchableOpacity
              style={styles.sectionMore}
              onPress={() => router.push("/(cust)/productList")}
            >
              <Text style={styles.sectionMoreText}>+</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={transformedRegularProducts}
            keyExtractor={(item) => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.productCard}
                onPress={() =>
                  router.push(`/(cust)/product-detail?productCode=${item.id}`)
                }
              >
                <Image
                  source={
                    typeof item.uri === "string" ? { uri: item.uri } : item.uri
                  }
                  style={styles.productImage}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {item.productName}
                  </Text>
                  <Text style={styles.storeName} numberOfLines={1}>
                    {item.storeName}
                  </Text>
                  <Text style={styles.price}>
                    {item.price.toLocaleString()}원
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
}
