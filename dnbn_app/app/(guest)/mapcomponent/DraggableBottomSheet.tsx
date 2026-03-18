import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    PanResponder,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;

interface DraggableBottomSheetProps {
  children: React.ReactNode;
  slideAnim: Animated.Value;
  collapsedHeight: number;
  maxHeight?: number;
  onClose: () => void;
  zIndex?: number;
}

export default function DraggableBottomSheet({
  children,
  slideAnim,
  collapsedHeight,
  maxHeight,
  onClose,
  zIndex = 30,
}: DraggableBottomSheetProps) {
  const expandedHeight = maxHeight ?? SCREEN_HEIGHT * 0.92;
  const heightAnim = useRef(new Animated.Value(collapsedHeight)).current;
  const currentHeight = useRef(collapsedHeight);
  const [isExpanded, setIsExpanded] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dy) > 3,
      onPanResponderMove: (_, gs) => {
        const newHeight = currentHeight.current - gs.dy;
        if (newHeight >= collapsedHeight * 0.5 && newHeight <= expandedHeight) {
          heightAnim.setValue(newHeight);
        }
      },
      onPanResponderRelease: (_, gs) => {
        const newHeight = currentHeight.current - gs.dy;
        const midPoint = (collapsedHeight + expandedHeight) / 2;

        if (gs.vy < -0.5 || newHeight > midPoint) {
          // 위로 스냅 (전체화면)
          Animated.spring(heightAnim, {
            toValue: expandedHeight,
            useNativeDriver: false,
            bounciness: 4,
          }).start();
          currentHeight.current = expandedHeight;
          setIsExpanded(true);
        } else if (gs.vy > 0.8 || newHeight < collapsedHeight * 0.7) {
          // 아래로 빠르게 드래그 → height를 0으로 부드럽게 닫기
          Animated.timing(heightAnim, {
            toValue: 0,
            duration: 220,
            useNativeDriver: false,
          }).start(() => {
            onClose();
          });
        } else {
          // 원래 높이로 스냅
          Animated.spring(heightAnim, {
            toValue: collapsedHeight,
            useNativeDriver: false,
            bounciness: 4,
          }).start();
          currentHeight.current = collapsedHeight;
          setIsExpanded(false);
        }
      },
    }),
  ).current;

  const handleCollapse = () => {
    Animated.timing(heightAnim, {
      toValue: 0,
      duration: 220,
      useNativeDriver: false,
    }).start(() => {
      onClose();
    });
  };

  return (
    <Animated.View
      style={[
        sheetStyles.container,
        {
          height: heightAnim,
          transform: [{ translateY: slideAnim }],
          zIndex,
        },
      ]}
    >
      {isExpanded ? (
        // 확장 상태: X 버튼
        <View style={sheetStyles.closeButtonArea}>
          <TouchableOpacity
            onPress={handleCollapse}
            style={sheetStyles.closeButton}
          >
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      ) : (
        // 기본 상태: 드래그 핸들
        <View style={sheetStyles.dragHandleArea} {...panResponder.panHandlers}>
          <View style={sheetStyles.dragPill} />
        </View>
      )}
      <View style={{ flex: 1 }}>{children}</View>
    </Animated.View>
  );
}

const sheetStyles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  dragHandleArea: {
    width: "100%",
    paddingTop: 10,
    paddingBottom: 6,
    alignItems: "center",
  },
  dragPill: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ddd",
  },
  closeButtonArea: {
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
    alignItems: "flex-end",
  },
  closeButton: {
    padding: 4,
  },
});
