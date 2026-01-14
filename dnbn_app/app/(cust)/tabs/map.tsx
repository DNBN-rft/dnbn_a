import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router, useNavigation } from "expo-router";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, Animated, Modal, PanResponder, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import Postcode from "@actbase/react-daum-postcode";
import { styles } from "./map.styles";

const KAKAO_JAVASCRIPT_KEY = "46f0bc8ab705f2263a98ee3adeebd719";
const KAKAO_REST_API_KEY = "4739cdd728a97e32f1ad213ae111e099";
const DEFAULT_LOCATION = { latitude: 37.4979, longitude: 127.0276 };

interface Store {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  distance?: number;
}

type WebViewMessageType =
  | { type: 'init' }
  | { type: 'userLocation'; latitude: number; longitude: number }
  | { type: 'userLocationWithZoom'; latitude: number; longitude: number; zoom: number }
  | { type: 'addStores'; stores: Store[] }
  | { type: 'clearMarkers' }
  | { type: 'ready' };

const TEST_STORES: Store[] = [
  {
    id: "test-1",
    name: "용인점",
    address: "경기도 용인시 기흥구 구성로 184",
    latitude: 37.29077309144749,
    longitude: 127.13013185986694,
    phone: "031-1111-1111",
  },
  {
    id: "test-2",
    name: "용인역점",
    address: "경기도 용인시 처인구 중부대로",
    latitude: 37.29155500046295,
    longitude: 127.12782692103407,
    phone: "031-2222-2222",
  },
  {
    id: "test-3",
    name: "기흥점",
    address: "경기도 용인시 기흥구 중심상가",
    latitude: 37.29150256069689,
    longitude: 127.12631562423036,
    phone: "031-3333-3333",
  },
  {
    id: "test-4",
    name: "백암 만다린",
    address: "경기도 용인시 처인구 백암면 백암로 100",
    latitude: 37.170682103830195,
    longitude: 127.37076993992747,
    phone: "031-4444-4444",
  },
  {
    id: "test-5",
    name: "백암 세븐일레븐",
    address: "경기도 용인시 수지구 수지로 50",
    latitude: 37.171968683256914,
    longitude: 127.37138425672894,
    phone: "031-5555-5555",
  },
];

const generateMapHTML = (appKey: string) => `
  <!DOCTYPE html>
  <html lang="ko">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Kakao Map</title>
      <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}"></script>
      <style>
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }
          body {
              width: 100%;
              height: 100vh;
              font-family: Arial, sans-serif;
          }
          #map {
              width: 100%;
              height: 100%;
          }
          .info-window {
              padding: 12px;
              background-color: white;
              border-radius: 8px;
              font-size: 14px;
          }
          .store-name {
              font-weight: bold;
              color: #333;
              margin-bottom: 4px;
          }
          .store-info {
              color: #666;
              font-size: 12px;
          }
      </style>
  </head>
  <body>
      <div id="map"></div>
      
      <script>
          let map;
          let markers = [];
          let userLocationMarker = null;
          let isReady = false;

          function initMap() {
              const container = document.getElementById('map');
              const options = {
                  center: new kakao.maps.LatLng(37.4979, 127.0276),
                  level: 5
              };
              map = new kakao.maps.Map(container, options);
              
              isReady = true;
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
          }

          function displayUserLocation(lat, lng) {
              if (userLocationMarker) {
                  userLocationMarker.setMap(null);
              }

              const userPosition = new kakao.maps.LatLng(lat, lng);
              
              userLocationMarker = new kakao.maps.Marker({
                  position: userPosition,
                  map: map,
                  image: createUserIcon(),
                  title: '내 위치'
              });

              map.setCenter(userPosition); 
          }

          function createUserIcon() {
              const imageSize = new kakao.maps.Size(32, 40);
              const imageOption = { offset: new kakao.maps.Point(16, 40) };
              return new kakao.maps.MarkerImage(
                  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40"><path d="M16 0C8.27 0 2 6.27 2 14c0 12 14 26 14 26s14-14 14-26c0-7.73-6.27-14-14-14z" fill="%23EF7810"/><circle cx="16" cy="14" r="5" fill="white"/></svg>',
                  imageSize,
                  imageOption
              );
          }

          function createStoreIcon() {
              const imageSize = new kakao.maps.Size(40, 45);
              const imageOption = { offset: new kakao.maps.Point(20, 45) };
              return new kakao.maps.MarkerImage(
                  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 45"><path d="M20 0C9.06 0 0 9.06 0 20c0 13 20 25 20 25s20-12 20-25c0-10.94-9.06-20-20-20z" fill="%23FF6B6B"/><circle cx="20" cy="20" r="8" fill="white"/></svg>',
                  imageSize,
                  imageOption
              );
          }

          function addStoreMarker(store) {
              const position = new kakao.maps.LatLng(store.latitude, store.longitude);
              
              const marker = new kakao.maps.Marker({
                  position: position,
                  map: map,
                  image: createStoreIcon(),
                  title: store.name
              });

              marker.addListener('click', function() {
                  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'storeSelected', store: store }));
              });

              markers.push(marker);
          }

          function clearMarkers() {
              markers.forEach(marker => marker.setMap(null));
              markers = [];
          }

          window.addEventListener('message', function(event) {
              let data;
              try {
                  data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
              } catch (e) {
                  return;
              }
              
              if (!isReady && data.type !== 'init') {
                  return;
              }
              
              switch(data.type) {
                  case 'init':
                      initMap();
                      break;
                  case 'userLocation':
                      displayUserLocation(data.latitude, data.longitude);
                      break;
                  case 'userLocationWithZoom':
                      displayUserLocation(data.latitude, data.longitude);
                      map.setLevel(data.zoom);
                      setTimeout(() => {
                          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mapReady' }));
                      }, 1000);
                      break;
                  case 'addStores':
                      clearMarkers();
                      data.stores.forEach(store => addStoreMarker(store));
                      break;
                  case 'clearMarkers':
                      clearMarkers();
                      break;
              }
          });

          window.addEventListener('DOMContentLoaded', initMap);
      </script>
  </body>
  </html>
`;

export default function CustMapScreen() {
  const navigation = useNavigation();
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [searchText, setSearchText] = useState("");
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isLocationReady, setIsLocationReady] = useState(false);
  const [showAddressSearch, setShowAddressSearch] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(true);
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const dragStartValue = useRef(0); // 드래그 시작 시의 slideAnim 값 저장
  const mapHTML = useMemo(() => generateMapHTML(KAKAO_JAVASCRIPT_KEY), []);

  const sendMessageToWebView = useCallback((message: WebViewMessageType) => {
    if (webViewRef.current) {
      const jsonMessage = JSON.stringify(message);
      webViewRef.current.postMessage(jsonMessage);
    }
  }, []);

  const fetchNearbyStores = useCallback(async (latitude: number, longitude: number) => {
    try {
      const threshold = 0.05; // 약 5km 범위

      // TEST_STORES에서 해당 좌표 범위 내의 가맹점 필터링
      const nearbyTestStores = TEST_STORES.filter(store => {
        const latDiff = Math.abs(store.latitude - latitude);
        const lngDiff = Math.abs(store.longitude - longitude);
        return latDiff < threshold && lngDiff < threshold;
      });

      if (nearbyTestStores.length > 0) {
        console.log('TEST_STORES에서 발견:', nearbyTestStores);
        setStores(nearbyTestStores);
        sendMessageToWebView({
          type: "addStores",
          stores: nearbyTestStores,
        });
        return;
      }

      //todo: 백엔드 API 구현 전까지는 TEST_STORES에 의존, 백엔드 API 구현 후 윗 부분 삭제
      // TEST_STORES에 없으면 백엔드 API 호출
      console.log('백엔드 API 호출:', { latitude, longitude });
      const response = await fetch(
        `https://your-api.com/api/stores/nearby?latitude=${latitude}&longitude=${longitude}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (data.success && data.stores) {
        setStores(data.stores);
        sendMessageToWebView({
          type: "addStores",
          stores: data.stores,
        });
      }
    } catch (error) {
      console.log('가맹점 조회 실패 (백엔드 API 미구현):', error);
      // API 호출 실패 시 빈 배열 (가맹점 없음)
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

  // 3. 위치 선택 처리 (좌표 설정 + 주변 가맹점 조회)
  const handleLocationSelection = useCallback(async (latitude: number, longitude: number) => {
    setLocationCoordinates(latitude, longitude);
    await fetchNearbyStores(latitude, longitude);
  }, [setLocationCoordinates, fetchNearbyStores]);

  // Kakao REST API로 주소를 좌표로 변환
  const geocodeAddress = useCallback(async (address: string) => {
    try {
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
        {
          headers: {
            Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
          },
        }
      );

      const data = await response.json();

      if (data.documents && data.documents.length > 0) {
        const location = data.documents[0];
        const lat = parseFloat(location.y);
        const lng = parseFloat(location.x);

        await handleLocationSelection(lat, lng);
      } else {
        Alert.alert("알림", "주소를 찾을 수 없습니다.");
      }
    } catch (error) {
      Alert.alert("오류", "주소 검색 중 오류가 발생했습니다.");
    }
  }, [handleLocationSelection]);

  const getUserLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "위치 권한 필요",
          "지도에서 가까운 가맹점을 찾기 위해 위치 접근 권한이 필요합니다. 기본 위치로 지도를 표시합니다.",
          [{ text: "확인" }]
        );
        setUserLocation(null);
        setIsLocationReady(true);
        return;
      }

      try {
        const lastLocation = await Location.getLastKnownPositionAsync();
        if (lastLocation) {
          setUserLocation(lastLocation);
          setIsLocationReady(true);
        }
      } catch (error) {
      }

      try {
        const location = await Promise.race([
          Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 5000,
            mayShowUserSettingsDialog: false,
          }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 5000)
          )
        ]);

        setUserLocation(location);
        if (!isLocationReady) {
          setIsLocationReady(true);
        }
      } catch (gpsError) {
        if (!isLocationReady) {
          Alert.alert(
            "위치 서비스 오류",
            "위치를 가져올 수 없습니다. 기본 위치로 지도를 표시합니다.",
            [{ text: "확인" }]
          );
          setUserLocation(null);
          setIsLocationReady(true);
        }
      }
    } catch (error) {
      Alert.alert(
        "위치 권한 오류",
        "위치 권한을 요청하는 중 오류가 발생했습니다.",
        [{ text: "확인" }]
      );
      setUserLocation(null);
      setIsLocationReady(true);
    }
  }, [isLocationReady]);

  // WebView 메시지 핸들러
  const handleWebViewMessage = useCallback((event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === 'ready') {
        setIsMapReady(true);
      } else if (data.type === 'mapReady') {
        setIsLoading(false);
      } else if (data.type === 'storeSelected') {
        setSelectedStore(data.store);
      }
    } catch (error) {
    }
  }, []);

  const handleAddressSearchMessage = useCallback((event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === 'addressSelected') {
        setShowAddressSearch(false);
        setShowSearchInput(false);

        setTimeout(() => {
          geocodeAddress(data.roadAddress || data.address);
        }, 300);
      }
    } catch (error) {
    }
  }, [geocodeAddress]);

  const handleWebViewLoadEnd = useCallback(() => {
    sendMessageToWebView({ type: 'init' });
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

  // 검색 입력창 다시 보이기
  const handleShowSearchInput = useCallback(() => {
    setShowSearchInput(true);
  }, []);

  // 현재 위치로 이동 + 주변 가맹점 조회
  const handleCenterToUser = useCallback(async () => {
    if (userLocation) {
      await handleLocationSelection(
        userLocation.coords.latitude,
        userLocation.coords.longitude
      );
    } else {
      await getUserLocation();
    }
  }, [userLocation, handleLocationSelection, getUserLocation]);

  // 가맹점 정보 닫기
  const handleCloseStoreInfo = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setSelectedStore(null);
    });
  }, [slideAnim]);

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
          Animated.timing(slideAnim, {
            toValue: 300,
            duration: 300,
            useNativeDriver: false,
          }).start(() => {
            setSelectedStore(null);
          });
        } else if (gestureState.dy < -50) {
          Animated.timing(slideAnim, {
            toValue: -200,
            duration: 200,
            useNativeDriver: false,
          }).start();
        } else {
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }).start();
        }
      },
    });
  }, [slideAnim]);

  // 모달 opened/closed 감시
  useLayoutEffect(() => {
    return () => {
    };
  }, [showAddressSearch]);

  // 초기 로드: 위치 정보 가져오기
  useLayoutEffect(() => {
    getUserLocation();

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
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
      slideAnim.setValue(300);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
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
          {!showSearchInput && (
            <TouchableOpacity
              style={styles.locationButton}
              onPress={handleShowSearchInput}
            >
              <Ionicons name="search" size={24} color="#EF7810" />
            </TouchableOpacity>
          )}
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
        {showSearchInput && (
          <View style={styles.searchContainer}>
            <TouchableOpacity
              style={styles.textInput}
              onPress={handleSearchFocus}
              activeOpacity={0.7}
            >
              <Text style={searchText ? styles.searchTextActive : styles.searchTextPlaceholder}>
                {searchText || "원하시는 지역을 검색하세요"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 주소 검색 모달 */}
      <Modal
        visible={showAddressSearch}
        animationType="slide"
        onRequestClose={() => setShowAddressSearch(false)}
      >
        {insets.top > 0 && (
          <View style={[styles.statusBar, { height: insets.top }]} />
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
              handleAddressSearchMessage({
                nativeEvent: {
                  data: JSON.stringify({
                    type: 'addressSelected',
                    address: data.roadAddress || data.address,
                  })
                }
              });
              setShowAddressSearch(false);
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
    </View>
  );
}