import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./product-detail.styles";

export default function ProductDetailScreen() {
  const [tab, setTab] = useState<"description" | "reviews" | "details">(
    "description"
  );
  const insets = useSafeAreaInsets();

  // Mock 데이터
  const mockProduct = {
    id: "1",
    name: "프리미엄 한우 세트",
    storeName: "정육점 한우마을",
    category: "식품 > 육류",
    originalPrice: 50000,
    discountPrice: 40000,
    discountRate: 20,
    remainingStock: 15,
    isAdult: true,
    rating: 4.5,
    reviewCount: 200,
    images: [
      require("@/assets/images/products_soyun/cow.png"),
      require("@/assets/images/products_soyun/cow.png"),
    ],
    description:
      "신선한 한우를 저렴한 가격에 만나보세요. 1등급 한우 등심, 안심, 갈비살이 포함된 프리미엄 세트입니다. 냉장 배송으로 신선함을 그대로 전달합니다.",
    details: {
      origin: "국내산 한우",
      weight: "1.5kg",
      expiryDate: "제조일로부터 5일",
      storage: "냉장보관 (0~10℃)",
      manufacturer: "한우마을 정육점",
    },
  };

  const mockReviews = [
    {
      id: "1",
      userName: "김**",
      rating: 5,
      date: "2024.01.10",
      content: "고기가 정말 신선하고 맛있어요! 가족들이 모두 만족했습니다.",
      images: [],
    },
    {
      id: "2",
      userName: "이**",
      rating: 4,
      date: "2024.01.08",
      content: "품질 좋고 가격도 합리적입니다. 다음에도 구매할 예정이에요.",
      images: [],
    },
    {
      id: "3",
      userName: "박**",
      rating: 5,
      date: "2024.01.05",
      content: "배송도 빠르고 포장도 꼼꼼해요. 재구매 의사 100%!",
      images: [],
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
        <Text style={styles.title}>상품 상세</Text>
        <View style={styles.placeholder}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="share-social-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.productDetailContainer}>
        <Image
          source={mockProduct.images[0]}
          style={styles.productImage}
          resizeMode="cover"
        />

        <View style={styles.productDetailInfoContainer}>
          <TouchableOpacity style={styles.storeNameContainer}>
            <Text style={styles.storeName}>{mockProduct.storeName}</Text>
            
            <Ionicons name="home-outline" size={16} color="#999" />
          </TouchableOpacity>

          <View style={styles.nameContainer}>
            <Text style={styles.categoryText}>{mockProduct.category}</Text>
            
            <Text style={styles.productName}>{mockProduct.name}</Text>

            {mockProduct.isAdult && (
              <View style={styles.adultTag}>
                <Text style={styles.adultTagText}>성인</Text>
              </View>
            )}
          </View>

          <View style={styles.priceAndStockContainer}>
            <View style={styles.priceContainer}>
              <Text style={styles.discountPrice}>
                {mockProduct.discountPrice.toLocaleString()}원
              </Text>
            </View>

            <View style={styles.stockContainer}>
              <Text style={styles.stockText}>
                수량: {mockProduct.remainingStock}개
              </Text>
            </View>
          </View>

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            
            <Text style={styles.ratingText}>
              {mockProduct.rating} ({mockProduct.reviewCount})
            </Text>
          </View>
        </View>

        {tab === "description" && (
          <View style={styles.tabsContainer}>
            <View style={styles.tabs}>
              <TouchableOpacity
                style={[styles.tab, styles.activeTab]}
                onPress={() => setTab("description")}
              >
                <Text style={[styles.tabText, styles.activeTabText]}>설명</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.tab}
                onPress={() => setTab("reviews")}
              >
                <Text style={styles.tabText}>리뷰</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.tab}
                onPress={() => setTab("details")}
              >
                <Text style={styles.tabText}>상세정보</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.tabContentContainer}>
              <View style={styles.descriptionContent}>
                <Text style={styles.tabContent}>{mockProduct.description}</Text>
              </View>
            </View>
          </View>
        )}

        {tab === "reviews" && (
          <View style={styles.tabsContainer}>
            <View style={styles.tabs}>
              <TouchableOpacity
                style={styles.tab}
                onPress={() => setTab("description")}
              >
                <Text style={styles.tabText}>설명</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tab, styles.activeTab]}
                onPress={() => setTab("reviews")}
              >
                <Text style={[styles.tabText, styles.activeTabText]}>리뷰</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.tab}
                onPress={() => setTab("details")}
              >
                <Text style={styles.tabText}>상세정보</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.tabContentContainer}>
              <View style={styles.reviewsContent}>
                {mockReviews.map((review) => (
                  <View key={review.id} style={styles.reviewItem}>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewUserName}>
                        {review.userName}
                      </Text>
                      <View style={styles.reviewRating}>
                        {[...Array(5)].map((_, index) => (
                          <Ionicons
                            key={index}
                            name={
                              index < review.rating ? "star" : "star-outline"
                            }
                            size={14}
                            color="#FFD700"
                          />
                        ))}
                      </View>
                    </View>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                    <Text style={styles.reviewContent}>{review.content}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {tab === "details" && (
          <View style={styles.tabsContainer}>
            <View style={styles.tabs}>
              <TouchableOpacity
                style={styles.tab}
                onPress={() => setTab("description")}
              >
                <Text style={styles.tabText}>설명</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.tab}
                onPress={() => setTab("reviews")}
              >
                <Text style={styles.tabText}>리뷰</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tab, styles.activeTab]}
                onPress={() => setTab("details")}
              >
                <Text style={[styles.tabText, styles.activeTabText]}>
                  상세정보
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.tabContentContainer}>
              <View style={styles.detailsContent}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>원산지</Text>
                  <Text style={styles.detailValue}>
                    {mockProduct.details.origin}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>중량</Text>
                  <Text style={styles.detailValue}>
                    {mockProduct.details.weight}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>유통기한</Text>
                  <Text style={styles.detailValue}>
                    {mockProduct.details.expiryDate}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>보관방법</Text>
                  <Text style={styles.detailValue}>
                    {mockProduct.details.storage}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>제조사</Text>
                  <Text style={styles.detailValue}>
                    {mockProduct.details.manufacturer}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.cartButton}>
          <Ionicons name="cart-outline" size={24} color="#EF7810" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.purchaseButton}>
          <Text style={styles.purchaseButtonText}>구매하기</Text>
        </TouchableOpacity>
      </View>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
