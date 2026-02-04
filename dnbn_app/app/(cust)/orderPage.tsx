import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./orderPage.styles";

type PaymentMethod = "account" | "card" | "general" | null;

interface RecommendedProduct {
  productCode: string;
  productName: string;
  imageUrl: string;
  price: number;
}

export default function OrderPage() {
  const insets = useSafeAreaInsets();
  const { productCode } = useLocalSearchParams();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null);
  const [showFloatingButton, setShowFloatingButton] = useState(true);
  const purchaseButtonRef = useRef<View>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Mock 데이터 (나중에 API로 대체)
  const buyerInfo = {
    name: "홍길동",
    phone: "010-1234-5678",
    address: "서울시 강남구 테헤란로 123",
  };

  const productInfo = {
    storeName: "GS25 강남점",
    productName: "카페라떼 1+1 행사 상품",
    imageUrl: "https://via.placeholder.com/80",
    quantity: 2,
    unitPrice: 2500,
  };

  const totalPrice = productInfo.quantity * productInfo.unitPrice;

  // 추천 상품 Mock 데이터 (최대 5개)
  const recommendedProducts: RecommendedProduct[] = [
    {
      productCode: "P001",
      productName: "삼각김밥 2+1",
      imageUrl: "https://via.placeholder.com/100",
      price: 3000,
    },
    {
      productCode: "P002",
      productName: "도시락 세트",
      imageUrl: "https://via.placeholder.com/100",
      price: 5500,
    },
    {
      productCode: "P003",
      productName: "과일 컵",
      imageUrl: "https://via.placeholder.com/100",
      price: 2800,
    },
    {
      productCode: "P004",
      productName: "샌드위치",
      imageUrl: "https://via.placeholder.com/100",
      price: 3500,
    },
  ];

  const handlePrivacyInfo = () => {
    // TODO: 개인정보 제공 동의 안내문 모달 표시
    console.log("개인정보 제공 동의 안내문 표시");
  };

  const handleRecommendedProduct = (productCode: string) => {
    // TODO: 추천 상품 클릭 시 해당 상품 상세로 이동
    router.push(`/(cust)/product-detail?productCode=${productCode}`);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;

    // 스크롤이 하단 결제하기 버튼 근처에 있는지 확인
    const isNearBottom = scrollY + scrollViewHeight >= contentHeight - 100;
    setShowFloatingButton(!isNearBottom);
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
        <Text style={styles.title}>구매하기</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* 구매자 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>구매자 정보</Text>
          <View style={styles.buyerInfoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>이름</Text>
              <Text style={styles.infoValue}>{buyerInfo.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>연락처</Text>
              <Text style={styles.infoValue}>{buyerInfo.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>주소</Text>
              <Text style={styles.infoValue}>{buyerInfo.address}</Text>
            </View>
          </View>
        </View>

        {/* 구매 상품 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>구매 상품</Text>
          <View style={styles.productCard}>
            <Text style={styles.storeName}>{productInfo.storeName}</Text>
            <View style={styles.productInfoRow}>
              <Image
                source={{ uri: productInfo.imageUrl }}
                style={styles.productImage}
              />
              <View style={styles.productTextContainer}>
                <Text style={styles.productName} numberOfLines={2}>
                  {productInfo.productName}
                </Text>
                <Text style={styles.quantity}>
                  수량: {productInfo.quantity}개
                </Text>
              </View>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.unitPrice}>
                {productInfo.unitPrice.toLocaleString()}원
              </Text>
            </View>
          </View>

          {/* 총 주문금액 */}
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>총 주문금액</Text>
            <Text style={styles.totalPrice}>
              {totalPrice.toLocaleString()}원
            </Text>
          </View>
        </View>

        {/* 추천 상품 */}
        {recommendedProducts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {productInfo.storeName}에서 판매하는 다른 상품들이에요
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.recommendedProductsScroll}
            >
              {recommendedProducts.slice(0, 5).map((product) => (
                <TouchableOpacity
                  key={product.productCode}
                  style={styles.recommendedProductCard}
                  onPress={() => handleRecommendedProduct(product.productCode)}
                >
                  <Image
                    source={{ uri: product.imageUrl }}
                    style={styles.recommendedProductImage}
                  />
                  <Text style={styles.recommendedProductName} numberOfLines={2}>
                    {product.productName}
                  </Text>
                  <Text style={styles.recommendedProductPrice}>
                    {product.price.toLocaleString()}원
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* 결제 수단 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>결제 수단</Text>
          {selectedPayment === null ? (
            <View style={styles.paymentOptionsContainer}>
              <TouchableOpacity
                style={styles.paymentOption}
                onPress={() => setSelectedPayment("account")}
              >
                <View style={styles.radioButton}>
                  <View style={styles.radioButtonOuter} />
                </View>
                <Text style={styles.paymentOptionText}>계좌 간편결제</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.paymentOption}
                onPress={() => setSelectedPayment("card")}
              >
                <View style={styles.radioButton}>
                  <View style={styles.radioButtonOuter} />
                </View>
                <Text style={styles.paymentOptionText}>카드 간편결제</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.paymentOption}
                onPress={() => setSelectedPayment("general")}
              >
                <View style={styles.radioButton}>
                  <View style={styles.radioButtonOuter} />
                </View>
                <Text style={styles.paymentOptionText}>일반결제</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.selectedPaymentContainer}>
              <View style={styles.selectedPaymentHeader}>
                <View style={styles.radioButton}>
                  <View style={styles.radioButtonOuter}>
                    <View style={styles.radioButtonInner} />
                  </View>
                </View>
                <Text style={styles.selectedPaymentText}>
                  {selectedPayment === "account"
                    ? "계좌 간편결제"
                    : selectedPayment === "card"
                      ? "카드 간편결제"
                      : "일반결제"}
                </Text>
              </View>

              {/* 수평 스크롤 결제 수단 목록 */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.paymentMethodScroll}
              >
                <View style={styles.paymentMethodCard}>
                  <Text style={styles.paymentMethodText}>결제 수단 1</Text>
                </View>
                <View style={styles.paymentMethodCard}>
                  <Text style={styles.paymentMethodText}>결제 수단 2</Text>
                </View>
                <View style={styles.paymentMethodCard}>
                  <Text style={styles.paymentMethodText}>결제 수단 3</Text>
                </View>
              </ScrollView>

              {/* 변경 버튼 */}
              <TouchableOpacity
                style={styles.changeButtonContainer}
                onPress={() => setSelectedPayment(null)}
              >
                <Text style={styles.changeButtonText}>다른 결제 수단 선택</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 개인정보 제공 동의 */}
        <View style={styles.section}>
          <View style={styles.privacyConsentCard}>
            <Text style={styles.privacyConsentText}>
              개인정보 제공 동의 :{" "}
              <TouchableOpacity onPress={handlePrivacyInfo}>
                <Text style={styles.privacyConsentLink}>
                  {productInfo.storeName}
                </Text>
              </TouchableOpacity>{" "}
              <TouchableOpacity onPress={handlePrivacyInfo}>
                <Text style={styles.privacyConsentDetail}>상세보기</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>

        {/* 하단 고정 결제하기 버튼 (스크롤 내에 위치) */}
        <View ref={purchaseButtonRef} style={styles.purchaseButtonContainer}>
          <Text style={styles.agreementText}>
            주문 내용을 확인하였으며, 정보 제공 등에 동의합니다.
          </Text>
          <TouchableOpacity style={styles.purchaseButton}>
            <Text style={styles.purchaseButtonText}>
              {totalPrice.toLocaleString()}원 결제하기
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 하단 플로팅 결제 버튼 (조건부 표시) */}
      {showFloatingButton && (
        <View style={styles.floatingButtonContainer}>
          <Text style={styles.floatingAgreementText}>
            주문 내용을 확인하였으며, 정보 제공 등에 동의합니다.
          </Text>
          <TouchableOpacity style={styles.floatingButton}>
            <Text style={styles.floatingButtonText}>
              {totalPrice.toLocaleString()}원 결제하기
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
