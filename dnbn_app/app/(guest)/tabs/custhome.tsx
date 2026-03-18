import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BannerCarousel from "../components/BannerCarousel";
import NegoProductSection from "../components/NegoProductSection";
import RegularProductSection from "../components/RegularProductSection";
import SaleProductSection from "../components/SaleProductSection";
import { styles } from "../styles/custhome.styles";

export default function CustHomeScreen() {
  const insets = useSafeAreaInsets();
  const [loginVisible, setLoginVisible] = useState(false);

  const negoProducts: any[] = [];
  const saleProducts: any[] = [];
  const regularProducts: any[] = [];
  const bannerProducts: any[] = [];

  const transformedNegoProducts = negoProducts.map((item) => ({
    id: item.productCode,
    uri: item.images?.files?.[0]?.fileUrl
      ? { uri: item.images.files[0].fileUrl }
      : null,
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
        : null,
      productName: item.productNm,
      storeName: item.storeNm,
      discount: discountPercent,
      price: item.discountPrice,
    };
  });

  const transformedRegularProducts = regularProducts.map((item) => ({
    id: item.productCode,
    uri: item.productImg?.fileUrl ? { uri: item.productImg.fileUrl } : null,
    productName: item.productNm,
    storeName: item.storeNm,
    price: item.price,
  }));

  const transformedBanners = bannerProducts.slice(0, 5).map((item) => {
    const images = item.fileMasterResponse?.files || [];
    const sortedImages = [...images].sort((a, b) => a.order - b.order);
    const firstImage = sortedImages[0];

    return {
      id: item.productCode,
      uri: firstImage?.fileUrl ? { uri: firstImage.fileUrl } : null,
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

      <Modal
        visible={loginVisible}
        animationType="none"
        transparent={false}
        onRequestClose={() => setLoginVisible(false)}
      >
        <View style={[loginScreenStyles.container, { paddingTop: insets.top }]}>
          <Ionicons name="lock-closed-outline" size={64} color="#EF7810" />
          <Text style={loginScreenStyles.message}>로그인 후 이용 가능합니다</Text>
          <TouchableOpacity
            style={loginScreenStyles.backButton}
            onPress={() => setLoginVisible(false)}
          >
            <Text style={loginScreenStyles.backButtonText}>뒤로 가기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={loginScreenStyles.loginButton}
            onPress={() => {
              setLoginVisible(false);
              router.push("/(auth)/login");
            }}
          >
            <Text style={loginScreenStyles.loginButtonText}>로그인 하러 가기</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setLoginVisible(true)}
          >
            <Ionicons name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setLoginVisible(true)}
          >
            <Ionicons name="cart-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

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

const loginScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 24,
  },
  message: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 12,
  },
  backButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EF7810",
    alignItems: "center",
    marginTop: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: "#EF7810",
    fontWeight: "500",
  },
  loginButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#EF7810",
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});
