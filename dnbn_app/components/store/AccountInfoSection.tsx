import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { styles } from "@/app/(store)/editstoreinfo.styles";

interface AccountInfoSectionProps {
  memberId: string | null;
  onPasswordChange: () => void;
}

export default function AccountInfoSection({
  memberId,
  onPasswordChange,
}: AccountInfoSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="person-circle" size={22} color="#EF7810" />
        <Text style={styles.sectionTitle}>계정 정보</Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>계정 아이디</Text>
        <TextInput
          style={[styles.input, styles.inputDisabled]}
          value={memberId || ""}
          editable={false}
        />
        <Text style={styles.helpText}>아이디는 변경할 수 없습니다</Text>
      </View>

      <TouchableOpacity
        style={styles.passwordChangeButton}
        onPress={onPasswordChange}
      >
        <Ionicons name="lock-closed" size={18} color="#EF7810" />
        <Text style={styles.passwordChangeButtonText}>비밀번호 변경</Text>
      </TouchableOpacity>
    </View>
  );
}
