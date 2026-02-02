import { apiGet, apiPost } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
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
  const [custTelNo, setCustTelNo] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  useEffect(() => {
    // 약관 페이지에서 전달받은 마케팅 동의 상태 설정
    if (marketingAgreed === "true") {
      setIsMarketingAgreed(true);
    }
  }, [marketingAgreed]);

  // 전화번호 포맷팅 함수
  const formatPhoneNumber = (text: string) => {
    // 숫자만 추출
    const numbers = text.replace(/[^0-9]/g, "");

    // 최대 11자리까지만
    const limitedNumbers = numbers.slice(0, 11);

    // 포맷팅
    if (limitedNumbers.length <= 3) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 7) {
      return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3)}`;
    } else {
      return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3, 7)}-${limitedNumbers.slice(7)}`;
    }
  };

  // 전화번호 입력 핸들러
  const handlePhoneNumberChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setCustTelNo(formatted);
    setIsPhoneVerified(false); // 전화번호 변경 시 인증 상태 초기화
  };

  // 아이디 입력 핸들러 (아이디 변경 시 중복 체크 상태 초기화)
  const handleLoginIdChange = (text: string) => {
    const trimmedText = text.replace(/\s/g, ""); // 모든 공백 제거
    setLoginId(trimmedText);
    setIsIdChecked(false);
    setIsIdAvailable(false);
  };

  // 아이디 중복 체크
  const handleCheckDuplicateId = async () => {
    if (!loginId.trim()) {
      Alert.alert("알림", "아이디를 입력해주세요.");
      return;
    }

    try {
      const response = await apiGet(`/cust/check-loginId/${loginId}`);

      if (response.ok) {
        const message = await response.text();

        if (message === "사용가능한 아이디입니다.") {
          setIsIdChecked(true);
          setIsIdAvailable(true);
          Alert.alert("성공", message);
        } else {
          setIsIdChecked(true);
          setIsIdAvailable(false);
          Alert.alert("알림", message);
        }
      } else {
        Alert.alert("오류", "중복 체크에 실패했습니다.");
      }
    } catch (error) {
      console.error("아이디 중복 체크 에러:", error);
      Alert.alert("오류", "중복 체크 중 오류가 발생했습니다.");
    }
  };

  // 닉네임 입력 핸들러 (닉네임 변경 시 중복 체크 상태 초기화)
  const handleNickNmChange = (text: string) => {
    const trimmedText = text.replace(/\s/g, ""); // 모든 공백 제거
    setCustNickNm(trimmedText);
    setIsNickNmChecked(false);
    setIsNickNmAvailable(false);
  };

  // 닉네임 중복 체크
  const handleCheckDuplicateNickNm = async () => {
    if (!custNickNm.trim()) {
      Alert.alert("알림", "닉네임을 입력해주세요.");
      return;
    }

    try {
      const response = await apiGet(`/cust/check-nickname/${custNickNm}`);

      if (response.ok) {
        const message = await response.text();

        if (message === "사용가능한 닉네임입니다.") {
          setIsNickNmChecked(true);
          setIsNickNmAvailable(true);
          Alert.alert("성공", message);
        } else {
          setIsNickNmChecked(true);
          setIsNickNmAvailable(false);
          Alert.alert("알림", message);
        }
      } else {
        Alert.alert("오류", "중복 체크에 실패했습니다.");
      }
    } catch (error) {
      console.error("닉네임 중복 체크 에러:", error);
      Alert.alert("오류", "중복 체크 중 오류가 발생했습니다.");
    }
  };

  // 전화번호 본인 인증
  const handlePhoneVerification = async () => {
    if (!custTelNo.trim()) {
      Alert.alert("알림", "전화번호를 입력해주세요.");
      return;
    }

    // TODO: 실제 API 연동 시 여기서 인증 요청
    // 임시로 true로 설정
    setIsPhoneVerified(true);
    Alert.alert("성공", "본인 인증이 완료되었습니다.");
  };

  const handleSignup = async () => {
    // 유효성 검사
    if (!emailLocal || !emailDomain) {
      Alert.alert("알림", "이메일을 입력해주세요.");
      return;
    }
    if (!loginId) {
      Alert.alert("알림", "아이디를 입력해주세요.");
      return;
    }
    if (!isIdChecked || !isIdAvailable) {
      Alert.alert("알림", "아이디 중복 체크를 해주세요.");
      return;
    }
    if (!password) {
      Alert.alert("알림", "비밀번호를 입력해주세요.");
      return;
    }
    if (password !== passwordConfirm) {
      Alert.alert("알림", "비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!custNm) {
      Alert.alert("알림", "이름을 입력해주세요.");
      return;
    }
    if (!residentNumberFront || !residentNumberBack) {
      Alert.alert("알림", "주민등록번호를 입력해주세요.");
      return;
    }
    if (!custNickNm) {
      Alert.alert("알림", "닉네임을 입력해주세요.");
      return;
    }
    if (!isNickNmChecked || !isNickNmAvailable) {
      Alert.alert("알림", "닉네임 중복 체크를 해주세요.");
      return;
    }
    if (!custTelNo) {
      Alert.alert("알림", "전화번호를 입력해주세요.");
      return;
    }
    if (!isPhoneVerified) {
      Alert.alert("알림", "전화번호 본인 인증을 해주세요.");
      return;
    }

    try {
      const email = `${emailLocal}@${emailDomain}`;
      const custGender = selectedId === "1" ? "M" : "F";
      // 전화번호에서 하이픈 제거
      const telNoWithoutHyphen = custTelNo.replace(/-/g, "");

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
            onPress: () => router.push("/(auth)/login"),
          },
        ]);
      } else {
        const errorData = await response.json();
        Alert.alert("실패", errorData.message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원가입 에러:", error);
      Alert.alert("오류", "회원가입 중 오류가 발생했습니다.");
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.inputContainer}
      >
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
              style={styles.inputStyle}
              placeholder="example.com"
              placeholderTextColor={"#ccc"}
              value={emailDomain}
              onChangeText={(text) => setEmailDomain(text.replace(/\s/g, ""))}
            />
          </View>
        </View>

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
              style={styles.pressableStyle}
              onPress={handleCheckDuplicateId}
            >
              <Text style={styles.pressableTextStyle}>중복 체크</Text>
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
              style={styles.pressableStyle}
              onPress={handleCheckDuplicateNickNm}
            >
              <Text style={styles.pressableTextStyle}>중복 체크</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.viewMargin}>
          <Text style={styles.inputTitle}>전화번호 *</Text>
          <View style={styles.inputComponent}>
            <TextInput
              style={styles.inputStyle}
              placeholder="010-1234-5678"
              placeholderTextColor={"#ccc"}
              keyboardType="numeric"
              value={custTelNo}
              onChangeText={handlePhoneNumberChange}
              maxLength={13}
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
          <Pressable style={styles.registButton} onPress={handleSignup}>
            <Text style={styles.registButtonText}>회원가입</Text>
          </Pressable>
        </View>
      </ScrollView>
      {insets.bottom > 0 && (
        <View style={{ height: insets.bottom, backgroundColor: "#000" }} />
      )}
    </View>
  );
}
