import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
    Animated,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { styles } from "../report.styles";

interface ReportReason {
  label: string;
  value: string;
}

interface ReportReasonModalProps {
  visible: boolean;
  onClose: () => void;
  reportReasons: ReportReason[];
  selectedReason: string;
  onSelectReason: (value: string) => void;
}

export function ReportReasonModal({
  visible,
  onClose,
  reportReasons,
  selectedReason,
  onSelectReason,
}: ReportReasonModalProps) {
  const slideAnim = useRef(new Animated.Value(1000)).current;

  useEffect(() => {
    if (visible) {
      // 모달 열기: 오른쪽에서 왼쪽으로 슬라이드
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // 모달 닫기: 왼쪽에서 오른쪽으로 슬라이드
      Animated.timing(slideAnim, {
        toValue: 1000,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleSelectReason = (value: string) => {
    onSelectReason(value);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.modalFullScreen,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.modalBackButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>신고 사유 선택</Text>
          <View style={styles.modalHeaderPlaceholder} />
        </View>
        <ScrollView style={styles.modalOptions}>
          {reportReasons
            .filter((reason) => reason.value !== "")
            .map((reason) => (
              <TouchableOpacity
                key={reason.value}
                style={[
                  styles.modalOption,
                  selectedReason === reason.value && styles.modalSelectedOption,
                ]}
                onPress={() => handleSelectReason(reason.value)}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    selectedReason === reason.value &&
                      styles.modalSelectedOptionText,
                  ]}
                >
                  {reason.label}
                </Text>
                {selectedReason === reason.value && (
                  <Ionicons name="checkmark" size={20} color="#FF6B00" />
                )}
              </TouchableOpacity>
            ))}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}
