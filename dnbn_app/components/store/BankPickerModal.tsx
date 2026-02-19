import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { styles } from "@/app/(store)/editstoreinfo.styles";

interface Bank {
  bankIdx: number;
  bankNm: string;
}

interface BankPickerModalProps {
  visible: boolean;
  banks: Bank[];
  selectedBankName: string;
  loading: boolean;
  onSelect: (bankIdx: number, bankNm: string) => void;
  onClose: () => void;
}

export default function BankPickerModal({
  visible,
  banks,
  selectedBankName,
  loading,
  onSelect,
  onClose,
}: BankPickerModalProps) {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.bankPickerModalOverlay}>
        <View style={styles.bankPickerModalContent}>
          <View style={styles.bankPickerModalHeader}>
            <Text style={styles.bankPickerModalTitle}>은행 선택</Text>
          </View>

          <ScrollView
            style={{ paddingHorizontal: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {loading ? (
              <View
                style={{
                  paddingVertical: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#999" }}>
                  은행 목록을 불러오는 중입니다...
                </Text>
              </View>
            ) : banks.length > 0 ? (
              banks.map((bank) => (
                <TouchableOpacity
                  key={bank.bankIdx}
                  onPress={() => onSelect(bank.bankIdx, bank.bankNm)}
                  style={[
                    styles.bankPickerItem,
                    selectedBankName === bank.bankNm
                      ? styles.bankPickerItemActive
                      : styles.bankPickerItemInactive,
                  ]}
                >
                  <View style={styles.bankPickerItemRow}>
                    <Text
                      style={[
                        styles.bankPickerItemText,
                        selectedBankName === bank.bankNm
                          ? styles.bankPickerItemTextActive
                          : styles.bankPickerItemTextInactive,
                      ]}
                    >
                      {bank.bankNm}
                    </Text>
                    {selectedBankName === bank.bankNm && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#EF7810"
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View
                style={{
                  paddingVertical: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#999" }}>
                  사용 가능한 은행이 없습니다.
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.bankPickerModalFooter}>
            <TouchableOpacity
              style={styles.bankPickerCloseButton}
              onPress={onClose}
            >
              <Text style={styles.bankPickerCloseButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
