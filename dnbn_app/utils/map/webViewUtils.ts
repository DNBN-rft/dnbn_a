import { Platform } from "react-native";
import { WebView } from "react-native-webview";

export type WebViewMessageType =
  | { type: 'init' }
  | { type: 'userLocation'; latitude: number; longitude: number }
  | { type: 'userLocationWithZoom'; latitude: number; longitude: number; zoom: number }
  | { type: 'mapNavigation'; latitude: number; longitude: number; zoom: number }
  | { type: 'addStores'; stores: any[] }
  | { type: 'clearMarkers' }
  | { type: 'clearAllMarkers' }
  | { type: 'highlightStore'; storeId: string }
  | { type: 'ready' };

/**
 * WebView로 메시지를 전송합니다
 */
export const sendMessageToWebView = (
  webViewRef: React.RefObject<WebView | null>,
  message: WebViewMessageType
) => {
  if (!webViewRef.current) return;

  const jsonMessage = JSON.stringify(message);
  
  if (Platform.OS === 'android') {
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
  zoom: number = 2
) => {
  sendMessageToWebView(webViewRef, {
    type: "mapNavigation",
    latitude,
    longitude,
    zoom,
  });
};

/**
 * 사용자 위치를 지도에 표시합니다 (줌 포함)
 */
export const setUserLocationWithZoom = (
  webViewRef: React.RefObject<WebView | null>,
  latitude: number,
  longitude: number,
  zoom: number = 3
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
  stores: any[]
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
export const clearAllMarkers = (webViewRef: React.RefObject<WebView | null>) => {
  sendMessageToWebView(webViewRef, {
    type: "clearAllMarkers",
  });
};

/**
 * 가맹점 마커를 강조합니다
 */
export const highlightStoreMarker = (
  webViewRef: React.RefObject<WebView | null>,
  storeId: string
) => {
  sendMessageToWebView(webViewRef, {
    type: "highlightStore",
    storeId,
  });
};
