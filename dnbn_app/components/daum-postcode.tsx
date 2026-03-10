/**
 * Daum Postcode API WebView 컴포넌트
 *
 * 주소 검색을 위한 WebView 모달
 * - react-native-webview 사용
 * - postMessage로 주소 데이터 전달
 */
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Platform, Text, TouchableOpacity, View } from "react-native";
import { WebView } from "react-native-webview";
import { styles } from "./daum-postcode.styles";

interface DaumPostcodeProps {
  visible: boolean;
  onClose: () => void;
  onComplete: (data: {
    zonecode: string;
    address: string;
    addressType: string;
    buildingName?: string;
  }) => void;
}

export default function DaumPostcode({
  visible,
  onClose,
  onComplete,
}: DaumPostcodeProps) {
  /**
   * WebView에서 메시지 수신
   */
  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      // 도로명 주소 우선, 없으면 지번 주소 사용
      const fullAddress = data.roadAddress || data.jibunAddress || data.address;

      onComplete({
        zonecode: data.zonecode,
        address: fullAddress,
        addressType: data.addressType,
        buildingName: data.buildingName,
      });
      onClose();
    } catch (error) {
      console.error("주소 데이터 파싱 에러:", error);
    }
  };

  /**
   * Daum Postcode API HTML
   */
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>주소 검색</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      width: 100%;
      height: 100vh;
      overflow: hidden;
    }
    #wrap {
      width: 100%;
      height: 100%;
    }
  </style>
</head>
<body>
  <div id="wrap"></div>
  <script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
  <script>
    new daum.Postcode({
      oncomplete: function(data) {
        // 주소 정보를 React Native로 전달
        // 도로명 주소 우선, 없으면 지번 주소
        var fullAddress = data.roadAddress || data.jibunAddress || data.address;
        
        window.ReactNativeWebView.postMessage(JSON.stringify({
          zonecode: data.zonecode,
          address: fullAddress,
          roadAddress: data.roadAddress,
          jibunAddress: data.jibunAddress,
          addressType: data.addressType,
          buildingName: data.buildingName || ''
        }));
      },
      onclose: function() {
        // 창 닫기 이벤트
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'close' }));
      },
      width: '100%',
      height: '100%'
    }).embed(document.getElementById('wrap'));
  </script>
</body>
</html>
  `;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>주소 검색</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
        </View>

        {/* WebView */}
        <WebView
          source={{ html }}
          onMessage={handleMessage}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={Platform.OS === "android"}
        />
      </View>
    </Modal>
  );
}
