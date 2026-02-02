import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Linking, Pressable, Text, View } from "react-native";
import { styles } from "../storeInfo.styles";
import type { StoreInfoResponse } from "../types/storeInfo.types";

interface StoreHeaderProps {
  storeInfo: StoreInfoResponse;
  activeTab: "product" | "review";
  onTabChange: (tab: "product" | "review") => void;
  onWishClick: () => void;
  isWishStore: boolean;
  storeCode?: string;
}

export function StoreHeader({
  storeInfo,
  activeTab,
  onTabChange,
  onWishClick,
  isWishStore,
  storeCode,
}: StoreHeaderProps) {
  return (
    <>
      {/* 가게 이미지 */}
      <View style={styles.storeImgContainer}>
        {storeInfo.storeImage?.files?.[0]?.fileUrl ? (
          <Image
            source={{ uri: storeInfo.storeImage.files[0].fileUrl }}
            style={styles.storeImg}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderStoreImg}>
            <Ionicons name="storefront-outline" size={60} color="#ccc" />
          </View>
        )}
      </View>

      {/* 기능 버튼들 */}
      <View style={styles.actionButtonsRow}>
        <Pressable style={styles.actionButton}>
          <Ionicons name="share-social-outline" size={24} color="#666" />
          <Text style={styles.actionButtonText}>공유</Text>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={onWishClick}>
          <Ionicons
            name={isWishStore ? "heart" : "heart-outline"}
            size={24}
            color="#FF6B6B"
          />
          <Text style={styles.actionButtonText}>
            {isWishStore ? "해제하기" : "관심등록"}
          </Text>
        </Pressable>

        <Pressable
          style={styles.actionButton}
          onPress={() => Linking.openURL(`tel:${storeInfo.storeTel}`)}
        >
          <Ionicons name="call-outline" size={24} color="#666" />
          <Text style={styles.actionButtonText}>전화</Text>
        </Pressable>

        <Pressable
          style={styles.actionButton}
          onPress={() =>
            router.push(`/(cust)/report?storeCode=${storeCode}&type=STORE`)
          }
        >
          <Ionicons name="flag-outline" size={24} color="#666" />
          <Text style={styles.actionButtonText}>신고</Text>
        </Pressable>
      </View>

      {/* 가게 정보 영역 */}
      <View style={styles.storeInfoContainer}>
        <View style={styles.storeNameRatingRow}>
          <Text style={styles.storeNameText}>{storeInfo.storeNm}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.storeRatingText}>
              {storeInfo.averageReviewRating.toFixed(1)}(
              {storeInfo.totalReviewCount})
            </Text>
          </View>
        </View>

        <Pressable style={styles.addressRow}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.addressText}>{storeInfo.storeAddress}</Text>
          <Ionicons name="chevron-forward" size={16} color="#999" />
        </Pressable>
      </View>

      {/* 상품/리뷰 탭 */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[
            styles.tabButton,
            activeTab === "product" && styles.tabButtonActive,
          ]}
          onPress={() => onTabChange("product")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "product" && styles.tabTextActive,
            ]}
          >
            상품({storeInfo.totalProductCount || 0})
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.tabButton,
            activeTab === "review" && styles.tabButtonActive,
          ]}
          onPress={() => onTabChange("review")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "review" && styles.tabTextActive,
            ]}
          >
            리뷰({storeInfo.totalReviewCount || 0})
          </Text>
        </Pressable>
      </View>
    </>
  );
}
