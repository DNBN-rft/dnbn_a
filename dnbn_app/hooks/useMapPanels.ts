import { useCallback, useRef } from "react";
import { Animated } from "react-native";
import { 
  slideUp, 
  slideDown 
} from "../utils/map/animationUtils";

export interface ClickedLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

/**
 * 지도의 패널 상태와 애니메이션을 관리하는 커스텀 훅
 */
export const useMapPanels = () => {
  // 애니메이션 값
  const slideAnim = useRef(new Animated.Value(300)).current; // 가맹점 상세
  const clickedLocationAnim = useRef(new Animated.Value(500)).current; // 클릭 위치
  const storeListAnim = useRef(new Animated.Value(300)).current; // 가맹점 목록
  
  // 드래그 시작값 (외부에서 사용할 수 있도록 노출)
  const dragStartValue = useRef(0);
  const storeListDragStartValue = useRef(0);

  /**
   * 클릭한 위치 패널 열기
   */
  const openClickedLocationPanel = useCallback((location: ClickedLocation) => {
    slideUp(clickedLocationAnim, 400);
  }, [clickedLocationAnim]);

  /**
   * 클릭한 위치 패널 닫기
   */
  const closeClickedLocationPanel = useCallback((callback?: () => void) => {
    slideDown(clickedLocationAnim, 500, 300, callback);
  }, [clickedLocationAnim]);

  /**
   * 가맹점 목록 패널 열기
   */
  const openStoreListPanel = useCallback((callback?: () => void) => {
    slideUp(storeListAnim, 400, callback);
  }, [storeListAnim]);

  /**
   * 가맹점 목록 패널 닫기
   */
  const closeStoreListPanel = useCallback((callback?: () => void) => {
    slideDown(storeListAnim, 300, 300, callback);
  }, [storeListAnim]);

  /**
   * 가맹점 상세 패널 열기
   */
  const openStoreDetailPanel = useCallback((callback?: () => void) => {
    slideUp(slideAnim, 300, callback);
  }, [slideAnim]);

  /**
   * 가맹점 상세 패널 닫기
   */
  const closeStoreDetailPanel = useCallback((callback?: () => void) => {
    slideDown(slideAnim, 300, 300, callback);
  }, [slideAnim]);

  /**
   * 모든 패널 닫기
   */
  const closeAllPanels = useCallback(async () => {
    const promises: Promise<void>[] = [];

    promises.push(
      new Promise<void>((resolve) => {
        closeClickedLocationPanel(resolve);
      })
    );
    
    promises.push(
      new Promise<void>((resolve) => {
        closeStoreListPanel(resolve);
      })
    );
    
    promises.push(
      new Promise<void>((resolve) => {
        closeStoreDetailPanel(resolve);
      })
    );

    await Promise.all(promises);
  }, [closeClickedLocationPanel, closeStoreListPanel, closeStoreDetailPanel]);

  return {
    // 애니메이션 값
    slideAnim,
    clickedLocationAnim,
    storeListAnim,
    
    // 드래그 시작값 ref
    dragStartValue,
    storeListDragStartValue,
    
    // 패널 제어 함수
    openClickedLocationPanel,
    closeClickedLocationPanel,
    openStoreListPanel,
    closeStoreListPanel,
    openStoreDetailPanel,
    closeStoreDetailPanel,
    closeAllPanels,
  };
};
