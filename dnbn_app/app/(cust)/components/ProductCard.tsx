import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../storeInfo.styles";
import type {
  NegoProduct,
  Product,
  SaleProduct,
} from "../types/storeInfo.types";

type AnyProduct = Product | SaleProduct | NegoProduct;

interface ProductCardProps {
  item: AnyProduct;
  productCode?: string;
}

function formatSaleTime(isoString: string): string {
  const d = new Date(isoString);
  const month = d.getMonth() + 1;
  const date = d.getDate();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${month}/${date} ${hours}:${minutes}`;
}

export function ProductCard({ item, productCode }: ProductCardProps) {
  const code = productCode || item.productCode;
  const [upcomingModal, setUpcomingModal] = useState<{
    title: string;
    message: string;
  } | null>(null);
  const rawDiscounted =
    "discountedPrice" in item
      ? (item as SaleProduct).discountedPrice
      : undefined;
  const rawProductPrice =
    "productPrice" in item
      ? (item as Product | NegoProduct).productPrice
      : undefined;
  const displayPrice = rawDiscounted ?? rawProductPrice ?? 0;
  const rawOriginal =
    "originalPrice" in item ? (item as SaleProduct).originalPrice : undefined;
  const originalPrice = rawOriginal != null ? rawOriginal : undefined;
  const rating =
    "averageReviewRating" in item
      ? { avg: item.averageReviewRating, count: item.reviewCount }
      : undefined;

  // 할인 상품 전용 정보
  const saleProduct = "saleType" in item ? (item as SaleProduct) : undefined;
  const discountBadge =
    saleProduct && originalPrice != null && rawDiscounted != null
      ? saleProduct.saleType === "할인률"
        ? `${saleProduct.saleValue}% 할인`
        : `${saleProduct.saleValue.toLocaleString()}원 할인`
      : undefined;
  const saleTimeLabel = saleProduct
    ? saleProduct.saleStatus === "할인 중"
      ? `~${formatSaleTime(saleProduct.endDateTime)} 종료`
      : `${formatSaleTime(saleProduct.startDateTime)} 시작 예정`
    : undefined;
  const saleStatusLabel = saleProduct
    ? saleProduct.saleStatus === "할인 중" ? "할인 중" : "할인 예정"
    : undefined;

  // 네고 상품 전용 정보
  const negoProduct = "negoStatus" in item ? (item as NegoProduct) : undefined;
  const negoTimeLabel = negoProduct
    ? negoProduct.negoStatus === "진행 중"
      ? `~${formatSaleTime(negoProduct.endDateTime)} 종료`
      : `${formatSaleTime(negoProduct.startDateTime)} 시작 예정`
    : undefined;
  const negoStatusLabel = negoProduct
    ? negoProduct.negoStatus === "진행 중"
      ? "네고 중"
      : "네고 예정"
    : undefined;

  const handlePress = () => {
    if (saleProduct) {
      if (saleProduct.saleStatus === "할인 전") {
        setUpcomingModal({
          title: item.productNm,
          message: `${formatSaleTime(saleProduct.startDateTime)}부터 할인이 시작됩니다.`,
        });
        return;
      }
      router.push({
        pathname: "/(cust)/sale-product-detail",
        params: { productCode: code },
      });
    } else if (negoProduct) {
      if (negoProduct.negoStatus === "예정") {
        setUpcomingModal({
          title: item.productNm,
          message: `${formatSaleTime(negoProduct.startDateTime)}부터 네고가 시작됩니다.`,
        });
        return;
      }
      router.push({
        pathname: "/(cust)/nego-product-detail",
        params: { productCode: code },
      });
    } else {
      router.push({
        pathname: "/(cust)/product-detail",
        params: { productCode: code },
      });
    }
  };

  return (
    <>
      <Pressable style={styles.storeProductItemContainer} onPress={handlePress}>
        {item.productImage?.files?.[0]?.fileUrl ? (
          <View style={styles.storeProductImgWrapper}>
            <Image
              resizeMode="cover"
              source={{ uri: item.productImage.files[0].fileUrl }}
              style={styles.storeProductImgContainer}
            />
            {saleStatusLabel && (
              <View
                style={[
                  modalStyles.negoBadge,
                  saleProduct?.saleStatus === "할인 중"
                    ? modalStyles.saleBadgeActive
                    : modalStyles.saleBadgeUpcoming,
                ]}
              >
                <Text style={modalStyles.negoBadgeText}>{saleStatusLabel}</Text>
              </View>
            )}
            {negoStatusLabel && (
              <View
                style={[
                  modalStyles.negoBadge,
                  negoProduct?.negoStatus === "진행 중"
                    ? modalStyles.negoBadgeActive
                    : modalStyles.negoBadgeUpcoming,
                ]}
              >
                <Text style={modalStyles.negoBadgeText}>{negoStatusLabel}</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={[styles.storeProductImgWrapper]}>
            <View
              style={[styles.storeProductImgContainer, styles.placeholderImage]}
            >
              <Ionicons name="image-outline" size={40} color="#ccc" />
            </View>
            {saleStatusLabel && (
              <View
                style={[
                  modalStyles.negoBadge,
                  saleProduct?.saleStatus === "할인 중"
                    ? modalStyles.saleBadgeActive
                    : modalStyles.saleBadgeUpcoming,
                ]}
              >
                <Text style={modalStyles.negoBadgeText}>{saleStatusLabel}</Text>
              </View>
            )}
            {negoStatusLabel && (
              <View
                style={[
                  modalStyles.negoBadge,
                  negoProduct?.negoStatus === "진행 중"
                    ? modalStyles.negoBadgeActive
                    : modalStyles.negoBadgeUpcoming,
                ]}
              >
                <Text style={modalStyles.negoBadgeText}>{negoStatusLabel}</Text>
              </View>
            )}
          </View>
        )}
        <Text
          style={styles.storeProductNmText}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.productNm}
        </Text>
        {originalPrice !== undefined && (
          <View style={styles.saleOriginalRow}>
            <Text style={styles.originalPriceText}>
              {originalPrice.toLocaleString()}원
            </Text>
            {discountBadge && (
              <Text style={styles.discountBadgeText}>{discountBadge}</Text>
            )}
          </View>
        )}
        <Text style={styles.priceText}>{displayPrice.toLocaleString()}원</Text>
        {saleTimeLabel && (
          <Text style={styles.saleTimeText}>{saleTimeLabel}</Text>
        )}
        {negoTimeLabel && (
          <Text style={styles.saleTimeText}>{negoTimeLabel}</Text>
        )}
        {rating && (
          <Text style={styles.productRatingText}>
            <Ionicons name="star" size={13} color="#FFD700" />{" "}
            {rating.avg.toFixed(1)} ({rating.count})
          </Text>
        )}
      </Pressable>

      <Modal
        visible={upcomingModal !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setUpcomingModal(null)}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.container}>
            <Ionicons
              name="time-outline"
              size={36}
              color="#ef7810"
              style={modalStyles.icon}
            />
            <Text style={modalStyles.title}>{upcomingModal?.title}</Text>
            <Text style={modalStyles.message}>{upcomingModal?.message}</Text>
            <TouchableOpacity
              style={modalStyles.button}
              onPress={() => setUpcomingModal(null)}
            >
              <Text style={modalStyles.buttonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#ef7810",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  negoBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  negoBadgeActive: {
    backgroundColor: "#4A90D9",
  },
  negoBadgeUpcoming: {
    backgroundColor: "#888",
  },
  negoBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  saleBadgeActive: {
    backgroundColor: "#FF6B6B",
  },
  saleBadgeUpcoming: {
    backgroundColor: "#888",
  },
});
