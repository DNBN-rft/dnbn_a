import CartAddModal from "@/components/modal/CartAddModal";
import PurchaseModal from "@/components/modal/PurchaseModal";
import { apiGet, apiPost } from "@/utils/api";
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
import { styles } from "./product-detail.styles";

interface ProductImage {
  originalName: string;
  fileUrl: string;
  order: number;
}

interface Review {
  regNm: string;
  reviewContent: string;
  reviewRegDate: string;
  reviewRate: number;
  reviewAnswerContent: string | null;
}

interface ProductData {
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
  reviewList: Review[];
  productImgs: {
    files: ProductImage[];
  };
}

export default function ProductDetailScreen() {
  const [tab, setTab] = useState<"description" | "reviews" | "details">(
    "description",
  );
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const { productCode } = useLocalSearchParams();

  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await apiGet(`/cust/regular/${productCode}`);

        if (response.ok) {
          const data = await response.json();
          setProductData(data);
        } else {
          console.error("상품 조회 실패:", response.status);
        }
      } catch (error) {
        console.error("API 호출 에러:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productCode) {
      fetchProductData();
    }
  }, [productCode]);

  // 장바구니 추가 핸들러
  const handleAddToCart = async (quantity: number) => {
    // TODO: custCode를 실제 로그인 사용자 정보에서 가져오기
    const custCode = "CUST_001"; // 임시값

    if (!productData) {
      Alert.alert("오류", "상품 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      const response = await apiPost(`/cust/cart?custCode=${custCode}`, {
        productCode: productData.productCode,
        storeCode: productData.storeCode,
        quantity,
        price: productData.price,
        discountPrice: 0,
      });

      if (response.ok) {
        Alert.alert("성공", "장바구니에 상품을 추가했습니다.", [
          {
            text: "쇼핑 계속하기",
            onPress: () => {},
          },
          {
            text: "장바구니 가기",
            onPress: () => router.push("/(cust)/cart"),
          },
        ]);
      } else {
        const errorData = await response.json();
        Alert.alert(
          "오류",
          errorData.message || "장바구니 추가에 실패했습니다.",
        );
      }
    } catch (error) {
      console.error("장바구니 추가 오류:", error);
      Alert.alert("오류", "장바구니 추가 중 오류가 발생했습니다.");
      throw error;
    }
  };

  // 구매하기 핸들러
  const handlePurchase = (quantity: number) => {
    setPurchaseModalVisible(false);
    router.push({
      pathname: "/(cust)/orderPage",
      params: {
        productCode: productData?.productCode,
        orderQty: quantity.toString(),
      },
    });
  };

  // 로딩 중일 때
  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#EF7810" />
        <Text style={{ marginTop: 10, color: "#999" }}>
          상품 정보를 불러오는 중...
        </Text>
      </View>
    );
  }

  // 데이터가 없을 때
  if (!productData) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: "#999" }}>상품 정보를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  // 이미지 정렬 및 URL 추출
  const productImages = productData.productImgs?.files
    ? [...productData.productImgs.files]
        .sort((a, b) => a.order - b.order)
        .map((img) => img.fileUrl)
    : [];

  // 첫 번째 이미지 또는 기본 이미지
  const mainImageSource =
    productImages.length > 0
      ? { uri: productImages[0] }
      : require("@/assets/images/products_soyun/cow.png");

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
        {/* 이미지 슬라이더 */}
        <View style={styles.imageSliderContainer}>
          <FlatList
            data={productData.productImgs?.files || []}
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
                      : require("@/assets/images/products_soyun/cow.png")
                  }
                  style={[styles.productImage, { width: screenWidth }]}
                  resizeMode="cover"
                />
              </Pressable>
            )}
          />

          {/* 페이지네이션 인디케이터 */}
          {productData.productImgs?.files &&
            productData.productImgs.files.length > 1 && (
              <View style={styles.paginationContainer}>
                {productData.productImgs.files.map((_, index) => (
                  <View
                    key={`dot-${index}`}
                    style={[
                      styles.paginationDot,
                      currentImageIndex === index && styles.paginationDotActive,
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
              data={productData.productImgs?.files || []}
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
                        : require("@/assets/images/products_soyun/cow.png")
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
                {productData.productImgs?.files?.length || 0}
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
                params: { storeCode: productData.storeCode },
              });
            }}
          >
            <Text style={styles.storeName}>{productData.storeNm}</Text>

            <Ionicons name="home-outline" size={16} color="#999" />
          </Pressable>

          <View style={styles.nameContainer}>
            <Text style={styles.categoryText}>{productData.categoryNm}</Text>

            <Text style={styles.productName}>{productData.productNm}</Text>

            {productData.isAdult ? (
              <View style={styles.adultTag}>
                <Text style={styles.adultTagText}>서비스</Text>
              </View>
            ) : (
              <View style={styles.serviceTag}>
                <Text style={styles.serviceTagText}>서비스</Text>
              </View>
            )}
          </View>

          <View style={styles.priceAndStockContainer}>
            <View style={styles.priceContainer}>
              <Text style={styles.discountPrice}>
                {productData.price.toLocaleString()}원
              </Text>
            </View>

            <View style={styles.stockContainer}>
              <Text style={styles.stockText}>
                재고: {productData.productAmount.toLocaleString()}개
              </Text>
            </View>
          </View>

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />

            <Text style={styles.ratingText}>
              {productData.reviewRate.toFixed(1)} ({productData.reviewCnt})
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
                <Text style={styles.tabContent}>{productData.description}</Text>
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
                {productData.reviewList.length > 0 ? (
                  productData.reviewList.map((review, index) => (
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
                    </View>
                  ))
                ) : (
                  <Text
                    style={{
                      textAlign: "center",
                      color: "#999",
                      paddingVertical: 20,
                    }}
                  >
                    작성된 리뷰가 없습니다.
                  </Text>
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
                  <Text style={styles.detailLabel}>상품코드</Text>
                  <Text style={styles.detailValue}>
                    {productData.productCode}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>재고 상태</Text>
                  <Text style={styles.detailValue}>
                    {productData.isStock ? "재고 있음" : "품절"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>성인용품</Text>
                  <Text style={styles.detailValue}>
                    {productData.isAdult ? "예" : "아니오"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>판매점</Text>
                  <Text style={styles.detailValue}>{productData.storeNm}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => setCartModalVisible(true)}
        >
          <Ionicons name="cart-outline" size={24} color="#EF7810" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.purchaseButton}
          onPress={() => setPurchaseModalVisible(true)}
        >
          <Text style={styles.purchaseButtonText}>구매하기</Text>
        </TouchableOpacity>
      </View>

      {/* 장바구니 추가 모달 */}
      {productData && (
        <CartAddModal
          visible={cartModalVisible}
          productName={productData.productNm}
          productCode={productData.productCode}
          storeCode={productData.storeCode}
          price={productData.price}
          stock={productData.productAmount}
          onClose={() => setCartModalVisible(false)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* 구매하기 모달 */}
      {productData && (
        <PurchaseModal
          visible={purchaseModalVisible}
          productName={productData.productNm}
          productCode={productData.productCode}
          price={productData.price}
          stock={productData.productAmount}
          onClose={() => setPurchaseModalVisible(false)}
          onPurchase={handlePurchase}
        />
      )}

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
