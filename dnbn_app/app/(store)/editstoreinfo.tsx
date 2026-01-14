import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./editstoreinfo.styles";

export default function EditStoreInfoPage() {
  const insets = useSafeAreaInsets();

  // 수정 가능한 정보
  const [storeName, setStoreName] = useState("던킨도너츠 서울역점");
  const [phoneNumber, setPhoneNumber] = useState("02-123-4567");
  const [address, setAddress] = useState("서울특별시 중구 세종대로 110");
  const [bankName, setBankName] = useState("국민은행");
  const [accountNumber, setAccountNumber] = useState("123-456-78901234");
  const [businessHours, setBusinessHours] = useState("09:00 ~ 21:00");
  const [businessDays, setBusinessDays] = useState("월요일 ~ 일요일");

  // 계정 정보
  const [accountId, setAccountId] = useState("store_user");

  // 비밀번호 변경 모달
  const [passwordModalStep, setPasswordModalStep] = useState<
    "none" | "verify" | "change" | "result"
  >("none");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(true);

  const accountHolder = "홍길동";
  const businessName = "던킨도너츠 서울역점";
  const businessNumber = "123-45-67890";
  const representativeName = "홍길동";
  const representativePhone = "02-123-4567";
  const businessType = "도소매업";
  const registrationDate = "2020-01-15";

  const handleVerifyPassword = () => {
    // TODO: 실제 API로 현재 비밀번호 검증
    if (currentPassword === "") {
      alert("현재 비밀밀번호를 입력하세요.");
      return;
    }
    // 검증 성공 가정
    setPasswordModalStep("change");
  };

  const handleChangePassword = () => {
    if (newPassword === "" || confirmPassword === "") {
      alert("새 비밀번호를 입력하세요.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("새 비밀밀번호가 일치하지 않습니다.");
      return;
    }

    // TODO: 실제 API로 비밀번호 변경
    console.log("비밀번호 변경:", { currentPassword, newPassword });

    // 변경 성공 가정
    setPasswordChangeSuccess(true);
    setPasswordModalStep("result");
  };

  const closePasswordModal = () => {
    setPasswordModalStep("none");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordChangeSuccess(false);
  };

  const handleUpdate = () => {
    console.log({
      storeName,
      phoneNumber,
      address,
      bankName,
      accountNumber,
      businessHours,
      businessDays,
    });

    // 업데이트 로직 처리 후
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
        <Text style={styles.title}>가맹점 정보 수정</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="storefront" size={22} color="#EF7810" />
            <Text style={styles.sectionTitle}>가맹점 정보</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>가맹점명</Text>
            <TextInput
              style={styles.input}
              placeholder="가맹점명을 입력하세요"
              value={storeName}
              onChangeText={setStoreName}
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
            <Text style={styles.label}>주소</Text>
            <TextInput
              style={styles.input}
              placeholder="주소를 입력하세요"
              value={address}
              onChangeText={setAddress}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="card" size={22} color="#EF7810" />
            <Text style={styles.sectionTitle}>계좌 정보</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>은행명</Text>
            <TextInput
              style={styles.input}
              placeholder="은행명을 입력하세요"
              value={bankName}
              onChangeText={setBankName}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>계좌번호</Text>
            <TextInput
              style={styles.input}
              placeholder="계좌번호를 입력하세요"
              value={accountNumber}
              onChangeText={setAccountNumber}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>예금주</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={accountHolder}
              editable={false}
            />
            <Text style={styles.helpText}>예금주는 변경할 수 없습니다</Text>
          </View>
        </View>

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
              value={registrationDate}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time" size={22} color="#EF7810" />
            <Text style={styles.sectionTitle}>운영 정보</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>영업 시간</Text>
            <TextInput
              style={styles.input}
              placeholder="영업 시간을 입력하세요 (예: 09:00 ~ 21:00)"
              value={businessHours}
              onChangeText={setBusinessHours}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>영업일</Text>
            <TextInput
              style={styles.input}
              placeholder="영업일을 입력하세요 (예: 월요일 ~ 일요일)"
              value={businessDays}
              onChangeText={setBusinessDays}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
          <Text style={styles.submitButtonText}>수정 완료</Text>
        </TouchableOpacity>
      </ScrollView>

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

      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
