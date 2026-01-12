import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./map.styles";

export default function CustMapScreen() {
  const navigation = useNavigation();
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const insets = useSafeAreaInsets();

  // 가맹점 선택 시 탭 숨기기/보이기
  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: {
        display: selectedStore ? 'none' : 'flex',
      },
    });
  }, [selectedStore, navigation]);

  // 가맹점 선택 핸들러 (예시)
  const handleStoreSelect = (store: any) => {
    setSelectedStore(store);
    // 여기서 가맹점 정보를 화면에 표시
  };

  // 가맹점 정보 닫기
  const handleCloseStoreInfo = () => {
    setSelectedStore(null);
  };

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#000" }} />
      )}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title} pointerEvents="none">
          내 위치 설정
        </Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.content}>
        <TextInput
          placeholder="가맹점이나 지역을 검색하세요"
          style={styles.textInput}
          placeholderTextColor="#999"
        />
        {/* 지도 API 영역 */}
        {/* 지도 마커 클릭 시 handleStoreSelect(storeData) 호출 */}

        {/* 선택된 가맹점 정보 표시 */}
        {selectedStore && (
          <View style={styles.storeInfoContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseStoreInfo}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.storeName}>{selectedStore.name}</Text>
            <Text style={styles.storeAddress}>{selectedStore.address}</Text>
            {/* 추가 가맹점 정보 */}
          </View>
        )}
      </View>
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
