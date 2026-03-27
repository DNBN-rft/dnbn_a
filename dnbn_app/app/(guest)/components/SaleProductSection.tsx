import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useRef } from "react";
import {
  Animated,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../styles/guesthome.styles";

interface SaleProduct {
  id: string;
  uri: any;
  productName: string;
  storeName: string;
  discount: number;
  price: number;
}

interface SaleProductSectionProps {
  products: SaleProduct[];
}

export default function SaleProductSection({
  products,
}: SaleProductSectionProps) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const maxScrollX = useRef(new Animated.Value(9999)).current;
  const layoutWidth = useRef(0);
  const leftOpacity = useRef(
    scrollX.interpolate({
      inputRange: [0, 60],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
  ).current;
  const rightOpacity = useRef(
    Animated.subtract(maxScrollX, scrollX).interpolate({
      inputRange: [0, 60],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
  ).current;

  return (
    <View style={styles.contentSection}>
      <View style={sectionStyles.headerContainer}>
        <View style={sectionStyles.headerRow}>
          <Text style={sectionStyles.headerTitle}>할인</Text>
          <TouchableOpacity
            onPress={() => router.push("/(guest)/saleProductList")}
          >
            <Text style={sectionStyles.viewAllText}>+ 상품 전체 보기</Text>
          </TouchableOpacity>
        </View>
        <Text style={sectionStyles.headerSubtitle}>
          내 근처 할인 상품을 만나보세요!
        </Text>
      </View>
      {products.length === 0 ? (
        <View style={styles.emptyProductContainer}>
          <Ionicons name="cart-outline" size={40} color="#ccc" />
          <Text style={styles.emptyText}>주변에 등록된 할인 상품이 없어요</Text>
        </View>
      ) : (
        <View style={styles.productListWrapper}>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false },
            )}
            onContentSizeChange={(contentW) => {
              maxScrollX.setValue(Math.max(0, contentW - layoutWidth.current));
            }}
            onLayout={(e) => {
              layoutWidth.current = e.nativeEvent.layout.width;
            }}
            scrollEventThrottle={16}
            renderItem={({ item }) => (
              <Pressable
                style={styles.productCard}
                onPress={() =>
                  router.push(
                    `/(guest)/sale-product-detail?productCode=${item.id}`,
                  )
                }
              >
                {item.uri ? (
                  <Image source={item.uri} style={styles.productImage} />
                ) : (
                  <View
                    style={[
                      styles.productImage,
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
              </Pressable>
            )}
          />
          <Animated.View
            style={[styles.productFadeLeft, { opacity: leftOpacity }]}
            pointerEvents="none"
          >
            <LinearGradient
              colors={["rgba(255,255,255,0.95)", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1 }}
            />
          </Animated.View>
          <Animated.View
            style={[styles.productFadeRight, { opacity: rightOpacity }]}
            pointerEvents="none"
          >
            <LinearGradient
              colors={["transparent", "rgba(255,255,255,0.95)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1 }}
            />
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  viewAllText: {
    fontSize: 12,
    color: "#EF7810",
    fontWeight: "600",
    borderWidth: 1,
    borderColor: "#EF7810",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    overflow: "hidden",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
  },
});
