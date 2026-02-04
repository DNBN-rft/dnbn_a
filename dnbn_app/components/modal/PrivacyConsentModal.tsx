import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface PrivacyConsentModalProps {
  visible: boolean;
  storeName: string;
  onClose: () => void;
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "90%",
    maxHeight: "80%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  closeButton: {
    padding: 5,
  },
  scrollContent: {
    maxHeight: 400,
  },
  contentText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
    marginLeft: 10,
  },
  confirmButton: {
    backgroundColor: "#EF7810",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default function PrivacyConsentModal({
  visible,
  storeName,
  onClose,
}: PrivacyConsentModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>개인정보 제공 동의</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.contentText}>
              {storeName}에서 상품을 구매하시기 위해 아래의 개인정보를 제공하는
              것에 동의합니다.
            </Text>

            <Text style={styles.sectionTitle}>1. 제공받는 자</Text>
            <Text style={styles.bulletPoint}>• {storeName}</Text>

            <Text style={styles.sectionTitle}>2. 제공 목적</Text>
            <Text style={styles.bulletPoint}>
              • 상품 구매 및 배송 서비스 제공{"\n"}• 주문 확인 및 고객 상담
              {"\n"}• 결제 처리 및 영수증 발급
            </Text>

            <Text style={styles.sectionTitle}>3. 제공 항목</Text>
            <Text style={styles.bulletPoint}>
              • 이름, 연락처, 배송 주소{"\n"}• 구매 상품 정보{"\n"}• 결제 정보
            </Text>

            <Text style={styles.sectionTitle}>4. 보유 및 이용 기간</Text>
            <Text style={styles.bulletPoint}>
              • 상품 구매 완료 후 5년간 보관{"\n"}• 관련 법령에 따른 보존 기간
              준수
            </Text>

            <Text style={[styles.contentText, { marginTop: 16 }]}>
              위 개인정보 제공에 동의하지 않으실 수 있으며, 동의하지 않으실 경우
              상품 구매가 제한될 수 있습니다.
            </Text>
          </ScrollView>

          <TouchableOpacity style={styles.confirmButton} onPress={onClose}>
            <Text style={styles.confirmButtonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
