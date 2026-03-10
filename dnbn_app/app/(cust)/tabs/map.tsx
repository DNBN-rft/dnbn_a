import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { useMapActions } from "../../../hooks/useMapActions";
import { useMapState } from "../../../hooks/useMapState";
import { usePanelManager } from "../../../hooks/usePanelManager";
import { DEFAULT_LOCATION, slideUp } from "../../../utils/map";
import AddressSearchModal from "../mapcomponent/AddressSearchModal";
import ClickedLocationPanel from "../mapcomponent/ClickedLocationPanel";
import StoreDetailPanel from "../mapcomponent/StoreDetailPanel";
import StoreListPanel from "../mapcomponent/StoreListPanel";
import { styles } from "../styles/map.styles";

export default function CustMapScreen() {
  const { searchAddress } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);
  const [webViewKey, setWebViewKey] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [headerAreaHeight, setHeaderAreaHeight] = useState(0);
  const panelMaxHeight =
    containerHeight > 0 && headerAreaHeight > 0
      ? containerHeight - headerAreaHeight
      : undefined;

  const reloadWebView = useCallback(() => {
    setWebViewKey((k) => k + 1);
  }, []);

  // 상태 관리 훅
  const {
    selectedStore,
    stores,
    userLocation,
    isLoading,
    isMapReady,
    isLocationReady,
    showAddressSearch,
    clickedLocation,
    showStoreList,
    setSelectedStore,
    setStores,
    setUserLocation,
    setIsLoading,
    setIsMapReady,
    setIsLocationReady,
    setShowAddressSearch,
    setClickedLocation,
    setShowStoreList,
  } = useMapState();

  // 패널 관리 훅
  const { slideAnim, clickedLocationAnim, storeListAnim, closeAllPanels } =
    usePanelManager({
      clickedLocation,
      selectedStore,
      showStoreList,
      setClickedLocation,
      setSelectedStore,
      setShowStoreList,
    });

  // 액션 핸들러 훅
  const {
    handleGeocodeAddress,
    handleWebViewMessage,
    handleWebViewLoadEnd,
    handleWebViewError,
    handleSearchFocus,
    handleCenterToUser,
    handleCloseStoreInfo,
    handleSelectStoreFromList,
    handleSearchNearbyStores,
    handleCloseClickedLocation,
    handleCloseStoreList,
    handleLocationSelection,
    initLocation,
  } = useMapActions({
    reloadWebView,
    webViewRef,
    selectedStore,
    stores,
    userLocation,
    clickedLocation,
    showStoreList,
    setSelectedStore,
    setStores,
    setUserLocation,
    setIsLoading,
    setIsMapReady,
    setIsLocationReady,
    setShowAddressSearch,
    setClickedLocation,
    setShowStoreList,
    slideAnim,
    clickedLocationAnim,
    storeListAnim,
    closeAllPanels,
  });

  // 초기 로드: 위치 정보 가져오기
  useLayoutEffect(() => {
    initLocation();
  }, [initLocation]);

  // 지도와 위치 모두 준비되면 지도에 표시 + 주변 가맹점 조회
  useLayoutEffect(() => {
    if (!isMapReady || !isLocationReady) {
      return;
    }

    const initializeMap = async () => {
      try {
        // searchAddress 파라미터가 있으면 해당 주소로 검색
        if (searchAddress && typeof searchAddress === "string") {
          await handleGeocodeAddress(searchAddress);
        } else if (userLocation) {
          // 초기 진입 시 보정 없이 중앙에 표시
          await handleLocationSelection(
            userLocation.coords.latitude,
            userLocation.coords.longitude,
            false,
          );
        } else {
          await handleLocationSelection(
            DEFAULT_LOCATION.latitude,
            DEFAULT_LOCATION.longitude,
            false,
          );
        }
      } catch (error) {
        console.error("Map initialization error:", error);
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      initializeMap();
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMapReady, isLocationReady, searchAddress]);

  // isMapReady 타임아웃 폴백: 15초 내에 지도가 준비되지 않으면 강제로 기본 위치로 진행
  useLayoutEffect(() => {
    if (isMapReady) return;
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 15000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMapReady]);

  // 가맹점 선택 시 패널 애니메이션
  useLayoutEffect(() => {
    if (selectedStore) {
      slideUp(slideAnim, 300);
    }
  }, [selectedStore?.id, slideAnim]);

  return (
    <View
      style={styles.container}
      onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
    >
      {insets.top > 0 && (
        <View style={[styles.statusBar, { height: insets.top }]} />
      )}

      <View
        style={styles.header}
        onLayout={(e) =>
          setHeaderAreaHeight(
            e.nativeEvent.layout.y + e.nativeEvent.layout.height,
          )
        }
      >
        <View style={styles.leftSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.centerSection}>
          <Text style={styles.title}>지도</Text>
        </View>
        <View style={styles.rightSection}>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={handleCenterToUser}
          >
            <Ionicons name="locate" size={24} color="#EF7810" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mapContainer}>
        <WebView
          key={webViewKey}
          ref={webViewRef}
          source={{ uri: "https://dnbn-x5or.onrender.com/map-view" }}
          style={styles.webView}
          scrollEnabled={true}
          scalesPageToFit={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          mixedContentMode="always"
          onLoadEnd={handleWebViewLoadEnd}
          onError={handleWebViewError}
          onHttpError={handleWebViewError}
          onMessage={handleWebViewMessage}
          originWhitelist={["*"]}
        />
        <View style={styles.searchContainer}>
          <TouchableOpacity
            style={styles.textInput}
            onPress={handleSearchFocus}
            activeOpacity={0.7}
          >
            <Text style={styles.searchTextPlaceholder}>
              원하시는 지역을 검색하세요
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 주소 검색 모달 */}
      <AddressSearchModal
        visible={showAddressSearch}
        insets={insets}
        onClose={() => setShowAddressSearch(false)}
        onAddressSelected={handleGeocodeAddress}
      />

      {/* 로딩 오버레이 */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#EF7810" />
          <Text style={styles.loadingText}>로딩중입니다</Text>
        </View>
      )}

      {/* 클릭한 좌표 정보 패널 */}
      {clickedLocation && (
        <ClickedLocationPanel
          clickedLocation={clickedLocation}
          clickedLocationAnim={clickedLocationAnim}
          onClose={handleCloseClickedLocation}
          onSearchNearbyStores={handleSearchNearbyStores}
        />
      )}

      {/* 선택된 가맹점 정보 표시 */}
      {selectedStore && (
        <StoreDetailPanel
          selectedStore={selectedStore}
          slideAnim={slideAnim}
          maxHeight={panelMaxHeight}
          onClose={handleCloseStoreInfo}
        />
      )}

      {/* 가맹점 목록 */}
      {showStoreList && stores.length > 0 && (
        <StoreListPanel
          stores={stores}
          storeListAnim={storeListAnim}
          insets={insets}
          maxHeight={panelMaxHeight}
          onSelectStore={handleSelectStoreFromList}
          onClose={handleCloseStoreList}
        />
      )}
    </View>
  );
}
