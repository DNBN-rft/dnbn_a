import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/custhome.styles";

interface NegoProduct {
  id: string;
  uri: any;
  productName: string;
  storeName: string;
  price: number;
}

interface NegoProductSectionProps {
  products: NegoProduct[];
}

export default function NegoProductSection({
  products,
}: NegoProductSectionProps) {
  return (
    <View style={styles.contentSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>네고왕</Text>
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
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={() => router.push("/(cust)/negoList")}
          >
            <Ionicons name="chevron-forward" size={28} color="#666" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
