// Location Utils
export {
    DEFAULT_LOCATION,
    calculateDistance,
    checkLocationPermission,
    getCurrentLocation,
    getLastKnownLocation,
    getUserLocation,
    isWithinRange,
    requestLocationPermission
} from "./locationUtils";

// Geocoding Utils
export {
    createKakaoHeaders,
    geocodeAddress,
    reverseGeocode,
    searchKakaoAddress,
    searchKakaoCoordToAddress
} from "./geocodingUtils";
export type {
    GeocodingResult,
    KakaoAddressDocument,
    KakaoCoord2AddressDocument
} from "./geocodingUtils";

// Store Utils
export {
    TEST_STORES,
    addDistanceToStores,
    fetchNearbyStores,
    fetchStoreDetail,
    filterStoresInRange,
    sortStoresByDistance
} from "./storeUtils";
export type { Store } from "./storeUtils";

// Animation Utils
export {
    animateFromTo,
    runAnimation,
    setAnimationValue,
    slideDown,
    slideUp
} from "./animationUtils";
export type { AnimationConfig } from "./animationUtils";

// WebView Utils
export {
    addSearchPin,
    addStoreMarkers,
    clearAllMarkers,
    clearSearchPin,
    highlightStoreMarker,
    moveMapToLocation,
    panMapBy,
    sendMessageToWebView,
    setUserLocationWithZoom
} from "./webViewUtils";
export type { WebViewMessageType } from "./webViewUtils";

export interface ClickedLocation {
  latitude: number;
  longitude: number;
  address?: string;
}
