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
  const [cartItemCount, setCartItemCount] = useState(0);
  const [defaultLocation, setDefaultLocation] =
    useState<string>("주소 로딩 중...");
  const [userType, setUserType] = useState<string | null>(null);

  // 읽지 않은 알림 확인 함수
  const checkUnreadAlarm = async () => {
    try {
      const response = await apiGet(`/cust/alarm/unread`);

      if (response.ok) {
        const data = await response.json();
        setHasUnreadAlarm(data === true);
      }
    } catch (error) {
      console.error("읽지 않은 알림 확인 중 오류:", error);
    }
  };

  // 장바구니 아이템 개수 조회 함수
  const fetchCartItemCount = async () => {
    try {
      const response = await apiGet(`/cust/cart/cnt`);

      if (response.ok) {
        const data = await response.json();
        setCartItemCount(data.totalCount);
      }
    } catch (error) {
      console.error("장바구니 개수 조회 중 오류:", error);
    }
  };

  // 기본 주소 조회 함수
  const fetchDefaultLocation = async () => {
    try {
      // userType 확인
      let currentUserType: string | null = null;
      if (Platform.OS === "web") {
        currentUserType = localStorage.getItem("userType");
      } else {
        currentUserType = await SecureStore.getItemAsync("userType");
      }

      // store 사용자인 경우 저장된 가맹점 주소 사용
      if (currentUserType === "store") {
        let storeAddress: string | null = null;
        if (Platform.OS === "web") {
          storeAddress = localStorage.getItem("storeAddress");
        } else {
          storeAddress = await SecureStore.getItemAsync("storeAddress");
        }

        if (storeAddress) {
          setDefaultLocation(storeAddress);
        } else {
          setDefaultLocation("주소 정보 없음");
        }
        return;
      }

      // cust 사용자인 경우 기본 주소 API 조회
      const response = await apiGet(
        `/cust/location/default`,
      );

      if (response.ok) {
        const data = await response.json();
        setDefaultLocation(data.label || "주소 정보 없음");
      } else {
        setDefaultLocation("주소 정보 없음");
      }
    } catch (error) {
      console.error("기본 주소 조회 중 오류:", error);
      setDefaultLocation("주소 정보 없음");
    }
  };

  // 페이지가 포커스될 때마다 모든 상품 데이터를 가져오기
  useFocusEffect(
    useCallback(() => {
      const fetchAllProducts = async () => {
        // userType 가져오기
        let currentUserType: string | null = null;
        if (Platform.OS === "web") {
          currentUserType = localStorage.getItem("userType");
        } else {
          currentUserType = await SecureStore.getItemAsync("userType");
        }
        setUserType(currentUserType);

        // 읽지 않은 알림 상태, 장바구니 개수, 기본 주소 확인
        checkUnreadAlarm();
        // store 사용자는 장바구니 개수를 가져오지 않음
        if (currentUserType !== "store") {
          fetchCartItemCount();
        }
        fetchDefaultLocation();

        try {
          const [negoResponse, saleResponse, regularResponse, bannerResponse] =
            await Promise.all([
              apiGet(`/cust/negoproducts/home`),
              apiGet(`/cust/sales/home`),
              apiGet(`/cust/regular/home`),
              apiGet(`/cust/sales/banner`), // 배너용 할인율 높은 상품
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
      item.saleType === "할인률"
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
            <Text
              style={[styles.addrText, userType === "store" && { fontSize: 13 }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {defaultLocation}
            </Text>
            {userType !== "store" && (
              <Ionicons name="chevron-down" size={24} color="#000" />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => {
              // userType에 따라 알람 페이지 분기
              if (userType === "store") {
                router.push("/(store)/notifications");
              } else {
                router.push("/(cust)/notifications");
              }
            }}
          >
            <Ionicons name="notifications-outline" size={24} color="#000" />
            {hasUnreadAlarm && <View style={styles.notificationBadge} />}
          </TouchableOpacity>
          {userType === "store" ? (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.push("/(store)/tabs/storehome")}
            >
              <Ionicons name="home-outline" size={24} color="#000" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.push("/(cust)/cart")}
            >
              <Ionicons name="cart-outline" size={24} color="#000" />
              {cartItemCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>
                    {cartItemCount > 9 ? "9+" : cartItemCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 스크롤 가능한 콘텐츠 */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === "ios" ? insets.bottom + 60 : 0,
        }}
      >
        <BannerCarousel banners={transformedBanners} />
        <SaleProductSection products={transformedSaleProducts} />
        <NegoProductSection products={transformedNegoProducts} />
        <RegularProductSection products={transformedRegularProducts} />
      </ScrollView>
    </View>
  );
}
