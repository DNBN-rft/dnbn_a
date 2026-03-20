import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { shouldLoadURL } from "expo-tosspayments-webview/utils";
import {
  ActivityIndicator,
  Linking,
  Platform,
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

  // Android intent:// URL 파싱 → scheme:// 변환 후 앱 열기, 미설치 시 Play Store 이동
  const handleAndroidIntentUrl = async (url: string): Promise<void> => {
    try {
      const hashIdx = url.indexOf("#Intent;");
      const intentParams: Record<string, string> = {};

      if (hashIdx !== -1) {
        const fragment = url
          .substring(hashIdx + "#Intent;".length)
          .replace(/;end$/, "");
        fragment.split(";").forEach((part) => {
          const eqIdx = part.indexOf("=");
          if (eqIdx !== -1) {
            intentParams[part.substring(0, eqIdx)] = part.substring(eqIdx + 1);
          }
        });
      }

      const scheme = intentParams["scheme"];
      const packageName = intentParams["package"];
      const path = url.substring(
        "intent://".length,
        hashIdx !== -1 ? hashIdx : undefined,
      );

      if (scheme) {
        const schemeUrl = `${scheme}://${path}`;
        console.log("[WebView] intent → scheme 변환:", schemeUrl);
        try {
          await Linking.openURL(schemeUrl);
          return;
        } catch {
          console.log("[WebView] scheme으로 앱 열기 실패, Play Store 시도");
        }
      }

      if (packageName) {
        const marketUrl = `market://details?id=${packageName}`;
        console.log("[WebView] Play Store 이동:", marketUrl);
        await Linking.openURL(marketUrl).catch(() =>
          Linking.openURL(
            `https://play.google.com/store/apps/details?id=${packageName}`,
          ),
        );
      }
    } catch (e) {
      console.error("[WebView] intent URL 처리 실패:", e);
    }
  };

  // 앱 스킴 URL 처리 공통 함수
  const handleAppSchemeUrl = (url: string): boolean => {
    const isAppScheme =
      !url.startsWith("http://") && !url.startsWith("https://");

    if (!isAppScheme) return true;

    console.log("[WebView] 앱 스킴 감지됨:", url);

    // Android intent:// 는 별도 파싱 처리
    if (Platform.OS === "android" && url.startsWith("intent://")) {
      handleAndroidIntentUrl(url);
      return false;
    }

    shouldLoadURL(url, Linking);
    return false;
  };

  // 성공/실패 콜백 URL 처리 공통 함수
  const handleCallbackUrl = (url: string): boolean => {
    if (
      (url.includes("dnbn-x5or.onrender.com") &&
        url.includes("payment/success")) ||
      url.startsWith("dnbnapp://payment-complete")
    ) {
      console.log("[WebView] 성공 콜백 감지됨:", url);
      try {
        const parsedUrl = new URL(url);
        const paymentKey = parsedUrl.searchParams.get("paymentKey") ?? "";
        const orderId = parsedUrl.searchParams.get("orderId") ?? "";
        const amount = parsedUrl.searchParams.get("amount") ?? "";
        console.log(
          "[Toss 결제 성공 콜백 데이터]",
          JSON.stringify({ paymentKey, orderId, amount }, null, 2),
        );
        router.replace({
          pathname: "/(cust)/payment-complete",
          params: { paymentKey, orderId, amount },
        });
      } catch (e) {
        console.error("[WebView] 성공 콜백 파싱 오류", e);
        router.replace("/(cust)/payment-complete");
      }
      return false;
    }

    if (
      (url.includes("dnbn-x5or.onrender.com") &&
        url.includes("payment/fail")) ||
      url.startsWith("dnbnapp://payment-fail")
    ) {
      console.log("[WebView] 실패 콜백 감지됨:", url);
      try {
        const parsedUrl = new URL(url);
        const code = parsedUrl.searchParams.get("code") ?? "";
        const message = parsedUrl.searchParams.get("message") ?? "";
        const orderId = parsedUrl.searchParams.get("orderId") ?? "";
        console.log(
          "[Toss 결제 실패 콜백 데이터]",
          JSON.stringify({ code, message, orderId }, null, 2),
        );
        router.replace({
          pathname: "/(cust)/payment-fail",
          params: { code, message, orderId },
        });
      } catch (e) {
        console.error("[WebView] 실패 콜백 파싱 오류", e);
        router.replace("/(cust)/payment-fail");
      }
      return false;
    }

    return true;
  };

  const onShouldStartLoadWithRequest = (
    request: WebViewNavigation,
  ): boolean => {
    const { url } = request;
    console.log("[WebView URL 요청]", url);

    if (!handleCallbackUrl(url)) return false;
    if (!handleAppSchemeUrl(url)) return false;

    const shouldLoad = shouldLoadURL(url, Linking);
    if (!shouldLoad) {
      console.log("[WebView] shouldLoadURL → false (앱 열기 시도):", url);
    }
    return shouldLoad;
  };

  // Android 한정: JS 기반 앱 이동이 onShouldStartLoadWithRequest를 우회하는 경우 대응
  // iOS는 onShouldStartLoadWithRequest에서 정상 처리되므로 적용 불필요
  const onNavigationStateChange =
    Platform.OS === "android"
      ? (navState: any) => {
          const { url } = navState;
          if (!url) return;
          console.log("[WebView] NavigationState 변경:", url);
          if (!url.startsWith("http://") && !url.startsWith("https://")) {
            console.log(
              "[WebView] NavigationState 앱 스킴 감지 (Android):",
              url,
            );
            Linking.openURL(url).catch((e) =>
              console.error("[WebView] Linking.openURL 실패:", url, e),
            );
          }
        }
      : undefined;

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
        originWhitelist={["*"]}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        onNavigationStateChange={onNavigationStateChange}
        onLoadStart={({ nativeEvent }) =>
          console.log("[WebView] 로드 시작:", nativeEvent.url)
        }
        onLoadEnd={({ nativeEvent }) =>
          console.log("[WebView] 로드 완료:", nativeEvent.url)
        }
        onError={({ nativeEvent }) =>
          console.error(
            "[WebView] 로드 에러:",
            nativeEvent.code,
            nativeEvent.description,
            nativeEvent.url,
          )
        }
        onHttpError={({ nativeEvent }) =>
          console.error(
            "[WebView] HTTP 에러:",
            nativeEvent.statusCode,
            nativeEvent.url,
          )
        }
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
