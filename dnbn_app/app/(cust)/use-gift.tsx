import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./use-gift.styles";
import { apiGet } from "@/utils/api";

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

export default function UseGift() {
  const insets = useSafeAreaInsets();
  const searchParams = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("useinfo");
  const { height } = useWindowDimensions();
  const [purchaseData, setPurchaseData] = useState<UnusedQrCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const infoContainerHeight = (height - insets.top - insets.bottom - 64) * 0.5;

  interface UnusedQrCode {
    storeNm: string;
    productNm: string;
    orderDetailPrice: number;
    orderDetailAmount: number;
    orderDetailTotal: number;
    orderDateTime: string;
    qrUsed: boolean;
    qrImg: Img | null;
    productImg: Img | null;
  }

  interface Img {
    originalName: string;
    fileUrl: string;
    order: number;
  }

  useEffect(() => {
    const fetchPurchaseDetail = async () => {
      try {
        setLoading(true);
        const orderDetailIdx = searchParams.orderDetailIdx as string;
        
        if (!orderDetailIdx) {
          setError("주문 상세 정보를 찾을 수 없습니다.");
          return;
        }

        const response = await apiGet(`/cust/purchase-list/unused/${orderDetailIdx}`);
        
        if (!response.ok) {
          throw new Error("구매 정보를 가져오는데 실패했습니다.");
        }

        const data = await response.json();

        setPurchaseData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
        console.error("Purchase detail fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseDetail();
  }, [searchParams.orderDetailIdx]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  if (error || !purchaseData) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>구매함</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.infoContainer, { height: infoContainerHeight }]}>
          {purchaseData.productImg ? (
            <Image
              source={purchaseData.productImg.fileUrl}
              style={styles.giftImage}
              contentFit="contain"
            />
          ) : (
            <View
              style={[
                styles.giftImage,
                { justifyContent: "center", alignItems: "center", backgroundColor: "#f0f0f0" },
              ]}
            >
              <Text style={{ fontSize: 16, color: "#999", fontWeight: "bold" }}>
                삭제된 상품입니다
              </Text>
            </View>
          )}

          <Text style={styles.storeName}>{purchaseData.storeNm}</Text>
          <Text style={styles.productName}>{purchaseData.productNm}</Text>
          {purchaseData.qrImg && (
            <Image
              source={purchaseData.qrImg.fileUrl}
              style={styles.qrImage}
              contentFit="contain"
            />
          )}
        </View>

        <View style={styles.explanationContainer}>
          <View style={styles.explanationTab}>
            <Text
              style={styles.explanationTabText}
              onPress={() => setActiveTab("useinfo")}
            >
              이용안내
            </Text>
            <Text
              style={styles.explanationTabText}
              onPress={() => setActiveTab("detailinfo")}
            >
              상세정보
            </Text>
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
          <Text style={styles.giftDetailTitle}>선물 사용 정보</Text>
          <View style={styles.giftDetailRow}>
            <Text style={styles.giftDetailLabel}>금액</Text>
            <Text style={styles.giftDetailValue}>{purchaseData.orderDetailTotal.toLocaleString()}원</Text>
          </View>
          <View style={styles.giftDetailRow}>
            <Text style={styles.giftDetailLabel}>수량</Text>
            <Text style={styles.giftDetailValue}>{purchaseData.orderDetailAmount}개</Text>
          </View>
          <View style={styles.giftDetailRow}>
            <Text style={styles.giftDetailLabel}>단가</Text>
            <Text style={styles.giftDetailValue}>{purchaseData.orderDetailPrice.toLocaleString()}원</Text>
          </View>
          <View style={styles.giftDetailRow}>
            <Text style={styles.giftDetailLabel}>교환처</Text>
            <Text style={styles.giftDetailValue}>{purchaseData.storeNm}</Text>
          </View>
          <View style={styles.giftDetailRow}>
            <Text style={styles.giftDetailLabel}>주문일</Text>
            <Text style={styles.giftDetailValue}>{formatDateTime(purchaseData.orderDateTime)}</Text>
          </View>
          <View style={styles.giftDetailRow}>
            <Text style={styles.giftDetailLabel}>사용상태</Text>
            <Text style={styles.giftDetailValue}>사용 가능</Text>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.useButton}
        onPress={() => {
          if (purchaseData.qrImg?.fileUrl) {
            router.push({
              pathname: "/(cust)/qr-used",
              params: { qrImageUrl: purchaseData.qrImg.fileUrl }
            });
          }
        }}
      >
        <Text style={styles.useButtonText}>사용하기</Text>
      </TouchableOpacity>
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
