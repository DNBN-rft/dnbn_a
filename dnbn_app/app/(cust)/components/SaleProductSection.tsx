import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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
  return (
    <View style={styles.contentSection}>
      <View style={sectionStyles.headerContainer}>
        <Text style={sectionStyles.headerTitle}>할인</Text>
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
            renderItem={({ item }) => (
              <Pressable
                style={styles.productCard}
                onPress={() =>
                  router.push(
                    `/(cust)/sale-product-detail?productCode=${item.id}`,
                  )
                }
              >
                {item.uri ? (
                  <Image source={item.uri} style={styles.productImage} />
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
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={() => router.push("/(cust)/saleProductList")}
          >
            <Ionicons name="chevron-forward" size={28} color="#666" />
          </TouchableOpacity>
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
});
