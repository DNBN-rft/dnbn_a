import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../styles/custhome.styles";

const screenWidth = Dimensions.get("window").width;

interface BannerItem {
  id: string;
  uri: any;
  productCode?: string;
  productName?: string;
  storeName?: string;
  discount?: number;
  price?: number;
  originalPrice?: number;
  saleType?: string;
}

interface BannerCarouselProps {
  banners: BannerItem[];
}

export default function BannerCarousel({ banners }: BannerCarouselProps) {
  const bannerRef = useRef<FlatList>(null);
  const currentIndex = useRef(1); // 첫 번째 원본부터 시작
  const intervalRef = useRef<number | null>(null);

  // 배너 데이터가 없으면 기본 이미지만 표시
  const originalBanners =
    banners.length > 0
      ? banners
      : [
          {
            id: "1",
            uri: require("@/assets/images/normalproduct/bread.jpg"),
          },
          {
            id: "2",
            uri: require("@/assets/images/favicon.png"),
          },
          {
            id: "3",
            uri: require("@/assets/images/react-logo.png"),
          },
        ];

  // 무한스크롤을 위한 배너 복제 (양쪽에 복제본 추가)
  const finalBanners = [
    {
      ...originalBanners[originalBanners.length - 1],
      id: `${originalBanners[originalBanners.length - 1].id}-clone-start`,
    },
    ...originalBanners,
    { ...originalBanners[0], id: `${originalBanners[0].id}-clone-end` },
  ];

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

  // 자동 슬라이드 시작 함수
  const startAutoSlide = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      const nextIndex = currentIndex.current + 1;

      if (nextIndex >= finalBanners.length) {
        // 마지막 복제본 도달 시 첫번째 원본으로 즉시 점프
        bannerRef.current?.scrollToIndex({
          index: 1,
          animated: false,
        });
        currentIndex.current = 1;
      } else {
        bannerRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        currentIndex.current = nextIndex;
      }
    }, 3000);
  }, [finalBanners.length]);

  // 자동 슬라이드 정지 함수
  const stopAutoSlide = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // 사용자 수동 스크롤 종료 시 무한 스크롤 위치 조정
  const handleMomentumScrollEnd = useCallback(() => {
    const index = currentIndex.current;

    // 마지막 복제본(맨 끝)에 도달한 경우 -> 첫번째 원본으로 이동
    if (index >= finalBanners.length - 1) {
      setTimeout(() => {
        bannerRef.current?.scrollToIndex({
          index: 1,
          animated: false,
        });
        currentIndex.current = 1;
      }, 50);
    }
    // 첫번째 복제본(맨 앞)에 도달한 경우 -> 마지막 원본으로 이동
    else if (index <= 0) {
      setTimeout(() => {
        bannerRef.current?.scrollToIndex({
          index: originalBanners.length,
          animated: false,
        });
        currentIndex.current = originalBanners.length;
      }, 50);
    }

    // 스크롤 완전히 종료 후 즉시 자동 슬라이드 재개
    startAutoSlide();
  }, [finalBanners.length, originalBanners.length, startAutoSlide]);

  // 사용자가 스크롤 시작할 때
  const handleScrollBegin = useCallback(() => {
    stopAutoSlide();
  }, [stopAutoSlide]);

  useEffect(() => {
    // 초기 위치를 첫번째 원본으로 설정
    setTimeout(() => {
      bannerRef.current?.scrollToIndex({
        index: 1,
        animated: false,
      });
    }, 0);

    startAutoSlide();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startAutoSlide]);

  return (
    <View style={styles.bannerContainer}>
      <View style={bannerStyles.headerContainer}>
        <Text style={bannerStyles.headerTitle}>특가</Text>
        <Text style={bannerStyles.headerSubtitle}>
          동네방네에서 높은 할인 상품을 만나보세요!
        </Text>
      </View>
      <FlatList
        ref={bannerRef}
        data={finalBanners}
        keyExtractor={(item) => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        snapToAlignment="center"
        decelerationRate="fast"
        removeClippedSubviews={false}
        initialNumToRender={finalBanners.length}
        maxToRenderPerBatch={finalBanners.length}
        windowSize={10}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig.current}
        onScrollBeginDrag={handleScrollBegin}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        getItemLayout={(data, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.bannerSlide}
            onPress={() => {
              if (item.productCode) {
                router.push({
                  pathname: "/(cust)/sale-product-detail",
                  params: { productCode: item.productCode },
                });
              }
            }}
            activeOpacity={item.productCode ? 0.8 : 1}
          >
            <Image
              source={item.uri}
              style={styles.bannerImage}
              resizeMode="stretch"
            />
            {/* 상품 정보가 있는 경우에만 오버레이 표시 */}
            {item.productName && (
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.7)"]}
                style={bannerStyles.gradient}
              >
                <View style={bannerStyles.infoContainer}>
                  <Text style={bannerStyles.storeName} numberOfLines={1}>
                    {item.storeName}
                  </Text>
                  <Text style={bannerStyles.productName} numberOfLines={2}>
                    {item.productName}
                  </Text>
                  <View style={bannerStyles.priceContainer}>
                    {item.discount && (
                      <View style={bannerStyles.discountBadge}>
                        <Text style={bannerStyles.discountText}>
                          {item.saleType === "할인가" ? "약 " : ""}
                          {item.discount}%
                        </Text>
                      </View>
                    )}
                    <View style={bannerStyles.priceWrapper}>
                      {item.originalPrice && (
                        <Text style={bannerStyles.originalPrice}>
                          {item.originalPrice.toLocaleString()}원
                        </Text>
                      )}
                      {item.price && (
                        <Text style={bannerStyles.price}>
                          {item.price.toLocaleString()}원
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </LinearGradient>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const bannerStyles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    justifyContent: "flex-end",
  },
  infoContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  storeName: {
    color: "#fff",
    fontSize: 12,
    opacity: 0.9,
    marginBottom: 4,
  },
  productName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  discountBadge: {
    backgroundColor: "#EF7810",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 70,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
  },
  discountText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  priceWrapper: {
    flexDirection: "column",
    alignItems: "center",
  },
  originalPrice: {
    color: "#ccc",
    fontSize: 12,
    textDecorationLine: "line-through",
  },
  price: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
