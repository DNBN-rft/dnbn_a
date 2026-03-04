import { styles } from "@/app/(store)/editstoreinfo.styles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, View } from "react-native";

interface BusinessInfoSectionProps {
  businessName: string;
  businessNumber: string;
  representativeName: string;
  representativePhone: string;
  businessType: string;
  bizRegDateTime: string;
}

export default function BusinessInfoSection({
  businessName,
  businessNumber,
  representativeName,
  representativePhone,
  businessType,
  bizRegDateTime,
}: BusinessInfoSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="document-text" size={22} color="#999" />
        <Text style={[styles.sectionTitle, styles.disabledTitle]}>
          사업자 정보
        </Text>
      </View>
      <Text style={styles.sectionDescription}>
        사업자 정보는 변경할 수 없습니다
      </Text>

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
          style={[styles.input, styles.inputDisabled]}
          value={representativePhone}
          editable={false}
        />
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
