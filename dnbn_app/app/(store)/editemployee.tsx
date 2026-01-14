import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./editemployee.styles";

export default function EditEmployeePage() {
  const insets = useSafeAreaInsets();

  // 직원 정보 (실제로는 params로 받아온 데이터를 기반으로 로드)
  const [employeeId, setEmployeeId] = useState('emp001');
  const [employeeName, setEmployeeName] = useState('홍길동');
  const [phoneNumber, setPhoneNumber] = useState('010-1234-5678');
  const [role, setRole] = useState<'매니저' | '일반'>('매니저');
  const [newPassword, setNewPassword] = useState('');

  const handleUpdate = () => {
    console.log({
      employeeId,
      employeeName,
      phoneNumber,
      role,
      ...(newPassword && { password: newPassword })
    });
    router.back();
  };

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#fff" }} />
      )}
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>직원 정보 수정</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 기본 정보 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-circle" size={22} color="#EF7810" />
            <Text style={styles.sectionTitle}>기본 정보</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>직원 아이디</Text>
            <TextInput
              style={styles.input}
              placeholder="직원 아이디를 입력하세요"
              value={employeeId}
              onChangeText={setEmployeeId}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>이름</Text>
            <TextInput
              style={styles.input}
              placeholder="이름을 입력하세요"
              value={employeeName}
              onChangeText={setEmployeeName}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>전화번호</Text>
            <TextInput
              style={styles.input}
              placeholder="전화번호를 입력하세요"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* 권한 설정 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-checkmark" size={22} color="#EF7810" />
            <Text style={styles.sectionTitle}>권한 설정</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>권한</Text>
            <View style={styles.toggleGroup}>
              <TouchableOpacity
                style={[styles.toggleButton, role === '매니저' && styles.toggleButtonActive]}
                onPress={() => setRole('매니저')}
              >
                <Text style={[styles.toggleText, role === '매니저' && styles.toggleTextActive]}>매니저</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, role === '일반' && styles.toggleButtonActive]}
                onPress={() => setRole('일반')}
              >
                <Text style={[styles.toggleText, role === '일반' && styles.toggleTextActive]}>일반</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.helpText}>
              매니저는 모든 기능에 접근할 수 있습니다
            </Text>
          </View>
        </View>

        {/* 비밀번호 변경 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="key" size={22} color="#EF7810" />
            <Text style={styles.sectionTitle}>비밀번호 변경</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>새 비밀번호</Text>
            <TextInput
              style={styles.input}
              placeholder="새 비밀번호를 입력하세요"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            <Text style={styles.helpText}>
              비밀번호를 변경하지 않으려면 비워두세요
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
          <Text style={styles.submitButtonText}>수정 완료</Text>
        </TouchableOpacity>
      </ScrollView>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
