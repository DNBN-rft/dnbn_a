import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./discounthistory.styles";

export default function DiscountHistoryPage() {
  const insets = useSafeAreaInsets();

  const discountHistory = [
    { 
      id: "1", 
      uri: require("@/assets/images/image1.jpg"), 
      category: "전자제품", 
      productName: "무선 이어폰", 
      originalPrice: 89000,
      discountRate: 20,
      discountedPrice: 17800,
      finalPrice: 71200,
      status: "완료",
      startTime: "2024.01.10 10:00",
      endTime: "2024.01.12 23:59"
    },
    { 
      id: "2", 
      uri: require("@/assets/images/image1.jpg"), 
      category: "의류", 
      productName: "겨울 패딩 점퍼", 
      originalPrice: 150000,
      discountAmount: 30000,
      discountedPrice: 30000,
      finalPrice: 120000,
      status: "완료",
      startTime: "2024.01.08 09:00",
      endTime: "2024.01.11 18:00"
    },
    { 
      id: "3", 
      uri: require("@/assets/images/image1.jpg"), 
      category: "식품", 
      productName: "프리미엄 과일 세트", 
      originalPrice: 50000,
      discountRate: 15,
      discountedPrice: 7500,
      finalPrice: 42500,
      status: "취소",
      startTime: "2024.01.05 00:00",
      endTime: "2024.01.07 23:59"
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
        <Text style={styles.title}>할인 내역</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={discountHistory}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.discountProduct}>
            <View style={styles.productContainer}>
              <View style={styles.productImageContainer}>
                <Image
                  style={styles.productImage}
                  source={item.uri} 
                />
              </View>
  
              <View style={styles.productInfoContainer}>
                <View>
                  <Text style={styles.categoryText}>{item.category}</Text>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.productNameText}
                  >{item.productName}</Text>
                </View>
                
                <View style={styles.priceContainer}>
                  <Text style={styles.originalPriceText}>
                    {item.originalPrice.toLocaleString()}원
                  </Text>

                  <View style={styles.discountAndFinalRow}>
                    <Text style={styles.discountRateText}>
                      {item.discountRate 
                        ? `${item.discountRate}%` 
                        : `${item.discountAmount?.toLocaleString()}원`}
                    </Text>
                    <Text style={styles.divider}>|</Text>
                    <Text style={styles.finalPriceText}>
                      {item.finalPrice.toLocaleString()}원
                    </Text>
                  </View>

                  <Text style={[
                    styles.statusText,
                    item.status === '완료' ? styles.statusComplete : styles.statusCanceled
                  ]}>
                    {item.status}
                  </Text>
                </View>
              </View>
            </View>
  
            <View style={styles.detailButtonContainer}>
              <TouchableOpacity 
                style={styles.detailButton}
                onPress={() => router.push({
                  pathname: "/(store)/discountdetail",
                  params: { id: item.id }
                })}
              >
                <Text style={styles.detailButtonText}>상세</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
