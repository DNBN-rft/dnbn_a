import { styles } from "@/app/(store)/editstoreinfo.styles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, View } from "react-native";

interface BusinessInfoSectionProps {
  businessName: string;
  businessNumber: string;
  representativeName: string;
  representativePhone: string;
  onRepresentativePhoneChange: (value: string) => void;
  representativePhoneError?: string;
  businessType: string;
  bizRegDateTime: string;
}

export default function BusinessInfoSection({
  businessName,
  businessNumber,
  representativeName,
  representativePhone,
  onRepresentativePhoneChange,
  representativePhoneError,
  businessType,
  bizRegDateTime,
}: BusinessInfoSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="document-text" size={22} color="#EF7810" />
        <Text style={styles.sectionTitle}>
          사업자 정보
        </Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>사업자명</Text>
        <TextInput
          style={[styles.input, styles.inputDisabled]}
          value={businessName}
          editable={false}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>사업자등록번호</Text>
        <TextInput
          style={[styles.input, styles.inputDisabled]}
          value={businessNumber}
          editable={false}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>대표자명</Text>
        <TextInput
          style={[styles.input, styles.inputDisabled]}
          value={representativeName}
          editable={false}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>대표 연락처</Text>
        <TextInput
          style={[
            styles.input,
            representativePhoneError ? styles.inputErrorBorder : undefined,
          ]}
          value={representativePhone}
          onChangeText={onRepresentativePhoneChange}
          keyboardType="phone-pad"
          placeholder="대표 연락처를 입력해주세요"
          placeholderTextColor="#ccc"
        />
        {representativePhoneError && (
          <Text style={styles.inputError}>{representativePhoneError}</Text>
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>업태</Text>
        <TextInput
          style={[styles.input, styles.inputDisabled]}
          value={businessType}
          editable={false}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>사업자 등록일</Text>
        <TextInput
          style={[styles.input, styles.inputDisabled]}
          value={bizRegDateTime}
          editable={false}
        />
      </View>
    </View>
  );
}
