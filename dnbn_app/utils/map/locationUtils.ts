import * as Location from "expo-location";

export const DEFAULT_LOCATION = { latitude: 37.4979, longitude: 127.0276 };

//위치 권한을 요청합니다
export const requestLocationPermission = async (): Promise<Location.PermissionStatus> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status;
};

//현재 위치 권한 상태를 확인합니다
export const checkLocationPermission = async (): Promise<Location.PermissionStatus> => {
  const { status } = await Location.getForegroundPermissionsAsync();
  return status;
};

//마지막으로 알려진 위치를 가져옵니다
export const getLastKnownLocation = async (): Promise<Location.LocationObject | null> => {
  try {
    const location = await Location.getLastKnownPositionAsync();
    return location;
  } catch (error) {
    console.log("Last known position error:", error);
    return null;
  }
};

// 현재 위치를 가져옵니다 (타임아웃 포함)
export const getCurrentLocation = async (timeout: number = 5000): Promise<Location.LocationObject | null> => {
  try {
    const location = await Promise.race([
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: timeout,
        mayShowUserSettingsDialog: false,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), timeout)
      )
    ]);
    return location;
  } catch (error) {
    console.log("Get current location error:", error);
    return null;
  }
};

//사용자의 현재 위치를 가져옵니다 (권한 요청 + 위치 조회)
export const getUserLocation = async (): Promise<Location.LocationObject | null> => {
  const status = await checkLocationPermission();
  console.log("Location permission status:", status);
  
  if (status !== "granted") {
    const newStatus = await requestLocationPermission();
    if (newStatus !== "granted") {
      return null;
    }
  }

  // 먼저 마지막 위치 시도
  const lastLocation = await getLastKnownLocation();
  if (lastLocation) {
    return lastLocation;
  }

  // 현재 위치 가져오기
  const currentLocation = await getCurrentLocation();
  return currentLocation;
};

//두 좌표 사이의 거리를 계산합니다 (Haversine formula)
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // 지구 반지름 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

//특정 좌표를 기준으로 범위 내에 있는지 확인합니다
export const isWithinRange = (
  centerLat: number,
  centerLon: number,
  targetLat: number,
  targetLon: number,
  threshold: number = 0.05
): boolean => {
  const latDiff = Math.abs(targetLat - centerLat);
  const lonDiff = Math.abs(targetLon - centerLon);
  return latDiff < threshold && lonDiff < threshold;
};
