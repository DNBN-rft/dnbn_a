import { apiGet, apiPost, apiPut } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./editmyinfo.styles";

interface CustInfoEditData {
  id: string;
  custTelNo: string;
  custGender: string;
}

export default function EditMyInfoScreen() {
  const insets = useSafeAreaInsets();
  const [accountId, setAccountId] = useState("cust");
  const [phoneNumber, setPhoneNumber] = useState("02-123-4567");
  const [gender, setGender] = useState("M");
  const [loading, setLoading] = useState(true);

  // 비밀번호 변경 모달
  const [passwordModalStep, setPasswordModalStep] = useState<
    "none" | "verify" | "change" | "result"
  >("none");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(true);
  const [passwordError, setPasswordError] = useState("");

  // 회원탈퇴 비밀번호 확인 모달
  const [withdrawPasswordModalVisible, setWithdrawPasswordModalVisible] =
    useState(false);
  const [withdrawPassword, setWithdrawPassword] = useState("");

  // 전화번호 포맷팅 함수
  const formatPhoneNumber = (text: string) => {
    const numbers = text.replace(/[^0-9]/g, "");
    const limitedNumbers = numbers.slice(0, 11);

    if (limitedNumbers.length <= 3) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 7) {
      return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3)}`;
    } else {
      return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3, 7)}-${limitedNumbers.slice(7)}`;
    }
  };

  const handleVerifyPassword = async () => {
    setPasswordError("");

    if (currentPassword === "") {
      setPasswordError("현재 비밀번호를 입력하세요.");
      return;
    }

    try {
      let custCode = null;

      if (Platform.OS === "web") {
        custCode = localStorage.getItem("custCode");
      } else {
        custCode = await SecureStore.getItemAsync("custCode");
      }

      if (!custCode) {
        setPasswordError("고객 정보를 찾을 수 없습니다.");
        return;
      }

      const response = await apiPost("/cust/password/check", {
        custCode,
        custCurrentPassword: currentPassword,
      });

      if (response.ok) {
        setPasswordError("");
        setPasswordModalStep("change");
      } else {
        setPasswordError("현재 비밀번호와 틀린 비밀번호 입니다.");
      }
    } catch (error) {
      console.error("비밀번호 확인 에러:", error);
      setPasswordError("비밀번호 확인 중 오류가 발생했습니다.");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword === "" || confirmPassword === "") {
      if (Platform.OS === "web") {
        alert("새 비밀번호를 입력하세요.");
      } else {
        Alert.alert("입력 오류", "새 비밀번호를 입력하세요.");
      }
      return;
    }
    if (newPassword !== confirmPassword) {
      if (Platform.OS === "web") {
        alert("새 비밀번호가 일치하지 않습니다.");
      } else {
        Alert.alert("입력 오류", "새 비밀번호가 일치하지 않습니다.");
      }
      return;
    }

    try {
      let custCode = null;

      if (Platform.OS === "web") {
        custCode = localStorage.getItem("custCode");
      } else {
        custCode = await SecureStore.getItemAsync("custCode");
      }

      if (!custCode) {
        if (Platform.OS === "web") {
          alert("고객 정보를 찾을 수 없습니다.");
        } else {
          Alert.alert("오류", "고객 정보를 찾을 수 없습니다.");
        }
        return;
      }

      const response = await apiPut("/cust/password/new", {
        custCode,
        custNewPassword: newPassword,
        custNewPasswordConfirm: confirmPassword,
      });

      if (response.ok) {
        setPasswordChangeSuccess(true);
      } else {
        setPasswordChangeSuccess(false);
      }
      setPasswordModalStep("result");
    } catch (error) {
      console.error("비밀번호 변경 에러:", error);
      setPasswordChangeSuccess(false);
      setPasswordModalStep("result");
    }
  };

  const closePasswordModal = () => {
    setPasswordModalStep("none");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordChangeSuccess(false);
    setPasswordError("");
  };

  const handleWithdrawClick = () => {
    setWithdrawPasswordModalVisible(true);
  };

  const handleWithdrawPasswordSubmit = async () => {
    if (!withdrawPassword.trim()) {
      if (Platform.OS === "web") {
        alert("비밀번호를 입력해주세요.");
      } else {
        Alert.alert("입력 오류", "비밀번호를 입력해주세요.");
      }
      return;
    }

    try {
      let custCode = null;

      if (Platform.OS === "web") {
        custCode = localStorage.getItem("custCode");
      } else {
        custCode = await SecureStore.getItemAsync("custCode");
      }

      if (!custCode) {
        if (Platform.OS === "web") {
          alert("고객 정보를 찾을 수 없습니다.");
        } else {
          Alert.alert("오류", "고객 정보를 찾을 수 없습니다.");
        }
        return;
      }

      const response = await apiPost("/cust/password/check", {
        custCode,
        custCurrentPassword: withdrawPassword,
      });

      if (response.ok) {
        setWithdrawPasswordModalVisible(false);
        setWithdrawPassword("");
        router.push("/(cust)/Withdraw");
      } else {
        if (Platform.OS === "web") {
          alert("비밀번호가 일치하지 않습니다.");
        } else {
          Alert.alert("오류", "비밀번호가 일치하지 않습니다.");
        }
      }
    } catch (error) {
      console.error("비밀번호 확인 에러:", error);
      if (Platform.OS === "web") {
        alert("비밀번호 확인 중 오류가 발생했습니다.");
      } else {
        Alert.alert("오류", "비밀번호 확인 중 오류가 발생했습니다.");
      }
    }
  };

  const handleUpdate = async () => {
    // 전화번호 검증
    const phoneNumberOnly = phoneNumber.replace(/-/g, "");
    if (phoneNumberOnly.length !== 11) {
      if (Platform.OS === "web") {
        alert("전화번호는 11자리여야 합니다.");
      } else {
        Alert.alert("입력 오류", "전화번호는 11자리여야 합니다.");
      }
      return;
    }

    try {
      let custCode = null;

      if (Platform.OS === "web") {
        custCode = localStorage.getItem("custCode");
      } else {
        custCode = await SecureStore.getItemAsync("custCode");
      }

      if (!custCode) {
        if (Platform.OS === "web") {
          alert("고객 정보를 찾을 수 없습니다.");
        } else {
          Alert.alert("오류", "고객 정보를 찾을 수 없습니다.");
        }
        return;
      }

      const response = await apiPut("/cust/personal-data/edit", {
        custCode,
        custTelNo: phoneNumber.replace(/-/g, ""),
        custGender: gender,
      });

      if (response.ok) {
        const message = await response.text();
        if (Platform.OS === "web") {
          alert(message);
        } else {
          Alert.alert("성공", message);
        }
        router.replace("/(cust)/my-info");
      } else {
        const errorMessage = await response.text();
        if (Platform.OS === "web") {
          alert(errorMessage || "개인정보 수정에 실패했습니다.");
        } else {
          Alert.alert("오류", errorMessage || "개인정보 수정에 실패했습니다.");
        }
      }
    } catch (error) {
      console.error("개인정보 수정 에러:", error);
      if (Platform.OS === "web") {
        alert("개인정보 수정 중 오류가 발생했습니다.");
      } else {
        Alert.alert("오류", "개인정보 수정 중 오류가 발생했습니다.");
      }
    }
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      let custCode = null;

      if (Platform.OS === "web") {
        custCode = localStorage.getItem("custCode");
      } else {
        custCode = await SecureStore.getItemAsync("custCode");
      }

      if (custCode) {
        const response = await apiGet("/cust/info/edit");

        if (response.ok) {
          const data: CustInfoEditData = await response.json();
          setAccountId(data.id || "");
          setPhoneNumber(
            data.custTelNo ? formatPhoneNumber(data.custTelNo) : "",
          );
          setGender(data.custGender || "M");
        } else {
          console.error("고객 정보 조회 실패:", response.status);
        }
      }
    } catch (error) {
      console.error("고객 정보 조회 에러:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

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
        <Text style={styles.title}>내 정보 수정</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 계정 정보 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-circle" size={22} color="#EF7810" />
            <Text style={styles.sectionTitle}>계정 정보</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>계정 아이디</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={accountId}
              editable={false}
            />
            <Text style={styles.helpText}>아이디는 변경할 수 없습니다</Text>
          </View>

          <TouchableOpacity
            style={styles.passwordChangeButton}
            onPress={() => setPasswordModalStep("verify")}
          >
            <Ionicons name="lock-closed" size={18} color="#EF7810" />
            <Text style={styles.passwordChangeButtonText}>비밀번호 변경</Text>
          </TouchableOpacity>
        </View>

        {/* 사용자 정보수정 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={22} color="#EF7810" />
            <Text style={styles.sectionTitle}>개인 정보</Text>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>전화번호</Text>
            <TextInput
              style={styles.input}
              placeholder="전화번호를 입력하세요"
              value={phoneNumber}
              onChangeText={(text) => setPhoneNumber(formatPhoneNumber(text))}
              keyboardType="phone-pad"
              maxLength={13}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>성별</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={styles.genderButton}
                onPress={() => setGender("M")}
              >
                <View
                  style={[
                    styles.genderRadioButton,
                    gender === "M" && styles.genderRadioButtonActive,
                  ]}
                >
                  {gender === "M" && (
                    <View style={styles.genderRadioButtonInner} />
                  )}
                </View>
                <Text style={styles.genderButtonText}>남성</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.genderButton}
                onPress={() => setGender("F")}
              >
                <View
                  style={[
                    styles.genderRadioButton,
                    gender === "F" && styles.genderRadioButtonActive,
                  ]}
                >
                  {gender === "F" && (
                    <View style={styles.genderRadioButtonInner} />
                  )}
                </View>
                <Text style={styles.genderButtonText}>여성</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
            <Text style={styles.submitButtonText}>수정 완료</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.backBtnText}>이전</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.withdrawButton}
          onPress={handleWithdrawClick}
        >
          <Text style={styles.withdrawText}>회원 탈퇴</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 비밀번호 변경 모달 */}
      <Modal
        visible={passwordModalStep !== "none"}
        transparent={true}
        animationType="fade"
        onRequestClose={closePasswordModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {passwordModalStep === "verify" && (
              <>
                <View style={styles.modalHeader}>
                  <Ionicons name="lock-closed" size={28} color="#EF7810" />
                  <Text style={styles.modalTitle}>비밀번호 확인</Text>
                </View>

                <Text style={styles.modalDescription}>
                  비밀번호 변경을 위해 현재 비밀번호를 입력해주세요
                </Text>

                <View style={styles.modalInputGroup}>
                  <Text style={styles.modalLabel}>현재 비밀번호</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="현재 비밀번호를 입력하세요"
                    value={currentPassword}
                    onChangeText={(text) => {
                      setCurrentPassword(text);
                      setPasswordError("");
                    }}
                    secureTextEntry
                    autoFocus
                  />
                  {passwordError ? (
                    <Text style={{ color: "red", fontSize: 14 }}>
                      {passwordError}
                    </Text>
                  ) : null}
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
                    onPress={closePasswordModal}
                  >
                    <Text style={styles.modalCancelButtonText}>취소</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {passwordModalStep === "change" && (
              <>
                <View style={styles.modalHeader}>
                  <Ionicons name="key" size={28} color="#EF7810" />
                  <Text style={styles.modalTitle}>새 비밀번호 설정</Text>
                </View>

                <Text style={styles.modalDescription}>
                  새로운 비밀번호를 입력해주세요
                </Text>

                <View style={styles.modalInputGroup}>
                  <Text style={styles.modalLabel}>새 비밀번호</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="새 비밀번호를 입력하세요"
                    value={newPassword}
                    onChangeText={setNewPassword}
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
                    onChangeText={setConfirmPassword}
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
                    onPress={closePasswordModal}
                  >
                    <Text style={styles.modalCancelButtonText}>취소</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {passwordModalStep === "result" && (
              <>
                <View style={styles.modalHeader}>
                  <Ionicons
                    name={
                      passwordChangeSuccess
                        ? "checkmark-circle"
                        : "close-circle"
                    }
                    size={48}
                    color={passwordChangeSuccess ? "#ef7810" : "#ef4444"}
                  />
                </View>

                <Text style={styles.modalResultTitle}>
                  {passwordChangeSuccess
                    ? "비밀번호 변경 완료"
                    : "비밀번호 변경 실패"}
                </Text>

                <Text style={styles.modalDescription}>
                  {passwordChangeSuccess
                    ? "비밀번호가 성공적으로 변경되었습니다."
                    : "비밀번호 변경 중 오류가 발생했습니다. 다시 시도해주세요."}
                </Text>

                <TouchableOpacity
                  style={styles.modalSingleButton}
                  onPress={closePasswordModal}
                >
                  <Text style={styles.modalSingleButtonText}>확인</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* 회원탈퇴 비밀번호 확인 모달 */}
      <Modal
        visible={withdrawPasswordModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setWithdrawPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.passwordModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>비밀번호 확인</Text>
            </View>

            <View style={styles.modalContent}>
              <Text style={styles.modalDescription}>
                회원 탈퇴를 위해 비밀번호를 입력해주세요.
              </Text>
              <TextInput
                style={styles.passwordInput}
                placeholder="비밀번호"
                placeholderTextColor="#ccc"
                value={withdrawPassword}
                onChangeText={setWithdrawPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalSubmitButton}
                onPress={handleWithdrawPasswordSubmit}
              >
                <Text style={styles.modalSubmitButtonText}>확인</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setWithdrawPasswordModalVisible(false);
                  setWithdrawPassword("");
                }}
              >
                <Text style={styles.modalCancelButtonText}>취소</Text>
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
