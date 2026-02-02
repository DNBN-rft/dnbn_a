import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "../storeInfo.styles";
import type { Product } from "../types/storeInfo.types";

interface ProductCardProps {
  item: Product;
  productCode?: string;
}

export function ProductCard({ item, productCode }: ProductCardProps) {
  const code = productCode || item.productCode;
  
  return (
    <Pressable
      style={styles.storeProductItemContainer}
      onPress={() =>
        router.push({
          pathname: "/(cust)/product-detail",
          params: { productCode: code },
        })
      }
    >
      {item.productImage?.files?.[0]?.fileUrl ? (
        <Image
          resizeMode="cover"
          source={{ uri: item.productImage.files[0].fileUrl }}
          style={styles.storeProductImgContainer}
        />
      ) : (
        <View
          style={[styles.storeProductImgContainer, styles.placeholderImage]}
        >
          <Ionicons name="image-outline" size={40} color="#ccc" />
        </View>
      )}
      <Text style={styles.storeProductNmText} numberOfLines={2}>
        {item.productNm}
      </Text>
      <Text style={styles.priceText}>
        {item.productPrice.toLocaleString()}원
      </Text>
      <Text style={styles.productRatingText}>
        <Ionicons name="star" size={13} color="#FFD700" />{" "}
        {item.averageReviewRating.toFixed(1)} ({item.reviewCount})
      </Text>
    </Pressable>
  );
}
