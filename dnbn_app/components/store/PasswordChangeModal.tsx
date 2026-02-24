import { styles } from "@/app/(store)/editstoreinfo.styles";
import { apiPost, apiPut } from "@/utils/api";
import { validatePassword } from "@/utils/signupUtil";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

type PasswordModalStep = "none" | "verify" | "change" | "result";

interface PasswordChangeModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function PasswordChangeModal({
  visible,
  onClose,
}: PasswordChangeModalProps) {
  const [modalStep, setModalStep] = useState<PasswordModalStep>("verify");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changeSuccess, setChangeSuccess] = useState(true);

  const handleVerifyPassword = async () => {
    if (currentPassword === "") {
      alert("현재 비밀번호를 입력하세요.");
      return;
    }

    try {
      const response = await apiPost("/store/app/password", {
        password: currentPassword,
      });

      if (response.ok) {
        setModalStep("change");
      } else {
        alert("비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error("비밀번호 확인 오류:", error);
      alert("비밀번호 확인 중 서버 오류가 발생했습니다.");
    }
  };

  const handleChangePassword = async () => {
    // 회원가입과 동일한 비밀번호 validation 적용
    if (!validatePassword(newPassword, confirmPassword)) {
      return;
    }

    try {
      const response = await apiPut("/store/app/password-change", {
        password: newPassword,
      });

      if (response.ok) {
        setChangeSuccess(true);
        setModalStep("result");
      } else {
        alert("비밀번호 변경에 실패했습니다.");
        setChangeSuccess(false);
        setModalStep("result");
      }
    } catch (error) {
      console.error("비밀번호 변경 오류:", error);
      alert("서버 오류가 발생했습니다. 관리자에게 문의해주세요.");
      setChangeSuccess(false);
      setModalStep("result");
    }
  };

  const handleClose = () => {
    setModalStep("verify");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setChangeSuccess(false);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {modalStep === "verify" && (
            <>
              <View style={styles.modalHeader}>
                <Ionicons name="lock-closed" size={28} color="#EF7810" />
                <Text style={styles.modalTitle}>비밀번호 확인</Text>
              </View>

              <Text style={styles.modalDescription}>
                본인 확인을 위해 현재 비밀번호를 입력해주세요.
              </Text>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>현재 비밀번호</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="현재 비밀번호를 입력하세요"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                  autoFocus
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalConfirmButton}
                  onPress={handleVerifyPassword}
                >
                  <Text style={styles.modalConfirmButtonText}>확인</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={handleClose}
                >
                  <Text style={styles.modalCancelButtonText}>취소</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {modalStep === "change" && (
            <>
              <View style={styles.modalHeader}>
                <Ionicons name="key" size={28} color="#EF7810" />
                <Text style={styles.modalTitle}>새 비밀번호 설정</Text>
              </View>

              <Text style={styles.modalDescription}>
                8~16자 영문, 숫자, 특수문자를 사용하세요
              </Text>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>새 비밀번호</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="새 비밀번호를 입력하세요"
                  value={newPassword}
                  onChangeText={(text) =>
                    setNewPassword(text.replace(/\s/g, ""))
                  }
                  secureTextEntry
                  autoFocus
                />
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>새 비밀번호 확인</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="새 비밀번호를 다시 입력하세요"
                  value={confirmPassword}
                  onChangeText={(text) =>
                    setConfirmPassword(text.replace(/\s/g, ""))
                  }
                  secureTextEntry
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalConfirmButton}
                  onPress={handleChangePassword}
                >
                  <Text style={styles.modalConfirmButtonText}>변경</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={handleClose}
                >
                  <Text style={styles.modalCancelButtonText}>취소</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {modalStep === "result" && (
            <>
              <View style={styles.modalHeader}>
                <Ionicons
                  name={changeSuccess ? "checkmark-circle" : "close-circle"}
                  size={48}
                  color={changeSuccess ? "#ef7810" : "#ef4444"}
                />
              </View>

              <Text style={styles.modalResultTitle}>
                {changeSuccess ? "비밀번호 변경 완료" : "비밀번호 변경 실패"}
              </Text>

              <Text style={styles.modalDescription}>
                {changeSuccess
                  ? "비밀번호가 성공적으로 변경되었습니다."
                  : "비밀번호 변경 중 오류가 발생했습니다. 다시 시도해주세요."}
              </Text>

              <TouchableOpacity
                style={styles.modalSingleButton}
                onPress={handleClose}
              >
                <Text style={styles.modalSingleButtonText}>확인</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
