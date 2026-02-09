import Postcode from "@actbase/react-daum-postcode";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import {
  ClickedLocation,
  DEFAULT_LOCATION,
  fetchNearbyStores,
  geocodeAddress,
  getUserLocation as getLocation,
  reverseGeocode,
  slideDown,
  slideUp,
  Store,
  sendMessageToWebView,
  moveMapToLocation,
  setUserLocationWithZoom,
  addStoreMarkers,
  clearAllMarkers,
  highlightStoreMarker,
  createStoreDetailPanResponder,
  createStoreListPanResponder,
} from "../../../utils/map";
import { useMapPanels } from "../../../hooks/useMapPanels";
import { styles } from "../styles/map.styles";
import { generateMapHTML } from "./mapHtml";

const KAKAO_JAVASCRIPT_KEY = "46f0bc8ab705f2263a98ee3adeebd719";

export default function CustMapScreen() {
  const navigation = useNavigation();
  const { searchAddress } = useLocalSearchParams();
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isLocationReady, setIsLocationReady] = useState(false);
  const [showAddressSearch, setShowAddressSearch] = useState(false);
  const [clickedLocation, setClickedLocation] =
    useState<ClickedLocation | null>(null);
  const [showStoreList, setShowStoreList] = useState(false);
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);
  const scrollOffsetY = useRef(0);
  const mapHTML = useMemo(() => generateMapHTML(KAKAO_JAVASCRIPT_KEY), []);

  // 패널 관리 훅 사용
  const {
    slideAnim,
    clickedLocationAnim,
    storeListAnim,
    dragStartValue,
    storeListDragStartValue,
    closeClickedLocationPanel,
    closeStoreListPanel,
    closeStoreDetailPanel,
  } = useMapPanels();

  // 가맹점 상세 PanResponder
  const storeDetailPanResponder = useMemo(() => {
    return createStoreDetailPanResponder(
      slideAnim,
      dragStartValue,
      () => setSelectedStore(null)
    );
  }, [slideAnim, dragStartValue]);

  // 가맹점 목록 PanResponder
  const storeListPanResponder = useMemo(() => {
    return createStoreListPanResponder(
      storeListAnim,
      storeListDragStartValue,
      scrollOffsetY,
      () => setShowStoreList(false)
    );
  }, [storeListAnim, storeListDragStartValue]);

  const handleFetchNearbyStores = useCallback(
    async (latitude: number, longitude: number) => {
      try {
        // 기존 마커 제거
        sendMessageToWebView(webViewRef, {
          type: "clearMarkers",
        });

        const nearbyStores = await fetchNearbyStores(latitude, longitude);

        setStores(nearbyStores);
        if (nearbyStores.length > 0) {
          addStoreMarkers(webViewRef, nearbyStores);
        }
      } catch (error) {
        console.error("Fetch stores error:", error);
        setStores([]);
        sendMessageToWebView(webViewRef, {
          type: "clearMarkers",
        });
      }
    },
    [],
  );

  // 2. 좌표 설정 (지도 이동)
  const setLocationCoordinates = useCallback(
    (latitude: number, longitude: number, zoom: number = 3) => {
      setUserLocationWithZoom(webViewRef, latitude, longitude, zoom);
    },
    [],
  );

  // 지도 이동만 (마커 생성 없음)
  const handleMapNavigation = useCallback(
    (latitude: number, longitude: number, zoom: number = 2) => {
      moveMapToLocation(webViewRef, latitude, longitude, zoom);
    },
    [],
  );

  // 3. 위치 선택 처리 (좌표 설정 + 주변 가맹점 조회)
  const handleLocationSelection = useCallback(
    async (latitude: number, longitude: number) => {
      try {
        setLocationCoordinates(latitude, longitude);
        await handleFetchNearbyStores(latitude, longitude);

        // 가맹점 목록 표시
        setShowStoreList(true);
        slideUp(storeListAnim, 400);
        
        // 모든 작업 완료 후 로딩 종료
        setIsLoading(false);
      } catch (error) {
        console.error("Location selection error:", error);
        setIsLoading(false);
      }
    },
    [setLocationCoordinates, handleFetchNearbyStores, storeListAnim],
  );

  // Kakao REST API로 주소를 좌표로 변환
  const handleGeocodeAddress = useCallback(
    async (address: string) => {
      try {
        const result = await geocodeAddress(address);

        if (result) {
          // 기존 패널들 모두 닫기
          const promises: Promise<void>[] = [];

          // 클릭 위치 패널 닫기
          if (clickedLocation) {
            promises.push(
              new Promise<void>((resolve) => {
                slideDown(clickedLocationAnim, 500, 300, () => {
                  setClickedLocation(null);
                  resolve();
                });
              })
            );
          }

          // 상세보기 패널 닫기
          if (selectedStore) {
            promises.push(
              new Promise<void>((resolve) => {
                slideDown(slideAnim, 300, 300, () => {
                  setSelectedStore(null);
                  resolve();
                });
              })
            );
          }

          // 목록 패널 닫기
          if (showStoreList) {
            promises.push(
              new Promise<void>((resolve) => {
                slideDown(storeListAnim, 300, 300, () => {
                  setShowStoreList(false);
                  resolve();
                });
              })
            );
          }

          // 모든 패널이 닫힐 때까지 대기
          if (promises.length > 0) {
            await Promise.all(promises);
            // 애니메이션이 완전히 끝날 때까지 추가 대기
            await new Promise((resolve) => setTimeout(resolve, 100));
          }

          // 지도 이동
          await handleMapNavigation(result.latitude, result.longitude);

          // 주변 가맹점 조회
          await handleFetchNearbyStores(result.latitude, result.longitude);

          // 가맹점 목록 표시
          setShowStoreList(true);
          slideUp(storeListAnim, 400);
          
          // 모든 작업 완료 후 로딩 종료
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Geocode error:", error);
        setIsLoading(false);
      }
    },
    [handleMapNavigation, handleFetchNearbyStores, storeListAnim, clickedLocationAnim, slideAnim, clickedLocation, selectedStore, showStoreList],
  );

  const getUserLocation = useCallback(async () => {
    const location = await getLocation();
    setUserLocation(location);
    setIsLocationReady(true);
  }, []);

  // 좌표를 주소로 변환 (역지오코딩)
  const handleReverseGeocode = useCallback(
    async (latitude: number, longitude: number) => {
      const address = await reverseGeocode(latitude, longitude);

      setClickedLocation({
        latitude,
        longitude,
        address,
      });

      // 애니메이션 시작
      slideUp(clickedLocationAnim, 400);
    },
    [clickedLocationAnim],
  );

  // WebView 메시지 핸들러
  const handleWebViewMessage = useCallback(
    (event: any) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);

        if (data.type === "ready") {
          setIsMapReady(true);
        } else if (data.type === "mapReady") {
          setTimeout(() => {
            setIsLoading(false);
          }, 100);
        } else if (data.type === "storeSelected") {
          // 지도에서 마커 클릭 시 해당 마커를 주황색으로 강조
          highlightStoreMarker(webViewRef, data.store.id);

          // 목록이 열려있으면 먼저 닫기
          if (showStoreList) {
            slideDown(storeListAnim, 300, 300, () => {
              setShowStoreList(false);
            });
            // 목록이 닫힐 때까지 대기한 후 상세정보 표시
            setTimeout(() => {
              setSelectedStore(data.store);
            }, 350);
          } else {
            // 목록이 닫혀있으면 바로 상세정보 표시
            setSelectedStore(data.store);
          }
        } else if (data.type === "mapClicked") {
          // 새 위치 클릭 시 기존 패널들 닫기 (하나씩)
          slideDown(storeListAnim, 600, 300, () => {
            setShowStoreList(false);
          });
          slideDown(slideAnim, 300, 300, () => {
            setSelectedStore(null);
          });
          handleReverseGeocode(data.latitude, data.longitude);
        }
      } catch (error) {}
    },
    [
      handleReverseGeocode,
      storeListAnim,
      slideAnim,
      showStoreList,
    ],
  );

  const handleWebViewLoadEnd = useCallback(() => {
    // WebView가 완전히 준비될 때까지 대기
    setTimeout(() => {
      sendMessageToWebView(webViewRef, { type: "init" });
    }, 500);
  }, []);

  // WebView 에러 핸들러
  const handleWebViewError = useCallback((syntheticEvent: any) => {
    setIsLoading(false);
    Alert.alert(
      "지도 로드 오류",
      "지도를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.",
      [
        {
          text: "확인",
          onPress: () => router.back(),
        },
      ],
    );
  }, []);

  // 검색창 포커스 시 주소 검색 모달 열기
  const handleSearchFocus = useCallback(() => {
    setShowAddressSearch(true);
  }, []);

  // 현재 위치로 이동 + 주변 가맹점 조회
  const handleCenterToUser = useCallback(async () => {
    const promises: Promise<void>[] = [];

    // 클릭한 위치 패널 닫기
    if (clickedLocation) {
      promises.push(
        new Promise<void>((resolve) => {
          slideDown(clickedLocationAnim, 500, 300, () => {
            setClickedLocation(null);
            resolve();
          });
        })
      );
    }

    // 가맹점 상세정보 패널이 열려있으면 먼저 닫기
    if (selectedStore) {
      promises.push(
        new Promise<void>((resolve) => {
          slideDown(slideAnim, 300, 300, () => {
            setSelectedStore(null);
            resolve();
          });
        })
      );
    }

    // 목록 패널 닫기
    if (showStoreList) {
      promises.push(
        new Promise<void>((resolve) => {
          slideDown(storeListAnim, 300, 300, () => {
            setShowStoreList(false);
            resolve();
          });
        })
      );
    }
    
    // 패널이 닫힐 때까지 대기
    if (promises.length > 0) {
      await Promise.all(promises);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // WebView에서 모든 마커 제거 (클릭 마커 + 가맹점 마커)
    clearAllMarkers(webViewRef);

    if (userLocation) {
      await handleLocationSelection(
        userLocation.coords.latitude,
        userLocation.coords.longitude,
      );
    } else {
      const location = await getLocation();
      if (location) {
        setUserLocation(location);
        await handleLocationSelection(
          location.coords.latitude,
          location.coords.longitude,
        );
      }
    }
  }, [
    clickedLocationAnim,
    slideAnim,
    storeListAnim,
    handleLocationSelection,
    userLocation,
    clickedLocation,
    selectedStore,
    showStoreList,
  ]);

  // 가맹점 정보 닫기
  const handleCloseStoreInfo = useCallback(() => {
    slideDown(slideAnim, 300, 300, () => {
      setSelectedStore(null);
    });
  }, [slideAnim]);

  // 가맹점 목록에서 가맹점 클릭 (목록 먼저 닫고 상세정보 표시)
  const handleSelectStoreFromList = useCallback(
    async (store: Store) => {
      // 다른 패널이 열려있으면 먼저 닫기
      if (clickedLocation) {
        slideDown(clickedLocationAnim, 500, 300, () => {
          setClickedLocation(null);
        });
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      // 지도를 해당 가맹점 위치로 이동
      handleMapNavigation(store.latitude, store.longitude, 4);

      // 해당 가맹점 마커 강조
      highlightStoreMarker(webViewRef, store.id);

      // 목록 패널 닫기
      slideDown(storeListAnim, 300, 300, () => {
        setShowStoreList(false);
      });

      // 목록이 완전히 닫힌 후 상세정보 표시
      await new Promise((resolve) => setTimeout(resolve, 350));
      setSelectedStore(store);
    },
    [storeListAnim, clickedLocationAnim, handleMapNavigation, clickedLocation],
  );

  // 클릭한 위치 근처 가맹점 검색
  const handleSearchNearbyStores = useCallback(async () => {
    if (!clickedLocation) return;

    const { latitude, longitude } = clickedLocation;

    // 1. 먼저 지도를 클릭한 위치로 이동 (마커는 이미 있으므로 네비게이션만)
    await handleMapNavigation(latitude, longitude, 4);

    // 2. 가맹점 조회
    await handleFetchNearbyStores(latitude, longitude);

    // 3. 다른 패널들이 열려있으면 먼저 닫기
    if (selectedStore) {
      slideDown(slideAnim, 300, 300, () => {
        setSelectedStore(null);
      });
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    // 4. 클릭 위치 패널 닫기
    slideDown(clickedLocationAnim, 200, 300, () => {
      setClickedLocation(null);
    });

    // 5. 가맹점 목록 표시 (약간의 딜레이 후)
    setTimeout(() => {
      setShowStoreList(true);
      slideUp(storeListAnim, 400);
    }, 300);
  }, [
    clickedLocation,
    handleMapNavigation,
    handleFetchNearbyStores,
    clickedLocationAnim,
    storeListAnim,
    slideAnim,
    selectedStore,
  ]);

  // 클릭 패널 닫기
  const handleCloseClickedLocation = useCallback(() => {
    slideDown(clickedLocationAnim, 500, 300, () => {
      setClickedLocation(null);
    });
  }, [clickedLocationAnim]);

  // 모달 opened/closed 감시
  useLayoutEffect(() => {
    return () => {};
  }, [showAddressSearch]);

  // 초기 로드: 위치 정보 가져오기
  useLayoutEffect(() => {
    const initLocation = async () => {
      const location = await getLocation();
      setUserLocation(location);
      setIsLocationReady(true);
    };
    initLocation();
  }, []);

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
          await handleLocationSelection(
            userLocation.coords.latitude,
            userLocation.coords.longitude,
          );
        } else {
          await handleLocationSelection(
            DEFAULT_LOCATION.latitude,
            DEFAULT_LOCATION.longitude,
          );
        }
      } catch (error) {
        console.error("Map initialization error:", error);
      }
    };

    const timer = setTimeout(() => {
      initializeMap();
    }, 500);

    return () => clearTimeout(timer);
  }, [
    isMapReady,
    isLocationReady,
  ])

  // 가맹점 선택 시 탭 숨기기/보이기
  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: {
        display: selectedStore ? "none" : "flex",
      },
    });
  }, [selectedStore, navigation]);

  // 가맹점 선택 시 패널 애니메이션
  useLayoutEffect(() => {
    if (selectedStore) {
      slideUp(slideAnim, 300);
    }
  }, [selectedStore?.id]);

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={[styles.statusBar, { height: insets.top }]} />
      )}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>내 위치 설정</Text>
        <View style={styles.btnContainer}>
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
          ref={webViewRef}
          source={{ html: mapHTML }}
          style={styles.webView}
          scrollEnabled={true}
          scalesPageToFit={true}
          javaScriptEnabled={true}
          onLoadEnd={handleWebViewLoadEnd}
          onError={handleWebViewError}
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
      <Modal
        visible={showAddressSearch}
        animationType="slide"
        onRequestClose={() => setShowAddressSearch(false)}
      >
        {insets.top > 0 && (
          <View style={[{ backgroundColor: "#fff" }, { height: insets.top }]} />
        )}
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowAddressSearch(false)}
            >
              <Ionicons name="close" size={28} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>주소 검색</Text>
            <View style={styles.modalEmptyView} />
          </View>
          <Postcode
            style={styles.postcodeStyle}
            onSelected={(data: any) => {
              const address = data.roadAddress || data.address;
              setShowAddressSearch(false);

              // 주소 검색 후 지도 이동 및 가맹점 조회
              setTimeout(() => {
                handleGeocodeAddress(address);
              }, 300);
            }}
            onError={(error: any) => {
              Alert.alert("오류", "주소 검색 중 오류가 발생했습니다.");
            }}
          />
        </View>
      </Modal>

      {/* 로딩 오버레이 */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#EF7810" />
          <Text style={styles.loadingText}>로딩중입니다</Text>
        </View>
      )}

      {/* 클릭한 좌표 정보 패널 */}
      {clickedLocation && (
        <Animated.View
          style={[
            styles.clickedLocationContainer,
            { transform: [{ translateY: clickedLocationAnim }] },
          ]}
        >
          <View style={styles.clickedLocationContent}>
            <View style={styles.clickedLocationHeader}>
              <TouchableOpacity
                style={styles.clickedLocationCloseButton}
                onPress={handleCloseClickedLocation}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <Text style={styles.clickedLocationAddress}>
              {clickedLocation.address || "주소 로딩중..."}
            </Text>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearchNearbyStores}
            >
              <Ionicons name="search" size={20} color="#fff" />
              <Text style={styles.searchButtonText}>주변 가맹점 검색</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* 선택된 가맹점 정보 표시 */}
      {selectedStore && (
        <View style={styles.storePanelContainer}>
          <Animated.View
            style={[
              styles.storeInfoContainer,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View {...storeDetailPanResponder.panHandlers} style={styles.dragHandle}>
              <View style={styles.dragHandleBar} />
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseStoreInfo}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.storeName}>{selectedStore.name}</Text>
            <Text style={styles.storeAddress}>{selectedStore.address}</Text>
            {selectedStore.phone && (
              <Text style={styles.storePhone}>{selectedStore.phone}</Text>
            )}
          </Animated.View>
          {/* 올라간 거리만큼 하얀색 배경 채우기 */}
          <Animated.View
            style={[
              styles.storeInfoWhiteOverlay,
              {
                height: slideAnim.interpolate({
                  inputRange: [-200, 0],
                  outputRange: [200, 0],
                  extrapolate: "clamp",
                }),
              },
            ]}
          />
        </View>
      )}

      {/* 가맹점 목록 */}
      {showStoreList && stores.length > 0 && (
        <View style={styles.storeListOuterContainer}>
          {/* 올라간 거리만큼 하얀색 배경 채우기 */}
          <Animated.View
            style={[
              styles.storeListWhiteOverlay,
              {
                height: storeListAnim.interpolate({
                  inputRange: [-300, 0],
                  outputRange: [300, 0],
                  extrapolate: "clamp",
                }),
              },
            ]}
          />
          <Animated.View
            {...storeListPanResponder.panHandlers}
            style={[
              styles.storeListContainer,
              { transform: [{ translateY: storeListAnim }] },
            ]}
          >
            {/* 드래그 핸들 - 항상 상단에 고정 */}
            <View style={styles.storeListDragHandle}>
              <View style={styles.storeListDragBar} />
            </View>

            {/* 가맹점 목록 - 스크롤 가능 */}
            <FlatList
              style={{ flex: 1 }}
              data={stores}
              keyExtractor={(item) => item.id}
              scrollEnabled={true}
              scrollEventThrottle={16}
              onScroll={(event: any) => {
                scrollOffsetY.current = event.nativeEvent.contentOffset.y;
              }}
              contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? insets.bottom + 60 : 0 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.storeListItem}
                  onPress={() => {
                    handleSelectStoreFromList(item);
                  }}
                >
                  <Text style={styles.storeListItemName}>{item.name}</Text>
                  <Text style={styles.storeListItemAddress}>
                    {item.address}
                  </Text>
                  {item.phone && (
                    <Text style={styles.storeListItemPhone}>{item.phone}</Text>
                  )}
                </TouchableOpacity>
              )}
              initialNumToRender={5}
              maxToRenderPerBatch={10}
            />
          </Animated.View>
        </View>
      )}
    </View>
  );
}
