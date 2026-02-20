import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./discountdetail.styles";

export default function DiscountDetailPage() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();

  // 실제로는 id를 기반으로 서버에서 데이터를 가져옴
  const discountData = {
    category: "전자제품",
    productName: "고급 무선 이어폰",
    originalPrice: 89000,
    discountRate: 20,
    discountedPrice: 17800,
    finalPrice: 71200,
    stock: 15,
    status: "완료",
    startTime: "2024.01.10 10:00",
    endTime: "2024.01.12 23:59",
    registrationDate: "2024.01.10",
    description:
      "고음질 사운드를 제공하는 프리미엄 무선 이어폰입니다.\n노이즈 캔슬링 기능과 긴 배터리 수명을 자랑합니다.",
    images: [
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/80",
      "https://via.placeholder.com/80",
      "https://via.placeholder.com/80",
    ],
  };

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#fff" }} />
      )}

      <View style={styles.header}>
        <View style={styles.leftSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.centerSection}>
          <Text style={styles.title}>할인 상세</Text>
        </View>
        <View style={styles.rightSection} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.productDetailContainer}>
          <View style={styles.contentRow}>
            <View style={styles.productImagesContainer}>
              <View style={styles.productMetaContainer}>
                <Text
                  style={[
                    styles.productStatus,
                    discountData.status === "완료"
                      ? styles.statusComplete
                      : styles.statusCanceled,
                  ]}
                >
                  {discountData.status}
                </Text>
                <Text style={styles.registrationDate}>
                  등록일: {discountData.registrationDate}
                </Text>
              </View>

              <View style={styles.mainImageContainer}>
                <TouchableOpacity
                  style={styles.mainImageButton}
                  onPress={() => {
                    /* 이전 이미지 함수 */
                  }}
                >
                  <Ionicons name="chevron-back" size={24} color="#666" />
                </TouchableOpacity>

                <Image
                  style={styles.productMainImage}
                  source={{ uri: discountData.images[0] }}
                />

                <TouchableOpacity
                  style={styles.mainImageButton}
                  onPress={() => {
                    /* 다음 이미지 함수 */
                  }}
                >
                  <Ionicons name="chevron-forward" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.productSubImages}>
                {discountData.images.slice(1).map((uri, index) => (
                  <Image
                    key={index}
                    style={styles.productSubImage}
                    source={{ uri }}
                  />
                ))}
              </View>
            </View>

            <View style={styles.productInfoContainer}>
              <Text style={styles.categoryName}>{discountData.category}</Text>
              <Text style={styles.productName}>{discountData.productName}</Text>

              <View style={styles.priceInfoContainer}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>원가:</Text>
                  <Text style={styles.originalPrice}>
                    ₩ {discountData.originalPrice.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>할인:</Text>
                  <Text style={styles.discountRate}>
                    {discountData.discountRate}%
                  </Text>
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>할인 금액:</Text>
                  <Text style={styles.discountAmount}>
                    -₩ {discountData.discountedPrice.toLocaleString()}
                  </Text>
                </View>

                <View style={[styles.priceRow, styles.finalPriceRow]}>
                  <Text style={styles.finalPriceLabel}>최종 금액:</Text>
                  <Text style={styles.finalPrice}>
                    ₩ {discountData.finalPrice.toLocaleString()}
                  </Text>
                </View>
              </View>

              <Text style={styles.productStock}>
                재고: {discountData.stock}개
              </Text>
              <Text style={styles.productDescription}>
                {discountData.description}
              </Text>
            </View>
          </View>

          <View style={styles.productStatusContainer}>
            <View style={styles.statusInfoRow}>
              <Text style={styles.statusInfoTitle}>할인 기간</Text>
              <Text style={styles.statusInfoContent}>
                {discountData.startTime} ~ {discountData.endTime}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
