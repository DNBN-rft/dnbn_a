import CartAddModal from "@/components/modal/CartAddModal";
import ProductReportModal from "@/components/modal/ProductReportModal";
import PurchaseModal from "@/components/modal/PurchaseModal";
import { apiGet, apiPost } from "@/utils/api";
import { shareProduct } from "@/utils/kakaoShareUtil";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./product-detail.styles";
import WebView from "react-native-webview";

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
  const [descriptionHeight, setDescriptionHeight] = useState(200);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [openDetail, setOpenDetail] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const { productCode } = useLocalSearchParams();

  const scrollViewRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get("window").width;

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

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
    if (!productData) {
      Alert.alert("오류", "상품 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      const response = await apiPost(`/cust/cart`, {
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
    productImages.length > 0 ? { uri: productImages[0] } : null;

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
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() =>
              productData &&
              shareProduct({
                productCode: productData.productCode,
                productNm: productData.productNm,
                storeNm: productData.storeNm,
                price: productData.price,
                imageUrl: productData.productImgs?.files?.[0]?.fileUrl,
                type: "regular",
              })
            }
          >
            <Ionicons name="share-social-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.reportButton}
            onPress={() => setReportModalVisible(true)}
          >
            <Ionicons name="alert" size={18} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView ref={scrollViewRef} style={styles.productDetailContainer}>
        {/* 이미지 슬라이더 */}
        <View style={styles.imageSliderContainer}>
          {productData.productImgs?.files &&
          productData.productImgs.files.length > 0 ? (
            <FlatList
              data={productData.productImgs.files}
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
                  {item.fileUrl ? (
                    <Image
                      source={{ uri: item.fileUrl }}
                      style={[styles.productImage, { width: screenWidth }]}
                      priority="high"
                      cachePolicy="memory-disk"
                      contentFit="cover"
                      transition={200}
                      placeholder="L6PZfSi_.AyE_3t7t7R**0o#DgR4"
                    />
                  ) : (
                    <View
                      style={[
                        styles.productImage,
                        {
                          width: screenWidth,
                          backgroundColor: "#f5f5f5",
                          alignItems: "center",
                          justifyContent: "center",
                        },
                      ]}
                    >
                      <Ionicons name="image-outline" size={64} color="#ccc" />
                    </View>
                  )}
                </Pressable>
              )}
            />
          ) : (
            <View
              style={[
                styles.productImage,
                {
                  width: screenWidth,
                  height: 350,
                  backgroundColor: "#f5f5f5",
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <Ionicons name="image-outline" size={64} color="#ccc" />
            </View>
          )}

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

            {productData.productImgs?.files &&
              productData.productImgs.files.length > 0 && (
                <>
                  <FlatList
                    data={productData.productImgs.files}
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
                      <View style={[styles.imageModalSlide]}>
                        {item.fileUrl ? (
                          <Image
                            source={{ uri: item.fileUrl }}
                            style={styles.imageModalImage}
                            priority="high"
                            cachePolicy="memory-disk"
                            contentFit="contain"
                            transition={200}
                            placeholder="L6PZfSi_.AyE_3t7t7R**0o#DgR4"
                          />
                        ) : (
                          <View
                            style={[
                              styles.imageModalImage,
                              {
                                backgroundColor: "#f5f5f5",
                                alignItems: "center",
                                justifyContent: "center",
                              },
                            ]}
                          >
                            <Ionicons
                              name="image-outline"
                              size={64}
                              color="#ccc"
                            />
                          </View>
                        )}
                      </View>
                    )}
                  />

                  <View style={styles.imageModalCounter}>
                    <Text style={styles.imageModalCounterText}>
                      {selectedImageIndex + 1} /{" "}
                      {productData.productImgs.files.length}
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

            {productData.isAdult && (
              <View style={styles.adultTag}>
                <Text style={styles.adultTagText}>성인</Text>
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
                <WebView
                  source={{ html: `<!DOCTYPE html><html><head><meta name='viewport' content='width=device-width,initial-scale=1.0,maximum-scale=1.0'><style>body{margin:0;padding:8px;font-family:-apple-system,sans-serif;font-size:14px;color:#333;word-break:break-word;}img{max-width:100%;height:auto;}</style></head><body>${productData.description}</body></html>` }}
                  style={{ height: descriptionHeight }}
                  scrollEnabled={false}
                  injectedJavaScript="(function(){function h(){window.ReactNativeWebView.postMessage(JSON.stringify({height:document.body.scrollHeight}));}h();setTimeout(h,500);})();true;"
                  onMessage={(e) => { try { const d = JSON.parse(e.nativeEvent.data); if (d.height) setDescriptionHeight(d.height); } catch {} }}
                />
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
                {[
                  {
                    key: "notice",
                    label: "상품고시정보",
                    content:
                      "[상품 정보 제공 고시 관련 안내]\n본 플랫폼은 통신판매중개자로서 재화·용역의 직접 판매자가 아니으므로, 「전자상거래 등에서의 상품 등의 정보제공에 관한 고시」에 따른 상품고시정보 작성·표시 의무는 입점 판매자에게 있습니다.\n\n• 판매자는 상품 등록 시 해당 품목의 필수 정보를 정확히 입력해야 하며, 소비자는 상품 상세 페이지에서 확인할 수 있습니다.\n• 플랫폼은 판매자의 정보 입력을 시스템적으로 요구하나, 정보의 진위 여부에 대한 체임은 판매자에게 있습니다.\n• 상품 관련 문의(소재, 사이즈, 성분, 유통기한 등)는 해당 판매자(판매자 정보 확인 가능)에게 직접 문의하시기 바랍니다.",
                  },
                  {
                    key: "refund",
                    label: "취소/환불 정책 및 방법",
                    content:
                      "취소·환불 안내 (통신판매중개 플랫폼 운영 원칙)\n본 플랫폼은 통신판매중개자로서 재화·용역의 직접 공급·판매 당사자가 아닙니다. 따라서 취소, 환불, 교환 등은 해당 상품의 판매자(입점 판매자)가 직접 처리합니다.\n\n주문 취소: 주문 접수 후 판매자에게 직접 취소 요청 가능\n청약철회(반품·환불): 소비자는 「전자상거래법」 제17조에 따라 수령일로부터 7일 이내 청약철회 가능하나, 청약철회 신청·처리·반품 배송·환불은 판매자가 직접 담당합니다.\n환불 절차: 판매자가 청약철회를 수락하면 판매자가 대금을 환급하며, 플랫폼은 환불 지연 시 판매자에게 이행 촉구 및 분쟁 조정 지원을 할 수 있습니다.\n환불 지연 시: 판매자가 3영업일 이내 환급하지 않을 경우 플랫폼 고객센터로 문의하시면 판매자에 대한 조치를 취할 수 있습니다.\n왕복 배송비: 단순 변심 반품 시 소비자 부담 (판매자와 별도 협의 가능).\n\n플랫폼은 판매자의 청약철회·환불 이행을 모니터링하며, 미이행 시 판매 중지 등의 조치를 취할 수 있습니다.",
                  },
                  {
                    key: "terms",
                    label: "거래 조건에 관한 정보",
                    content:
                      "거래 조건 안내\n본 플랫폼은 통신판매중개 서비스를 제공하며, 실제 거래 당사자는 소비자와 입점 판매자입니다.\n\n교환·반품: 판매자가 정한 조건에 따릅니다.\n대금 지급: 플랫폼 결제 시스템을 통해 판매자에게 지급되며, 플랫폼은 결제대행(PG) 역할만 수행합니다.\n청약철회 제한 사유: 「전자상거래법」 제17조 제2항에 따라 판매자가 정한 제한 사유 적용\n판매자 신원정보: 각 상품 페이지 또는 주문서에 판매자 상호, 사업자등록번호, 연락처 등이 표시됩니다.\n플랫폼 역할: 거래 당사자가 아니므로 상품 품질·정보 정확성·배송 지연 등에 대한 직접 책임은 지지 않으나, 분쟁 발생 시 조정을 지원할 수 있습니다.",
                  },
                  {
                    key: "caution",
                    label: "구매 시 주의사항",
                    content:
                      "구매 전 반드시 확인해 주세요.\n\n본 플랫폼은 중개 서비스만 제공하므로, 상품·거래 관련 모든 책임은 해당 판매자에게 있습니다.\n상품 정보(소재, 사이즈, 유통기한, 원산지 등)는 판매자가 직접 입력·관리하며, 플랫폼은 정보의 정확성을 보증하지 않습니다. 구매 전 판매자에게 문의하시기 바랍니다.\n청약철회·반품·취소·환불은 입점 판매자와 직접 진행되며, 판매자 응답 지연 시 플랫폼 고객센터로 연락 주시면 지원할 수 있습니다.\n주문 제작·맞춤 상품, 개봉 시 가치 훼손 상품 등은 청약철회가 제한될 수 있습니다.\n분쟁 발생 시 공정거래위원회 또는 한국소비자원 분쟁조정 신청 가능합니다(플랫폼은 조정 과정 협조).\n해외 판매자 상품의 경우 관세·부가세, 국제 배송 지연 등이 발생할 수 있습니다.",
                  },
                ].map((item) => (
                  <View key={item.key}>
                    <TouchableOpacity
                      style={styles.detailRow}
                      onPress={() =>
                        setOpenDetail(openDetail === item.key ? null : item.key)
                      }
                    >
                      <Text style={styles.detailLabel}>{item.label}</Text>
                      <Ionicons
                        name={
                          openDetail === item.key
                            ? "chevron-up"
                            : "chevron-down"
                        }
                        size={20}
                        color="#666"
                      />
                    </TouchableOpacity>
                    {openDetail === item.key && (
                      <View style={styles.detailDropdownContent}>
                        <Text style={styles.detailDropdownText}>
                          {item.content}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
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

      {/* FloatingButton - 최상단 이동 */}
      {!loading && (
        <TouchableOpacity
          style={[styles.scrollToTopButton, { bottom: 90 + insets.bottom }]}
          onPress={scrollToTop}
        >
          <Ionicons name="chevron-up" size={24} color="#ef7810" />
        </TouchableOpacity>
      )}

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

      {productData && (
        <ProductReportModal
          visible={reportModalVisible}
          onClose={() => setReportModalVisible(false)}
          productCode={productData.productCode}
        />
      )}

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
