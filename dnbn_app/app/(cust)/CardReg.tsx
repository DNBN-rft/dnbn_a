import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./cardreg.styles";

export default function CardRegScreen() {
  const insets = useSafeAreaInsets();
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const handleRegister = () => {
    if (!cardNumber.trim()) {
      Alert.alert("입력 오류", "카드번호를 입력하세요.");
      return;
    }
    if (!expiryDate.trim()) {
      Alert.alert("입력 오류", "유효기간을 입력하세요.");
      return;
    }
    if (!cvc.trim()) {
      Alert.alert("입력 오류", "CVC를 입력하세요.");
      return;
    }
    if (!cardholderName.trim()) {
      Alert.alert("입력 오류", "카드소유자명을 입력하세요.");
      return;
    }

    // TODO: API 호출로 결제수단 등록
    console.log("결제수단 등록:", {
      cardNumber,
      expiryDate,
      cvc,
      cardholderName,
      isDefault,
    });

    Alert.alert("성공", "결제수단이 등록되었습니다.", [
      {
        text: "확인",
        onPress: () => router.back(),
      },
    ]);
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, "");
    const parts = cleaned.match(/.{1,4}/g) || [];
    setCardNumber(parts.join(" "));
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      setExpiryDate(cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4));
    } else {
      setExpiryDate(cleaned);
    }
  };

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#fff" }} />
      )}
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.centerSection}>
          <Text style={styles.title}>결제수단 등록</Text>
        </View>
        <View style={styles.rightSection} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* wrapper */}
        <View style={styles.wrapper}>
          {/* 카드번호 */}
          <View style={styles.section}>
            <Text style={styles.label}>카드번호 *</Text>
            <TextInput
              style={styles.input}
              placeholder="0000 0000 0000 0000"
              placeholderTextColor="#ccc"
              value={cardNumber}
              onChangeText={formatCardNumber}
              keyboardType="numeric"
              maxLength={19}
            />
          </View>

          {/* 유효기간 & CVC */}
          <View style={styles.row}>
            <View style={[styles.section, styles.flex]}>
              <Text style={styles.label}>유효기간 *</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                placeholderTextColor="#ccc"
                value={expiryDate}
                onChangeText={formatExpiryDate}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
            <View style={[styles.section, styles.flex]}>
              <Text style={styles.label}>CVC *</Text>
              <TextInput
                style={styles.input}
                placeholder="123"
                placeholderTextColor="#ccc"
                value={cvc}
                onChangeText={setCvc}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
            </View>
          </View>

          {/* 카드소유자명 */}
          <View style={styles.section}>
            <Text style={styles.label}>카드소유자명 *</Text>
            <TextInput
              style={styles.input}
              placeholder="카드소유자명"
              placeholderTextColor="#ccc"
              value={cardholderName}
              onChangeText={setCardholderName}
            />
          </View>

          {/* 기본 결제수단 설정 */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setIsDefault(!isDefault)}
            >
              <View
                style={[styles.checkbox, isDefault && styles.checkboxActive]}
              >
                {isDefault && (
                  <Ionicons name="checkmark" size={18} color="#fff" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>
                이 수단을 기본 결제수단으로 설정
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
        >
          <Text style={styles.registerButtonText}>등록</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>취소</Text>
        </TouchableOpacity>
      </View>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
