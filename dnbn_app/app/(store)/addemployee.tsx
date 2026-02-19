import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { apiPost } from "@/utils/api";
import { getStorageItem } from "@/utils/storageUtil";
import { styles } from "./editemployee.styles";

const AVAILABLE_PERMISSIONS = [
  { code: 'STORE_ALARM', displayName: '알림' },
  { code: 'STORE_CS', displayName: '고객센터' },
  { code: 'STORE_MEMBER', displayName: '직원 관리' },
  { code: 'STORE_ORDER', displayName: '매출 관리' },
  { code: 'STORE_ORDER_STAT', displayName: '매출 통계' },
  { code: 'STORE_PRODUCT', displayName: '상품 관리' },
  { code: 'STORE_REVIEW', displayName: '리뷰 관리' },
  { code: 'STORE_LOG', displayName: '이력' },
  { code: 'STORE_MYPAGE', displayName: '마이페이지' },
];

export default function AddEmployeePage() {
  const insets = useSafeAreaInsets();

  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const togglePermission = (code: string) => {
    setSelectedPermissions(prev => {
      if (prev.includes(code)) {
        return prev.filter(p => p !== code);
      } else {
        return [...prev, code];
      }
    });
  };

  const handleAdd = async () => {
    if (!employeeId || !employeeName || !phoneNumber || !password || !passwordConfirm || !email) {
      Alert.alert('오류', '모든 필드를 입력해주세요.');
      return;
    }

    if (password !== passwordConfirm) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    if (selectedPermissions.length === 0) {
      Alert.alert('오류', '최소 하나의 권한을 선택해주세요.');
      return;
    }

    try {
      setLoading(true);
      const storeCode = await getStorageItem("storeCode");
      if (!storeCode) {
        Alert.alert("오류", "매장 정보를 찾을 수 없습니다.");
        return;
      }

      const response = await apiPost('/store/app/member/register', {
        memberId: employeeId,
        memberPw: password,
        memberNm: employeeName,
        memberTelNo: phoneNumber,
        menuAuth: selectedPermissions,
        storeCode: storeCode,
        memberEmail: email,
        approved: true,
        memberType: '매니저',
        marketAgreed: false,
      });

      if (response.ok) {
        const message = await response.text();
        Alert.alert('성공', message);
        router.back();
      } else {
        const errorText = await response.text();
        Alert.alert('오류', errorText || '직원 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('직원 등록 실패:', error);
      Alert.alert('오류', '직원 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
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

      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
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

          <View style={styles.formGroup}>
            <Text style={styles.label}>이메일</Text>
            <TextInput
              style={styles.input}
              placeholder="이메일을 입력하세요"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
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
            <Text style={styles.label}>메뉴 접근 권한</Text>
            <View style={styles.permissionContainer}>
              {AVAILABLE_PERMISSIONS.filter(p => p.code !== 'STORE_MEMBER').map((permission) => (
                <TouchableOpacity
                  key={permission.code}
                  style={[
                    styles.permissionItem,
                    selectedPermissions.includes(permission.code) && styles.permissionItemActive
                  ]}
                  onPress={() => togglePermission(permission.code)}
                >
                  <Ionicons 
                    name={selectedPermissions.includes(permission.code) ? "checkbox" : "square-outline"} 
                    size={24} 
                    color={selectedPermissions.includes(permission.code) ? "#EF7810" : "#999"}
                    style={styles.permissionIcon}
                  />
                  <Text style={[
                    styles.permissionText,
                    selectedPermissions.includes(permission.code) && styles.permissionTextActive
                  ]}>
                    {permission.displayName}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.helpText}>
              선택한 권한에 해당하는 메뉴에만 접근할 수 있습니다
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

          <View style={styles.formGroup}>
            <Text style={styles.label}>비밀번호 확인</Text>
            <TextInput
              style={styles.input}
              placeholder="비밀번호를 다시 입력하세요"
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
          onPress={handleAdd}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>등록 완료</Text>
          )}
        </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
