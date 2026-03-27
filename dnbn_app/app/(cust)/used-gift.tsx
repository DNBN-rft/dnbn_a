import { apiGet } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./used-gift.styles";

// 날짜 포맷팅 함수
const formatDateTime = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const ampm = hours >= 12 ? "오후" : "오전";
  const displayHours = hours % 12 || 12;
  const displayMinutes = String(minutes).padStart(2, "0");

  return `${year}년 ${month}월 ${day}일 ${ampm} ${displayHours}시 ${displayMinutes}분`;
};

export default function UsedGift() {
  const insets = useSafeAreaInsets();
  const searchParams = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("useinfo");
  const { height, width } = useWindowDimensions();
  const [purchaseData, setPurchaseData] = useState<UsedQrCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [openDetail, setOpenDetail] = useState<string | null>(null);
  const productListRef = useRef<FlatList>(null);

  const infoContainerHeight = (height - insets.top - insets.bottom - 64) * 0.5;

  interface FileResponse {
    originalName: string;
    fileUrl: string;
    order: number;
  }

  interface ProductItem {
    productImg: FileResponse | null;
    storeNm: string;
    productNm: string;
    price: number;
    amount: number;
    totalPrice: number;
    qrUsed: boolean;
    qrUsedAt: string;
    orderCancelTime: string;
    orderRefundTime: string;
  }

  interface UsedQrCode {
    productItems: ProductItem[];
    orderCode: string;
    totalProductPrice: number;
  }

  const fetchPurchaseDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const orderCode = searchParams.orderCode as string;

      if (!orderCode) {
        setError("주문 상세 정보를 찾을 수 없습니다.");
        setLoading(false);
        return;
      }

      const response = await apiGet(`/cust/purchase-list/used/${orderCode}`);

      if (!response.ok) {
        setError("구매 상세 정보를 불러오는 데 실패했습니다.");
        setLoading(false);
        return;
      }

      const data = await response.json();

      setPurchaseData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      console.error("Purchase detail fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [searchParams.orderCode]);

  useEffect(() => {
    fetchPurchaseDetail();
  }, [fetchPurchaseDetail]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centeredContainer]}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  if (error || !purchaseData) {
    return (
      <View style={[styles.container, styles.centeredContainer]}>
        <Text style={styles.errorText}>
          {error || "구매 정보를 불러올 수 없습니다."}
        </Text>
        <TouchableOpacity
          style={styles.useButton}
          onPress={() => router.back()}
        >
          <Text style={styles.useButtonText}>돌아가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
          <Text style={styles.title}>구매함</Text>
        </View>
        <View style={styles.rightSection} />
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View>
          <FlatList
            ref={productListRef}
            data={[...purchaseData.productItems].sort((a, b) => {
              const aUsed = !!(
                a.qrUsedAt ||
                a.orderCancelTime ||
                a.orderRefundTime
              );
              const bUsed = !!(
                b.qrUsedAt ||
                b.orderCancelTime ||
                b.orderRefundTime
              );
              return Number(aUsed) - Number(bUsed);
            })}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, idx) => idx.toString()}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setSelectedIndex(index);
            }}
            renderItem={({ item }) => (
              <View style={{ width, alignItems: "center" }}>
                <View
                  style={[
                    styles.infoContainer,
                    { height: infoContainerHeight },
                  ]}
                >
                  <View style={styles.giftImageContainer}>
                    {item.productImg ? (
                      <Image
                        source={item.productImg.fileUrl}
                        style={styles.giftImage}
                        contentFit="contain"
                      />
                    ) : (
                      <View
                        style={[styles.giftImage, styles.noImagePlaceholder]}
                      >
                        <Text style={styles.deletedProductText}>
                          삭제된 상품입니다
                        </Text>
                      </View>
                    )}
                    {(item.qrUsedAt ||
                      item.orderCancelTime ||
                      item.orderRefundTime) && (
                      <>
                        <View
                          style={[
                            styles.statusOverlayBg,
                            item.qrUsedAt ? styles.bgUsed : styles.bgCanceled,
                          ]}
                        />
                        <View
                          style={[
                            styles.statusStamp,
                            item.qrUsedAt
                              ? styles.stampUsed
                              : styles.stampCanceled,
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusText,
                              item.qrUsedAt
                                ? styles.textUsed
                                : styles.textCanceled,
                            ]}
                          >
                            {item.qrUsedAt
                              ? "사용 완료"
                              : item.orderCancelTime
                                ? "취소"
                                : "환불"}
                          </Text>
                        </View>
                      </>
                    )}
                  </View>
                  <Text style={styles.storeName}>{item.storeNm}</Text>
                  <Text style={styles.productName}>{item.productNm}</Text>
                </View>
              </View>
            )}
          />
          {purchaseData.productItems.length > 1 && (
            <View style={styles.dotIndicatorRow}>
              {purchaseData.productItems.map((_, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        idx === selectedIndex ? "#ef7810" : "#ccc",
                    },
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.explanationContainer}>
          <View style={styles.explanationTab}>
            <TouchableOpacity
              style={[
                styles.explanationTabButton,
                activeTab === "useinfo" && styles.explanationTabButtonActive,
              ]}
              onPress={() => setActiveTab("useinfo")}
            >
              <Text
                style={[
                  styles.explanationTabText,
                  activeTab === "useinfo" && styles.explanationTabTextActive,
                ]}
              >
                이용안내
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.explanationTabButton,
                activeTab === "detailinfo" && styles.explanationTabButtonActive,
              ]}
              onPress={() => setActiveTab("detailinfo")}
            >
              <Text
                style={[
                  styles.explanationTabText,
                  activeTab === "detailinfo" && styles.explanationTabTextActive,
                ]}
              >
                상세정보
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.explanationContent}>
            {activeTab === "useinfo" ? (
              <Text style={styles.explanationText}>
                <Ionicons name="qr-code-outline" size={20} color="#666" />
                {"  "}매장 방문 시, QR 코드를 제시하여 상품을 사용하세요.
                {"\n\n"}
                <Ionicons name="time-outline" size={20} color="#666" />
                {"  "}유효기간 내에 사용하지 않은 상품은 자동으로 만료됩니다.
                {"\n\n"}
                <Ionicons name="call-outline" size={20} color="#666" />
                {"  "}상품 관련 문의는 가맹점으로 연락주세요.
              </Text>
            ) : (
              <View style={styles.explanationTextToggle}>
                {[
                  {
                    key: "notice",
                    label: "상품고시정보",
                    content:
                      "[상품 정보 제공 고시 관련 안내]\n본 플랫폼은 통신판매중개자로서 재화·용역의 직접 판매자가 아니므로, 「전자상거래 등에서의 상품 등의 정보제공에 관한 고시」에 따른 상품고시정보 작성·표시 의무는 입점 판매자에게 있습니다.\n\n• 판매자는 상품 등록 시 해당 품목의 필수 정보를 정확히 입력해야 하며, 소비자는 상품 상세 페이지에서 확인할 수 있습니다.\n• 플랫폼은 판매자의 정보 입력을 시스템적으로 요구하나, 정보의 진위 여부에 대한 책임은 판매자에게 있습니다.\n• 상품 관련 문의(소재, 사이즈, 성분, 유통기한 등)는 해당 판매자에게 직접 문의하시기 바랍니다.",
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
            )}
          </View>
        </View>
        <View style={styles.giftDetailInfo}>
          <Text style={styles.giftDetailTitle}>구매 상세 정보</Text>
          <View style={styles.giftDetailRow}>
            <Text style={styles.giftDetailLabel}>QR 사용일</Text>
            <Text style={styles.giftDetailValue}>
              {purchaseData.productItems[selectedIndex]?.qrUsedAt
                ? formatDateTime(
                    purchaseData.productItems[selectedIndex].qrUsedAt,
                  )
                : "-"}
            </Text>
          </View>
          <View style={styles.giftDetailRow}>
            <Text style={styles.giftDetailLabel}>주문번호</Text>
            <Text style={styles.giftDetailValue}>{purchaseData.orderCode}</Text>
          </View>
          <View style={styles.giftDetailRow}>
            <Text style={styles.giftDetailLabel}>수량</Text>
            <Text style={styles.giftDetailValue}>
              {purchaseData.productItems[selectedIndex]?.amount}개
            </Text>
          </View>
          <View style={styles.giftDetailRow}>
            <Text style={styles.giftDetailLabel}>단가</Text>
            <Text style={styles.giftDetailValue}>
              {purchaseData.productItems[selectedIndex]?.price.toLocaleString()}
              원
            </Text>
          </View>
          <View style={styles.giftDetailRow}>
            <Text style={styles.giftDetailLabel}>총금액</Text>
            <Text style={styles.giftDetailValue}>
              {purchaseData.productItems[
                selectedIndex
              ]?.totalPrice.toLocaleString()}
              원
            </Text>
          </View>
          <View style={styles.giftDetailRow}>
            <Text style={styles.giftDetailLabel}>주문 총금액</Text>
            <Text style={styles.giftDetailValue}>
              {purchaseData.totalProductPrice.toLocaleString()}원
            </Text>
          </View>
          <View style={styles.giftDetailRow}>
            <Text style={styles.giftDetailLabel}>교환처</Text>
            <Text style={styles.giftDetailValue}>
              {purchaseData.productItems[selectedIndex]?.storeNm}
            </Text>
          </View>
        </View>
      </ScrollView>
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
