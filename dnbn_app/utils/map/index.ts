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

// WebView Utils
export {
  sendMessageToWebView,
  moveMapToLocation,
  setUserLocationWithZoom,
  addStoreMarkers,
  clearAllMarkers,
  highlightStoreMarker,
} from "./webViewUtils";
export type { WebViewMessageType } from "./webViewUtils";

// Panel Gesture Utils
export {
  createStoreDetailPanResponder,
  createStoreListPanResponder,
} from "./panelGestureUtils";

export interface ClickedLocation {
  latitude: number;
  longitude: number;
  address?: string;
}
