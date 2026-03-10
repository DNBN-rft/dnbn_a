/**
 * 스토어 회원가입 Step 1: 회원 정보 입력 화면
 *
 * 기능:
 * - 아이디 입력 및 중복 체크
 * - 비밀번호 입력 및 확인
 * - 이메일 입력
 * - 실시간 유효성 검사
 */
import { useStoreSignup } from "@/contexts/StoreSignupContext";
import { apiGet } from "@/utils/api";
import {
  restrictLoginId,
  restrictPassword,
} from "@/utils/storeInputRestrictions";
import { buildEmail, resolveEmailDomain } from "@/utils/storeSignupUtil";
import {
  getPasswordCheckMessage,
  validateMemberInfo,
} from "@/utils/storeSignupValidation";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
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
import { styles } from "./store-signup-member-info.styles";

export default function StoreSignupMemberInfoScreen() {
  const insets = useSafeAreaInsets();
  const { formData, updateMemberInfo, setCurrentStep } = useStoreSignup();
  const { memberInfo } = formData;

  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [idCheckStatus, setIdCheckStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [isCheckingId, setIsCheckingId] = useState(false);

  // 이메일 입력 상태
  const initialEmail = memberInfo.email || "";
  const [emailLocal, setEmailLocal] = useState(
    initialEmail.includes("@") ? initialEmail.split("@")[0] : initialEmail,
  );
  const [emailDomain, setEmailDomain] = useState(
    initialEmail.includes("@") ? initialEmail.split("@")[1] : "",
  );
  const [selectedDomain, setSelectedDomain] = useState("직접입력");
  const [showDomainDropdown, setShowDomainDropdown] = useState(false);

  // 에러 메시지
  const [loginIdError, setLoginIdError] = useState("");
  const [emailError, setEmailError] = useState("");

  /**
   * 아이디 입력 핸들러
   */
  const handleLoginIdChange = (text: string) => {
    const restricted = restrictLoginId(text);
    updateMemberInfo({ loginId: restricted });
    setIdCheckStatus("idle");
    setLoginIdError("");
  };

  /**
   * 비밀번호 입력 핸들러
   */
  const handlePasswordChange = (text: string) => {
    const restricted = restrictPassword(text);
    updateMemberInfo({ password: restricted });
  };

  // 이메일 도메인 옵션
  const EMAIL_DOMAINS = [
    { label: "직접입력", value: "직접입력" },
    { label: "네이버", value: "naver.com" },
    { label: "다음", value: "daum.net" },
    { label: "구글", value: "gmail.com" },
    { label: "네이트", value: "nate.com" },
  ];

  const handleEmailLocalChange = (text: string) => {
    const restricted = text.replace(/[\s]/g, "");
    setEmailLocal(restricted);
    updateMemberInfo({
      email: buildEmail(
        restricted,
        resolveEmailDomain(emailDomain, selectedDomain),
      ),
    });
    setEmailError("");
  };

  const handleEmailDomainChange = (text: string) => {
    const restricted = text.replace(/[\s]/g, "");
    setEmailDomain(restricted);
    updateMemberInfo({ email: buildEmail(emailLocal, restricted) });
    setEmailError("");
  };

  const handleSelectDomain = (domain: string) => {
    setSelectedDomain(domain);
    setShowDomainDropdown(false);
    const newDomain = domain !== "직접입력" ? domain : "";
    setEmailDomain(newDomain);
    updateMemberInfo({ email: buildEmail(emailLocal, newDomain) });
    setEmailError("");
  };

  /**
   * 아이디 중복 체크
   */
  const loginIdRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{6,15}$/;

  const handleCheckDuplicateId = async () => {
    if (!memberInfo.loginId || !loginIdRegex.test(memberInfo.loginId)) {
      Alert.alert("알림", "아이디는 6~15자 이내 영문과 숫자를 혼합하여 입력해주세요.");
      return;
    }

    setIsCheckingId(true);
    try {
      const response = await apiGet(
        `/store/check-loginId/${memberInfo.loginId}`,
      );
      const message = await response.text();

      if (response.ok && message.includes("사용가능")) {
        setIdCheckStatus("success");
        setLoginIdError("");
        Alert.alert("성공", message);
      } else {
        setIdCheckStatus("error");
        setLoginIdError("이미 사용 중인 아이디입니다.");
        Alert.alert("알림", message);
      }
    } catch (error) {
      console.error("아이디 중복 체크 에러:", error);
      Alert.alert("오류", "아이디 중복 확인 중 오류가 발생했습니다.");
    } finally {
      setIsCheckingId(false);
    }
  };

  /**
   * 다음 단계로 이동
   */
  const handleNext = () => {
    const validation = validateMemberInfo(
      memberInfo,
      idCheckStatus,
      passwordConfirm,
    );
    if (!validation.isValid) {
      Alert.alert("알림", validation.message);
      return;
    }
    setCurrentStep(2);
    router.push("/store-signup-store-info" as any);
  };

  const passwordCheck = getPasswordCheckMessage(memberInfo.password || "");

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#fff" }} />
      )}
      {/* Header */}
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
          <Text style={styles.title}>회원 정보</Text>
        </View>
        <View style={styles.rightSection} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -insets.bottom}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 아이디 */}
          <View style={styles.inputSection}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>아이디</Text>
              <Text style={styles.required}> *</Text>
            </View>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.inputFlex]}
                placeholder="아이디 입력"
                placeholderTextColor="#ccc"
                value={memberInfo.loginId}
                onChangeText={handleLoginIdChange}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={[
                  styles.checkButton,
                  (isCheckingId || idCheckStatus === "success") &&
                    styles.checkButtonDisabled,
                ]}
                onPress={handleCheckDuplicateId}
                disabled={isCheckingId || idCheckStatus === "success"}
              >
                {isCheckingId ? (
                  <ActivityIndicator size="small" color="#FF6F2B" />
                ) : (
                  <Text style={styles.checkButtonText}>
                    {idCheckStatus === "success" ? "확인완료" : "중복확인"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            {loginIdError ? (
              <Text style={styles.errorText}>{loginIdError}</Text>
            ) : (
              <Text style={styles.helperText}>
                6자 이상의 영문 또는 영문, 숫자 혼합
              </Text>
            )}
          </View>

          {/* 비밀번호 */}
          <View style={styles.inputSection}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>비밀번호</Text>
              <Text style={styles.required}> *</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="비밀번호 입력"
              placeholderTextColor="#ccc"
              value={memberInfo.password}
              onChangeText={handlePasswordChange}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
            {passwordCheck.message ? (
              <Text
                style={[
                  styles.helperText,
                  passwordCheck.status === "error" && styles.errorText,
                  passwordCheck.status === "success" && styles.successText,
                ]}
              >
                {passwordCheck.message}
              </Text>
            ) : (
              <Text style={styles.helperText}>
                8~16자 영문, 숫자, 특수문자를 사용하세요
              </Text>
            )}
          </View>

          {/* 비밀번호 확인 */}
          <View style={styles.inputSection}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>비밀번호 확인</Text>
              <Text style={styles.required}> *</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="비밀번호 확인"
              placeholderTextColor="#ccc"
              value={passwordConfirm}
              onChangeText={(text) =>
                setPasswordConfirm(restrictPassword(text))
              }
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
            {passwordConfirm && memberInfo.password !== passwordConfirm && (
              <Text style={styles.errorText}>
                비밀번호가 일치하지 않습니다.
              </Text>
            )}
            {passwordConfirm && memberInfo.password === passwordConfirm && (
              <Text style={styles.successText}>비밀번호가 일치합니다.</Text>
            )}
          </View>

          {/* 이메일 */}
          <View style={styles.inputSection}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>이메일</Text>
              <Text style={styles.required}> *</Text>
            </View>
            <View style={styles.emailRow}>
              <TextInput
                style={[styles.input, styles.emailLocalInput]}
                placeholder="이메일"
                placeholderTextColor="#ccc"
                value={emailLocal}
                onChangeText={handleEmailLocalChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Text style={styles.atSign}>@</Text>
              {selectedDomain === "직접입력" ? (
                <TextInput
                  style={[styles.input, styles.emailDomainInput]}
                  placeholder="주소"
                  placeholderTextColor="#ccc"
                  value={emailDomain}
                  onChangeText={handleEmailDomainChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              ) : (
                <View
                  style={[
                    styles.input,
                    styles.emailDomainInput,
                    styles.domainDisplay,
                  ]}
                >
                  <Text style={styles.domainDisplayText}>{selectedDomain}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              style={styles.domainSelector}
              onPress={() => setShowDomainDropdown(!showDomainDropdown)}
              activeOpacity={0.7}
            >
              <Text style={styles.domainSelectorText}>
                {selectedDomain === "직접입력" ? "이메일 주소" : selectedDomain}
              </Text>
              <Ionicons
                name={showDomainDropdown ? "chevron-up" : "chevron-down"}
                size={16}
                color="#666"
              />
            </TouchableOpacity>
            {showDomainDropdown && (
              <View style={styles.domainDropdown}>
                {EMAIL_DOMAINS.map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.domainItem,
                      selectedDomain === item.value &&
                        styles.domainItemSelected,
                    ]}
                    onPress={() => handleSelectDomain(item.value)}
                  >
                    <Text
                      style={[
                        styles.domainItemText,
                        selectedDomain === item.value &&
                          styles.domainItemTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : (
              <Text style={styles.helperText}>예: user@example.com</Text>
            )}
          </View>
        </ScrollView>

        {/* 하단 버튼 */}
        <View style={styles.bottomButton}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>다음 1 / 4</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
