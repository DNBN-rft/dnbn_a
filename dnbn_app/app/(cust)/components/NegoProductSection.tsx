import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../styles/custhome.styles";

interface NegoProduct {
  id: string;
  uri: any;
  productName: string;
  storeName: string;
}

interface NegoProductSectionProps {
  products: NegoProduct[];
}

export default function NegoProductSection({
  products,
}: NegoProductSectionProps) {
  const [scrolledToEnd, setScrolledToEnd] = useState(false);
  const [scrolledFromStart, setScrolledFromStart] = useState(false);

  return (
    <View style={styles.contentSection}>
      <View style={sectionStyles.headerContainer}>
        <View style={sectionStyles.headerRow}>
          <Text style={sectionStyles.headerTitle}>네고</Text>
          <TouchableOpacity onPress={() => router.push("/(cust)/negoList")}>
            <Text style={sectionStyles.viewAllText}>+ 상품 전체 보기</Text>
          </TouchableOpacity>
        </View>
        <Text style={sectionStyles.headerSubtitle}>
          내 주변 상품을 가격 협상으로 더 저렴하게 구매하세요!
        </Text>
      </View>
      {products.length === 0 ? (
        <View style={styles.emptyProductContainer}>
          <Ionicons name="cart-outline" size={40} color="#ccc" />
          <Text style={styles.emptyText}>주변에 등록된 네고 상품이 없어요</Text>
        </View>
      ) : (
        <View style={styles.productListWrapper}>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
              setScrolledToEnd(contentOffset.x + layoutMeasurement.width >= contentSize.width - 4);
              setScrolledFromStart(contentOffset.x > 4);
            }}
            scrollEventThrottle={16}
            renderItem={({ item }) => (
              <Pressable
                style={styles.productCard}
                onPress={() =>
                  router.push(
                    `/(cust)/nego-product-detail?productCode=${item.id}`,
                  )
                }
              >
                {item.uri ? (
                  <Image
                    source={
                      typeof item.uri === "string" ? { uri: item.uri } : item.uri
                    }
                    style={styles.productImage}
                  />
                ) : (
                  <View
                    style={[
                      styles.productImage,
                      { backgroundColor: "#f0f0f0", justifyContent: "center", alignItems: "center" },
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
                </View>
              </Pressable>
            )}
          />
          {scrolledFromStart && (
            <LinearGradient
              colors={["rgba(255,255,255,0.95)", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              pointerEvents="none"
              style={styles.productFadeLeft}
            />
          )}
          {!scrolledToEnd && (
            <LinearGradient
              colors={["transparent", "rgba(255,255,255,0.95)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              pointerEvents="none"
              style={styles.productFadeRight}
            />
          )}
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
