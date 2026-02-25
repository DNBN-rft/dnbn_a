import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./payment-fail.styles";

export default function PaymentFail() {
  const insets = useSafeAreaInsets();

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

        <TouchableOpacity
          style={styles.retryButton}
          onPress={handleGoToNegoAccepted}
        >
          <Ionicons name="chevron-back" size={20} color="#666" />
          <Text style={styles.retryButtonText}>결제 목록으로 이동</Text>
        </TouchableOpacity>
      </View>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#fff" }} />
      )}
    </View>
  );
}
