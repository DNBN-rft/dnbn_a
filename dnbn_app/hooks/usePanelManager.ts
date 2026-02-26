import { useCallback, useRef } from "react";
import { Animated } from "react-native";
import {
  ClickedLocation,
  slideDown,
  Store,
} from "../utils/map";

interface UsePanelManagerParams {
  clickedLocation: ClickedLocation | null;
  selectedStore: Store | null;
  showStoreList: boolean;
  setClickedLocation: (location: ClickedLocation | null) => void;
  setSelectedStore: (store: Store | null) => void;
  setShowStoreList: (show: boolean) => void;
}

export function usePanelManager({
  clickedLocation,
  selectedStore,
  showStoreList,
  setClickedLocation,
  setSelectedStore,
  setShowStoreList,
}: UsePanelManagerParams) {
  // 애니메이션 값
  const slideAnim = useRef(new Animated.Value(300)).current;
  const clickedLocationAnim = useRef(new Animated.Value(500)).current;
  const storeListAnim = useRef(new Animated.Value(300)).current;

  // 상태를 ref로 변환하여 의존성 문제 해결
  const clickedLocationRef = useRef(clickedLocation);
  const selectedStoreRef = useRef(selectedStore);
  const showStoreListRef = useRef(showStoreList);

  // ref 업데이트
  clickedLocationRef.current = clickedLocation;
  selectedStoreRef.current = selectedStore;
  showStoreListRef.current = showStoreList;

  // 모든 패널을 조건부로 닫는 유틸리티 함수 (상태를 ref로 읽어 의존성 최적화)
  const closeAllPanels = useCallback(
    async (options: {
      clickedLocation?: boolean;
      selectedStore?: boolean;
      showStoreList?: boolean;
      additionalDelay?: number;
    }) => {
      const promises: Promise<void>[] = [];

      // 클릭한 위치 패널 닫기
      if (options.clickedLocation && clickedLocationRef.current) {
        promises.push(
          new Promise<void>((resolve) => {
            slideDown(clickedLocationAnim, 500, 300, () => {
              setClickedLocation(null);
              resolve();
            });
          }),
        );
      }

      // 가맹점 상세정보 패널 닫기
      if (options.selectedStore && selectedStoreRef.current) {
        promises.push(
          new Promise<void>((resolve) => {
            slideDown(slideAnim, 300, 300, () => {
              setSelectedStore(null);
              resolve();
            });
          }),
        );
      }

      // 가맹점 목록 패널 닫기
      if (options.showStoreList && showStoreListRef.current) {
        promises.push(
          new Promise<void>((resolve) => {
            slideDown(storeListAnim, 300, 300, () => {
              setShowStoreList(false);
              resolve();
            });
          }),
        );
      }

      // 모든 패널이 닫힐 때까지 대기
      if (promises.length > 0) {
        await Promise.all(promises);
        // 추가 대기 시간
        if (options.additionalDelay) {
          await new Promise((resolve) =>
            setTimeout(resolve, options.additionalDelay),
          );
        }
      }
    },
    [
      clickedLocationAnim,
      slideAnim,
      storeListAnim,
      setClickedLocation,
      setSelectedStore,
      setShowStoreList,
    ],
  );

  return {
    // 애니메이션 값
    slideAnim,
    clickedLocationAnim,
    storeListAnim,

    // 유틸리티 함수
    closeAllPanels,
  };
}
