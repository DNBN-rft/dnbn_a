import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { shouldLoadURL } from "expo-tosspayments-webview/utils";
import {
    ActivityIndicator,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WebView, { type WebViewNavigation } from "react-native-webview";

export default function TossPaymentWebView() {
  const insets = useSafeAreaInsets();
  const { paymentUrl } = useLocalSearchParams<{ paymentUrl: string }>();

  const onShouldStartLoadWithRequest = (
    request: WebViewNavigation,
  ): boolean => {
    const { url } = request;

    // 토스페이먼츠 결제 성공 콜백 감지 (백엔드에서 successUrl 설정 시 맞춰서 수정)
    if (
      url.includes("payment/success") ||
      url.startsWith("dnbnapp://payment-complete")
    ) {
      try {
        const parsedUrl = new URL(url);
        const paymentKey = parsedUrl.searchParams.get("paymentKey") ?? "";
        const orderId = parsedUrl.searchParams.get("orderId") ?? "";
        const amount = parsedUrl.searchParams.get("amount") ?? "";

        router.replace({
          pathname: "/(cust)/payment-complete",
          params: { paymentKey, orderId, amount },
        });
      } catch {
        router.replace("/(cust)/payment-complete");
      }
      return false;
    }

    // 토스페이먼츠 결제 실패 콜백 감지 (백엔드에서 failUrl 설정 시 맞춰서 수정)
    if (
      url.includes("payment/fail") ||
      url.startsWith("dnbnapp://payment-fail")
    ) {
      try {
        const parsedUrl = new URL(url);
        const code = parsedUrl.searchParams.get("code") ?? "";
        const message = parsedUrl.searchParams.get("message") ?? "";

        router.replace({
          pathname: "/(cust)/payment-fail",
          params: { code, message },
        });
      } catch {
        router.replace("/(cust)/payment-fail");
      }
      return false;
    }

    // 토스페이먼츠 결제 앱 스킴 처리 (카드사 앱, 토스 앱 등)
    return shouldLoadURL(url, Linking);
  };

  if (!paymentUrl) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>결제 정보를 불러올 수 없습니다.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>돌아가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#fff" }} />
      )}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>결제하기</Text>
        <View style={styles.headerRight} />
      </View>

      <WebView
        source={{ uri: paymentUrl }}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#EF7810" />
            <Text style={styles.loadingText}>결제 페이지 로딩 중...</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
    color: "#111",
  },
  headerRight: {
    width: 32,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 12,
    color: "#999",
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  backBtn: {
    backgroundColor: "#EF7810",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
