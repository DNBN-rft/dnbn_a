import { shareStore } from "@/utils/kakaoShareUtil";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Animated,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Store } from "../../../utils/map";
import { styles } from "../styles/map.styles";
import DraggableBottomSheet from "./DraggableBottomSheet";

interface StoreDetailPanelProps {
  selectedStore: Store;
  slideAnim: Animated.Value;
  maxHeight?: number;
  onClose: () => void;
}

export default function StoreDetailPanel({
  selectedStore,
  slideAnim,
  maxHeight,
  onClose,
}: StoreDetailPanelProps) {
  return (
    <DraggableBottomSheet
      slideAnim={slideAnim}
      collapsedHeight={380}
      maxHeight={maxHeight}
      onClose={onClose}
      zIndex={30}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.storeDetailContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.storeDetailInfoWrapper}>
          {/* 왼쪽: 가게 정보 */}
          <View style={styles.storeDetailInfo}>
            {/* 가게 이름 & 업태 */}
            <View style={styles.storeNameRow}>
              <Text style={styles.storeName}>{selectedStore.name}</Text>
              {selectedStore.category && (
                <Text style={styles.storeCategory}>
                  {selectedStore.category}
                </Text>
              )}
            </View>
            {/* 별점 & 총 리뷰수 */}
            {selectedStore.reviewAvg != null && (
              <View style={styles.storeRatingRow}>
                <Ionicons name="star" size={13} color="#EF7810" />
                <Text style={styles.storeRatingText}>
                  {Number(selectedStore.reviewAvg).toFixed(1)}
                </Text>
                {selectedStore.reviewCount != null && (
                  <Text style={styles.storeReviewCount}>
                    ({selectedStore.reviewCount})
                  </Text>
                )}
              </View>
            )}
            {/* 주소 & 거리 */}
            <View style={styles.storeAddressRow}>
              <Text style={styles.storeAddress} numberOfLines={2}>
                {selectedStore.address}
              </Text>
              {selectedStore.distance != null && (
                <Text style={styles.storeDistance}>
                  {selectedStore.distance < 1
                    ? `${Math.round(selectedStore.distance * 1000)}m`
                    : `${selectedStore.distance.toFixed(1)}km`}
                </Text>
              )}
            </View>
          </View>
          {/* 오른쪽: 대표 이미지 */}
          <View style={styles.storeDetailImageWrapper}>
            {selectedStore.imageUrl ? (
              <Image
                source={{ uri: selectedStore.imageUrl }}
                style={styles.storeDetailImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.storeDetailImagePlaceholder}>
                <Ionicons name="storefront-outline" size={32} color="#ccc" />
              </View>
            )}
          </View>
        </View>
        <View style={{ width: "100%" }}>
          {/* 기능 탭: 연락처 / 관심매장 / 공유 */}
          <View style={styles.storeActionRow}>
            <TouchableOpacity
              style={styles.storeActionBtn}
              onPress={() =>
                selectedStore.phone
                  ? Linking.openURL(`tel:${selectedStore.phone}`)
                  : undefined
              }
              disabled={!selectedStore.phone}
            >
              <Ionicons
                name="call-outline"
                size={22}
                color={selectedStore.phone ? "#333" : "#ccc"}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.storeActionBtn}>
              <Ionicons name="heart-outline" size={22} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.storeActionBtn}
              onPress={() =>
                shareStore({
                  storeCode: selectedStore.storeCode ?? "",
                  storeNm: selectedStore.name,
                  imageUrl: selectedStore.imageUrl,
                })
              }
            >
              <Ionicons name="share-social-outline" size={22} color="#333" />
            </TouchableOpacity>
          </View>
          {/* 최근 등록 상품 상위 3개 */}
          <View style={styles.recentProductsSection}>
            <Text style={styles.recentProductsTitle}>최근 등록 상품</Text>
            {selectedStore.recentProducts &&
            selectedStore.recentProducts.length > 0 ? (
              <View style={styles.recentProductsRow}>
                {selectedStore.recentProducts.slice(0, 3).map((product) => (
                  <TouchableOpacity
                    key={product.id}
                    style={styles.recentProductCard}
                    activeOpacity={0.75}
                    onPress={() =>
                      product.productCode &&
                      router.push({
                        pathname: "/(guest)/product-detail",
                        params: { productCode: product.productCode },
                      })
                    }
                    disabled={!product.productCode}
                  >
                    <View style={{ position: "relative" }}>
                      {product.imageUrl ? (
                        <Image
                          source={{ uri: product.imageUrl }}
                          style={styles.recentProductImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.recentProductPlaceholder}>
                          <Ionicons
                            name="image-outline"
                            size={24}
                            color="#ccc"
                          />
                        </View>
                      )}
                      {(product.sale || product.nego) && (
                        <View style={styles.recentProductBadgeRow}>
                          {product.sale && (
                            <View
                              style={[
                                styles.recentProductBadge,
                                styles.recentProductBadgeSale,
                              ]}
                            >
                              <Text style={styles.recentProductBadgeText}>
                                할인
                              </Text>
                            </View>
                          )}
                          {product.nego && (
                            <View
                              style={[
                                styles.recentProductBadge,
                                styles.recentProductBadgeNego,
                              ]}
                            >
                              <Text style={styles.recentProductBadgeText}>
                                네고
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                    <View style={styles.recentProductCardInfo}>
                      {product.name && (
                        <Text
                          style={styles.recentProductName}
                          numberOfLines={2}
                        >
                          {product.name}
                        </Text>
                      )}
                      {product.price != null && (
                        <Text style={styles.recentProductPrice}>
                          {product.price.toLocaleString()}원
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={styles.recentProductsEmpty}>
                등록된 상품이 아직 없어요
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
      {/* 상세보기 버튼 - 항상 하단 고정 */}
      <TouchableOpacity
        style={styles.storeDetailViewButton}
        onPress={() =>
          router.push({
            pathname: "/(cust)/storeInfo",
            params: { storeCode: selectedStore.storeCode ?? selectedStore.id },
          })
        }
      >
        <Text style={styles.storeDetailViewButtonText}>더보기</Text>
        <Ionicons name="chevron-forward" size={16} color="#fff" />
      </TouchableOpacity>
    </DraggableBottomSheet>
  );
}
