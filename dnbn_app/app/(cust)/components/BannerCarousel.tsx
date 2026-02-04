import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useRef } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { styles } from "../styles/custhome.styles";

const screenWidth = Dimensions.get("window").width;

interface BannerItem {
  id: string;
  uri: any;
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
  const currentIndex = useRef(0);

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
    }, 3000);

    return () => clearInterval(interval);
  }, [banners.length]);

  return (
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
          </View>
        )}
      />
    </View>
  );
}

const bannerStyles = StyleSheet.create({
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
    paddingBottom: 20,
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
    width: 70,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 4,
  },
  discountText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
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
