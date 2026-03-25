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
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  if (error || !purchaseData) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ fontSize: 16, color: "#FF6B6B", marginBottom: 20 }}>
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
                        style={[
                          styles.giftImage,
                          {
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#f0f0f0",
                          },
                        ]}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            color: "#999",
                            fontWeight: "bold",
                          }}
                        >
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                paddingVertical: 8,
              }}
            >
              {purchaseData.productItems.map((_, idx) => (
                <View
                  key={idx}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: idx === selectedIndex ? "#ef7810" : "#ccc",
                    marginHorizontal: 3,
                  }}
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
                <View style={styles.explanationToggle}>
                  <Text>상품고시정보</Text>
                  <Ionicons name="arrow-down-outline" size={20} color="#666" />
                </View>
                <View style={styles.explanationToggle}>
                  <Text>취소/환불 정책 및 방법</Text>
                  <Ionicons name="arrow-down-outline" size={20} color="#666" />
                </View>
                <View style={styles.explanationToggle}>
                  <Text>거래 조건에 관한 정보</Text>
                  <Ionicons name="arrow-down-outline" size={20} color="#666" />
                </View>
                <View style={styles.explanationToggle}>
                  <Text>구매 시 주의사항</Text>
                  <Ionicons name="arrow-down-outline" size={20} color="#666" />
                </View>
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
