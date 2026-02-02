import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import { Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./nego-product-detail.styles";
import { apiGet, apiPost } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";

interface ProductDetailResponse {
  productCode: string;
  productNm: string;
  storeCode: string;
  storeNm: string;
  description: string;
  price: number;
  stockQuantity: number;
  rating: number;
  reviewCnt: number;
  images: {
    files: Array<{
      fileUrl: string;
      originalName: string;
      order: number;
    }>;
  };
  details?: {
    origin?: string;
    weight?: string;
    expiryDate?: string;
    storage?: string;
    manufacturer?: string;
  };
}

interface Review {
  reviewCode: string;
  custNm: string;
  rate: number;
  regDt: string;
  content: string;
}

interface NegoProductDetailResponse {
  isNego: boolean;
  response: ProductDetailResponse & {
    reviews?: Review[];
  };
}

export default function ProductDetailScreen() {
  const { productCode } = useLocalSearchParams<{ productCode: string }>();
  const { custCode } = useAuth();
  const [tab, setTab] = useState<"description" | "reviews" | "details">(
    "description"
  );
  const [negoModalVisible, setNegoModalVisible] = useState(false);
  const [negoAmount, setNegoAmount] = useState("");
  const [productDetail, setProductDetail] = useState<NegoProductDetailResponse | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const insets = useSafeAreaInsets();

  // 백엔드에서 상품 상세 정보 조회
  useEffect(() => {
    if (!productCode) {
      setLoading(false);
      return;
    }

    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const response = await apiGet(`/cust/nego/${productCode}`);
        const data: NegoProductDetailResponse = await response.json();
        setProductDetail(data);
        if (data.response.reviews) {
          setReviews(data.response.reviews);
        }
      } catch (error) {
        console.error("상품 상세 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [productCode]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!productDetail) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 16, color: '#999' }}>상품 정보를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  const mockProduct = {
    id: productDetail.response.productCode,
    name: productDetail.response.productNm,
    storeName: productDetail.response.storeNm,
    category: "식품",
    originalPrice: productDetail.response.price,
    discountPrice: productDetail.response.price,
    discountRate: 0,
    remainingStock: productDetail.response.stockQuantity || 0,
    isAdult: false,
    rating: productDetail.response.rating || 0,
    reviewCount: productDetail.response.reviewCnt || 0,
    images: productDetail.response.images?.files?.map(img => ({ uri: img.fileUrl })) || [],
    description: productDetail.response.description || "상품 설명이 없습니다.",
    details: productDetail.response.details || {
      origin: "정보 없음",
      weight: "정보 없음",
      expiryDate: "정보 없음",
      storage: "정보 없음",
      manufacturer: "정보 없음",
    },
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
        <Text style={styles.title}>상품 상세</Text>
        <View style={styles.placeholder}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="share-social-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.productDetailContainer}>
        <Image
          source={
            mockProduct.images[0]
              ? { uri: typeof mockProduct.images[0] === 'object' ? mockProduct.images[0].uri : mockProduct.images[0] }
              : require("@/assets/images/products_soyun/cow.png")
          }
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
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <View key={review.reviewCode} style={styles.reviewItem}>
                      <View style={styles.reviewHeader}>
                        <Text style={styles.reviewUserName}>
                          {review.custNm}
                        </Text>
                        <View style={styles.reviewRating}>
                          {[...Array(5)].map((_, index) => (
                            <Ionicons
                              key={`star-${review.reviewCode}-${index}`}
                              name={
                                index < review.rate ? "star" : "star-outline"
                              }
                              size={14}
                              color="#FFD700"
                            />
                          ))}
                        </View>
                      </View>
                      <Text style={styles.reviewDate}>
                        {new Date(review.regDt).toLocaleDateString('ko-KR')}
                      </Text>
                      <Text style={styles.reviewContent}>{review.content}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={{ textAlign: 'center', color: '#999', marginTop: 20 }}>리뷰가 없습니다.</Text>
                )}
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
        <TouchableOpacity 
          style={styles.purchaseButton}
          onPress={() => setNegoModalVisible(true)}
        >
          <Text style={styles.purchaseButtonText}>네고 요청하기</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={negoModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setNegoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.negoModalContent}>
            <Text style={styles.negoModalTitle}>네고 요청</Text>
            
            <Text style={styles.negoModalLabel}>희망 금액</Text>
            <TextInput
              style={styles.negoInput}
              placeholder="금액을 입력하세요"
              keyboardType="numeric"
              value={negoAmount}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, '');
                setNegoAmount(numericText);
              }}
            />
            
            {negoAmount && (
              <Text style={styles.negoAmountDisplay}>
                {parseInt(negoAmount).toLocaleString()}원
              </Text>
            )}
            
            <View style={styles.negoModalButtons}>
              <TouchableOpacity
                style={[styles.negoModalButton, styles.negoConfirmButton]}
                disabled={requesting || !negoAmount}
                onPress={async () => {
                  if (!custCode || !productCode) {
                    Alert.alert('오류', '필요한 정보가 없습니다.');
                    return;
                  }

                  try {
                    setRequesting(true);
                    const response = await apiPost('/cust/nego', {
                      custCode,
                      productCode,
                      negoPrice: parseInt(negoAmount),
                    });

                    if (response.ok) {
                      Alert.alert('성공', '네고 요청이 완료되었습니다.');
                      setNegoModalVisible(false);
                      setNegoAmount('');
                    } else {
                      Alert.alert('오류', '네고 요청에 실패했습니다.');
                    }
                  } catch (error) {
                    console.error('네고 요청 실패:', error);
                    Alert.alert('오류', '네고 요청 중 오류가 발생했습니다.');
                  } finally {
                    setRequesting(false);
                  }
                }}
              >
                <Text style={styles.negoConfirmButtonText}>
                  {requesting ? '처리 중...' : '요청'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.negoModalButton, styles.negoCancelButton]}
                disabled={requesting}
                onPress={() => {
                  setNegoModalVisible(false);
                  setNegoAmount('');
                }}
              >
                <Text style={styles.negoCancelButtonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
