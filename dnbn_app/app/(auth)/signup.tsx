import { apiPost } from "@/utils/api";
import {
  checkDuplicateId,
  checkDuplicateNickNm,
  handleEmailDomainSelect as handleEmailDomainSelectUtil,
  handleLoginIdChange as handleLoginIdChangeUtil,
  handleNickNmChange as handleNickNmChangeUtil,
  handlePhoneFirstChange as handlePhoneFirstChangeUtil,
  handlePhoneLastChange as handlePhoneLastChangeUtil,
  handlePhoneMiddleChange as handlePhoneMiddleChangeUtil,
  validateEmail,
  validateLoginId,
  validateName,
  validateNickname,
  validatePassword,
  validatePhoneNumber,
  validateResidentNumber,
  verifyPhoneNumber,
} from "@/utils/signupUtil";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
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
  const [custNickNm, setCustNickNm] = useState("");
  const [isNickNmChecked, setIsNickNmChecked] = useState(false);
  const [isNickNmAvailable, setIsNickNmAvailable] = useState(false);
  const [phoneFirst, setPhoneFirst] = useState("");
  const [phoneMiddle, setPhoneMiddle] = useState("");
  const [phoneLast, setPhoneLast] = useState("");
  const phoneMiddleRef = useRef<TextInput>(null);
  const phoneLastRef = useRef<TextInput>(null);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [isIdCheckLoading, setIsIdCheckLoading] = useState(false);
  const [isNickNmCheckLoading, setIsNickNmCheckLoading] = useState(false);

  useEffect(() => {
    // 약관 페이지에서 전달받은 마케팅 동의 상태 설정
    if (marketingAgreed === "true") {
      setIsMarketingAgreed(true);
    }
  }, [marketingAgreed]);

  // 아이디 입력 핸들러
  const handleLoginIdChange = (text: string) => {
    handleLoginIdChangeUtil(text, setLoginId, setIsIdChecked, setIsIdAvailable);
  };

  // 아이디 중복 체크
  const handleCheckDuplicateId = async () => {
    await checkDuplicateId(
      loginId,
      setIsIdCheckLoading,
      setIsIdChecked,
      setIsIdAvailable,
    );
  };

  // 닉네임 입력 핸들러
  const handleNickNmChange = (text: string) => {
    handleNickNmChangeUtil(
      text,
      setCustNickNm,
      setIsNickNmChecked,
      setIsNickNmAvailable,
    );
  };

  // 닉네임 중복 체크
  const handleCheckDuplicateNickNm = async () => {
    await checkDuplicateNickNm(
      custNickNm,
      setIsNickNmCheckLoading,
      setIsNickNmChecked,
      setIsNickNmAvailable,
    );
  };

  // 핸드폰번호 본인 인증
  const handlePhoneVerification = async () => {
    await verifyPhoneNumber(
      phoneFirst,
      phoneMiddle,
      phoneLast,
      setIsPhoneVerified,
    );
  };

  const handleSignup = async () => {
    // 유효성 검사
    if (!validateEmail(emailLocal, emailDomain)) return;
    if (!validateLoginId(loginId, isIdChecked, isIdAvailable)) return;
    if (!validatePassword(password, passwordConfirm)) return;
    if (!validateName(custNm)) return;
    if (!validateResidentNumber(residentNumberFront, residentNumberBack))
      return;
    if (!validateNickname(custNickNm, isNickNmChecked, isNickNmAvailable))
      return;
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

      const requestBody = {
        email,
        loginId,
        password,
        custNm,
        residentNumberFront,
        residentNumberBack,
        custNickNm,
        custTelNo: telNoWithoutHyphen,
        custGender,
        custMarketAgreed: isMarketingAgreed,
      };

      const response = await apiPost("/cust/signup", requestBody);

      if (response.ok) {
        Alert.alert("성공", "회원가입이 완료되었습니다.", [
          {
            text: "확인",
            onPress: () => router.replace("/(auth)/login"),
          },
        ]);
      } else {
        const errorData = await response.json();
        Alert.alert("실패", errorData.message || "회원가입에 실패했습니다.");
        setIsSignupLoading(false);
      }
    } catch (error) {
      console.error("회원가입 에러:", error);
      Alert.alert("오류", "회원가입 중 오류가 발생했습니다.");
      setIsSignupLoading(false);
    }
  };

  const radioButtons = [
    { id: "1", label: "남", value: "male" },
    { id: "2", label: "여", value: "female" },
  ];

  return (
    <View style={styles.container}>
      {insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: "#FFFFFF" }} />
      )}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>동네방네에 오신 것을 환영합니다.</Text>
        <View style={styles.placeholder} />
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={-insets.bottom}
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
            <Text style={styles.descriptionStyle}>
              6자리 이상의 영문 또는 영문, 숫자 혼합
            </Text>
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
                onChangeText={(text) => setPassword(text.replace(/\s/g, ""))}
              />
            </View>
            <Text style={styles.descriptionStyle}>
              8자이상 16자 미만으로 입력
            </Text>
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
                onChangeText={(text) =>
                  setPasswordConfirm(text.replace(/\s/g, ""))
                }
              />
            </View>
          </View>

          <View style={styles.viewMargin}>
            <Text style={styles.inputTitle}>이름 *</Text>
            <View style={styles.inputComponent}>
              <TextInput
                style={styles.inputStyle}
                placeholder="이름 입력"
                placeholderTextColor={"#ccc"}
                value={custNm}
                onChangeText={(text) => setCustNm(text.replace(/\s/g, ""))}
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
                onChangeText={(text) => setEmailDomain(text.replace(/\s/g, ""))}
                editable={selectedEmailDomain === "direct"}
              />
            </View>
            <View style={styles.pickerContainer}>
              <Picker
                style={styles.picker}
                itemStyle={styles.pickerItem}
                selectedValue={selectedEmailDomain}
                onValueChange={(domain) =>
                  handleEmailDomainSelectUtil(
                    domain,
                    setSelectedEmailDomain,
                    setEmailDomain,
                  )
                }
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

          <View style={styles.viewMargin}>
            <Text style={styles.inputTitle}>핸드폰번호 *</Text>
            <View style={styles.inputComponent}>
              <TextInput
                style={styles.inputStyle}
                placeholder="010"
                placeholderTextColor={"#ccc"}
                keyboardType="numeric"
                value={phoneFirst}
                onChangeText={(text) =>
                  handlePhoneFirstChangeUtil(
                    text,
                    setPhoneFirst,
                    setIsPhoneVerified,
                    phoneMiddleRef,
                  )
                }
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
                onChangeText={(text) =>
                  handlePhoneMiddleChangeUtil(
                    text,
                    setPhoneMiddle,
                    setIsPhoneVerified,
                    phoneLastRef,
                  )
                }
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
                onChangeText={(text) =>
                  handlePhoneLastChangeUtil(
                    text,
                    setPhoneLast,
                    setIsPhoneVerified,
                  )
                }
                maxLength={4}
              />
              <Pressable
                style={styles.pressableStyle}
                onPress={handlePhoneVerification}
              >
                <Text style={styles.pressableTextStyle}>본인 인증</Text>
              </Pressable>
            </View>
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
