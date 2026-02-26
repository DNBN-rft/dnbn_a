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
import { Ionicons } from "@expo/vector-icons";

interface StoreListPanelProps {
  stores: Store[];
  storeListAnim: Animated.Value;
  insets: EdgeInsets;
  onSelectStore: (store: Store) => void;
  onClose: () => void;
}

export default function StoreListPanel({
  stores,
  storeListAnim,
  insets,
  onSelectStore,
  onClose,
}: StoreListPanelProps) {
  return (
    <Animated.View
      style={[
        styles.storeListContainer,
        {
          transform: [{ translateY: storeListAnim }],
          pointerEvents: "auto",
        },
      ]}
    >
      {/* 헤더 */}
      <View style={styles.storeListHeader}>
        <Text style={styles.storeListTitle}>주변 가맹점</Text>
        <TouchableOpacity style={styles.storeListCloseButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
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
              <Text style={styles.storeListItemName}>{item.name}</Text>
              <Text style={styles.storeListItemAddress}>{item.address}</Text>
              {item.phone && (
                <Text style={styles.storeListItemPhone}>{item.phone}</Text>
              )}
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
      />
    </Animated.View>
  );
}

