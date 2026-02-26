import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../styles/custhome.styles";

interface RegularProduct {
  id: string;
  uri: any;
  productName: string;
  storeName: string;
  price: number;
}

interface RegularProductSectionProps {
  products: RegularProduct[];
}

export default function RegularProductSection({
  products,
}: RegularProductSectionProps) {
  return (
    <View style={styles.contentSection}>
      <View style={sectionStyles.headerContainer}>
        <Text style={sectionStyles.headerTitle}>일반 상품</Text>
        <Text style={sectionStyles.headerSubtitle}>
          동네방네에 등록된 다양한 상품을 둘러보세요!
        </Text>
      </View>
      {products.length === 0 ? (
        <View style={styles.emptyProductContainer}>
          <Ionicons name="cart-outline" size={40} color="#ccc" />
          <Text style={styles.emptyText}>주변에 등록된 상품이 없어요</Text>
        </View>
      ) : (
        <View style={styles.productListWrapper}>
          <FlatList
            data={products}
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
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={() => router.push("/(cust)/productList")}
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
