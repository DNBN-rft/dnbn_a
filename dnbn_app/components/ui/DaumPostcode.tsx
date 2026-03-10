/**
 * @actbase/react-daum-postcode 라이브러리의 iOS Safari 열림 버그를 수정한 커스텀 컴포넌트.
 *
 * 원인: 라이브러리 내부 onShouldStartLoadWithRequest가 postcode.map.daum.net만 허용하고
 * t1.daumcdn.net(Daum Postcode JS CDN)을 허용하지 않아 iOS WKWebView가 Safari를 열어버림.
 */
import React, { useCallback, useMemo } from "react";
import { Linking, StyleProp, View, ViewStyle } from "react-native";
import { WebView } from "react-native-webview";

const POSTCODE_HTML = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
  <style>
    * { box-sizing: border-box }
    html, body { width: 100%; height: 100%; margin: 0; padding: 0; background-color: #ececec; }
  </style>
</head>
<body>
  <div id="layer" style="width:100%; min-height:100%;"></div>
  <script type="text/javascript">
    function callback() {
      var el = document.getElementById('layer');
      el.innerHTML = "";
      new daum.Postcode({
        ...window.options,
        onsearch: function() { window.scrollTo(0, 0); },
        oncomplete: function(data) {
          window.ReactNativeWebView.postMessage(JSON.stringify(data));
        },
        onresize: function(size) {
          document.getElementById('layer').style.height = size.height + 'px';
        },
        onclose: function() { callback(); },
        width: '100%',
        height: '100%',
      }).embed(el);
    }
    function initOnReady(options) {
      window.options = options;
      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      s.onreadystatechange = callback;
      s.onload = callback;
      var x = document.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(s, x);
    }
  </script>
</body>
</html>
`;

// iOS에서 허용할 URL 도메인 목록
const ALLOWED_URL_PREFIXES = [
  "https://postcode.map.daum.net",
  "http://postcode.map.daum.net",
  "https://t1.daumcdn.net", // Daum Postcode JS CDN
  "https://daumcdn.net",
  "http://daumcdn.net",
  "https://map.daum.net",
];

interface DaumPostcodeProps {
  style?: StyleProp<ViewStyle>;
  jsOptions?: object;
  onSelected: (data: any) => void;
  onError?: (error: any) => void;
}

export default function DaumPostcode({
  style,
  jsOptions = { hideMapBtn: true },
  onSelected,
  onError,
}: DaumPostcodeProps) {
  const injectedJavaScript = useMemo(
    () => `initOnReady(${JSON.stringify(jsOptions)});void(0);`,
    [jsOptions],
  );

  const onMessage = useCallback(
    (event: any) => {
      try {
        if (event.nativeEvent.data) {
          onSelected(JSON.parse(event.nativeEvent.data));
        }
      } catch (e) {
        onError?.(e);
      }
    },
    [onSelected, onError],
  );

  return (
    <View style={style}>
      <WebView
        originWhitelist={["*"]}
        mixedContentMode="compatibility"
        androidLayerType="hardware"
        renderToHardwareTextureAndroid
        useWebKit
        source={{
          html: POSTCODE_HTML,
          baseUrl: "https://postcode.map.daum.net",
        }}
        onMessage={onMessage}
        injectedJavaScript={injectedJavaScript}
        onShouldStartLoadWithRequest={(request) => {
          const url = request.url ?? "";

          // about:blank 및 비-http URL은 허용
          if (!url.startsWith("http")) return true;

          // 허용된 도메인이면 WebView 내부에서 로드
          if (ALLOWED_URL_PREFIXES.some((prefix) => url.startsWith(prefix))) {
            return true;
          }

          // 그 외 외부 URL은 Safari/브라우저로 열기
          Linking.openURL(url).catch(() => {});
          return false;
        }}
      />
    </View>
  );
}
