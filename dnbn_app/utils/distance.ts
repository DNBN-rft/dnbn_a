export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  // 지구의 반지름 (km)
  const R = 6371;

  // 위도와 경도를 라디안으로 변환
  const toRad = (value: number) => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const radLat1 = toRad(lat1);
  const radLat2 = toRad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(radLat1) *
      Math.cos(radLat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // 거리 계산 (m)
  const distance = R * c * 1000;

  return distance;
}

/**
 * @param distanceInMeters 거리 (단위: m)
 * @returns 포맷팅된 거리 문자열 (999m까지는 "m", 1000m부터는 "km" 단위로 표기)
 */
export function formatDistance(distanceInMeters: number): string {
  if (distanceInMeters < 1000) {
    return `${Math.round(distanceInMeters)}m`;
  }
  return `${(distanceInMeters / 1000).toFixed(1)}km`;
}
