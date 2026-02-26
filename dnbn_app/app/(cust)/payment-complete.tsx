import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./payment-complete.styles";

export default function PaymentComplete() {
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
          <Ionicons name="checkmark" size={48} color="#fff" />
        </View>

        <Text style={styles.successText}>결제에 성공하였습니다</Text>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={handleGoToNegoAccepted}
        >
          <Ionicons name="chevron-back" size={20} color="#ef7810" />
          <Text style={styles.homeButtonText}>결제 목록으로 이동</Text>
        </TouchableOpacity>
      </View>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
