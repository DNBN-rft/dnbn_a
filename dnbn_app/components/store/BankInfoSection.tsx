import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { styles } from "@/app/(store)/editstoreinfo.styles";

interface BankInfoSectionProps {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  onBankSelect: () => void;
  onAccountNumberChange: (value: string) => void;
}

export default function BankInfoSection({
  bankName,
  accountNumber,
  accountHolder,
  onBankSelect,
  onAccountNumberChange,
}: BankInfoSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="card" size={22} color="#EF7810" />
        <Text style={styles.sectionTitle}>계좌 정보</Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>은행명</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={onBankSelect}
        >
          <Text
            style={[
              bankName
                ? styles.selectableInput
                : styles.selectableInputPlaceholder,
            ]}
          >
            {bankName || "은행을 선택하세요"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>계좌번호</Text>
        <TextInput
          style={styles.input}
          placeholder="계좌번호를 입력하세요"
          value={accountNumber}
          onChangeText={onAccountNumberChange}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>예금주</Text>
        <TextInput
          style={[styles.input, styles.inputDisabled]}
          value={accountHolder}
          editable={false}
        />
        <Text style={styles.helpText}>예금주는 변경할 수 없습니다</Text>
      </View>
    </View>
  );
}
