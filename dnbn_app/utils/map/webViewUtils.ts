import { Platform } from "react-native";
import { WebView } from "react-native-webview";

export type WebViewMessageType =
  | { type: "init" }
  | { type: "userLocation"; latitude: number; longitude: number }
  | {
      type: "userLocationWithZoom";
      latitude: number;
      longitude: number;
      zoom: number;
    }
  | { type: "mapNavigation"; latitude: number; longitude: number; zoom: number }
  | { type: "addStores"; stores: any[] }
  | { type: "clearMarkers" }
  | { type: "clearAllMarkers" }
  | { type: "highlightStore"; storeId: string }
  | { type: "ready" };

/**
 * WebView로 메시지를 전송합니다
 */
export const sendMessageToWebView = (
  webViewRef: React.RefObject<WebView | null>,
  message: WebViewMessageType,
) => {
  if (!webViewRef.current) return;

  const jsonMessage = JSON.stringify(message);

  if (Platform.OS === "android") {
    const script = `
      (function() {
        try {
          const msg = ${jsonMessage};
          if (window.handleMessage) {
            window.handleMessage(msg);
          } else {
            window.messageQueue = window.messageQueue || [];
            window.messageQueue.push(msg);
          }
        } catch (e) {
          console.error('Message injection error:', e);
        }
      })();
      true;
    `;
    webViewRef.current.injectJavaScript(script);
  } else {
    webViewRef.current.postMessage(jsonMessage);
  }
};

/**
 * 지도를 특정 좌표로 이동합니다 (마커 없음)
 */
export const moveMapToLocation = (
  webViewRef: React.RefObject<WebView | null>,
  latitude: number,
  longitude: number,
  zoom: number = 2,
) => {
  sendMessageToWebView(webViewRef, {
    type: "mapNavigation",
    latitude,
    longitude,
    zoom,
  });
};

/**
 * 검색 주소 위치에 핀을 표시합니다 (JS 직접 주입)
 */
export const addSearchPin = (
  webViewRef: React.RefObject<WebView | null>,
  latitude: number,
  longitude: number,
) => {
  if (!webViewRef.current) return;
  const script = `
    (function() {
      try {
        if (window._searchPin) {
          window._searchPin.setMap(null);
          window._searchPin = null;
        }
        var pos = new kakao.maps.LatLng(${latitude}, ${longitude});
        window._searchPin = new kakao.maps.Marker({ position: pos, map: window.map, zIndex: 10 });
      } catch(e) {
        console.warn('[searchPin error]', e && e.message);
      }
    })();
    true;
  `;
  webViewRef.current.injectJavaScript(script);
};

/**
 * 검색 핀을 제거합니다
 */
export const clearSearchPin = (webViewRef: React.RefObject<WebView | null>) => {
  if (!webViewRef.current) return;
  const script = `
    (function() {
      try {
        if (window._searchPin) {
          window._searchPin.setMap(null);
          window._searchPin = null;
        }
      } catch(e) {}
    })();
    true;
  `;
  webViewRef.current.injectJavaScript(script);
};

/**
 * 지도를 픽셀 단위로 pan합니다 (하단 패널 보정용)
 */
export const panMapBy = (
  webViewRef: React.RefObject<WebView | null>,
  dx: number,
  dy: number,
) => {
  sendMessageToWebView(webViewRef, { type: "panBy", dx, dy });
};

/**
 * 사용자 위치를 지도에 표시합니다 (줌 포함)
 */
export const setUserLocationWithZoom = (
  webViewRef: React.RefObject<WebView | null>,
  latitude: number,
  longitude: number,
  zoom: number = 3,
) => {
  sendMessageToWebView(webViewRef, {
    type: "userLocationWithZoom",
    latitude,
    longitude,
    zoom,
  });
};

/**
 * 가맹점 마커를 지도에 추가합니다
 */
export const addStoreMarkers = (
  webViewRef: React.RefObject<WebView | null>,
  stores: any[],
) => {
  if (stores.length > 0) {
    sendMessageToWebView(webViewRef, {
      type: "addStores",
      stores,
    });
  }
};

/**
 * 모든 마커를 제거합니다
 */
export const clearAllMarkers = (
  webViewRef: React.RefObject<WebView | null>,
) => {
  sendMessageToWebView(webViewRef, {
    type: "clearAllMarkers",
  });
};

/**
 * 가맹점 마커를 강조합니다
 */
export const highlightStoreMarker = (
  webViewRef: React.RefObject<WebView | null>,
  storeId: string,
) => {
  sendMessageToWebView(webViewRef, {
    type: "highlightStore",
    storeId,
  });
};
