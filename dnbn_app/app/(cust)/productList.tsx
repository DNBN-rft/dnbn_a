import { apiGet } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./productlist.styles";

type FilterType = "distance" | "price" | "rating" | null;

// API 응답 타입 정의
interface ProductImage {
  originalName: string;
  fileUrl: string;
  order: number;
}

interface Product {
  storeNm: string;
  productCode: string;
  productNm: string;
  price: number;
  rate: number;
  reviewCnt: number;
  productImg: ProductImage | null;
}

export default function ProductListScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const [productList, setProductList] = useState<Product[]>([]);

  // API 호출: 일반상품 목록 불러오기
  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const custCode = "CUST_001"; // 하드코딩된 고객 코드
        const response = await apiGet(`/cust/regular?custCode=${custCode}`);

        if (response.ok) {
          const data = await response.json();
          setProductList(data);
        } else {
          console.error("API 요청 실패:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("일반상품 목록 불러오기 실패:", error);
      }
    };

    fetchProductList();
  }, []);

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#fff" }} />
      )}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>일반 상품</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === "distance" && styles.filterButtonActive,
          ]}
          onPress={() => setActiveFilter("distance")}
        >
          <Text
            style={[
              styles.filterButtonText,
              activeFilter === "distance" && styles.filterButtonTextActive,
            ]}
          >
            거리순
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === "price" && styles.filterButtonActive,
          ]}
          onPress={() => setActiveFilter("price")}
        >
          <Text
            style={[
              styles.filterButtonText,
              activeFilter === "price" && styles.filterButtonTextActive,
            ]}
          >
            가격순
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === "rating" && styles.filterButtonActive,
          ]}
          onPress={() => setActiveFilter("rating")}
        >
          <Text
            style={[
              styles.filterButtonText,
              activeFilter === "rating" && styles.filterButtonTextActive,
            ]}
          >
            평점순
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => setActiveFilter(null)}
        >
          <Ionicons name="refresh-outline" size={18} color="#666" />
          <Text style={styles.resetButtonText}>초기화</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={productList}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.productCode}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.listItemWrapper}>
            <TouchableOpacity
              style={styles.productItemContainer}
              onPress={() =>
                router.push({
                  pathname: "/(cust)/product-detail",
                  params: { productCode: item.productCode },
                })
              }
            >
              <Image
                resizeMode="stretch"
                source={
                  item.productImg?.fileUrl
                    ? { uri: item.productImg.fileUrl }
                    : require("@/assets/images/image1.jpg")
                }
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text
                  style={styles.storeName}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.storeNm}
                </Text>
                <Text
                  style={styles.productName}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.productNm}
                </Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceText}>
                    {item.price.toLocaleString()}원
                  </Text>
                </View>
                <Text style={styles.reviewText}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  {item.rate.toFixed(1)}({item.reviewCnt})
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      ></FlatList>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
