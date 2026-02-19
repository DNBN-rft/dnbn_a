import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { apiGet, apiDelete } from "@/utils/api";
import { getStorageItem } from "@/utils/storageUtil";
import { styles } from "./storeemployee.styles";

interface Employee {
  memberIdx: number;
  memberNm: string;
  memberId: string;
  memberTelNo: string;
  menuAuth: Array<{
    code: string;
    displayName: string;
  }>;
  memberEmail: string;
  memberType: string;
}

export default function StoreEmployeeManageScreen() {
  const insets = useSafeAreaInsets();
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const MAX_EMPLOYEES = 3;
  const remainingSlots = MAX_EMPLOYEES - employees.length;
  const canAddEmployee = employees.length < MAX_EMPLOYEES;

  // 직원 목록 불러오기
  const loadEmployees = async () => {
    try {
      setLoading(true);
      const storeCode = await getStorageItem("storeCode");
      if (!storeCode) {
        Alert.alert("오류", "매장 정보를 찾을 수 없습니다.");
        return;
      }

      const response = await apiGet(`/store/app/member/view/${storeCode}`);
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      } else {
        const errorText = await response.text();
        Alert.alert("오류", errorText || "직원 목록을 불러오는데 실패했습니다.");
      }
    } catch (error) {
      console.error("직원 목록 조회 실패:", error);
      Alert.alert("오류", "직원 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 화면 포커스 될 때마다 목록 새로고침
  useFocusEffect(
    useCallback(() => {
      loadEmployees();
    }, [])
  );

  const handleDelete = async () => {
    if (!selectedEmployee) return;

    try {
      const response = await apiDelete(`/store/app/member/${selectedEmployee}`);
      if (response.ok) {
        Alert.alert("성공", "직원이 삭제되었습니다.");
        loadEmployees(); // 목록 새로고침
      } else {
        const errorText = await response.text();
        Alert.alert("오류", errorText || "직원 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("직원 삭제 실패:", error);
      Alert.alert("오류", "직원 삭제에 실패했습니다.");
    } finally {
      setDeleteModal(false);
      setSelectedEmployee(null);
    }
  };

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={[styles.safeAreaTop, { height: insets.top }]} />
      )}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>직원 관리</Text>
        <View style={styles.placeholder}></View>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#EF7810" />
            </View>
          ) : (
            <>
              {/* 등록 현황 */}
              <View style={styles.statusCard}>
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>등록된 직원</Text>
                  <Text style={styles.statusValue}>{employees.length} / {MAX_EMPLOYEES}명</Text>
                </View>
                {remainingSlots > 0 && (
                  <Text style={styles.statusHelpText}>
                    {remainingSlots}명 더 등록 가능합니다
                  </Text>
                )}
              </View>

              {/* 직원 카드 리스트 */}
              {employees.map((emp) => (
                <View key={emp.memberIdx} style={styles.employeeCard}>
                  <View style={styles.employeeHeader}>
                    <View style={styles.employeeMainInfo}>
                      <Text style={styles.employeeName}>{emp.memberNm}</Text>
                      <View style={styles.roleBadge}>
                        <Text style={styles.roleText}>{emp.memberType}</Text>
                      </View>
                    </View>
                    {emp.memberType !== '점주' && (
                      <View style={styles.employeeActions}>
                        <TouchableOpacity 
                          style={styles.actionButton}
                          onPress={() => router.push({
                            pathname: "/(store)/editemployee",
                            params: { employeeId: emp.memberId }
                          })}
                        >
                          <Ionicons name="create-outline" size={20} color="#EF7810" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.actionButton}
                          onPress={() => {
                            setSelectedEmployee(emp.memberId);
                            setDeleteModal(true);
                          }}
                        >
                          <Ionicons name="trash-outline" size={20} color="#ff3b30" />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>

                  <View style={styles.employeeInfoContainer}>
                    <View style={styles.infoRow}>
                      <Ionicons name="person-outline" size={16} color="#666" />
                      <Text style={styles.infoLabel}>아이디</Text>
                      <Text style={styles.infoValue}>{emp.memberId}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Ionicons name="call-outline" size={16} color="#666" />
                      <Text style={styles.infoLabel}>연락처</Text>
                      <Text style={styles.infoValue}>{emp.memberTelNo}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Ionicons name="clipboard-outline" size={16} color="#666" />
                      <Text style={styles.infoLabel}>권한</Text>
                      <View style={styles.permissionBadgesContainer}>
                        {emp.menuAuth.map((auth, index) => (
                          <View key={index} style={styles.permissionBadge}>
                            <Text style={styles.permissionBadgeText}>{auth.displayName}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </>
          )}

          {/* 직원 추가 버튼 */}
          <TouchableOpacity 
            style={[
              styles.addButton,
              !canAddEmployee && styles.addButtonDisabled
            ]}
            onPress={() => canAddEmployee && router.push("/(store)/addemployee")}
            disabled={!canAddEmployee}
          >
            <Ionicons 
              name="add-circle-outline" 
              size={24} 
              color={canAddEmployee ? "#EF7810" : "#ccc"} 
            />
            <Text style={[
              styles.addButtonText,
              !canAddEmployee && styles.addButtonTextDisabled
            ]}>
              {canAddEmployee ? '새 직원 등록' : '최대 인원 등록 완료'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 삭제 확인 모달 */}
      <Modal
        visible={deleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModalContent}>
            <Ionicons name="warning-outline" size={48} color="#ff3b30" />
            <Text style={styles.deleteModalTitle}>직원 삭제</Text>
            <Text style={styles.deleteModalMessage}>
              정말로 이 직원을 삭제하시겠습니까?{"\n"}삭제된 정보는 복구할 수 없습니다.
            </Text>
            
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity
                style={[styles.deleteModalButton, styles.confirmButton]}
                onPress={handleDelete}
              >
                <Text style={styles.confirmButtonText}>삭제</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteModalButton, styles.cancelButton]}
                onPress={() => setDeleteModal(false)}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {insets.bottom > 0 && (
        <View style={[styles.safeAreaBottom, { height: insets.bottom }]} />
      )}
    </View>
  );
}