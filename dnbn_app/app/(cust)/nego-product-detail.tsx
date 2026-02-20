import { apiGet, apiPost } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ReviewCard } from "./components/ReviewCard";
import { styles } from "./nego-product-detail.styles";
import type { Review } from "./types/storeInfo.types";

// 백엔드에서 받는 리뷰 아이템 타입
interface BackendReviewItem {
  regNm: string;
  reviewContent: string;
  reviewRegDate: string;
  reviewRate: number;
  reviewAnswerContent: string | null;
  reviewImgs: {
    files: ProductImageFile[];
  };
}

// ReviewCard에서 사용하는 타입으로 확장
interface ReviewItem extends Review {
  reviewAnswerContent: string | null;
  reviewRegDate: string;
}

interface ProductImageFile {
  originalName: string;
  fileUrl: string;
  order: number;
}

interface NegoProductDetailResponse {
  isNego: boolean;
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
    reviewList: BackendReviewItem[];
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
  const [negoModalVisible, setNegoModalVisible] = useState(false);
  const [negoAmount, setNegoAmount] = useState("");
  const [productData, setProductData] =
    useState<NegoProductDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requesting, setRequesting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const insets = useSafeAreaInsets();

  const screenWidth = Dimensions.get("window").width;

  // 백엔드에서 상품 상세 정보 조회
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
        const response = await apiGet(`/cust/negoproducts/${productCode}`);

        if (!response.ok) {
          throw new Error("상품 정보를 불러오는데 실패했습니다.");
        }

        const data: NegoProductDetailResponse = await response.json();
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

  // API 데이터가 없으면 렌더링하지 않음
  if (!productData) return null;

  const product = productData.response;

  // reviewImgs를 reviewImage로 변환
  const transformedReviews: ReviewItem[] = product.reviewList.map((review) => ({
    custNick: review.regNm,
    reviewProductCode: product.productCode,
    reviewContent: review.reviewContent,
    reviewRate: review.reviewRate,
    regDateTime: review.reviewRegDate,
    reviewImage: review.reviewImgs,
    reviewAnswerContent: review.reviewAnswerContent,
    reviewRegDate: review.reviewRegDate,
    productNm: product.productNm,
  }));

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
          <Text style={styles.title}>상품 상세</Text>
        </View>
        <View style={styles.rightSection}>
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
            {product.productImgs?.files &&
            product.productImgs.files.length > 0 ? (
              <FlatList
                data={product.productImgs.files}
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
                    style={{ width: screenWidth, height: 350 }}
                  >
                    <Image
                      source={
                        item.fileUrl || require("@/assets/images/logo.png")
                      }
                      style={[styles.productImage, { width: screenWidth }]}
                      priority="high"
                      cachePolicy="memory-disk"
                      contentFit="cover"
                      transition={200}
                      placeholder="L6PZfSi_.AyE_3t7t7R**0o#DgR4"
                    />
                  </Pressable>
                )}
              />
            ) : (
              <Pressable style={{ width: screenWidth, height: 350 }}>
                <Image
                  source={require("@/assets/images/logo.png")}
                  style={[styles.productImage, { width: screenWidth }]}
                  priority="high"
                  cachePolicy="memory-disk"
                  contentFit="cover"
                  transition={200}
                  placeholder="L6PZfSi_.AyE_3t7t7R**0o#DgR4"
                />
              </Pressable>
            )}

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

              {product.productImgs?.files &&
                product.productImgs.files.length > 0 && (
                  <>
                    <FlatList
                      data={product.productImgs.files}
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
                        <View
                          style={[
                            styles.imageModalSlide,
                            { width: screenWidth, height: screenWidth },
                          ]}
                        >
                          <Image
                            source={
                              item.fileUrl ||
                              require("@/assets/images/logo.png")
                            }
                            style={styles.imageModalImage}
                            priority="high"
                            cachePolicy="memory-disk"
                            contentFit="contain"
                            transition={200}
                            placeholder="L6PZfSi_.AyE_3t7t7R**0o#DgR4"
                          />
                        </View>
                      )}
                    />

                    <View style={styles.imageModalCounter}>
                      <Text style={styles.imageModalCounterText}>
                        {selectedImageIndex + 1} /{" "}
                        {product.productImgs.files.length}
                      </Text>
                    </View>
                  </>
                )}
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
                <Text style={styles.discountPrice}>
                  {product.price.toLocaleString()}원
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
                  {transformedReviews && transformedReviews.length > 0 ? (
                    transformedReviews.map((review, index) => (
                      <ReviewCard
                        key={index}
                        item={review}
                        productCode={product.productCode}
                      />
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
            style={styles.purchaseButton}
            onPress={() => setNegoModalVisible(true)}
          >
            <Text style={styles.purchaseButtonText}>네고 요청하기</Text>
          </TouchableOpacity>
        </View>
      )}

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
            <Text style={styles.negoModalSubLabel}>
              최대 {product.price.toLocaleString()}원까지 입력 가능
            </Text>
            <TextInput
              style={styles.negoInput}
              placeholder="금액을 입력하세요"
              keyboardType="numeric"
              value={negoAmount}
              maxLength={10}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, "");
                const numericValue = parseInt(numericText) || 0;

                // 상품 금액을 초과하지 않도록 제한
                if (numericValue <= product.price) {
                  setNegoAmount(numericText);
                } else {
                  setNegoAmount(product.price.toString());
                }
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
                  if (!productCode || !product) {
                    Alert.alert("오류", "필요한 정보가 없습니다.");
                    return;
                  }

                  try {
                    setRequesting(true);
                    const response = await apiPost(`/cust/nego`, {
                      categoryNm: product.categoryNm,
                      storeCode: product.storeCode,
                      productCode: product.productCode,
                      requestPrice: parseInt(negoAmount),
                    });

                    if (response.ok) {
                      Alert.alert("성공", "네고 요청이 완료되었습니다.");
                      setNegoModalVisible(false);
                      setNegoAmount("");
                    } else {
                      Alert.alert("오류", "네고 요청에 실패했습니다.");
                    }
                  } catch (error) {
                    console.error("네고 요청 실패:", error);
                    Alert.alert("오류", "네고 요청 중 오류가 발생했습니다.");
                  } finally {
                    setRequesting(false);
                  }
                }}
              >
                <Text style={styles.negoConfirmButtonText}>
                  {requesting ? "처리 중..." : "요청"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.negoModalButton, styles.negoCancelButton]}
                disabled={requesting}
                onPress={() => {
                  setNegoModalVisible(false);
                  setNegoAmount("");
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
