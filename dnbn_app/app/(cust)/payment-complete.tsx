import { apiPost } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./payment-complete.styles";

export default function PaymentComplete() {
  const insets = useSafeAreaInsets();
  const { paymentKey, orderId, amount } = useLocalSearchParams<{
    paymentKey?: string;
    orderId?: string;
    amount?: string;
  }>();
  const [confirming, setConfirming] = useState(false);

  const confirmPayment = useCallback(async () => {
    setConfirming(true);
    try {
      const response = await apiPost("/cust/payment/toss/confirm", {
        paymentKey,
        orderId,
        amount: Number(amount),
      });

      if (!response.ok) {
        console.error("결제 확인 실패:", response.status);
      }
    } catch (error) {
      console.error("결제 확인 오류:", error);
    } finally {
      setConfirming(false);
    }
  }, [paymentKey, orderId, amount]);

  useEffect(() => {
    if (paymentKey && orderId && amount) {
      confirmPayment();
    }
  }, [paymentKey, orderId, amount, confirmPayment]);

  const handleGoToNegoAccepted = () => {
    router.replace("/(cust)/nego-accepted");
  };

  if (confirming) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#EF7810" />
        <Text style={{ marginTop: 12, color: "#999" }}>결제 확인 중...</Text>
      </View>
    );
  }

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
