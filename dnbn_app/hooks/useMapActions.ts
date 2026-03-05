import * as Location from "expo-location";
import { router } from "expo-router";
import { RefObject, useCallback } from "react";
import { Alert, Animated } from "react-native";
import { WebView } from "react-native-webview";
import {
  addStoreMarkers,
  clearAllMarkers,
  fetchNearbyStores,
  geocodeAddress,
  getUserLocation as getLocation,
  highlightStoreMarker,
  moveMapToLocation,
  reverseGeocode,
  sendMessageToWebView,
  setUserLocationWithZoom,
  slideDown,
  slideUp,
  Store,
} from "../utils/map";

interface UseMapActionsParams {
  webViewRef: RefObject<WebView | null>;
  // States
  selectedStore: Store | null;
  stores: Store[];
  userLocation: Location.LocationObject | null;
  clickedLocation: any;
  showStoreList: boolean;
  // Setters
  setSelectedStore: (store: Store | null) => void;
  setStores: (stores: Store[]) => void;
  setUserLocation: (location: Location.LocationObject | null) => void;
  setIsLoading: (loading: boolean) => void;
  setIsMapReady: (ready: boolean) => void;
  setIsLocationReady: (ready: boolean) => void;
  setShowAddressSearch: (show: boolean) => void;
  setClickedLocation: (location: any) => void;
  setShowStoreList: (show: boolean) => void;
  // Animations
  slideAnim: Animated.Value;
  clickedLocationAnim: Animated.Value;
  storeListAnim: Animated.Value;
  // Utilities
  closeAllPanels: (options: {
    clickedLocation?: boolean;
    selectedStore?: boolean;
    showStoreList?: boolean;
    additionalDelay?: number;
  }) => Promise<void>;
  reloadWebView: () => void;
}

export function useMapActions({
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
  reloadWebView,
}: UseMapActionsParams) {
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
    [webViewRef, setStores],
  );

  // 좌표 설정 (지도 이동)
  const setLocationCoordinates = useCallback(
    (latitude: number, longitude: number, zoom: number = 3) => {
      setUserLocationWithZoom(webViewRef, latitude, longitude, zoom);
    },
    [webViewRef],
  );

  // 지도 이동만 (마커 생성 없음)
  const handleMapNavigation = useCallback(
    (latitude: number, longitude: number, zoom: number = 2) => {
      moveMapToLocation(webViewRef, latitude, longitude, zoom);
    },
    [webViewRef],
  );

  // 위치 선택 처리 (좌표 설정 + 주변 가맹점 조회)
  const handleLocationSelection = useCallback(
    async (latitude: number, longitude: number) => {
      try {
        // 다른 패널이 열려있으면 먼저 닫기
        await closeAllPanels({
          clickedLocation: true,
          selectedStore: true,
        });

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
    [
      setLocationCoordinates,
      handleFetchNearbyStores,
      storeListAnim,
      closeAllPanels,
      setShowStoreList,
      setIsLoading,
    ],
  );

  // Kakao REST API로 주소를 좌표로 변환
  const handleGeocodeAddress = useCallback(
    async (address: string) => {
      setIsLoading(true);

      try {
        const result = await geocodeAddress(address);

        if (result) {
          // 기존 패널들 모두 닫기
          await closeAllPanels({
            clickedLocation: true,
            selectedStore: true,
            showStoreList: true,
            additionalDelay: 100,
          });

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
    [
      handleMapNavigation,
      handleFetchNearbyStores,
      storeListAnim,
      closeAllPanels,
      setShowStoreList,
      setIsLoading,
    ],
  );

  // 좌표를 주소로 변환 (역지오코딩)
  const handleReverseGeocode = useCallback(
    async (latitude: number, longitude: number) => {
      // 다른 패널이 열려있으면 먼저 닫기
      await closeAllPanels({
        selectedStore: true,
        showStoreList: true,
      });

      const address = await reverseGeocode(latitude, longitude);

      setClickedLocation({
        latitude,
        longitude,
        address,
      });

      // 애니메이션 시작
      slideUp(clickedLocationAnim, 400);
    },
    [clickedLocationAnim, closeAllPanels, setClickedLocation],
  );

  // WebView 메시지 핸들러
  const handleWebViewMessage = useCallback(
    (event: any) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);

        if (data.type === "jsError") {
          console.warn(
            "[MapWebView JS Error]",
            data.message,
            data.source,
            data.line,
          );
        } else if (data.type === "kakaoLoaded") {
          // Kakao SDK + kakao.maps.load() 완료 → 안전하게 init 전송
          sendMessageToWebView(webViewRef, { type: "init" });
        } else if (data.type === "ready") {
          setIsMapReady(true);
        } else if (data.type === "mapReady") {
          setTimeout(() => {
            setIsLoading(false);
          }, 100);
        } else if (data.type === "kakaoLoadError") {
          // 카카오 SDK 로드 실패 (네트워크 오류, API 키 제한 등)
          setIsLoading(false);
          const errorParts: string[] = [];
          if (data.reason) errorParts.push(`reason: ${data.reason}`);
          if (data.httpStatus) errorParts.push(`HTTP: ${data.httpStatus}`);
          if (data.error) errorParts.push(`error: ${data.error}`);
          const errorDetail = errorParts.length
            ? `\n[${errorParts.join(", ")}]`
            : "";
          Alert.alert(
            "지도 로드 오류",
            `카카오 지도를 불러오지 못했습니다.${errorDetail}\n네트워크 상태를 확인하거나 잠시 후 다시 시도해 주세요.`,
            [
              {
                text: "돌아가기",
                style: "cancel",
                onPress: () => router.back(),
              },
              {
                text: "다시 시도",
                onPress: () => {
                  setIsLoading(true);
                  setIsMapReady(false);
                  setIsLocationReady(false);
                  reloadWebView();
                },
              },
            ],
          );
        } else if (data.type === "storeSelected") {
          // 지도에서 마커 클릭 시 해당 마커를 주황색으로 강조
          highlightStoreMarker(webViewRef, data.store.id);

          // 다른 패널들 닫기
          const closePromises: Promise<void>[] = [];

          if (clickedLocation) {
            closePromises.push(
              new Promise<void>((resolve) => {
                slideDown(clickedLocationAnim, 500, 300, () => {
                  setClickedLocation(null);
                  resolve();
                });
              }),
            );
          }

          if (showStoreList) {
            closePromises.push(
              new Promise<void>((resolve) => {
                slideDown(storeListAnim, 300, 300, () => {
                  setShowStoreList(false);
                  resolve();
                });
              }),
            );
          }

          // 모든 패널이 닫힌 후 상세정보 표시
          if (closePromises.length > 0) {
            Promise.all(closePromises).then(() => {
              setTimeout(() => {
                setSelectedStore(data.store);
              }, 100);
            });
          } else {
            // 다른 패널이 없으면 바로 표시
            setSelectedStore(data.store);
          }
        } else if (data.type === "mapClicked") {
          // 새 위치 클릭 시 기존 패널들 닫기 (순차적으로)
          const closePromises: Promise<void>[] = [];

          if (showStoreList) {
            closePromises.push(
              new Promise<void>((resolve) => {
                slideDown(storeListAnim, 600, 300, () => {
                  setShowStoreList(false);
                  resolve();
                });
              }),
            );
          }

          if (selectedStore) {
            closePromises.push(
              new Promise<void>((resolve) => {
                slideDown(slideAnim, 300, 300, () => {
                  setSelectedStore(null);
                  resolve();
                });
              }),
            );
          }

          // 모든 패널이 닫힌 후 새 패널 표시
          Promise.all(closePromises).then(() => {
            setTimeout(() => {
              handleReverseGeocode(data.latitude, data.longitude);
            }, 100);
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    [
      handleReverseGeocode,
      storeListAnim,
      slideAnim,
      clickedLocationAnim,
      clickedLocation,
      selectedStore,
      showStoreList,
      webViewRef,
      setIsMapReady,
      setIsLoading,
      setIsLocationReady,
      setClickedLocation,
      setSelectedStore,
      setShowStoreList,
      reloadWebView,
    ],
  );

  const handleWebViewLoadEnd = useCallback(() => {
    // kakaoLoaded 메시지를 받은 후 init을 전송하므로 여기서는 아무것도 하지 않음
    // (waitForKakao → kakao.maps.load() 완료 → kakaoLoaded 수신 → init 전송)
  }, []);

  // WebView 에러 핸들러
  const handleWebViewError = useCallback(
    (syntheticEvent: any) => {
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
    },
    [setIsLoading],
  );

  // 검색창 포커스 시 주소 검색 모달 열기
  const handleSearchFocus = useCallback(() => {
    setShowAddressSearch(true);
  }, [setShowAddressSearch]);

  // 현재 위치로 이동 + 주변 가맹점 조회
  const handleCenterToUser = useCallback(async () => {
    // 모든 패널 닫기
    await closeAllPanels({
      clickedLocation: true,
      selectedStore: true,
      showStoreList: true,
      additionalDelay: 100,
    });

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
    closeAllPanels,
    handleLocationSelection,
    userLocation,
    webViewRef,
    setUserLocation,
  ]);

  // 가맹점 정보 닫기
  const handleCloseStoreInfo = useCallback(() => {
    slideDown(slideAnim, 300, 300, () => {
      setSelectedStore(null);
    });
  }, [slideAnim, setSelectedStore]);

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
    [
      storeListAnim,
      clickedLocationAnim,
      handleMapNavigation,
      clickedLocation,
      webViewRef,
      setClickedLocation,
      setShowStoreList,
      setSelectedStore,
    ],
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
    const closePromises: Promise<void>[] = [];

    if (selectedStore) {
      closePromises.push(
        new Promise<void>((resolve) => {
          slideDown(slideAnim, 300, 300, () => {
            setSelectedStore(null);
            resolve();
          });
        }),
      );
    }

    // 클릭 위치 패널 닫기
    closePromises.push(
      new Promise<void>((resolve) => {
        slideDown(clickedLocationAnim, 200, 300, () => {
          setClickedLocation(null);
          resolve();
        });
      }),
    );

    // 4. 모든 패널이 완전히 닫힌 후 가맹점 목록 표시
    await Promise.all(closePromises);
    await new Promise((resolve) => setTimeout(resolve, 100));

    setShowStoreList(true);
    slideUp(storeListAnim, 400);
  }, [
    clickedLocation,
    handleMapNavigation,
    handleFetchNearbyStores,
    clickedLocationAnim,
    storeListAnim,
    slideAnim,
    selectedStore,
    setClickedLocation,
    setSelectedStore,
    setShowStoreList,
  ]);

  // 클릭 패널 닫기
  const handleCloseClickedLocation = useCallback(() => {
    slideDown(clickedLocationAnim, 500, 300, () => {
      setClickedLocation(null);
    });
  }, [clickedLocationAnim, setClickedLocation]);

  // 목록 패널 닫기
  const handleCloseStoreList = useCallback(() => {
    slideDown(storeListAnim, 300, 300, () => {
      setShowStoreList(false);
    });
  }, [storeListAnim, setShowStoreList]);

  // 초기 위치 로드
  const initLocation = useCallback(async () => {
    const location = await getLocation();
    setUserLocation(location);
    setIsLocationReady(true);
  }, [setUserLocation, setIsLocationReady]);

  return {
    handleFetchNearbyStores,
    setLocationCoordinates,
    handleMapNavigation,
    handleLocationSelection,
    handleGeocodeAddress,
    handleReverseGeocode,
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
    initLocation,
  };
}
