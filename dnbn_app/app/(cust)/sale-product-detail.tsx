import { apiGet, apiPost } from "@/utils/api";
import CartAddModal from "@/components/modal/CartAddModal";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./sale-product-detail.styles";

interface ReviewItem {
  regNm: string;
  reviewContent: string;
  reviewRegDate: string;
  reviewRate: number;
  reviewAnswerContent: string | null;
}

interface ProductImageFile {
  originalName: string;
  fileUrl: string;
  order: number;
}

interface SaleProductDetailResponse {
  isSale: boolean;
  discountPrice: number;
  response: {
    storeCode: string;
    productCode: string;
    storeNm: string;
    productNm: string;
    categoryNm: string;
    price: number;
    reviewRate: number;
    reviewCnt: number;
    productAmount: number;
    isStock: boolean;
    isAdult: boolean;
    description: string;
    reviewList: ReviewItem[];
    productImgs: {
      files: ProductImageFile[];
    };
  };
}

export default function ProductDetailScreen() {
  const { productCode } = useLocalSearchParams();
  const [tab, setTab] = useState<"description" | "reviews" | "details">(
    "description",
  );
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] =
    useState<SaleProductDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [cartModalVisible, setCartModalVisible] = useState(false);

  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!productCode) {
        setError("등록된 상품 정보가 없습니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await apiGet(`/cust/sales/${productCode}`);

        if (!response.ok) {
          throw new Error("상품 정보를 불러오는데 실패했습니다.");
        }

        const data = await response.json();
        setProductData(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "알 수 없는 오류가 발생했습니다.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [productCode]);

  // 장바구니 추가 핸들러
  const handleAddToCart = async (quantity: number) => {
    
    if (!productData) {
      Alert.alert("오류", "상품 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      const response = await apiPost(`/cust/cart`, {
        productCode: productData.response.productCode,
        storeCode: productData.response.storeCode,
        quantity,
        price: productData.response.price,
        discountPrice: productData.discountPrice || 0,
      });

      if (response.ok) {
        Alert.alert(
          "성공",
          "장바구니에 상품을 추가했습니다.",
          [
            {
              text: "쇼핑 계속하기",
              onPress: () => {},
            },
            {
              text: "장바구니 가기",
              onPress: () => router.push("/(cust)/cart"),
            },
          ],
        );
      } else {
        const errorData = await response.json();
        Alert.alert("오류", errorData.message || "장바구니 추가에 실패했습니다.");
      }
    } catch (error) {
      console.error("장바구니 추가 오류:", error);
      Alert.alert("오류", "장바구니 추가 중 오류가 발생했습니다.");
      throw error;
    }
  };

  // API 데이터가 없으면 렌더링하지 않음
  if (!productData) return null;

  const product = productData.response;
  const discountRate =
    product.price > 0
      ? Math.round(
          ((product.price - productData.discountPrice) / product.price) * 100,
        )
      : 0;

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

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B00" />
          <Text style={styles.loadingText}>상품 정보를 불러오는 중...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => router.back()}
          >
            <Text style={styles.errorButtonText}>돌아가기</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.productDetailContainer}>
          {/* 이미지 슬라이더 */}
          <View style={styles.imageSliderContainer}>
            <FlatList
              data={product.productImgs?.files || []}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(event) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / screenWidth,
                );
                setCurrentImageIndex(index);
              }}
              scrollEventThrottle={16}
              keyExtractor={(item, index) => `image-${index}`}
              renderItem={({ item, index }) => (
                <Pressable
                  onPress={() => {
                    setSelectedImageIndex(index);
                    setImageModalVisible(true);
                  }}
                >
                  <Image
                    source={
                      item.fileUrl
                        ? { uri: item.fileUrl }
                        : require("@/assets/images/logo.png")
                    }
                    style={[styles.productImage, { width: screenWidth }]}
                    resizeMode="cover"
                  />
                </Pressable>
              )}
            />

            {/* 페이지네이션 인디케이터 */}
            {product.productImgs?.files &&
              product.productImgs.files.length > 1 && (
                <View style={styles.paginationContainer}>
                  {product.productImgs.files.map((_, index) => (
                    <View
                      key={`dot-${index}`}
                      style={[
                        styles.paginationDot,
                        currentImageIndex === index &&
                          styles.paginationDotActive,
                      ]}
                    />
                  ))}
                </View>
              )}
          </View>

          {/* 이미지 확대 모달 */}
          <Modal
            visible={imageModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setImageModalVisible(false)}
          >
            <View style={styles.imageModalContainer}>
              <TouchableOpacity
                style={styles.imageModalCloseButton}
                onPress={() => setImageModalVisible(false)}
              >
                <Ionicons name="close" size={32} color="#fff" />
              </TouchableOpacity>

              <FlatList
                data={product.productImgs?.files || []}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                initialScrollIndex={selectedImageIndex}
                onMomentumScrollEnd={(event) => {
                  const index = Math.round(
                    event.nativeEvent.contentOffset.x / screenWidth,
                  );
                  setSelectedImageIndex(index);
                }}
                getItemLayout={(data, index) => ({
                  length: screenWidth,
                  offset: screenWidth * index,
                  index,
                })}
                keyExtractor={(item, index) => `modal-image-${index}`}
                renderItem={({ item }) => (
                  <View style={styles.imageModalSlide}>
                    <Image
                      source={
                        item.fileUrl
                          ? { uri: item.fileUrl }
                          : require("@/assets/images/logo.png")
                      }
                      style={styles.imageModalImage}
                      resizeMode="contain"
                    />
                  </View>
                )}
              />

              <View style={styles.imageModalCounter}>
                <Text style={styles.imageModalCounterText}>
                  {selectedImageIndex + 1} /{" "}
                  {product.productImgs?.files?.length || 0}
                </Text>
              </View>
            </View>
          </Modal>

          <View style={styles.productDetailInfoContainer}>
            <Pressable
              style={styles.storeNameContainer}
              onPress={() => {
                router.push({
                  pathname: "/(cust)/storeInfo",
                  params: { storeCode: product.storeCode },
                });
              }}
            >
              <Text style={styles.storeName}>{product.storeNm}</Text>

              <Ionicons name="home-outline" size={16} color="#999" />
            </Pressable>

            <View style={styles.nameContainer}>
              <Text style={styles.categoryText}>{product.categoryNm}</Text>

              <Text style={styles.productName}>{product.productNm}</Text>

              {product.isAdult && (
                <View style={styles.adultTag}>
                  <Text style={styles.adultTagText}>성인</Text>
                </View>
              )}
            </View>

            <View style={styles.priceAndStockContainer}>
              <View style={styles.priceContainer}>
                <View style={styles.discountPriceContainer}>
                  <Text style={styles.originalPrice}>
                    {product.price.toLocaleString()}원
                  </Text>

                  <Text style={styles.discountRate}>{discountRate}%</Text>
                </View>

                <Text style={styles.discountPrice}>
                  {productData.discountPrice.toLocaleString()}원
                </Text>
              </View>

              <View style={styles.stockContainer}>
                <Text style={styles.stockText}>
                  재고: {product.productAmount}개
                </Text>
              </View>
            </View>

            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />

              <Text style={styles.ratingText}>
                {product.reviewRate.toFixed(1)} ({product.reviewCnt})
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
                  <Text style={[styles.tabText, styles.activeTabText]}>
                    설명
                  </Text>
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
                  <Text style={styles.tabContent}>{product.description}</Text>
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
                  <Text style={[styles.tabText, styles.activeTabText]}>
                    리뷰
                  </Text>
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
                  {product.reviewList && product.reviewList.length > 0 ? (
                    product.reviewList.map((review, index) => (
                      <View key={index} style={styles.reviewItem}>
                        <View style={styles.reviewHeader}>
                          <Text style={styles.reviewUserName}>
                            {review.regNm}
                          </Text>
                          <View style={styles.reviewRating}>
                            {[...Array(5)].map((_, starIndex) => (
                              <Ionicons
                                key={starIndex}
                                name={
                                  starIndex < review.reviewRate
                                    ? "star"
                                    : "star-outline"
                                }
                                size={14}
                                color="#FFD700"
                              />
                            ))}
                          </View>
                        </View>
                        <Text style={styles.reviewDate}>
                          {review.reviewRegDate}
                        </Text>
                        <Text style={styles.reviewContent}>
                          {review.reviewContent}
                        </Text>
                        {review.reviewAnswerContent && (
                          <View style={styles.reviewAnswerContainer}>
                            <Text style={styles.reviewAnswerLabel}>
                              판매자 답변
                            </Text>
                            <Text style={styles.reviewAnswerText}>
                              {review.reviewAnswerContent}
                            </Text>
                          </View>
                        )}
                      </View>
                    ))
                  ) : (
                    <View style={styles.noReviewsContainer}>
                      <Ionicons name="chatbox-outline" size={48} color="#ccc" />
                      <Text style={styles.noReviewsText}>
                        등록된 리뷰가 없습니다
                      </Text>
                    </View>
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
                    <Text style={styles.detailLabel}>상품고시정보</Text>
                    <Ionicons name="chevron-down" size={20} color="#666" />
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>
                      취소/환불 정책 및 방법
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#666" />
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>
                      거래 조건에 관한 정보
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#666" />
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>구매 시 주의사항</Text>
                    <Ionicons name="chevron-down" size={20} color="#666" />
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      )}

      {!loading && !error && (
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => setCartModalVisible(true)}
          >
            <Ionicons name="cart-outline" size={24} color="#EF7810" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.purchaseButton}>
            <Text style={styles.purchaseButtonText}>구매하기</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 장바구니 추가 모달 */}
      {productData && (
        <CartAddModal
          visible={cartModalVisible}
          productName={productData.response.productNm}
          productCode={productData.response.productCode}
          storeCode={productData.response.storeCode}
          price={productData.response.price}
          stock={productData.response.productAmount}
          onClose={() => setCartModalVisible(false)}
          onAddToCart={handleAddToCart}
        />
      )}

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
