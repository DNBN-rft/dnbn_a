import { Animated, PanResponder } from "react-native";
import { expandPanel, resetPanel, slideDown } from "./animationUtils";

/**
 * 가맹점 상세 패널의 드래그 제스처 핸들러를 생성합니다
 */
export const createStoreDetailPanResponder = (
  slideAnim: Animated.Value,
  dragStartValue: React.MutableRefObject<number>,
  onClose: () => void
) => {
  return PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      dragStartValue.current = (slideAnim as any)._value || 300;
    },
    onPanResponderMove: (evt, gestureState) => {
      const newValue = dragStartValue.current + gestureState.dy;
      if (newValue > -200 && newValue < 350) {
        slideAnim.setValue(newValue);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dy > 150) {
        // 아래로 많이 드래그 → 패널 닫기
        slideDown(slideAnim, 300, 300, onClose);
      } else if (gestureState.dy < -50) {
        // 위로 드래그 → 패널 확장
        expandPanel(slideAnim, -200, 200);
      } else {
        // 중간 → 기본 위치로 복귀
        resetPanel(slideAnim, 200);
      }
    },
  });
};

/**
 * 가맹점 목록 패널의 드래그 제스처 핸들러를 생성합니다 (FlatList 전체용)
 */
export const createStoreListPanResponder = (
  storeListAnim: Animated.Value,
  dragStartValue: React.MutableRefObject<number>,
  scrollOffsetY: React.MutableRefObject<number>,
  onClose: () => void
) => {
  return PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      // 세로 드래그만 감지 (가로는 무시)
      const isVertical = Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      
      // 스크롤이 맨 위에 있고 아래로 드래그하는 경우만 패널 이동
      if (scrollOffsetY.current <= 0 && gestureState.dy > 5 && isVertical) {
        return true;
      }
      
      // 위로 드래그하는 경우 (패널 확장)
      if (gestureState.dy < -5 && isVertical) {
        return true;
      }
      
      return false;
    },
    onPanResponderGrant: () => {
      dragStartValue.current = (storeListAnim as any)._value || 0;
    },
    onPanResponderMove: (evt, gestureState) => {
      const newValue = dragStartValue.current + gestureState.dy;
      if (newValue > -300 && newValue < 300) {
        storeListAnim.setValue(newValue);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dy > 80) {
        // 아래로 드래그 → 목록 닫기
        slideDown(storeListAnim, 300, 300, onClose);
      } else if (gestureState.dy < -50) {
        // 위로 드래그 → 전체 확대
        expandPanel(storeListAnim, -300, 200);
      } else {
        // 중간 → 기본 위치
        resetPanel(storeListAnim, 200);
      }
    },
  });
};
