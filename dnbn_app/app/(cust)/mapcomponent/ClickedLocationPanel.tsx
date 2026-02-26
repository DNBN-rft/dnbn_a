import { Ionicons } from "@expo/vector-icons";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { ClickedLocation } from "../../../utils/map";
import { styles } from "../styles/map.styles";

interface ClickedLocationPanelProps {
  clickedLocation: ClickedLocation;
  clickedLocationAnim: Animated.Value;
  onClose: () => void;
  onSearchNearbyStores: () => void;
}

export default function ClickedLocationPanel({
  clickedLocation,
  clickedLocationAnim,
  onClose,
  onSearchNearbyStores,
}: ClickedLocationPanelProps) {
  return (
    <Animated.View
      style={[
        styles.clickedLocationContainer,
        { 
          transform: [{ translateY: clickedLocationAnim }],
          pointerEvents: "auto",
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
