import Postcode from "@actbase/react-daum-postcode";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router, useNavigation } from "expo-router";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, Animated, FlatList, Modal, PanResponder, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { generateMapHTML } from "./mapHtml";
import { styles } from "../styles/map.styles";
import {
  getUserLocation as getLocation,
  DEFAULT_LOCATION,
  geocodeAddress,
  reverseGeocode,
  fetchNearbyStores,
  Store,
  TEST_STORES,
  slideUp,
  slideDown,
  expandPanel,
  resetPanel,
  WebViewMessageType,
  ClickedLocation,
} from "../../../utils/map";

const KAKAO_JAVASCRIPT_KEY = "46f0bc8ab705f2263a98ee3adeebd719";

export default function CustMapScreen() {
  const navigation = useNavigation();
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isLocationReady, setIsLocationReady] = useState(false);
  const [showAddressSearch, setShowAddressSearch] = useState(false);
  const [clickedLocation, setClickedLocation] = useState<ClickedLocation | null>(null);
  const [showStoreList, setShowStoreList] = useState(false);
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const clickedLocationAnim = useRef(new Animated.Value(500)).current; // 클릭된 위치 패널 애니메이션
  const storeListAnim = useRef(new Animated.Value(300)).current; // 가맹점 목록 애니메이션
  const dragStartValue = useRef(0); // 드래그 시작 시의 slideAnim 값 저장
  const storeListDragStartValue = useRef(0); // 가맹점 목록 드래그 시작값
  const mapHTML = useMemo(() => generateMapHTML(KAKAO_JAVASCRIPT_KEY), []);

  const sendMessageToWebView = useCallback((message: WebViewMessageType) => {
    if (webViewRef.current) {
      const jsonMessage = JSON.stringify(message);
      webViewRef.current.postMessage(jsonMessage);
    } else {
    }
  }, []);

  const handleFetchNearbyStores = useCallback(async (latitude: number, longitude: number) => {
    try {
      // 기존 마커 제거
      sendMessageToWebView({
        type: "clearMarkers",
      });

      const nearbyStores = await fetchNearbyStores(latitude, longitude);
      
      setStores(nearbyStores);
      if (nearbyStores.length > 0) {
        sendMessageToWebView({
          type: "addStores",
          stores: nearbyStores,
        });
      }
    } catch (error) {
      console.error("Fetch stores error:", error);
      setStores([]);
      sendMessageToWebView({
        type: "clearMarkers",
      });
    }
  }, [sendMessageToWebView]);

  // 2. 좌표 설정 (지도 이동)
  const setLocationCoordinates = useCallback((latitude: number, longitude: number, zoom: number = 3) => {
    sendMessageToWebView({
      type: "userLocationWithZoom",
      latitude,
      longitude,
      zoom,
    });
  }, [sendMessageToWebView]);

  // 지도 이동만 (마커 생성 없음)
  const handleMapNavigation = useCallback((latitude: number, longitude: number, zoom: number = 2) => {
    sendMessageToWebView({
      type: "mapNavigation",
      latitude,
      longitude,
      zoom,
    });
  }, [sendMessageToWebView]);

  // 3. 위치 선택 처리 (좌표 설정 + 주변 가맹점 조회)
  const handleLocationSelection = useCallback(async (latitude: number, longitude: number) => {
    setLocationCoordinates(latitude, longitude);
    await handleFetchNearbyStores(latitude, longitude);
    
    // 가맹점 목록 표시
    setShowStoreList(true);
    slideUp(storeListAnim, 400);
  }, [setLocationCoordinates, handleFetchNearbyStores, storeListAnim]);

  // Kakao REST API로 주소를 좌표로 변환
  const handleGeocodeAddress = useCallback(async (address: string) => {
    const result = await geocodeAddress(address);
    
    if (result) {
      // 지도 이동
      await handleMapNavigation(result.latitude, result.longitude);
      
      // 주변 가맹점 조회
      await handleFetchNearbyStores(result.latitude, result.longitude);
      
      // 가맹점 목록 표시
      setShowStoreList(true);
      slideUp(storeListAnim, 400);
    }
  }, [handleMapNavigation, handleFetchNearbyStores, storeListAnim]);

  const getUserLocation = useCallback(async () => {
    const location = await getLocation();
    setUserLocation(location);
    setIsLocationReady(true);
  }, []);

  // 좌표를 주소로 변환 (역지오코딩)
  const handleReverseGeocode = useCallback(async (latitude: number, longitude: number) => {
    const address = await reverseGeocode(latitude, longitude);
    
    setClickedLocation({
      latitude,
      longitude,
      address
    });
    
    // 애니메이션 시작
    slideUp(clickedLocationAnim, 400);
  }, [clickedLocationAnim]);

  // WebView 메시지 핸들러
  const handleWebViewMessage = useCallback((event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === 'ready') {
        setIsMapReady(true);
      } else if (data.type === 'mapReady') {
        setTimeout(() => {
          setIsLoading(false);
        }, 100);
      } else if (data.type === 'storeSelected') {
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
          setSelectedStore(data.store);
        }
      } else if (data.type === 'mapClicked') {
        // 새 위치 클릭 시 기존 패널들 닫기 (하나씩)
        if (showStoreList) {
          slideDown(storeListAnim, 600, 300, () => {
            setShowStoreList(false);
          });
        } else if (selectedStore) {
          slideDown(slideAnim, 300, 300, () => {
            setSelectedStore(null);
          });
        }
        handleReverseGeocode(data.latitude, data.longitude);
      }
    } catch (error) {
    }
  }, [handleReverseGeocode, showStoreList, storeListAnim, selectedStore, slideAnim]);

  const handleWebViewLoadEnd = useCallback(() => {
    // WebView가 완전히 준비될 때까지 대기
    setTimeout(() => {
      sendMessageToWebView({ type: 'init' });
    }, 500);
  }, [sendMessageToWebView]);

  // WebView 에러 핸들러
  const handleWebViewError = useCallback((syntheticEvent: any) => {
    setIsLoading(false);
    Alert.alert(
      "지도 로드 오류",
      "지도를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.",
      [{
        text: "확인",
        onPress: () => router.back()
      }]
    );
  }, []);

  // 검색창 포커스 시 주소 검색 모달 열기
  const handleSearchFocus = useCallback(() => {
    setShowAddressSearch(true);
  }, []);

  // 현재 위치로 이동 + 주변 가맹점 조회
  const handleCenterToUser = useCallback(async () => {
    // 클릭한 위치 패널 닫기
    if (clickedLocation) {
      slideDown(clickedLocationAnim, 500, 300, () => {
        setClickedLocation(null);
      });
    }
    
    // 가맹점 상세정보 패널이 열려있으면 먼저 닫기
    if (selectedStore) {
      slideDown(slideAnim, 300, 300, () => {
        setSelectedStore(null);
      });
      // 패널이 닫힐 때까지 대기
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // WebView에서 모든 마커 제거 (클릭 마커 + 가맹점 마커)
    sendMessageToWebView({
      type: 'clearAllMarkers',
    });
    
    if (userLocation) {
      await handleLocationSelection(
        userLocation.coords.latitude,
        userLocation.coords.longitude
      );
    } else {
      await getUserLocation();
    }
  }, [userLocation, handleLocationSelection, getUserLocation, clickedLocation, clickedLocationAnim, sendMessageToWebView, selectedStore, slideAnim]);

  /**
   * 모든 패널을 닫습니다
   */
  const closeAllPanels = useCallback(async () => {
    const closePromises = [];

    // 1. 클릭한 위치 패널 닫기
    if (clickedLocation) {
      closePromises.push(
        new Promise<void>(resolve => {
          slideDown(clickedLocationAnim, 500, 300, () => {
            setClickedLocation(null);
            resolve();
          });
        })
      );
    }

    // 2. 가맹점 목록 패널 닫기
    if (showStoreList) {
      closePromises.push(
        new Promise<void>(resolve => {
          slideDown(storeListAnim, 300, 300, () => {
            setShowStoreList(false);
            resolve();
          });
        })
      );
    }

    // 3. 가맹점 상세정보 패널 닫기
    if (selectedStore) {
      closePromises.push(
        new Promise<void>(resolve => {
          slideDown(slideAnim, 300, 300, () => {
            setSelectedStore(null);
            resolve();
          });
        })
      );
    }

    // 모든 패널이 닫힐 때까지 대기
    if (closePromises.length > 0) {
      await Promise.all(closePromises);
    }
  }, [clickedLocation, clickedLocationAnim, showStoreList, storeListAnim, selectedStore, slideAnim]);

  // 가맹점 정보 닫기
  const handleCloseStoreInfo = useCallback(() => {
    slideDown(slideAnim, 300, 300, () => {
      setSelectedStore(null);
    });
  }, [slideAnim]);

  
  // 가맹점 목록에서 가맹점 클릭 (목록 먼저 닫고 상세정보 표시)
  const handleSelectStoreFromList = useCallback(async (store: Store) => {
    // 다른 패널이 열려있으면 먼저 닫기
    if (clickedLocation) {
      slideDown(clickedLocationAnim, 500, 300, () => {
        setClickedLocation(null);
      });
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // 목록 패널 닫기
    slideDown(storeListAnim, 300, 300, () => {
      setShowStoreList(false);
    });
    
    // 목록이 완전히 닫힌 후 상세정보 표시
    await new Promise(resolve => setTimeout(resolve, 350));
    setSelectedStore(store);
  }, [storeListAnim, clickedLocation, clickedLocationAnim]);

  // 클릭한 위치 근처 가맹점 검색
  const handleSearchNearbyStores = useCallback(async () => {
    if (clickedLocation) {
      // 1. 먼저 지도를 클릭한 위치로 이동 (마커는 이미 있으므로 네비게이션만)
      await handleMapNavigation(clickedLocation.latitude, clickedLocation.longitude, 4);
      
      // 2. 가맹점 조회
      await handleFetchNearbyStores(clickedLocation.latitude, clickedLocation.longitude);
      
      // 3. 다른 패널들이 열려있으면 먼저 닫기
      if (selectedStore) {
        slideDown(slideAnim, 300, 300, () => {
          setSelectedStore(null);
        });
        await new Promise(resolve => setTimeout(resolve, 300));
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
    }
  }, [clickedLocation, handleMapNavigation, handleFetchNearbyStores, clickedLocationAnim, storeListAnim, selectedStore, slideAnim]);

  // 클릭 패널 닫기
  const handleCloseClickedLocation = useCallback(() => {
    slideDown(clickedLocationAnim, 500, 300, () => {
      setClickedLocation(null);
    });
  }, [clickedLocationAnim]);

  // PanResponder 생성 (드래그 감지)
  const panResponder = useMemo(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // 드래그 시작 시 현재 slideAnim 값 저장
        dragStartValue.current = (slideAnim as any)._value || 300;
      },
      onPanResponderMove: (evt, gestureState) => {
        // 드래그 시작값 + 현재 드래그 거리
        const newValue = dragStartValue.current + gestureState.dy;
        if (newValue > -200 && newValue < 350) {
          slideAnim.setValue(newValue);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 150) {
          slideDown(slideAnim, 300, 300, () => {
            setSelectedStore(null);
          });
        } else if (gestureState.dy < -50) {
          expandPanel(slideAnim, -200, 200);
        } else {
          resetPanel(slideAnim, 200);
        }
      },
    });
  }, [slideAnim]);

  // 가맹점 목록 드래그 PanResponder
  const storeListPanResponder = useMemo(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        storeListDragStartValue.current = (storeListAnim as any)._value || 0;
      },
      onPanResponderMove: (evt, gestureState) => {
        const newValue = storeListDragStartValue.current + gestureState.dy;
        if (newValue > -300 && newValue < 300) {
          storeListAnim.setValue(newValue);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 80) {
          // 아래로 드래그 → 목록 닫기
          slideDown(storeListAnim, 300, 300, () => {
            setShowStoreList(false);
          });
        } else if (gestureState.dy < -50) {
          // 위로 드래그 → 전체 확대
          expandPanel(storeListAnim, -300, 200);
        } else {
          // 중간 → 기본 위치
          resetPanel(storeListAnim, 200);
        }
      },
    });
  }, [storeListAnim]);

  // 모달 opened/closed 감시
  useLayoutEffect(() => {
    return () => {
    };
  }, [showAddressSearch]);

  // 초기 로드: 위치 정보 가져오기
  useLayoutEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  // 지도와 위치 모두 준비되면 지도에 표시 + 주변 가맹점 조회
  useLayoutEffect(() => {
    if (!isMapReady || !isLocationReady) {
      return;
    }

    setTimeout(() => {
      if (userLocation) {
        handleLocationSelection(
          userLocation.coords.latitude,
          userLocation.coords.longitude
        );
      } else {
        handleLocationSelection(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude);
      }
    }, 500);
  }, [isMapReady, isLocationReady, userLocation, handleLocationSelection]);

  // 가맹점 선택 시 탭 숨기기/보이기
  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: {
        display: selectedStore ? "none" : "flex",
      },
    });

    if (selectedStore) {
      slideUp(slideAnim, 300);
    }
  }, [selectedStore, navigation, slideAnim]);

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
        <Text style={styles.title}>
          내 위치 설정
        </Text>
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
          originWhitelist={['*']}
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
            onSelected={(data) => {
              const address = data.roadAddress || data.address;
              setShowAddressSearch(false);
              
              // 주소 검색 후 지도 이동 및 가맹점 조회
              setTimeout(() => {
                handleGeocodeAddress(address);
              }, 300);
            }}
            onError={(error) => {
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
            { transform: [{ translateY: clickedLocationAnim }] }
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
              {clickedLocation.address || '주소 로딩중...'}
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
            style={[styles.storeInfoContainer, { transform: [{ translateY: slideAnim }] }]}
          >
            <View 
              {...panResponder.panHandlers}
              style={styles.dragHandle}
            >
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
                  extrapolate: 'clamp',
                }),
              }
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
                  extrapolate: 'clamp',
                }),
              }
            ]}
          />
          <Animated.View
            {...storeListPanResponder.panHandlers}
            style={[
              styles.storeListContainer,
              { transform: [{ translateY: storeListAnim }] }
            ]}
          >
            <View 
              style={styles.storeListDragHandle}
            >
              <View style={styles.storeListDragBar} />
            </View>
            
            <FlatList
              data={stores}
              keyExtractor={(item) => item.id}
              scrollEnabled={true}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.storeListItem}
                  onPress={() => {
                    handleSelectStoreFromList(item);
                  }}
                >
                  <Text style={styles.storeListItemName}>{item.name}</Text>
                  <Text style={styles.storeListItemAddress}>{item.address}</Text>
                  {item.phone && (
                    <Text style={styles.storeListItemPhone}>{item.phone}</Text>
                  )}
                </TouchableOpacity>
              )}
              initialNumToRender={2}
              maxToRenderPerBatch={5}
            />
          </Animated.View>
        </View>
      )}
    </View>
  );
}