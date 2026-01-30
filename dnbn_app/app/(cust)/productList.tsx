import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./productlist.styles";

type FilterType = "distance" | "price" | "rating" | null;

export default function ProductListScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);

  const productList = [
    {
      id: "1",
      uri: require("@/assets/images/normalproduct/bread.jpg"),
      productName: "슈크림 붕어빵",
      storeName: "황금잉어빵",
      price: 8000,
      review: "4.8(120)",
    },
    {
      id: "2",
      uri: require("@/assets/images/normalproduct/gogi.jpg"),
      productName: "고기",
      storeName: "행복마트",
      price: 12000,
      review: "4.5(80)",
    },
    {
      id: "3",
      uri: require("@/assets/images/normalproduct/gogi2.jpg"),
      productName: "삼겹살",
      storeName: "프레시마켓",
      price: 5000,
      review: "4.7(200)",
    },
    {
      id: "4",
      uri: require("@/assets/images/normalproduct/gogi3.jpg"),
      productName: "가정식",
      storeName: "맛있는 집",
      price: 6000,
      review: "4.6(150)",
    },
    {
      id: "5",
      uri: require("@/assets/images/normalproduct/pizza.jpg"),
      productName: "피자",
      storeName: "행복마트",
      price: 15000,
      review: "4.9(90)",
    },
  ];

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
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.listItemWrapper}>
            <TouchableOpacity
              style={styles.productItemContainer}
              onPress={() => router.push("/(cust)/product-detail")}
            >
              <Image
                resizeMode="stretch"
                source={item.uri}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.storeName}>{item.storeName}</Text>
                <Text style={styles.productName}>{item.productName}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceText}>
                    {item.price.toLocaleString()}원
                  </Text>
                </View>
                <Text style={styles.reviewText}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  {item.review}
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
