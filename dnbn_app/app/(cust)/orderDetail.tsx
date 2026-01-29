import { apiGet } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./orderdetail.styles";

type ProductItem = {
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  options: string;
  status: string;
  usedAt: string;
};

type Store = {
  storeCode: string;
  name: string;
  items: ProductItem[];
};

type OrderDetail = {
  orderCode: string;
  orderDateTime: string;
  orderNumber: string;
  paymentMethod: string;
  paymentInfo: string;
  totalPrice: number;
  discountPrice: number;
  finalPrice: number;
  stores: Store[];
};

export default function OrderDetailScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ orderCode: string }>();

  const [loading, setLoading] = useState(false);
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);

  // API로 주문 상세 조회
  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const orderCode = params.orderCode || "ORD_005";
      const response = await apiGet(
        `/cust/order/purchase-detail?orderCode=${orderCode}`,
      );

      if (response.ok) {
        const data = await response.json();
        setOrderDetail(data);
      } else {
        console.error("주문 상세 조회 실패:", response.status);
      }
    } catch (error) {
      console.error("주문 상세 조회 에러:", error);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchOrderDetail();
  }, []);

  const purchaseDetailList = orderDetail ? [orderDetail] : [];

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
        <Text style={styles.title}>구매 상세</Text>
        <View style={styles.placeholder} />
      </View>

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      ) : (
        <ScrollView
          style={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {purchaseDetailList.map((item) => (
            <View key={item.orderCode} style={styles.orderDetailContainer}>
              {/* 결제 일시 및 주문번호 */}
              <View style={styles.orderInfoContainer}>
                <View style={styles.orderInfoLeft}>
                  <Text style={styles.orderDateText}>
                    {item.orderDateTime} 결제
                  </Text>

                  <Text style={styles.orderNumberText}>
                    주문번호: {item.orderNumber}
                  </Text>
                </View>

                <Pressable style={styles.receiptButton}>
                  <Text style={styles.receiptButtonText}>영수증</Text>
                </Pressable>
              </View>

              {/* 주문 정보 타이틀 */}
              <Text style={styles.mainTitle}>주문 정보</Text>

              {/* 가게별 박스 */}
              {item.stores.map((store) => (
                <View key={store.storeCode} style={styles.sectionBox}>
                  <Text style={styles.storeNameText}>{store.name}</Text>
                  <View style={styles.divider} />

                  {store.items.map((product, index) => (
                    <View
                      key={`${store.storeCode}-${index}`}
                      style={styles.productSection}
                    >
                      <View style={styles.productStatusRow}>
                        <Text style={styles.orderStatusText}>
                          {product.status}
                        </Text>

                        <Text style={styles.timestampText}>
                          {product.usedAt
                            ? ` 사용일시: ${product.usedAt}`
                            : " 사용일시: 미사용"}
                        </Text>
                      </View>

                      <View style={styles.productRow}>
                        <View style={styles.productImageContainer}>
                          <Image
                            source={require("@/assets/images/logo.png")}
                            style={styles.productImage}
                            resizeMode="contain"
                          />
                        </View>

                        <View style={styles.productInfoContainer}>
                          <Text style={styles.productNameText}>
                            {product.productName}
                          </Text>

                          <Text style={styles.productQuantityText}>
                            수량: {product.quantity}개
                          </Text>

                          <Text style={styles.productPriceText}>
                            {product.totalPrice.toLocaleString()}원
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              ))}

              {/* 결제 정보 타이틀 */}
              <Text style={styles.mainTitle}>결제 정보</Text>

              {/* 결제 정보 박스 */}
              <View style={styles.sectionBox}>
                <View style={styles.paymentSummary}>
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>주문금액</Text>
                    <Text style={styles.paymentValue}>
                      총 {item.totalPrice.toLocaleString()}원
                    </Text>
                  </View>
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabelSub}>상품금액</Text>
                    <Text style={styles.paymentValueSub}>
                      {item.totalPrice.toLocaleString()}원
                    </Text>
                  </View>
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabelSub}>할인금액</Text>
                    <Text style={styles.discountValue}>
                      -{item.discountPrice.toLocaleString()}원
                    </Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentMethodLabel}>
                      {item.paymentMethod}
                    </Text>
                    <Text style={styles.finalPriceText}>
                      {item.finalPrice.toLocaleString()}원
                    </Text>
                  </View>
                  <Text style={styles.paymentInfoText}>{item.paymentInfo}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
