import { apiGet } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useState } from "react";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BannerCarousel from "../components/BannerCarousel";
import NegoProductSection from "../components/NegoProductSection";
import RegularProductSection from "../components/RegularProductSection";
import SaleProductSection from "../components/SaleProductSection";
import { styles } from "../styles/custhome.styles";

export default function CustHomeScreen() {
  const insets = useSafeAreaInsets();

  const [negoProducts, setNegoProducts] = useState<any[]>([]);
  const [saleProducts, setSaleProducts] = useState<any[]>([]);
  const [regularProducts, setRegularProducts] = useState<any[]>([]);
  const [bannerProducts, setBannerProducts] = useState<any[]>([]);
  const [hasUnreadAlarm, setHasUnreadAlarm] = useState(false);

  // 읽지 않은 알림 확인 함수
  const checkUnreadAlarm = async () => {
    try {
      const custCode =
        Platform.OS === "web"
          ? localStorage.getItem("custCode")
          : await SecureStore.getItemAsync("custCode");

      if (!custCode) return;

      const response = await apiGet(`/cust/alarm/unread?custCode=${custCode}`);

      if (response.ok) {
        const data = await response.json();
        setHasUnreadAlarm(data === true);
      }
    } catch (error) {
      console.error("읽지 않은 알림 확인 중 오류:", error);
    }
  };

  // 페이지가 포커스될 때마다 모든 상품 데이터를 가져오기
  useFocusEffect(
    useCallback(() => {
      const fetchAllProducts = async () => {
        const custCode = "CUST_001";

        // 읽지 않은 알림 상태 확인
        checkUnreadAlarm();

        try {
          const [negoResponse, saleResponse, regularResponse, bannerResponse] =
            await Promise.all([
              apiGet(`/cust/nego/home?custCode=${custCode}`),
              apiGet(`/cust/sales/home?custCode=${custCode}`),
              apiGet(`/cust/regular/home?custCode=${custCode}`),
              apiGet(`/cust/sales/banner?custCode=${custCode}`), // 배너용 할인율 높은 상품
            ]);

          // 네고 상품 처리
          try {
            const negoData = await negoResponse.json();
            if (negoResponse.ok && Array.isArray(negoData)) {
              setNegoProducts(negoData);
            } else {
              console.error("네고 상품 로드 실패:", negoData);
            }
          } catch (error) {
            console.error("네고 상품 데이터 파싱 실패:", error);
          }

          // 할인 상품 처리
          try {
            const saleData = await saleResponse.json();
            if (saleResponse.ok && Array.isArray(saleData)) {
              setSaleProducts(saleData);
            } else {
              console.error("할인 상품 로드 실패:", saleData);
            }
          } catch (error) {
            console.error("할인 상품 데이터 파싱 실패:", error);
          }

          // 일반 상품 처리
          try {
            const regularData = await regularResponse.json();
            if (regularResponse.ok && Array.isArray(regularData)) {
              setRegularProducts(regularData);
            } else {
              console.error("일반 상품 로드 실패:", regularData);
            }
          } catch (error) {
            console.error("일반 상품 데이터 파싱 실패:", error);
          }

          // 배너 상품 처리
          try {
            const bannerData = await bannerResponse.json();
            if (bannerResponse.ok && Array.isArray(bannerData)) {
              setBannerProducts(bannerData);
            } else {
              console.error("배너 상품 로드 실패:", bannerData);
            }
          } catch (error) {
            console.error("배너 상품 데이터 파싱 실패:", error);
          }
        } catch (error) {
          console.error("상품 API 호출 실패:", error);
        }
      };

      fetchAllProducts();
    }, []),
  );

  // 상품 데이터 변환
  const transformedNegoProducts = negoProducts.map((item) => ({
    id: item.productCode,
    uri: item.images?.files?.[0]?.fileUrl
      ? { uri: item.images.files[0].fileUrl }
      : { uri: "https://via.placeholder.com/150" },
    productName: item.productNm,
    storeName: item.storeNm,
    price: item.price,
  }));

  const transformedSaleProducts = saleProducts.map((item) => {
    const discountPercent =
      item.saleType === "PERCENTAGE"
        ? item.saleValue
        : Math.round(
            ((item.originalPrice - item.discountPrice) / item.originalPrice) *
              100,
          );

    return {
      id: item.productCode,
      uri: item.images?.files?.[0]?.fileUrl
        ? { uri: item.images.files[0].fileUrl }
        : { uri: "https://via.placeholder.com/150" },
      productName: item.productNm,
      storeName: item.storeNm,
      discount: discountPercent,
      price: item.discountPrice,
    };
  });

  const transformedRegularProducts = regularProducts.map((item) => ({
    id: item.productCode,
    uri: item.productImg?.fileUrl
      ? { uri: item.productImg.fileUrl }
      : { uri: "https://via.placeholder.com/150" },
    productName: item.productNm,
    storeName: item.storeNm,
    price: item.price,
  }));

  // 배너 데이터 변환 (최대 5개 상품, 각 상품의 첫 번째 이미지만 사용)
  const transformedBanners = bannerProducts
    .slice(0, 5) // 최대 5개 상품까지만 사용
    .map((item) => {
      // 각 상품의 첫 번째 이미지 선택
      const images = item.fileMasterResponse?.files || [];
      const sortedImages = [...images].sort((a, b) => a.order - b.order);
      const firstImage = sortedImages[0];

      return {
        id: item.productCode,
        uri: firstImage?.fileUrl
          ? { uri: firstImage.fileUrl }
          : { uri: "https://via.placeholder.com/150" },
        productName: item.productNm,
        storeName: item.storeNm,
        discount: item.discountRate,
        price: item.discountedPrice,
        originalPrice: item.originalPrice,
        productCode: item.productCode,
        saleType: item.saleType,
      };
    });

  // 배너가 없을 경우 기본 이미지 사용
  const originalBanners =
    transformedBanners.length > 0
      ? transformedBanners
      : [
          {
            id: "1",
            uri: require("@/assets/images/normalproduct/bread.jpg"),
            productName: "갓 구운 바게트 빵",
            storeName: "동네 베이커리",
            discount: 30,
            price: 3500,
            originalPrice: 5000,
          },
          {
            id: "2",
            uri: require("@/assets/images/favicon.png"),
            productName: "프리미엄 쿠키 세트",
            storeName: "달콤한 제과점",
            discount: 50,
            price: 7500,
            originalPrice: 15000,
          },
          {
            id: "3",
            uri: require("@/assets/images/react-logo.png"),
            productName: "신선한 샌드위치",
            storeName: "건강한 식탁",
            discount: 20,
            price: 4000,
            originalPrice: 5000,
          },
          {
            id: "4",
            uri: require("@/assets/images/logo.png"),
            productName: "시그니처 케이크",
            storeName: "스위트 홈",
            discount: 40,
            price: 18000,
            originalPrice: 30000,
          },
        ];

  // 무한스크롤을 위한 배너 복제
  const banners = [
    ...originalBanners,
    { ...originalBanners[0], id: `${originalBanners[0].id}-clone` },
  ];

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#fff" }} />
      )}

      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Ionicons name="location" size={24} color="#EF7810" />
          <TouchableOpacity
            style={styles.addr}
            onPress={() => router.push("/(cust)/address")}
          >
            <Text style={styles.addrText}>행궁동</Text>
            <Ionicons name="chevron-down" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push("/(cust)/notifications")}
          >
            <Ionicons name="notifications-outline" size={24} color="#000" />
            {hasUnreadAlarm && <View style={styles.notificationBadge} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push("/(cust)/cart")}
          >
            <Ionicons name="cart-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 스크롤 가능한 콘텐츠 */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <BannerCarousel banners={banners} />
        <SaleProductSection products={transformedSaleProducts} />
        <NegoProductSection products={transformedNegoProducts} />
        <RegularProductSection products={transformedRegularProducts} />
      </ScrollView>
    </View>
  );
}
