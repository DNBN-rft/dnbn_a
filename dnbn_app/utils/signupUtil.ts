import { Alert } from "react-native";
import { apiGet } from "./api";

/**
 * 이메일 유효성 검사
 */
export const validateEmail = (
  emailLocal: string,
  emailDomain: string,
): boolean => {
  if (!emailLocal || !emailDomain) {
    Alert.alert("알림", "이메일을 입력해주세요.");
    return false;
  }
  return true;
};

/**
 * 아이디 유효성 검사
 */
export const validateLoginId = (
  loginId: string,
  isIdChecked: boolean,
  isIdAvailable: boolean,
): boolean => {
  if (!loginId) {
    Alert.alert("알림", "아이디를 입력해주세요.");
    return false;
  }
  if (!isIdChecked || !isIdAvailable) {
    Alert.alert("알림", "아이디 중복 체크를 해주세요.");
    return false;
  }
  return true;
};

/**
 * 비밀번호 유효성 검사
 * 정규식: 8~16자 영문 대 소문자, 숫자, 특수문자를 사용
 */
export const validatePassword = (
  password: string,
  passwordConfirm: string,
): boolean => {
  if (!password) {
    Alert.alert("알림", "비밀번호를 입력해주세요.");
    return false;
  }

  // 백엔드와 동일한 정규식 패턴: 8~16자, 영문, 숫자, 특수문자 포함, 공백 없음
  const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\W)(?=\S+$).{8,16}$/;
  if (!passwordRegex.test(password)) {
    Alert.alert("알림", "비밀번호는 8~16자 영문, 숫자, 특수문자를 사용하세요.");
    return false;
  }

  if (password !== passwordConfirm) {
    Alert.alert("알림", "비밀번호가 일치하지 않습니다.");
    return false;
  }
  return true;
};

/**
 * 이름 유효성 검사
 */
export const validateName = (custNm: string): boolean => {
  if (!custNm) {
    Alert.alert("알림", "이름을 입력해주세요.");
    return false;
  }
  return true;
};

/**
 * 주민등록번호 유효성 검사
 */
export const validateResidentNumber = (
  front: string,
  back: string,
): boolean => {
  if (!front || !back) {
    Alert.alert("알림", "주민등록번호를 입력해주세요.");
    return false;
  }
  return true;
};

/**
 * 닉네임 유효성 검사
 */
export const validateNickname = (
  custNickNm: string,
  isNickNmChecked: boolean,
  isNickNmAvailable: boolean,
): boolean => {
  if (!custNickNm) {
    Alert.alert("알림", "닉네임을 입력해주세요.");
    return false;
  }
  if (!isNickNmChecked || !isNickNmAvailable) {
    Alert.alert("알림", "닉네임 중복 체크를 해주세요.");
    return false;
  }
  return true;
};

/**
 * 핸드폰번호 유효성 검사
 */
export const validatePhoneNumber = (
  phoneFirst: string,
  phoneMiddle: string,
  phoneLast: string,
  isPhoneVerified: boolean,
): boolean => {
  if (!phoneFirst || !phoneMiddle || !phoneLast) {
    Alert.alert("알림", "핸드폰번호를 입력해주세요.");
    return false;
  }
  if (!isPhoneVerified) {
    Alert.alert("알림", "핸드폰번호 본인 인증을 해주세요.");
    return false;
  }
  return true;
};

/**
 * 이메일 도메인 선택 핸들러
 */
export const handleEmailDomainSelect = (
  domain: string,
  setSelectedEmailDomain: (domain: string) => void,
  setEmailDomain: (domain: string) => void,
) => {
  setSelectedEmailDomain(domain);
  if (domain !== "direct") {
    setEmailDomain(domain);
  } else {
    setEmailDomain("");
  }
};

/**
 * 핸드폰번호 첫 번째 칸 입력 핸들러
 */
export const handlePhoneFirstChange = (
  text: string,
  setPhoneFirst: (value: string) => void,
  setIsPhoneVerified: (value: boolean) => void,
  phoneMiddleRef: React.RefObject<any>,
) => {
  const numbers = text.replace(/[^0-9]/g, "");
  setPhoneFirst(numbers.slice(0, 3));
  setIsPhoneVerified(false);
  if (numbers.length === 3) {
    phoneMiddleRef.current?.focus();
  }
};

/**
 * 핸드폰번호 두 번째 칸 입력 핸들러
 */
export const handlePhoneMiddleChange = (
  text: string,
  setPhoneMiddle: (value: string) => void,
  setIsPhoneVerified: (value: boolean) => void,
  phoneLastRef: React.RefObject<any>,
) => {
  const numbers = text.replace(/[^0-9]/g, "");
  setPhoneMiddle(numbers.slice(0, 4));
  setIsPhoneVerified(false);
  if (numbers.length === 4) {
    phoneLastRef.current?.focus();
  }
};

/**
 * 핸드폰번호 세 번째 칸 입력 핸들러
 */
export const handlePhoneLastChange = (
  text: string,
  setPhoneLast: (value: string) => void,
  setIsPhoneVerified: (value: boolean) => void,
) => {
  const numbers = text.replace(/[^0-9]/g, "");
  setPhoneLast(numbers.slice(0, 4));
  setIsPhoneVerified(false);
};

/**
 * 아이디 입력 핸들러
 */
export const handleLoginIdChange = (
  text: string,
  setLoginId: (value: string) => void,
  setIsIdChecked: (value: boolean) => void,
  setIsIdAvailable: (value: boolean) => void,
) => {
  const trimmedText = text.replace(/\s/g, "");
  setLoginId(trimmedText);
  setIsIdChecked(false);
  setIsIdAvailable(false);
};

/**
 * 닉네임 입력 핸들러
 */
export const handleNickNmChange = (
  text: string,
  setCustNickNm: (value: string) => void,
  setIsNickNmChecked: (value: boolean) => void,
  setIsNickNmAvailable: (value: boolean) => void,
) => {
  const trimmedText = text.replace(/\s/g, "");
  setCustNickNm(trimmedText);
  setIsNickNmChecked(false);
  setIsNickNmAvailable(false);
};

/**
 * 아이디 중복 체크
 */
export const checkDuplicateId = async (
  loginId: string,
  setIsIdCheckLoading: (value: boolean) => void,
  setIsIdChecked: (value: boolean) => void,
  setIsIdAvailable: (value: boolean) => void,
) => {
  if (!loginId.trim()) {
    Alert.alert("알림", "아이디를 입력해주세요.");
    return;
  }

  setIsIdCheckLoading(true);

  try {
    const response = await apiGet(`/cust/check-loginId/${loginId}`);

    if (response.ok) {
      if (response.ok) {
        setIsIdChecked(true);
        setIsIdAvailable(true);
        Alert.alert("성공", "사용가능한 아이디입니다.");
      } else {
        setIsIdChecked(true);
        setIsIdAvailable(false);
        Alert.alert("알림", "이미 존재하는 아이디입니다.");
      }
    } else {
      Alert.alert("오류", "중복 체크에 실패했습니다.");
    }
  } catch (error) {
    console.error("아이디 중복 체크 에러:", error);
    Alert.alert("오류", "중복 체크 중 오류가 발생했습니다.");
  } finally {
    setIsIdCheckLoading(false);
  }
};

/**
 * 닉네임 중복 체크
 */
export const checkDuplicateNickNm = async (
  custNickNm: string,
  setIsNickNmCheckLoading: (value: boolean) => void,
  setIsNickNmChecked: (value: boolean) => void,
  setIsNickNmAvailable: (value: boolean) => void,
) => {
  if (!custNickNm.trim()) {
    Alert.alert("알림", "닉네임을 입력해주세요.");
    return;
  }

  setIsNickNmCheckLoading(true);

  try {
    const response = await apiGet(`/cust/check-nickname/${custNickNm}`);

    if (response.ok) {
      if (response.ok) {
        setIsNickNmChecked(true);
        setIsNickNmAvailable(true);
        Alert.alert("성공", "사용가능한 닉네임입니다.");
      } else {
        setIsNickNmChecked(true);
        setIsNickNmAvailable(false);
        Alert.alert("알림", "이미 존재하는 닉네임입니다.");
      }
    } else {
      Alert.alert("오류", "중복 체크에 실패했습니다.");
    }
  } catch (error) {
    console.error("닉네임 중복 체크 에러:", error);
    Alert.alert("오류", "중복 체크 중 오류가 발생했습니다.");
  } finally {
    setIsNickNmCheckLoading(false);
  }
};

/**
 * 핸드폰번호 본인 인증
 */
export const verifyPhoneNumber = async (
  phoneFirst: string,
  phoneMiddle: string,
  phoneLast: string,
  setIsPhoneVerified: (value: boolean) => void,
) => {
  if (!phoneFirst || !phoneMiddle || !phoneLast) {
    Alert.alert("알림", "핸드폰번호를 입력해주세요.");
    return;
  }

  // TODO: 실제 API 연동 시 여기서 인증 요청
  // 임시로 true로 설정
  setIsPhoneVerified(true);
  Alert.alert("성공", "본인 인증이 완료되었습니다.");
};
