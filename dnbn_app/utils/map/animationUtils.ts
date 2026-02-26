import { Animated } from "react-native";

export interface AnimationConfig {
  toValue: number;
  duration: number;
  useNativeDriver?: boolean;
}

//기본 애니메이션을 실행합니다
export const runAnimation = (
  animValue: Animated.Value,
  config: AnimationConfig,
  callback?: () => void
) => {
  Animated.timing(animValue, {
    toValue: config.toValue,
    duration: config.duration,
    useNativeDriver: config.useNativeDriver ?? false,
  }).start(callback);
};

//애니메이션 값을 설정합니다
export const setAnimationValue = (animValue: Animated.Value, value: number) => {
  animValue.setValue(value);
};

//애니메이션 값을 설정하고 애니메이션을 실행합니다
export const animateFromTo = (
  animValue: Animated.Value,
  fromValue: number,
  toValue: number,
  duration: number = 300,
  callback?: () => void
) => {
  setAnimationValue(animValue, fromValue);
  runAnimation(animValue, { toValue, duration }, callback);
};

//패널을 슬라이드 업 애니메이션으로 표시합니다
export const slideUp = (
  animValue: Animated.Value,
  duration: number = 400,
  callback?: () => void
) => {
  animateFromTo(animValue, 300, 0, duration, callback);
};

//패널을 슬라이드 다운 애니메이션으로 숨깁니다
export const slideDown = (
  animValue: Animated.Value,
  toValue: number = 300,
  duration: number = 300,
  callback?: () => void
) => {
  runAnimation(animValue, { toValue, duration }, callback);
};
