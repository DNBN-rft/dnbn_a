import { apiGet, apiPut } from "@/utils/api";
import { getStorageItem } from "@/utils/storageUtil";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./editemployee.styles";

const AVAILABLE_PERMISSIONS = [
  { code: "STORE_ALARM", displayName: "알림" },
  { code: "STORE_CS", displayName: "고객센터" },
  { code: "STORE_MEMBER", displayName: "직원 관리" },
  { code: "STORE_ORDER", displayName: "매출 관리" },
  { code: "STORE_ORDER_STAT", displayName: "매출 통계" },
  { code: "STORE_PRODUCT", displayName: "상품 관리" },
  { code: "STORE_REVIEW", displayName: "리뷰 관리" },
  { code: "STORE_LOG", displayName: "이력" },
  { code: "STORE_MYPAGE", displayName: "마이페이지" },
];

export default function EditEmployeePage() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const employeeIdParam = params.employeeId as string;

  const [employeeId, setEmployeeId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const togglePermission = (code: string) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(code)) {
        return prev.filter((p) => p !== code);
      } else {
        return [...prev, code];
      }
    });
  };

  // 직원 정보 불러오기
  useEffect(() => {
    const loadEmployeeData = async () => {
      try {
        setLoading(true);
        const storeCode = await getStorageItem("storeCode");
        if (!storeCode) {
          Alert.alert("오류", "매장 정보를 찾을 수 없습니다.");
          return;
        }

        const response = await apiGet(`/store/app/member/view/${storeCode}`);
        if (response.ok) {
          const employees = await response.json();
          const employee = employees.find(
            (e: any) => e.memberId === employeeIdParam,
          );
          if (employee) {
            setEmployeeId(employee.memberId);
            setPhoneNumber(employee.memberTelNo);
            setEmail(employee.memberEmail || "");
            // menuAuth가 배열로 오면 code만 추출
            const permissions = employee.menuAuth.map((auth: any) => auth.code);
            setSelectedPermissions(permissions);
          } else {
            Alert.alert("오류", "직원 정보를 찾을 수 없습니다.");
            router.back();
          }
        } else {
          Alert.alert("오류", "직원 정보를 불러오는데 실패했습니다.");
          router.back();
        }
      } catch (error) {
        console.error("직원 정보 조회 실패:", error);
        Alert.alert("오류", "직원 정보를 불러오는데 실패했습니다.");
        router.back();
      } finally {
        setLoading(false);
      }
    };

    if (employeeIdParam) {
      loadEmployeeData();
    }
  }, [employeeIdParam]);

  const handleUpdate = async () => {
    if (!newPassword && !passwordConfirm) {
      Alert.alert("오류", "새 비밀번호를 입력해주세요.");
      return;
    }

    if (newPassword !== passwordConfirm) {
      Alert.alert("오류", "비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!phoneNumber || !email) {
      Alert.alert("오류", "모든 필드를 입력해주세요.");
      return;
    }

    if (selectedPermissions.length === 0) {
      Alert.alert("오류", "최소 하나의 권한을 선택해주세요.");
      return;
    }

    try {
      setSaving(true);
      const response = await apiPut(`/store/app/member/detail/${employeeId}`, {
        memberPw: newPassword,
        memberPwCheck: passwordConfirm,
        memberTelNo: phoneNumber,
        menuAuth: selectedPermissions,
        memberEmail: email,
      });

      if (response.ok) {
        const message = await response.text();
        Alert.alert("성공", message);
        router.back();
      } else {
        Alert.alert("오류", "직원 정보 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("직원 정보 수정 실패:", error);
      Alert.alert("오류", "직원 정보 수정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#fff" }} />
      )}

      <View style={styles.header}>
        <View style={styles.leftSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.centerSection}>
          <Text style={styles.title}>직원 정보 수정</Text>
        </View>
        <View style={styles.rightSection} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -insets.bottom}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#EF7810" />
            </View>
          ) : (
            <>
              {/* 기본 정보 */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="person-circle" size={22} color="#EF7810" />
                  <Text style={styles.sectionTitle}>기본 정보</Text>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>직원 아이디</Text>
                  <TextInput
                    style={[styles.input, styles.inputDisabled]}
                    value={employeeId}
                    editable={false}
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
                    {AVAILABLE_PERMISSIONS.filter(
                      (p) => p.code !== "STORE_MEMBER",
                    ).map((permission) => (
                      <TouchableOpacity
                        key={permission.code}
                        style={[
                          styles.permissionItem,
                          selectedPermissions.includes(permission.code) &&
                            styles.permissionItemActive,
                        ]}
                        onPress={() => togglePermission(permission.code)}
                      >
                        <Ionicons
                          name={
                            selectedPermissions.includes(permission.code)
                              ? "checkbox"
                              : "square-outline"
                          }
                          size={24}
                          color={
                            selectedPermissions.includes(permission.code)
                              ? "#EF7810"
                              : "#999"
                          }
                          style={styles.permissionIcon}
                        />
                        <Text
                          style={[
                            styles.permissionText,
                            selectedPermissions.includes(permission.code) &&
                              styles.permissionTextActive,
                          ]}
                        >
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
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>새 비밀번호 확인</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="새 비밀번호를 다시 입력하세요"
                    value={passwordConfirm}
                    onChangeText={setPasswordConfirm}
                    secureTextEntry
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  saving && styles.submitButtonDisabled,
                ]}
                onPress={handleUpdate}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>수정 완료</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
