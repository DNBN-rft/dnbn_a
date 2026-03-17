import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./payment-fail.styles";

export default function PaymentFail() {
  const insets = useSafeAreaInsets();
  const { code, message } = useLocalSearchParams<{
    code?: string;
    message?: string;
  }>();

  const handleGoToNegoAccepted = () => {
    router.replace("/(cust)/nego-accepted");
  };

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#fff" }} />
      )}

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="alert" size={48} color="#fff" />
        </View>

        <Text style={styles.failText}>결제가 실패했습니다</Text>

        {!!message && (
          <Text style={{ fontSize: 14, color: "#666", marginTop: 8, textAlign: "center", paddingHorizontal: 24 }}>
            {message}
          </Text>
        )}
        {!!code && (
          <Text style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
            오류 코드: {code}
          </Text>
        )}

        <TouchableOpacity
          style={styles.retryButton}
          onPress={handleGoToNegoAccepted}
        >
          <Ionicons name="chevron-back" size={20} color="#666" />
          <Text style={styles.retryButtonText}>결제 목록으로 이동</Text>
        </TouchableOpacity>
      </View>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
