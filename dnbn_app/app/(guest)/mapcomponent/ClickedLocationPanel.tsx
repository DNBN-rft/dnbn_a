import { Ionicons } from "@expo/vector-icons";
import { Animated, Platform, Text, TouchableOpacity, View } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { ClickedLocation } from "../../../utils/map";
import { styles } from "../styles/map.styles";

interface ClickedLocationPanelProps {
  clickedLocation: ClickedLocation;
  clickedLocationAnim: Animated.Value;
  onClose: () => void;
  onSearchNearbyStores: () => void;
  insets: EdgeInsets;
}

export default function ClickedLocationPanel({
  clickedLocation,
  clickedLocationAnim,
  onClose,
  onSearchNearbyStores,
  insets,
}: ClickedLocationPanelProps) {
  return (
    <Animated.View
      style={[
        styles.clickedLocationContainer,
        {
          transform: [{ translateY: clickedLocationAnim }],
          pointerEvents: "auto",
          bottom: Platform.OS === "ios" ? insets.bottom + 49 : 0,
          paddingBottom: 16,
        },
      ]}
    >
      <View style={styles.clickedLocationContent}>
        <View style={styles.clickedLocationHeader}>
          <TouchableOpacity
            style={styles.clickedLocationCloseButton}
            onPress={onClose}
          >
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <Text style={styles.clickedLocationAddress}>
          {clickedLocation.address || "주소 로딩중..."}
        </Text>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={onSearchNearbyStores}
        >
          <Ionicons name="search" size={20} color="#fff" />
          <Text style={styles.searchButtonText}>주변 가맹점 검색</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
