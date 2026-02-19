import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./nego-history-detail.styles";

export default function NegoHistoryDetailPage() {
  const insets = useSafeAreaInsets();

  // Mock 데이터
  const negoHistoryDetail = {
    status: "완료", // "완료" | "삭제"
    registrationDate: "2024.01.12",
    images: [
      require("@/assets/images/image1.jpg"),
      require("@/assets/images/logo.png"),
      require("@/assets/images/qr.png"),
    ],
    categoryName: "음료",
    productName: "아메리카노",
    price: 4500,
    stock: 20,
    description:
      "고급 원두로 만든 프리미엄 아메리카노입니다.\n깊고 진한 커피 향이 일품입니다.",
    negoStartDate: "2024.01.10 10:00",
    negoEndDate: "2024.01.12 10:00",
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 이전 이미지
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? negoHistoryDetail.images.length - 1 : prev - 1,
    );
  };

  // 다음 이미지
  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === negoHistoryDetail.images.length - 1 ? 0 : prev + 1,
    );
  };

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

        <Text style={styles.title}>네고 이력 상세</Text>
        <View style={styles.placeholder}></View>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.productDetailContainer}>
          <View style={styles.contentRow}>
            <View style={styles.productImagesContainer}>
              <View style={styles.productMetaContainer}>
                <Text style={styles.productStatus}>
                  {negoHistoryDetail.status}
                </Text>
                <Text style={styles.registrationDate}>
                  등록일: {negoHistoryDetail.registrationDate}
                </Text>
              </View>

              <View style={styles.mainImageContainer}>
                <TouchableOpacity
                  style={styles.mainImageButton}
                  onPress={handlePrevImage}
                >
                  <Ionicons name="chevron-back" size={24} color="#666" />
                </TouchableOpacity>

                <Image
                  style={styles.productMainImage}
                  source={negoHistoryDetail.images[currentImageIndex]}
                  resizeMode="contain"
                />

                <TouchableOpacity
                  style={styles.mainImageButton}
                  onPress={handleNextImage}
                >
                  <Ionicons name="chevron-forward" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.productSubImages}>
                {negoHistoryDetail.images.map((image, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setCurrentImageIndex(index)}
                  >
                    <Image
                      style={[
                        styles.productSubImage,
                        currentImageIndex === index && {
                          borderWidth: 2,
                          borderColor: "#007AFF",
                        },
                      ]}
                      source={image}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.productInfoContainer}>
              <Text style={styles.categoryName}>
                {negoHistoryDetail.categoryName}
              </Text>
              <Text style={styles.productName}>
                {negoHistoryDetail.productName}
              </Text>
              <Text style={styles.productPrice}>
                ₩ {negoHistoryDetail.price.toLocaleString()}
              </Text>
              <Text style={styles.productStock}>
                재고: {negoHistoryDetail.stock}개
              </Text>
              <Text style={styles.productDescription}>
                {negoHistoryDetail.description}
              </Text>
            </View>
          </View>

          <View style={styles.productStatusContainer}>
            <View style={styles.statusInfoRow}>
              <Text style={styles.statusInfoTitle}>네고 기간</Text>
              <Text style={styles.statusInfoContent}>
                {negoHistoryDetail.negoStartDate} ~{" "}
                {negoHistoryDetail.negoEndDate}
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
