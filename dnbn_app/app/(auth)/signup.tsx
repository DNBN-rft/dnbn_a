import { apiPost } from "@/utils/api";
import { permitCheck } from "@/utils/notificationUtil";
import {
  checkDuplicateId,
  handleEmailDomainSelect as handleEmailDomainSelectUtil,
  handleEmailDomainDirectInput,
  handleLoginIdChange as handleLoginIdChangeUtil,
  handlePasswordChange as handlePasswordChangeUtil,
  handlePasswordConfirmChange as handlePasswordConfirmChangeUtil,
  handlePhoneFirstChange as handlePhoneFirstChangeUtil,
  handlePhoneLastChange as handlePhoneLastChangeUtil,
  handlePhoneMiddleChange as handlePhoneMiddleChangeUtil,
  validateEmail,
  validateLoginId,
  validateName,
  validatePassword,
  validatePhoneNumber,
  validateResidentNumber,
} from "@/utils/signupUtil";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RadioGroup } from "react-native-radio-buttons-group";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./signup.styles";

export default function PracticeView() {
  const insets = useSafeAreaInsets();
  const { marketingAgreed } = useLocalSearchParams();
  const [selectedId, setSelectedId] = useState("1");
  const [isMarketingAgreed, setIsMarketingAgreed] = useState(false);

  // 폼 입력 state
  const [emailLocal, setEmailLocal] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [selectedEmailDomain, setSelectedEmailDomain] = useState("direct");
  const [loginId, setLoginId] = useState("");
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [isIdAvailable, setIsIdAvailable] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [custNm, setCustNm] = useState("");
  const [residentNumberFront, setResidentNumberFront] = useState("");
  const [residentNumberBack, setResidentNumberBack] = useState("");
  // const [custNickNm, setCustNickNm] = useState("");
  // const [isNickNmChecked, setIsNickNmChecked] = useState(false);
  // const [isNickNmAvailable, setIsNickNmAvailable] = useState(false);
  const [phoneFirst, setPhoneFirst] = useState("");
  const [phoneMiddle, setPhoneMiddle] = useState("");
  const [phoneLast, setPhoneLast] = useState("");
  const phoneMiddleRef = useRef<TextInput>(null);
  const phoneLastRef = useRef<TextInput>(null);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isSmsSent, setIsSmsSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isSmsLoading, setIsSmsLoading] = useState(false);
  const [isVerifyLoading, setIsVerifyLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [isIdCheckLoading, setIsIdCheckLoading] = useState(false);
  // const [isNickNmCheckLoading, setIsNickNmCheckLoading] = useState(false);
  const [showEmailDomainPicker, setShowEmailDomainPicker] = useState(false);

  // 유효성 검사 에러 메시지 state
  const [loginIdError, setLoginIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");
  const [emailDomainError, setEmailDomainError] = useState("");

  useEffect(() => {
    // 약관 페이지에서 전달받은 마케팅 동의 상태 설정
    if (marketingAgreed === "true") {
      setIsMarketingAgreed(true);
    }
  }, [marketingAgreed]);

  useEffect(() => {
    // 직접입력이 아닌 도메인 선택 시 에러 초기화
    if (selectedEmailDomain !== "direct") {
      setEmailDomainError("");
    }
  }, [selectedEmailDomain]);

  // 아이디 입력 핸들러
  const handleLoginIdChange = (text: string) => {
    handleLoginIdChangeUtil(text, setLoginId, setIsIdChecked, setIsIdAvailable, setLoginIdError);
  };

  // 비밀번호 입력 핸들러
  const handlePasswordChange = (text: string) => {
    handlePasswordChangeUtil(text, passwordConfirm, setPassword, setPasswordError, setPasswordConfirmError);
  };

  // 비밀번호 확인 입력 핸들러
  const handlePasswordConfirmChange = (text: string) => {
    handlePasswordConfirmChangeUtil(text, password, setPasswordConfirm, setPasswordConfirmError);
  };

  // 이메일 도메인 직접입력 핸들러
  const handleEmailDomainDirectInputHandler = (text: string) => {
    handleEmailDomainDirectInput(text, setEmailDomain, setEmailDomainError);
  };

  // 아이디 중복 체크
  const handleCheckDuplicateId = async () => {
    await checkDuplicateId(
      loginId,
      setIsIdCheckLoading,
      setIsIdChecked,
      setIsIdAvailable,
      setLoginIdError,
    );
  };

  // 닉네임 입력 핸들러
  // const handleNickNmChange = (text: string) => {
  //   handleNickNmChangeUtil(
  //     text,
  //     setCustNickNm,
  //     setIsNickNmChecked,
  //     setIsNickNmAvailable,
  //   );
  // };

  // 닉네임 중복 체크
  // const handleCheckDuplicateNickNm = async () => {
  //   await checkDuplicateNickNm(
  //     custNickNm,
  //     setIsNickNmCheckLoading,
  //     setIsNickNmChecked,
  //     setIsNickNmAvailable,
  //   );
  // };

  // 카운트다운 시작 (5분)
  const startCountdown = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdown(300);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          countdownRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 핸드폰번호 인증번호 전송
  const handlePhoneVerification = async () => {
    if (!phoneFirst || !phoneMiddle || !phoneLast) {
      Alert.alert("알림", "핸드폰번호를 입력해주세요.");
      return;
    }

    const phone = `${phoneFirst}${phoneMiddle}${phoneLast}`;
    setIsSmsLoading(true);

    try {
      const response = await apiPost("/cust/mms/send", { phone });

      if (response.ok) {
        setIsSmsSent(true);
        setVerificationCode("");
        startCountdown();
        Alert.alert("성공", "인증번호가 전송되었습니다.");
      } else {
        Alert.alert("실패", "인증번호 전송에 실패했습니다.");
      }
    } catch (error) {
      console.error("인증번호 전송 에러:", error);
      Alert.alert("오류", "인증번호 전송 중 오류가 발생했습니다.");
    } finally {
      setIsSmsLoading(false);
    }
  };

  // 인증번호 확인
  const handleVerifyCode = async () => {
    if (!verificationCode) {
      Alert.alert("알림", "인증번호를 입력해주세요.");
      return;
    }

    const phone = `${phoneFirst}${phoneMiddle}${phoneLast}`;
    setIsVerifyLoading(true);

    try {
      const response = await apiPost("/cust/mms/verify", { phone, code: verificationCode });

      if (response.ok) {
        setIsPhoneVerified(true);
        if (countdownRef.current) {
          clearInterval(countdownRef.current);
          countdownRef.current = null;
        }
        setCountdown(0);
        Alert.alert("성공", "본인 인증이 완료되었습니다.");
      } else {
        setIsPhoneVerified(false);
        Alert.alert("실패", "인증번호가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("인증번호 확인 에러:", error);
      Alert.alert("오류", "인증번호 확인 중 오류가 발생했습니다.");
    } finally {
      setIsVerifyLoading(false);
    }
  };

  const handleSignup = async () => {
    // 유효성 검사
    if (!validateEmail(emailLocal, emailDomain)) return;
    if (!validateLoginId(loginId, isIdChecked, isIdAvailable)) return;
    if (!validatePassword(password, passwordConfirm)) return;
    if (!validateName(custNm)) return;
    if (!validateResidentNumber(residentNumberFront, residentNumberBack))
      return;
    // if (!validateNickname(custNickNm, isNickNmChecked, isNickNmAvailable))
    //   return;
    if (
      !validatePhoneNumber(phoneFirst, phoneMiddle, phoneLast, isPhoneVerified)
    )
      return;

    setIsSignupLoading(true);

    try {
      const email = `${emailLocal}@${emailDomain}`;
      const custGender = selectedId === "1" ? "M" : "F";
      // 핸드폰번호 조합
      const telNoWithoutHyphen = `${phoneFirst}${phoneMiddle}${phoneLast}`;

      const fcmToken = isMarketingAgreed ? await permitCheck() : null;
      const pushSet = fcmToken !== null;

      const requestBody = {
        email,
        loginId,
        password,
        custNm,
        residentNumberFront,
        residentNumberBack,
        // custNickNm,
        custTelNo: telNoWithoutHyphen,
        custGender,
        custMarketAgreed: isMarketingAgreed,
        fcmToken,
        pushSet,
      };

      const response = await apiPost("/cust/signup", requestBody);

      if (response.ok) {
        setTimeout(() => {
          Alert.alert("성공", "회원가입이 완료되었습니다.", [
            {
              text: "확인",
              onPress: () => router.replace("/(auth)/login"),
            },
          ]);
        }, 300);
      } else {
        Alert.alert("실패", "회원가입에 실패했습니다.");
        setIsSignupLoading(false);
      }
    } catch (error) {
      console.error("회원가입 에러:", error);
      Alert.alert("오류", "회원가입 중 오류가 발생했습니다.");
      setIsSignupLoading(false);
    }
  };

  const radioButtons = [
    { id: "1", label: "남", value: "M" },
    { id: "2", label: "여", value: "F" },
  ];

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#FFFFFF" }} />
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
          <Text style={styles.title}>회원가입</Text>
        </View>
        <View style={styles.rightSection} />
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -insets.bottom}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.inputContainer}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          <View style={styles.viewMargin}>
            <Text style={styles.inputTitle}>아이디 *</Text>
            <View style={styles.inputComponent}>
              <TextInput
                style={styles.inputStyle}
                placeholder="아이디 입력"
                placeholderTextColor={"#ccc"}
                value={loginId}
                onChangeText={handleLoginIdChange}
              />
              <Pressable
                style={[
                  styles.pressableStyle,
                  (isIdCheckLoading || (isIdChecked && isIdAvailable)) &&
                    styles.buttonDisabled,
                ]}
                onPress={handleCheckDuplicateId}
                disabled={isIdCheckLoading || (isIdChecked && isIdAvailable)}
              >
                <Text style={styles.pressableTextStyle}>
                  {isIdCheckLoading
                    ? "확인중..."
                    : isIdChecked && isIdAvailable
                      ? "체크 완료"
                      : "중복 체크"}
                </Text>
              </Pressable>
            </View>
            {loginIdError ? (
              <Text style={styles.validationErrorText}>{loginIdError}</Text>
            ) : (
              <Text style={styles.descriptionStyle}>
                6자리 이상의 영문 또는 영문, 숫자 혼합
              </Text>
            )}
          </View>

          <View style={styles.viewMargin}>
            <Text style={styles.inputTitle}>비밀번호 *</Text>

            <View style={styles.inputComponent}>
              <TextInput
                style={styles.inputStyle}
                placeholder="비밀번호 입력"
                placeholderTextColor={"#ccc"}
                secureTextEntry
                value={password}
                onChangeText={handlePasswordChange}
              />
            </View>
            {passwordError ? (
              <Text style={styles.validationErrorText}>{passwordError}</Text>
            ) : (
              <Text style={styles.descriptionStyle}>
                8~16자 영문, 숫자, 특수문자를 사용하세요
              </Text>
            )}
          </View>

          <View style={styles.viewMargin}>
            <Text style={styles.inputTitle}>비밀번호확인 *</Text>

            <View style={styles.inputComponent}>
              <TextInput
                style={styles.inputStyle}
                placeholder="비밀번호 입력"
                placeholderTextColor={"#ccc"}
                secureTextEntry
                value={passwordConfirm}
                onChangeText={handlePasswordConfirmChange}
              />
            </View>
            {passwordConfirmError ? (
              <Text style={styles.validationErrorText}>{passwordConfirmError}</Text>
            ) : null}
          </View>

          <View style={styles.viewMargin}>
            <Text style={styles.inputTitle}>이름 *</Text>
            <View style={styles.inputComponent}>
              <TextInput
                style={styles.inputStyle}
                placeholder="이름 입력"
                placeholderTextColor={"#ccc"}
                value={custNm}
                onChangeText={(text) => setCustNm(text.replace(/[^가-힣\u1100-\u11FF\u3130-\u318Fa-zA-Z]/g, ""))}
              />
            </View>
          </View>

          <View style={styles.viewMargin}>
            <Text style={styles.inputTitle}>
              <Text>성별</Text>
            </Text>
            <RadioGroup
              radioButtons={radioButtons}
              onPress={setSelectedId}
              selectedId={selectedId}
              layout="row"
            />
          </View>

          <View style={styles.viewMargin}>
            <Text style={styles.inputTitle}>주민등록번호 *</Text>
            <View style={styles.inputComponent}>
              <TextInput
                style={styles.inputStyle}
                placeholder="주민등록번호 앞"
                placeholderTextColor={"#ccc"}
                keyboardType="numeric"
                maxLength={6}
                value={residentNumberFront}
                onChangeText={setResidentNumberFront}
              />
              <Text>-</Text>
              <TextInput
                style={styles.inputStyle}
                placeholder="주민등록번호 뒤"
                placeholderTextColor={"#ccc"}
                secureTextEntry
                keyboardType="numeric"
                maxLength={7}
                value={residentNumberBack}
                onChangeText={setResidentNumberBack}
              />
            </View>
          </View>

          {/** 닉네임 처리 막기
          <View style={styles.viewMargin}>
            <Text style={styles.inputTitle}>닉네임 *</Text>
            <View style={styles.inputComponent}>
              <TextInput
                style={styles.inputStyle}
                placeholder="닉네임 입력"
                placeholderTextColor={"#ccc"}
                value={custNickNm}
                onChangeText={handleNickNmChange}
              />
              <Pressable
                style={[
                  styles.pressableStyle,
                  (isNickNmCheckLoading ||
                    (isNickNmChecked && isNickNmAvailable)) &&
                    styles.buttonDisabled,
                ]}
                onPress={handleCheckDuplicateNickNm}
                disabled={
                  isNickNmCheckLoading || (isNickNmChecked && isNickNmAvailable)
                }
              >
                <Text style={styles.pressableTextStyle}>
                  {isNickNmCheckLoading
                    ? "확인중..."
                    : isNickNmChecked && isNickNmAvailable
                      ? "체크 완료"
                      : "중복 체크"}
                </Text>
              </Pressable>
            </View>
          </View>
         */}

          <View style={styles.viewMargin}>
            <Text style={styles.inputTitle}>이메일 *</Text>
            <View style={styles.inputComponent}>
              <TextInput
                style={styles.inputStyle}
                placeholder="example123"
                placeholderTextColor={"#ccc"}
                value={emailLocal}
                onChangeText={(text) => setEmailLocal(text.replace(/\s/g, ""))}
              />
              <Text>@</Text>
              <TextInput
                style={[
                  styles.inputStyle,
                  selectedEmailDomain !== "direct" &&
                    styles.emailDomainDisabled,
                ]}
                placeholder="example.com"
                placeholderTextColor={"#ccc"}
                value={emailDomain}
                onChangeText={handleEmailDomainDirectInputHandler}
                editable={selectedEmailDomain === "direct"}
              />
            </View>
            {Platform.OS === "ios" ? (
              <>
                <Pressable
                  style={styles.pickerButton}
                  onPress={() => setShowEmailDomainPicker(true)}
                >
                  <Text style={styles.pickerButtonText}>
                    {selectedEmailDomain === "direct"
                      ? "직접 입력"
                      : selectedEmailDomain === "naver.com"
                        ? "네이버"
                        : selectedEmailDomain === "gmail.com"
                          ? "지메일"
                          : selectedEmailDomain === "daum.net"
                            ? "다음"
                            : selectedEmailDomain === "kakao.com"
                              ? "카카오"
                              : selectedEmailDomain === "nate.com"
                                ? "네이트"
                                : "한메일"}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#666" />
                </Pressable>

                <Modal
                  visible={showEmailDomainPicker}
                  transparent={true}
                  animationType="slide"
                  onRequestClose={() => setShowEmailDomainPicker(false)}
                >
                  <View style={styles.modalOverlay}>
                    <Pressable
                      style={styles.modalBackdrop}
                      onPress={() => setShowEmailDomainPicker(false)}
                    />
                    <View style={styles.modalContent}>
                      <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>이메일 선택</Text>
                        <TouchableOpacity
                          onPress={() => setShowEmailDomainPicker(false)}
                        >
                          <Text style={styles.modalDoneButton}>완료</Text>
                        </TouchableOpacity>
                      </View>
                      <Picker
                        selectedValue={selectedEmailDomain}
                        onValueChange={(domain) => {
                          handleEmailDomainSelectUtil(
                            domain,
                            setSelectedEmailDomain,
                            setEmailDomain,
                          );
                        }}
                        style={styles.iosModalPicker}
                        itemStyle={styles.pickerItem}
                      >
                        <Picker.Item label="직접 입력" value="direct" />
                        <Picker.Item label="네이버" value="naver.com" />
                        <Picker.Item label="지메일" value="gmail.com" />
                        <Picker.Item label="다음" value="daum.net" />
                        <Picker.Item label="카카오" value="kakao.com" />
                        <Picker.Item label="네이트" value="nate.com" />
                        <Picker.Item label="한메일" value="hanmail.net" />
                      </Picker>
                    </View>
                  </View>
                </Modal>
              </>
            ) : (
              <>
                <Pressable
                  style={styles.pickerButton}
                  onPress={() => setShowEmailDomainPicker(true)}
                >
                  <Text style={styles.pickerButtonText}>
                    {selectedEmailDomain === "direct"
                      ? "직접 입력"
                      : selectedEmailDomain === "naver.com"
                        ? "네이버"
                        : selectedEmailDomain === "gmail.com"
                          ? "지메일"
                          : selectedEmailDomain === "daum.net"
                            ? "다음"
                            : selectedEmailDomain === "kakao.com"
                              ? "카카오"
                              : selectedEmailDomain === "nate.com"
                                ? "네이트"
                                : "한메일"}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#666" />
                </Pressable>

                <Modal
                  visible={showEmailDomainPicker}
                  transparent={true}
                  animationType="slide"
                  onRequestClose={() => setShowEmailDomainPicker(false)}
                >
                  <View style={styles.modalOverlay}>
                    <Pressable
                      style={styles.modalBackdrop}
                      onPress={() => setShowEmailDomainPicker(false)}
                    />
                    <View style={[styles.modalContent, { paddingBottom: Math.max(20, insets.bottom + 8) }]}>
                      <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>이메일 선택</Text>
                        <TouchableOpacity
                          onPress={() => setShowEmailDomainPicker(false)}
                        >
                          <Text style={styles.modalDoneButton}>완료</Text>
                        </TouchableOpacity>
                      </View>
                      {[
                        { label: "직접 입력", value: "direct" },
                        { label: "네이버", value: "naver.com" },
                        { label: "지메일", value: "gmail.com" },
                        { label: "다음", value: "daum.net" },
                        { label: "카카오", value: "kakao.com" },
                        { label: "네이트", value: "nate.com" },
                        { label: "한메일", value: "hanmail.net" },
                      ].map((item) => (
                        <TouchableOpacity
                          key={item.value}
                          style={[
                            styles.androidPickerItem,
                            selectedEmailDomain === item.value &&
                              styles.androidPickerItemSelected,
                          ]}
                          onPress={() => {
                            handleEmailDomainSelectUtil(
                              item.value,
                              setSelectedEmailDomain,
                              setEmailDomain,
                            );
                            setShowEmailDomainPicker(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.androidPickerItemText,
                              selectedEmailDomain === item.value &&
                                styles.androidPickerItemTextSelected,
                            ]}
                          >
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </Modal>
              </>
            )}
            {selectedEmailDomain === "direct" && emailDomainError ? (
              <Text style={styles.validationErrorText}>{emailDomainError}</Text>
            ) : null}
          </View>

          <View style={styles.viewMargin}>
            <Text style={styles.inputTitle}>핸드폰번호 *</Text>
            <View style={styles.inputComponent}>
              <TextInput
                style={styles.inputStyle}
                placeholder="010"
                placeholderTextColor={"#ccc"}
                keyboardType="numeric"
                value={phoneFirst}
                onChangeText={(text) => {
                  handlePhoneFirstChangeUtil(
                    text,
                    setPhoneFirst,
                    setIsPhoneVerified,
                    phoneMiddleRef,
                  );
                  setIsSmsSent(false);
                  setVerificationCode("");
                  if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null; }
                  setCountdown(0);
                }}
                maxLength={3}
              />
              <Text>-</Text>
              <TextInput
                ref={phoneMiddleRef}
                style={styles.inputStyle}
                placeholder="1234"
                placeholderTextColor={"#ccc"}
                keyboardType="numeric"
                value={phoneMiddle}
                onChangeText={(text) => {
                  handlePhoneMiddleChangeUtil(
                    text,
                    setPhoneMiddle,
                    setIsPhoneVerified,
                    phoneLastRef,
                  );
                  setIsSmsSent(false);
                  setVerificationCode("");
                  if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null; }
                  setCountdown(0);
                }}
                maxLength={4}
              />
              <Text>-</Text>
              <TextInput
                ref={phoneLastRef}
                style={styles.inputStyle}
                placeholder="5678"
                placeholderTextColor={"#ccc"}
                keyboardType="numeric"
                value={phoneLast}
                onChangeText={(text) => {
                  handlePhoneLastChangeUtil(
                    text,
                    setPhoneLast,
                    setIsPhoneVerified,
                  );
                  setIsSmsSent(false);
                  setVerificationCode("");
                  if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null; }
                  setCountdown(0);
                }}
                maxLength={4}
              />
            </View>
            {!isPhoneVerified && (
              <Pressable
                style={[styles.sendCodeButton, isSmsLoading && styles.buttonDisabled]}
                onPress={handlePhoneVerification}
                disabled={isSmsLoading}
              >
                <Text style={styles.sendCodeButtonText}>
                  {isSmsLoading ? "전송 중..." : isSmsSent ? "재전송" : "인증번호 전송"}
                </Text>
              </Pressable>
            )}
            {isSmsSent && (
              <>
                <View style={styles.verifyCodeRow}>
                  <TextInput
                    style={styles.verifyCodeInput}
                    placeholder="인증번호 입력"
                    placeholderTextColor={"#ccc"}
                    keyboardType="numeric"
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    maxLength={6}
                    editable={!isPhoneVerified}
                  />
                  <Pressable
                    style={[
                      styles.verifyCodeButton,
                      (isVerifyLoading || isPhoneVerified) && styles.buttonDisabled,
                    ]}
                    onPress={handleVerifyCode}
                    disabled={isVerifyLoading || isPhoneVerified}
                  >
                    <Text style={styles.verifyCodeButtonText}>
                      {isPhoneVerified ? "인증완료" : isVerifyLoading ? "확인 중..." : "확인"}
                    </Text>
                  </Pressable>
                </View>
                {!isPhoneVerified && countdown > 0 && (
                  <Text style={styles.countdownText}>
                    {`${String(Math.floor(countdown / 60)).padStart(2, "0")}:${String(countdown % 60).padStart(2, "0")} 내에 입력해주세요`}
                  </Text>
                )}
                {!isPhoneVerified && countdown === 0 && (
                  <Text style={[styles.countdownText, styles.countdownExpired]}>
                    인증 시간이 만료되었습니다. 재전송해주세요.
                  </Text>
                )}
              </>
            )}
          </View>

          <View style={styles.viewMargin}>
            <Pressable
              style={[
                styles.registButton,
                isSignupLoading && styles.buttonDisabled,
              ]}
              onPress={handleSignup}
              disabled={isSignupLoading}
            >
              <Text style={styles.registButtonText}>
                {isSignupLoading ? "처리중..." : "회원가입"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
