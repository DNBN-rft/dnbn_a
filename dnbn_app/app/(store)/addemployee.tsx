import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./editemployee.styles";

export default function AddEmployeePage() {
  const insets = useSafeAreaInsets();

  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState<'매니저' | '일반'>('일반');
  const [password, setPassword] = useState('');

  const handleAdd = () => {
    if (!employeeId || !employeeName || !phoneNumber || !password) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    console.log({
      employeeId,
      employeeName,
      phoneNumber,
      role,
      password
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
        <Text style={styles.title}>직원 등록</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 기본 정보 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-add" size={22} color="#EF7810" />
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

        {/* 비밀번호 설정 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="key" size={22} color="#EF7810" />
            <Text style={styles.sectionTitle}>비밀번호 설정</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>비밀번호</Text>
            <TextInput
              style={styles.input}
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleAdd}>
          <Text style={styles.submitButtonText}>등록 완료</Text>
        </TouchableOpacity>
      </ScrollView>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
