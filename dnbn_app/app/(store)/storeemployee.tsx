import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./storeemployee.styles";

export default function StoreEmployeeManageScreen() {
  const insets = useSafeAreaInsets();
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  // 예시 직원 데이터 (1명 등록되어 있음)
  const [employees, setEmployees] = useState([
    {
      id: "1",
      name: "홍길동",
      empid: "emp001",
      phone: "010-1234-5678",
      role: "매니저",
    },
  ]);

  const MAX_EMPLOYEES = 3;
  const remainingSlots = MAX_EMPLOYEES - employees.length;
  const canAddEmployee = employees.length < MAX_EMPLOYEES;

  const handleDelete = () => {
    setEmployees(employees.filter((emp) => emp.id !== selectedEmployee));
    setDeleteModal(false);
    setSelectedEmployee(null);
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
          <Text style={styles.title}>직원 관리</Text>
        </View>
        <View style={styles.rightSection} />
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          {/* 등록 현황 */}
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>등록된 직원</Text>
              <Text style={styles.statusValue}>
                {employees.length} / {MAX_EMPLOYEES}명
              </Text>
            </View>
            {remainingSlots > 0 && (
              <Text style={styles.statusHelpText}>
                {remainingSlots}명 더 등록 가능합니다
              </Text>
            )}
          </View>

          {/* 직원 카드 리스트 */}
          {employees.map((emp) => (
            <View key={emp.id} style={styles.employeeCard}>
              <View style={styles.employeeHeader}>
                <View style={styles.employeeMainInfo}>
                  <Text style={styles.employeeName}>{emp.name}</Text>
                  <View style={styles.roleBadge}>
                    <Text style={styles.roleText}>{emp.role}</Text>
                  </View>
                </View>
                <View style={styles.employeeActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() =>
                      router.push({
                        pathname: "/(store)/editemployee",
                        params: { employeeId: emp.id },
                      })
                    }
                  >
                    <Ionicons name="create-outline" size={20} color="#EF7810" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                      setSelectedEmployee(emp.id);
                      setDeleteModal(true);
                    }}
                  >
                    <Ionicons name="trash-outline" size={20} color="#ff3b30" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.employeeInfoContainer}>
                <View style={styles.infoRow}>
                  <Ionicons name="person-outline" size={16} color="#666" />
                  <Text style={styles.infoLabel}>아이디</Text>
                  <Text style={styles.infoValue}>{emp.empid}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="call-outline" size={16} color="#666" />
                  <Text style={styles.infoLabel}>연락처</Text>
                  <Text style={styles.infoValue}>{emp.phone}</Text>
                </View>
              </View>
            </View>
          ))}

          {/* 직원 추가 버튼 */}
          <TouchableOpacity
            style={[
              styles.addButton,
              !canAddEmployee && styles.addButtonDisabled,
            ]}
            onPress={() =>
              canAddEmployee && router.push("/(store)/addemployee")
            }
            disabled={!canAddEmployee}
          >
            <Ionicons
              name="add-circle-outline"
              size={24}
              color={canAddEmployee ? "#EF7810" : "#ccc"}
            />
            <Text
              style={[
                styles.addButtonText,
                !canAddEmployee && styles.addButtonTextDisabled,
              ]}
            >
              {canAddEmployee ? "새 직원 등록" : "최대 인원 등록 완료"}
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
              정말로 이 직원을 삭제하시겠습니까?{"\n"}삭제된 정보는 복구할 수
              없습니다.
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
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
