import ProductReportModal from "@/components/modal/ProductReportModal";
import { ProductDescriptionWebView } from "@/components/ui/ProductDescriptionWebView";
import { apiGet, apiPost } from "@/utils/api";
import { formatCountdown } from "@/utils/dateUtil";
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
  endDateTime: string;
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
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [openDetail, setOpenDetail] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const scrollViewRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get("window").width;

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

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

  // 종료 시간 카운트다운
  useEffect(() => {
    if (!productData?.endDateTime) return;

    const endTime = new Date(productData.endDateTime).getTime();
    const initialSeconds = Math.max(
      0,
      Math.floor((endTime - Date.now()) / 1000),
    );
    setTimeLeft(initialSeconds);

    if (initialSeconds <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [productData?.endDateTime]);

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
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() =>
              shareProduct({
                productCode: product.productCode,
                productNm: product.productNm,
                storeNm: product.storeNm,
                price: product.price,
                imageUrl: product.productImgs?.files?.[0]?.fileUrl,
                type: "nego",
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
        <ScrollView ref={scrollViewRef} style={styles.productDetailContainer}>
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
                    {item.fileUrl ? (
                      <Image
                        source={item.fileUrl}
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
                          { width: screenWidth },
                          styles.noImageBox,
                        ]}
                      >
                        <Ionicons name="image-outline" size={80} color="#ccc" />
                      </View>
                    )}
                  </Pressable>
                )}
              />
            ) : (
              <Pressable style={{ width: screenWidth, height: 350 }}>
                <View
                  style={[
                    styles.productImage,
                    { width: screenWidth },
                    styles.noImageBox,
                  ]}
                >
                  <Ionicons name="image-outline" size={80} color="#ccc" />
                </View>
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
                <Ionicons name="close" size={32} color="#FFF" />
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
                        <View style={[styles.imageModalSlide]}>
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

          {/* 남은 시간 */}
          {productData.endDateTime && (
            <View style={styles.timeLimitBar}>
              <Ionicons
                name="time-outline"
                size={13}
                color={timeLeft <= 0 ? "#999" : "rgb(239, 120, 16)"}
              />
              <Text
                style={[
                  styles.timeLimitBarText,
                  timeLeft <= 0 && styles.timeLimitBarTextExpired,
                ]}
              >
                {timeLeft <= 0
                  ? "판매 종료"
                  : `남은 시간: ${formatCountdown(timeLeft)}`}
              </Text>
            </View>
          )}

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
                  <ProductDescriptionWebView html={product.description} />
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
                          setOpenDetail(
                            openDetail === item.key ? null : item.key,
                          )
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

      {/* FloatingButton - 최상단 이동 */}
      {!loading && !error && (
        <TouchableOpacity
          style={[styles.scrollToTopButton, { bottom: 90 + insets.bottom }]}
          onPress={scrollToTop}
        >
          <Ionicons name="chevron-up" size={24} color="#ef7810" />
        </TouchableOpacity>
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

      {product && (
        <ProductReportModal
          visible={reportModalVisible}
          onClose={() => setReportModalVisible(false)}
          productCode={product.productCode}
        />
      )}
    </View>
  );
}
