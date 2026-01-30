// Location Utils
export {
  DEFAULT_LOCATION,
  requestLocationPermission,
  checkLocationPermission,
  getLastKnownLocation,
  getCurrentLocation,
  getUserLocation,
  calculateDistance,
  isWithinRange,
} from "./locationUtils";

// Geocoding Utils
export {
  createKakaoHeaders,
  searchKakaoAddress,
  searchKakaoCoordToAddress,
  geocodeAddress,
  reverseGeocode,
} from "./geocodingUtils";
export type { GeocodingResult, KakaoAddressDocument, KakaoCoord2AddressDocument } from "./geocodingUtils";

// Store Utils
export {
  TEST_STORES,
  filterStoresInRange,
  addDistanceToStores,
  sortStoresByDistance,
  fetchStoresFromAPI,
  fetchNearbyStores,
} from "./storeUtils";
export type { Store } from "./storeUtils";

// Animation Utils
export {
  runAnimation,
  setAnimationValue,
  animateFromTo,
  slideUp,
  slideDown,
  expandPanel,
  resetPanel,
} from "./animationUtils";
export type { AnimationConfig } from "./animationUtils";

// WebView 메시지 타입 정의
export type WebViewMessageType =
  | { type: 'init' }
  | { type: 'userLocation'; latitude: number; longitude: number }
  | { type: 'userLocationWithZoom'; latitude: number; longitude: number; zoom: number }
  | { type: 'mapNavigation'; latitude: number; longitude: number; zoom: number }
  | { type: 'addStores'; stores: any[] }
  | { type: 'clearMarkers' }
  | { type: 'clearAllMarkers' }
  | { type: 'ready' };

export interface ClickedLocation {
  latitude: number;
  longitude: number;
  address?: string;
}
