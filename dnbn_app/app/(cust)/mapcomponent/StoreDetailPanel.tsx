import { Ionicons } from "@expo/vector-icons";
import { Animated, Image, Text, TouchableOpacity, View } from "react-native";
import { Store } from "../../../utils/map";
import { styles } from "../styles/map.styles";

interface StoreDetailPanelProps {
  selectedStore: Store;
  slideAnim: Animated.Value;
  onClose: () => void;
}

export default function StoreDetailPanel({
  selectedStore,
  slideAnim,
  onClose,
}: StoreDetailPanelProps) {
  return (
    <Animated.View
      style={[
        styles.storeDetailContainer,
        {
          transform: [{ translateY: slideAnim }],
          pointerEvents: "auto",
        },
      ]}
    >
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={24} color="#333" />
      </TouchableOpacity>
      <View style={styles.storeDetailContent}>
        {/* 왼쪽: 가게 정보 */}
        <View style={styles.storeDetailInfo}>
          <Text style={styles.storeName}>{selectedStore.name}</Text>
          <Text style={styles.storeAddress}>{selectedStore.address}</Text>
          {selectedStore.phone && (
            <Text style={styles.storePhone}>{selectedStore.phone}</Text>
          )}
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
    </Animated.View>
  );
}
