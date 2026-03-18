import { Ionicons } from "@expo/vector-icons";
import {
  Animated,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { Store } from "../../../utils/map";
import { styles } from "../styles/map.styles";
import DraggableBottomSheet from "./DraggableBottomSheet";

interface StoreListPanelProps {
  stores: Store[];
  storeListAnim: Animated.Value;
  insets: EdgeInsets;
  maxHeight?: number;
  onSelectStore: (store: Store) => void;
  onClose: () => void;
}

export default function StoreListPanel({
  stores,
  storeListAnim,
  insets,
  maxHeight,
  onSelectStore,
  onClose,
}: StoreListPanelProps) {
  return (
    <DraggableBottomSheet
      slideAnim={storeListAnim}
      collapsedHeight={340}
      maxHeight={maxHeight}
      onClose={onClose}
      zIndex={10}
    >
      {/* 헤더 */}
      <View style={styles.storeListHeader}>
        <Text style={styles.storeListTitle}>주변 가맹점</Text>
      </View>
      {/* 목록 */}
      <FlatList
        data={stores}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.storeListItem}
            onPress={() => onSelectStore(item)}
          >
            {/* 왼쪽: 가게 정보 */}
            <View style={styles.storeDetailInfo}>
              {/* 이름 & 업태 */}
              <View style={styles.storeNameRow}>
                <Text style={styles.storeListItemName}>{item.name}</Text>
                {item.category && (
                  <Text style={styles.storeCategory}>{item.category}</Text>
                )}
              </View>
              {/* 별점 & 리뷰수 */}
              {item.reviewAvg != null && (
                <View style={styles.storeRatingRow}>
                  <Ionicons name="star" size={12} color="#EF7810" />
                  <Text style={styles.storeRatingText}>
                    {Number(item.reviewAvg).toFixed(1)}
                  </Text>
                  {item.reviewCount != null && (
                    <Text style={styles.storeReviewCount}>
                      ({item.reviewCount})
                    </Text>
                  )}
                </View>
              )}
              {/* 주소 & 거리 */}
              <View style={styles.storeAddressRow}>
                <Text style={styles.storeListItemAddress} numberOfLines={1}>
                  {item.address}
                </Text>
                {item.distance != null && (
                  <Text style={styles.storeDistance}>
                    {item.distance < 1
                      ? `${Math.round(item.distance * 1000)}m`
                      : `${item.distance.toFixed(1)}km`}
                  </Text>
                )}
              </View>
            </View>
            {/* 오른쪽: 대표 이미지 */}
            <View style={styles.storeDetailImageWrapper}>
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.storeDetailImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.storeDetailImagePlaceholder}>
                  <Ionicons name="storefront-outline" size={24} color="#ccc" />
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        nestedScrollEnabled
        scrollEnabled
        style={{ flex: 1 }}
      />
    </DraggableBottomSheet>
  );
}
